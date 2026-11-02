// Bruno: Leo's best friend, a black Indian street dog (an "Indie").
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
    '<path d="M80 122 Q110 136 140 122 L140 130 Q110 144 80 130Z" fill="#e2701c"/><circle cx="110" cy="140" r="6" fill="#f2c94c" stroke="#a37a12" stroke-width="1.5"/><text x="110" y="143" font-size="7" text-anchor="middle" font-weight="700" fill="#6b4c00">B</text>' +
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
  dock.innerHTML = '<div class="bruno-bubble" role="status"></div><button type="button" class="bruno-btn" aria-label="Bruno, Leo\'s best friend. Tap to pet him.">' + svg + "</button>";
  document.body.appendChild(dock);
  var bubble = dock.querySelector(".bruno-bubble"), here = false, leaveTimer = null, followTimer = null, pets = 0, lastVisit = 0, busy = false;

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
  function visit(asked) {
    if (here) { greet(true); return; }
    if (!asked && (!L.free() || document.hidden || Date.now() - lastVisit < 150e3)) return;
    if (L.open() && innerWidth < 700) return;
    here = true; lastVisit = Date.now(); busy = true;
    var s = spot(), fromLeft = s.side === "left";
    dock.style.transition = "none"; dock.style.left = (fromLeft ? -150 : innerWidth + 20) + "px"; dock.style.top = s.y + "px";
    dock.classList.add("here"); void dock.offsetWidth;
    moveTo(s.x, s.y, 2200, function () { busy = false; greet(false); });
    clearTimeout(leaveTimer); leaveTimer = setTimeout(leave, 55e3);
    clearInterval(followTimer); followTimer = setInterval(follow, 1500);
  }
  function greet(again) {
    L.poke(); L.setMood("excited", 2600); L.hop(); L.fx(["🖤", "💛"], 4, "heart");
    L.woof("brunos"); setTimeout(function () { L.woof("yips"); }, 700);
    hop();
    say(again ? "Woof! I'm right here! 🐾" : ["Woof! Hi Leo! 🐾", "Leo! Let's play! 🖤", "Woof woof! Missed you, buddy!"][Math.floor(Math.random() * 3)], 2600);
    setTimeout(function () { L.say(again ? "Bruno's here! 🖤" : "BRUNO!! My best friend! 🖤", 2600); }, innerWidth < 700 ? 2700 : 900);
    if (!again) setTimeout(zoomies, 6500);
  }
  function hop() { dock.classList.remove("hop"); void dock.offsetWidth; dock.classList.add("hop"); }
  function zoomies() {
    // a quick chase: Bruno dashes out and back while Leo bounces
    if (!here || busy || reduce) return;
    busy = true;
    var s = spot(), far = s.side === "left" ? Math.max(10, s.x - 240) : Math.min(innerWidth - 140, s.x + 240);
    say("Catch me! 💨", 1600); L.setMood("playful", 3000);
    moveTo(far, s.y, 900, function () {
      L.hop(); L.woof("yips");
      moveTo(s.x, s.y, 900, function () { busy = false; hop(); L.fx(["⭐", "✨"], 3, "heart"); L.say("Hehe, you're too fast, Bruno! 😜", 2400); });
    });
  }
  function follow() {
    if (!here || busy) return;
    var s = spot(), cur = dock.getBoundingClientRect();
    if (Math.abs(cur.left - s.x) > 14 || Math.abs(cur.top - s.y) > 14) moveTo(s.x, s.y, 900);
    dock.classList.toggle("hide", L.open() && innerWidth < 700);
  }
  function leave() {
    if (!here) return;
    if (busy) { leaveTimer = setTimeout(leave, 4000); return; }
    busy = true; clearInterval(followTimer);
    say("Bye Leo! See you soon! 🐾", 2000); L.say("Bye Bruno! 👋", 2000); L.wave();
    var cur = dock.getBoundingClientRect(), out = cur.left < innerWidth / 2 ? -160 : innerWidth + 30;
    setTimeout(function () { moveTo(out, cur.top, 2000, function () { dock.classList.remove("here"); here = false; busy = false; }); }, 1200);
  }
  dock.querySelector(".bruno-btn").addEventListener("click", function () {
    if (busy) return;
    pets++; hop(); L.woof("bigbark");
    var lines = ["Woof! I'm Bruno, Leo's best friend! 🖤", "Ooh, scratches! *tail goes whoosh* 🐾", "I'm an Indie: a proud Indian street dog! 🇮🇳", "Leo and I share everything… except treats. 🦴", "Woof! Want to go on a trip with us? ✈"];
    say(lines[(pets - 1) % lines.length], 2800);
    dock.classList.add("happy"); clearTimeout(dock.t); dock.t = setTimeout(function () { dock.classList.remove("happy"); }, 1600);
    var b = dock.getBoundingClientRect();
    for (var i = 0; i < 3; i++) { var h = document.createElement("span"); h.className = "bruno-heart"; h.textContent = ["🖤", "🤍", "🐾"][i]; h.style.left = (b.left + 30 + i * 28) + "px"; h.style.top = (b.top + 20) + "px"; h.style.animationDelay = i * 0.12 + "s"; document.body.appendChild(h); setTimeout(h.remove.bind(h), 1600); }
    clearTimeout(leaveTimer); leaveTimer = setTimeout(leave, 40e3);
    if (pets % 4 === 0) setTimeout(zoomies, 800);
  });
  // blink and wag on his own
  setInterval(function () { if (!here) return; dock.classList.add("blink"); setTimeout(function () { dock.classList.remove("blink"); }, 160); }, 3800);
  // first visit after a little while, then now and then
  setTimeout(function () { visit(false); }, 40e3);
  setInterval(function () { if (Math.random() < 0.5) visit(false); }, 90e3);
  addEventListener("resize", follow);
  window.Bruno = { visit: visit, leave: leave };
})();
