// Turns one of Leo's trip plans into a neat, printable PDF the visitor can download and share.
// jsPDF loads from cdnjs only when someone asks for a PDF; if it can't load, the browser's print dialog opens instead
// (choose "Save as PDF" there).
(function () {
  var SRC = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js", loading = null;
  function load() {
    if (window.jspdf && window.jspdf.jsPDF) return Promise.resolve(window.jspdf.jsPDF);
    if (loading) return loading;
    loading = new Promise(function (ok, no) {
      var s = document.createElement("script"); s.src = SRC; s.async = true; s.crossOrigin = "anonymous";
      s.onload = function () { window.jspdf && window.jspdf.jsPDF ? ok(window.jspdf.jsPDF) : no(new Error("jsPDF missing")); };
      s.onerror = function () { loading = null; no(new Error("jsPDF failed to load")); };
      document.head.appendChild(s);
      setTimeout(function () { no(new Error("timeout")); }, 12000);
    });
    return loading;
  }
  // built-in PDF fonts only know Western European letters, so swap or simplify the rest
  var EXTRA = "€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ";
  function clean(s) {
    s = String(s || "").replace(/→|⇒|➜/g, "–").replace(/★/g, "-star").replace(/₹/g, "Rs ").replace(/₩/g, "KRW ").replace(/฿/g, "THB ").replace(/₱/g, "PHP ").replace(/₫/g, "VND ")
      .replace(/·/g, "·").replace(/[‍️]/g, "");
    var out = "";
    for (var ch of s) {
      var c = ch.codePointAt(0);
      if (c === 10 || (c >= 32 && c < 127) || (c >= 160 && c <= 255) || EXTRA.indexOf(ch) >= 0) { out += ch; continue; }
      var base = ch.normalize("NFD").charAt(0), bc = base.codePointAt(0);
      if (bc >= 32 && bc < 127) out += base;           // ş → s, ō → o, emoji dropped
    }
    return out.replace(/[ \t]+/g, " ").replace(/ *\n */g, "\n").trim();
  }
  function text(el) { if (!el) return ""; var d = document.createElement("div"); d.innerHTML = el.innerHTML.replace(/<br\s*\/?>/gi, "\n"); return clean(d.textContent); }
  function read(pl) {
    var q = function (s) { return pl.querySelector(s); }, all = function (s) { return [].slice.call(pl.querySelectorAll(s)); };
    return {
      title: text(q(".lp-plan-h b")), sub: text(q(".lp-plan-h span")),
      days: all(".lp-day").map(function (d) { var n = d.querySelector(".lp-dn"); return { day: text(n.querySelector("b")), date: text(n.querySelector("small")), kind: text(n.querySelector("i")), city: text(n.querySelector("em")), body: text(d.querySelector(".lp-dd")) }; }),
      miss: all(".lp-miss:not(.lp-kb) li").map(text), kb: all(".lp-kb li").map(text),
      cost: all(".lp-cost tr").map(function (r) { var td = r.querySelectorAll("td"); return { k: text(td[0]), v: text(td[1]), tot: r.classList.contains("tot"), pp: r.classList.contains("pp") }; }),
      verdict: text(q(".lp-ok") || q(".lp-warn")), note: text(q(".lp-note"))
    };
  }
  var GOLD = [184, 134, 46], INK = [29, 26, 20], MUTE = [110, 102, 90], LINE = [226, 216, 196], CREAM = [250, 245, 235];
  function build(JsPDF, p) {
    var doc = new JsPDF({ unit: "mm", format: "a4" }), W = 210, H = 297, M = 16, y = 0, url = location.href.split("#")[0].split("?")[0];
    if (!/^https?:/.test(url)) url = "https://dibsondavis10602.github.io/dd-boys-travels/";   // the shared single-file copy points to the live site
    function col(c, f) { doc[f || "setTextColor"](c[0], c[1], c[2]); }
    function need(h) { if (y + h > H - 18) { doc.addPage(); y = 20; } }
    // header band
    col(INK, "setFillColor"); doc.rect(0, 0, W, 34, "F");
    col(GOLD, "setFillColor"); doc.rect(0, 34, W, 1.2, "F");
    doc.setFont("times", "bold"); doc.setFontSize(22); col(CREAM); doc.text("DD Boys", M, 18);
    var bw = doc.getTextWidth("DD Boys "); doc.setFont("times", "bolditalic"); col(GOLD); doc.text("Travels", M + bw, 18);
    doc.setFont("helvetica", "normal"); doc.setFontSize(9); col([214, 205, 186]); doc.text("Trip plan made with Leo, your travel buddy", M, 26);
    doc.text(new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }), W - M, 26, { align: "right" });
    // title
    y = 48; doc.setFont("times", "bold"); doc.setFontSize(19); col(INK);
    doc.splitTextToSize(p.title.replace(/^Your /, "Your "), W - 2 * M).forEach(function (l) { doc.text(l, M, y); y += 8; });
    doc.setFont("helvetica", "normal"); doc.setFontSize(10); col(MUTE); doc.text(doc.splitTextToSize(p.sub, W - 2 * M), M, y); y += 9;
    // day by day
    function section(name) { need(16); doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); col(GOLD); doc.text(name.toUpperCase(), M, y, { charSpace: 0.6 }); y += 2.5; col(GOLD, "setDrawColor"); doc.setLineWidth(0.5); doc.line(M, y, M + 22, y); y += 6; }
    section("Day by day");
    p.days.forEach(function (d, i) {
      doc.setFont("helvetica", "normal"); doc.setFontSize(10);
      var lines = [].concat.apply([], d.body.split("\n").map(function (l) { return doc.splitTextToSize(l, W - M - 54); })), h = Math.max(16, lines.length * 5 + 6);
      need(h);
      if (i % 2 === 0) { col([248, 243, 232], "setFillColor"); doc.roundedRect(M - 2, y - 5, W - 2 * M + 4, h, 2, 2, "F"); }
      doc.setFont("times", "bold"); doc.setFontSize(13); col(INK); doc.text(d.day, M + 1, y);
      doc.setFont("helvetica", "normal"); doc.setFontSize(8); col(MUTE); doc.text(d.date, M + 1, y + 4.5);
      doc.setFont("helvetica", "bold"); col(GOLD); doc.text((d.kind + (d.city ? " · " + d.city : "")).toUpperCase(), M + 1, y + 8.5, { maxWidth: 34 });
      doc.setFont("helvetica", "normal"); doc.setFontSize(10); col(INK);
      lines.forEach(function (l, k) { doc.text(l, M + 40, y + k * 5); });
      y += h + 1;
    });
    function bullets(name, list) {
      if (!list.length) return; y += 3; section(name);
      doc.setFont("helvetica", "normal"); doc.setFontSize(10); col(INK);
      list.forEach(function (t) { var ls = doc.splitTextToSize(t, W - 2 * M - 6); need(ls.length * 5 + 1); col(GOLD, "setFillColor"); doc.circle(M + 1.2, y - 1.3, 0.9, "F"); ls.forEach(function (l, k) { doc.text(l, M + 5, y + k * 5); }); y += ls.length * 5 + 1.5; });
    }
    bullets("Don't miss", p.miss);
    bullets("Know before you go", p.kb);
    // budget
    if (p.cost.length) {
      y += 3; need(p.cost.length * 6.5 + 26); section("Estimated budget");
      p.cost.forEach(function (r) {
        var ls = doc.splitTextToSize(r.k, W - 2 * M - 40); need(ls.length * 5 + 3);
        if (r.tot) { col(GOLD, "setDrawColor"); doc.setLineWidth(0.4); doc.line(M, y - 4, W - M, y - 4); }
        doc.setFont(r.tot ? "times" : "helvetica", r.tot ? "bold" : "normal"); doc.setFontSize(r.tot ? 13 : 10); col(r.pp ? MUTE : INK);
        ls.forEach(function (l, k) { doc.text(l, M, y + k * 5); }); doc.text(r.v, W - M, y, { align: "right" });
        y += ls.length * 5 + (r.tot ? 3 : 1.5);
      });
    }
    if (p.verdict) { need(10); y += 2; doc.setFont("helvetica", "bold"); doc.setFontSize(10); col(p.verdict.indexOf("over") >= 0 ? [176, 70, 50] : [40, 120, 90]); doc.splitTextToSize(p.verdict, W - 2 * M).forEach(function (l) { doc.text(l, M, y); y += 5; }); }
    if (p.note) { need(10); y += 3; doc.setFont("helvetica", "italic"); doc.setFontSize(8.5); col(MUTE); doc.splitTextToSize(p.note + " Live prices: " + url, W - 2 * M).forEach(function (l) { doc.text(l, M, y); y += 4.2; }); }
    // footer on every page
    var n = doc.getNumberOfPages();
    for (var i = 1; i <= n; i++) {
      doc.setPage(i); col(LINE, "setDrawColor"); doc.setLineWidth(0.3); doc.line(M, H - 12, W - M, H - 12);
      doc.setFont("helvetica", "normal"); doc.setFontSize(8); col(MUTE);
      doc.text("DD Boys Travels · " + url.replace(/^https?:\/\//, ""), M, H - 7); doc.text("Page " + i + " of " + n, W - M, H - 7, { align: "right" });
      if (url.indexOf("http") === 0) doc.link(M, H - 10, 90, 5, { url: url });
    }
    return doc;
  }
  function fileName(p) { return "DD-Boys-Travels-" + (p.title.replace(/^Your\s+/i, "").replace(/\s*plan$/i, "").replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "") || "trip") + "-plan.pdf"; }
  // fallback: print just the plan, so "Save as PDF" in the print dialog gives a clean page
  function printFallback(pl) {
    var f = document.createElement("iframe"); f.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0"; document.body.appendChild(f);
    var d = f.contentDocument; d.open();
    d.write('<!doctype html><meta charset="utf-8"><title>DD Boys Travels trip plan</title><style>body{font:14px/1.5 system-ui,sans-serif;color:#1d1a14;margin:24px}b{font-weight:700}.lp-day{display:grid;grid-template-columns:120px 1fr;gap:10px;padding:8px 0;border-bottom:1px solid #e2d8c4}.lp-dn small,.lp-dn i,.lp-dn em{display:block;font-size:12px;color:#6e665a}table{width:100%;border-collapse:collapse;margin-top:12px}td{padding:4px 0;border-bottom:1px solid #eee}td:last-child{text-align:right}.tot td{font-weight:700}h1{font-family:Georgia,serif}</style><h1>DD Boys <i style="color:#b8862e">Travels</i></h1>' + pl.outerHTML);
    d.close(); setTimeout(function () { try { f.contentWindow.focus(); f.contentWindow.print(); } catch (e) {} setTimeout(function () { f.remove(); }, 60000); }, 300);
  }
  function make(pl) {
    var p = read(pl);
    return load().then(function (JsPDF) { var doc = build(JsPDF, p); doc.save(fileName(p)); return { ok: true, name: fileName(p), pages: doc.getNumberOfPages() }; })
      .catch(function () { printFallback(pl); return { ok: false }; });
  }
  window.PlanPDF = { make: make, read: read, clean: clean, _build: build };
})();
