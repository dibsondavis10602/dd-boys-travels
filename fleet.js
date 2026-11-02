// Airline details for flight cards: logo, the aircraft each airline usually flies on a route of this length,
// and its usual bag allowance in kg on a standard (non-"light") fare. These come from the airlines' published
// fleets and baggage rules; schedules and fare rules change, so cards say "usually" and link to the airline.
(function () {
  // code: [short-haul types, long-haul types, km where long-haul starts, optional [regional type, max km]]
  var FLEET = {
    EK: ["Boeing 777-300ER", "Airbus A380-800/Boeing 777-300ER", 5000],
    QR: ["Airbus A320/Boeing 737 MAX 8/Boeing 787-8", "Boeing 777-300ER/Airbus A350-900/Airbus A350-1000", 4500],
    EY: ["Airbus A321neo/Boeing 787-9", "Boeing 787-10/Airbus A350-1000/Boeing 777-300ER", 4500],
    FZ: ["Boeing 737 MAX 8/Boeing 737-800", "Boeing 737 MAX 8", 9e9],
    G9: ["Airbus A320/Airbus A321neo", "Airbus A321neo", 9e9],
    WY: ["Boeing 737 MAX 8/Boeing 737-800", "Boeing 787-9/Boeing 787-8", 3500],
    GF: ["Airbus A320neo/Airbus A321neo", "Boeing 787-9", 3500],
    SV: ["Airbus A320neo/Airbus A321neo", "Boeing 787-9/Boeing 777-300ER", 4000],
    KU: ["Airbus A320neo", "Boeing 777-300ER/Airbus A330-800", 4000],
    RJ: ["Airbus A320/Embraer 195", "Boeing 787-8", 3500],
    AI: ["Airbus A320neo/Airbus A321neo", "Boeing 787-8/Airbus A350-900/Boeing 777-300ER", 4000],
    "6E": ["Airbus A320neo/Airbus A321neo", "Airbus A321neo/Airbus A321XLR", 9e9, ["ATR 72-600", 450]],
    IX: ["Boeing 737-8/Boeing 737-800", "Boeing 737-8", 9e9],
    QP: ["Boeing 737 MAX 8", "Boeing 737 MAX 8", 9e9],
    SG: ["Boeing 737-800/Boeing 737 MAX 8", "Boeing 737-800", 9e9, ["De Havilland Dash 8-400", 500]],
    UL: ["Airbus A320neo/Airbus A321neo", "Airbus A330-300", 3500],
    PK: ["Airbus A320", "Boeing 777-200ER", 3500],
    BG: ["Boeing 737-800", "Boeing 787-8/Boeing 787-9", 3500],
    BA: ["Airbus A320neo/Airbus A320/Airbus A321neo", "Boeing 777-300ER/Boeing 787-9/Airbus A350-1000/Airbus A380-800", 4000],
    LH: ["Airbus A320neo/Airbus A321", "Airbus A350-900/Boeing 747-8/Boeing 787-9", 4000],
    AF: ["Airbus A220-300/Airbus A320", "Airbus A350-900/Boeing 777-300ER", 4000],
    KL: ["Boeing 737-800/Embraer 195-E2", "Boeing 787-10/Boeing 777-300ER/Airbus A330-300", 4000],
    TK: ["Airbus A321neo/Boeing 737 MAX 8", "Boeing 777-300ER/Airbus A350-900/Boeing 787-9", 4500],
    IB: ["Airbus A320neo/Airbus A321neo", "Airbus A350-900/Airbus A330-200", 4000],
    LX: ["Airbus A220-300/Airbus A320neo", "Boeing 777-300ER/Airbus A330-300", 4000],
    OS: ["Airbus A320/Embraer 195", "Boeing 787-9/Boeing 777-200ER", 4000],
    AZ: ["Airbus A320neo/Airbus A220-100", "Airbus A330-900/Airbus A350-900", 4000],
    SK: ["Airbus A320neo", "Airbus A350-900/Airbus A330-300", 4000],
    AY: ["Airbus A321/Airbus A320", "Airbus A350-900/Airbus A330-300", 4000],
    VS: ["Airbus A330-900", "Airbus A350-1000/Boeing 787-9/Airbus A330-900", 4000],
    EI: ["Airbus A320neo", "Airbus A321XLR/Airbus A330-300", 4000],
    TP: ["Airbus A320neo/Airbus A321neo", "Airbus A330-900/Airbus A321LR", 4000],
    FR: ["Boeing 737-8200/Boeing 737-800", "Boeing 737-800", 9e9],
    U2: ["Airbus A320neo/Airbus A319", "Airbus A321neo", 9e9],
    W6: ["Airbus A321neo", "Airbus A321neo", 9e9],
    AA: ["Boeing 737-800/Airbus A321", "Boeing 777-300ER/Boeing 787-9", 4500],
    DL: ["Airbus A321neo/Boeing 737-900ER/Airbus A220-300", "Airbus A350-900/Airbus A330-900", 4500],
    UA: ["Boeing 737 MAX 9/Airbus A320", "Boeing 787-9/Boeing 777-300ER/Boeing 787-10", 4500],
    AC: ["Airbus A220-300/Boeing 737 MAX 8", "Boeing 787-9/Boeing 777-300ER", 4500],
    B6: ["Airbus A321neo/Airbus A220-300", "Airbus A321LR", 9e9],
    WN: ["Boeing 737-800/Boeing 737 MAX 8", "Boeing 737 MAX 8", 9e9],
    AS: ["Boeing 737-900ER/Boeing 737 MAX 9", "Boeing 737 MAX 9", 9e9],
    AM: ["Boeing 737 MAX 8/Boeing 737-800", "Boeing 787-9/Boeing 787-8", 4000],
    LA: ["Airbus A320neo/Airbus A321", "Boeing 787-9/Boeing 777-300ER", 4000],
    AV: ["Airbus A320neo", "Boeing 787-8", 4000],
    CM: ["Boeing 737 MAX 9/Boeing 737-800", "Boeing 737 MAX 9", 9e9],
    AR: ["Boeing 737 MAX 8/Boeing 737-800", "Airbus A330-200", 4000],
    G3: ["Boeing 737 MAX 8/Boeing 737-800", "Boeing 737 MAX 8", 9e9],
    ET: ["Boeing 737 MAX 8/Boeing 737-800", "Airbus A350-900/Boeing 787-8/Boeing 777-300ER", 4000, ["De Havilland Dash 8-400", 700]],
    KQ: ["Embraer 190/Boeing 737-800", "Boeing 787-8", 4000],
    SA: ["Airbus A320", "Airbus A330-300", 4000],
    MS: ["Airbus A320neo/Boeing 737-800", "Boeing 787-9/Airbus A350-900", 4000],
    AT: ["Boeing 737-800/Boeing 737 MAX 8", "Boeing 787-9/Boeing 787-8", 4000],
    WB: ["Boeing 737-800", "Airbus A330-200", 4000],
    CX: ["Airbus A321neo/Airbus A330-300", "Airbus A350-900/Boeing 777-300ER/Airbus A350-1000", 4000],
    NH: ["Boeing 737-800/Boeing 787-8", "Boeing 787-9/Boeing 777-300ER", 4000],
    JL: ["Boeing 737-800/Boeing 787-8", "Airbus A350-1000/Boeing 787-9/Boeing 777-300ER", 4000],
    KE: ["Boeing 737-8/Airbus A321neo", "Boeing 777-300ER/Boeing 787-9/Airbus A380-800", 4000],
    CA: ["Airbus A320neo/Boeing 737-800", "Boeing 777-300ER/Airbus A350-900/Boeing 787-9", 4000],
    MU: ["Airbus A320neo/Boeing 737-800", "Airbus A350-900/Boeing 777-300ER", 4000],
    CZ: ["Airbus A321neo/Boeing 737 MAX 8", "Boeing 787-9/Boeing 777-300ER/Airbus A350-900", 4000],
    BR: ["Airbus A321/Boeing 787-10", "Boeing 777-300ER/Boeing 787-9", 4000],
    SQ: ["Boeing 737 MAX 8/Airbus A350-900", "Airbus A350-900/Boeing 777-300ER/Airbus A380-800", 4000],
    TG: ["Airbus A320neo/Airbus A330-300", "Boeing 787-9/Airbus A350-900/Boeing 777-300ER", 4000],
    MH: ["Boeing 737-800/Boeing 737 MAX 8", "Airbus A330-300/Airbus A350-900", 4000],
    AK: ["Airbus A320neo/Airbus A321neo", "Airbus A330-300", 4500],
    GA: ["Boeing 737-800", "Airbus A330-300/Boeing 777-300ER", 4000],
    PR: ["Airbus A321neo/Airbus A320", "Airbus A350-900/Boeing 777-300ER", 4000],
    VN: ["Airbus A321neo/Airbus A321", "Boeing 787-10/Airbus A350-900", 4000],
    VJ: ["Airbus A321neo/Airbus A320", "Airbus A330-300", 4500],
    TR: ["Airbus A320neo/Airbus A321neo", "Boeing 787-9", 4000],
    QF: ["Boeing 737-800/Airbus A220-300", "Boeing 787-9/Airbus A380-800/Airbus A330-300", 4500],
    VA: ["Boeing 737-800/Boeing 737 MAX 8", "Boeing 737 MAX 8", 9e9],
    NZ: ["Airbus A320neo/Airbus A321neo", "Boeing 787-9/Boeing 777-300ER", 4000],
    JQ: ["Airbus A320/Airbus A321neo", "Boeing 787-8", 4500],
    FJ: ["Boeing 737 MAX 8", "Airbus A350-900/Airbus A330-200", 3500]
  };

  // code: [cabin kg, checked on short routes, checked on long routes, checked on domestic routes (if different)]
  // "25 kg" = weight allowance, "1 × 23 kg" = one bag up to 23 kg, 0 = checked bag costs extra on the standard fare.
  var BAG = {
    EK: [7, "25 kg", "25 kg"], QR: [7, "25 kg", "25 kg"], EY: [7, "23 kg", "23 kg"], FZ: [7, "20 kg", "20 kg"],
    G9: [10, 0, 0], WY: [7, "25 kg", "30 kg"], GF: [6, "25 kg", "25 kg"], SV: [7, "1 × 23 kg", "1 × 23 kg"],
    KU: [7, "30 kg", "30 kg"], RJ: [7, "1 × 23 kg", "1 × 23 kg"],
    AI: [7, "25 kg", "25 kg", "15 kg"], "6E": [7, "20 kg", "30 kg", "15 kg"], IX: [7, "20 kg", "30 kg", "15 kg"],
    QP: [7, "20 kg", "20 kg", "15 kg"], SG: [7, "20 kg", "20 kg", "15 kg"], UL: [7, "30 kg", "30 kg"],
    PK: [7, "30 kg", "30 kg", "20 kg"], BG: [7, "30 kg", "30 kg", "20 kg"],
    BA: [23, 0, "1 × 23 kg"], LH: [8, 0, "1 × 23 kg"], AF: [12, 0, "1 × 23 kg"], KL: [12, 0, "1 × 23 kg"],
    TK: [8, "20 kg", "30 kg"], IB: [10, 0, "1 × 23 kg"], LX: [8, 0, "1 × 23 kg"], OS: [8, 0, "1 × 23 kg"],
    AZ: [8, 0, "1 × 23 kg"], SK: [8, 0, "1 × 23 kg"], AY: [8, 0, "1 × 23 kg"], VS: [10, "1 × 23 kg", "1 × 23 kg"],
    EI: [10, 0, "1 × 23 kg"], TP: [8, 0, "1 × 23 kg"],
    FR: [10, 0, 0], U2: [15, 0, 0], W6: [10, 0, 0],
    AA: [10, 0, "1 × 23 kg"], DL: [10, 0, "1 × 23 kg"], UA: [10, 0, "1 × 23 kg"], AC: [10, 0, "1 × 23 kg"],
    B6: [10, 0, 0], WN: [10, 0, 0], AS: [10, 0, 0],
    AM: [10, "1 × 23 kg", "1 × 23 kg", 0], LA: [12, 0, "1 × 23 kg"], AV: [10, 0, "1 × 23 kg"], CM: [10, "1 × 23 kg", "1 × 23 kg"],
    AR: [8, "1 × 23 kg", "1 × 23 kg", 0], G3: [10, 0, 0],
    ET: [7, "2 × 23 kg", "2 × 23 kg"], KQ: [12, "1 × 23 kg", "1 × 23 kg"], SA: [8, "1 × 23 kg", "1 × 23 kg"],
    MS: [8, "1 × 23 kg", "2 × 23 kg"], AT: [10, "1 × 23 kg", "1 × 23 kg"], WB: [7, "1 × 23 kg", "1 × 23 kg"],
    CX: [7, "23 kg", "1 × 23 kg"], NH: [10, "2 × 23 kg", "2 × 23 kg", "20 kg"], JL: [10, "2 × 23 kg", "2 × 23 kg", "20 kg"],
    KE: [10, "1 × 23 kg", "1 × 23 kg", "20 kg"], CA: [8, "1 × 23 kg", "2 × 23 kg", "20 kg"],
    MU: [8, "1 × 23 kg", "2 × 23 kg", "20 kg"], CZ: [8, "1 × 23 kg", "2 × 23 kg", "20 kg"], BR: [7, "23 kg", "1 × 23 kg"],
    SQ: [7, "30 kg", "30 kg"], TG: [7, "30 kg", "30 kg", "20 kg"], MH: [7, "30 kg", "30 kg", "20 kg"],
    AK: [7, 0, 0], GA: [7, "20 kg", "30 kg", "20 kg"], PR: [7, "1 × 23 kg", "1 × 23 kg", "10 kg"],
    VN: [10, "23 kg", "23 kg"], VJ: [7, 0, 0], TR: [10, 0, 0],
    QF: [7, "30 kg", "30 kg", "23 kg"], VA: [7, "23 kg", "23 kg"], NZ: [7, "1 × 23 kg", "1 × 23 kg", 0],
    JQ: [7, 0, 0], FJ: [7, "23 kg", "23 kg"]
  };

  function hash(s) { var h = 7; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
  function aircraft(code, km, seed) {
    var f = FLEET[code]; if (!f) return null;
    if (f[3] && km <= f[3][1]) return f[3][0];
    var list = (km >= f[2] ? f[1] : f[0]).split("/");
    return list[hash(code + (seed || "")) % list.length];
  }
  // checked allowance grows with the cabin you book
  function upCabin(s, cabin) {
    if (cabin === "economy") return s;
    var piece = s && /×/.test(s), kg = s ? parseInt(s.replace(/^.*?(\d+)\s*kg.*$/, "$1"), 10) : 20;
    if (cabin === "premium_economy") return piece ? "2 × 23 kg" : (kg + 10) + " kg";
    if (cabin === "business") return piece ? "2 × 32 kg" : Math.max(40, kg + 15) + " kg";
    return piece ? "3 × 32 kg" : "50 kg";
  }
  function bags(code, km, domestic, cabin) {
    var b = BAG[code]; if (!b) return null;
    var chk = domestic && b.length > 3 ? b[3] : (km >= 3000 ? b[2] : b[1]);
    cabin = cabin || "economy";
    if (!chk && cabin !== "economy") chk = upCabin("1 × 23 kg", cabin);
    else if (chk) chk = upCabin(chk, cabin);
    var cab = cabin === "business" || cabin === "first" ? (b[0] >= 12 ? b[0] + " kg" : "2 × " + b[0] + " kg") : b[0] + " kg";
    return { cabin: cab, checked: chk || null };
  }
  var LOGO = ["https://pics.avs.io/120/120/", "https://images.kiwi.com/airlines/64/"];
  function logo(code) { return LOGO[0] + encodeURIComponent(code) + ".png"; }
  // a logo that fails on the first source tries the second, then falls back to the airline code badge
  document.addEventListener("error", function (e) {
    var img = e.target; if (!img || !img.classList || !img.classList.contains("al-logo")) return;
    var n = +(img.dataset.n || 0) + 1, code = img.dataset.code;
    if (n < LOGO.length) { img.dataset.n = n; img.src = LOGO[n] + encodeURIComponent(code) + ".png"; }
    else img.remove();
  }, true);
  window.FleetInfo = { aircraft: aircraft, bags: bags, logo: logo, FLEET: FLEET, BAG: BAG };
})();
