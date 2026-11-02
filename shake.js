// Leo and Guru feel the phone move: shake it and they get dizzy (shake harder and they tumble),
// turn the screen and they roll over together, tilt it and they lean the same way.
// Phones that ask for motion permission (iPhone) are asked the first time someone taps Leo or Guru.
(function () {
  var L = window.Leo, G = window.Guru; if (!L) return;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement, last = 0, peaks = [], prev = null, listening = false;
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function guruHere() { return G && G.status && G.status().here && !G.status().napping; }
  function anim(el, cls, ms) { if (!el || reduce) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); clearTimeout(el["t_" + cls]); el["t_" + cls] = setTimeout(function () { el.classList.remove(cls); }, ms); }
  function stars(el) {
    if (!el || reduce) return;
    var s = document.createElement("span"); s.className = "dz-stars"; s.setAttribute("aria-hidden", "true"); s.innerHTML = "<i>⭐</i><i>💫</i><i>✨</i>";
    el.appendChild(s); setTimeout(function () { s.remove(); }, 3200);
  }
  function buzz(p) { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) {} }

  // ---------- shake ----------
  function shaken(hard) {
    var now = Date.now(); if (now - last < 4500) return; last = now;
    L.poke(); L.setMood("dizzy", 3600); stars(L.el);
    anim(L.el, hard ? "tumble" : "shaken", hard ? 1300 : 1000);
    L.say(hard ? pick(["Whoaaa! Rollin' over! 🌀", "AWOO! Upside down! 🙃"]) : pick(["Whoa! Earthquake?! 😵‍💫", "Everything's wobbly! 🌀", "*wobble wobble* 😵‍💫"]), 2600, "whine");
    L.fx(["⭐", "💫"], 5);
    buzz(hard ? [60, 40, 60, 40, 120] : [40, 30, 40]);
    if (guruHere()) {
      setTimeout(function () {
        anim(G.el, hard ? "tumble" : "shaken", hard ? 1300 : 1000); stars(G.el);
        G.say(hard ? pick(["Woof! I'm rolling too! 🌀", "Hold on, Leo! 🐾"]) : pick(["Woof?! Who's shaking the world? 😵", "I'm dizzy too, Leo! 💫"]), 2400);
        L.woof("bigbark");
      }, 450);
      // once the world stops, they check on each other
      setTimeout(function () { if (G.hop) G.hop(); L.hop(); L.woof("yips"); L.say(pick(["Phew! You okay, Guru? 🖤", "Again! Again! 🐾"]), 2200); }, 3400);
    } else if (G && G.visit && hard) {
      // Guru hears the commotion and runs over to check on Leo
      setTimeout(function () { G.visit(true, "Woof! Leo, are you okay?! I felt that! 🐾"); }, 1600);
    } else setTimeout(function () { L.hop(); L.say("Phew… that was fun! 🐾", 1800); }, 3300);
  }
  var pend = 0, prevT = 0;
  function onMotion(e) {
    var a = e.accelerationIncludingGravity || e.acceleration; if (!a || a.x == null) return;
    var now = Date.now(); if (now - prevT < 80) return; prevT = now;   // compare samples ~80 ms apart
    if (prev) {
      var d = Math.abs(a.x - prev.x) + Math.abs(a.y - prev.y) + Math.abs(a.z - prev.z);
      if (d > 25) peaks.push(now);
      peaks = peaks.filter(function (t) { return now - t < 1400; });
      if (peaks.length >= 9) { peaks = []; clearTimeout(pend); pend = 0; shaken(true); }
      else if (peaks.length >= 4 && !pend && now - last > 4500) pend = setTimeout(function () { pend = 0; if (peaks.length) { peaks = []; shaken(false); } }, 700);
    }
    prev = { x: a.x || 0, y: a.y || 0, z: a.z || 0 };
  }

  // ---------- tilt: both dogs lean the way the phone leans ----------
  var leanRaf = 0, leanVal = 0;
  function onTilt(e) {
    if (e.gamma == null || reduce) return;
    var landscape = (screen.orientation && /landscape/.test(screen.orientation.type)) || Math.abs(window.orientation) === 90;
    var g = landscape ? (e.beta || 0) * (window.orientation === -90 ? -1 : 1) : e.gamma;
    leanVal = Math.max(-14, Math.min(14, g * 0.35));
    if (!leanRaf) leanRaf = requestAnimationFrame(function () { leanRaf = 0; root.style.setProperty("--dd-lean", leanVal.toFixed(1) + "deg"); });
  }

  // ---------- turning the screen ----------
  var lastTurn = 0, lastOri = null;
  function oriNow() { return (screen.orientation && screen.orientation.type) || (innerWidth > innerHeight ? "landscape" : "portrait"); }
  function turned() {
    var o = oriNow(); if (o === lastOri) return; var first = lastOri === null; lastOri = o; if (first) return;
    var now = Date.now(); if (now - lastTurn < 2500) return; lastTurn = now;
    var land = /landscape/.test(o);
    setTimeout(function () {
      L.poke(); L.setMood(land ? "surprised" : "playful", 2600); anim(L.el, "roll", 1200);
      L.say(land ? pick(["Whoa, the world turned sideways! 🔄", "Wheee! Wide view! 🌍"]) : pick(["Back the right way up! 🐾", "Wheee! 🔄"]), 2400, "yips");
      if (guruHere()) setTimeout(function () { anim(G.el, "roll", 1200); G.say(land ? "Woof! Big screen for zoomies! 🐾" : "Roll over, Leo! 🔄", 2200); L.woof("bigbark"); }, 350);
    }, 450);   // wait for the new layout so they land in the right place
  }

  function start() {
    if (listening) return; listening = true;
    addEventListener("devicemotion", onMotion);
    addEventListener("deviceorientation", onTilt);
  }
  // iPhone and iPad need a tap before motion works; Android and others work right away.
  var needsAsk = window.DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === "function";
  if (needsAsk) {
    var ask = function (e) {
      var t = e.target; if (!t || !t.closest || !t.closest("#leo-btn, .bruno-btn")) return;
      document.removeEventListener("click", ask, true);
      DeviceMotionEvent.requestPermission().then(function (r) {
        if (r !== "granted") return;
        if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === "function") DeviceOrientationEvent.requestPermission().catch(function () {});
        setTimeout(function () { L.say("Shake the phone… if you dare! 😜", 2600); }, 2600);
      }).catch(function () {});
    };
    document.addEventListener("click", ask, true);
  }
  // listen straight away: Android sends motion now, iPhone starts once the tap above allows it
  if ("ondevicemotion" in window || "ondeviceorientation" in window) start();

  lastOri = oriNow();
  if (screen.orientation && screen.orientation.addEventListener) screen.orientation.addEventListener("change", turned);
  else addEventListener("orientationchange", turned);
  addEventListener("resize", function () { clearTimeout(turned.t); turned.t = setTimeout(turned, 200); });

  // hooks for testing and for Leo's chat
  window.DDMotion = { shake: function (hard) { last = 0; shaken(hard); }, turn: function () { lastOri = "test"; lastTurn = 0; turned(); } };
})();
