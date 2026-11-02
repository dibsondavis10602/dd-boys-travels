/* DD Boys Travels: page logic. Needs mock.js (FareMock) and art.js (Art). */
(function () {
  var M = window.FareMock, A = window.Art;
  var RATES = { USD: 1, EUR: 0.92, GBP: 0.79, INR: 84.1, AED: 3.67 };
  var SYM = { USD: "$", EUR: "€", GBP: "£", INR: "₹", AED: "AED " };
  var state = {
    mode: "flights", currency: "USD",
    trip: "return", legsForm: [{ from: "DXB", to: "COK", date: "" }], ret: "",
    legs: [], legRes: [], legIdx: 0, sel: [], q: null,
    sort: "price", maxStops: 3, maxPrice: null, open: {},
    hotel: null, hotelSel: null, explore: null, saved: [], booking: null, opened: {}
  };

  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function money(usd, cur) { cur = cur || state.currency; return SYM[cur] + Math.round(usd * RATES[cur]).toLocaleString("en-US"); }
  function iso(d) { return d.toISOString().slice(0, 10); }
  function plus(days, from) { var d = from ? new Date(from + "T00:00:00Z") : new Date(); d.setUTCDate(d.getUTCDate() + days); return iso(d); }
  function hm(s) { return s.slice(11, 16); }
  function dur(min) { return Math.floor(min / 60) + "h " + String(min % 60).padStart(2, "0") + "m"; }
  function nice(date) { return new Date(date + "T00:00:00Z").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }); }
  function hue(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360; return h; }
  function host(url) { try { return new URL(url).hostname.replace(/^www\./, ""); } catch (e) { return url; } }
  function sitesHtml(list) {
    return '<div class="sites">' + list.map(function (s) { return '<a class="site" href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.name) + " <i>↗</i></a>"; }).join("") + "</div>";
  }
  function resolve(v) { return M.find(v); }

  M.AIRPORTS.forEach(function (a) {
    var o = document.createElement("option"); o.value = a.code; o.label = a.city + ", " + a.country; $("airports").appendChild(o);
    var c = document.createElement("option"); c.value = a.city; c.label = a.country; $("cities").appendChild(c);
  });

  state.legsForm[0].date = plus(30); state.ret = plus(37);
  $("checkin").value = plus(30); $("checkout").value = plus(33);
  $("ex-month").value = plus(40).slice(0, 7);
  var savedCur = store("dd-cur"); if (savedCur && RATES[savedCur]) { state.currency = savedCur; $("currency").value = savedCur; }
  try { state.saved = JSON.parse(store("dd-saved") || "[]") || []; } catch (e) { state.saved = []; }

  // ---------- data: live server first, estimates as fallback ----------
  function getJSON(url) {
    // Opened as a plain file or on a static host: no server, use the built-in estimates.
    if (location.protocol === "file:") return Promise.reject(new Error("no api"));
    var ctrl = window.AbortController ? new AbortController() : null;
    var t = setTimeout(function () { if (ctrl) ctrl.abort(); }, 9000);
    return fetch(url, ctrl ? { signal: ctrl.signal } : {}).then(function (r) {
      clearTimeout(t);
      var ct = r.headers.get("content-type") || "";
      if (!r.ok || ct.indexOf("json") < 0) throw new Error("no api");
      return r.json();
    });
  }
  function findFlights(q) {
    var qs = "from=" + q.from + "&to=" + q.to + "&date=" + q.date + "&adults=" + q.adults + "&cabin=" + q.cabin;
    return getJSON("api/flights?" + qs).catch(function () {
      var res = M.searchFlights(q);
      if (!res.error) res.calendar = M.cheapestByDay(q, 7);
      return res;
    });
  }
  function findHotels(q) {
    var qs = "city=" + encodeURIComponent(q.city) + "&checkin=" + q.checkin + "&checkout=" + q.checkout + "&guests=" + q.guests;
    return getJSON("api/hotels?" + qs).catch(function () { return M.searchHotels(q); });
  }
  function findPlaces(q) { return getJSON("api/explore?from=" + q.from + "&month=" + q.month + "&adults=1").catch(function () { return M.explore(q); }); }

  // ---------- the framed poster and the wall behind it ----------
  var artTimer, currentArt = null;
  function showArt(place, left, right) {
    if (!place) return;
    $("plaque-left").innerHTML = left || esc(place.country);
    $("plaque-right").textContent = right || place.code;
    if (currentArt === place.code) return;
    currentArt = place.code;
    clearTimeout(artTimer);
    artTimer = setTimeout(function () {
      var inf = A.paint($("plate"), place.code, { ground: 0.8 });
      $("poster-city").textContent = place.city; $("poster-caption").textContent = inf.caption;
      var bd = $("backdrop"), s = Math.min(1, 900 / Math.max(innerWidth, innerHeight));
      bd.width = Math.round(innerWidth * s); bd.height = Math.round(innerHeight * s);
      A.paint(bd, place.code, { ground: 0.82 });
    }, 40);
  }
  var rz;
  window.addEventListener("resize", function () { clearTimeout(rz); rz = setTimeout(function () { var c = currentArt; currentArt = null; if (c) showArt(M.airport(c), $("plaque-left").innerHTML, $("plaque-right").textContent); }, 200); });

  // ---------- flight form ----------
  function renderLegsForm() {
    var multi = state.trip === "multi";
    $("legs").innerHTML = state.legsForm.map(function (l, i) {
      return '<div class="fields">' + (multi ? '<div class="leghead">Flight ' + (i + 1) + "</div>" : "") +
        '<div class="field c4"><label for="from-' + i + '">From</label><input id="from-' + i + '" data-leg="' + i + '" data-k="from" list="airports" value="' + esc(l.from) + '" autocomplete="off"></div>' +
        (multi ? "" : '<div class="c1 swap"><button type="button" id="swap" aria-label="Swap origin and destination">⇄</button></div>') +
        '<div class="field c4"><label for="to-' + i + '">To</label><input id="to-' + i + '" data-leg="' + i + '" data-k="to" list="airports" value="' + esc(l.to) + '" autocomplete="off"></div>' +
        '<div class="field c3 sm-full"><label for="date-' + i + '">Depart</label><input id="date-' + i + '" data-leg="' + i + '" data-k="date" type="date" value="' + l.date + '"></div>' +
        (multi ? '<div class="c1">' + (state.legsForm.length > 2 ? '<button type="button" class="rm" data-rm="' + i + '" aria-label="Remove flight ' + (i + 1) + '">×</button>' : "") + "</div>" : "") +
        "</div>";
    }).join("") + (multi && state.legsForm.length < 5 ? '<button type="button" class="addleg" id="addleg">+ Add another flight</button>' : "");
    $("ret-field").hidden = state.trip !== "return";
    $("ret").value = state.ret;
    var span = state.trip === "return" ? "c4" : "c6";
    $("adults-field").className = "field " + span; $("cabin-field").className = "field " + span;
    document.querySelectorAll("[data-trip]").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.trip === state.trip); });
  }
  function previewFromForm() {
    var l = state.legsForm[0], a = resolve(l.from), b = resolve(l.to);
    if (a && b && a.code !== b.code) showArt(b, esc(a.city) + " → " + esc(b.city), a.code + " → " + b.code);
  }
  $("legs").addEventListener("change", function (e) {
    var t = e.target; if (!t.dataset.leg) return;
    state.legsForm[+t.dataset.leg][t.dataset.k] = t.value;
    var nx = state.legsForm[+t.dataset.leg + 1];
    if (t.dataset.k === "to" && state.trip === "multi" && nx && !nx.from) { nx.from = t.value; renderLegsForm(); }
    if (t.dataset.k !== "date") previewFromForm();
  });
  $("legs").addEventListener("input", function (e) { var t = e.target; if (t.dataset.leg) state.legsForm[+t.dataset.leg][t.dataset.k] = t.value; });
  $("legs").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    if (b.id === "swap") { var l = state.legsForm[0], t = l.from; l.from = l.to; l.to = t; renderLegsForm(); previewFromForm(); }
    if (b.id === "addleg") { var last = state.legsForm[state.legsForm.length - 1]; state.legsForm.push({ from: last.to, to: "", date: plus(4, last.date || plus(30)) }); renderLegsForm(); var n = $("to-" + (state.legsForm.length - 1)); if (n) n.focus(); }
    if (b.dataset.rm) { state.legsForm.splice(+b.dataset.rm, 1); renderLegsForm(); previewFromForm(); }
  });
  $("ret").addEventListener("change", function () { state.ret = this.value; });
  document.querySelectorAll("[data-trip]").forEach(function (b) {
    b.addEventListener("click", function () {
      state.trip = b.dataset.trip;
      if (state.trip === "multi" && state.legsForm.length < 2) { var f = state.legsForm[0]; state.legsForm.push({ from: f.to, to: "", date: plus(5, f.date) }); }
      if (state.trip !== "multi") state.legsForm = state.legsForm.slice(0, 1);
      renderLegsForm(); previewFromForm();
    });
  });

  function buildLegs() {
    var legs = [];
    for (var i = 0; i < state.legsForm.length; i++) {
      var l = state.legsForm[i], a = resolve(l.from), b = resolve(l.to);
      var n = state.trip === "multi" ? "Flight " + (i + 1) + ": " : "";
      if (!a) return { error: n + "We couldn't find \"" + (l.from || "") + "\". Try a city name or airport code, like Abu Dhabi or AUH." };
      if (!b) return { error: n + "We couldn't find \"" + (l.to || "") + "\". Try a city name or airport code, like Kochi or COK." };
      if (a.code === b.code) return { error: n + "Origin and destination are the same airport." };
      if (!l.date) return { error: n + "Choose a departure date." };
      if (i > 0 && l.date < state.legsForm[i - 1].date) return { error: n + "This flight leaves before the previous one." };
      legs.push({ from: a.code, to: b.code, date: l.date });
    }
    if (state.trip === "return") {
      if (!state.ret) return { error: "Choose a return date." };
      if (state.ret < legs[0].date) return { error: "The return date is before the departure date." };
      legs.push({ from: legs[0].to, to: legs[0].from, date: state.ret });
    }
    return { legs: legs };
  }
  function runFlights(e) {
    if (e) e.preventDefault();
    var b = buildLegs(), err = $("flight-err");
    if (b.error) { err.textContent = b.error; err.hidden = false; return; }
    err.hidden = true;
    state.q = { adults: +$("adults").value, cabin: $("cabin").value };
    state.legs = b.legs; state.legIdx = 0; state.sel = []; state.legRes = []; state.open = {}; state.maxPrice = null;
    previewFromForm();
    $("results").innerHTML = '<div class="panel empty">Finding fares for ' + b.legs.map(function (l) { return l.from + " → " + l.to; }).join(", ") + "…</div>";
    Promise.all(b.legs.map(function (l) { return findFlights({ from: l.from, to: l.to, date: l.date, adults: state.q.adults, cabin: state.q.cabin }); })).then(function (all) {
      var bad = all.filter(function (r) { return r.error; })[0];
      if (bad) { err.textContent = bad.error; err.hidden = false; $("results").innerHTML = ""; return; }
      state.legRes = all; renderFlights(); renderTrip();
    });
  }
  function rerunLeg(i, date) {
    state.legs[i].date = date;
    if (state.trip === "return" && i === 1) state.ret = date; else if (state.legsForm[i]) state.legsForm[i].date = date;
    renderLegsForm(); state.sel[i] = null; state.maxPrice = null;
    findFlights({ from: state.legs[i].from, to: state.legs[i].to, date: date, adults: state.q.adults, cabin: state.q.cabin }).then(function (r) { state.legRes[i] = r; renderFlights(); renderTrip(); });
  }
  function legQuery(i) {
    var l = state.legs[i], q = { from: l.from, to: l.to, date: l.date, adults: state.q.adults };
    if (state.trip === "return" && state.legs.length === 2) { var o = state.legs[0]; q = { from: o.from, to: o.to, date: o.date, ret: state.legs[1].date, adults: state.q.adults }; }
    return q;
  }

  function scoreOf(o, minP, minD) { return (o.price / minP) * 0.65 + (o.durationMin / minD) * 0.35; }
  function renderFlights() {
    var res = state.legRes[state.legIdx]; if (!res) return;
    var leg = state.legs[state.legIdx], multi = state.legs.length > 1, live = res.source !== "sample";
    var all = res.offers, q = legQuery(state.legIdx);
    if (!all.length) { $("results").innerHTML = '<div class="panel"><h2>No saved fares for this day yet</h2><p>Compare live prices on these sites instead.</p>' + sitesHtml(M.links.flights(q)) + "</div>"; return; }
    var minP = Math.min.apply(null, all.map(function (o) { return o.price; }));
    var minD = Math.min.apply(null, all.map(function (o) { return o.durationMin; }));
    var maxP = Math.max.apply(null, all.map(function (o) { return o.price; }));
    if (state.maxPrice == null || state.maxPrice > maxP || state.maxPrice < minP) state.maxPrice = maxP;
    var cheapest = all.slice().sort(function (a, b) { return a.price - b.price; })[0];
    var fastest = all.slice().sort(function (a, b) { return a.durationMin - b.durationMin; })[0];
    var best = all.slice().sort(function (a, b) { return scoreOf(a, minP, minD) - scoreOf(b, minP, minD); })[0];
    var list = all.filter(function (o) { return o.stops <= state.maxStops && o.price <= state.maxPrice; });
    list.sort(function (a, b) {
      if (state.sort === "duration") return a.durationMin - b.durationMin;
      if (state.sort === "best") return scoreOf(a, minP, minD) - scoreOf(b, minP, minD);
      return a.price - b.price;
    });
    var picked = state.sel[state.legIdx];
    var h = "";
    if (multi) {
      h += '<div class="legtabs">' + state.legs.map(function (l, i) {
        var s = state.sel[i], label = state.trip === "return" ? (i === 0 ? "Outbound" : "Return") : "Flight " + (i + 1);
        return '<button class="legtab" data-leg-tab="' + i + '" aria-pressed="' + (i === state.legIdx) + '"><div class="k">' + label + " · " + nice(l.date) + '</div><div class="r">' + l.from + " → " + l.to + '</div><div class="s' + (s ? " done" : "") + '">' + (s ? "✓ " + esc(s.airline) + " · " + money(s.price) : "Choose a flight") + "</div></button>";
      }).join("") + "</div>";
    }
    h += '<div class="status">' + (live ? '<span class="pill live">Live prices · ' + esc(res.source) + "</span>" : '<span class="pill est">Estimated fares</span>') +
      "<span>" + all.length + " options for " + state.q.adults + " traveller" + (state.q.adults > 1 ? "s" : "") + ", " + esc(res.from.city) + " to " + esc(res.to.city) + (res.distanceKm ? " · " + res.distanceKm.toLocaleString("en-US") + " km" : "") + "</span>" +
      '<button class="track" data-track="1">' + (isSaved(leg) ? "★ Tracking price" : "☆ Track this price") + "</button></div>";
    h += '<div class="route-sim" data-from="' + res.from.code + '" data-to="' + res.to.code + '" data-mins="' + (fastest ? fastest.durationMin : 0) + '" data-direct="' + (all.some(function (o) { return !o.stops; }) ? 1 : 0) + '" data-km="' + (res.distanceKm || 0) + '"></div>';
    h += '<div class="panel"><h2>Compare this trip on every major site</h2><p>' + (live ? "Fares below are live. " : "Fares below are estimates. ") + "Each button opens the site with " + q.from + " → " + q.to + ", " + nice(q.date) + (q.ret ? " to " + nice(q.ret) : "") + " filled in.</p>" + sitesHtml(M.links.flights(q)) + "</div>";

    if (res.calendar && res.calendar.length) {
      var cmin = Math.min.apply(null, res.calendar.map(function (c) { return c.price; }));
      var cmax = Math.max.apply(null, res.calendar.map(function (c) { return c.price; }));
      h += '<div class="panel"><h2>Cheapest day to fly</h2><p>' + leg.from + " → " + leg.to + ", lowest " + (live ? "" : "estimated ") + 'fare per day</p><div class="days">';
      res.calendar.forEach(function (c) {
        var ht = 18 + 52 * ((c.price - cmin) / Math.max(1, cmax - cmin)), d = new Date(c.date + "T00:00:00Z");
        h += '<button class="day' + (c.price === cmin ? " low" : "") + (c.date === leg.date ? " sel" : "") + '" data-date="' + c.date + '"><span class="p">' + money(c.price) + '</span><span class="bar" style="height:' + ht + 'px"></span><span class="d">' + d.toLocaleDateString("en-GB", { weekday: "short", timeZone: "UTC" }) + " " + d.getUTCDate() + "</span></button>";
      });
      h += "</div></div>";
    }
    h += '<div class="picks">' +
      pick("price", "Cheapest", money(cheapest.price), cheapest.airline + " · " + dur(cheapest.durationMin)) +
      pick("best", "Best value", money(best.price), best.airline + " · " + dur(best.durationMin)) +
      pick("duration", "Fastest", dur(fastest.durationMin), fastest.airline + " · " + money(fastest.price)) + "</div>";
    h += airlineChart(all, cheapest, live);
    h += '<div class="bar-tools">' + stopChip(3, "Any stops") + stopChip(0, "Direct only") + stopChip(1, "Up to 1 stop") +
      '<label class="range">Max <input type="range" id="maxprice" min="' + minP + '" max="' + maxP + '" step="1" value="' + state.maxPrice + '"><span id="maxprice-v">' + money(state.maxPrice) + "</span></label>" +
      '<span class="count">' + list.length + " shown · " + { price: "cheapest first", best: "best value first", duration: "fastest first" }[state.sort] + "</span></div>";
    h += '<div class="list">';
    if (!list.length) h += '<div class="panel empty">No flights match these filters. Allow more stops or raise the price limit.</div>';
    list.forEach(function (o, i) {
      var isBest = o.id === cheapest.id, isPicked = picked && picked.id === o.id, hu = hue(o.airlineCode);
      var book = o.bookUrl || o.site || M.links.airline(o.airlineCode);
      h += '<article class="card' + (isBest ? " best" : "") + (isPicked ? " picked" : "") + '" style="animation-delay:' + Math.min(i, 10) * 35 + 'ms">' + (isBest ? '<span class="tag">Lowest fare</span>' : "") +
        '<div class="row"><div class="carrier"><span class="logo" style="background:hsl(' + hu + ',45%,78%)">' + esc(o.airlineCode) + '</span><div style="min-width:0"><div class="n">' + esc(o.airline) + '</div><div class="m">' + (live && o.flightNo ? esc(o.flightNo) + " · " : "") + esc(o.cabin.replace("_", " ")) + (o.lowcost ? " · low-cost" : "") + "</div></div></div>" +
        '<div class="leg"><div><div class="t">' + hm(o.departs) + '</div><div class="c">' + o.from + '</div></div><div class="path">' + dur(o.durationMin) +
        '<div class="line">' + o.via.map(function (v, k) { return '<i style="left:' + ((k + 1) / (o.via.length + 1)) * 100 + '%"></i>'; }).join("") + "</div>" +
        (o.stops ? o.stops + " stop" + (o.stops > 1 ? "s" : "") + (o.via.length ? " · " + o.via.join(", ") : "") : '<span class="direct">Direct</span>') + '</div><div class="end"><div class="t">' + hm(o.arrives) + '</div><div class="c">' + o.to + (o.arrives.slice(0, 10) !== o.departs.slice(0, 10) ? " +1" : "") + "</div></div></div>" +
        '<div class="pricebox"><div><div class="price">' + money(o.price) + '</div><div class="via">' + (live ? "live fare" : "estimated fare") + (state.q.adults > 1 ? ", " + state.q.adults + " travellers" : "") + '</div></div><div class="acts">' +
        (book ? '<a class="bookln" href="' + esc(book) + '" target="_blank" rel="noopener">Book on ' + esc(host(book)) + " ↗</a>" : "") +
        '<button class="selbtn" data-pick="' + o.id + '">' + (isPicked ? "✓ In trip" : "Add to trip") + '</button></div><div class="acts"><button class="more" data-open="' + o.id + '">' + (state.open[o.id] ? "Hide comparison ▴" : "Compare price ▾") + "</button></div></div></div>" +
        '<div class="meta"><span>' + esc(o.bags) + "</span></div>" +
        (state.open[o.id] ? '<div class="expand">' + fareGraph(o, all, live) + '<div class="lbl">Check this fare live on each site (same route and date):</div>' + sitesHtml(M.links.flights(q)) + "</div>" : "") + "</article>";
    });
    $("results").innerHTML = h + "</div>";
  }
  // Price graphs: this flight against the rest of the route, and every airline side by side.
  function bestPerAirline(all) {
    var by = {};
    all.forEach(function (o) { if (!by[o.airlineCode] || o.price < by[o.airlineCode].price) by[o.airlineCode] = o; });
    return Object.keys(by).map(function (k) { return by[k]; }).sort(function (a, b) { return a.price - b.price; });
  }
  function airlineChart(all, cheapest, live) {
    var rows = bestPerAirline(all), max = rows[rows.length - 1].price;
    var avg = Math.round(all.reduce(function (t, o) { return t + o.price; }, 0) / all.length);
    return '<div class="panel chart"><div class="chart-head"><div><h2>Compare airlines</h2><p>Lowest ' + (live ? "" : "estimated ") + "fare from each airline on this route. Tap a bar to see that flight.</p></div>" +
      '<div class="legend"><span><i class="k-direct"></i>Direct</span><span><i class="k-stop"></i>With stops</span><span><i class="k-avg"></i>Average ' + money(avg) + "</span></div></div>" +
      '<div class="hbars" style="--avg:' + (avg / max * 100).toFixed(1) + '%">' + rows.map(function (o) {
        var w = Math.max(6, o.price / max * 100), diff = o.price - cheapest.price;
        return '<button class="hbar" data-jump="' + o.id + '"><span class="who">' + esc(o.airline) + '<small>' + (o.stops ? o.stops + " stop" + (o.stops > 1 ? "s" : "") : "direct") + " · " + dur(o.durationMin) + '</small></span><span class="bt"><span class="fill ' + (o.id === cheapest.id ? "low" : o.stops ? "stop" : "direct") + '" style="width:' + w.toFixed(1) + '%"></span></span><span class="amt">' + money(o.price) + "<small>" + (diff ? "+" + money(diff) : "cheapest") + "</small></span></button>";
      }).join("") + "</div></div>";
  }
  function fareGraph(o, all, live) {
    var prices = all.map(function (x) { return x.price; }).sort(function (a, b) { return a - b; });
    var low = prices[0], high = prices[prices.length - 1];
    var avg = Math.round(prices.reduce(function (t, p) { return t + p; }, 0) / prices.length);
    var direct = all.filter(function (x) { return !x.stops; }).map(function (x) { return x.price; });
    var rows = [["This flight", o.price, "me"], ["Cheapest on route", low, "low"], ["Route average", avg, "avg"]];
    if (direct.length) rows.push(["Cheapest direct", Math.min.apply(null, direct), "direct"]);
    rows.push(["Highest on route", high, "high"]);
    var pct = Math.round((o.price - avg) / avg * 100);
    var verdict = o.price === low ? ["good", "Lowest fare on this route"] : pct <= -5 ? ["good", Math.abs(pct) + "% below the route average"] : pct < 8 ? ["ok", "About average for this route"] : ["high", pct + "% above the route average"];
    var rank = prices.indexOf(o.price) + 1;
    return '<div class="fgraph"><div class="fg-head"><span class="verdict ' + verdict[0] + '">' + verdict[1] + '</span><span class="rank">#' + rank + " of " + prices.length + " by price" + (live ? "" : " · estimates") + "</span></div>" +
      rows.map(function (r) { return '<div class="fg-row ' + r[2] + '"><span class="lab">' + r[0] + '</span><span class="bt"><span class="fill" style="width:' + Math.max(5, r[1] / high * 100).toFixed(1) + '%"></span></span><span class="amt">' + money(r[1]) + "</span></div>"; }).join("") +
      "</div>";
  }
  function pick(key, k, v, s) { return '<button class="pick" data-sort="' + key + '" aria-pressed="' + (state.sort === key) + '"><div class="k">' + k + '</div><div class="v">' + v + '</div><div class="s">' + esc(s) + "</div></button>"; }
  function stopChip(n, label) { return '<button class="chip" data-stops="' + n + '" aria-pressed="' + (state.maxStops === n) + '">' + label + "</button>"; }
  function selectFlight(id) {
    var res = state.legRes[state.legIdx], o = res.offers.filter(function (x) { return x.id === id; })[0];
    if (!o) return;
    var already = state.sel[state.legIdx] && state.sel[state.legIdx].id === id;
    state.sel[state.legIdx] = already ? null : Object.assign({}, o, { date: state.legs[state.legIdx].date, fromCity: res.from.city, toCity: res.to.city, q: legQuery(state.legIdx), live: res.source !== "sample" });
    if (!already) {
      for (var j = 1; j <= state.legs.length; j++) { var n = (state.legIdx + j) % state.legs.length; if (!state.sel[n]) { if (n !== state.legIdx) { state.legIdx = n; state.maxPrice = null; state.open = {}; window.scrollTo({ top: $("results").offsetTop - 80, behavior: "smooth" }); } break; } }
    }
    renderFlights(); renderTrip();
  }

  // ---------- hotels ----------
  function hotelQuery() { var c = resolve($("city").value); return c ? { city: c.city, code: c.code, checkin: $("checkin").value, checkout: $("checkout").value, guests: +$("guests").value } : null; }
  function runHotels(e) {
    if (e) e.preventDefault();
    var err = $("hotel-err"), q = hotelQuery();
    if (!q) { err.textContent = "We couldn't find \"" + $("city").value + "\". Try another spelling, like Abu Dhabi, Bangkok or Paris."; err.hidden = false; return; }
    if (!q.checkin || !q.checkout || q.checkout <= q.checkin) { err.textContent = "Check-out must be after check-in."; err.hidden = false; return; }
    err.hidden = true;
    var c = M.airport(q.code); showArt(c, "Stays in " + esc(c.city), nice(q.checkin) + " – " + nice(q.checkout));
    findHotels({ city: q.code, checkin: q.checkin, checkout: q.checkout, guests: q.guests }).then(function (res) {
      if (res.error) { err.textContent = res.error; err.hidden = false; $("results").innerHTML = ""; return; }
      res.q = q; state.hotel = res; renderHotels();
    });
  }
  function renderHotels() {
    var res = state.hotel; if (!res) return;
    var q = res.q, sel = state.hotelSel, img = A.thumb(res.city.code, 480, 300);
    var h = '<div class="status"><span class="pill est">Price guide</span><span>' + esc(res.city.city) + " · " + nice(q.checkin) + " to " + nice(q.checkout) + " · " + res.nights + " night" + (res.nights > 1 ? "s" : "") + " · " + q.guests + " guest" + (q.guests > 1 ? "s" : "") + "</span></div>";
    h += '<div class="panel"><h2>Compare hotels in ' + esc(res.city.city) + "</h2><p>Each site opens with your city, dates and guests filled in, showing real hotels and live prices.</p>" + sitesHtml(M.links.hotels(q)) + "</div>";
    h += hotelList(res, q, sel, img);
    h += '<div class="panel"><h2>What to expect to pay</h2><p>Typical total for your stay by hotel class. Add one to your trip to plan the budget, then book on any site above.</p><div class="tiers">' +
      res.tiers.map(function (t, i) {
        var isPicked = sel && !sel.name && sel.code === res.city.code && sel.stars === t.stars;
        return '<div class="tier' + (isPicked ? " picked" : "") + '"><img src="' + img + '" alt="" style="object-position:' + (i * 33) + '% 60%"><div class="body"><div class="stars">' + "★".repeat(t.stars) + '</div><div class="name">' + t.label + '</div><div class="about">' + t.about + '</div><div class="price">' + money(t.total) + '</div><div class="via">about ' + money(t.low) + "–" + money(t.high) + ' a night</div><div class="acts" style="justify-content:flex-start"><a class="bookln" href="' + esc(M.links.hotels(q)[0].url) + "&nflt=class%3D" + t.stars + '" target="_blank" rel="noopener">See ' + t.stars + '★ on Booking.com ↗</a><button class="selbtn" data-tier="' + t.stars + '">' + (isPicked ? "✓ In trip" : "Add to trip") + "</button></div></div></div>";
      }).join("") + "</div></div>";
    $("results").innerHTML = h;
  }
  // Real, well-known hotels for the city, each opening its own live room price.
  function hotelLinks(name, q) {
    var hq = Object.assign({}, q, { city: name + ", " + q.city });
    return M.links.hotels(hq).filter(function (x) { return /Booking|Agoda|Expedia|Google|Trip\.com/.test(x.name); });
  }
  function hotelEstimate(hotel, res) {
    var t = res.tiers.filter(function (x) { return x.stars === Math.max(2, hotel[1]); })[0] || res.tiers[0];
    var f = 0.9 + (hotel[0].length % 7) * 0.05, perNight = Math.round(t.perNight * f * (hotel[3] ? 2.2 : 1));
    return { perNight: perNight, total: perNight * res.nights };
  }
  function hotelList(res, q, sel, img) {
    var list = (window.DDHotels ? DDHotels.byCity(res.city.code) : []).slice();
    var f = state.hotelStars || 0;
    var shown = list.filter(function (x) { return !f || x[1] === f; }).map(function (x) { return { h: x, e: hotelEstimate(x, res) }; });
    shown.sort(function (a, b) { return state.hotelSort === "high" ? b.e.total - a.e.total : a.e.total - b.e.total; });
    var h = '<div class="panel"><h2>Hotels in ' + esc(res.city.city) + "</h2>";
    if (!list.length) return h + "<p>Tap a site above to see every hotel in " + esc(res.city.city) + " with live room prices, or pick a hotel class below to plan your budget.</p></div>";
    h += '<p>Well-known hotels for your dates. Prices are estimates; <b>Book</b> opens the hotel on the site with your dates and guests filled in, showing the live room price.</p>';
    var counts = {}; list.forEach(function (x) { counts[x[1]] = (counts[x[1]] || 0) + 1; });
    h += '<div class="bar-tools"><button class="chip" data-hstars="0" aria-pressed="' + !f + '">All (' + list.length + ")</button>" +
      [5, 4, 3, 2].filter(function (n) { return counts[n]; }).map(function (n) { return '<button class="chip" data-hstars="' + n + '" aria-pressed="' + (f === n) + '">' + n + "★ (" + counts[n] + ")</button>"; }).join("") +
      '<button class="chip" data-hsort="' + (state.hotelSort === "high" ? "low" : "high") + '">' + (state.hotelSort === "high" ? "Price: high to low" : "Price: low to high") + " ⇅</button></div>";
    h += '<div class="hlist">' + shown.map(function (x, i) {
      var ho = x.h, links = hotelLinks(ho[0], q), isPicked = sel && sel.name === ho[0] && sel.code === res.city.code;
      return '<article class="hcard' + (isPicked ? " picked" : "") + '" style="animation-delay:' + i * 35 + 'ms"><div class="hthumb"><img src="' + img + '" alt="" style="object-position:' + ((i * 37) % 100) + '% 55%"><span class="hstar">' + ho[1] + "★</span></div>" +
        '<div class="hinfo"><div class="stars">' + "★".repeat(ho[1]) + (ho[3] ? ' <span class="iconic">Landmark hotel</span>' : "") + '</div><div class="hname">' + esc(ho[0]) + '</div><div class="harea">' + esc(ho[2]) + ", " + esc(res.city.city) + '</div><div class="sites hsites">' + links.slice(1).map(function (l) { return '<a class="site" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.name) + " <i>↗</i></a>"; }).join("") + "</div></div>" +
        '<div class="hprice"><div class="price">' + money(x.e.total) + '</div><div class="via">est. total · ~' + money(x.e.perNight) + "/night</div>" +
        '<a class="bookln" href="' + esc(links[0].url) + '" target="_blank" rel="noopener">Book on Booking.com ↗</a><button class="selbtn" data-hotel="' + esc(ho[0]) + '">' + (isPicked ? "✓ In trip" : "Add to trip") + "</button></div></article>";
    }).join("") + "</div></div>";
    return h;
  }
  function selectHotel(name) {
    var res = state.hotel, ho = DDHotels.byCity(res.city.code).filter(function (x) { return x[0] === name; })[0]; if (!ho) return;
    var already = state.hotelSel && state.hotelSel.name === name, e = hotelEstimate(ho, res);
    state.hotelSel = already ? null : { code: res.city.code, city: res.city.city, stars: ho[1], name: name, label: name, price: e.total, nights: res.nights, q: res.q };
    renderHotels(); renderTrip();
  }
  function selectTier(stars) {
    var res = state.hotel, t = res.tiers.filter(function (x) { return x.stars === stars; })[0];
    var already = state.hotelSel && state.hotelSel.code === res.city.code && state.hotelSel.stars === stars;
    state.hotelSel = already ? null : { code: res.city.code, city: res.city.city, stars: stars, label: t.label, price: t.total, nights: res.nights, q: res.q };
    renderHotels(); renderTrip();
  }

  // ---------- explore ----------
  function runExplore(e) {
    if (e) e.preventDefault();
    var err = $("explore-err"), a = resolve($("ex-from").value);
    if (!a) { err.textContent = "We couldn't find that airport. Try a city like Kochi or a code like COK."; err.hidden = false; return; }
    if (!$("ex-month").value) { err.textContent = "Choose a month."; err.hidden = false; return; }
    err.hidden = true;
    $("results").innerHTML = '<div class="panel empty">Checking about 180 destinations from ' + esc(a.city) + "…</div>";
    setTimeout(function () {
      findPlaces({ from: a.code, month: $("ex-month").value }).then(function (res) {
        if (res.error) { err.textContent = res.error; err.hidden = false; $("results").innerHTML = ""; return; }
        state.explore = res; state.exShow = 36; renderExplore();
      });
    }, 20);
  }
  var io = window.IntersectionObserver ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { var im = en.target; im.src = A.thumb(im.dataset.art, 320, 400); io.unobserve(im); } });
  }, { rootMargin: "300px" }) : null;
  function renderExplore() {
    var res = state.explore; if (!res) return;
    var budget = +$("ex-budget").value;
    var all = res.results.filter(function (r) { return !budget || r.price <= budget; });
    var list = all.slice(0, state.exShow || 36);
    if (list[0]) showArt(list[0].to, "Cheapest from " + esc(res.from.city), "from " + money(list[0].price));
    var monthName = new Date(res.month + "-01T00:00:00Z").toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
    var h = '<div class="status"><span class="pill est">Estimated fares</span><span>' + list.length + " places from " + esc(res.from.city) + " in " + monthName + (budget ? ", under " + money(budget) + " one way" : "") + ", cheapest first. Tap a poster to see flights.</span></div>";
    if (!list.length) h += '<div class="panel empty">Nothing under this budget. Try a higher budget or another month.</div>';
    h += '<div class="dests">' + list.map(function (r, i) {
      return '<button class="dest" data-go="' + r.to.code + '" data-date="' + r.date + '" style="animation-delay:' + Math.min(i, 12) * 30 + 'ms"><div class="fr"><div><img data-art="' + r.to.code + '" alt="Poster of ' + esc(r.to.city) + '"></div></div><div class="lab"><span class="city">' + esc(r.to.city) + '</span><span class="fare">' + money(r.price) + '</span></div><div class="info">' + esc(r.to.country) + " · " + nice(r.date) + " · " + (r.stops ? r.stops + " stop" : "direct") + " · " + esc(r.airline) + "</div></button>";
    }).join("") + "</div>";
    if (all.length > list.length) h += '<button class="ghost showmore" id="ex-more" type="button">Show more places (' + (all.length - list.length) + " left)</button>";
    $("results").innerHTML = h;
    document.querySelectorAll("img[data-art]").forEach(function (im, i) { if (io && i > 7) io.observe(im); else im.src = A.thumb(im.dataset.art, 320, 400); });
  }
  $("ex-budget").addEventListener("change", function () { state.exShow = 36; if (state.explore) renderExplore(); });
  $("results").addEventListener("click", function (e) { if (e.target.id === "ex-more") { var y = window.scrollY; state.exShow = (state.exShow || 36) + 36; renderExplore(); window.scrollTo(0, y); } });

  // ---------- trip bar and booking ----------
  function tripItems() {
    var items = [];
    state.sel.forEach(function (s, i) { if (s) items.push({ kind: "flight", i: i, s: s }); });
    if (state.hotelSel) items.push({ kind: "hotel", s: state.hotelSel });
    return items;
  }
  function tripTotal() { return tripItems().reduce(function (t, it) { return t + it.s.price; }, 0); }
  function hotelSuggestion() {
    if (!state.legs.length) return null;
    var first = state.legs[0], checkin = first.date, checkout = state.legs[1] ? state.legs[1].date : plus(3, checkin);
    if (checkout <= checkin) checkout = plus(1, checkin);
    return { city: M.airport(first.to), checkin: checkin, checkout: checkout };
  }
  function renderTrip() {
    var items = tripItems(), bar = $("tripbar");
    if (!items.length) { bar.hidden = true; document.body.classList.remove("has-trip"); return; }
    bar.hidden = false; document.body.classList.add("has-trip");
    var chips = items.map(function (it) { return it.kind === "flight" ? '<span class="tchip">✈ ' + it.s.from + "→" + it.s.to + " · " + esc(it.s.airline) + " <b>" + money(it.s.price) + "</b></span>" : '<span class="tchip">⌂ ' + (it.s.name ? esc(it.s.name) : it.s.stars + "★ in " + esc(it.s.city)) + " <b>" + money(it.s.price) + "</b></span>"; });
    state.legs.forEach(function (l, i) { if (!state.sel[i] && state.legRes[i]) chips.push('<span class="tchip todo">✈ ' + l.from + "→" + l.to + " not chosen yet</span>"); });
    var sug = hotelSuggestion();
    var addHotel = !state.hotelSel && sug && sug.city ? '<button class="ghost" id="add-hotel">+ Hotel in ' + esc(sug.city.city) + "</button>" : "";
    bar.innerHTML = '<div class="wrap"><div class="items">' + chips.join("") + '</div><div class="total"><small>Trip estimate</small>' + money(tripTotal()) + "</div>" + addHotel + '<button class="btn" id="review">Book this trip</button></div>';
  }
  $("tripbar").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    if (b.id === "add-hotel") { var s = hotelSuggestion(); $("city").value = s.city.city; $("checkin").value = s.checkin; $("checkout").value = s.checkout; $("guests").value = Math.min(6, Math.max(1, state.q.adults)); setMode("hotels", true); runHotels(); window.scrollTo({ top: $("results").offsetTop - 80, behavior: "smooth" }); }
    if (b.id === "review") openBooking();
  });

  function isSaved(l) { return state.saved.some(function (s) { return s.from === l.from && s.to === l.to && s.date === l.date; }); }
  function persistSaved() { store("dd-saved", JSON.stringify(state.saved)); $("saved-count").textContent = state.saved.length; }
  function toggleTrack() {
    var l = state.legs[state.legIdx], res = state.legRes[state.legIdx];
    if (isSaved(l)) state.saved = state.saved.filter(function (s) { return !(s.from === l.from && s.to === l.to && s.date === l.date); });
    else state.saved.unshift({ from: l.from, to: l.to, date: l.date, adults: state.q.adults, cabin: state.q.cabin, price: Math.min.apply(null, res.offers.map(function (o) { return o.price; })), savedAt: new Date().toISOString().slice(0, 10) });
    persistSaved(); renderFlights();
  }

  var sheet = $("sheet");
  function openSheet(html) { $("sheet-in").innerHTML = html; if (!sheet.open) { if (sheet.showModal) sheet.showModal(); else sheet.setAttribute("open", ""); } }
  function closeSheet() { if (sheet.close) sheet.close(); else sheet.removeAttribute("open"); }
  sheet.addEventListener("click", function (e) { if (e.target === sheet) closeSheet(); });

  function openSaved() {
    var rows = state.saved.map(function (s, i) {
      var r = M.searchFlights(s), now = r.error ? s.price : Math.min.apply(null, r.offers.map(function (o) { return o.price; })), diff = now - s.price;
      return '<div class="saved-row"><div><div><b>' + s.from + " → " + s.to + "</b> · " + nice(s.date) + '</div><div class="via">Lowest now <b>' + money(now) + "</b>" + (diff ? ' <span class="' + (diff < 0 ? "drop" : "rise") + '">' + (diff < 0 ? "▼ " : "▲ ") + money(Math.abs(diff)) + "</span>" : " · no change") + " since " + s.savedAt + '</div></div><div class="acts"><button class="ghost" data-saved-go="' + i + '">Search</button><button class="rm" data-saved-rm="' + i + '" aria-label="Stop tracking">×</button></div></div>';
    }).join("");
    openSheet('<div class="sheet-head"><h3>Saved trips</h3><button class="x" data-close aria-label="Close">×</button></div>' +
      (rows || '<div class="empty">Nothing saved yet. Tap "Track this price" on any flight search to keep it here.</div>') +
      '<div class="note">Saved trips are kept on this device. Email alerts when a fare drops arrive once the site runs with live prices.</div>');
  }
  $("saved-open").addEventListener("click", openSaved);

  function openBooking() { if (!tripItems().length) return; state.booking = { step: state.booking && state.booking.step === 2 ? 2 : 1 }; renderBooking(); }
  function steps(n) { return '<div class="steps"><span class="on"></span><span class="' + (n >= 2 ? "on" : "") + '"></span></div>'; }
  function itemKey(it) { return it.kind === "flight" ? "f" + it.i + it.s.id : "h" + it.s.code + it.s.stars + (it.s.name || ""); }
  function lineItems(withLinks) {
    return tripItems().map(function (it) {
      var s = it.s, k = itemKey(it), done = state.opened[k];
      if (it.kind === "flight") {
        var book = s.bookUrl || s.site, sites = M.links.flights(s.q).slice(0, 5);
        return '<div class="line-item' + (done && withLinks ? " done" : "") + '"><div><div class="t">✈ ' + esc(s.fromCity || s.from) + " → " + esc(s.toCity || s.to) + '</div><div class="d">' + nice(s.date) + " · " + hm(s.departs) + "–" + hm(s.arrives) + " · " + esc(s.airline) + " · " + (s.stops ? s.stops + " stop" + (s.stops > 1 ? "s" : "") + " via " + s.via.join(", ") : "direct") + '</div></div><div class="p">' + money(s.price) + "<small>" + (s.live ? "live fare" : "estimate") + "</small></div>" +
          (withLinks ? '<div class="sites">' + (book ? '<a class="bookln" data-k="' + k + '" href="' + esc(book) + '" target="_blank" rel="noopener">Book on ' + esc(host(book)) + " ↗</a>" : "") + sites.map(function (x) { return '<a class="site" data-k="' + k + '" href="' + esc(x.url) + '" target="_blank" rel="noopener">' + esc(x.name) + " <i>↗</i></a>"; }).join("") + "</div>" : "") + "</div>";
      }
      var hs = s.name ? hotelLinks(s.name, s.q) : M.links.hotels(s.q).slice(0, 5);
      return '<div class="line-item' + (done && withLinks ? " done" : "") + '"><div><div class="t">⌂ ' + (s.name ? esc(s.name) + ", " + esc(s.city) + " (" + s.stars + "★)" : s.stars + "★ " + esc(s.label) + " hotel, " + esc(s.city)) + '</div><div class="d">' + nice(s.q.checkin) + " to " + nice(s.q.checkout) + " · " + s.nights + " night" + (s.nights > 1 ? "s" : "") + " · " + s.q.guests + ' guests</div></div><div class="p">' + money(s.price) + "<small>" + (s.name ? "estimate" : "typical price") + "</small></div>" +
        (withLinks ? '<div class="sites">' + hs.map(function (x, i) { return '<a class="' + (i ? "site" : "bookln") + '" data-k="' + k + '" href="' + esc(x.url) + '" target="_blank" rel="noopener">' + (i ? "" : "Book on ") + esc(x.name) + (i ? " <i>↗</i>" : " ↗") + "</a>"; }).join("") + "</div>" : "") + "</div>";
    }).join("");
  }
  function renderBooking() {
    var b = state.booking, missing = state.legs.filter(function (l, i) { return !state.sel[i] && state.legRes[i]; }).length;
    var head = '<div class="sheet-head"><h3>' + (b.step === 1 ? "Your trip" : "Book each part") + '</h3><button class="x" data-close aria-label="Close">×</button></div>' + steps(b.step);
    if (b.step === 1) {
      openSheet(head + '<div class="steplabel">Step 1 of 2 · Check the plan</div>' + lineItems(false) +
        (missing ? '<div class="note">You still have ' + missing + " flight" + (missing > 1 ? "s" : "") + " to choose. You can continue now or close this and pick the rest.</div>" : "") +
        '<div class="sum"><span>Trip estimate</span><b>' + money(tripTotal()) + "</b></div>" +
        '<div class="sheet-actions"><button class="ghost" data-close>Keep browsing</button><button class="btn" data-step="2">Continue to booking</button></div>');
    } else {
      var items = tripItems(), doneN = items.filter(function (it) { return state.opened[itemKey(it)]; }).length;
      openSheet(head + '<div class="steplabel">Step 2 of 2 · ' + doneN + " of " + items.length + " opened</div>" +
        '<div class="note">Each part is booked directly with the airline, hotel or booking site, so you pay them and get your tickets from them. Buttons open in a new tab with your details filled in.</div>' +
        lineItems(true) + '<div class="sum"><span>Trip estimate</span><b>' + money(tripTotal()) + "</b></div>" +
        '<div class="sheet-actions"><button class="ghost" data-step="1">Back</button><button class="ghost" data-savetrip>Save this trip</button><button class="btn" data-close>Done</button></div>');
    }
  }
  sheet.addEventListener("click", function (e) {
    var a = e.target.closest("a[data-k]"); if (a) { state.opened[a.dataset.k] = true; setTimeout(renderBooking, 50); return; }
    var t = e.target.closest("button"); if (!t) return;
    if (t.hasAttribute("data-close")) closeSheet();
    if (t.dataset.step) { state.booking.step = +t.dataset.step; renderBooking(); }
    if (t.hasAttribute("data-savetrip")) { state.sel.forEach(function (s) { if (s && !isSaved({ from: s.from, to: s.to, date: s.date })) state.saved.unshift({ from: s.from, to: s.to, date: s.date, adults: s.adults, cabin: s.cabin, price: s.price, savedAt: new Date().toISOString().slice(0, 10) }); }); persistSaved(); t.textContent = "✓ Saved"; }
    if (t.dataset.savedGo) { var s = state.saved[+t.dataset.savedGo]; closeSheet(); state.trip = "oneway"; state.legsForm = [{ from: s.from, to: s.to, date: s.date }]; renderLegsForm(); setMode("flights", true); runFlights(); }
    if (t.dataset.savedRm) { state.saved.splice(+t.dataset.savedRm, 1); persistSaved(); openSaved(); if (state.mode === "flights") renderFlights(); }
  });

  // ---------- events ----------
  function render() { if (state.mode === "flights") renderFlights(); else if (state.mode === "hotels") renderHotels(); else renderExplore(); }
  $("results").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    if (b.dataset.legTab) { state.legIdx = +b.dataset.legTab; state.maxPrice = null; state.open = {}; renderFlights(); var l = state.legs[state.legIdx], fa = M.airport(l.from), ta = M.airport(l.to); showArt(ta, esc(fa.city) + " → " + esc(ta.city), l.from + " → " + l.to); }
    else if (b.dataset.jump) { state.open = {}; state.open[b.dataset.jump] = true; state.maxStops = 3; state.maxPrice = null; renderFlights(); var el = document.querySelector('[data-open="' + b.dataset.jump + '"]'); if (el) el.closest(".card").scrollIntoView({ behavior: "smooth", block: "center" }); }
    else if (b.dataset.pick) selectFlight(b.dataset.pick);
    else if (b.dataset.tier) selectTier(+b.dataset.tier);
    else if (b.dataset.hotel) selectHotel(b.dataset.hotel);
    else if (b.dataset.hstars) { state.hotelStars = +b.dataset.hstars; renderHotels(); }
    else if (b.dataset.hsort) { state.hotelSort = b.dataset.hsort; renderHotels(); }
    else if (b.dataset.track) toggleTrack();
    else if (b.dataset.sort) { state.sort = b.dataset.sort; renderFlights(); }
    else if (b.dataset.stops) { state.maxStops = +b.dataset.stops; renderFlights(); }
    else if (b.dataset.go) { var from = state.explore.from.code; state.trip = "return"; state.legsForm = [{ from: from, to: b.dataset.go, date: b.dataset.date }]; state.ret = plus(7, b.dataset.date); renderLegsForm(); setMode("flights", true); runFlights(); window.scrollTo({ top: 0, behavior: "smooth" }); }
    else if (b.dataset.date) rerunLeg(state.legIdx, b.dataset.date);
    else if (b.dataset.open) { state.open[b.dataset.open] = !state.open[b.dataset.open]; render(); }
  });
  $("results").addEventListener("change", function (e) { if (e.target.id === "maxprice") { state.maxPrice = +e.target.value; renderFlights(); var m = $("maxprice"); if (m) m.focus(); } });
  $("results").addEventListener("input", function (e) { if (e.target.id === "maxprice") $("maxprice-v").textContent = money(+e.target.value); });
  $("currency").addEventListener("change", function () { state.currency = this.value; store("dd-cur", this.value); render(); renderTrip(); });
  $("flight-form").addEventListener("submit", runFlights);
  $("hotel-form").addEventListener("submit", runHotels);
  $("explore-form").addEventListener("submit", runExplore);
  $("city").addEventListener("change", function () { var c = resolve(this.value); if (c) showArt(c, "Stays in " + esc(c.city), c.code); });
  $("ex-from").addEventListener("change", function () { var c = resolve(this.value); if (c) showArt(c, "Flying from " + esc(c.city), c.code); });

  var COPY = {
    flights: ["Flights to anywhere", "See the world, <em>for less.</em>", "Real airlines on every route, the cheapest day to fly, and one tap to compare the same trip on Google Flights, Skyscanner, Kayak, Expedia, MakeMyTrip and more."],
    hotels: ["Stays in 180 cities", "Rest somewhere <em>beautiful.</em>", "See what a stay should cost, then compare the same dates on Booking.com, Agoda, Expedia, Hotels.com, Airbnb and more in one tap."],
    explore: ["The gallery", "Have a budget? <em>See where it goes.</em>", "Pick your home airport and a month. Every destination is ranked from cheapest to dearest, each with its own poster."]
  };
  function setMode(m, quiet) {
    state.mode = m;
    ["flights", "hotels", "explore"].forEach(function (k) { $("tab-" + k).setAttribute("aria-selected", k === m); $(k === "flights" ? "flight-form" : k === "hotels" ? "hotel-form" : "explore-form").hidden = k !== m; });
    $("eyebrow").textContent = COPY[m][0]; $("headline").innerHTML = COPY[m][1]; $("lede").textContent = COPY[m][2];
    if (quiet) return;
    if (m === "flights") { if (state.legRes.length) { previewFromForm(); renderFlights(); } else runFlights(); }
    else if (m === "hotels") { if (state.hotel) { var c = state.hotel.city; showArt(c, "Stays in " + esc(c.city), c.code); renderHotels(); } else { var s = hotelSuggestion(); if (s && s.city) { $("city").value = s.city.city; $("checkin").value = s.checkin; $("checkout").value = s.checkout; } runHotels(); } }
    else { if (state.explore) renderExplore(); else runExplore(); }
  }
  ["flights", "hotels", "explore"].forEach(function (k) { $("tab-" + k).addEventListener("click", function () { setMode(k); }); });

  // Small API for Leo, the trip buddy (buddy.js).
  window.DD = {
    money: function (usd) { return money(usd); },
    home: function () { var a = resolve(state.legsForm[0].from); return a ? a.code : "DXB"; },
    month: function () { return (state.legsForm[0].date || plus(30)).slice(0, 7); },
    context: function () {
      return { mode: state.mode, trip: state.trip, currency: state.currency,
        legs: (state.legs.length ? state.legs : state.legsForm).map(function (l) { var a = resolve(l.from), b = resolve(l.to); return { from: a ? a.code : l.from, to: b ? b.code : l.to, date: l.date }; }),
        hotelCity: state.hotel ? state.hotel.city.city : null, picked: tripItems().length };
    },
    deals: function () {
      if (state.mode === "flights" && state.legRes[state.legIdx]) { var r = state.legRes[state.legIdx], l = state.legs[state.legIdx]; return { kind: "flights", leg: l, idx: state.legIdx, offers: r.offers, calendar: r.calendar || [], from: r.from, to: r.to, live: r.source !== "sample" }; }
      if (state.mode === "hotels" && state.hotel) return { kind: "hotels", city: state.hotel.city, nights: state.hotel.nights, tiers: state.hotel.tiers };
      return null;
    },
    pickDay: function (date) { rerunLeg(state.legIdx, date); },
    setHome: function (code) { if (!M.airport(code)) return; state.legsForm[0].from = code; renderLegsForm(); },
    hotelsIn: function (code) {
      var c = M.airport(code); if (!c) return;
      var first = state.legsForm[0], ci = first && first.to === code ? first.date : plus(30), co = state.trip === "return" && state.ret > ci ? state.ret : plus(3, ci);
      $("city").value = c.city; $("checkin").value = ci; $("checkout").value = co;
      setMode("hotels", true); runHotels(); window.scrollTo({ top: 0, behavior: "smooth" });
    },
    flyTo: function (code, date) {
      state.trip = "return"; state.legsForm = [{ from: window.DD.home(), to: code, date: date }]; state.ret = plus(7, date);
      document.querySelectorAll("[data-trip]").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.trip === "return"); });
      renderLegsForm(); setMode("flights", true); runFlights(); window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  renderLegsForm(); persistSaved(); previewFromForm();
  runFlights();
})();
