// Theme switch (light / dark) and the futuristic layer: drifting gold dust,
// a glowing search desk, and a warp sweep when a search starts.
(function () {
  var doc = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  // ---------- light / dark ----------
  function systemLight() { return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches; }
  function current() { return doc.getAttribute("data-theme") || (systemLight() ? "light" : "dark"); }
  function apply(t) {
    doc.setAttribute("data-theme", t);
    var b = document.getElementById("theme");
    if (b) b.setAttribute("aria-label", t === "light" ? "Switch to dark mode" : "Switch to light mode");
    document.dispatchEvent(new CustomEvent("dd-theme", { detail: t }));
  }
  apply(store("dd-theme") || current());
  var btn = document.getElementById("theme");
  if (btn) btn.addEventListener("click", function (e) {
    var next = current() === "light" ? "dark" : "light";
    store("dd-theme", next);
    // The new theme spreads out from the switch as a growing circle.
    if (!document.startViewTransition || reduce) return apply(next);
    var r = btn.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
    var end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    var vt = document.startViewTransition(function () { apply(next); });
    vt.ready.then(function () {
      doc.animate({ clipPath: ["circle(0px at " + x + "px " + y + "px)", "circle(" + end + "px at " + x + "px " + y + "px)"] },
        { duration: 750, easing: "cubic-bezier(.65,0,.35,1)", pseudoElement: "::view-transition-new(root)" });
    }).catch(function () {});
  });

  if (reduce) return;

  // ---------- gold dust drifting across the wall ----------
  var cv = document.createElement("canvas");
  cv.id = "dust"; cv.setAttribute("aria-hidden", "true");
  var wall = document.querySelector(".wallshade");
  if (wall && wall.parentNode) wall.parentNode.insertBefore(cv, wall.nextSibling);
  var ctx = cv.getContext("2d"), W = 0, H = 0, dpr = Math.min(2, window.devicePixelRatio || 1), parts = [], mx = -999, my = -999;
  function size() {
    W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.round(Math.min(90, W * H / 16000));
    parts = []; for (var i = 0; i < n; i++) parts.push(spawn(true));
  }
  function spawn(any) {
    return { x: Math.random() * W, y: any ? Math.random() * H : H + 10, r: 0.6 + Math.random() * 1.8, vy: -(0.12 + Math.random() * 0.35), vx: (Math.random() - 0.5) * 0.15, tw: Math.random() * 6.28, a: 0.25 + Math.random() * 0.55 };
  }
  var col = getComputedStyle(doc).getPropertyValue("--dust").trim() || "242, 220, 166";
  document.addEventListener("dd-theme", function () { col = getComputedStyle(doc).getPropertyValue("--dust").trim() || col; });
  window.addEventListener("pointermove", function (e) { mx = e.clientX; my = e.clientY; }, { passive: true });
  var last = 0, running = true;
  document.addEventListener("visibilitychange", function () { running = !document.hidden; if (running) requestAnimationFrame(tick); });
  function tick(t) {
    if (!running) return;
    if (t - last > 30) {
      last = t; ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i], dx = p.x - mx, dy = p.y - my, d2 = dx * dx + dy * dy;
        if (d2 < 9000) { var f = (9000 - d2) / 9000 * 0.9; p.x += dx / 40 * f; p.y += dy / 40 * f; }
        p.x += p.vx; p.y += p.vy; p.tw += 0.05;
        if (p.y < -10 || p.x < -10 || p.x > W + 10) parts[i] = spawn(false);
        var a = p.a * (0.55 + 0.45 * Math.sin(p.tw));
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283);
        ctx.fillStyle = "rgba(" + col + "," + a.toFixed(3) + ")"; ctx.fill();
        if (p.r > 1.9) { ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3.2, 0, 6.283); ctx.fillStyle = "rgba(" + col + "," + (a * 0.12).toFixed(3) + ")"; ctx.fill(); }
      }
    }
    requestAnimationFrame(tick);
  }
  size(); addEventListener("resize", size); requestAnimationFrame(tick);

  // ---------- warp sweep when a search starts ----------
  var warp = document.createElement("div"); warp.className = "warp"; warp.setAttribute("aria-hidden", "true");
  for (var i = 0; i < 26; i++) {
    var s = document.createElement("i");
    s.style.top = (Math.random() * 100).toFixed(1) + "%";
    s.style.width = (80 + Math.random() * 260).toFixed(0) + "px";
    s.style.animationDelay = (Math.random() * 0.25).toFixed(2) + "s";
    warp.appendChild(s);
  }
  document.body.appendChild(warp);
  document.addEventListener("submit", function () {
    warp.classList.remove("go"); void warp.offsetWidth; warp.classList.add("go");
    var desk = document.querySelector(".console"); if (desk) { desk.classList.remove("charge"); void desk.offsetWidth; desk.classList.add("charge"); }
  }, true);
})();
