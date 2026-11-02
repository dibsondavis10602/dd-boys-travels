// Motion for DD Boys Travels: reveal on scroll, press ripples, tilting poster,
// parallax wall, counting totals. Everything is skipped for people who ask for less motion.
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var doc = document.documentElement;
  if (reduce) return;
  doc.classList.add("motion");

  // 1. Reveal blocks as they scroll into view.
  var SEL = ".panel, .card, .hcard, .tier, .dest, .pick, .legtab, .status, .hbar, .fg-row";
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { rootMargin: "0px 0px -6% 0px", threshold: 0.06 }) : null;
  function watch(root) {
    if (!io) return;
    var els = (root || document).querySelectorAll(SEL), n = 0;
    els.forEach(function (el) {
      if (el.classList.contains("rv")) return;
      el.classList.add("rv");
      // stagger siblings that arrive together
      el.style.setProperty("--rd", Math.min(n++ % 8, 7) * 55 + "ms");
      io.observe(el);
    });
  }
  var results = document.getElementById("results");
  if (results && "MutationObserver" in window) new MutationObserver(function () { watch(results); }).observe(results, { childList: true, subtree: true });
  document.addEventListener("DOMContentLoaded", function () { watch(document); });
  watch(document);

  // 2. Ripple and press-down on every button and booking link.
  var PRESS = "button, .bookln, .site, .btn, .ghost, .chip, .dest";
  document.addEventListener("pointerdown", function (e) {
    var t = e.target.closest && e.target.closest(PRESS);
    if (!t) return;
    var r = t.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2.2;
    var dot = document.createElement("span");
    dot.className = "ripple";
    dot.style.width = dot.style.height = s + "px";
    dot.style.left = e.clientX - r.left - s / 2 + "px";
    dot.style.top = e.clientY - r.top - s / 2 + "px";
    if (getComputedStyle(t).position === "static") t.style.position = "relative";
    t.classList.add("has-ripple");
    t.appendChild(dot);
    setTimeout(function () { dot.remove(); }, 650);
  }, { passive: true });

  // 3. The framed poster tilts toward the pointer, with a sheen of light on the glass.
  var frame = document.querySelector(".frame");
  if (frame && window.matchMedia("(hover: hover)").matches) {
    var glare = document.createElement("span"); glare.className = "glare"; frame.appendChild(glare);
    frame.addEventListener("pointermove", function (e) {
      var r = frame.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      frame.style.transform = "perspective(900px) rotateY(" + (x * 9).toFixed(2) + "deg) rotateX(" + (-y * 9).toFixed(2) + "deg) translateZ(0)";
      glare.style.background = "radial-gradient(circle at " + (x + 0.5) * 100 + "% " + (y + 0.5) * 100 + "%, rgba(255,245,220,0.28), rgba(255,245,220,0) 55%)";
    });
    frame.addEventListener("pointerleave", function () { frame.style.transform = ""; glare.style.background = ""; });
  }
  // New painting: the poster swings in like a print being hung.
  if (window.Art && frame) {
    var paint = window.Art.paint;
    window.Art.paint = function (canvas) {
      var out = paint.apply(this, arguments);
      if (canvas && canvas.id === "plate") { frame.classList.remove("hang"); void frame.offsetWidth; frame.classList.add("hang"); }
      return out;
    };
  }

  // 4. Parallax: the painted wall drifts slower than the page; the header firms up after scrolling.
  var wall = document.getElementById("backdrop"), header = document.querySelector("header.top"), ticking = false;
  function onScroll() {
    var y = window.scrollY;
    if (wall) wall.style.transform = "scale(1.08) translateY(" + (-Math.min(y, 1600) * 0.04).toFixed(1) + "px)";
    if (header) header.classList.toggle("scrolled", y > 12);
    ticking = false;
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  // 5. Totals count up to their new value.
  function countUp(el) {
    var small = el.querySelector("small"), text = el.lastChild && el.lastChild.nodeType === 3 ? el.lastChild : null;
    if (!text) return;
    var target = text.nodeValue, m = target.match(/[\d,.]+/);
    if (!m) return;
    var end = parseFloat(m[0].replace(/,/g, "")), prev = +el.dataset.prev || 0, t0 = performance.now();
    el.dataset.prev = end;
    if (prev === end) return;
    (function step(now) {
      var k = Math.min(1, (now - t0) / 600), v = prev + (end - prev) * (1 - Math.pow(1 - k, 3));
      text.nodeValue = target.replace(m[0], Math.round(v).toLocaleString("en-US"));
      if (k < 1) requestAnimationFrame(step); else text.nodeValue = target;
    })(t0);
    void small;
  }
  var bar = document.getElementById("tripbar"), lastTotal = 0;
  if (bar && "MutationObserver" in window) new MutationObserver(function () {
    var t = bar.querySelector(".total"); if (!t) return;
    t.dataset.prev = lastTotal;
    var m = (t.textContent || "").match(/[\d,.]+$/);
    countUp(t);
    if (m) lastTotal = parseFloat(m[0].replace(/,/g, ""));
    bar.classList.remove("bump"); void bar.offsetWidth; bar.classList.add("bump");
  }).observe(bar, { childList: true });
  // 6. Hero copy rises again when switching Flights / Hotels / Explore.
  var hero = document.querySelector(".hero-copy"), headline = document.getElementById("headline");
  if (hero && headline && "MutationObserver" in window) new MutationObserver(function () {
    hero.classList.toggle("again");
  }).observe(headline, { childList: true });

  // 7. Soft spotlight follows the pointer across cards; main buttons lean toward it.
  if (window.matchMedia("(hover: hover)").matches) {
    document.addEventListener("pointermove", function (e) {
      var c = e.target.closest && e.target.closest(".panel, .card, .hcard, .tier, .console");
      if (c) {
        if (!c.classList.contains("spot")) c.classList.add("spot");
        var r = c.getBoundingClientRect();
        c.style.setProperty("--mx", e.clientX - r.left + "px");
        c.style.setProperty("--my", e.clientY - r.top + "px");
      }
      var b = e.target.closest && e.target.closest(".btn");
      if (b) {
        var br = b.getBoundingClientRect();
        b.style.transform = "translate(" + ((e.clientX - br.left - br.width / 2) * 0.12).toFixed(1) + "px," + ((e.clientY - br.top - br.height / 2) * 0.2).toFixed(1) + "px)";
        b.dataset.mag = "1";
      }
    }, { passive: true });
    document.addEventListener("pointerout", function (e) {
      var b = e.target.closest && e.target.closest(".btn");
      if (b && b.dataset.mag && !b.contains(e.relatedTarget)) b.style.transform = "";
    });
  }
})();
