/* Conversa AI hosted demo bridge. Routes /api/* calls and the live event stream to the in-browser backend (shared worker). */
(function () {
  if (window.__conversaBridge) return; window.__conversaBridge = true;
  var port, seq = 0, pending = {}, streams = {};
  function connect() {
    try { var w = new SharedWorker('/demo-worker.js', { name: 'conversa-demo' }); port = w.port; port.start(); }
    catch (e) { port = new Worker('/demo-worker.js'); }
    port.onmessage = function (e) {
      var m = e.data, p;
      if (m.t === 'res' && (p = pending[m.id])) { delete pending[m.id]; p(m); }
      else if (m.t === 'sse-data' && (p = streams[m.id])) p.data(m.data);
      else if (m.t === 'sse-error' && (p = streams[m.id])) p.error(m.status);
      else if (m.t === 'sse-open' && (p = streams[m.id])) p.open();
    };
  }
  connect();
  function call(msg) { return new Promise(function (res) { var id = ++seq; msg.id = id; msg.origin = location.origin; msg.host = location.host; pending[id] = res; port.postMessage(msg); }); }
  var realFetch = window.fetch.bind(window);
  window.fetch = function (input, init) {
    var url = new URL(typeof input === 'string' ? input : input.url || String(input), location.href);
    if (url.origin !== location.origin || url.pathname.indexOf('/api/') !== 0) return realFetch(input, init);
    init = init || {}; var headers = {};
    new Headers(init.headers || (typeof input === 'object' && input.headers) || {}).forEach(function (v, k) { headers[k] = v; });
    return call({ t: 'req', method: String(init.method || (typeof input === 'object' && input.method) || 'GET').toUpperCase(), url: url.pathname + url.search, headers: headers, body: typeof init.body === 'string' ? init.body : undefined })
      .then(function (r) { return new Response(r.status === 204 || r.status === 304 ? null : r.body, { status: r.status, headers: r.headers }); });
  };
  var RealES = window.EventSource;
  function FakeES(u) {
    var url = new URL(u, location.href);
    if (url.origin !== location.origin || url.pathname !== '/api/events') return new RealES(u);
    var self = this, id = ++seq, ls = {}; this.readyState = 0; this.url = String(u);
    streams[id] = {
      open: function () { self.readyState = 1; self.onopen && self.onopen({}); },
      data: function (chunk) { chunk.split('\n\n').forEach(function (f) { var m = /^data: (.*)$/m.exec(f); if (!m) return; var ev = { data: m[1] }; self.onmessage && self.onmessage(ev); (ls.message || []).forEach(function (fn) { fn(ev); }); }); },
      error: function () { self.readyState = 2; self.onerror && self.onerror({}); }
    };
    this.close = function () { self.readyState = 2; delete streams[id]; port.postMessage({ t: 'sse-close', id: id }); };
    this.addEventListener = function (t, fn) { (ls[t] = ls[t] || []).push(fn); };
    this.removeEventListener = function () {};
    port.postMessage({ t: 'sse', id: id, url: url.pathname + url.search, headers: {}, origin: location.origin, host: location.host });
  }
  window.EventSource = FakeES;
  window.ConversaDemo = { reset: function () { return call({ t: 'reset' }); } };
})();
