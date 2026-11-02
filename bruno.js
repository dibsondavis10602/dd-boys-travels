// Guru: Leo's best friend, a black Indian street dog (an "Indie").
// He trots in now and then, greets Leo, plays a little, enjoys pets, and trots off again.
(function () {
  if (!window.Leo) return;
  var L = window.Leo, reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var FUR = "#17171b", FUR2 = "#2a2a31", TAN = "#a8743f", WHITE = "#f4f1ea", INK = "#0b0b0d";

  var svg =
    '<svg class="bruno" viewBox="0 0 220 220" aria-hidden="true">' +
    '<ellipse cx="110" cy="208" rx="62" ry="8" fill="rgba(0,0,0,.22)"/>' +
    // curly tail
    '<g class="b-tail"><path d="M158 150 C188 140 196 108 178 98 C166 92 156 104 166 112 C172 117 178 110 175 106" fill="none" stroke="' + FUR + '" stroke-width="15" stroke-linecap="round"/></g>' +
    // body and chest
    '<path d="M64 200 C58 160 70 124 110 118 C150 124 162 160 156 200 Z" fill="' + FUR + '"/>' +
    '<path d="M94 132 C100 150 120 150 126 132 C124 160 118 180 110 186 C102 180 96 160 94 132Z" fill="' + WHITE + '"/>' +
    // legs with white socks
    '<g class="b-legs"><rect class="b-leg l" x="80" y="160" width="20" height="46" rx="10" fill="' + FUR2 + '"/><rect class="b-leg r" x="120" y="160" width="20" height="46" rx="10" fill="' + FUR2 + '"/>' +
    '<ellipse cx="90" cy="203" rx="12" ry="6" fill="' + WHITE + '"/><ellipse cx="130" cy="203" rx="12" ry="6" fill="' + WHITE + '"/></g>' +
    // collar with tag
    '<path d="M80 122 Q110 136 140 122 L140 130 Q110 144 80 130Z" fill="#e2701c"/><circle cx="110" cy="140" r="6" fill="#f2c94c" stroke="#a37a12" stroke-width="1.5"/><text x="110" y="143" font-size="7" text-anchor="middle" font-weight="700" fill="#6b4c00">G</text>' +
    '<g class="b-head">' +
    // tall pointy ears
    '<g class="b-ear el"><path d="M70 58 L58 4 L100 40 Z" fill="' + FUR + '"/><path d="M73 50 L65 16 L92 40 Z" fill="#5a3b3b"/></g>' +
    '<g class="b-ear er"><path d="M150 58 L162 4 L120 40 Z" fill="' + FUR + '"/><path d="M147 50 L155 16 L128 40 Z" fill="#5a3b3b"/></g>' +
    // head and long snout
    '<ellipse cx="110" cy="72" rx="44" ry="40" fill="' + FUR + '"/>' +
    '<path d="M86 84 C88 112 132 112 134 84 C128 76 92 76 86 84Z" fill="' + FUR2 + '"/>' +
    '<path d="M104 90 C106 104 114 104 116 90 Z" fill="' + WHITE + '" opacity=".9"/>' +
    // tan "eyebrow" spots, like many Indies
    '<ellipse cx="92" cy="54" rx="6" ry="4" fill="' + TAN + '"/><ellipse cx="128" cy="54" rx="6" ry="4" fill="' + TAN + '"/>' +
    // eyes
    '<g class="b-eyes"><ellipse cx="93" cy="66" rx="7" ry="8" fill="#6b3d12"/><ellipse cx="127" cy="66" rx="7" ry="8" fill="#6b3d12"/><circle cx="93" cy="67" r="4.2" fill="' + INK + '"/><circle cx="127" cy="67" r="4.2" fill="' + INK + '"/><circle cx="95" cy="64" r="1.8" fill="#fff"/><circle cx="129" cy="64" r="1.8" fill="#fff"/></g>' +
    '<g class="b-blink"><path d="M86 66 q7 5 14 0" stroke="' + INK + '" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M120 66 q7 5 14 0" stroke="' + INK + '" stroke-width="2.5" fill="none" stroke-linecap="round"/></g>' +
    // nose, mouth, tongue
    '<ellipse cx="110" cy="88" rx="8" ry="5.5" fill="' + INK + '"/><ellipse cx="108" cy="86.5" rx="2.5" ry="1.4" fill="#555"/>' +
    '<path d="M110 93 v5 M110 98 q-7 6 -12 1 M110 98 q7 6 12 1" stroke="' + INK + '" stroke-width="2" fill="none" stroke-linecap="round"/>' +
    '<path class="b-tongue" d="M104 101 q6 15 12 0 q-6 3 -12 0z" fill="#e87d8d"/>' +
    "</g></svg>";

  var dock = document.createElement("div");
  dock.className = "bruno-dock"; dock.setAttribute("aria-hidden", "false");
  dock.innerHTML = '<div class="bruno-bubble" role="status"></div><span class="b-ball" aria-hidden="true"></span><button type="button" class="bruno-btn" aria-label="Guru, Leo\'s best friend. Tap to pet him.">' + svg + "</button>";
  document.body.appendChild(dock);
  var bubble = dock.querySelector(".bruno-bubble"), here = false, leaveTimer = null, followTimer = null, pets = 0, lastVisit = 0, busy = false;
  var doing = "", lastGame = 0, lastUser = Date.now(), napping = false;
  ["pointermove", "keydown", "scroll", "touchstart"].forEach(function (ev) { addEventListener(ev, function () { lastUser = Date.now(); }, { passive: true }); });
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  // Guru grew up on Indian streets, so he knows the good local spots.
  var TIPS = {
    DEL: "Parathas in Old Delhi's Paranthe Wali Gali, and Humayun's Tomb early in the morning before the crowds.",
    BOM: "Vada pav from a street stall, then sunset on Marine Drive.",
    BLR: "Masala dosa at an old-school darshini, and a morning walk in Cubbon Park.",
    COK: "The Chinese fishing nets at Fort Kochi at sunset, and appam with stew.",
    MAA: "Filter coffee and an early walk on Marina Beach.",
    CCJ: "Kozhikode biryani, and halwa on SM Street!",
    TRV: "Kovalam beach is close by, and try a Kerala sadya on a banana leaf.",
    HYD: "Hyderabadi biryani, and Irani chai with Osmania biscuits near Charminar.",
    CCU: "Puchka, kathi rolls and a tram ride. Rosogolla for dessert!",
    GOI: "North Goa for parties, South Goa for quiet beaches. Fish curry rice is a must.",
    AMD: "Manek Chowk's night food market and a heritage walk in the old city.",
    PNQ: "Misal pav, and a day trip up to Sinhagad Fort.",
    JAI: "Amber Fort early in the morning, then pyaaz kachori and lassi.",
    LKO: "Tunday kebabs and a walk around Bara Imambara.",
    ATQ: "The Golden Temple's langar feeds thousands for free every day. Go at night too, it glows!",
    IXE: "Neer dosa and a fish thali, then Panambur beach at sunset.",
    CJB: "Ooty and the Nilgiri toy train are a few hours' drive away."
  };
  function say(text, ms) {
    bubble.textContent = text; bubble.classList.remove("show"); void bubble.offsetWidth; bubble.classList.add("show");
    clearTimeout(say.t); say.t = setTimeout(function () { bubble.classList.remove("show"); }, ms || 2600);
  }
  function spot() {
    // sits just beside Leo, on whichever side has room
    var r = L.rect(), w = dock.offsetWidth || 128, left = r.left - w + 6 > 8;
    return { x: left ? r.left - w + 6 : Math.min(innerWidth - w - 8, r.right - 6), y: r.bottom - (dock.offsetHeight || 128), side: left ? "left" : "right" };
  }
  function moveTo(x, y, ms, then) {
    var cur = dock.getBoundingClientRect(), dir = x < cur.left ? -1 : 1;
    dock.classList.add("walking"); dock.classList.toggle("flip", dir < 0);
    dock.style.transition = reduce ? "none" : "left " + ms + "ms cubic-bezier(.45,.05,.4,1), top " + ms + "ms cubic-bezier(.45,.05,.4,1)";
    dock.style.left = x + "px"; dock.style.top = y + "px";
    clearTimeout(moveTo.t); moveTo.t = setTimeout(function () { dock.classList.remove("walking", "flip"); if (then) then(); }, reduce ? 0 : ms);
  }
  function visit(asked, why) {
    if (here) { if (asked) greet(true); return; }
    if (!asked && (!L.free() || document.hidden || Date.now() - lastVisit < 150e3)) return;
    if (L.open() && innerWidth < 700) return;
    here = true; lastVisit = Date.now(); busy = true;
    var s = spot(), fromLeft = s.side === "left";
    dock.style.transition = "none"; dock.style.left = (fromLeft ? -150 : innerWidth + 20) + "px"; dock.style.top = s.y + "px";
    dock.classList.add("here"); void dock.offsetWidth;
    dock.classList.toggle("on-right", !fromLeft);
    moveTo(s.x, s.y, 2200, function () { busy = false; greet(false, why); });
    clearTimeout(leaveTimer); leaveTimer = setTimeout(leave, 75e3);
    clearInterval(followTimer); followTimer = setInterval(follow, 1500);
  }
  function greet(again, why) {
    L.poke(); L.setMood("excited", 2600); if (L.stand) L.stand(2800); else L.hop(); L.fx(["🖤", "💛"], 4, "heart");
    L.woof("brunos"); setTimeout(function () { L.woof("yips"); }, 700);
    hop();
    var nm = L.name ? L.name() : "";
    say(why || (again ? "Woof! I'm right here! 🐾" : pick(["Woof! Hi Leo! 🐾", "Leo! Let's play! 🖤", "Woof woof! Missed you, buddy!", nm ? "Hi " + nm + "! Hi Leo! 🐾" : "Hi Leo! Hi new friend! 🐾"])), 2600);
    setTimeout(function () { L.say(again ? "Guru's here! 🖤" : "GURU!! My best friend! 🖤", 2600); }, innerWidth < 700 ? 2700 : 900);
    if (!again) setTimeout(function () { if (!doing) zoomies(); }, 6500);
  }
  function hop() { dock.classList.remove("hop"); void dock.offsetWidth; dock.classList.add("hop"); }
  function zoomies() {
    // a quick chase: Guru dashes out and back while Leo bounces
    if (!here || busy || reduce) return;
    busy = true;
    var s = spot(), far = s.side === "left" ? Math.max(10, s.x - 240) : Math.min(innerWidth - 140, s.x + 240);
    say("Catch me! 💨", 1600); L.setMood("playful", 3000);
    moveTo(far, s.y, 900, function () {
      L.hop(); L.woof("yips");
      moveTo(s.x, s.y, 900, function () { busy = false; hop(); L.fx(["⭐", "✨"], 3, "heart"); L.say("Hehe, you're too fast, Guru! 😜", 2400); });
    });
  }
  function follow() {
    if (!here || busy) return;
    var s = spot(), cur = dock.getBoundingClientRect();
    if (Math.abs(cur.left - s.x) > 14 || Math.abs(cur.top - s.y) > 14) moveTo(s.x, s.y, 900);
    dock.classList.toggle("on-right", s.side === "right");
    dock.classList.toggle("hide", L.open() && innerWidth < 700);
  }
  function leave() {
    if (!here) return;
    if (busy) { leaveTimer = setTimeout(leave, 4000); return; }
    busy = true; clearInterval(followTimer);
    say("Bye Leo! See you soon! 🐾", 2000); L.say("Bye Guru! 👋", 2000); L.wave();
    var cur = dock.getBoundingClientRect(), out = cur.left < innerWidth / 2 ? -160 : innerWidth + 30;
    setTimeout(function () { moveTo(out, cur.top, 2000, function () { dock.classList.remove("here"); here = false; busy = false; }); }, 1200);
  }

  // ---------- playing together ----------
  function geo() {
    var b = dock.getBoundingClientRect(), l = L.rect();
    return { b: b, l: l, bLeft: b.left + b.width / 2 < l.left + l.width / 2 };
  }
  function begin(label) { doing = label; busy = true; lastGame = Date.now(); L.lock(true); L.poke(); clearTimeout(leaveTimer); }
  function finish() { doing = ""; busy = false; napping = false; L.lock(false); dock.classList.remove("has-ball", "sleep", "howl", "bow", "munch"); leaveTimer = setTimeout(leave, 50e3); setTimeout(follow, 300); }
  function sway(el, dx, rot, ms) { return el.animate([{ transform: "none" }, { transform: "translateX(" + dx + "px) rotate(" + rot + "deg)" }, { transform: "none" }], { duration: reduce ? 10 : ms || 700, easing: "ease-in-out" }); }
  function burst(x, y, chars, n) {
    for (var i = 0; i < n; i++) { var h = document.createElement("span"); h.className = "bruno-heart"; h.textContent = chars[i % chars.length]; h.style.left = (x - 12 + (i - n / 2) * 18) + "px"; h.style.top = y + "px"; h.style.animationDelay = i * 0.1 + "s"; document.body.appendChild(h); setTimeout(h.remove.bind(h), 1700); }
  }
  function bow(then) { dock.classList.add("bow"); say("*play bow* 🐾", 1200); L.woof("brunos"); setTimeout(function () { dock.classList.remove("bow"); then(); }, 900); }

  function tug() {
    begin("playing tug of war");
    var g = geo(), side = g.bLeft ? 1 : -1;
    var bx = g.b.left + g.b.width * (g.bLeft ? 0.62 : 0.38), by = g.b.top + g.b.height * 0.47, lx = g.l.left + g.l.width * (g.bLeft ? 0.3 : 0.7), ly = g.l.top + g.l.height * 0.56;
    var rope = document.createElement("div"); rope.className = "duo-rope";
    var len = Math.hypot(lx - bx, ly - by), ang = Math.atan2(ly - by, lx - bx) * 180 / Math.PI;
    rope.style.left = bx + "px"; rope.style.top = by - 7 + "px"; rope.style.width = len + "px"; rope.style.transform = "rotate(" + ang + "deg)";
    rope.innerHTML = '<svg viewBox="0 0 100 14" preserveAspectRatio="none"><path d="M0 7 Q 8 2 16 7 T 32 7 T 48 7 T 64 7 T 80 7 T 100 7" fill="none" stroke="#b8865a" stroke-width="5" stroke-linecap="round"/><path d="M0 7 Q 8 2 16 7 T 32 7 T 48 7 T 64 7 T 80 7 T 100 7" fill="none" stroke="#e7c79a" stroke-width="2" stroke-dasharray="3 4"/></svg><i class="duo-knot"></i>';
    document.body.appendChild(rope);
    say("Grrr! Mine! 🪢", 1800); setTimeout(function () { L.say("No, MINE! 😤", 1800); }, 500);
    var round = 0, score = 0;
    (function pull() {
      if (round >= 6) return end();
      var brunoPulls = Math.random() < 0.5, dx = (brunoPulls ? -1 : 1) * 16 * side;
      score += brunoPulls ? 1 : -1;
      sway(dock, dx, brunoPulls ? -8 * side : 4 * side); sway(L.el, dx, brunoPulls ? -4 * side : 8 * side);
      rope.animate([{ translate: "0 0" }, { translate: dx + "px 0" }, { translate: "0 0" }], { duration: reduce ? 10 : 700, easing: "ease-in-out" });
      if (round % 2 === 0) L.woof("growl"); else setTimeout(function () { L.woof("bigbark"); }, 200);
      round++; setTimeout(pull, reduce ? 30 : 760);
    })();
    function end() {
      rope.classList.add("snap"); setTimeout(rope.remove.bind(rope), 500);
      var leoWins = score < 0 || (score === 0 && Math.random() < 0.5), g2 = geo();
      if (leoWins) { L.hop(); L.fx(["🏆", "✨", "💪"], 4, "heart"); L.setMood("cool", 3000); L.say("I WON! Small but mighty! 💪", 2600); say("Good pull, buddy! Rematch? 🐾", 2600); L.joy(10); }
      else { hop(); burst(g2.b.left + g2.b.width / 2, g2.b.top, ["🏆", "🖤"], 2); say("Guru wins! Woof! 🏆", 2400); L.setMood("playful", 3000); L.say("Rematch!! 😤", 2400); L.joy(6); }
      setTimeout(finish, 1200);
    }
  }
  function race() {
    begin("racing for the ball");
    var g = geo(), dir = Math.min(g.b.left, g.l.left) > innerWidth / 2 ? -1 : 1;
    var tx = dir < 0 ? Math.max(30, Math.min(g.b.left, g.l.left) - 230) : Math.min(innerWidth - 30, Math.max(g.b.right, g.l.right) + 230), ty = g.l.bottom - 14;
    var ball = document.createElement("div"); ball.className = "leo-ball show"; document.body.appendChild(ball);
    var sx = (g.b.left + g.l.right) / 2, sy = g.l.top - 30;
    say("Ball!! 🎾", 1400); L.say("Mine!! 🎾", 1400); L.woof("yips");
    var arc = ball.animate([{ transform: "translate(" + sx + "px," + sy + "px)" }, { transform: "translate(" + (sx + tx) / 2 + "px," + (sy - 170) + "px) rotate(360deg)", offset: 0.5 }, { transform: "translate(" + tx + "px," + ty + "px) rotate(720deg)" }], { duration: reduce ? 10 : 1000, easing: "cubic-bezier(.3,.6,.4,1)", fill: "forwards" });
    arc.onfinish = function () {
      var leoWins = Math.random() < (L.stats().hunger > 40 ? 0.55 : 0.35), bMs = leoWins ? 1000 : 700, lMs = leoWins ? 700 : 1000;
      var bTarget = tx - (dock.offsetWidth / 2) - dir * 20, lDx = tx - (g.l.left + g.l.width / 2) + dir * 30;
      moveTo(bTarget, g.b.top, bMs);
      L.el.classList.add("run"); L.el.classList.toggle("flip", dir < 0);
      var go = L.el.animate([{ transform: "translateX(0)" }, { transform: "translateX(" + lDx + "px)" }], { duration: reduce ? 10 : lMs, easing: "ease-in", fill: "forwards" });
      setTimeout(function () {
        ball.remove();
        if (leoWins) { L.el.classList.add("has-ball"); L.say("Got it!! 🎾", 1600); L.woof("yips"); say("Aww, so close! 🐾", 1600); }
        else { dock.classList.add("has-ball"); say("Got it! Woof! 🎾", 1600); L.woof("bigbark"); L.say("Hey! No fair! 😤", 1600); }
      }, Math.min(bMs, lMs));
      setTimeout(function () {
        var s = spot(); moveTo(s.x + (g.b.left - s.x), g.b.top, 900);
        L.el.classList.toggle("flip", dir > 0);
        var back = L.el.animate([{ transform: "translateX(" + lDx + "px)" }, { transform: "translateX(0)" }], { duration: reduce ? 10 : 900, easing: "ease-out", fill: "forwards" });
        back.onfinish = function () {
          go.cancel(); back.cancel(); arc.cancel(); L.el.classList.remove("run", "flip", "has-ball");
          if (leoWins) { L.fx(["🏆", "⭐"], 3, "heart"); L.setMood("cool", 2600); L.say("Fastest fluff in town! 😎", 2400); L.joy(12); }
          else { hop(); L.setMood("playful", 2600); L.say("Next time, Guru! 🐾", 2200); L.joy(8); }
          finish();
        };
      }, Math.max(bMs, lMs) + 500);
    };
  }
  function chase() {
    begin("playing chase");
    var g = geo(), dir = Math.min(g.b.left, g.l.left) > innerWidth / 2 ? -1 : 1, run = Math.min(320, dir < 0 ? Math.min(g.b.left, g.l.left) - 20 : innerWidth - Math.max(g.b.right, g.l.right) - 20);
    say("Can't catch me! 💨", 1500); L.woof("brunos");
    moveTo(g.b.left + dir * run, g.b.top, 1100);
    L.el.classList.add("run"); L.el.classList.toggle("flip", dir < 0); L.say("Come back here! 😆", 1500);
    var go = L.el.animate([{ transform: "translateX(0)" }, { transform: "translateX(" + dir * (run - 60) + "px)" }], { duration: reduce ? 10 : 1300, delay: reduce ? 0 : 200, easing: "ease-in-out", fill: "forwards" });
    go.onfinish = function () {
      L.woof("yips"); L.say("Tag! You're it! 🐾", 1600); hop();
      setTimeout(function () {
        moveTo(g.b.left, g.b.top, 1200); L.el.classList.toggle("flip", dir > 0); say("I'm gonna get you! 😜", 1500);
        var back = L.el.animate([{ transform: "translateX(" + dir * (run - 60) + "px)" }, { transform: "translateX(0)" }], { duration: reduce ? 10 : 1000, easing: "ease-in-out", fill: "forwards" });
        back.onfinish = function () { go.cancel(); back.cancel(); L.el.classList.remove("run", "flip"); L.hop(); L.fx(["⭐", "✨", "💨"], 3, "heart"); L.setMood("laughing", 2600); L.say("Hehe, best game ever! 😂", 2400); L.joy(10); finish(); };
      }, 600);
    };
  }
  function bone(x0, x1, y1, delay) {
    var b = document.createElement("span"); b.className = "duo-bone"; b.textContent = "🦴"; document.body.appendChild(b);
    var a = b.animate([{ transform: "translate(" + x0 + "px,-60px) rotate(0)" }, { transform: "translate(" + x1 + "px," + y1 + "px) rotate(540deg)" }], { duration: reduce ? 10 : 900, delay: delay || 0, easing: "cubic-bezier(.5,0,.75,.4)", fill: "forwards" });
    a.onfinish = function () { setTimeout(function () { b.remove(); }, 250); };
  }
  function treats(onlyGuru) {
    begin("sharing treats");
    var g = geo(), bx = g.b.left + g.b.width / 2, lx = g.l.left + g.l.width / 2;
    if (!onlyGuru) bone(lx, lx - 10, g.l.top + g.l.height * 0.5, 0);
    bone(bx, bx - 10, g.b.top + g.b.height * 0.45, 150);
    say(onlyGuru ? "Hey! Can I have one too? 🥺" : "TREATS! 🦴", 1600);
    if (!onlyGuru) L.say("Treats for both of us! 🦴🦴", 1600);
    setTimeout(function () {
      dock.classList.add("munch"); L.woof("munch");
      if (!onlyGuru) { L.el.classList.add("eat"); L.setMood("eating"); }
      setTimeout(function () {
        dock.classList.remove("munch"); L.el.classList.remove("eat");
        burst(bx, g.b.top + 10, ["😋", "🖤"], 2);
        say(onlyGuru ? "Thanks, friend! Best day ever! 🖤" : "Yum! Thank you! 🖤", 2200);
        if (!onlyGuru) { L.treat(35); L.fx(["💛", "😋"], 3, "heart"); L.setMood("love", 2600); L.say("Sharing is caring! 💛", 2200); }
        finish();
      }, 1800);
    }, 1000);
  }
  function nap() {
    begin("napping"); napping = true;
    say("*yaaawn* Nap time… 😴", 1600); L.woof("yawn");
    setTimeout(function () { dock.classList.add("sleep"); L.setMood("sleepy"); L.say("Zzz… 💤", 2000); }, 900);
    var z = setInterval(function () { if (!napping) return clearInterval(z); var b = dock.getBoundingClientRect(); burst(b.left + b.width * 0.6, b.top + 20, ["z", "Z"], 2); }, 2200);
    var wake = function () {
      if (!napping) return; napping = false; clearInterval(z); removeEventListener("pointerdown", wake, true);
      dock.classList.remove("sleep"); hop(); L.woof("yawn"); L.setMood("happy", 2000);
      say("*stretch* Ready for a trip! 🐾", 2000); L.say("I dreamt of beaches! 🏖", 2200); L.joy(8); finish();
    };
    setTimeout(function () { addEventListener("pointerdown", wake, true); }, 1200);
    setTimeout(wake, reduce ? 3000 : 14000);
  }
  function howl() {
    begin("howling a song");
    dock.classList.add("howl"); L.setMood("excited", 3600); L.hop();
    say("Awoooo! 🎵", 2400); L.woof("howl");
    setTimeout(function () { L.say("Awooo-ooo! 🎶", 2200); var g = geo(); burst((g.b.right + g.l.left) / 2, g.l.top, ["🎵", "🎶", "🎵"], 3); }, 1000);
    setTimeout(function () { dock.classList.remove("howl"); L.fx(["🎶", "✨"], 3, "heart"); say("We're a band now! 🎸", 2000); L.say("DD Boys' first album! 😆", 2200); L.joy(8); finish(); }, 3600);
  }
  function boop() {
    begin("doing nose boops");
    var g = geo(), side = g.bLeft ? 1 : -1, s0 = { x: g.b.left, y: g.b.top };
    moveTo(s0.x + side * 30, s0.y, 500, function () {
      dock.animate([{ transform: "none" }, { transform: "rotate(" + 7 * side + "deg)" }, { transform: "none" }], { duration: 700 });
      L.el.animate([{ transform: "none" }, { transform: "translateX(" + -10 * side + "px) rotate(" + -7 * side + "deg)" }, { transform: "none" }], { duration: 700 });
      L.woof("sniff");
      setTimeout(function () {
        var g2 = geo(); burst((g2.b.right + g2.l.left) / 2 + (g2.bLeft ? 0 : g2.b.width - g2.l.width), g2.l.top + 20, ["💕", "🖤", "🤍"], 3);
        say("*boop* 🖤", 1600); L.say("*boop* 🤍 Hehe!", 1600); L.setMood("love", 2400); L.joy(12);
        moveTo(s0.x, s0.y, 500, finish);
      }, 650);
    });
  }
  var GAMES = { tug: tug, race: race, chase: chase, treats: treats, nap: nap, howl: howl, boop: boop };
  function chooseGame() {
    var s = L.stats(), h = new Date().getHours();
    if (s.hunger < 40) return "bonegift";
    if (s.joy < 40) return "boop";
    if (h >= 22 || h < 6) return "nap";
    return pick(["tug", "race", "chase", "boop", "howl", "tug", "race"]);
  }
  function bonegift() {
    // Leo looks hungry, so Guru brings him his own bone
    begin("bringing Leo a bone");
    var g = geo(), lx = g.l.left + g.l.width / 2;
    say("Leo, you look hungry. Here, have my bone! 🦴", 2600);
    setTimeout(function () { bone(g.b.left + g.b.width / 2, lx - 10, g.l.top + g.l.height * 0.5, 0); }, 600);
    setTimeout(function () { L.el.classList.add("eat"); L.setMood("eating"); L.woof("munch"); }, 1600);
    setTimeout(function () { L.el.classList.remove("eat"); L.treat(30); L.setMood("love", 2600); L.fx(["💛", "🖤"], 3, "heart"); L.say("Guru, you're the best friend ever! 🥹", 2600); finish(); }, 3400);
  }
  GAMES.bonegift = bonegift;
  function play(name) {
    if (!here) { visit(true); setTimeout(function () { play(name); }, 3300); return; }
    if (doing || busy || !L.free()) { setTimeout(function () { if (!doing) play(name); }, 1500); return; }
    var g = name && GAMES[name] ? name : chooseGame();
    if (g === "treats" || g === "nap" || g === "bonegift") GAMES[g](); else bow(GAMES[g]);
  }

  // ---------- reacting to what's going on ----------
  function heard(q, res, city) {
    var india = city && TIPS[city.code];
    if (!here) {
      if (india && Math.random() < 0.6) visit(true, "Did someone say " + city.city + "?! I know that place! 🇮🇳");
      return;
    }
    if (doing) return;
    var it = res && res.intent || "", line = "";
    if (india && /Trip plan|Things to do|Food|Flight|Hotels|Best time|Special/.test(it)) line = "🇮🇳 Guru's tip for " + city.city + ": " + TIPS[city.code];
    else if (/Trip plan/.test(it)) line = pick(["Ooh, can I come too? 🐾", "I'll carry the snacks! 🦴", "Pack my collar, Leo! 🧳"]);
    else if (/Weather/.test(it) && /freezing|cold|cool/.test(res.html || "")) line = "Brr! I'll need a sweater! 🧣";
    else if (/Food/.test(it)) line = "Did someone say FOOD?! 🍗";
    else if (/Trip ideas|Surprise/.test(it) && /beach/.test(q)) line = "Beaches! I love digging in the sand! 🏖";
    else if (/Compare/.test(it)) line = "I vote for the one with more street food! 😋";
    else if (Math.random() < 0.25) line = pick(["*listens carefully* 👂", "Good question! 🐾", "Leo's so smart! 🖤"]);
    if (line) setTimeout(function () { hop(); say(line, india ? 6500 : 2600); }, 1400);
  }
  function leoAte() { if (here && !doing && Math.random() < 0.8) setTimeout(function () { treats(true); }, 600); }
  addEventListener("submit", function (e) {
    if (!e.target || e.target.id === "leo-form") return;
    setTimeout(function () {
      var c = window.DD && window.DD.context(), to = c && c.legs[0] && c.legs[0].to, a = to && window.FareMock && window.FareMock.airport(to);
      if (!a) return;
      if (TIPS[a.code]) { if (!here) { if (innerWidth >= 700) visit(true, "Going to " + a.city + "? That's my home turf! 🇮🇳"); } else { hop(); say("🇮🇳 Guru's tip for " + a.city + ": " + TIPS[a.code], 6500); } }
      else if (here && !doing) { hop(); say(pick(["Sniff sniff… " + a.city + "! Pack my collar! 🧳", a.city + "? I've never been! Take me! 🐾", "Ooh, " + a.city + "! Good choice, human! 🖤"]), 2600); }
    }, 900);
  }, true);

  dock.querySelector(".bruno-btn").addEventListener("click", function () {
    if (napping) return;
    if (busy) return;
    pets++; hop(); L.woof("bigbark");
    var nm = L.name ? L.name() : "";
    var lines = ["Woof! I'm Guru, Leo's best friend! 🖤", "Ooh, scratches! *tail goes whoosh* 🐾", "I'm an Indie: a proud Indian street dog! 🇮🇳", nm ? "You're my favourite human, " + nm + "! 🖤" : "Leo and I share everything… except treats. 🦴", "Want to see us play? Ask Leo! 🎾"];
    say(lines[(pets - 1) % lines.length], 2800);
    dock.classList.add("happy"); clearTimeout(dock.t); dock.t = setTimeout(function () { dock.classList.remove("happy"); }, 1600);
    var b = dock.getBoundingClientRect(); burst(b.left + b.width / 2, b.top + 20, ["🖤", "🤍", "🐾"], 3);
    clearTimeout(leaveTimer); leaveTimer = setTimeout(leave, 50e3);
    if (pets % 3 === 0) setTimeout(function () { play(); }, 1200);
  });
  // blink on his own
  setInterval(function () { if (!here || napping) return; dock.classList.add("blink"); setTimeout(function () { dock.classList.remove("blink"); }, 160); }, 3800);
  // first visit after a little while, then now and then; he comes sooner if Leo is lonely
  setTimeout(function () { visit(false); }, 35e3);
  setInterval(function () {
    var s = L.stats(); if (here) return;
    if (s.joy < 35) return visit(true, "Leo, you look lonely! I'm here! 🖤");
    if (Math.random() < 0.35 && L.free() && !L.open() && !document.hidden && L.stand) {
      // Leo watches the street from the window, tail wagging, until his friend shows up
      L.stand(3200); L.say("*watching the street* 👀 …is that Guru?!", 3000); L.woof("yips");
      setTimeout(function () { visit(true, "Leo! I saw you at the window! 🐾"); }, 2600);
    } else if (Math.random() < 0.5) visit(false);
  }, 80e3);
  // while he's here, the two play on their own when you're not busy
  setInterval(function () {
    if (!here || doing || busy || !L.free() || document.hidden || reduce) return;
    if (Date.now() - lastUser < 6000 || Date.now() - lastGame < 22e3) return;
    if (L.open() && innerWidth < 700) return;
    play();
  }, 5000);
  addEventListener("resize", follow);
  window.Guru = { visit: visit, leave: leave, play: play, heard: heard, leoAte: leoAte, status: function () { return { here: here, doing: doing }; } };
})();
