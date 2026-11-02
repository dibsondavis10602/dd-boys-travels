// Leo, a small white Pomeranian who suggests trips.
// Tap him to chat, stroke him to pet, throw his ball, feed him treats.
// He gets hungry, sleepy, happy, excited and loving. Trip ideas come from his own
// nose: a rules engine over the estimated fares, hotels and seasons built into the site.
(function () {
  var M = window.FareMock, A = window.Art;
  if (!M || !window.DD) return;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  // ---------- drawing Leo ----------
  // A fluffy outline: a ring of overlapping puffs around a centre.
  function puff(cx, cy, rx, ry, n, br, fill, extra) {
    var s = '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + fill + '"/>';
    for (var i = 0; i < n; i++) {
      var a = (i / n) * Math.PI * 2 + (extra || 0), j = 0.86 + ((i * 37) % 10) / 50;
      s += '<circle cx="' + (cx + Math.cos(a) * rx * 0.92).toFixed(1) + '" cy="' + (cy + Math.sin(a) * ry * 0.92).toFixed(1) + '" r="' + (br * j).toFixed(1) + '" fill="' + fill + '"/>';
    }
    return s;
  }
  var FUR = "#ffffff", SHADE = "#e9e1d4", DEEP = "#d9cdbb", INK = "#2a211b";
  var svg =
    '<svg class="leo" viewBox="0 0 200 210" aria-hidden="true">' +
    '<defs><radialGradient id="leo-fur" cx="45%" cy="35%" r="70%"><stop offset="0" stop-color="#fff"/><stop offset="0.75" stop-color="#fbf8f2"/><stop offset="1" stop-color="#efe7da"/></radialGradient>' +
    '<radialGradient id="leo-eye" cx="40%" cy="35%" r="65%"><stop offset="0" stop-color="#5a3b28"/><stop offset="0.55" stop-color="#2a1a12"/><stop offset="1" stop-color="#120a06"/></radialGradient></defs>' +
    '<ellipse class="l-shadow" cx="100" cy="198" rx="58" ry="8"/>' +
    '<g class="l-all">' +
    // tail: a plume curling up over the back
    '<g class="l-tail">' + puff(150, 118, 22, 18, 9, 10, SHADE) + puff(150, 116, 19, 15, 9, 9, "url(#leo-fur)", 0.3) + puff(160, 98, 14, 12, 7, 7, "url(#leo-fur)") + "</g>" +
    // body
    '<g class="l-body">' + puff(100, 150, 50, 40, 16, 14, SHADE) + puff(100, 147, 46, 37, 16, 13, "url(#leo-fur)", 0.2) +
    // chest ruff
    puff(100, 132, 30, 20, 10, 9, "#fff", 0.1) +
    // paws
    '<ellipse cx="82" cy="186" rx="13" ry="9" fill="#fff" stroke="' + DEEP + '" stroke-width="1.2"/><ellipse cx="118" cy="186" rx="13" ry="9" fill="#fff" stroke="' + DEEP + '" stroke-width="1.2"/>' +
    '<path d="M78 189v-4M83 190v-5M88 189v-4M114 189v-4M119 190v-5M124 189v-4" stroke="' + DEEP + '" stroke-width="1.3" stroke-linecap="round"/>' +
    "</g>" +
    '<g class="l-wavepaw">' + puff(150, 128, 12, 12, 7, 6, "#fff") + '<ellipse cx="153" cy="122" rx="9" ry="8" fill="#fff" stroke="' + DEEP + '" stroke-width="1.2"/><path d="M148 118v4M153 117v5M158 118v4" stroke="' + DEEP + '" stroke-width="1.2" stroke-linecap="round"/></g>' +
    // head
    '<g class="l-head">' +
    '<g class="l-ear l-ear-l"><path d="M62 58 L70 18 Q74 14 80 22 L92 48 Z" fill="#fff" stroke="' + DEEP + '" stroke-width="1.2"/><path d="M70 50 L73 27 L84 46 Z" fill="#f4c2c0"/></g>' +
    '<g class="l-ear l-ear-r"><path d="M138 58 L130 18 Q126 14 120 22 L108 48 Z" fill="#fff" stroke="' + DEEP + '" stroke-width="1.2"/><path d="M130 50 L127 27 L116 46 Z" fill="#f4c2c0"/></g>' +
    puff(100, 82, 48, 42, 18, 13, SHADE) + puff(100, 80, 45, 39, 18, 12, "url(#leo-fur)", 0.17) +
    // cheek fluff
    puff(100, 92, 36, 26, 12, 8, "#fff", 0.25) +
    // face
    '<ellipse class="l-cheek" cx="72" cy="98" rx="8" ry="5"/><ellipse class="l-cheek" cx="128" cy="98" rx="8" ry="5"/>' +
    '<g class="l-brows"><path d="M74 70 q10 -6 18 2" /><path d="M126 70 q-10 -6 -18 2"/></g>' +
    '<g class="l-eyes l-eyes-open"><g class="l-blink"><ellipse cx="82" cy="84" rx="8.5" ry="9.5" fill="url(#leo-eye)"/><ellipse cx="118" cy="84" rx="8.5" ry="9.5" fill="url(#leo-eye)"/>' +
    '<circle cx="85" cy="80" r="3" fill="#fff"/><circle cx="121" cy="80" r="3" fill="#fff"/><circle cx="79.5" cy="88" r="1.4" fill="#fff" opacity=".8"/><circle cx="115.5" cy="88" r="1.4" fill="#fff" opacity=".8"/></g></g>' +
    '<g class="l-eyes l-eyes-happy"><path d="M74 86 q8 -10 16 0M110 86 q8 -10 16 0" stroke="' + INK + '" stroke-width="3.2" fill="none" stroke-linecap="round"/></g>' +
    '<g class="l-eyes l-eyes-sleep"><path d="M74 85 q8 6 16 0M110 85 q8 6 16 0" stroke="' + INK + '" stroke-width="3" fill="none" stroke-linecap="round"/></g>' +
    '<g class="l-eyes l-eyes-love"><path d="M82 92 l-8 -8 a4.6 4.6 0 0 1 8 -5 a4.6 4.6 0 0 1 8 5z M118 92 l-8 -8 a4.6 4.6 0 0 1 8 -5 a4.6 4.6 0 0 1 8 5z" fill="#e8506a"/></g>' +
    '<g class="l-eyes l-eyes-sad"><ellipse cx="82" cy="86" rx="8" ry="8.5" fill="url(#leo-eye)"/><ellipse cx="118" cy="86" rx="8" ry="8.5" fill="url(#leo-eye)"/><circle cx="84.5" cy="82.5" r="3.2" fill="#fff"/><circle cx="120.5" cy="82.5" r="3.2" fill="#fff"/><path class="l-tear" d="M76 95 q-3 5 0 7 q3 -2 0 -7z" fill="#9fd3f0"/></g>' +
    '<g class="l-eyes l-eyes-wide"><circle cx="82" cy="83" r="10.5" fill="#fff" stroke="' + INK + '" stroke-width="1.6"/><circle cx="118" cy="83" r="10.5" fill="#fff" stroke="' + INK + '" stroke-width="1.6"/><circle cx="82" cy="84" r="4.6" fill="' + INK + '"/><circle cx="118" cy="84" r="4.6" fill="' + INK + '"/><circle cx="83.5" cy="82" r="1.5" fill="#fff"/><circle cx="119.5" cy="82" r="1.5" fill="#fff"/></g>' +
    '<g class="l-eyes l-eyes-wink"><ellipse cx="82" cy="84" rx="8.5" ry="9.5" fill="url(#leo-eye)"/><circle cx="85" cy="80" r="3" fill="#fff"/><path d="M110 86 q8 -10 16 0" stroke="' + INK + '" stroke-width="3.2" fill="none" stroke-linecap="round"/></g>' +
    '<g class="l-eyes l-eyes-dizzy" stroke="' + INK + '" stroke-width="2.2" fill="none" stroke-linecap="round"><path class="l-spin" d="M82 84 m-1 0 a1 1 0 0 1 2 0 a3 3 0 0 1 -5 1 a5 5 0 0 1 8 -4 a7 7 0 0 1 -6 11"/><path class="l-spin" d="M118 84 m-1 0 a1 1 0 0 1 2 0 a3 3 0 0 1 -5 1 a5 5 0 0 1 8 -4 a7 7 0 0 1 -6 11"/></g>' +
    '<g class="l-eyes l-eyes-grumpy"><path d="M73 80 l18 5" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round"/><path d="M127 80 l-18 5" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round"/><ellipse cx="83" cy="89" rx="6.5" ry="5" fill="url(#leo-eye)"/><ellipse cx="117" cy="89" rx="6.5" ry="5" fill="url(#leo-eye)"/></g>' +
    '<g class="l-eyes l-eyes-shy"><path d="M74 87 q8 -7 16 0M110 87 q8 -7 16 0" stroke="' + INK + '" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M66 100 l5 -4 M70 102 l5 -4 M125 96 l5 4 M129 98 l5 4" stroke="#e8798a" stroke-width="1.6" stroke-linecap="round"/></g>' +
    '<g class="l-shades"><path d="M66 78 h68" stroke="#111" stroke-width="3"/><path d="M68 77 h26 q1 14 -12 14 q-13 0 -14 -14z M106 77 h26 q-1 14 -14 14 q-13 0 -12 -14z" fill="#111"/><path d="M73 80 l6 6 M111 80 l6 6" stroke="#fff" stroke-width="2" opacity=".5" stroke-linecap="round"/></g>' +
    // muzzle, nose, mouths
    '<ellipse cx="100" cy="104" rx="17" ry="12" fill="#fff"/>' +
    '<path d="M93 96 q7 -3 14 0 q-1 6 -7 8 q-6 -2 -7 -8z" fill="' + INK + '"/><ellipse cx="98" cy="97.5" rx="2.4" ry="1.3" fill="#fff" opacity=".55"/>' +
    '<g class="l-mouth l-mouth-smile"><path d="M100 104 v3 M100 107 q-6 6 -11 1 M100 107 q6 6 11 1" stroke="' + INK + '" stroke-width="2" fill="none" stroke-linecap="round"/></g>' +
    '<g class="l-mouth l-mouth-open"><path d="M100 104 v2 M88 107 q12 16 24 0 z" fill="#5a1f1f" stroke="' + INK + '" stroke-width="1.8" stroke-linejoin="round"/><path class="l-tongue" d="M94 112 q6 14 12 0 q-6 3 -12 0z" fill="#f08a9a"/></g>' +
    '<g class="l-mouth l-mouth-sad"><path d="M100 104 v3 M91 113 q9 -7 18 0" stroke="' + INK + '" stroke-width="2" fill="none" stroke-linecap="round"/></g>' +
    '<g class="l-mouth l-mouth-laugh"><path d="M86 106 q14 22 28 0 z" fill="#5a1f1f" stroke="' + INK + '" stroke-width="1.8" stroke-linejoin="round"/><path d="M93 114 q7 9 14 0 q-7 2 -14 0z" fill="#f08a9a"/></g>' +
    '<g class="l-mouth l-mouth-grr"><path d="M100 104 v3 M89 112 q3.5 -3 7 0 q3.5 3 7 0 q3.5 -3 7 0" stroke="' + INK + '" stroke-width="2" fill="none" stroke-linecap="round"/></g>' +
    '<g class="l-mouth l-mouth-tongue"><path d="M100 104 v3 M100 107 q-6 6 -11 1 M100 107 q6 6 11 1" stroke="' + INK + '" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M101 109 q1 10 7 9 q4 -2 2 -10z" fill="#f08a9a" stroke="#d96b7d" stroke-width="1"/></g>' +
    '<g class="l-mouth l-mouth-o"><ellipse cx="100" cy="110" rx="4" ry="5" fill="#5a1f1f" stroke="' + INK + '" stroke-width="1.6"/></g>' +
    "</g>" +
    '<g class="l-ball-mouth"><circle cx="100" cy="114" r="10" fill="#c8e05a" stroke="#8ea43a" stroke-width="1.2"/><path d="M91 110q9 7 18 0" stroke="#fff" stroke-width="1.5" fill="none"/></g>' +
    "</g></svg>";

  var bowlSvg = '<svg viewBox="0 0 80 40" aria-hidden="true"><path d="M6 14 h68 q-4 22 -34 22 q-30 0 -34 -22z" fill="#d9b46a" stroke="#8a6a2f" stroke-width="2"/><ellipse cx="40" cy="14" rx="34" ry="5" fill="#8a6a2f"/><g class="kib"><circle cx="30" cy="12" r="4" fill="#a0603a"/><circle cx="40" cy="11" r="4.4" fill="#b8703f"/><circle cx="50" cy="12" r="4" fill="#a0603a"/><circle cx="35" cy="8" r="3.6" fill="#c07a46"/><circle cx="45" cy="8" r="3.6" fill="#a0603a"/></g></svg>';

  // ---------- dock and panel ----------
  var dock = document.createElement("div");
  dock.className = "leo-dock"; dock.id = "leo";
  dock.innerHTML = '<div class="leo-bubble" id="leo-bubble" role="status"></div><div class="leo-fx" id="leo-fx"></div><div class="leo-bowl" id="leo-bowl">' + bowlSvg + '</div><button class="leo-btn" id="leo-btn" type="button" aria-label="Leo, your trip buddy. Tap to chat, stroke to pet." aria-expanded="false">' + svg + "</button>";
  document.body.appendChild(dock);
  var ball = document.createElement("div"); ball.className = "leo-ball"; ball.setAttribute("aria-hidden", "true"); document.body.appendChild(ball);

  var panel = document.createElement("section");
  panel.className = "leo-panel"; panel.id = "leo-panel"; panel.hidden = true; panel.setAttribute("aria-label", "Chat with Leo");
  panel.innerHTML =
    '<header class="lp-head"><div><div class="lp-name">Leo <span id="leo-moodtag">· happy</span></div><div class="lp-sub">Your trip buddy · white Pomeranian</div></div><div class="lp-tools"><button class="lp-x lp-voice" id="leo-voice" type="button" aria-label="Leo sounds on or off" aria-pressed="true" title="Leo sounds on/off">🔊</button><button class="lp-x" id="leo-close" type="button" aria-label="Close">×</button></div></header>' +
    '<div class="lp-stats"><label>Tummy<span class="meter"><i id="leo-hunger"></i></span></label><label>Joy<span class="meter joy"><i id="leo-joy"></i></span></label></div>' +
    '<div class="lp-actions"><button type="button" data-leo="feed">🦴 Feed</button><button type="button" data-leo="fetch">🎾 Play fetch</button><button type="button" data-leo="pet">🤍 Pet</button><button type="button" data-leo="suggest">✈ Suggest a trip</button></div>' +
    '<div class="lp-log" id="leo-log" aria-live="polite"></div>' +
    '<form class="lp-ask" id="leo-form"><input id="leo-input" type="text" autocomplete="off" placeholder="Ask Leo: honeymoon in December, under $500…" maxlength="200"><button type="submit" aria-label="Send">➤</button></form>';
  document.body.appendChild(panel);


  // ---------- Leo's sounds: dog noises only, made live with Web Audio (no speech) ----------
  var soundOn = store("dd-leo-voice") !== "0", actx = null, lastSound = 0;
  function ac() {
    try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === "suspended") actx.resume(); return actx; } catch (e) { return null; }
  }
  function noise(c, secs) {
    var len = Math.max(1, Math.floor(c.sampleRate * secs)), buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    for (var k = 0; k < len; k++) d[k] = Math.random() * 2 - 1;
    var n = c.createBufferSource(); n.buffer = buf; return n;
  }
  function env(c, g, t, a, hold, rel, peak) {
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak || 1, t + a);
    g.gain.setValueAtTime(peak || 1, t + a + hold); g.gain.exponentialRampToValueAtTime(0.0001, t + a + hold + rel);
  }
  function voiced(c, out, t, dur, f0s, formants, level) {
    // A throat buzz (sawtooth with jitter) through mouth-shaped filters: the core of every bark and whine.
    var src = c.createOscillator(); src.type = "sawtooth";
    src.frequency.setValueAtTime(f0s[0], t);
    for (var i = 1; i < f0s.length; i++) src.frequency.linearRampToValueAtTime(f0s[i], t + dur * i / (f0s.length - 1));
    var jit = c.createOscillator(), jg = c.createGain(); jit.type = "triangle"; jit.frequency.value = 23 + Math.random() * 20; jg.gain.value = f0s[0] * 0.035; jit.connect(jg); jg.connect(src.frequency);
    var g = c.createGain(); env(c, g, t, Math.min(0.015, dur * 0.2), dur * 0.4, dur * 0.5, level || 1);
    formants.forEach(function (fm) {
      var bp = c.createBiquadFilter(), fg = c.createGain(); bp.type = "bandpass"; bp.frequency.value = fm[0]; bp.Q.value = fm[1]; fg.gain.value = fm[2];
      src.connect(bp); bp.connect(fg); fg.connect(g);
    });
    g.connect(out); src.start(t); jit.start(t); src.stop(t + dur + 0.05); jit.stop(t + dur + 0.05);
  }
  function breath(c, out, t, dur, freq, q, level) {
    var n = noise(c, dur + 0.05), f = c.createBiquadFilter(), g = c.createGain();
    f.type = "bandpass"; f.frequency.value = freq; f.Q.value = q || 0.9; env(c, g, t, 0.01, dur * 0.3, dur * 0.7, level || 0.3);
    n.connect(f); f.connect(g); g.connect(out); n.start(t);
  }
  var SOUND = {
    bark: function (c, o, t) { // one small-dog "arf"
      var f0 = 520 + Math.random() * 140, d = 0.12 + Math.random() * 0.04;
      breath(c, o, t, 0.04, 2600, 0.7, 0.25);
      voiced(c, o, t + 0.01, d, [f0 * 0.8, f0 * 1.18, f0 * 0.6], [[1050, 5, 1], [2500, 7, 0.6], [3800, 9, 0.25]], 1);
      return d + 0.08;
    },
    yips: function (c, o, t) { var x = 0; for (var i = 0; i < 2 + (Math.random() < 0.5 ? 1 : 0); i++) x += SOUND.bark(c, o, t + x) + 0.03 + Math.random() * 0.05; return x; },
    whine: function (c, o, t) { // soft "hmmmm-eee" puppy whine
      var f = 900 + Math.random() * 200, d = 0.75;
      voiced(c, o, t, d, [f, f * 1.45, f * 1.25, f * 1.6, f * 1.1], [[f * 1.5, 3, 0.9], [3000, 6, 0.2]], 0.35);
      return d + 0.1;
    },
    growl: function (c, o, t) { // little "grrrr"
      var d = 0.8, src = c.createOscillator(), am = c.createOscillator(), amg = c.createGain(), lp = c.createBiquadFilter(), g = c.createGain();
      src.type = "sawtooth"; src.frequency.setValueAtTime(140, t); src.frequency.linearRampToValueAtTime(115, t + d);
      am.frequency.value = 26; amg.gain.value = 0.5; am.connect(amg); amg.connect(g.gain);
      lp.type = "lowpass"; lp.frequency.value = 900; lp.Q.value = 3; env(c, g, t, 0.06, d * 0.6, d * 0.35, 0.6);
      src.connect(lp); lp.connect(g); g.connect(o); src.start(t); am.start(t); src.stop(t + d + 0.05); am.stop(t + d + 0.05);
      breath(c, o, t, d, 500, 1.2, 0.12);
      return d;
    },
    pant: function (c, o, t) { // happy "hah-hah-hah"
      for (var i = 0; i < 6; i++) breath(c, o, t + i * 0.17, 0.11, i % 2 ? 1700 : 1300, 1.1, 0.22);
      return 1.05;
    },
    sniff: function (c, o, t) { // "snff snff"
      for (var i = 0; i < 3; i++) { var n = noise(c, 0.09), f = c.createBiquadFilter(), g = c.createGain(); f.type = "highpass"; f.frequency.value = 3200; env(c, g, t + i * 0.13, 0.02, 0.02, 0.05, 0.28); n.connect(f); f.connect(g); g.connect(o); n.start(t + i * 0.13); }
      return 0.45;
    },
    munch: function (c, o, t) { // crunchy kibble
      for (var i = 0; i < 7; i++) { var tt = t + i * 0.16 + Math.random() * 0.04; breath(c, o, tt, 0.05, 900 + Math.random() * 1500, 2, 0.35); }
      return 1.2;
    },
    yawn: function (c, o, t) { var d = 1.1; voiced(c, o, t, d, [1100, 1500, 900, 520], [[1200, 2.5, 0.9], [2600, 5, 0.25]], 0.3); breath(c, o, t + 0.1, d, 1200, 0.8, 0.12); return d; },
    happy: function (c, o, t) { var x = SOUND.bark(c, o, t); return x + SOUND.pant(c, o, t + x + 0.05); }
  };
  function woof(kind) {
    if (!soundOn) return 0;
    var c = ac(); if (!c || !SOUND[kind]) return 0;
    if (Date.now() - lastSound < 250) return 0; lastSound = Date.now();
    var out = c.createGain(), comp = c.createDynamicsCompressor(); out.gain.value = 0.6; out.connect(comp); comp.connect(c.destination);
    dock.classList.add("talking");
    var dur = SOUND[kind](c, out, c.currentTime + 0.02);
    setTimeout(function () { dock.classList.remove("talking"); }, (dur + 0.1) * 1000);
    return dur;
  }
  var MOOD_SOUND = { excited: "yips", love: "happy", happy: "bark", playful: "yips", laughing: "pant", cool: "bark", surprised: "bark", curious: "sniff",
    sad: "whine", hungry: "whine", shy: "whine", grumpy: "growl", sleepy: "yawn", eating: "munch", dizzy: "whine" };
  function talk(_, opts) { woof((opts && opts.kind) || MOOD_SOUND[(opts && opts.mood) || mood] || "bark"); }
  function setVoice(on) {
    soundOn = on; store("dd-leo-voice", on ? "1" : "0");
    var b = $("leo-voice"); b.textContent = on ? "🔊" : "🔇"; b.setAttribute("aria-pressed", on ? "true" : "false");
  }

  // ---------- state ----------
  var st = { hunger: 80, joy: 70, t: Date.now() };
  try { var saved = JSON.parse(store("dd-leo") || "null"); if (saved) st = saved; } catch (e) {}
  var away = Math.min(6 * 3600e3, Date.now() - (st.t || Date.now()));
  st.hunger = Math.max(5, st.hunger - away / 60e3 * 1.2);
  st.joy = Math.max(10, st.joy - away / 60e3 * 0.6);
  function save() { st.t = Date.now(); store("dd-leo", JSON.stringify(st)); }
  var mood = "happy", moodTimer = null, lastPoke = Date.now(), busy = false;
  var LABEL = { happy: "happy", excited: "excited!", love: "loved", hungry: "hungry", sleepy: "sleepy", curious: "sniffing for deals", eating: "munching", sad: "a bit lonely",
    surprised: "surprised!", laughing: "laughing", cool: "feeling cool 😎", shy: "shy", grumpy: "grumpy", dizzy: "dizzy", playful: "playful" };
  function baseMood() {
    if (Date.now() - lastPoke > 150e3) return "sleepy";
    if (st.hunger < 30) return "hungry";
    if (st.joy < 25) return "sad";
    return "happy";
  }
  function setMood(m, ms) {
    mood = m; dock.dataset.mood = m; panel.dataset.mood = m;
    $("leo-moodtag").textContent = "· " + LABEL[m];
    clearTimeout(moodTimer);
    if (ms) moodTimer = setTimeout(function () { setMood(baseMood()); }, ms);
    if (m === "sleepy") zzz();
  }
  function meters() {
    $("leo-hunger").style.width = Math.round(st.hunger) + "%";
    $("leo-joy").style.width = Math.round(st.joy) + "%";
    $("leo-hunger").parentNode.classList.toggle("low", st.hunger < 30);
  }
  var bubbleTimer;
  function say(text, ms, speak) {
    var b = $("leo-bubble");
    if (speak) talk(null, typeof speak === "string" ? { kind: speak } : null);
    b.textContent = text; b.classList.remove("show"); void b.offsetWidth; b.classList.add("show");
    clearTimeout(bubbleTimer); bubbleTimer = setTimeout(function () { b.classList.remove("show"); }, ms || 3600);
  }
  function poke() { var was = mood; lastPoke = Date.now(); if (was === "sleepy") { setMood("happy", 0); say("*yawn* …I'm up! Where are we going? ✈", 0, "yawn"); } }

  // floating hearts, notes, crumbs, Zzz
  function fx(chars, n, cls) {
    var box = $("leo-fx");
    for (var i = 0; i < n; i++) {
      var e = document.createElement("span");
      e.className = "lfx " + (cls || "");
      e.textContent = chars[i % chars.length];
      e.style.left = (35 + Math.random() * 30) + "%";
      e.style.setProperty("--dx", (Math.random() * 60 - 30).toFixed(0) + "px");
      e.style.animationDelay = (i * 0.12).toFixed(2) + "s";
      box.appendChild(e);
      setTimeout(function (x) { return function () { x.remove(); }; }(e), 2200 + i * 120);
    }
  }
  var zt;
  function zzz() { clearTimeout(zt); if (mood !== "sleepy") return; fx(["z", "Z", "z"], 3, "z"); zt = setTimeout(zzz, 3000); }

  // ---------- interactions ----------
  var btn = $("leo-btn"), down = null, stroke = 0, lastPt = null, taps = [];
  var pos = { x: 0, y: 0 }, dragging = false, dragged = false;
  function bounds() { var w = dock.offsetWidth, h = dock.offsetHeight || w * 1.05; return { minX: -(innerWidth - w - 20), minY: -(innerHeight - h - 24) }; }
  function place(x, y) {
    var b = bounds(); pos.x = Math.max(b.minX, Math.min(0, x)); pos.y = Math.max(b.minY, Math.min(0, y));
    dock.style.translate = pos.x + "px " + pos.y + "px";
    var r = dock.getBoundingClientRect(); dock.classList.toggle("side-left", r.left + r.width / 2 < innerWidth / 2); dock.classList.toggle("side-top", r.top < 200);
  }
  btn.addEventListener("pointerdown", function (e) { down = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y }; dragged = false; stroke = 0; lastPt = { x: e.clientX, y: e.clientY }; try { btn.setPointerCapture(e.pointerId); } catch (x) {} });
  btn.addEventListener("pointermove", function (e) {
    if (down) {
      var mx = e.clientX - down.x, my = e.clientY - down.y;
      if (!dragging && Math.abs(mx) + Math.abs(my) > 10 && !busy) {
        dragging = dragged = true; poke(); dock.classList.add("held"); dock.style.transition = "none"; cancelWalk();
        setMood("excited"); say(["Wheee! 🐾", "Where are we going?! ✈", "Up, up and away! 🎈"][Math.floor(Math.random() * 3)], 1600);
      }
      if (dragging) place(down.px + mx, down.py + my);
      return;
    }
    if (e.pointerType !== "mouse") return;
    if (!lastPt) { lastPt = { x: e.clientX, y: e.clientY }; return; }
    var d = Math.abs(e.clientX - lastPt.x) + Math.abs(e.clientY - lastPt.y); lastPt = { x: e.clientX, y: e.clientY };
    stroke += d * 0.35;
    if (stroke > 260) { stroke = 0; pet(true); }
  });
  function endDrag() {
    if (!dragging) { down = null; return; }
    dragging = false; down = null; dock.classList.remove("held"); dock.style.transition = "";
    dock.classList.remove("land"); void dock.offsetWidth; dock.classList.add("land");
    setMood("happy", 1600); say(["Nice spot! 🐾", "I like it here!", "*sniff sniff* Good view! 👀"][Math.floor(Math.random() * 3)], 1800);
  }
  btn.addEventListener("pointerup", endDrag);
  btn.addEventListener("pointercancel", endDrag);
  btn.addEventListener("pointerleave", function () { if (!down) lastPt = null; });
  addEventListener("resize", function () { place(pos.x, pos.y); });

  // Walking around the screen on his own.
  var walkT = null;
  function cancelWalk() { clearTimeout(walkT); dock.classList.remove("walking", "run"); }
  function walkTo(x, y, cb) {
    var b = bounds(); x = Math.max(b.minX, Math.min(0, x)); y = Math.max(b.minY, Math.min(0, y));
    var dist = Math.hypot(x - pos.x, y - pos.y), ms = reduce ? 10 : Math.max(500, Math.min(4200, dist / 0.22));
    dock.style.setProperty("--walk", ms + "ms");
    dock.classList.add("walking", "run");
    place(x, y);
    walkT = setTimeout(function () { dock.classList.remove("walking", "run"); if (cb) cb(); }, ms);
  }
  function roam() {
    if (!idleOK() || reduce) return;
    var b = bounds(), home = Math.random() < 0.25;
    var x = home ? 0 : b.minX * Math.random(), y = home ? 0 : b.minY * (0.15 + Math.random() * 0.85);
    setMood("happy"); playing = true;
    walkTo(x, y, function () {
      playing = false;
      var lines = ["*sniff sniff* 🐾", "Ooh, nice view from here!", "Just exploring! 🗺", "This spot smells like adventure ✈", "La la la… 🎶"];
      if (Math.random() < 0.6) say(lines[Math.floor(Math.random() * lines.length)], 2000);
      if (Math.random() < 0.3) { dock.classList.remove("hop"); void dock.offsetWidth; dock.classList.add("hop"); }
    });
  }
  btn.addEventListener("click", function () {
    if (dragged) { dragged = false; return; }
    if (busy) return;
    poke();
    var now = Date.now(); taps = taps.filter(function (x) { return now - x < 3500; }); taps.push(now);
    if (taps.length >= 7) { taps = []; setMood("dizzy", 3000); dock.classList.remove("spin"); void dock.offsetWidth; dock.classList.add("spin"); say("Whoaaa… everything is spinning… 😵‍💫", 2600, "whine"); return; }
    if (taps.length >= 4) { setMood("grumpy", 2200); say(["Hey! Too many boops! 😤", "Grr… gently, please! 😤"][now % 2], 2000, "growl"); return; }
    bark();
    toggle();
  });
  function bark() {
    dock.classList.remove("hop"); void dock.offsetWidth; dock.classList.add("hop");
    var lines = mood === "hungry" ? ["Woof… tummy rumbling 🦴", "Snack first? 🥺"] : ["Woof! 🐾", "Arf arf!", "Yip! Trip time? ✈", "Woof woof! 💛"];
    say(lines[Math.floor(Math.random() * lines.length)], 1800, mood === "hungry" ? "whine" : "yips");
    if (mood !== "hungry") setMood("excited", 1400);
  }
  function pet(fromStroke) {
    poke();
    st.joy = Math.min(100, st.joy + 12); save(); meters();
    setMood("love", 2600); fx(["💗", "💛", "🤍"], 4, "heart");
    say(fromStroke ? "Hehe, that tickles! 💗" : "Aww, I love pets! 💗", 2200, "happy");
  }
  function feed() {
    if (busy) return; poke();
    if (st.hunger > 92) { setMood("happy", 1500); say("I'm full! Maybe later? 😋", 2000, true); return; }
    busy = true;
    var bowl = $("leo-bowl"); bowl.classList.remove("eaten"); bowl.classList.add("show", "fill");
    say("Treats?! For me?! 🦴", 1500, "yips"); setMood("excited");
    setTimeout(function () {
      setMood("eating"); dock.classList.add("eat"); woof("munch");
      fx(["·", "•", "·"], 3, "crumb");
      setTimeout(function () {
        dock.classList.remove("eat"); bowl.classList.add("eaten");
        st.hunger = 100; st.joy = Math.min(100, st.joy + 8); save(); meters();
        setMood("love", 2600); fx(["💛", "😋"], 2, "heart"); say("Yum! Best treat ever. Thank you! 😋", 2400, "happy");
        setTimeout(function () { bowl.classList.remove("show", "fill"); busy = false; }, 900);
      }, 2000);
    }, 900);
  }
  function fetchBall() {
    if (busy) return; poke(); busy = true;
    if (st.hunger < 15) { busy = false; setMood("hungry"); say("Too hungry to run… 🥺 Treat first?", 2400, "whine"); return; }
    var r = btn.getBoundingClientRect(), dir = r.left + r.width / 2 > innerWidth / 2 ? -1 : 1;
    var dist = Math.max(60, Math.min(320, dir < 0 ? r.left - 30 : innerWidth - r.right - 30));
    var sx = r.left + r.width * 0.5, sy = r.top + r.height * 0.55, ex = sx + dir * dist, ey = r.bottom - 14;
    ball.style.left = "0px"; ball.style.top = "0px"; ball.classList.add("show");
    say("Ball!! 🎾", 1400, "yips"); setMood("excited");
    var thrown = ball.animate([
      { transform: "translate(" + sx + "px," + sy + "px) rotate(0)" },
      { transform: "translate(" + (sx + ex) / 2 + "px," + (sy - 150) + "px) rotate(360deg)", offset: 0.45 },
      { transform: "translate(" + ex + "px," + ey + "px) rotate(600deg)", offset: 0.8 },
      { transform: "translate(" + (ex + dir * 12) + "px," + (ey - 26) + "px) rotate(680deg)", offset: 0.9 },
      { transform: "translate(" + (ex + dir * 18) + "px," + ey + "px) rotate(720deg)" }
    ], { duration: reduce ? 10 : 1100, easing: "cubic-bezier(.3,.6,.4,1)", fill: "forwards" });
    thrown.onfinish = function () {
      dock.classList.add("run", "flip");
      var go = dock.animate([{ transform: "translateX(0)" }, { transform: "translateX(" + dir * (dist - 10) + "px)" }], { duration: reduce ? 10 : 800, easing: "ease-in", fill: "forwards" });
      go.onfinish = function () {
        ball.classList.remove("show"); dock.classList.add("has-ball"); dock.classList.remove("flip");
        setTimeout(function () {
          var back = dock.animate([{ transform: "translateX(" + dir * (dist - 10) + "px)" }, { transform: "translateX(0)" }], { duration: reduce ? 10 : 850, easing: "ease-out", fill: "forwards" });
          back.onfinish = function () {
            dock.classList.remove("run", "has-ball"); go.cancel(); back.cancel(); thrown.cancel();
            st.joy = Math.min(100, st.joy + 15); st.hunger = Math.max(0, st.hunger - 6); save(); meters();
            var pl = Math.random() < 0.5; setMood(pl ? "playful" : "excited", 2400); fx(["⭐", "✨"], 3, "heart"); say(pl ? "Hehe, I'm the fastest pup in the world! 😜" : "Got it! Again? Again?! 🎾", 2400, "pant");
            busy = false;
          };
        }, 260);
      };
    };
  }
  function toggle(open) {
    var show = open === undefined ? panel.hidden : open;
    if (show && (pos.x || pos.y)) { cancelWalk(); walkTo(0, 0); }
    panel.hidden = !show; btn.setAttribute("aria-expanded", show);
    dock.classList.toggle("open", show);
    if (show && !$("leo-log").children.length) greet();
    if (show && pendingHunt) { log(pendingHunt); pendingHunt = null; }
  }
  $("leo-close").addEventListener("click", function () { toggle(false); });
  panel.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    if (b.dataset.leo === "feed") feed();
    else if (b.dataset.leo === "fetch") fetchBall();
    else if (b.dataset.leo === "pet") pet(false);
    else if (b.dataset.leo === "suggest") ask("Suggest 3 great value trips for me");
    else if (b.dataset.ask) ask(b.dataset.ask);
    else if (b.dataset.day) { window.DD.pickDay(b.dataset.day); say("Switched! Good choice 🐾", 2000); setMood("love", 1800); }
    else if (b.dataset.hotels) { window.DD.hotelsIn(b.dataset.hotels); say("Finding comfy beds… 🛏", 2200); setMood("happy", 1500); if (innerWidth < 700) toggle(false); }
    else if (b.dataset.fly) { var p = b.dataset.fly.split("|"); window.DD.flyTo(p[0], p[1]); say("Pawsome choice! Fetching flights… ✈", 2400); setMood("excited", 2000); if (innerWidth < 700) toggle(false); }
  });
  $("leo-form").addEventListener("submit", function (e) { e.preventDefault(); var v = $("leo-input").value.trim(); if (!v) return; $("leo-input").value = ""; ask(v); });
  setVoice(soundOn);
  $("leo-voice").addEventListener("click", function () { setVoice(!soundOn); if (soundOn) woof("yips"); });


  // ---------- trip ideas ----------
  var THEME = {
    beach: "kerala overwater bali thai marina halong",
    culture: "mosque taj gateway colosseum parthenon sagrada pyramids kasbah mayan machu thai wall eiffel london canals",
    mountains: "himalaya alps kilimanjaro fuji nz table machu",
    city: "burj london eiffel liberty bridge skyline marina petronas hongkong sydney",
    nature: "kilimanjaro halong nz table himalaya redeemer bali"
  };
  var PALTHEME = { tropic: "beach", lagoon: "beach", savanna: "nature", nordic: "mountains", mist: "mountains", andes: "mountains", city: "city", desert: "culture" };
  function themesOf(code) {
    var i = A && A.info ? A.info(code) : null, out = [];
    if (!i) return out;
    Object.keys(THEME).forEach(function (t) { if ((" " + THEME[t] + " ").indexOf(" " + i.comp + " ") >= 0) out.push(t); });
    if (PALTHEME[i.pal] && out.indexOf(PALTHEME[i.pal]) < 0) out.push(PALTHEME[i.pal]);
    return out;
  }
  var cache = {};
  function candidates(home, month) {
    var k = home + month;
    if (!cache[k]) {
      var r = M.explore({ from: home, month: month });
      cache[k] = (r.results || []).map(function (x) { return { code: x.to.code, city: x.to.city, country: x.to.country, price: x.price, date: x.date, stops: x.stops, airline: x.airline, themes: themesOf(x.to.code) }; });
    }
    return cache[k];
  }
  var MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  function parse(text) {
    var t = text.toLowerCase(), q = { themes: [], budget: 0, month: null, home: null, surprise: /surprise|random|anywhere/.test(t) };
    var m = t.match(/(?:under|below|less than|max|budget|\$|usd|aed|inr|₹)\s*\$?\s*([\d,]{2,7})/) || t.match(/([\d,]{3,6})\s*(?:\$|usd|dollars)/);
    if (m) q.budget = +m[1].replace(/,/g, "");
    if (/beach|sea|island|sun|swim|honeymoon|relax|maldives|ocean/.test(t)) q.themes.push("beach");
    if (/culture|history|temple|mosque|museum|heritage|ancient|art/.test(t)) q.themes.push("culture");
    if (/mountain|snow|hike|trek|ski|cold|alps|himalaya/.test(t)) q.themes.push("mountains");
    if (/city|shopping|nightlife|food|weekend|skyline/.test(t)) q.themes.push("city");
    if (/safari|nature|wildlife|jungle|green|waterfall/.test(t)) q.themes.push("nature");
    MONTHS.forEach(function (mm, i) { if (new RegExp("\\b" + mm).test(t)) { var y = new Date().getUTCFullYear(), now = new Date().getUTCMonth(); q.month = (i < now ? y + 1 : y) + "-" + String(i + 1).padStart(2, "0"); } });
    var f = t.match(/from ([a-z .'-]{3,30})/);
    if (f) { var a = M.find(f[1].trim().replace(/\b(in|under|for|with|to)\b.*$/, "").trim()); if (a) q.home = a.code; }
    return q;
  }
  function localPicks(text) {
    var q = parse(text), home = q.home || window.DD.home(), month = q.month || window.DD.month();
    var list = candidates(home, month).slice();
    var budget = q.budget ? q.budget / (rate() || 1) : 0;
    if (budget) list = list.filter(function (c) { return c.price <= budget; });
    if (q.themes.length) list = list.filter(function (c) { return c.themes.some(function (x) { return q.themes.indexOf(x) >= 0; }); });
    if (q.surprise) list.sort(function () { return Math.random() - 0.5; });
    var picks = [], seen = {};
    list.forEach(function (c) { if (picks.length < 3 && !seen[c.country]) { seen[c.country] = 1; picks.push(c); } });
    var home_ = M.airport(home);
    var reply;
    if (!picks.length) reply = "Hmm, my nose found nothing" + (q.budget ? " under that budget" : "") + ". Try a higher budget or another month? 🐾";
    else reply = (q.surprise ? "Ooh, surprise! " : "Sniff sniff… found them! ") + "Best value " + (q.themes.length ? q.themes.join(" & ") + " " : "") + "trips from " + home_.city + " in " + monthName(month) + ":";
    return { reply: reply, picks: picks.map(function (c) { return { c: c, why: whyLocal(c, q.themes) }; }), mood: picks.length ? "excited" : "sad" };
  }
  function whyLocal(c, want) {
    var t = (want || []).filter(function (x) { return c.themes.indexOf(x) >= 0; })[0] || c.themes[0], w = { beach: "sun, sea and slow days", culture: "history on every corner", mountains: "fresh air and big views", city: "lights, food and shopping", nature: "wild, green and beautiful" }[t] || "a great-value escape";
    return w + (c.stops ? "" : " · direct flights");
  }
  function monthName(m) { return new Date(m + "-01T00:00:00Z").toLocaleDateString("en-GB", { month: "long", timeZone: "UTC" }); }
  function rate() { var probe = window.DD.money(1000); var n = +probe.replace(/[^\d.]/g, ""); return n / 1000; }

  // ---------- who am I talking to ----------
  var nick = store("dd-leo-name") || "";
  function who() { return nick; }
  var visits = +(store("dd-leo-visits") || 0) + 1, lastSeen = +(store("dd-leo-seen") || 0);
  store("dd-leo-visits", String(visits)); store("dd-leo-seen", String(Date.now()));

  // ---------- facts Leo knows ----------
  var SEASON = {
    gulf: ["November to March", "warm sunny days around 25°C; summer is very hot"], india: ["October to March", "dry and pleasant; June to September is monsoon"],
    sea: ["November to March", "the drier, cooler season; expect tropical showers otherwise"], islands: ["December to April", "calm seas and sunshine"],
    eastasia: ["March to May or October to November", "spring blossoms and crisp autumn colours"], europe: ["May to September", "long sunny days; December is great for Christmas markets"],
    egypt: ["October to April", "comfortable for sightseeing; summers are scorching"], africa: ["June to October", "the dry season, best for safaris"],
    na: ["April to June or September to October", "mild weather and fewer crowds"], latam: ["December to April", "the drier months across much of the region"],
    oceania: ["September to November or March to May", "mild spring and autumn weather"]
  };
  var JOKES = ["Why did the Pomeranian sit in the airport? He heard it had the best *terminal* naps. 😴",
    "What's a dog's favourite airline seat? The *pup*-grade! ✈", "I tried to pack light… but my fur counts as a carry-on. 🐾",
    "Why do dogs love hotels? Room service brings *treats*! 🦴"];
  var PACK = { beach: "sunscreen, sunglasses, light cotton clothes, flip-flops and a reusable water bottle", mountains: "warm layers, a waterproof jacket, good walking shoes and lip balm",
    culture: "comfy walking shoes, a scarf for covering shoulders at religious sites, and a small day bag", city: "comfy shoes, a power bank, a travel card app and one smart outfit",
    nature: "insect repellent, neutral-coloured clothes, binoculars and a hat" };

  var SEASON_CITY = { DPS: ["April to October", "Bali's dry, sunny season"], CGK: ["May to September", "the dry season"], RAK: ["March to May or September to November", "warm days without the summer heat"], CMN: ["April to October", "sunny and mild by the Atlantic"],
    CPT: ["November to March", "Cape Town's warm, dry summer"], JNB: ["March to May or September to November", "mild and sunny"], NRT: ["late March to May or October to November", "cherry blossoms or autumn leaves"], KTM: ["October to November or March to April", "clear mountain views"] };
  function cityFrom(text) {
    var t = text.toLowerCase().replace(/[?!.,]/g, " ");
    var m = t.match(/(?:to|in|visit|visiting|for|about|at)\s+([a-zà-ÿ .'-]{2,30})$/) || t.match(/(?:to|in|visit|visiting|for|about|at)\s+([a-zà-ÿ'-]+(?:\s[a-zà-ÿ'-]+)?)/);
    var cand = [];
    if (m) { var w = m[1].trim().split(/\s+/); cand.push(w.slice(0, 3).join(" "), w.slice(0, 2).join(" "), w[0]); }
    t.split(/\s+/).forEach(function (w, i, arr) { if (w.length > 2) cand.push(arr.slice(i, i + 2).join(" "), w); });
    var stop = /^(the|and|for|from|with|trip|trips|cheap|cheapest|flight|flights|hotel|hotels|best|time|visit|go|to|in|me|my|a|an|under|day|days|what|when|how|much|is|it|there|please|leo|can|you|weather|pack|packing)$/;
    for (var i = 0; i < cand.length; i++) { var c = cand[i]; if (!c || stop.test(c)) continue; var a = M.find(c); if (a) return a; }
    // typo-proof: "londn", "dubay", "bangkock"
    var best = null;
    t.split(/\s+/).forEach(function (w) {
      if (w.length < 4 || stop.test(w)) return;
      M.AIRPORTS.forEach(function (ap) { var n = ap.city.toLowerCase(); if (Math.abs(n.length - w.length) > 2) return; var d = lev(w, n); if (d <= (n.length > 6 ? 2 : 1) && (!best || d < best.d)) best = { a: ap, d: d }; });
    });
    return best ? best.a : null;
  }
  function citiesIn(text) {
    var out = [], seen = {};
    text.toLowerCase().split(/\s*(?:,|\bor\b|\band\b|\bvs\.?|\bversus\b|\bwith\b)\s*/).forEach(function (part) { var a = cityFrom(part); if (a && !seen[a.code]) { seen[a.code] = 1; out.push(a); } });
    return out;
  }
  function lev(a, b) {
    var m = [], i, j; for (i = 0; i <= b.length; i++) m[i] = [i]; for (j = 0; j <= a.length; j++) m[0][j] = j;
    for (i = 1; i <= b.length; i++) for (j = 1; j <= a.length; j++) m[i][j] = Math.min(m[i - 1][j - 1] + (b[i - 1] === a[j - 1] ? 0 : 1), m[i][j - 1] + 1, m[i - 1][j] + 1);
    return m[b.length][a.length];
  }
  // Cheapest round trip in a month: the return is always "nights" after the outbound day.
  function cheapestRound(from, to, month, nights) {
    nights = Math.max(1, nights || 4);
    var best = null;
    cheapestMonthDays(from, to, month).slice(0, 8).forEach(function (o) {
      var d = new Date(o.date + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + nights);
      var bd = d.toISOString().slice(0, 10), r = M.searchFlights({ from: to, to: from, date: bd, adults: 1 });
      if (!r.offers || !r.offers.length) return;
      var b = r.offers.reduce(function (a, c) { return c.price < a.price ? c : a; });
      var back = { date: bd, price: b.price, airline: b.airline, stops: b.stops };
      if (!best || o.price + back.price < best.total) best = { out: o, back: back, total: o.price + back.price };
    });
    return best;
  }
  function hotelNight(code, stars, month) {
    var g = M.searchHotels({ city: code, checkin: month + "-10", checkout: month + "-11", guests: 2 });
    var t = (g.tiers || []).filter(function (x) { return x.stars === stars; })[0]; return t ? t.perNight : 0;
  }
  function cheapestMonthDays(from, to, month) {
    var out = [];
    for (var d = 1; d <= 28; d++) {
      var date = month + "-" + String(d).padStart(2, "0"), r = M.searchFlights({ from: from, to: to, date: date, adults: 1 });
      if (r.offers && r.offers.length) { var o = r.offers.reduce(function (a, b) { return b.price < a.price ? b : a; }); out.push({ date: date, price: o.price, airline: o.airline, stops: o.stops }); }
    }
    return out.sort(function (a, b) { return a.price - b.price; });
  }
  function nice(d) { return new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }); }
  function btns(list) { return '<div class="lp-quick">' + list.map(function (b) { return '<button type="button" ' + b[1] + ">" + b[0] + "</button>"; }).join("") + "</div>"; }

  var lastCity = null;
  // Leo's own brain: understands the common questions without any outside help.
  function localBrain(text) {
    var t = text.toLowerCase().trim(), name = who(), home = window.DD.home(), homeA = M.airport(home), month = parse(text).month || window.DD.month();
    var nm = text.match(/(?:my name is|i am|i'm|im|call me)\s+([a-zà-ÿ][a-zà-ÿ'-]{1,18})/i);
    if (nm && !/^(going|looking|from|in|at|flying|travel|so|not|a|the|fine|good|ok|okay|hungry|bored|here)$/i.test(nm[1])) {
      nick = nm[1].charAt(0).toUpperCase() + nm[1].slice(1).toLowerCase(); store("dd-leo-name", nick);
      return { html: "<p>Nice to meet you, <b>" + esc(nick) + "</b>! 💛 I'll remember you. Where shall we fly first?</p>" + btns([["✈ Best deals for me", 'data-ask="Suggest 3 great value trips for me"'], ["🏖 A beach escape", 'data-ask="A beach trip"']]), mood: "love" };
    }
    if (/^(hi|hey|hello|hii+|yo|salam|namaste|good (morning|afternoon|evening))\b/.test(t)) return { html: "<p>" + hello() + " What are we planning today?</p>" + quickMenu(), mood: "excited" };
    if (/good boy|you're cute|so cute|cute|handsome|smart|clever|best dog/.test(t)) return { html: "<p>Aww, stop it… *hides face in paws* 🙈 You're the best" + (name ? ", " + esc(name) : "") + "!</p>", mood: "shy" };
    if (/love you/.test(t)) return { html: "<p>I love you too" + (name ? ", " + esc(name) : "") + "! 💛 *happy zoomies*</p>", mood: "love" };
    if (/thank|thanks|thx/.test(t)) return { html: "<p>Anytime" + (name ? ", " + esc(name) : "") + "! That's what trip buddies are for. 🐾</p>", mood: "happy" };
    if (/joke|funny|laugh/.test(t)) return { html: "<p>" + JOKES[Math.floor(Math.random() * JOKES.length)] + "</p>", mood: "laughing" };
    if (/bad dog|stupid|hate you|useless/.test(t)) return { html: "<p>*ears droop* Oh… I'll try harder, promise. 🥺</p>", mood: "sad" };
    if (/angry|mad|grr/.test(t)) return { html: "<p>Grrr! 😤 …just kidding, I can't stay grumpy for long.</p>", mood: "grumpy" };
    if (/your name|who are you|what are you/.test(t)) return { html: "<p>I'm <b>Leo</b>, a white Pomeranian and your trip buddy at DD Boys Travels! I sniff out cheap flights, cheapest days and hotels. 🐾" + (name ? "" : " What's your name?") + "</p>", mood: "happy" };
    if (/hungry|feed|treat|food/.test(t) && !cityFrom(text)) { setTimeout(feed, 400); return { html: "<p>Did someone say treats?! 🦴</p>", mood: "excited" }; }
    if (/play|ball|fetch/.test(t) && !cityFrom(text)) { setTimeout(fetchBall, 400); return { html: "<p>Ball time! Watch this! 🎾</p>", mood: "excited" }; }

    // what can you do
    if (/what can you do|help|how (do|does) (this|you) work|commands/.test(t)) return { html: "<p>Lots! Try:</p><ul class=\"lp-ul\"><li><i>5 days in Bali for 2</i>: full trip cost</li><li><i>Paris or London?</i>: I compare them</li><li><i>weekend trip under $200</i></li><li><i>direct flights to Doha</i></li><li><i>cheapest day to fly to Goa</i></li><li><i>best time to visit Japan</i>, <i>what to pack</i></li></ul>", mood: "happy" };
    // trip cost: "5 days in Bali for 2 people, luxury"
    var nd = t.match(/(\d{1,2})\s*(?:days?|nights?|d\b)/), cityT = cityFrom(text);
    if (nd && cityT && cityT.code !== home) {
      var nights = Math.max(1, +nd[1] - (/day/.test(nd[0]) ? 1 : 0)), ppl = +((t.match(/(?:for|x)\s*(\d{1,2})\s*(?:people|persons|adults|of us|pax)?/) || [])[1] || (/couple|two of us|honeymoon|wife|husband|partner/.test(t) ? 2 : /family/.test(t) ? 4 : 1));
      var stars = /luxury|5 ?star|lavish/.test(t) ? 5 : /budget|cheap|backpack|hostel/.test(t) ? 2 : /4 ?star|nice/.test(t) ? 4 : 3;
      var rt = cheapestRound(home, cityT.code, month, nights), night = hotelNight(cityT.code, stars, month), rooms = Math.ceil(ppl / 2);
      if (rt && night) {
        var fl = rt.total * ppl, ho = night * nights * rooms, daily = Math.round(night * 0.45) * ppl * (nights + 1), tot = fl + ho + daily;
        lastCity = cityT;
        return { html: "<p>🧮 <b>" + (nights + 1) + " days in " + esc(cityT.city) + "</b> for " + ppl + (ppl > 1 ? " people" : " person") + " in " + monthName(month) + ":</p><ul class=\"lp-ul\"><li>✈ Return flights: <b>" + window.DD.money(fl) + "</b> (out " + nice(rt.out.date) + ", back " + nice(rt.back.date) + ")</li><li>🏨 " + stars + "★ hotel, " + nights + " night" + (nights > 1 ? "s" : "") + (rooms > 1 ? ", " + rooms + " rooms" : "") + ": <b>" + window.DD.money(ho) + "</b></li><li>🍜 Food & fun: about <b>" + window.DD.money(daily) + "</b></li></ul><p>Total: about <b>" + window.DD.money(tot) + "</b>. These are estimates; the buttons show live prices.</p>" +
          btns([["✈ Flights", 'data-fly="' + cityT.code + "|" + rt.out.date + '"'], ["🏨 Hotels", 'data-hotels="' + cityT.code + '"']]), mood: tot / ppl < 600 ? "surprised" : "cool" };
      }
    }
    // compare two places
    var two = citiesIn(text).filter(function (a) { return a.code !== home; });
    if (two.length >= 2 && /\bor\b|\bvs\b|versus|compare|better|which/.test(t)) {
      var rows = two.slice(0, 3).map(function (a) { var r = cheapestRound(home, a.code, month, 4), hn = hotelNight(a.code, 3, month); return { a: a, fl: r ? r.total : 0, hn: hn, wk: (r ? r.total : 0) + hn * 4, th: themesOf(a.code)[0] }; });
      rows.sort(function (x, y) { return x.wk - y.wk; });
      return { html: "<p>⚖️ Comparing from " + esc(homeA.city) + " in " + monthName(month) + " (return flight + 4 nights 3★):</p><ul class=\"lp-ul\">" + rows.map(function (r, i) { return "<li>" + (i ? "" : "🏆 ") + "<b>" + esc(r.a.city) + "</b>: about " + window.DD.money(r.wk) + " (flights " + window.DD.money(r.fl) + ", hotel ~" + window.DD.money(r.hn) + "/night)" + (r.th ? ", great for " + r.th : "") + "</li>"; }).join("") + "</ul><p><b>" + esc(rows[0].a.city) + "</b> is the better deal by " + window.DD.money(rows[rows.length - 1].wk - rows[0].wk) + "!</p>" +
        btns(rows.slice(0, 2).map(function (r) { return ["✈ " + esc(r.a.city), 'data-fly="' + r.a.code + "|" + month + '-12"']; })), mood: "cool" };
    }
    // weekend getaway
    if (/weekend|short trip|quick trip|2 days|getaway/.test(t)) {
      var now = new Date(), fri = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + ((5 - now.getUTCDay() + 7) % 7 || 7) + (/next weekend/.test(t) ? 7 : 0)));
      var fd = fri.toISOString().slice(0, 10), bud = parse(text).budget ? parse(text).budget / (rate() || 1) : 0;
      var near = M.AIRPORTS.filter(function (a) { var dg = Math.hypot(a.lat - homeA.lat, a.lon - homeA.lon); return a.code !== home && dg < 28 && dg > 3.2; }).map(function (a) {
        var r = M.searchFlights({ from: home, to: a.code, date: fd, adults: 1 }), o = (r.offers || []).sort(function (x, y) { return x.price - y.price; })[0];
        return o ? { c: { code: a.code, city: a.city, country: a.country, price: o.price, date: fd, stops: o.stops, themes: themesOf(a.code) }, mins: o.durationMin } : null;
      }).filter(function (x) { return x && x.mins < 330 && (!bud || x.c.price <= bud); }).sort(function (x, y) { return x.c.price - y.c.price; }).slice(0, 3);
      if (near.length) return { html: render({ reply: "Weekend escape! Short flights from " + homeA.city + " leaving Fri " + fd.slice(8) + ":", picks: near.map(function (x) { return { c: x.c, why: Math.floor(x.mins / 60) + "h " + x.mins % 60 + "m flight · " + whyLocal(x.c) }; }) }), mood: "excited" };
    }
    // direct flights / flight time
    if (cityT && cityT.code !== home && /direct|non.?stop|how long|flight time|duration|hours/.test(t)) {
      var dr = M.searchFlights({ from: home, to: cityT.code, date: month + "-12", adults: 1 }), offs = (dr.offers || []);
      var dir = offs.filter(function (o) { return !o.stops; }).sort(function (a, b) { return a.price - b.price; }), fast = offs.slice().sort(function (a, b) { return a.durationMin - b.durationMin; })[0];
      lastCity = cityT;
      return { html: "<p>" + (fast ? "The flight from " + esc(homeA.city) + " to <b>" + esc(cityT.city) + "</b> takes about <b>" + Math.floor(fast.durationMin / 60) + "h " + fast.durationMin % 60 + "m</b> at its fastest (" + Math.round(dr.distanceKm || 0).toLocaleString("en-US") + " km). " : "") +
        (dir.length ? "Direct airlines: " + dir.filter(function (o, i, arr) { return arr.findIndex(function (x) { return x.airline === o.airline; }) === i; }).slice(0, 4).map(function (o) { return esc(o.airline) + " from " + window.DD.money(o.price); }).join(", ") + "." : "No direct flights on this route; the best connections go via " + (offs[0] && offs[0].via.length ? offs[0].via.join(", ") : "a hub") + ".") + "</p>" + btns([["✈ See flights", 'data-fly="' + cityT.code + "|" + month + '-12"']]), mood: dir.length ? "cool" : "curious" };
    }
    // visas: honest pointer
    if (/visa|passport|entry/.test(t)) return { html: "<p>Visa rules depend on your passport" + (cityT ? " and " + esc(cityT.country) + "'s current policy" : "") + ". Please check the official government or embassy website before booking. I'd hate for you to get stuck at the gate! 🛂🐾</p>", mood: "curious" };
    var city = cityFrom(text);
    if (!city && /\b(there|it|that|same|this)\b/.test(t) && lastCity) city = lastCity;   // follow-ups remember the last place
    if (city) lastCity = city;
    if (city && /best time|when.*(visit|go)|season|weather|climate/.test(t)) {
      var s = SEASON_CITY[city.code] || SEASON[city.region] || SEASON.europe;
      return { html: "<p>The best time to visit <b>" + esc(city.city) + "</b> is usually <b>" + s[0] + "</b>: " + s[1] + ".</p>" + btns([["✈ Flights to " + esc(city.city), 'data-fly="' + city.code + "|" + month + '-10"'], ["📅 Cheapest day", 'data-ask="Cheapest day to fly to ' + esc(city.city) + '"']]), mood: "happy" };
    }
    if (/pack|bring|carry/.test(t)) {
      var th = (city ? themesOf(city.code)[0] : parse(text).themes[0]) || "city";
      return { html: "<p>For " + (city ? "<b>" + esc(city.city) + "</b>" : "that trip") + " I'd pack " + PACK[th] + ". And a treat for me, obviously. 🦴</p>", mood: "happy" };
    }
    if (city && city.code !== home && /cheap(est)? (day|date|time)|when.*cheap|which day|best day/.test(t)) {
      var days = cheapestMonthDays(home, city.code, month), d = days[0], w = days[days.length - 1];
      if (d) return { html: "<p>Sniff sniff… in <b>" + monthName(month) + "</b>, the cheapest day from " + esc(homeA.city) + " to <b>" + esc(city.city) + "</b> is <b>" + nice(d.date) + "</b> at about <b>" + window.DD.money(d.price) + "</b> (" + esc(d.airline) + ", " + (d.stops ? d.stops + " stop" : "direct") + "). The priciest is " + nice(w.date) + " at " + window.DD.money(w.price) + ", so you'd save " + window.DD.money(w.price - d.price) + "!</p>" + btns([["✈ Search " + nice(d.date), 'data-fly="' + city.code + "|" + d.date + '"']]), mood: "excited" };
    }
    if (city && /hotel|stay|room|accommodation|resort/.test(t)) {
      var hs = window.DDHotels ? window.DDHotels.byCity(city.code) : [], g = M.searchHotels({ city: city.code, checkin: month + "-10", checkout: month + "-13", guests: 2 });
      var tiers = (g.tiers || []).map(function (x) { return x.stars + "★ ~" + window.DD.money(x.perNight); }).join(" · ");
      return { html: "<p>Hotels in <b>" + esc(city.city) + "</b> per night: " + tiers + "." + (hs.length ? " My favourites: " + hs.slice(0, 3).map(function (h) { return esc(h[0]); }).join(", ") + "." : "") + "</p>" + btns([["🏨 Show hotels in " + esc(city.city), 'data-hotels="' + city.code + '"']]), mood: "happy" };
    }
    if (city && city.code !== home && /flight|fly|how much|price|cost|ticket|go to|trip to|travel to/.test(t)) {
      var date = month + "-12", r = M.searchFlights({ from: home, to: city.code, date: date, adults: 1 });
      var offers = (r.offers || []).slice().sort(function (a, b) { return a.price - b.price; }), direct = offers.filter(function (o) { return !o.stops; })[0];
      if (offers.length) return { html: "<p>From " + esc(homeA.city) + " to <b>" + esc(city.city) + "</b> in " + monthName(month) + ", fares start around <b>" + window.DD.money(offers[0].price) + "</b> with " + esc(offers[0].airline) + (offers[0].stops ? " (1 stop)" : " (direct)") + "." + (direct && direct !== offers[0] ? " Cheapest direct: " + esc(direct.airline) + " at " + window.DD.money(direct.price) + "." : "") + " These are estimates, so tap below for every option.</p>" + btns([["✈ See all flights", 'data-fly="' + city.code + "|" + date + '"'], ["📅 Cheapest day", 'data-ask="Cheapest day to fly to ' + esc(city.city) + '"'], ["🏨 Hotels", 'data-hotels="' + city.code + '"']]), mood: "excited" };
    }
    var res = localPicks(text);
    if (res.picks.length && res.picks[0].c.price < 70) res.mood = "surprised";
    else if (res.picks.length && res.picks.every(function (p) { return !p.c.stops; })) res.mood = "cool";
    return { html: render(res), mood: res.mood, picks: res.picks.length };
  }
  function quickMenu() {
    return btns([["✈ Best deals for me", 'data-ask="Suggest 3 great value trips for me"'], ["🏖 Beach under $300", 'data-ask="A beach trip under $300"'], ["🏔 Mountains", 'data-ask="Mountains and snow"'], ["🕌 Culture", 'data-ask="History and culture"'], ["🎲 Surprise me", 'data-ask="Surprise me"'], ["😂 Tell a joke", 'data-ask="Tell me a joke"']]);
  }

  function log(html, who) {
    var d = document.createElement("div");
    d.className = "lp-msg " + (who || "leo"); d.innerHTML = html;
    var lg = $("leo-log"); lg.appendChild(d); lg.scrollTop = lg.scrollHeight;
    return d;
  }
  function render(res) {
    var h = res.reply ? "<p>" + esc(res.reply) + "</p>" : "";
    if (res.picks && res.picks.length) h += '<div class="lp-picks">' + res.picks.map(function (p, i) {
      var c = p.c;
      return '<div class="lp-pick" style="animation-delay:' + i * 90 + 'ms"><img src="' + (A ? A.thumb(c.code, 160, 200) : "") + '" alt=""><div class="lp-pi"><b>' + esc(c.city) + '</b><span>' + esc(c.country) + " · from " + window.DD.money(c.price) + '</span><small>' + esc(p.why) + '</small></div><button type="button" data-fly="' + c.code + "|" + c.date + '">Flights ✈</button></div>';
    }).join("") + "</div>";
    if (res.picks && res.picks.length) h += '<div class="lp-note">Estimated fares · tap Flights for every option</div>';
    return h;
  }
  var asking = false, chatLog = [];
  function ask(text) {
    if (asking) return; asking = true;
    poke();
    log(esc(text), "you");
    chatLog.push({ role: "user", text: text });
    var wait = log('<span class="dots"><i></i><i></i><i></i></span> <span class="wt">Leo is thinking…</span>', "leo thinking");
    setMood("curious");
    var started = Date.now();
    Promise.resolve(null).then(function () {
      var res = localBrain(text);
      setTimeout(function () {
        wait.className = "lp-msg leo"; wait.innerHTML = res.html;
        talk(null, { mood: res.mood || "happy" });
        $("leo-log").scrollTop = $("leo-log").scrollHeight;
        chatLog.push({ role: "leo", text: res.reply || wait.textContent.slice(0, 300) });
        setMood(res.mood || "happy", 2600); if (res.mood === "excited") fx(["✈", "✨"], 2, "heart"); if (res.mood === "love") fx(["💛", "💗"], 3, "heart");
        st.joy = Math.min(100, st.joy + 4); save(); meters();
        asking = false;
      }, Math.max(0, 650 - (Date.now() - started)));
    });
  }
  function hello() {
    var h = new Date().getHours(), part = h < 5 ? "Up late" : h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : h < 22 ? "Good evening" : "Up late";
    var n = who(), away = lastSeen ? (Date.now() - lastSeen) / 86400e3 : 0;
    var s = part + (n ? ", " + esc(n) : "") + "! " + (h < 5 || h >= 22 ? "🌙" : h < 12 ? "☀️" : "🐾");
    if (visits > 1 && away > 2) s += " I missed you! It's been " + Math.round(away) + " days.";
    else if (visits > 1) s += " Welcome back!";
    return s;
  }
  function greet() {
    var c = window.DD.context(), l = c.legs[0], a = l && M.airport(l.from), b = l && M.airport(l.to);
    var html = "<p>" + hello() + " I'm <b>Leo</b>, your trip buddy. 🐾</p>";
    if (a && b) html += "<p>I see you're looking at <b>" + esc(a.city) + " → " + esc(b.city) + "</b>. Want the cheapest day, or hotels in " + esc(b.city) + "?</p>" + btns([["📅 Cheapest day", 'data-ask="Cheapest day to fly to ' + esc(b.city) + '"'], ["🏨 Hotels in " + esc(b.city), 'data-hotels="' + b.code + '"'], ["☀️ Best time to visit", 'data-ask="Best time to visit ' + esc(b.city) + '"']]);
    if (!who()) html += "<p>What's your name? Just tell me <i>“I'm …”</i> and I'll remember it.</p>";
    if (st.hunger < 30) html += "<p>Also… my tummy's rumbling. A treat? 🥺🦴</p>";
    log(html); talk(null, { kind: "yips" });
    log("<p>Or ask me anything: <i>beach under $300 in December</i>, <i>how much to Paris?</i>, <i>what to pack for Bali?</i></p>" + quickMenu());
    setMood("excited", 1800); wave();
  }
  function wave() { dock.classList.remove("waving"); void dock.offsetWidth; dock.classList.add("waving"); setTimeout(function () { dock.classList.remove("waving"); }, 2000); }

  // ---------- life ----------
  meters();
  setMood(baseMood());
  dock.classList.add("enter");
  setTimeout(function () {
    dock.classList.remove("enter"); wave();
    say(st.hunger < 30 ? hello().replace(/<[^>]+>/g, "") + " Could I have a treat? 🦴" : hello().replace(/<[^>]+>/g, "") + " Tap me for trip ideas!", 5200);
  }, 2200);
  setInterval(function () {
    st.hunger = Math.max(0, st.hunger - 0.8); st.joy = Math.max(0, st.joy - 0.4); save(); meters();
    if (!busy && ["happy", "hungry", "sleepy", "sad"].indexOf(mood) >= 0) {
      var b = baseMood();
      if (b !== mood) { setMood(b); if (b === "hungry") say("My tummy's rumbling… 🦴?", 3000); if (b === "sad") say("Play with me? 🎾", 3000); }
    }
  }, 15000);
  // Leo glances toward the pointer.
  if (!reduce) document.addEventListener("pointermove", function (e) {
    if (mood === "sleepy" || playing) return;
    var r = btn.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height * 0.4);
    var d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 300);
    dock.style.setProperty("--lx", (dx / d * 3.2 * k).toFixed(2) + "px");
    dock.style.setProperty("--ly", (dy / d * 2.4 * k).toFixed(2) + "px");
    dock.style.setProperty("--tilt", (dx / d * 5 * k).toFixed(2) + "deg");
  }, { passive: true });

  // ---------- free time: Leo chases butterflies, bubbles and leaves ----------
  var playing = false, track = null;
  var TOYS = {
    butterfly: '<svg viewBox="0 0 40 32" aria-hidden="true"><g class="wing wl"><path d="M20 16 C12 2 0 2 3 12 C5 18 14 18 20 16z" fill="#f2b33d"/><path d="M20 17 C12 20 6 28 11 29 C16 30 19 22 20 17z" fill="#e8834a"/><circle cx="9" cy="9" r="2.2" fill="#fff" opacity=".8"/></g><g class="wing wr"><path d="M20 16 C28 2 40 2 37 12 C35 18 26 18 20 16z" fill="#f2b33d"/><path d="M20 17 C28 20 34 28 29 29 C24 30 21 22 20 17z" fill="#e8834a"/><circle cx="31" cy="9" r="2.2" fill="#fff" opacity=".8"/></g><path d="M20 9 v16" stroke="#3a2a1a" stroke-width="2.4" stroke-linecap="round"/><path d="M20 9 q-3 -6 -6 -7 M20 9 q3 -6 6 -7" stroke="#3a2a1a" stroke-width="1" fill="none"/></svg>',
    blue: '<svg viewBox="0 0 40 32" aria-hidden="true"><g class="wing wl"><path d="M20 16 C12 2 0 2 3 12 C5 18 14 18 20 16z" fill="#6fb7f2"/><path d="M20 17 C12 20 6 28 11 29 C16 30 19 22 20 17z" fill="#8a7bf0"/></g><g class="wing wr"><path d="M20 16 C28 2 40 2 37 12 C35 18 26 18 20 16z" fill="#6fb7f2"/><path d="M20 17 C28 20 34 28 29 29 C24 30 21 22 20 17z" fill="#8a7bf0"/></g><path d="M20 9 v16" stroke="#2a2440" stroke-width="2.4" stroke-linecap="round"/></svg>',
    bubble: '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="14" fill="rgba(180,220,255,0.18)" stroke="rgba(200,230,255,0.85)" stroke-width="1.2"/><path d="M8 11 q3 -5 9 -5" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".9"/><circle cx="22" cy="21" r="2" fill="#fff" opacity=".5"/></svg>',
    leaf: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 26 C4 12 14 4 28 4 C28 18 20 28 6 26z" fill="#d9a441"/><path d="M6 26 L22 10" stroke="#9a6a1c" stroke-width="1.4"/></svg>'
  };
  function idleOK() { return !playing && !busy && !asking && panel.hidden && !document.hidden && Date.now() - lastPoke > 18e3 && ["happy", "sad"].indexOf(mood) >= 0 && st.hunger >= 30; }
  function lookAt(el) {
    cancelAnimationFrame(track);
    (function loop() {
      if (!el.isConnected) return;
      var r = btn.getBoundingClientRect(), t = el.getBoundingClientRect();
      var dx = t.left + t.width / 2 - (r.left + r.width / 2), dy = t.top + t.height / 2 - (r.top + r.height * 0.4), d = Math.hypot(dx, dy) || 1;
      dock.style.setProperty("--lx", (dx / d * 3.4).toFixed(2) + "px"); dock.style.setProperty("--ly", (dy / d * 2.6).toFixed(2) + "px");
      dock.style.setProperty("--tilt", (dx / d * 7).toFixed(2) + "deg");
      track = requestAnimationFrame(loop);
    })();
  }
  function playIdle() {
    if (!idleOK() || reduce) return;
    playing = true;
    var kinds = ["butterfly", "butterfly", "blue", "bubble", "leaf"], kind = kinds[Math.floor(Math.random() * kinds.length)];
    var toy = document.createElement("div"); toy.className = "leo-toy " + kind; toy.innerHTML = TOYS[kind]; toy.setAttribute("aria-hidden", "true");
    document.body.appendChild(toy);
    var r = btn.getBoundingClientRect(), small = innerWidth < 600, dir = r.left + r.width / 2 > innerWidth / 2 ? -1 : 1;
    var reach = Math.min(small ? 70 : 150, Math.max(30, dir < 0 ? r.left - 20 : innerWidth - r.right - 20));
    var hx = r.left + r.width * 0.5, hy = r.top + r.height * 0.15;            // just above Leo's head
    var sx = Math.max(20, Math.min(innerWidth - 20, hx + dir * (small ? 160 : 380))), sy = Math.max(60, hy - (small ? 220 : 300));
    if (sy > hy - 60) sy = Math.min(innerHeight - 40, hy + 220);              // near the top: it comes from below
    var px = hx + dir * reach, py = r.top + r.height * 0.35;                 // where Leo pounces
    var flutter = kind === "leaf" ? 18 : kind === "bubble" ? 10 : 26;
    function pt(x, y, k) { return { transform: "translate(" + x.toFixed(0) + "px," + y.toFixed(0) + "px) rotate(" + (kind === "leaf" ? k * 140 : Math.sin(k * 9) * 14).toFixed(0) + "deg)" }; }
    var frames = [];
    for (var k = 0; k <= 1.0001; k += 0.1) frames.push(pt(sx + (hx - sx) * k + Math.sin(k * 12) * flutter, sy + (hy - sy) * k + Math.cos(k * 10) * flutter, k));
    lookAt(toy); setMood("curious");
    say(["Ooh… what's that? 👀", "Is that… a butterfly?! 🦋", "Psst… something's moving 👀"][Math.floor(Math.random() * 3)], 2400);
    var arrive = toy.animate(frames, { duration: 3200, easing: "ease-in-out", fill: "forwards" });
    arrive.onfinish = function () {
      // hover teasingly over his nose
      var tease = toy.animate([pt(hx, hy, 1), pt(hx - 18, hy - 14, 1.2), pt(hx + 10, hy - 6, 1.4), pt(px + 40, py - 20, 1.6)], { duration: 1500, easing: "ease-in-out", fill: "forwards" });
      setMood("excited"); dock.classList.add("crouch");
      tease.onfinish = function () {
        dock.classList.remove("crouch"); dock.classList.add("run", "pounce");
        var jump = dock.animate([{ transform: "translate(0,0)" }, { transform: "translate(" + (dir * reach * 0.6) + "px,-46px)", offset: 0.5 }, { transform: "translate(" + (dir * reach) + "px,0)" }], { duration: 700, easing: "cubic-bezier(.3,.7,.4,1)", fill: "forwards" });
        if (kind === "bubble") {
          setTimeout(function () { toy.classList.add("pop"); setMood("surprised"); say("POP! 😲 …where did it go?", 2200); }, 380);
        } else {
          // it escapes just in time
          var ex = Math.max(20, Math.min(innerWidth - 20, px + dir * (small ? 60 : 160))), ey = Math.max(40, py - (small ? 260 : 380));
          setTimeout(function () { toy.animate([pt(px + 40, py - 20, 1.6), pt(px - 10, py - 90, 2), pt(ex, ey, 2.4)], { duration: 1600, easing: "ease-in", fill: "forwards" }); }, 220);
        }
        jump.onfinish = function () {
          dock.classList.remove("pounce");
          setTimeout(function () {
            var back = dock.animate([{ transform: "translate(" + (dir * reach) + "px,0)" }, { transform: "translate(0,0)" }], { duration: 900, easing: "ease-in-out", fill: "forwards" });
            back.onfinish = function () {
              jump.cancel(); back.cancel(); dock.classList.remove("run"); cancelAnimationFrame(track); toy.remove();
              var m = kind === "bubble" ? "laughing" : Math.random() < 0.5 ? "playful" : "happy";
              setMood(m, 2600); st.joy = Math.min(100, st.joy + 5); save(); meters();
              say(kind === "bubble" ? "Hehe, bubbles are the best! 🫧" : kind === "leaf" ? "Got the leaf! …oh wait, no. 🍂" : "Almost got it! Next time, butterfly! 😜", 2600);
              playing = false;
            };
          }, kind === "bubble" ? 900 : 1300);
        };
      };
    };
  }
  setInterval(function () { var r = Math.random(); if (r < 0.45) playIdle(); else if (r < 0.85) roam(); }, 22000);
  setTimeout(playIdle, 24000);

  // ---------- saying hi when you're on standby ----------
  var lastActive = Date.now(), lastHi = Date.now(), hiddenAt = 0;
  function nameBit(pre) { var n = who(); return n ? pre + esc(n) : ""; }
  function sayHi(text) {
    if (busy || playing) return;
    lastHi = Date.now(); wave();
    if (mood === "sleepy") setMood("happy", 2600); else setMood(mood === "hungry" ? "hungry" : "happy", 2600);
    say(text.replace(/&amp;/g, "&").replace(/&#39;/g, "'"), 4200, "bark");
  }
  ["pointermove", "keydown", "scroll", "touchstart"].forEach(function (ev) {
    window.addEventListener(ev, function () {
      var idle = Date.now() - lastActive; lastActive = Date.now();
      if (idle > 60e3 && Date.now() - lastHi > 20e3) sayHi("Oh! Welcome back" + nameBit(", ") + "! 👋 Missed you.");
    }, { passive: true });
  });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { hiddenAt = Date.now(); return; }
    if (hiddenAt && Date.now() - hiddenAt > 30e3) setTimeout(function () { sayHi("Hi again" + nameBit(", ") + "! 👋 I kept your seat warm."); }, 600);
  });
  setInterval(function () {
    var idle = Date.now() - lastActive;
    if (idle > 40e3 && Date.now() - lastHi > 75e3 && !document.hidden) {
      var lines = ["Hi" + nameBit(" ") + "! 👋 Still there? Want a trip idea?", "Psst" + nameBit(", ") + "… 👋 I found some cheap flights!",
        "Hello" + nameBit(", ") + "! 👋 Tap me if you need help.", "*waves paw* Hi" + nameBit(" ") + "! 🐾 Where shall we go next?"];
      sayHi(lines[Math.floor(Math.random() * lines.length)]);
    }
  }, 12000);

  // ---------- deal hunter: Leo checks every result and points out the best deal ----------
  var huntKey = "", huntT = null;
  function hunt() {
    var d = window.DD.deals && window.DD.deals(); if (!d) return;
    var key = d.kind === "flights" ? d.kind + d.leg.from + d.leg.to + d.leg.date : d.kind + d.city.code + d.nights;
    if (key === huntKey) { markPick(); return; }
    huntKey = key; poke();
    var html, bubble;
    if (d.kind === "flights" && d.offers.length) {
      var o = d.offers.slice(), cheapest = o.reduce(function (a, b) { return b.price < a.price ? b : a; });
      var minD = Math.min.apply(null, o.map(function (x) { return x.durationMin; }));
      var best = o.slice().sort(function (a, b) { return (a.price / cheapest.price) * 0.65 + (a.durationMin / minD) * 0.35 - ((b.price / cheapest.price) * 0.65 + (b.durationMin / minD) * 0.35); })[0];
      var direct = o.filter(function (x) { return !x.stops; }).sort(function (a, b) { return a.price - b.price; })[0];
      var pick = direct && direct.price <= cheapest.price * 1.15 ? direct : best;
      leoPick = pick.id;
      var cal = (d.calendar || []).slice().sort(function (a, b) { return a.price - b.price; })[0];
      var save = cal && cal.date !== d.leg.date ? cheapest.price - cal.price : 0;
      bubble = "🐾 Deal found! " + pick.airline + " " + window.DD.money(pick.price) + (pick.stops ? "" : ", direct") + (save > 5 ? ". Fly " + nice(cal.date) + " to save " + window.DD.money(save) + "!" : "!");
      html = "<p>🐾 <b>I sniffed through all " + o.length + " flights</b> from " + esc(d.from.city) + " to " + esc(d.to.city) + ".</p><p>My pick: <b>" + esc(pick.airline) + "</b> at <b>" + window.DD.money(pick.price) + "</b>" + (pick.stops ? " (1 stop)" : " (direct)") + ", " + Math.floor(pick.durationMin / 60) + "h " + pick.durationMin % 60 + "m. " +
        (pick.id !== cheapest.id ? "The cheapest is " + esc(cheapest.airline) + " at " + window.DD.money(cheapest.price) + ", but mine is " + (pick.stops ? "much faster" : "direct") + " for just " + window.DD.money(pick.price - cheapest.price) + " more." : "It's also the cheapest!") + "</p>" +
        (save > 5 ? "<p>💡 Tip: flying <b>" + nice(cal.date) + "</b> instead saves about <b>" + window.DD.money(save) + "</b>.</p>" + btns([["📅 Switch to " + nice(cal.date), 'data-day="' + cal.date + '"']]) : "");
      setMood(save > 20 ? "surprised" : "cool", 2600);
    } else if (d.kind === "hotels") {
      var hs = window.DDHotels ? window.DDHotels.byCity(d.city.code) : [];
      var t4 = (d.tiers || []).filter(function (x) { return x.stars === 4; })[0], t3 = (d.tiers || []).filter(function (x) { return x.stars === 3; })[0];
      var good = hs.filter(function (h) { return h[1] === 4; })[0] || hs.filter(function (h) { return h[1] === 3; })[0];
      leoHotel = good ? good[0] : null;
      bubble = "🐾 Best value here: " + (good ? good[0] : (t4 ? "a 4★ hotel" : "a 3★ hotel")) + "!";
      html = "<p>🐾 <b>Hotel hunt in " + esc(d.city.city) + ":</b> " + (t3 && t4 ? "4★ costs only about " + window.DD.money(t4.perNight - t3.perNight) + " more per night than 3★, so it's the sweet spot." : "") + (good ? " My pick: <b>" + esc(good[0]) + "</b> (" + good[1] + "★, " + esc(good[2]) + ")." : "") + "</p>";
      setMood("cool", 2400);
    } else return;
    say(bubble, 5200); fx(["🐾", "✨"], 2, "heart");
    if (!panel.hidden) log(html); else pendingHunt = html;
    markPick();
    // Leo trots over toward the result list
    if (!busy && !playing && !reduce) { var b = bounds(); walkTo(Math.max(b.minX, -Math.min(200, innerWidth * 0.12)), pos.y); }
  }
  var leoPick = null, leoHotel = null, pendingHunt = null;
  function markPick() {
    document.querySelectorAll(".leo-pick").forEach(function (e) { e.classList.remove("leo-pick"); });
    var el = leoPick && document.querySelector('[data-pick="' + leoPick + '"]');
    if (el) { var c = el.closest(".card"); if (c) c.classList.add("leo-pick"); }
    var hb = leoHotel && Array.prototype.filter.call(document.querySelectorAll("[data-hotel]"), function (b) { return b.dataset.hotel === leoHotel; })[0];
    if (hb) { var hc = hb.closest(".hcard"); if (hc) hc.classList.add("leo-pick"); }
  }
  var resultsEl = document.getElementById("results");
  if (resultsEl && "MutationObserver" in window) new MutationObserver(function () {
    clearTimeout(huntT); huntT = setTimeout(hunt, 700);
  }).observe(resultsEl, { childList: true });
  setTimeout(function () { if (!huntKey) hunt(); }, 6500);
  // He notices when you start a search.
  document.addEventListener("submit", function (e) { if (e.target && e.target.id !== "leo-form") { poke(); setMood("excited", 1600); say(["Ooh, where to? ✈", "I'll guard the luggage! 🧳", "Sniffing out cheap fares… 🐾"][Math.floor(Math.random() * 3)], 2200); } }, true);
})();
