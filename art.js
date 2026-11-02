/* Davis Travels poster studio.
   Paints a travel-poster style artwork of a city's landmark onto any canvas.
   Art.paint(canvas, code) · Art.info(code) · Art.thumb(code, w, h) */
(function () {
  // ---------- palettes: sky top, sky middle, horizon, sun, far hills, mid ground, near ground, landmark, rim light ----------
  var PAL = {
    gold:    ["#1d2347", "#8c4a6b", "#f2a65a", "#ffd58a", "#9a5a72", "#5a3456", "#24182f", "#2b1d38", "#ffcf8a"],
    saffron: ["#2a1e4a", "#b8566a", "#f6b26b", "#fff0c2", "#a6687c", "#6a3a5c", "#2c1a33", "#3a2140", "#ffe0a8"],
    lagoon:  ["#12324a", "#2f7f86", "#f3c27a", "#ffe7a6", "#3a7a74", "#1f4f4c", "#0f2a2a", "#123a37", "#ffe2a0"],
    mist:    ["#1e2a44", "#5b6f99", "#e9b98f", "#fbe3c4", "#7686a8", "#3f4d70", "#1c2236", "#232a44", "#f8d8b0"],
    nordic:  ["#0d1b2e", "#2b4a6f", "#a9cfc9", "#f2f6e6", "#4c6f8a", "#2a4560", "#111f30", "#162536", "#d9f0e6"],
    sakura:  ["#2a2148", "#c46a8c", "#f7c3a3", "#fff1e6", "#a57196", "#5c3c63", "#24182c", "#2f1f3a", "#ffd9cc"],
    desert:  ["#2b1b3a", "#c0633f", "#f5c16c", "#fff0c0", "#b8774f", "#7a4433", "#3a1f1c", "#43231f", "#ffe0a0"],
    savanna: ["#2a1630", "#d0563b", "#f9b54c", "#ffe08a", "#a5503c", "#5a2a28", "#21110f", "#2a1513", "#ffd28a"],
    city:    ["#121a3a", "#4a3f7a", "#f09a7a", "#ffd7b0", "#5d528a", "#352c5c", "#15122a", "#1c1834", "#ffc9a8"],
    andes:   ["#16213e", "#3f6e8c", "#f0c48a", "#fff0d0", "#5b7f93", "#2f4a5f", "#14212c", "#1a2a36", "#ffe1b0"],
    tropic:  ["#0e3550", "#2a9fb0", "#ffd59a", "#fff4c8", "#2f9290", "#14605f", "#08302f", "#0b3a38", "#fff0b8"],
    harbour: ["#10284a", "#3f7fb0", "#f6c98f", "#fff1d2", "#4c7fa6", "#284f78", "#0e2140", "#132a48", "#ffe6c0"]
  };

  // ---------- which artwork each city gets: [composition, palette, caption] ----------
  var CITY = {
    DXB: ["burj", "gold", "Burj Khalifa at dusk"], AUH: ["mosque", "gold", "Sheikh Zayed Grand Mosque"], SHJ: ["mosque", "gold", "Sharjah corniche"],
    DOH: ["mosque", "gold", "Doha corniche"], MCT: ["kasbah", "desert", "Muscat old town"], BAH: ["mosque", "gold", "Manama"], KWI: ["burj", "gold", "Kuwait Towers"],
    RUH: ["burj", "desert", "Riyadh skyline"], JED: ["mosque", "gold", "Jeddah waterfront"], DMM: ["mosque", "gold", "Gulf coast"], AMM: ["kasbah", "desert", "Amman citadel"],
    TLV: ["kasbah", "desert", "Jaffa old port"], BEY: ["kasbah", "mist", "Beirut coast"], GYD: ["mosque", "mist", "Baku old city"], TAS: ["mosque", "desert", "Silk Road domes"],
    ALA: ["alps", "nordic", "Tian Shan peaks"],
    DEL: ["taj", "saffron", "Taj Mahal, a day trip from Delhi"], JAI: ["taj", "saffron", "Palaces of Rajasthan"], LKO: ["taj", "saffron", "Mughal domes"], ATQ: ["taj", "saffron", "Golden domes of Punjab"],
    AMD: ["gateway", "saffron", "Arches of Gujarat"], BOM: ["gateway", "saffron", "Gateway of India"], PNQ: ["gateway", "saffron", "Western Ghats gateway"], GOI: ["overwater", "tropic", "Goa beaches"],
    COK: ["kerala", "lagoon", "Chinese fishing nets of Kochi"], CCJ: ["kerala", "lagoon", "Malabar coast palms"], TRV: ["kerala", "lagoon", "Kerala backwaters"], IXE: ["kerala", "lagoon", "Konkan coast"],
    CJB: ["kerala", "lagoon", "Nilgiri palms"], MAA: ["thai", "saffron", "Temple towers of Tamil Nadu"], BLR: ["kerala", "lagoon", "Garden city palms"], HYD: ["gateway", "saffron", "Charminar arches"],
    CCU: ["gateway", "mist", "Victoria Memorial"], CMB: ["kerala", "lagoon", "Sri Lankan coast"], KTM: ["himalaya", "nordic", "Himalaya and Boudhanath"],
    DAC: ["mosque", "lagoon", "Dhaka riverside"], KHI: ["mosque", "gold", "Karachi coast"], LHE: ["mosque", "saffron", "Badshahi Mosque"], ISB: ["mosque", "mist", "Faisal Mosque hills"],
    LHR: ["london", "mist", "Big Ben and the Thames"], MAN: ["alps", "mist", "Peak District"], EDI: ["alps", "mist", "Edinburgh Castle"], DUB: ["canals", "mist", "Dublin quays"],
    CDG: ["eiffel", "mist", "Eiffel Tower"], NCE: ["overwater", "tropic", "Côte d'Azur"], BRU: ["canals", "mist", "Grand Place gables"], GVA: ["alps", "nordic", "Lake Geneva and the Alps"],
    FCO: ["colosseum", "saffron", "The Colosseum"], MXP: ["colosseum", "mist", "Duomo di Milano"], VCE: ["canals", "saffron", "Venetian canals"], MLA: ["colosseum", "desert", "Valletta bastions"],
    ATH: ["parthenon", "saffron", "The Parthenon"], LCA: ["parthenon", "tropic", "Cyprus coast ruins"],
    IST: ["mosque", "sakura", "Hagia Sophia and the Bosphorus"], AYT: ["parthenon", "tropic", "Turquoise coast"],
    AMS: ["canals", "mist", "Amsterdam canals"], CPH: ["canals", "nordic", "Nyhavn"], ARN: ["canals", "nordic", "Gamla Stan"], OSL: ["alps", "nordic", "Norwegian fjords"], HEL: ["canals", "nordic", "Helsinki harbour"],
    KEF: ["alps", "nordic", "Northern lights"], FRA: ["alps", "mist", "Rhine castles"], MUC: ["alps", "nordic", "Bavarian Alps"], BER: ["alps", "mist", "Berlin"], ZRH: ["alps", "nordic", "Swiss Alps"],
    VIE: ["alps", "mist", "Vienna palaces"], PRG: ["alps", "sakura", "Prague Castle"], WAW: ["alps", "mist", "Warsaw old town"], BUD: ["alps", "saffron", "Buda Castle"], OTP: ["alps", "mist", "Carpathian castles"],
    TBS: ["alps", "sakura", "Caucasus mountains"], SVO: ["alps", "nordic", "Moscow domes"],
    BCN: ["sagrada", "saffron", "Sagrada Família"], MAD: ["sagrada", "desert", "Madrid"], AGP: ["sagrada", "tropic", "Costa del Sol"], PMI: ["overwater", "tropic", "Mallorca coves"], LIS: ["sagrada", "harbour", "Lisbon hills"],
    CAI: ["pyramids", "desert", "Pyramids of Giza"], HRG: ["pyramids", "tropic", "Red Sea coast"], SSH: ["pyramids", "tropic", "Sinai and the Red Sea"],
    CMN: ["kasbah", "desert", "Hassan II Mosque"], RAK: ["kasbah", "desert", "Koutoubia, Marrakesh"], TUN: ["kasbah", "tropic", "Sidi Bou Said"], ALG: ["kasbah", "harbour", "Casbah of Algiers"],
    NBO: ["kilimanjaro", "savanna", "Savanna and Kilimanjaro"], ADD: ["kilimanjaro", "savanna", "Ethiopian highlands"], DAR: ["kilimanjaro", "savanna", "Kilimanjaro"], EBB: ["kilimanjaro", "lagoon", "Lake Victoria"],
    KGL: ["kilimanjaro", "lagoon", "Land of a thousand hills"], ZNZ: ["overwater", "tropic", "Zanzibar dhows"], LOS: ["kilimanjaro", "savanna", "West African savanna"], ACC: ["kilimanjaro", "savanna", "Gold Coast"],
    DKR: ["kilimanjaro", "savanna", "Senegal baobabs"], ABV: ["kilimanjaro", "savanna", "Zuma Rock"], LAD: ["kilimanjaro", "savanna", "Angolan coast"],
    JNB: ["table", "savanna", "Highveld sunset"], CPT: ["table", "harbour", "Table Mountain"], MRU: ["overwater", "tropic", "Mauritius lagoon"], SEZ: ["overwater", "tropic", "Seychelles"],
    JFK: ["liberty", "city", "Statue of Liberty"], EWR: ["liberty", "city", "New York Harbor"], BOS: ["skyline", "harbour", "Boston harbor"], PHL: ["skyline", "city", "Philadelphia"], IAD: ["skyline", "mist", "Washington"],
    SFO: ["bridge", "harbour", "Golden Gate Bridge"], LAX: ["bridge", "gold", "Pacific coast"], SEA: ["bridge", "nordic", "Puget Sound"], YVR: ["bridge", "nordic", "Vancouver and the mountains"],
    ORD: ["skyline", "city", "Chicago skyline"], MIA: ["overwater", "tropic", "Miami Beach"], LAS: ["skyline", "desert", "Las Vegas desert"], PHX: ["mayan", "desert", "Sonoran desert"], DEN: ["alps", "nordic", "Rocky Mountains"],
    DFW: ["skyline", "city", "Dallas"], IAH: ["skyline", "city", "Houston"], ATL: ["skyline", "city", "Atlanta"], MCO: ["overwater", "tropic", "Florida coast"], MSP: ["skyline", "nordic", "Minneapolis lakes"],
    DTW: ["skyline", "city", "Detroit riverfront"], HNL: ["overwater", "tropic", "Waikiki and Diamond Head"], YYZ: ["skyline", "city", "Toronto skyline"], YUL: ["skyline", "mist", "Montreal"], YYC: ["alps", "nordic", "Canadian Rockies"],
    MEX: ["mayan", "saffron", "Teotihuacan pyramids"], GDL: ["mayan", "saffron", "Jalisco"], CUN: ["mayan", "tropic", "Chichén Itzá"], HAV: ["mayan", "tropic", "Havana"], PTY: ["skyline", "tropic", "Panama City"], SJO: ["mayan", "lagoon", "Costa Rican rainforest"],
    SJU: ["overwater", "tropic", "Puerto Rico"], NAS: ["overwater", "tropic", "Bahamas"], MBJ: ["overwater", "tropic", "Jamaica"],
    GIG: ["redeemer", "harbour", "Christ the Redeemer"], GRU: ["redeemer", "city", "São Paulo"], BSB: ["redeemer", "andes", "Brasília"], EZE: ["redeemer", "andes", "Buenos Aires"], MVD: ["redeemer", "harbour", "Montevideo"],
    LIM: ["machu", "andes", "Machu Picchu, Peru"], CUZ: ["machu", "andes", "Machu Picchu"], LPB: ["machu", "andes", "Andean altiplano"], SCL: ["machu", "andes", "The Andes"], UIO: ["machu", "andes", "Ecuadorian Andes"],
    BOG: ["machu", "andes", "Andes of Colombia"], MDE: ["machu", "lagoon", "Valley of Aburrá"], CTG: ["overwater", "tropic", "Cartagena coast"], CCS: ["machu", "lagoon", "Ávila mountain"],
    SIN: ["marina", "harbour", "Marina Bay"], KUL: ["petronas", "city", "Petronas Towers"], CGK: ["petronas", "city", "Jakarta"], MNL: ["halong", "tropic", "Philippine islands"],
    BKK: ["thai", "saffron", "Wat Arun"], PNH: ["thai", "saffron", "Khmer temples"], RGN: ["thai", "gold", "Golden pagodas"], SGN: ["thai", "lagoon", "Mekong delta"],
    HAN: ["halong", "lagoon", "Ha Long Bay"], HKT: ["halong", "tropic", "Phang Nga Bay"], LGK: ["halong", "tropic", "Langkawi"], CEB: ["overwater", "tropic", "Cebu islands"],
    DPS: ["bali", "tropic", "Balinese temple gate"], MLE: ["overwater", "tropic", "Maldives water villas"],
    NRT: ["fuji", "sakura", "Mount Fuji"], HND: ["fuji", "sakura", "Mount Fuji"], KIX: ["fuji", "sakura", "Kyoto pagodas"], PUS: ["fuji", "harbour", "Busan coast"], ICN: ["wall", "sakura", "Seoul palaces"],
    HKG: ["hongkong", "harbour", "Victoria Harbour"], MFM: ["hongkong", "gold", "Macau"], SZX: ["hongkong", "city", "Shenzhen"], CAN: ["hongkong", "city", "Pearl River"], TPE: ["hongkong", "sakura", "Taipei"], PVG: ["hongkong", "city", "The Bund, Shanghai"],
    PEK: ["wall", "saffron", "Great Wall of China"], CTU: ["wall", "lagoon", "Sichuan mountains"], ULN: ["wall", "nordic", "Mongolian steppe"],
    SYD: ["sydney", "harbour", "Sydney Opera House"], MEL: ["sydney", "city", "Melbourne"], BNE: ["sydney", "harbour", "Brisbane River"], OOL: ["overwater", "tropic", "Gold Coast"], PER: ["sydney", "gold", "Swan River"],
    ADL: ["sydney", "mist", "Adelaide"], CNS: ["overwater", "tropic", "Great Barrier Reef"], AKL: ["nz", "harbour", "Auckland Sky Tower"], CHC: ["nz", "nordic", "Southern Alps"],
    NAN: ["overwater", "tropic", "Fiji islands"], PPT: ["overwater", "tropic", "Bora Bora lagoon"]
  };

  function info(code) {
    var c = CITY[code];
    var a = window.FareMock && window.FareMock.airport(code);
    if (!c) c = ["skyline", "city", a ? a.city : "City lights"];
    return { comp: c[0], pal: c[1], caption: c[2], city: a ? a.city : code, country: a ? a.country : "" };
  }

  // ---------- helpers ----------
  function rng(seed) { var s = seed >>> 0 || 1; return function () { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }
  function hash(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rgba(hex, a) { var n = parseInt(hex.slice(1), 16); return "rgba(" + (n >> 16) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")"; }
  function mix(h1, h2, t) {
    var a = parseInt(h1.slice(1), 16), b = parseInt(h2.slice(1), 16);
    var r = Math.round((a >> 16) * (1 - t) + (b >> 16) * t), g = Math.round(((a >> 8) & 255) * (1 - t) + ((b >> 8) & 255) * t), bl = Math.round((a & 255) * (1 - t) + (b & 255) * t);
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1);
  }

  var grainTile = null;
  function grain() {
    if (grainTile) return grainTile;
    var g = document.createElement("canvas"); g.width = g.height = 160;
    var x = g.getContext("2d"), img = x.createImageData(160, 160), r = rng(7);
    for (var i = 0; i < img.data.length; i += 4) { var v = Math.floor(r() * 255); img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 22; }
    x.putImageData(img, 0, 0); grainTile = g; return g;
  }

  // ---------- paint ----------
  function paint(cv, code, opts) {
    opts = opts || {};
    var inf = info(code), P = PAL[inf.pal], c = cv.getContext("2d");
    var W = cv.width, H = cv.height;
    var r = rng(hash(code));
    var gy = H * (opts.ground || 0.8);
    var u = Math.min(W, H * 1.15) / 100;
    var S = { c: c, W: W, H: H, gy: gy, u: u, r: r, P: P, x: function (f) { return W * f; } };
    var water = ["kerala", "london", "gateway", "liberty", "bridge", "marina", "halong", "overwater", "hongkong", "sydney", "nz", "thai", "canals", "table", "mosque", "taj", "redeemer"].indexOf(inf.comp) >= 0;

    // sky
    var g = c.createLinearGradient(0, 0, 0, gy);
    g.addColorStop(0, P[0]); g.addColorStop(0.55, P[1]); g.addColorStop(1, P[2]);
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    // stars in the upper sky
    for (var i = 0; i < 70; i++) { c.fillStyle = "rgba(255,248,230," + (0.15 + r() * 0.5) * 0.8 + ")"; var sy = r() * gy * 0.35; c.fillRect(r() * W, sy, u * 0.18, u * 0.18); }
    // sun with poster rays
    var sx = W * (0.62 + r() * 0.2), syy = gy - 26 * u, sr = 9 * u;
    c.save(); c.translate(sx, syy);
    for (var k = 0; k < 18; k++) { c.rotate(Math.PI / 9); c.fillStyle = rgba(P[3], 0.05); c.beginPath(); c.moveTo(0, 0); c.lineTo(W, -W * 0.06); c.lineTo(W, W * 0.06); c.fill(); }
    c.restore();
    var sg = c.createRadialGradient(sx, syy, sr * 0.5, sx, syy, sr * 4); sg.addColorStop(0, rgba(P[3], 0.5)); sg.addColorStop(1, rgba(P[3], 0));
    c.fillStyle = sg; c.fillRect(0, 0, W, H);
    c.fillStyle = P[3]; c.beginPath(); c.arc(sx, syy, sr, 0, 7); c.fill();
    // clouds
    for (var cl = 0; cl < 4; cl++) cloud(S, r() * W, gy * (0.25 + r() * 0.4), (10 + r() * 16) * u, rgba(mix(P[1], P[3], 0.4), 0.35));
    // far and mid hills
    hills(S, gy - 6 * u, 7 * u, P[4], 2.3);
    hills(S, gy - 2 * u, 4 * u, mix(P[4], P[5], 0.5), 3.7);

    // landmark (rim light pass, then body)
    var fn = COMP[inf.comp] || COMP.skyline;
    c.save(); c.translate(-0.45 * u, -0.3 * u); S.rim = true; c.fillStyle = c.strokeStyle = P[8]; fn(S); c.restore();
    S.rim = false; c.fillStyle = c.strokeStyle = P[7]; fn(S);

    // ground or water
    if (water) {
      // reflection
      c.save(); c.beginPath(); c.rect(0, gy, W, H - gy); c.clip();
      var wg = c.createLinearGradient(0, gy, 0, H); wg.addColorStop(0, mix(P[2], P[1], 0.5)); wg.addColorStop(1, P[6]);
      c.fillStyle = wg; c.fillRect(0, gy, W, H - gy);
      c.globalAlpha = 0.28; c.translate(0, 2 * gy); c.scale(1, -1); S.rim = false; c.fillStyle = c.strokeStyle = P[7]; fn(S);
      c.restore();
      c.fillStyle = rgba(P[3], 0.35);
      for (var w = 0; w < 26; w++) { var wy = gy + (r() * (H - gy)); c.fillRect(sx - (10 + r() * 30) * u * (1 - (wy - gy) / (H - gy + 1)), wy, (6 + r() * 26) * u, u * 0.35); }
      if (COMP[inf.comp].fore) COMP[inf.comp].fore(S);
    } else {
      var gg = c.createLinearGradient(0, gy, 0, H); gg.addColorStop(0, P[5]); gg.addColorStop(1, P[6]);
      c.fillStyle = gg; c.fillRect(0, gy, W, H - gy);
      if (COMP[inf.comp].fore) COMP[inf.comp].fore(S);
    }
    // birds
    c.strokeStyle = rgba(P[6], 0.7); c.lineWidth = u * 0.35;
    for (var b = 0; b < 5; b++) { var bx = W * (0.15 + r() * 0.4), by = gy * (0.2 + r() * 0.25), bs = u * (1 + r()); c.beginPath(); c.moveTo(bx - bs, by - bs * 0.5); c.quadraticCurveTo(bx - bs * 0.4, by - bs * 0.6, bx, by); c.quadraticCurveTo(bx + bs * 0.4, by - bs * 0.6, bx + bs, by - bs * 0.5); c.stroke(); }
    // paper grain and vignette
    c.fillStyle = c.createPattern(grain(), "repeat"); c.fillRect(0, 0, W, H);
    var v = c.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.75);
    v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(0,0,0,0.38)"); c.fillStyle = v; c.fillRect(0, 0, W, H);
    return inf;
  }

  function cloud(S, x, y, w, col) {
    var c = S.c; c.fillStyle = col; c.beginPath();
    c.ellipse(x, y, w, w * 0.16, 0, 0, 7); c.ellipse(x - w * 0.3, y - w * 0.1, w * 0.4, w * 0.18, 0, 0, 7); c.ellipse(x + w * 0.25, y - w * 0.12, w * 0.35, w * 0.17, 0, 0, 7); c.fill();
  }
  function hills(S, base, amp, col, freq) {
    var c = S.c, ph = S.r() * 6; c.fillStyle = col; c.beginPath(); c.moveTo(0, S.H);
    for (var x = 0; x <= S.W; x += S.W / 60) c.lineTo(x, base - (Math.sin(x / S.W * freq * Math.PI + ph) * 0.5 + 0.5) * amp - Math.sin(x / S.W * 11 + ph) * amp * 0.15);
    c.lineTo(S.W, S.H); c.fill();
  }
  function poly(S, pts) { var c = S.c; c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (var i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); c.fill(); }
  function rect(S, x, y, w, h) { S.c.fillRect(x, y, w, h); }
  function dome(S, x, y, r, tall) {
    var c = S.c; c.beginPath(); c.moveTo(x - r, y); c.bezierCurveTo(x - r, y - r * (tall || 1.2), x - r * 0.15, y - r * 1.5 * (tall || 1), x, y - r * 1.75 * (tall || 1)); c.bezierCurveTo(x + r * 0.15, y - r * 1.5 * (tall || 1), x + r, y - r * (tall || 1.2), x + r, y); c.fill();
  }
  function minaret(S, x, h, w) {
    var u = S.u, gy = S.gy; rect(S, x - w / 2, gy - h, w, h); rect(S, x - w * 0.9, gy - h * 0.7, w * 1.8, u * 0.6); rect(S, x - w * 0.9, gy - h * 0.92, w * 1.8, u * 0.6);
    poly(S, [[x - w * 0.7, gy - h], [x, gy - h - w * 3], [x + w * 0.7, gy - h]]);
  }
  function palm(S, x, h, lean, base) {
    var c = S.c, u = S.u, b = base || S.gy, tx = x + lean * u, ty = b - h * u;
    c.save(); c.lineCap = "round"; c.lineWidth = 1.1 * u;
    c.beginPath(); c.moveTo(x, b); c.quadraticCurveTo(x + lean * 0.15 * u, b - h * 0.55 * u, tx, ty); c.stroke();
    for (var i = 0; i < 8; i++) {
      var a = -Math.PI * 0.95 + i * (Math.PI * 0.9 / 7), len = (7 + (i % 3)) * u;
      c.beginPath(); c.moveTo(tx, ty); c.quadraticCurveTo(tx + Math.cos(a) * len * 0.6, ty + Math.sin(a) * len * 0.5 - u, tx + Math.cos(a) * len, ty + Math.abs(Math.sin(a)) * u * 1.6 + 2.6 * u);
      c.lineTo(tx + Math.cos(a) * len * 0.9, ty + Math.abs(Math.sin(a)) * u + 2.2 * u); c.closePath(); c.fill(); c.stroke();
    }
    c.restore();
  }
  function cypress(S, x, h) { var c = S.c, u = S.u; c.beginPath(); c.ellipse(x, S.gy - h * u / 2, 1.3 * u, h * u / 2, 0, 0, 7); c.fill(); }
  function pine(S, x, h, base) { var u = S.u, b = base || S.gy; poly(S, [[x - h * 0.28 * u, b], [x, b - h * u], [x + h * 0.28 * u, b]]); }
  function boat(S, x, w, sail) {
    var c = S.c, u = S.u, y = S.gy + 3 * u;
    c.beginPath(); c.moveTo(x - w * u, y); c.quadraticCurveTo(x, y + 2 * u, x + w * u, y - 0.6 * u); c.lineTo(x + w * 0.8 * u, y + 1.2 * u); c.lineTo(x - w * 0.8 * u, y + 1.2 * u); c.fill();
    if (sail) { poly(S, [[x - 0.2 * u, y - 0.3 * u], [x - 0.2 * u, y - w * 1.6 * u], [x + w * 0.9 * u, y - 0.6 * u]]); }
  }
  function lit(S, x, y, w, h, n) { // lit windows, only on the body pass
    if (S.rim) return; var c = S.c, fs = c.fillStyle; c.fillStyle = rgba(S.P[3], 0.75);
    for (var i = 0; i < n; i++) c.fillRect(x + S.r() * w, y + S.r() * h, S.u * 0.5, S.u * 0.7);
    c.fillStyle = fs;
  }
  function towers(S, x0, x1, hMin, hMax) {
    var x = x0, u = S.u;
    while (x < x1) { var w = (3 + S.r() * 5) * u, h = (hMin + S.r() * (hMax - hMin)) * u; rect(S, x, S.gy - h, w, h); lit(S, x, S.gy - h, w, h, Math.floor(h / u / 2)); x += w + S.r() * u; }
  }

  // ---------- compositions ----------
  var COMP = {
    burj: function (S) {
      var u = S.u, gy = S.gy, x = S.x(0.42);
      towers(S, S.x(0.05), S.x(0.3), 8, 24); towers(S, S.x(0.55), S.x(0.95), 8, 26);
      var h = 72;
      for (var i = 0; i < 8; i++) { var f = i / 8, w = (9 - i * 1.05) * u; rect(S, x - w / 2 + (i % 2 ? 0.6 * u : 0), gy - h * u * (0.2 + 0.1 * i) - 1, w, h * u * (0.2 + 0.1 * i)); }
      poly(S, [[x - 0.6 * u, gy - h * 0.9 * u], [x, gy - h * 1.15 * u], [x + 0.6 * u, gy - h * 0.9 * u]]);
      lit(S, x - 4 * u, gy - 55 * u, 8 * u, 50 * u, 30);
    },
    mosque: function (S) {
      var u = S.u, gy = S.gy, x = S.x(0.45);
      rect(S, x - 26 * u, gy - 9 * u, 52 * u, 9 * u);
      dome(S, x, gy - 14 * u, 9 * u); rect(S, x - 9 * u, gy - 15 * u, 18 * u, 6 * u);
      dome(S, x - 17 * u, gy - 9 * u, 4.5 * u); dome(S, x + 17 * u, gy - 9 * u, 4.5 * u);
      dome(S, x - 9 * u, gy - 10 * u, 3 * u); dome(S, x + 9 * u, gy - 10 * u, 3 * u);
      [-28, -22, 22, 28].forEach(function (d, k) { minaret(S, x + d * u, (k % 3 ? 30 : 36) * u, 1.6 * u); });
      rect(S, x - 0.25 * u, gy - 34 * u, 0.5 * u, 5 * u);
      if (!S.rim) { var c = S.c, fs = c.fillStyle; c.fillStyle = rgba(S.P[3], 0.55); for (var a = -4; a <= 4; a++) { c.beginPath(); c.ellipse(x + a * 5 * u, gy - 4 * u, 1.2 * u, 2.5 * u, 0, Math.PI, 0); c.fill(); c.fillRect(x + a * 5 * u - 1.2 * u, gy - 4 * u, 2.4 * u, 3 * u); } c.fillStyle = fs; }
    },
    taj: function (S) {
      var u = S.u, gy = S.gy, x = S.x(0.5);
      rect(S, x - 34 * u, gy - 4 * u, 68 * u, 4 * u);
      rect(S, x - 16 * u, gy - 20 * u, 32 * u, 16 * u);
      dome(S, x, gy - 26 * u, 10 * u, 1.15); rect(S, x - 7 * u, gy - 27 * u, 14 * u, 7 * u);
      rect(S, x - 0.3 * u, gy - 48 * u, 0.6 * u, 4 * u);
      dome(S, x - 12 * u, gy - 21 * u, 3 * u); dome(S, x + 12 * u, gy - 21 * u, 3 * u);
      [-30, 30].forEach(function (d) { minaret(S, x + d * u, 28 * u, 1.8 * u); });
      if (!S.rim) { var c = S.c, fs = c.fillStyle; c.fillStyle = rgba(S.P[3], 0.5); c.beginPath(); c.ellipse(x, gy - 10 * u, 4 * u, 8 * u, 0, Math.PI, 0); c.fill(); c.fillRect(x - 4 * u, gy - 10 * u, 8 * u, 6 * u); c.fillStyle = fs; }
      for (var i = 0; i < 6; i++) { cypress(S, x - 44 * u + i * 3 * u, 9 + (i % 2) * 2); cypress(S, x + 29 * u + i * 3 * u, 9 + (i % 2) * 2); }
    },
    gateway: function (S) {
      var u = S.u, gy = S.gy, x = S.x(0.45);
      towers(S, S.x(0.65), S.x(0.98), 10, 30);
      rect(S, x - 16 * u, gy - 26 * u, 32 * u, 26 * u);
      [-14, -5, 5, 14].forEach(function (d) { rect(S, x + d * u - 1.4 * u, gy - 31 * u, 2.8 * u, 5 * u); dome(S, x + d * u, gy - 31 * u, 1.6 * u); });
      if (!S.rim) { var c = S.c, fs = c.fillStyle; c.fillStyle = mix(S.P[2], S.P[1], 0.3); c.beginPath(); c.ellipse(x, gy - 12 * u, 5 * u, 7 * u, 0, Math.PI, 0); c.fill(); c.fillRect(x - 5 * u, gy - 12 * u, 10 * u, 12 * u); c.fillStyle = fs; }
    },
    kerala: function (S) {
      var u = S.u, gy = S.gy, c = S.c;
      [0.06, 0.14, 0.21, 0.83, 0.9, 0.97].forEach(function (f, i) { palm(S, S.x(f), 22 + (i % 3) * 6, (i % 2 ? -5 : 6)); });
      // Chinese fishing net: cantilever frame with hanging net
      var x = S.x(0.42); c.save(); c.lineWidth = 0.6 * u; c.lineCap = "round";
      c.beginPath(); c.moveTo(x - 10 * u, gy); c.lineTo(x + 6 * u, gy - 22 * u); c.moveTo(x - 4 * u, gy); c.lineTo(x + 6 * u, gy - 22 * u);
      c.moveTo(x + 6 * u, gy - 22 * u); c.lineTo(x + 26 * u, gy - 8 * u); c.moveTo(x + 6 * u, gy - 22 * u); c.lineTo(x + 14 * u, gy - 1 * u);
      c.moveTo(x + 26 * u, gy - 8 * u); c.quadraticCurveTo(x + 20 * u, gy + 2 * u, x + 14 * u, gy - 1 * u); c.stroke();
      c.lineWidth = 0.18 * u; for (var i = 0; i < 6; i++) { c.beginPath(); c.moveTo(x + 6 * u + i * 3.3 * u, gy - 22 * u + i * 2.3 * u); c.lineTo(x + 14 * u + i * 2 * u, gy - 1 * u - i * 1.1 * u); c.stroke(); }
      c.restore();
      // houseboat
      var hx = S.x(0.7), hy = gy - 0.5 * u;
      c.beginPath(); c.moveTo(hx - 14 * u, hy - 3 * u); c.quadraticCurveTo(hx, hy + 3 * u, hx + 14 * u, hy - 4 * u); c.lineTo(hx + 12 * u, hy); c.lineTo(hx - 12 * u, hy); c.fill();
      c.beginPath(); c.moveTo(hx - 10 * u, hy - 1 * u); c.quadraticCurveTo(hx - 9 * u, hy - 8 * u, hx, hy - 8.5 * u); c.quadraticCurveTo(hx + 9 * u, hy - 8 * u, hx + 10 * u, hy - 1 * u); c.fill();
    },
    himalaya: function (S) {
      var u = S.u, gy = S.gy, c = S.c, x = S.x(0.35);
      if (S.rim) return;
      poly(S, [[S.x(0.0), gy - 10 * u], [S.x(0.22), gy - 50 * u], [S.x(0.4), gy - 22 * u], [S.x(0.6), gy - 58 * u], [S.x(0.85), gy - 18 * u], [S.x(1), gy - 30 * u], [S.x(1), gy], [0, gy]]);
      var fs = c.fillStyle; c.fillStyle = "#f4f1ea";
      poly(S, [[S.x(0.18), gy - 42 * u], [S.x(0.22), gy - 50 * u], [S.x(0.26), gy - 42 * u], [S.x(0.24), gy - 44 * u], [S.x(0.2), gy - 43 * u]]);
      poly(S, [[S.x(0.55), gy - 48 * u], [S.x(0.6), gy - 58 * u], [S.x(0.65), gy - 47 * u], [S.x(0.62), gy - 50 * u], [S.x(0.58), gy - 48 * u]]);
      c.fillStyle = fs;
      c.fillStyle = S.P[6]; rect(S, x - 14 * u, gy - 4 * u, 28 * u, 4 * u); c.beginPath(); c.ellipse(x, gy - 4 * u, 10 * u, 7 * u, 0, Math.PI, 0); c.fill();
      rect(S, x - 2.5 * u, gy - 15 * u, 5 * u, 4 * u); poly(S, [[x - 2 * u, gy - 15 * u], [x, gy - 25 * u], [x + 2 * u, gy - 15 * u]]); c.fillStyle = fs;
    },
    london: function (S) {
      var u = S.u, gy = S.gy, c = S.c, x = S.x(0.3);
      rect(S, x + 3 * u, gy - 10 * u, 40 * u, 10 * u);
      for (var i = 0; i < 10; i++) { rect(S, x + 4 * u + i * 4 * u, gy - 13 * u, 1 * u, 3 * u); poly(S, [[x + 4 * u + i * 4 * u, gy - 13 * u], [x + 4.5 * u + i * 4 * u, gy - 15 * u], [x + 5 * u + i * 4 * u, gy - 13 * u]]); }
      rect(S, x - 3.5 * u, gy - 42 * u, 7 * u, 42 * u); rect(S, x - 4.2 * u, gy - 46 * u, 8.4 * u, 6 * u);
      poly(S, [[x - 4 * u, gy - 46 * u], [x, gy - 58 * u], [x + 4 * u, gy - 46 * u]]); rect(S, x - 0.2 * u, gy - 62 * u, 0.4 * u, 4 * u);
      if (!S.rim) { var fs = c.fillStyle; c.fillStyle = rgba(S.P[3], 0.9); c.beginPath(); c.arc(x, gy - 38 * u, 2.4 * u, 0, 7); c.fill(); c.fillStyle = fs; }
      // London Eye
      var ex = S.x(0.78), ey = gy - 18 * u, er = 15 * u; c.save(); c.lineWidth = 0.5 * u; c.beginPath(); c.arc(ex, ey, er, 0, 7); c.stroke();
      for (var k = 0; k < 16; k++) { var a = k * Math.PI / 8; c.beginPath(); c.moveTo(ex, ey); c.lineTo(ex + Math.cos(a) * er, ey + Math.sin(a) * er); c.lineWidth = 0.15 * u; c.stroke(); c.beginPath(); c.arc(ex + Math.cos(a) * er, ey + Math.sin(a) * er, 0.8 * u, 0, 7); c.fill(); }
      c.lineWidth = 0.8 * u; c.beginPath(); c.moveTo(ex - 5 * u, gy); c.lineTo(ex, ey); c.lineTo(ex + 5 * u, gy); c.stroke(); c.restore();
    },
    eiffel: function (S) {
      var u = S.u, gy = S.gy, c = S.c, x = S.x(0.5), h = 62 * u;
      c.beginPath(); c.moveTo(x - 15 * u, gy); c.quadraticCurveTo(x - 4 * u, gy - h * 0.45, x - 0.8 * u, gy - h); c.lineTo(x + 0.8 * u, gy - h); c.quadraticCurveTo(x + 4 * u, gy - h * 0.45, x + 15 * u, gy);
      c.lineTo(x + 8 * u, gy); c.quadraticCurveTo(x, gy - h * 0.2, x - 8 * u, gy); c.fill();
      rect(S, x - 9 * u, gy - h * 0.3, 18 * u, 1.4 * u); rect(S, x - 5 * u, gy - h * 0.58, 10 * u, 1.1 * u); rect(S, x - 0.3 * u, gy - h - 5 * u, 0.6 * u, 5 * u);
      if (!S.rim) { c.save(); c.strokeStyle = rgba(S.P[3], 0.25); c.lineWidth = 0.15 * u; for (var i = 1; i < 14; i++) { c.beginPath(); c.moveTo(x - 12 * u + i * 0.4 * u, gy - i * 3 * u); c.lineTo(x + 12 * u - i * 0.4 * u, gy - i * 3.6 * u); c.stroke(); } c.restore(); }
      for (var k = 0; k < 7; k++) { c.beginPath(); c.arc(S.x(0.08 + k * 0.04), gy - 3 * u, 3.5 * u, 0, 7); c.fill(); c.beginPath(); c.arc(S.x(0.66 + k * 0.045), gy - 3 * u, 3.5 * u, 0, 7); c.fill(); }
      towers(S, S.x(0.0), S.x(0.06), 6, 10);
    },
    colosseum: function (S) {
      var u = S.u, gy = S.gy, c = S.c, x = S.x(0.48), w = 50 * u, h = 26 * u;
      c.beginPath(); c.moveTo(x - w / 2, gy); c.lineTo(x - w / 2, gy - h * 0.8); c.lineTo(x - w * 0.1, gy - h); c.lineTo(x + w * 0.3, gy - h); c.lineTo(x + w * 0.38, gy - h * 0.72); c.lineTo(x + w / 2, gy - h * 0.6); c.lineTo(x + w / 2, gy); c.fill();
      if (!S.rim) { var fs = c.fillStyle; c.fillStyle = rgba(S.P[3], 0.4); for (var row = 0; row < 3; row++) for (var i = 0; i < 12; i++) { var ax = x - w / 2 + 2 * u + i * 4 * u, ay = gy - 3 * u - row * 8 * u; if (ay < gy - h * 0.62 && i > 9) continue; c.beginPath(); c.ellipse(ax + 1.2 * u, ay - 2.5 * u, 1.2 * u, 1.4 * u, 0, Math.PI, 0); c.fill(); c.fillRect(ax, ay - 2.5 * u, 2.4 * u, 2.5 * u); } c.fillStyle = fs; }
      [0.1, 0.84].forEach(function (f) { var px = S.x(f); rect(S, px - 0.4 * u, gy - 14 * u, 0.8 * u, 14 * u); c.beginPath(); c.ellipse(px, gy - 15 * u, 7 * u, 3 * u, 0, 0, 7); c.fill(); });
      cypress(S, S.x(0.2), 14); cypress(S, S.x(0.23), 11); cypress(S, S.x(0.95), 13);
    },
    parthenon: function (S) {
      var u = S.u, gy = S.gy, c = S.c, x = S.x(0.5);
      poly(S, [[S.x(0.1), gy], [S.x(0.3), gy - 14 * u], [S.x(0.72), gy - 14 * u], [S.x(0.92), gy]]);
      var b = gy - 14 * u; rect(S, x - 22 * u, b - 2 * u, 44 * u, 2 * u);
      for (var i = 0; i < 10; i++) rect(S, x - 21 * u + i * 4.6 * u, b - 15 * u, 2 * u, 13 * u);
      rect(S, x - 22 * u, b - 18 * u, 44 * u, 3 * u); poly(S, [[x - 22 * u, b - 18 * u], [x, b - 24 * u], [x + 22 * u, b - 18 * u]]);
      cypress(S, S.x(0.2), 10);
    },
    canals: function (S) {
      var u = S.u, gy = S.gy, c = S.c, x = S.x(0.2);
      for (var i = 0; i < 9; i++) {
        var w = (6 + (i % 3)) * u, h = (18 + (i * 7 % 9)) * u, hx = x + i * 7.5 * u;
        rect(S, hx, gy - h, w, h);
        if (i % 2) { poly(S, [[hx, gy - h], [hx + w / 2, gy - h - 5 * u], [hx + w, gy - h]]); }
        else { rect(S, hx + w * 0.2, gy - h - 2 * u, w * 0.6, 2 * u); rect(S, hx + w * 0.35, gy - h - 4 * u, w * 0.3, 2 * u); }
        lit(S, hx + u, gy - h + 2 * u, w - 2 * u, h - 4 * u, 6);
      }
      // windmill
      var mx = S.x(0.86); poly(S, [[mx - 4 * u, gy], [mx - 2.4 * u, gy - 18 * u], [mx + 2.4 * u, gy - 18 * u], [mx + 4 * u, gy]]); dome(S, mx, gy - 18 * u, 2.6 * u, 0.6);
      c.save(); c.translate(mx, gy - 19 * u); c.rotate(0.4); for (var k = 0; k < 4; k++) { c.rotate(Math.PI / 2); c.fillRect(-0.3 * u, 0, 0.6 * u, 13 * u); c.fillRect(0.3 * u, 3 * u, 2.2 * u, 9 * u); } c.restore();
    },
    alps: function (S) {
      var u = S.u, gy = S.gy, c = S.c;
      if (S.rim) {
        poly(S, [[S.x(0.0), gy - 20 * u], [S.x(0.18), gy - 46 * u], [S.x(0.3), gy - 30 * u], [S.x(0.48), gy - 56 * u], [S.x(0.66), gy - 28 * u], [S.x(0.82), gy - 44 * u], [S.x(1), gy - 22 * u], [S.x(1), gy], [0, gy]]);
        return;
      }
      var fs = c.fillStyle; c.fillStyle = mix(S.P[4], S.P[7], 0.4);
      poly(S, [[S.x(0.0), gy - 20 * u], [S.x(0.18), gy - 46 * u], [S.x(0.3), gy - 30 * u], [S.x(0.48), gy - 56 * u], [S.x(0.66), gy - 28 * u], [S.x(0.82), gy - 44 * u], [S.x(1), gy - 22 * u], [S.x(1), gy], [0, gy]]);
      c.fillStyle = "#f3efe6";
      [[0.18, 46], [0.48, 56], [0.82, 44]].forEach(function (p) { poly(S, [[S.x(p[0]) - 6 * u, gy - (p[1] - 9) * u], [S.x(p[0]), gy - p[1] * u], [S.x(p[0]) + 6 * u, gy - (p[1] - 9) * u], [S.x(p[0]) + 2 * u, gy - (p[1] - 6) * u], [S.x(p[0]) - 2 * u, gy - (p[1] - 7) * u]]); });
      c.fillStyle = fs;
      // castle on a hill
      var x = S.x(0.32); poly(S, [[x - 22 * u, gy], [x - 6 * u, gy - 12 * u], [x + 8 * u, gy - 12 * u], [x + 24 * u, gy]]);
      rect(S, x - 6 * u, gy - 26 * u, 14 * u, 14 * u); [-6, 1, 8].forEach(function (d, i) { var tx = x + d * u; rect(S, tx - 1.8 * u, gy - (32 + i * 3) * u, 3.6 * u, (20 + i * 3) * u); poly(S, [[tx - 2.4 * u, gy - (32 + i * 3) * u], [tx, gy - (40 + i * 3) * u], [tx + 2.4 * u, gy - (32 + i * 3) * u]]); });
      lit(S, x - 5 * u, gy - 24 * u, 12 * u, 10 * u, 5);
      for (var i = 0; i < 12; i++) pine(S, S.x(0.55 + i * 0.04), 8 + (i % 3) * 3);
    },
    sagrada: function (S) {
      var u = S.u, gy = S.gy, x = S.x(0.5);
      towers(S, S.x(0.02), S.x(0.3), 6, 14); towers(S, S.x(0.72), S.x(0.98), 6, 14);
      rect(S, x - 16 * u, gy - 20 * u, 32 * u, 20 * u);
      [-12, -7, 7, 12, -2.5, 2.5].forEach(function (d, i) { var h = (i > 3 ? 62 : 44 + (i % 2) * 6) * u, tx = x + d * u; poly(S, [[tx - 2.2 * u, gy - 18 * u], [tx - 1.4 * u, gy - h], [tx, gy - h - 4 * u], [tx + 1.4 * u, gy - h], [tx + 2.2 * u, gy - 18 * u]]); S.c.beginPath(); S.c.arc(tx, gy - h - 4.5 * u, 1.2 * u, 0, 7); S.c.fill(); });
      poly(S, [[x - 2 * u, gy - 64 * u], [x, gy - 74 * u], [x + 2 * u, gy - 64 * u]]);
    },
    pyramids: function (S) {
      var u = S.u, gy = S.gy, c = S.c;
      [[0.55, 46], [0.78, 34], [0.3, 24]].forEach(function (p) {
        var x = S.x(p[0]), w = p[1] * u;
        poly(S, [[x - w, gy], [x, gy - w * 0.66], [x + w, gy]]);
        if (!S.rim) { var fs = c.fillStyle; c.fillStyle = rgba(S.P[8], 0.25); poly(S, [[x, gy - w * 0.66], [x + w, gy], [x + w * 0.2, gy]]); c.fillStyle = fs; }
      });
      palm(S, S.x(0.1), 20, 5); palm(S, S.x(0.15), 16, -4); palm(S, S.x(0.95), 18, -6);
    },
    kasbah: function (S) {
      var u = S.u, gy = S.gy, c = S.c, x = S.x(0.42);
      rect(S, x - 4 * u, gy - 44 * u, 8 * u, 44 * u); rect(S, x - 2.5 * u, gy - 50 * u, 5 * u, 6 * u); dome(S, x, gy - 50 * u, 1.8 * u); rect(S, x - 0.2 * u, gy - 56 * u, 0.4 * u, 3 * u);
      rect(S, S.x(0.05), gy - 12 * u, S.W * 0.9, 12 * u);
      if (!S.rim) { var fs = c.fillStyle; c.fillStyle = rgba(S.P[3], 0.45); for (var i = 0; i < 16; i++) { var ax = S.x(0.07) + i * 5.5 * u; c.beginPath(); c.arc(ax + 1.6 * u, gy - 6 * u, 1.8 * u, Math.PI, 0); c.fill(); c.fillRect(ax - 0.2 * u, gy - 6 * u, 3.6 * u, 4 * u); } c.fillRect(x - 1 * u, gy - 40 * u, 2 * u, 3 * u); c.fillStyle = fs; }
      palm(S, S.x(0.7), 24, 5); palm(S, S.x(0.76), 19, -3); palm(S, S.x(0.2), 21, -4);
    },
    kilimanjaro: function (S) {
      var u = S.u, gy = S.gy, c = S.c;
      if (S.rim) return;
      var fs = c.fillStyle; c.fillStyle = mix(S.P[4], S.P[7], 0.3);
      poly(S, [[S.x(0.15), gy], [S.x(0.42), gy - 34 * u], [S.x(0.58), gy - 36 * u], [S.x(0.9), gy]]);
      c.fillStyle = "#f4efe4"; poly(S, [[S.x(0.4), gy - 31 * u], [S.x(0.42), gy - 34 * u], [S.x(0.58), gy - 36 * u], [S.x(0.61), gy - 32 * u], [S.x(0.55), gy - 30 * u], [S.x(0.48), gy - 32 * u]]);
      c.fillStyle = fs;
      [[0.18, 16], [0.7, 20], [0.9, 12]].forEach(function (a) { var x = S.x(a[0]), h = a[1] * u; c.fillRect(x - 0.5 * u, gy - h, u, h); c.beginPath(); c.ellipse(x, gy - h, 10 * u, 2.2 * u, 0, 0, 7); c.fill(); c.beginPath(); c.ellipse(x + 3 * u, gy - h - 1.5 * u, 6 * u, 1.6 * u, 0, 0, 7); c.fill(); });
      // giraffes
      [[0.36, 1], [0.44, 0.8]].forEach(function (g) { var x = S.x(g[0]), s = g[1] * u; c.beginPath(); c.ellipse(x, gy - 9 * s, 4 * s, 2 * s, -0.15, 0, 7); c.fill(); c.lineWidth = 0.8 * s; c.strokeStyle = c.fillStyle; [-3, -1.5, 2, 3.4].forEach(function (d) { c.beginPath(); c.moveTo(x + d * s, gy - 8 * s); c.lineTo(x + d * s, gy); c.stroke(); }); c.lineWidth = 1.1 * s; c.beginPath(); c.moveTo(x + 3 * s, gy - 10 * s); c.lineTo(x + 6 * s, gy - 19 * s); c.stroke(); c.beginPath(); c.ellipse(x + 6.8 * s, gy - 19 * s, 1.5 * s, 0.7 * s, 0.3, 0, 7); c.fill(); });
    },
    table: function (S) {
      var u = S.u, gy = S.gy, c = S.c;
      poly(S, [[S.x(0.05), gy], [S.x(0.18), gy - 30 * u], [S.x(0.62), gy - 31 * u], [S.x(0.7), gy - 22 * u], [S.x(0.78), gy - 34 * u], [S.x(0.86), gy - 16 * u], [S.x(0.98), gy]]);
      if (!S.rim) { var fs = c.fillStyle; c.fillStyle = rgba("#ffffff", 0.18); cloud(S, S.x(0.4), gy - 31 * u, 24 * u, rgba("#ffffff", 0.28)); c.fillStyle = fs; }
      towers(S, S.x(0.2), S.x(0.6), 3, 9);
    },
    liberty: function (S) {
      var u = S.u, gy = S.gy, c = S.c, x = S.x(0.32);
      towers(S, S.x(0.52), S.x(0.98), 10, 46);
      rect(S, x - 7 * u, gy - 6 * u, 14 * u, 6 * u); poly(S, [[x - 5 * u, gy - 6 * u], [x - 4 * u, gy - 20 * u], [x + 4 * u, gy - 20 * u], [x + 5 * u, gy - 6 * u]]);
      poly(S, [[x - 3 * u, gy - 20 * u], [x - 2 * u, gy - 38 * u], [x + 2.2 * u, gy - 38 * u], [x + 3 * u, gy - 20 * u]]);
      c.beginPath(); c.arc(x, gy - 40 * u, 1.6 * u, 0, 7); c.fill();
      for (var i = -3; i <= 3; i++) poly(S, [[x - 0.4 * u + i * 0.5 * u, gy - 41 * u], [x + i * 1.2 * u, gy - 44 * u], [x + 0.4 * u + i * 0.5 * u, gy - 41 * u]]);
      c.save(); c.lineWidth = 1.1 * u; c.lineCap = "round"; c.beginPath(); c.moveTo(x + 1.6 * u, gy - 36 * u); c.lineTo(x + 4 * u, gy - 50 * u); c.stroke(); c.restore();
      rect(S, x + 3.2 * u, gy - 52 * u, 1.8 * u, 2 * u);
      if (!S.rim) { var fs = c.fillStyle; c.fillStyle = "#ffcf6a"; c.beginPath(); c.ellipse(x + 4.1 * u, gy - 54 * u, 1.2 * u, 2.2 * u, 0, 0, 7); c.fill(); c.fillStyle = fs; }
    },
    bridge: function (S) {
      var u = S.u, gy = S.gy, c = S.c;
      poly(S, [[0, gy], [0, gy - 14 * u], [S.x(0.12), gy - 8 * u], [S.x(0.18), gy]]); poly(S, [[S.x(0.85), gy], [S.x(0.92), gy - 16 * u], [S.W, gy - 12 * u], [S.W, gy]]);
      var col = S.rim ? S.P[8] : "#b8452f";
      c.save(); c.fillStyle = c.strokeStyle = col;
      [0.3, 0.7].forEach(function (f) { var x = S.x(f); rect(S, x - 1.4 * u, gy - 44 * u, 1 * u, 44 * u); rect(S, x + 0.4 * u, gy - 44 * u, 1 * u, 44 * u); [12, 24, 36, 43].forEach(function (y) { rect(S, x - 1.4 * u, gy - y * u, 2.8 * u, 0.8 * u); }); });
      rect(S, 0, gy - 9 * u, S.W, 1.2 * u);
      c.lineWidth = 0.45 * u; c.beginPath(); c.moveTo(S.x(0.05), gy - 10 * u); c.quadraticCurveTo(S.x(0.18), gy - 20 * u, S.x(0.3), gy - 43 * u); c.quadraticCurveTo(S.x(0.5), gy - 4 * u, S.x(0.7), gy - 43 * u); c.quadraticCurveTo(S.x(0.82), gy - 20 * u, S.x(0.95), gy - 10 * u); c.stroke();
      c.lineWidth = 0.12 * u; for (var i = 1; i < 30; i++) { var t = i / 30, xx = S.x(0.3) + (S.x(0.7) - S.x(0.3)) * t, yy = gy - 43 * u + (39 * u) * (1 - Math.pow(2 * t - 1, 2)); c.beginPath(); c.moveTo(xx, yy); c.lineTo(xx, gy - 9 * u); c.stroke(); }
      c.restore();
      if (!S.rim) cloud(S, S.x(0.6), gy - 6 * u, 30 * u, rgba("#ffffff", 0.2));
    },
    skyline: function (S) {
      var u = S.u, gy = S.gy, c = S.c;
      towers(S, S.x(0.02), S.x(0.98), 10, 36);
      [0.35, 0.6].forEach(function (f, i) { var x = S.x(f), h = (52 + i * 8) * u; rect(S, x - 3 * u, gy - h, 6 * u, h); rect(S, x - 0.2 * u, gy - h - 7 * u, 0.4 * u, 7 * u); lit(S, x - 3 * u, gy - h, 6 * u, h, 20); });
    },
    mayan: function (S) {
      var u = S.u, gy = S.gy, c = S.c, x = S.x(0.48);
      for (var i = 0; i < 7; i++) { var w = (32 - i * 4) * u; rect(S, x - w / 2, gy - (i + 1) * 4 * u, w, 4 * u); }
      rect(S, x - 5 * u, gy - 34 * u, 10 * u, 6 * u); rect(S, x - 6 * u, gy - 35 * u, 12 * u, 1.4 * u);
      if (!S.rim) { var fs = c.fillStyle; c.fillStyle = rgba(S.P[3], 0.35); for (var k = 0; k < 7; k++) c.fillRect(x - 2.5 * u, gy - (k + 1) * 4 * u, 5 * u, 1 * u); c.fillStyle = S.P[6]; c.fillRect(x - 1.4 * u, gy - 33 * u, 2.8 * u, 4 * u); c.fillStyle = fs; }
      for (var j = 0; j < 9; j++) { c.beginPath(); c.arc(S.x(j < 4 ? 0.04 + j * 0.06 : 0.66 + (j - 4) * 0.07), gy - (4 + (j % 3) * 2) * u, (5 + (j % 2) * 2) * u, 0, 7); c.fill(); }
      palm(S, S.x(0.9), 22, -5);
    },
    redeemer: function (S) {
      var u = S.u, gy = S.gy, c = S.c, x = S.x(0.36);
      poly(S, [[S.x(0.05), gy], [x - 6 * u, gy - 26 * u], [x + 6 * u, gy - 27 * u], [S.x(0.6), gy]]);
      rect(S, x - 1.4 * u, gy - 44 * u, 2.8 * u, 17 * u); rect(S, x - 11 * u, gy - 41 * u, 22 * u, 1.8 * u); c.beginPath(); c.arc(x, gy - 45.5 * u, 1.4 * u, 0, 7); c.fill();
      poly(S, [[x - 2.4 * u, gy - 27 * u], [x - 1.4 * u, gy - 39 * u], [x + 1.4 * u, gy - 39 * u], [x + 2.4 * u, gy - 27 * u]]);
      c.beginPath(); c.moveTo(S.x(0.68), gy); c.bezierCurveTo(S.x(0.68), gy - 30 * u, S.x(0.8), gy - 30 * u, S.x(0.82), gy); c.fill();
      c.beginPath(); c.moveTo(S.x(0.6), gy); c.bezierCurveTo(S.x(0.62), gy - 14 * u, S.x(0.68), gy - 14 * u, S.x(0.7), gy); c.fill();
    },
    machu: function (S) {
      var u = S.u, gy = S.gy, c = S.c;
      if (S.rim) return;
      var fs = c.fillStyle; c.fillStyle = mix(S.P[4], S.P[7], 0.3);
      poly(S, [[S.x(0.0), gy - 14 * u], [S.x(0.25), gy - 30 * u], [S.x(0.6), gy - 20 * u], [S.x(0.7), gy - 30 * u], [S.x(1), gy - 16 * u], [S.x(1), gy], [0, gy]]);
      c.fillStyle = fs;
      c.beginPath(); c.moveTo(S.x(0.58), gy); c.bezierCurveTo(S.x(0.6), gy - 44 * u, S.x(0.66), gy - 58 * u, S.x(0.7), gy - 58 * u); c.bezierCurveTo(S.x(0.74), gy - 56 * u, S.x(0.78), gy - 30 * u, S.x(0.86), gy); c.fill();
      poly(S, [[S.x(0.1), gy], [S.x(0.2), gy - 14 * u], [S.x(0.55), gy - 14 * u], [S.x(0.6), gy]]);
      c.fillStyle = rgba(S.P[3], 0.35);
      for (var t = 0; t < 4; t++) c.fillRect(S.x(0.16 + t * 0.01), gy - (11 - t * 3) * u, S.x(0.38 - t * 0.02), 0.5 * u);
      for (var i = 0; i < 12; i++) { var hx = S.x(0.24 + i * 0.024); c.fillStyle = S.P[7]; c.fillRect(hx, gy - 18 * u, 1.8 * u, 4 * u); poly(S, [[hx - 0.3 * u, gy - 18 * u], [hx + 0.9 * u, gy - 20.5 * u], [hx + 2.1 * u, gy - 18 * u]]); }
      c.fillStyle = fs;
    },
    marina: function (S) {
      var u = S.u, gy = S.gy, c = S.c, x = S.x(0.5);
      towers(S, S.x(0.02), S.x(0.3), 12, 36);
      [-10, 0, 10].forEach(function (d) { poly(S, [[x + d * u - 3 * u, gy], [x + d * u - 2 * u, gy - 36 * u], [x + d * u + 2.5 * u, gy - 36 * u], [x + d * u + 3 * u, gy]]); lit(S, x + d * u - 2 * u, gy - 34 * u, 4 * u, 30 * u, 14); });
      c.beginPath(); c.moveTo(x - 16 * u, gy - 37 * u); c.lineTo(x + 18 * u, gy - 38 * u); c.quadraticCurveTo(x + 20 * u, gy - 37 * u, x + 17 * u, gy - 35.5 * u); c.lineTo(x - 15 * u, gy - 35.5 * u); c.fill();
      [0.74, 0.8, 0.86, 0.92].forEach(function (f, i) { var tx = S.x(f), h = (14 + (i % 2) * 6) * u; c.fillRect(tx - 0.6 * u, gy - h, 1.2 * u, h); c.beginPath(); c.moveTo(tx - 4 * u, gy - h); c.quadraticCurveTo(tx, gy - h - 3 * u, tx + 4 * u, gy - h); c.lineTo(tx + 1 * u, gy - h + 3 * u); c.lineTo(tx - 1 * u, gy - h + 3 * u); c.fill(); });
    },
    petronas: function (S) {
      var u = S.u, gy = S.gy, c = S.c, x = S.x(0.5);
      towers(S, S.x(0.02), S.x(0.36), 8, 26); towers(S, S.x(0.66), S.x(0.98), 8, 24);
      [-7, 7].forEach(function (d) { var tx = x + d * u; for (var i = 0; i < 6; i++) { var w = (7 - i) * u; rect(S, tx - w / 2, gy - (14 + i * 9) * u, w, (14 + i * 9) * u); } poly(S, [[tx - 0.8 * u, gy - 64 * u], [tx, gy - 76 * u], [tx + 0.8 * u, gy - 64 * u]]); lit(S, tx - 3 * u, gy - 60 * u, 6 * u, 55 * u, 18); });
      rect(S, x - 7 * u, gy - 34 * u, 14 * u, 1.4 * u); poly(S, [[x - 3 * u, gy - 33 * u], [x, gy - 30 * u], [x + 3 * u, gy - 33 * u]]);
    },
    thai: function (S) {
      var u = S.u, gy = S.gy, c = S.c;
      function prang(x, h, w) { for (var i = 0; i < 7; i++) { var f = i / 7; c.beginPath(); c.ellipse(x, gy - h * u * f - 2 * u, w * u * (1 - f * 0.85), 3 * u, 0, Math.PI, 0); c.fill(); rect(S, x - w * u * (1 - f * 0.85), gy - h * u * f - 2 * u, 2 * w * u * (1 - f * 0.85), h * u / 7 + 0.5); } poly(S, [[x - 0.6 * u, gy - h * u], [x, gy - h * u - 8 * u], [x + 0.6 * u, gy - h * u]]); }
      prang(S.x(0.48), 46, 8); prang(S.x(0.3), 26, 5); prang(S.x(0.66), 26, 5); prang(S.x(0.16), 16, 3.5); prang(S.x(0.8), 16, 3.5);
    },
    halong: function (S) {
      var u = S.u, gy = S.gy, c = S.c;
      [[0.14, 30, 7], [0.3, 42, 9], [0.48, 24, 6], [0.7, 38, 8], [0.88, 26, 7]].forEach(function (k) { var x = S.x(k[0]), h = k[1] * u, w = k[2] * u; c.beginPath(); c.moveTo(x - w, gy); c.bezierCurveTo(x - w * 1.1, gy - h * 0.7, x - w * 0.6, gy - h, x, gy - h); c.bezierCurveTo(x + w * 0.7, gy - h, x + w * 0.9, gy - h * 0.6, x + w * 0.8, gy); c.fill(); });
    },
    overwater: function (S) {
      var u = S.u, gy = S.gy, c = S.c;
      palm(S, S.x(0.08), 26, 7); palm(S, S.x(0.14), 20, -3); palm(S, S.x(0.93), 24, -7);
      c.beginPath(); c.ellipse(S.x(0.1), gy, 12 * u, 2.5 * u, 0, Math.PI, 0); c.fill();
    },
    bali: function (S) {
      var u = S.u, gy = S.gy, x = S.x(0.5);
      rect(S, x - 20 * u, gy - 3 * u, 40 * u, 3 * u);
      [-1, 1].forEach(function (s) { for (var i = 0; i < 9; i++) { var w = (10 - i) * u, y = gy - 3 * u - (i + 1) * 4 * u; var xx = s < 0 ? x - 3 * u - w : x + 3 * u; rect(S, xx, y, w, 4 * u); } });
      palm(S, S.x(0.15), 26, 6); palm(S, S.x(0.85), 28, -6); palm(S, S.x(0.92), 22, -3);
    },
    fuji: function (S) {
      var u = S.u, gy = S.gy, c = S.c;
      if (S.rim) { var x0 = S.x(0.36); rect(S, x0 - 0.1, gy - 1, 0.1, 0.1); }
      if (!S.rim) {
        var fs = c.fillStyle; c.fillStyle = mix(S.P[4], S.P[7], 0.35);
        poly(S, [[S.x(0.08), gy], [S.x(0.4), gy - 40 * u], [S.x(0.52), gy - 40 * u], [S.x(0.86), gy]]);
        c.fillStyle = "#f6f1ea"; poly(S, [[S.x(0.34), gy - 33 * u], [S.x(0.4), gy - 40 * u], [S.x(0.52), gy - 40 * u], [S.x(0.58), gy - 33 * u], [S.x(0.54), gy - 34.5 * u], [S.x(0.5), gy - 32 * u], [S.x(0.46), gy - 34.5 * u], [S.x(0.42), gy - 32 * u], [S.x(0.38), gy - 34.5 * u]]);
        c.fillStyle = fs;
      }
      // pagoda
      var px = S.x(0.78);
      for (var i = 0; i < 5; i++) { var w = (9 - i * 1.3) * u, y = gy - i * 6.5 * u; rect(S, px - w * 0.45, y - 5 * u, w * 0.9, 5 * u); c.beginPath(); c.moveTo(px - w, y - 4.5 * u); c.quadraticCurveTo(px, y - 7 * u, px + w, y - 4.5 * u); c.lineTo(px + w * 0.8, y - 6.5 * u); c.lineTo(px - w * 0.8, y - 6.5 * u); c.fill(); }
      rect(S, px - 0.3 * u, gy - 40 * u, 0.6 * u, 8 * u);
      // cherry tree
      var tx = S.x(0.14); c.save(); c.lineWidth = 1 * u; c.beginPath(); c.moveTo(tx, gy); c.quadraticCurveTo(tx + 2 * u, gy - 10 * u, tx + 7 * u, gy - 16 * u); c.stroke(); c.restore();
      if (!S.rim) { var fs2 = c.fillStyle; c.fillStyle = rgba("#ffc4d6", 0.85); for (var b = 0; b < 40; b++) { c.beginPath(); c.arc(tx + (S.r() * 22 - 6) * u, gy - (12 + S.r() * 10) * u, (0.8 + S.r()) * u, 0, 7); c.fill(); } c.fillStyle = fs2; }
    },
    hongkong: function (S) {
      var u = S.u, gy = S.gy;
      poly(S, [[0, gy - 18 * u], [S.x(0.25), gy - 30 * u], [S.x(0.55), gy - 22 * u], [S.x(0.8), gy - 32 * u], [S.W, gy - 20 * u], [S.W, gy], [0, gy]]);
      towers(S, S.x(0.05), S.x(0.95), 12, 40);
      var x = S.x(0.42); poly(S, [[x - 3 * u, gy], [x - 2 * u, gy - 56 * u], [x, gy - 62 * u], [x + 2 * u, gy - 56 * u], [x + 3 * u, gy]]);
    },
    wall: function (S) {
      var u = S.u, gy = S.gy, c = S.c;
      if (S.rim) return;
      var fs = c.fillStyle; c.fillStyle = mix(S.P[4], S.P[7], 0.3);
      hills(S, gy - 14 * u, 16 * u, c.fillStyle, 2);
      c.fillStyle = fs;
      var pts = []; for (var i = 0; i <= 40; i++) { var f = i / 40; pts.push([S.x(f), gy - (10 + Math.sin(f * 7) * 8 + f * 6) * u]); }
      c.save(); c.lineWidth = 1.8 * u; c.lineJoin = "round"; c.beginPath(); pts.forEach(function (p, i) { if (i) c.lineTo(p[0], p[1]); else c.moveTo(p[0], p[1]); }); c.stroke(); c.restore();
      pts.forEach(function (p, i) { if (i % 2) c.fillRect(p[0] - 0.4 * u, p[1] - 1.8 * u, 0.8 * u, 1 * u); if (i % 9 === 4) { rect(S, p[0] - 2.5 * u, p[1] - 6 * u, 5 * u, 6 * u); poly(S, [[p[0] - 3.5 * u, p[1] - 6 * u], [p[0], p[1] - 9 * u], [p[0] + 3.5 * u, p[1] - 6 * u]]); } });
    },
    sydney: function (S) {
      var u = S.u, gy = S.gy, c = S.c;
      c.save(); c.lineWidth = 1.2 * u; c.beginPath(); c.moveTo(S.x(0.52), gy - 6 * u); c.quadraticCurveTo(S.x(0.74), gy - 36 * u, S.x(0.96), gy - 6 * u); c.stroke();
      c.lineWidth = 0.15 * u; for (var i = 1; i < 16; i++) { var t = i / 16, x = S.x(0.52) + (S.x(0.96) - S.x(0.52)) * t, y = gy - 6 * u - 30 * u * (1 - Math.pow(2 * t - 1, 2)) * 0.98; c.beginPath(); c.moveTo(x, y); c.lineTo(x, gy - 10 * u); c.stroke(); } c.restore();
      rect(S, S.x(0.48), gy - 10.5 * u, S.x(0.52), 1.2 * u); rect(S, S.x(0.54), gy - 14 * u, 3 * u, 14 * u); rect(S, S.x(0.93), gy - 14 * u, 3 * u, 14 * u);
      // opera house shells, painted pale
      var col = S.rim ? S.P[8] : "#efe7da"; c.save(); c.fillStyle = col;
      var x = S.x(0.24); rect(S, x - 18 * u, gy - 3 * u, 36 * u, 3 * u);
      [[-12, 13, 7], [-5, 18, 8], [3, 15, 7], [10, 10, 6]].forEach(function (s) { c.beginPath(); c.moveTo(x + s[0] * u - s[2] * u, gy - 3 * u); c.quadraticCurveTo(x + s[0] * u - s[2] * 0.6 * u, gy - s[1] * u, x + s[0] * u + s[2] * 0.8 * u, gy - (s[1] + 2) * u); c.quadraticCurveTo(x + s[0] * u + s[2] * 0.4 * u, gy - 8 * u, x + s[0] * u + s[2] * u, gy - 3 * u); c.fill(); });
      c.restore();
      towers(S, S.x(0.0), S.x(0.08), 6, 16);
    },
    nz: function (S) {
      var u = S.u, gy = S.gy, c = S.c;
      c.beginPath(); c.moveTo(S.x(0.55), gy); c.quadraticCurveTo(S.x(0.7), gy - 22 * u, S.x(0.85), gy); c.fill();
      towers(S, S.x(0.05), S.x(0.42), 6, 20);
      var x = S.x(0.3); rect(S, x - 1 * u, gy - 54 * u, 2 * u, 54 * u); c.beginPath(); c.ellipse(x, gy - 46 * u, 3.6 * u, 2.4 * u, 0, 0, 7); c.fill(); rect(S, x - 0.3 * u, gy - 64 * u, 0.6 * u, 10 * u);
      boat(S, S.x(0.9), 3, true); boat(S, S.x(0.48), 2.5, true);
    }
  };
  COMP.kerala.fore = function (S) { /* canoe */ boat(S, S.x(0.25), 4, false); };
  COMP.overwater.fore = function (S) {
    var c = S.c, u = S.u, gy = S.gy; c.fillStyle = S.P[7];
    rect(S, S.x(0.25), gy + 1 * u, S.x(0.6), 0.7 * u);
    for (var i = 0; i < 6; i++) { var x = S.x(0.3 + i * 0.1); for (var p = -1; p <= 1; p += 2) rect(S, x + p * 3 * u, gy - 1 * u, 0.6 * u, 4 * u); rect(S, x - 4 * u, gy - 4 * u, 8 * u, 3 * u); poly(S, [[x - 5.5 * u, gy - 4 * u], [x, gy - 9 * u], [x + 5.5 * u, gy - 4 * u]]); }
  };
  COMP.halong.fore = function (S) {
    var c = S.c, u = S.u, x = S.x(0.6), y = S.gy + 4 * u; c.fillStyle = S.P[7];
    c.beginPath(); c.moveTo(x - 8 * u, y - 2 * u); c.quadraticCurveTo(x, y + 1 * u, x + 8 * u, y - 3 * u); c.lineTo(x + 6 * u, y); c.lineTo(x - 6 * u, y); c.fill();
    c.fillStyle = "#b8452f"; [-4, 1].forEach(function (d, i) { c.beginPath(); c.moveTo(x + d * u, y - 2 * u); c.lineTo(x + d * u, y - (14 - i * 2) * u); c.quadraticCurveTo(x + (d + 6) * u, y - 9 * u, x + (d + 4) * u, y - 2 * u); c.fill(); });
  };
  COMP.hongkong.fore = COMP.halong.fore;
  COMP.gateway.fore = function (S) { S.c.fillStyle = S.P[7]; boat(S, S.x(0.2), 3, true); boat(S, S.x(0.75), 2.5, false); };
  COMP.liberty.fore = function (S) { S.c.fillStyle = S.P[7]; boat(S, S.x(0.6), 4, false); };
  COMP.mosque.fore = function () {};
  COMP.taj.fore = function () {};

  var thumbCache = {};
  function thumb(code, w, h) {
    var inf = info(code), key = code + "|" + w + "x" + h;
    if (thumbCache[key]) return thumbCache[key];
    var cv = document.createElement("canvas"); cv.width = w; cv.height = h;
    paint(cv, code, { ground: 0.82 });
    return (thumbCache[key] = cv.toDataURL("image/jpeg", 0.85));
  }

  window.Art = { paint: paint, info: info, thumb: thumb };
})();
