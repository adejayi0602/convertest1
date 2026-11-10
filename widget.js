/*! Conversa AI website widget — embed with:
 *  <script src="https://YOUR-HOST/widget.js" data-key="pk_..." async></script>  */
(function () {
  var s = document.currentScript || document.querySelector('script[data-key][src*="widget.js"]');
  if (!s || window.__conversa) return; window.__conversa = true;
  var KEY = s.getAttribute('data-key'), BASE = new URL(s.src).origin;
  var LS = 'conversa_vid_' + KEY, vid; try { vid = localStorage.getItem(LS); if (!vid) { vid = 'vis_' + Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem(LS, vid); } } catch (e) { vid = 'vis_' + Math.random().toString(36).slice(2); }
  var cfg, convId = null, seen = {}, last = 0, openState = false, poll, unread = 0, started = false, proactiveShown = false, ended = false, localFb = null, rtKey = '', endNoted = false, commentSent = false;
  var host = document.createElement('div'); host.setAttribute('data-conversa', ''); document.body.appendChild(host);
  var root = host.attachShadow({ mode: 'open' });
  function api(path, opt) { return fetch(BASE + path, Object.assign({ headers: { 'content-type': 'application/json' } }, opt)).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }); }
  var GLYPH = '<svg viewBox="120 100 760 800" width="26" height="26" aria-hidden="true"><g fill="#fff"><path d="M355 108l-5 110c20-6 60-8 83 0l-4-108c-26-4-52-4-74-2zM178 207l92 82c20-30 40-45 45-52l-76-90c-25 20-45 42-61 60zM130 313l-6 92 112-12c-8-25-6-50 0-70l-106-10zM178 497c20 25 45 52 62 64l72-84c-15-8-30-24-47-48l-87 68zM350 495l-4 95c26 6 56 6 90 0l-8-97c-25 6-52 6-78 2zM475 475l81 85c20-8 40-25 60-50l-90-70c-15 14-30 28-51 35z" opacity="0"/></g></svg>';
  var CSS = ':host{all:initial}*{box-sizing:border-box;font-family:Figtree,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}' +
  '.l{position:fixed;bottom:20px;width:60px;height:60px;border-radius:20px;border:0;cursor:pointer;background:var(--c);box-shadow:0 10px 30px rgba(40,0,40,.35);display:grid;place-items:center;z-index:2147483000;transition:transform .15s}.l:hover{transform:scale(1.05)}.l:focus-visible{outline:3px solid #FED700;outline-offset:2px}' +
  '.b{position:absolute;top:-6px;right:-6px;min-width:22px;height:22px;border-radius:11px;background:#FED700;color:#2a0a2c;font:700 12px/22px Figtree,sans-serif;text-align:center;padding:0 5px}' +
  '.t{position:fixed;bottom:92px;max-width:260px;background:#fff;color:#1b1322;border-radius:16px;padding:12px 14px;font-size:14px;line-height:1.4;box-shadow:0 12px 36px rgba(40,0,40,.25);cursor:pointer;z-index:2147483000;animation:pop .35s cubic-bezier(.2,.9,.3,1.2)}.t small{display:block;color:#7d748b;font-size:11.5px;margin-bottom:3px;font-weight:600}' +
  '.p{position:fixed;bottom:92px;width:380px;max-width:calc(100vw - 24px);height:min(600px,calc(100vh - 116px));background:#fff;border-radius:22px;box-shadow:0 24px 80px rgba(40,0,40,.35);display:none;flex-direction:column;overflow:hidden;z-index:2147483001}.p.o{display:flex;animation:pop .25s ease-out}' +
  '@keyframes pop{from{opacity:0;transform:translateY(8px) scale(.97)}to{opacity:1;transform:none}}' +
  '.h{background:var(--c);color:#fff;padding:16px 18px;display:flex;gap:12px;align-items:center}.h .av{width:38px;height:38px;border-radius:12px;background:rgba(255,255,255,.16);display:grid;place-items:center;flex:none}.h b{display:block;font-size:15px}.h span{font-size:12px;opacity:.85;display:flex;align-items:center;gap:6px}.h i{width:7px;height:7px;border-radius:50%;background:#7CF0B1;display:inline-block}.h button{margin-left:auto;background:transparent;border:0;color:#fff;font-size:22px;cursor:pointer;line-height:1;padding:4px 8px;border-radius:8px}.h button:hover{background:rgba(255,255,255,.14)}' +
  '.m{flex:1;overflow-y:auto;padding:16px;background:#faf8fb;display:flex;flex-direction:column;gap:10px}' +
  '.r{max-width:84%;font-size:14.5px;line-height:1.45;padding:10px 13px;border-radius:16px;white-space:pre-wrap;word-wrap:break-word}.r.c{align-self:flex-end;background:var(--c);color:#fff;border-bottom-right-radius:5px}.r.a,.r.g{align-self:flex-start;background:#fff;color:#1b1322;border:1px solid #ece7f0;border-bottom-left-radius:5px}' +
  '.w{align-self:flex-start;font-size:11px;color:#7d748b;margin:2px 4px -4px;font-weight:600}.sys{align-self:center;font-size:12px;color:#5e566b;background:#f0eaf3;padding:5px 11px;border-radius:99px;text-align:center}' +
  '.ty{align-self:flex-start;background:#fff;border:1px solid #ece7f0;border-radius:16px;padding:12px 14px;display:flex;gap:4px}.ty i{width:7px;height:7px;border-radius:50%;background:#a39baf;animation:b 1s infinite}.ty i:nth-child(2){animation-delay:.15s}.ty i:nth-child(3){animation-delay:.3s}@keyframes b{50%{transform:translateY(-4px);background:var(--c)}}' +
  '.q{display:flex;flex-wrap:wrap;gap:6px;padding:0 16px 10px;background:#faf8fb}.q button{border:1px solid var(--c);background:#fff;color:var(--c);padding:6px 12px;border-radius:99px;font:600 12.5px Figtree,sans-serif;cursor:pointer}.q button:hover{background:var(--c);color:#fff}' +
  '.f{display:flex;gap:8px;padding:12px;border-top:1px solid #ece7f0;background:#fff}.f input{flex:1;border:1px solid #e0dbe6;border-radius:12px;padding:11px 13px;font-size:14.5px;outline:none}.f input:focus{border-color:var(--c);box-shadow:0 0 0 3px rgba(129,0,127,.15)}.f button{border:0;background:var(--c);color:#fff;border-radius:12px;padding:0 16px;font-weight:700;cursor:pointer}.f button:disabled{opacity:.5}' +
  '.h button.en{margin-left:auto;margin-right:2px;font:600 12px Figtree,sans-serif;padding:6px 11px;border-radius:99px;background:rgba(255,255,255,.16);white-space:nowrap}.h button.en:hover{background:rgba(255,255,255,.28)}.h button.en:focus-visible,.h button.x:focus-visible{outline:2px solid #FED700;outline-offset:1px}.h button.x{margin-left:0}' +
  '.cf{display:none;padding:12px 14px;border-top:1px solid #ece7f0;background:#fff;font-size:13.5px;color:#1b1322;gap:10px;align-items:center;flex-wrap:wrap}.cf.o{display:flex}.cf span{flex:1;min-width:140px;font-weight:600}.cf button{border:1px solid #e0dbe6;background:#fff;color:#1b1322;border-radius:10px;padding:8px 12px;font:600 13px Figtree,sans-serif;cursor:pointer}.cf button.d{background:#b3261e;border-color:#b3261e;color:#fff}.cf button:focus-visible{outline:3px solid #FED700;outline-offset:1px}' +
  '.rt{display:none;padding:16px 16px 14px;border-top:1px solid #ece7f0;background:#fff;text-align:center}.p.ended .rt{display:block}.p.ended .f,.p.ended .q,.p.ended .cf{display:none!important}' +
  '.rt h4{margin:0 0 3px;font:700 15.5px Figtree,sans-serif;color:#1b1322}.rt p{margin:0 0 12px;font-size:12.5px;color:#7d748b;line-height:1.4}' +
  '.rt .tw{display:flex;gap:10px}.rt .th{flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;border:1.5px solid #e0dbe6;background:#fff;border-radius:16px;padding:14px 8px 11px;font:700 13.5px Figtree,sans-serif;color:#1b1322;cursor:pointer;transition:transform .12s,border-color .12s,background .12s}.rt .th svg{width:30px;height:30px}.rt .th:hover{transform:translateY(-2px)}.rt .th:focus-visible{outline:3px solid #FED700;outline-offset:2px}.rt .th:disabled{opacity:.6;cursor:default;transform:none}' +
  '.rt .th.u{color:#0f7a43}.rt .th.u:hover,.rt .th.u.on{border-color:#1fa561;background:#eaf8f0}.rt .th.d{color:#b3261e}.rt .th.d:hover,.rt .th.d.on{border-color:#d9483f;background:#fdeeed}' +
  '.rt textarea{width:100%;min-height:62px;resize:none;border:1px solid #e0dbe6;border-radius:12px;padding:10px 12px;font:14px Figtree,sans-serif;outline:none;margin-bottom:8px;text-align:left}.rt textarea:focus{border-color:var(--c);box-shadow:0 0 0 3px rgba(129,0,127,.15)}' +
  '.rt .row{display:flex;gap:8px}.rt .row button{flex:1;border-radius:12px;padding:10px;font:700 13.5px Figtree,sans-serif;cursor:pointer}.rt .pri{border:0;background:var(--c);color:#fff}.rt .sec{border:1px solid #e0dbe6;background:#fff;color:#1b1322}.rt .pri:disabled{opacity:.5}.rt .ok{color:#0f7a43;font-weight:700;font-size:13px;margin:0 0 8px}.rt button:focus-visible{outline:3px solid #FED700;outline-offset:1px}' +
  '.pw{text-align:center;font-size:11px;color:#a39baf;padding:0 0 8px;background:#fff}.pw b{color:#81007F}@media(max-width:480px){.p{right:12px!important;left:12px!important;width:auto;bottom:84px}}';
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  var launcher, panel, msgs, quick, input, sendBtn, head, sub, teaser, typing, endBtn, confirmBar, rt;
  function build() {
    var st = el('style'); st.textContent = CSS; root.appendChild(st);
    var side = cfg.widget.position === 'left' ? 'left' : 'right'; var wrap = el('div'); wrap.style.setProperty('--c', cfg.widget.color || '#81007F'); root.appendChild(wrap);
    launcher = el('button', 'l'); launcher.style[side] = '20px'; launcher.setAttribute('aria-label', cfg.widget.launcher || 'Chat with us'); launcher.innerHTML = GLYPH + '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/><circle cx="16.5" cy="7" r="2.2" fill="#FED700" stroke="none"/></svg>'; launcher.firstChild.remove();
    launcher.addEventListener('click', toggle); wrap.appendChild(launcher);
    panel = el('div', 'p'); panel.style[side] = '20px'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', cfg.widget.title);
    head = el('div', 'h'); var av = el('div', 'av'); av.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" /></svg>'; head.appendChild(av);
    var tb = el('div'); tb.appendChild(el('b', '', cfg.widget.title)); sub = el('span'); sub.innerHTML = '<i></i>'; var st2 = el('em', '', cfg.agentName + ' · AI assistant'); st2.style.fontStyle = 'normal'; sub.appendChild(st2); tb.appendChild(sub); head.appendChild(tb);
    endBtn = el('button', 'en', 'End chat'); endBtn.type = 'button'; endBtn.style.display = 'none'; endBtn.setAttribute('aria-label', 'End this chat'); endBtn.addEventListener('click', askEnd); head.appendChild(endBtn);
    var x = el('button', 'x', '×'); x.setAttribute('aria-label', 'Minimise chat'); x.addEventListener('click', toggle); head.appendChild(x); panel.appendChild(head);
    msgs = el('div', 'm'); msgs.setAttribute('aria-live', 'polite'); panel.appendChild(msgs); quick = el('div', 'q'); panel.appendChild(quick);
    var f = el('form', 'f'); input = el('input'); input.placeholder = 'Type your message…'; input.setAttribute('aria-label', 'Message'); input.maxLength = 1000; sendBtn = el('button', '', 'Send'); sendBtn.type = 'submit'; f.appendChild(input); f.appendChild(sendBtn); panel.appendChild(f);
    confirmBar = el('div', 'cf'); confirmBar.setAttribute('role', 'alertdialog'); confirmBar.setAttribute('aria-label', 'End chat?'); confirmBar.appendChild(el('span', '', 'End this chat?'));
    var keep = el('button', '', 'Keep chatting'); keep.type = 'button'; keep.addEventListener('click', function () { confirmBar.classList.remove('o'); input.focus(); });
    var yes = el('button', 'd', 'End chat'); yes.type = 'button'; yes.addEventListener('click', doEnd); confirmBar.appendChild(keep); confirmBar.appendChild(yes); panel.insertBefore(confirmBar, f);
    rt = el('div', 'rt'); rt.setAttribute('aria-live', 'polite'); panel.insertBefore(rt, f);
    f.addEventListener('submit', function (e) { e.preventDefault(); var t = input.value.trim(); if (t) { input.value = ''; send(t); } });
    var pw = el('div', 'pw'); pw.innerHTML = 'Powered by <b>Conversa AI</b> · AI answers may be reviewed by our team'; panel.appendChild(pw); wrap.appendChild(panel);
    wrap.__side = side; host.__wrap = wrap;
  }
  function badge() { var b = launcher.querySelector('.b'); if (b) b.remove(); if (unread > 0 && !openState) { var n = el('span', 'b', unread); launcher.appendChild(n); } }
  function render(list) {
    list.forEach(function (m) {
      if (seen[m.id]) return; seen[m.id] = 1; if (m.cid && seen[m.cid]) { last = Math.max(last, new Date(m.at).getTime()); return; } last = Math.max(last, new Date(m.at).getTime());
      if (m.from === 'note') return;
      if (m.from === 'system') { msgs.insertBefore(el('div', 'sys', m.text), typing || null); return; }
      if (m.from === 'agent') { msgs.insertBefore(el('div', 'w', m.name || 'Team'), typing || null); }
      var r = el('div', 'r ' + (m.from === 'customer' ? 'c' : m.from === 'agent' ? 'g' : 'a'), m.text); msgs.insertBefore(r, typing || null);
      if (m.from !== 'customer' && !openState) unread++;
    }); msgs.scrollTop = msgs.scrollHeight; badge();
  }
  function setTyping(on) { if (on && !typing) { typing = el('div', 'ty'); typing.innerHTML = '<i></i><i></i><i></i>'; msgs.appendChild(typing); msgs.scrollTop = msgs.scrollHeight; } else if (!on && typing) { typing.remove(); typing = null; } }
  function applyState(d) {
    setTyping(!!d.typing); var label = d.owner === 'human' && d.agentName ? d.agentName + ' · Brightwave team' : d.owner === 'queue' ? 'Connecting you to a person…' : cfg.agentName + ' · AI assistant';
    sub.lastChild.textContent = d.ended ? 'Chat ended' : label; if (d.ended) { quick.innerHTML = ''; showEnded(d); } else if (!ended) { endBtn.style.display = d.canEnd ? '' : 'none'; }
  }

  var UP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/></svg>';
  var DOWN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"/></svg>';
  function askEnd() { confirmBar.classList.add('o'); confirmBar.querySelector('button').focus(); }
  function doEnd() {
    confirmBar.classList.remove('o');
    api('/api/widget/end', { method: 'POST', body: JSON.stringify({ key: KEY, visitorId: vid }) }).then(function (d) { applyState(d); render(d.messages); })
      .catch(function () { render([{ id: 'err' + Date.now(), from: 'system', text: 'We couldn’t end the chat. Please try again.', at: new Date().toISOString() }]); });
  }
  function showEnded(d) {
    if (!ended) { ended = true; panel.classList.add('ended'); confirmBar.classList.remove('o'); endBtn.style.display = 'none'; setTyping(false); }
    if (!endNoted) { endNoted = true; msgs.insertBefore(el('div', 'sys', d.endedBy === 'customer' ? 'You ended this chat.' : 'This chat has been marked as resolved.'), typing || null); msgs.scrollTop = msgs.scrollHeight; }
    var fb = d.feedback || localFb; var key = fb ? 'rated:' + fb.rating : 'ask'; if (key === rtKey) return; rtKey = key; rt.innerHTML = '';
    if (!fb) {
      rt.appendChild(el('h4', '', 'How was your support experience?')); rt.appendChild(el('p', '', 'Your feedback helps us serve you better.'));
      var tw = el('div', 'tw'); tw.setAttribute('role', 'group'); tw.setAttribute('aria-label', 'Rate your support experience');
      [['up', 'Excellent', UP], ['down', 'Poor', DOWN]].forEach(function (o) { var b = el('button', 'th ' + (o[0] === 'up' ? 'u' : 'd')); b.type = 'button'; b.innerHTML = o[2] + '<span>' + o[1] + '</span>'; b.setAttribute('aria-label', o[1] + (o[0] === 'up' ? ', thumbs up' : ', thumbs down')); b.addEventListener('click', function () { rate(o[0], tw); }); tw.appendChild(b); });
      rt.appendChild(tw); var nc = el('button', 'sec', 'Skip and start a new chat'); nc.type = 'button'; nc.style.cssText = 'margin-top:10px;width:100%;border-radius:12px;padding:9px;font:600 13px Figtree,sans-serif;cursor:pointer;border:0;background:transparent;color:#7d748b;text-decoration:underline'; nc.addEventListener('click', newChat); rt.appendChild(nc);
      if (openState) setTimeout(function () { var f1 = tw.querySelector('button'); f1 && f1.focus(); }, 60);
    } else {
      var good = fb.rating === 'up'; rt.appendChild(el('p', 'ok', good ? 'Thank you for your feedback!' : 'Thank you. We’re sorry we fell short.'));
      if (!commentSent) {
        rt.appendChild(el('h4', '', good ? 'Anything you’d like to add? (optional)' : 'What went wrong? (optional)'));
        var ta = el('textarea'); ta.maxLength = 500; ta.placeholder = good ? 'Tell us what we did well…' : 'Tell us how we can do better…'; ta.setAttribute('aria-label', 'Your comments'); rt.appendChild(ta);
        var row = el('div', 'row'); var sc = el('button', 'sec', 'Start new chat'); sc.type = 'button'; sc.addEventListener('click', newChat); var sb = el('button', 'pri', 'Send comment'); sb.type = 'button';
        sb.addEventListener('click', function () { var t = ta.value.trim(); if (!t) return newChat(); sb.disabled = true; api('/api/widget/feedback', { method: 'POST', body: JSON.stringify({ key: KEY, visitorId: vid, rating: fb.rating, comment: t }) }).then(function () { commentSent = true; rtKey = ''; showEnded({ feedback: fb, endedBy: d.endedBy }); }).catch(function () { sb.disabled = false; }); });
        row.appendChild(sc); row.appendChild(sb); rt.appendChild(row);
      } else { rt.appendChild(el('p', '', 'Your comment has been shared with our team.')); var nb = el('button', 'pri', 'Start new chat'); nb.type = 'button'; nb.style.cssText = 'width:100%;border-radius:12px;padding:10px;font:700 13.5px Figtree,sans-serif;cursor:pointer;border:0'; nb.addEventListener('click', newChat); rt.appendChild(nb); }
    }
  }
  function rate(r, group) {
    var bs = group.querySelectorAll('button'); bs.forEach(function (b) { b.disabled = true; }); (r === 'up' ? bs[0] : bs[1]).classList.add('on');
    api('/api/widget/feedback', { method: 'POST', body: JSON.stringify({ key: KEY, visitorId: vid, rating: r }) }).then(function () { localFb = { rating: r }; rtKey = ''; showEnded({ feedback: localFb }); })
      .catch(function () { bs.forEach(function (b) { b.disabled = false; }); render([{ id: 'err' + Date.now(), from: 'system', text: 'We couldn’t save your rating. Please try again.', at: new Date().toISOString() }]); });
  }
  function newChat() {
    ended = false; localFb = null; rtKey = ''; endNoted = false; commentSent = false; started = false; convId = null; seen = {}; last = 0; typing = null; msgs.innerHTML = ''; rt.innerHTML = ''; panel.classList.remove('ended'); endBtn.style.display = 'none';
    session().then(function () { quickReplies(); input.focus(); });
  }
  function session(proactive) {
    return api('/api/widget/session', { method: 'POST', body: JSON.stringify({ key: KEY, visitorId: vid, page: location.href, proactiveId: proactive && proactive.id }) }).then(function (d) { convId = d.conversationId; started = true; render(d.messages); applyState(d); return d; });
  }
  function startPoll() { stopPoll(); poll = setInterval(tick, openState ? 1800 : 5000); }
  function stopPoll() { clearInterval(poll); }
  function tick() { if (!started) return; api('/api/widget/messages?key=' + encodeURIComponent(KEY) + '&visitorId=' + encodeURIComponent(vid) + '&after=' + last).then(function (d) { render(d.messages); applyState(d); }).catch(function () {}); }
  function send(text) {
    var go = function () { if (!ended) endBtn.style.display = ''; var cid = 'cm_' + Math.random().toString(36).slice(2); render([{ id: cid, from: 'customer', text: text, at: new Date().toISOString() }]); quick.innerHTML = '';
      api('/api/widget/messages', { method: 'POST', body: JSON.stringify({ key: KEY, visitorId: vid, text: text, clientId: cid, page: location.href }) }).then(function (d) { setTyping(true); }).catch(function () { render([{ id: 'err' + Date.now(), from: 'system', text: 'Message not sent. Check your connection and try again.', at: new Date().toISOString() }]); }); };
    started ? go() : session().then(go);
  }
  function toggle() { openState = !openState; panel.classList.toggle('o', openState); if (teaser) { teaser.remove(); teaser = null; } if (openState) { unread = 0; badge(); if (!started) session().then(function () { quickReplies(); }); else tick(); setTimeout(function () { input.focus(); }, 80); } startPoll(); }
  function quickReplies() { if (msgs.querySelectorAll('.r.c').length) return; quick.innerHTML = ''; (cfg.quickReplies || []).forEach(function (q) { var b = el('button', '', q); b.type = 'button'; b.addEventListener('click', function () { send(q); }); quick.appendChild(b); }); }
  function proactive() {
    if (!cfg.widget.showProactive || proactiveShown) return; var m = (cfg.proactive || [])[0]; if (!m) return; var shownKey = 'conversa_pro_' + m.id; try { if (sessionStorage.getItem(shownKey)) return; } catch (e) {}
    setTimeout(function () { if (openState || proactiveShown) return; proactiveShown = true; try { sessionStorage.setItem(shownKey, '1'); } catch (e) {}
      session(m).then(function (d) { unread = Math.max(1, unread); badge(); teaser = el('div', 't'); teaser.style[host.__wrap.__side] = '20px'; var sm = el('small', '', cfg.agentName + ' · AI assistant'); teaser.appendChild(sm); teaser.appendChild(document.createTextNode(m.message)); teaser.addEventListener('click', toggle); host.__wrap.appendChild(teaser); startPoll(); }); }, (m.delaySec || 10) * 1000);
  }
  api('/api/widget/config?key=' + encodeURIComponent(KEY) + '&page=' + encodeURIComponent(location.href)).then(function (c) { cfg = c; build(); proactive(); startPoll(); window.Conversa = { open: function () { if (!openState) toggle(); }, close: function () { if (openState) toggle(); } }; }).catch(function (e) { console.warn('[Conversa] widget disabled:', e.message); });
})();
