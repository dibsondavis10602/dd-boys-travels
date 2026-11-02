// Extra motion for DD Boys Travels: a live flight-route animation above results,
// a scroll progress line, a plane crossing the hero sky, and a shimmering headline.
// Motion is skipped for people who ask for less of it; the route card still shows its facts.
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var M = window.FareMock, F = window.LeoFacts;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function tzOf(a) { return F && F.TZ ? (F.TZ_AIRPORT[a.code] || F.TZ[a.country]) : null; }
  function localTime(a) { var tz = tzOf(a); if (!tz) return ""; try { return new Date().toLocaleTimeString("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit" }); } catch (e) { return ""; } }
  function offset(tz) {
    try { var d = new Date(), p = {}; new Intl.DateTimeFormat("en-US", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric" }).formatToParts(d).forEach(function (x) { p[x.type] = +x.value; });
      return Math.round((Date.UTC(p.year, p.month - 1, p.day, p.hour % 24, p.minute) - Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes())) / 60000); } catch (e) { return null; }
  }
  function hm(m) { return Math.floor(m / 60) + "h " + String(m % 60).padStart(2, "0") + "m"; }
  var PLANE = "M-14 -2 L4 -2 L12 -9 L16 -9 L10 -2 L18 -2 Q22 0 18 2 L10 2 L16 9 L12 9 L4 2 L-14 2 L-18 6 L-21 6 L-18 0 L-21 -6 L-18 -6 Z";

  // ---------- flight route simulation ----------
  function buildRoute(el) {
    var a = M.airport(el.dataset.from), b = M.airport(el.dataset.to); if (!a || !b) return;
    var key = a.code + b.code; if (el.dataset.built === key) return; el.dataset.built = key;
    var mins = +el.dataset.mins || 0, kmv = +el.dataset.km || 0, direct = el.dataset.direct === "1";
    var ta = tzOf(a), tb = tzOf(b), shift = ta && tb ? offset(tb) - offset(ta) : null;
    var east = b.lon >= a.lon, id = "rs" + Math.random().toString(36).slice(2, 7);
    // a gentle arc whose height grows with distance, like a great-circle route on a flat map
    var lift = Math.max(40, Math.min(118, 40 + kmv / 120)), path = "M 90 150 C 260 " + (150 - lift * 1.5) + ", 540 " + (150 - lift * 1.5) + ", 710 150";
    var dur = Math.max(5, Math.min(9, 4 + mins / 120)).toFixed(1);
    var stars = ""; for (var i = 0; i < 26; i++) stars += '<circle cx="' + Math.round(Math.random() * 800) + '" cy="' + Math.round(Math.random() * 120) + '" r="' + (Math.random() * 1.2 + 0.4).toFixed(1) + '" class="rs-star" style="animation-delay:' + (Math.random() * 3).toFixed(1) + 's"/>';
    el.innerHTML =
      '<svg viewBox="0 0 800 200" class="rs-svg" role="img" aria-label="Flight route from ' + esc(a.city) + " to " + esc(b.city) + '">' +
      '<defs><linearGradient id="' + id + 'g" x1="0" x2="1"><stop offset="0" stop-color="var(--gold)" stop-opacity="0"/><stop offset=".7" stop-color="var(--gold)" stop-opacity=".9"/><stop offset="1" stop-color="var(--gold-hi)"/></linearGradient>' +
      '<radialGradient id="' + id + 'r"><stop offset="0" stop-color="var(--gold)" stop-opacity=".55"/><stop offset="1" stop-color="var(--gold)" stop-opacity="0"/></radialGradient></defs>' +
      '<g class="rs-stars">' + stars + "</g>" +
      '<g class="rs-grid">' + [40, 80, 120, 160].map(function (y) { return '<path d="M0 ' + y + ' H800"/>'; }).join("") + [100, 200, 300, 400, 500, 600, 700].map(function (x) { return '<path d="M' + x + ' 0 V200"/>'; }).join("") + "</g>" +
      '<path d="' + path + '" class="rs-base"/>' +
      '<path id="' + id + 'p" d="' + path + '" class="rs-trail" stroke="url(#' + id + 'g)"/>' +
      [[90, a], [710, b]].map(function (p, i) { return '<g class="rs-pin"><circle cx="' + p[0] + '" cy="150" r="26" fill="url(#' + id + 'r)" class="rs-glow" style="animation-delay:' + i * 0.9 + 's"/><circle cx="' + p[0] + '" cy="150" r="6" class="rs-dot"/><circle cx="' + p[0] + '" cy="150" r="6" class="rs-ring" style="animation-delay:' + i * 0.9 + 's"/></g>'; }).join("") +
      '<g class="rs-plane"><path d="' + PLANE + '"/>' + (reduce ? "" : '<animateMotion dur="' + dur + 's" repeatCount="indefinite" rotate="auto" calcMode="spline" keyPoints="0;1" keyTimes="0;1" keySplines=".45 0 .55 1"><mpath href="#' + id + 'p"/></animateMotion>') + "</g>" +
      "</svg>" +
      '<div class="rs-end rs-a"><b>' + a.code + "</b><span>" + esc(a.city) + "</span><small>🕐 " + localTime(a) + " local</small></div>" +
      '<div class="rs-end rs-b"><b>' + b.code + "</b><span>" + esc(b.city) + "</span><small>🕐 " + localTime(b) + " local</small></div>" +
      '<div class="rs-info"><span>✈ ' + (mins ? hm(mins) + (direct ? " nonstop" : " fastest") : "") + "</span><span>📏 " + kmv.toLocaleString("en-US") + " km</span>" +
      (shift != null && shift !== 0 ? "<span>🕐 " + (shift > 0 ? "+" : "−") + hm(Math.abs(shift)).replace(" 00m", "h").replace("h h", "h") + " time change</span>" : "") +
      "<span>" + (east ? "🌅 Flying east" : "🌇 Flying west") + "</span></div>";
    if (!reduce) {
      var trail = el.querySelector(".rs-trail"), L = trail.getTotalLength ? trail.getTotalLength() : 900;
      trail.style.strokeDasharray = L; trail.style.strokeDashoffset = L;
      trail.animate([{ strokeDashoffset: L }, { strokeDashoffset: 0, offset: 0.97 }, { strokeDashoffset: 0 }], { duration: dur * 1000, iterations: Infinity, easing: "cubic-bezier(.45,0,.55,1)" });
    } else el.querySelector(".rs-plane").setAttribute("transform", "translate(400 " + (150 - lift * 1.12) + ")");
  }
  function scan() { document.querySelectorAll(".route-sim").forEach(buildRoute); }
  var results = document.getElementById("results");
  if (results && "MutationObserver" in window) new MutationObserver(scan).observe(results, { childList: true, subtree: true });
  scan();

  // ---------- scroll progress line ----------
  var bar = document.createElement("div"); bar.className = "scroll-line"; bar.setAttribute("aria-hidden", "true"); document.body.appendChild(bar);
  function prog() { var h = document.documentElement.scrollHeight - innerHeight; bar.style.transform = "scaleX(" + (h > 0 ? Math.min(1, scrollY / h) : 0) + ")"; }
  addEventListener("scroll", prog, { passive: true }); addEventListener("resize", prog); prog();

  if (reduce) return;
  document.documentElement.classList.add("motion2");

  // ---------- headline: words rise in one by one ----------
  var h1 = document.getElementById("headline");
  function splitWords(el) {
    if (!el || el.dataset.split) return; el.dataset.split = "1";
    var n = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var frag = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function (w) { if (!w) return; if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(w)); return; } var s = document.createElement("span"); s.className = "wd"; s.style.setProperty("--wi", n++); s.textContent = w; frag.appendChild(s); });
          node.replaceChild(frag, c);
        } else if (c.nodeType === 1 && c.tagName === "EM") c.style.setProperty("--wi", n++);   // the gold words keep their sheen, so they rise as one
        else if (c.nodeType === 1) walk(c);
      });
    })(el);
  }
  splitWords(h1);
  if (h1 && "MutationObserver" in window) new MutationObserver(function () { if (!h1.querySelector(".wd")) { delete h1.dataset.split; splitWords(h1); } }).observe(h1, { childList: true });

  // ---------- a little plane crosses the sky now and then ----------
  var sky = document.createElement("div"); sky.className = "sky-plane"; sky.setAttribute("aria-hidden", "true");
  sky.innerHTML = '<svg viewBox="-24 -12 48 24"><path d="' + PLANE + '"/></svg><i></i>';
  document.body.appendChild(sky);
  function fly() {
    if (document.hidden || scrollY > innerHeight) return;
    var y = 90 + Math.random() * 140, ltr = Math.random() < 0.5;
    sky.style.top = y + "px"; sky.classList.toggle("rtl", !ltr);
    sky.classList.remove("go"); void sky.offsetWidth; sky.classList.add("go");
  }
  setTimeout(fly, 4000); setInterval(fly, 26000);
})();
