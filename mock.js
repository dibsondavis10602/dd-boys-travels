/* Davis Travels sample-data engine.
   Shared by the browser (window.FareMock) and the Node server (require).
   Prices are generated deterministically from the search, so the same
   search always gives the same results. Airlines, hotels and sellers are fictional. */
(function (root) {
  var AIRPORTS = [
    ["JFK", "New York", "United States", 40.64, -73.78], ["LAX", "Los Angeles", "United States", 33.94, -118.41],
    ["ORD", "Chicago", "United States", 41.97, -87.91], ["MIA", "Miami", "United States", 25.79, -80.29],
    ["YYZ", "Toronto", "Canada", 43.68, -79.63], ["MEX", "Mexico City", "Mexico", 19.44, -99.07],
    ["GRU", "São Paulo", "Brazil", -23.43, -46.47], ["EZE", "Buenos Aires", "Argentina", -34.82, -58.54],
    ["BOG", "Bogotá", "Colombia", 4.70, -74.15], ["LHR", "London", "United Kingdom", 51.47, -0.45],
    ["CDG", "Paris", "France", 49.01, 2.55], ["FRA", "Frankfurt", "Germany", 50.04, 8.56],
    ["AMS", "Amsterdam", "Netherlands", 52.31, 4.76], ["MAD", "Madrid", "Spain", 40.47, -3.56],
    ["FCO", "Rome", "Italy", 41.80, 12.25], ["IST", "Istanbul", "Türkiye", 41.26, 28.74],
    ["DXB", "Dubai", "United Arab Emirates", 25.25, 55.36], ["DOH", "Doha", "Qatar", 25.27, 51.61],
    ["CAI", "Cairo", "Egypt", 30.12, 31.41], ["NBO", "Nairobi", "Kenya", -1.32, 36.93],
    ["JNB", "Johannesburg", "South Africa", -26.14, 28.25], ["LOS", "Lagos", "Nigeria", 6.58, 3.32],
    ["DEL", "Delhi", "India", 28.56, 77.10], ["BOM", "Mumbai", "India", 19.09, 72.87],
    ["BLR", "Bengaluru", "India", 13.20, 77.71], ["COK", "Kochi", "India", 10.15, 76.40],
    ["MAA", "Chennai", "India", 12.99, 80.17], ["CMB", "Colombo", "Sri Lanka", 7.18, 79.88],
    ["SIN", "Singapore", "Singapore", 1.36, 103.99], ["BKK", "Bangkok", "Thailand", 13.69, 100.75],
    ["KUL", "Kuala Lumpur", "Malaysia", 2.75, 101.71], ["HKG", "Hong Kong", "China", 22.31, 113.91],
    ["PEK", "Beijing", "China", 40.08, 116.58], ["NRT", "Tokyo", "Japan", 35.77, 140.39],
    ["ICN", "Seoul", "South Korea", 37.46, 126.44], ["SYD", "Sydney", "Australia", -33.94, 151.18],
    ["MEL", "Melbourne", "Australia", -37.67, 144.84], ["AKL", "Auckland", "New Zealand", -37.01, 174.79],
    ["DPS", "Bali", "Indonesia", -8.75, 115.17], ["MLE", "Malé", "Maldives", 4.19, 73.53]
  ].map(function (a) { return { code: a[0], city: a[1], country: a[2], lat: a[3], lon: a[4] }; });


  // More airports: [code, city, country, lat, lon, backdrop region]
  var MORE = [
    ["AUH","Abu Dhabi","United Arab Emirates",24.43,54.65,"gulf"],["SHJ","Sharjah","United Arab Emirates",25.33,55.52,"gulf"],["MCT","Muscat","Oman",23.59,58.28,"gulf"],
    ["BAH","Manama","Bahrain",26.27,50.63,"gulf"],["KWI","Kuwait City","Kuwait",29.24,47.97,"gulf"],["RUH","Riyadh","Saudi Arabia",24.96,46.70,"gulf"],
    ["JED","Jeddah","Saudi Arabia",21.68,39.16,"gulf"],["DMM","Dammam","Saudi Arabia",26.47,49.80,"gulf"],["AMM","Amman","Jordan",31.72,35.99,"gulf"],
    ["TLV","Tel Aviv","Israel",32.01,34.89,"gulf"],["BEY","Beirut","Lebanon",33.82,35.49,"gulf"],["GYD","Baku","Azerbaijan",40.47,50.05,"gulf"],
    ["TAS","Tashkent","Uzbekistan",41.26,69.28,"gulf"],["ALA","Almaty","Kazakhstan",43.35,77.04,"eastasia"],
    ["CCJ","Kozhikode","India",11.14,75.95,"india"],["TRV","Thiruvananthapuram","India",8.48,76.92,"india"],["HYD","Hyderabad","India",17.23,78.43,"india"],
    ["CCU","Kolkata","India",22.65,88.45,"india"],["GOI","Goa","India",15.38,73.83,"india"],["AMD","Ahmedabad","India",23.07,72.63,"india"],
    ["PNQ","Pune","India",18.58,73.92,"india"],["JAI","Jaipur","India",26.82,75.81,"india"],["LKO","Lucknow","India",26.76,80.89,"india"],
    ["ATQ","Amritsar","India",31.71,74.80,"india"],["IXE","Mangaluru","India",12.96,74.89,"india"],["CJB","Coimbatore","India",11.03,77.04,"india"],
    ["KTM","Kathmandu","Nepal",27.70,85.36,"india"],["DAC","Dhaka","Bangladesh",23.84,90.40,"india"],["KHI","Karachi","Pakistan",24.91,67.16,"india"],
    ["LHE","Lahore","Pakistan",31.52,74.40,"india"],["ISB","Islamabad","Pakistan",33.55,72.83,"india"],
    ["CGK","Jakarta","Indonesia",-6.13,106.66,"sea"],["MNL","Manila","Philippines",14.51,121.02,"sea"],["SGN","Ho Chi Minh City","Vietnam",10.82,106.65,"sea"],
    ["HAN","Hanoi","Vietnam",21.22,105.81,"sea"],["HKT","Phuket","Thailand",8.11,98.31,"islands"],["PNH","Phnom Penh","Cambodia",11.55,104.84,"sea"],
    ["RGN","Yangon","Myanmar",16.91,96.13,"sea"],["CEB","Cebu","Philippines",10.31,123.98,"islands"],["LGK","Langkawi","Malaysia",6.33,99.73,"islands"],
    ["PVG","Shanghai","China",31.14,121.81,"eastasia"],["CAN","Guangzhou","China",23.39,113.30,"eastasia"],["SZX","Shenzhen","China",22.64,113.81,"eastasia"],
    ["CTU","Chengdu","China",30.58,103.95,"eastasia"],["TPE","Taipei","Taiwan",25.08,121.23,"eastasia"],["KIX","Osaka","Japan",34.43,135.24,"eastasia"],
    ["PUS","Busan","South Korea",35.18,128.94,"eastasia"],["MFM","Macau","China",22.15,113.59,"eastasia"],["ULN","Ulaanbaatar","Mongolia",47.65,106.82,"eastasia"],
    ["MUC","Munich","Germany",48.35,11.79,"europe"],["BER","Berlin","Germany",52.37,13.50,"europe"],["ZRH","Zurich","Switzerland",47.46,8.55,"europe"],
    ["GVA","Geneva","Switzerland",46.24,6.11,"europe"],["VIE","Vienna","Austria",48.11,16.57,"europe"],["BCN","Barcelona","Spain",41.30,2.08,"europe"],
    ["AGP","Málaga","Spain",36.67,-4.50,"europe"],["PMI","Palma de Mallorca","Spain",39.55,2.74,"islands"],["LIS","Lisbon","Portugal",38.77,-9.13,"europe"],
    ["DUB","Dublin","Ireland",53.42,-6.27,"europe"],["MAN","Manchester","United Kingdom",53.36,-2.27,"europe"],["EDI","Edinburgh","United Kingdom",55.95,-3.37,"europe"],
    ["CPH","Copenhagen","Denmark",55.62,12.66,"europe"],["ARN","Stockholm","Sweden",59.65,17.92,"europe"],["OSL","Oslo","Norway",60.19,11.10,"europe"],
    ["HEL","Helsinki","Finland",60.32,24.96,"europe"],["KEF","Reykjavik","Iceland",63.99,-22.62,"europe"],["BRU","Brussels","Belgium",50.90,4.48,"europe"],
    ["PRG","Prague","Czechia",50.10,14.26,"europe"],["WAW","Warsaw","Poland",52.17,20.97,"europe"],["BUD","Budapest","Hungary",47.44,19.26,"europe"],
    ["OTP","Bucharest","Romania",44.57,26.08,"europe"],["ATH","Athens","Greece",37.94,23.94,"europe"],["MXP","Milan","Italy",45.63,8.72,"europe"],
    ["VCE","Venice","Italy",45.51,12.35,"europe"],["NCE","Nice","France",43.66,7.22,"europe"],["MLA","Valletta","Malta",35.86,14.48,"islands"],
    ["LCA","Larnaca","Cyprus",34.88,33.62,"islands"],["AYT","Antalya","Türkiye",36.90,30.80,"europe"],["TBS","Tbilisi","Georgia",41.67,44.95,"europe"],
    ["SVO","Moscow","Russia",55.97,37.41,"europe"],
    ["ADD","Addis Ababa","Ethiopia",8.98,38.80,"africa"],["CPT","Cape Town","South Africa",-33.97,18.60,"africa"],["DAR","Dar es Salaam","Tanzania",-6.88,39.20,"africa"],
    ["ZNZ","Zanzibar","Tanzania",-6.22,39.22,"islands"],["CMN","Casablanca","Morocco",33.37,-7.59,"egypt"],["RAK","Marrakesh","Morocco",31.61,-8.04,"egypt"],
    ["TUN","Tunis","Tunisia",36.85,10.23,"egypt"],["ALG","Algiers","Algeria",36.69,3.22,"egypt"],["HRG","Hurghada","Egypt",27.18,33.80,"egypt"],
    ["SSH","Sharm El Sheikh","Egypt",27.98,34.39,"egypt"],["ACC","Accra","Ghana",5.61,-0.17,"africa"],["DKR","Dakar","Senegal",14.74,-17.49,"africa"],
    ["ABV","Abuja","Nigeria",9.01,7.26,"africa"],["EBB","Entebbe","Uganda",0.04,32.44,"africa"],["KGL","Kigali","Rwanda",-1.97,30.14,"africa"],
    ["LAD","Luanda","Angola",-8.86,13.23,"africa"],["MRU","Mauritius","Mauritius",-20.43,57.68,"islands"],["SEZ","Mahé","Seychelles",-4.67,55.52,"islands"],
    ["SFO","San Francisco","United States",37.62,-122.38,"na"],["SEA","Seattle","United States",47.45,-122.31,"na"],["LAS","Las Vegas","United States",36.08,-115.15,"na"],
    ["DFW","Dallas","United States",32.90,-97.04,"na"],["IAH","Houston","United States",29.98,-95.34,"na"],["ATL","Atlanta","United States",33.64,-84.43,"na"],
    ["BOS","Boston","United States",42.36,-71.01,"na"],["IAD","Washington","United States",38.95,-77.46,"na"],["DEN","Denver","United States",39.86,-104.67,"na"],
    ["MCO","Orlando","United States",28.43,-81.31,"na"],["EWR","Newark","United States",40.69,-74.17,"na"],["PHX","Phoenix","United States",33.43,-112.01,"na"],
    ["MSP","Minneapolis","United States",44.88,-93.22,"na"],["DTW","Detroit","United States",42.21,-83.35,"na"],["PHL","Philadelphia","United States",39.87,-75.24,"na"],
    ["HNL","Honolulu","United States",21.32,-157.92,"islands"],["YVR","Vancouver","Canada",49.19,-123.18,"na"],["YUL","Montreal","Canada",45.47,-73.74,"na"],
    ["YYC","Calgary","Canada",51.13,-114.01,"na"],["CUN","Cancún","Mexico",21.04,-86.87,"islands"],["GDL","Guadalajara","Mexico",20.52,-103.31,"latam"],
    ["SJU","San Juan","Puerto Rico",18.44,-66.00,"islands"],["NAS","Nassau","Bahamas",25.04,-77.47,"islands"],["MBJ","Montego Bay","Jamaica",18.50,-77.91,"islands"],
    ["PTY","Panama City","Panama",9.07,-79.38,"latam"],["SJO","San José","Costa Rica",9.99,-84.20,"latam"],["HAV","Havana","Cuba",22.99,-82.41,"latam"],
    ["LIM","Lima","Peru",-12.02,-77.11,"latam"],["CUZ","Cusco","Peru",-13.54,-71.94,"latam"],["SCL","Santiago","Chile",-33.39,-70.79,"latam"],
    ["GIG","Rio de Janeiro","Brazil",-22.81,-43.25,"latam"],["BSB","Brasília","Brazil",-15.87,-47.92,"latam"],["UIO","Quito","Ecuador",-0.13,-78.36,"latam"],
    ["MDE","Medellín","Colombia",6.16,-75.42,"latam"],["CTG","Cartagena","Colombia",10.44,-75.51,"latam"],["CCS","Caracas","Venezuela",10.60,-66.99,"latam"],
    ["MVD","Montevideo","Uruguay",-34.84,-56.03,"latam"],["LPB","La Paz","Bolivia",-16.51,-68.19,"latam"],
    ["BNE","Brisbane","Australia",-27.38,153.12,"oceania"],["PER","Perth","Australia",-31.94,115.97,"oceania"],["ADL","Adelaide","Australia",-34.95,138.53,"oceania"],
    ["OOL","Gold Coast","Australia",-28.16,153.50,"oceania"],["CNS","Cairns","Australia",-16.88,145.75,"oceania"],["CHC","Christchurch","New Zealand",-43.49,172.53,"oceania"],
    ["NAN","Nadi","Fiji",-17.76,177.44,"islands"],["PPT","Papeete","French Polynesia",-17.55,-149.61,"islands"]
  ];
  MORE.forEach(function (a) { AIRPORTS.push({ code: a[0], city: a[1], country: a[2], lat: a[3], lon: a[4], region: a[5] }); });

  var ALIAS = { bangalore: "BLR", bombay: "BOM", cochin: "COK", ernakulam: "COK", calicut: "CCJ", trivandrum: "TRV", madras: "MAA", calcutta: "CCU",
    "new delhi": "DEL", mangalore: "IXE", nyc: "JFK", "new york city": "JFK", saigon: "SGN", "ho chi minh": "SGN", peking: "PEK", tokyo: "NRT",
    "abu dhabi": "AUH", abudhabi: "AUH", "dubai": "DXB", bahrain: "BAH", kuwait: "KWI", "mecca": "JED", makkah: "JED", "washington dc": "IAD", "washington d.c.": "IAD",
    "sao paulo": "GRU", "rio": "GIG", "cancun": "CUN", "malaga": "AGP", "mallorca": "PMI", "majorca": "PMI", "malta": "MLA", "cyprus": "LCA", "seychelles": "SEZ",
    "fiji": "NAN", "tahiti": "PPT", "maldives": "MLE", "bali": "DPS", "medellin": "MDE", "bogota": "BOG", "brasilia": "BSB", "marrakech": "RAK", "istanbul": "IST",
    "hong kong": "HKG", "london": "LHR", "paris": "CDG", "zanzibar": "ZNZ", "sharm": "SSH", "kerala": "COK", "goa": "GOI", "san jose": "SJO", "uae": "DXB" };

  // Find an airport from a code, a city name, a common old name, or the start of a city name.
  function find(text) {
    var v = String(text || "").trim(); if (!v) return null;
    var byCode = airport(v); if (byCode) return byCode;
    var lv = v.toLowerCase().normalize ? v.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : v.toLowerCase();
    if (ALIAS[lv]) return airport(ALIAS[lv]);
    var plain = function (s) { s = s.toLowerCase(); return s.normalize ? s.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : s; };
    var m = AIRPORTS.filter(function (a) { return plain(a.city) === lv; })[0] ||
            AIRPORTS.filter(function (a) { return plain(a.city).indexOf(lv) === 0; })[0] ||
            AIRPORTS.filter(function (a) { return plain(a.country) === lv; })[0];
    if (m) return m;
    var alias = Object.keys(ALIAS).filter(function (k) { return k.indexOf(lv) === 0 && lv.length >= 3; })[0];
    return alias ? airport(ALIAS[alias]) : null;
  }

  // Real airlines: code, name, website, hub airports, cost level (1 = average), low-cost carriers fly short routes only.
  var AIRLINES = [
    ["EK","Emirates","emirates.com","DXB",1.15],["QR","Qatar Airways","qatarairways.com","DOH",1.15],["EY","Etihad Airways","etihad.com","AUH",1.08],
    ["FZ","flydubai","flydubai.com","DXB",0.8,1],["G9","Air Arabia","airarabia.com","SHJ",0.7,1],["WY","Oman Air","omanair.com","MCT",1.0],
    ["GF","Gulf Air","gulfair.com","BAH",0.95],["SV","Saudia","saudia.com","JED RUH",0.95],["KU","Kuwait Airways","kuwaitairways.com","KWI",0.95],
    ["RJ","Royal Jordanian","rj.com","AMM",1.0],
    ["AI","Air India","airindia.com","DEL BOM",0.95],["6E","IndiGo","goindigo.in","DEL BOM BLR HYD",0.75,1],["IX","Air India Express","airindiaexpress.com","COK CCJ TRV IXE",0.7,1],
    ["QP","Akasa Air","akasaair.com","BOM",0.75,1],["SG","SpiceJet","spicejet.com","DEL",0.72,1],["UL","SriLankan Airlines","srilankan.com","CMB",0.95],
    ["PK","PIA","piac.com.pk","KHI LHE ISB",0.85],["BG","Biman Bangladesh","biman-airlines.com","DAC",0.85],
    ["BA","British Airways","britishairways.com","LHR",1.25],["LH","Lufthansa","lufthansa.com","FRA MUC",1.2],["AF","Air France","airfrance.com","CDG",1.2],
    ["KL","KLM","klm.com","AMS",1.15],["TK","Turkish Airlines","turkishairlines.com","IST",1.0],["IB","Iberia","iberia.com","MAD",1.1],
    ["LX","SWISS","swiss.com","ZRH",1.3],["OS","Austrian","austrian.com","VIE",1.15],["AZ","ITA Airways","ita-airways.com","FCO",1.1],
    ["SK","SAS","flysas.com","CPH ARN OSL",1.15],["AY","Finnair","finnair.com","HEL",1.1],["VS","Virgin Atlantic","virginatlantic.com","LHR",1.2],
    ["EI","Aer Lingus","aerlingus.com","DUB",1.05],["TP","TAP Air Portugal","flytap.com","LIS",1.05],
    ["FR","Ryanair","ryanair.com","DUB BCN MAD FCO MXP AGP",0.55,1],["U2","easyJet","easyjet.com","LHR MAN EDI GVA",0.6,1],["W6","Wizz Air","wizzair.com","BUD WAW OTP",0.55,1],
    ["AA","American Airlines","aa.com","DFW MIA JFK PHL",1.1],["DL","Delta","delta.com","ATL JFK MSP DTW SEA",1.1],["UA","United","united.com","ORD SFO EWR IAH DEN IAD",1.1],
    ["AC","Air Canada","aircanada.com","YYZ YUL YVR",1.1],["B6","JetBlue","jetblue.com","JFK BOS",0.8,1],["WN","Southwest","southwest.com","DEN LAS PHX",0.75,1],
    ["AS","Alaska Airlines","alaskaair.com","SEA",0.95],["AM","Aeroméxico","aeromexico.com","MEX",0.95],
    ["LA","LATAM","latamairlines.com","GRU SCL LIM",1.0],["AV","Avianca","avianca.com","BOG",0.9],["CM","Copa Airlines","copaair.com","PTY",0.95],
    ["AR","Aerolíneas Argentinas","aerolineas.com.ar","EZE",0.95],["G3","GOL","voegol.com.br","GRU GIG",0.7,1],
    ["ET","Ethiopian Airlines","ethiopianairlines.com","ADD",0.95],["KQ","Kenya Airways","kenya-airways.com","NBO",1.0],["SA","South African Airways","flysaa.com","JNB",1.05],
    ["MS","EgyptAir","egyptair.com","CAI",0.9],["AT","Royal Air Maroc","royalairmaroc.com","CMN",0.95],["WB","RwandAir","rwandair.com","KGL",1.0],
    ["CX","Cathay Pacific","cathaypacific.com","HKG",1.2],["NH","ANA","ana.co.jp","NRT",1.25],["JL","Japan Airlines","jal.co.jp","NRT KIX",1.25],
    ["KE","Korean Air","koreanair.com","ICN",1.15],["CA","Air China","airchina.com","PEK CTU",0.9],["MU","China Eastern","ceair.com","PVG",0.88],
    ["CZ","China Southern","csair.com","CAN SZX",0.88],["BR","EVA Air","evaair.com","TPE",1.1],
    ["SQ","Singapore Airlines","singaporeair.com","SIN",1.25],["TG","Thai Airways","thaiairways.com","BKK",1.0],["MH","Malaysia Airlines","malaysiaairlines.com","KUL",0.95],
    ["AK","AirAsia","airasia.com","KUL BKK CGK MNL",0.6,1],["GA","Garuda Indonesia","garuda-indonesia.com","CGK DPS",0.95],["PR","Philippine Airlines","philippineairlines.com","MNL",0.95],
    ["VN","Vietnam Airlines","vietnamairlines.com","SGN HAN",0.9],["VJ","VietJet Air","vietjetair.com","SGN HAN",0.6,1],["TR","Scoot","flyscoot.com","SIN",0.65,1],
    ["QF","Qantas","qantas.com","SYD MEL BNE PER",1.25],["VA","Virgin Australia","virginaustralia.com","BNE SYD MEL",1.0],["NZ","Air New Zealand","airnewzealand.com","AKL CHC",1.15],
    ["JQ","Jetstar","jetstar.com","MEL SYD OOL",0.6,1],["FJ","Fiji Airways","fijiairways.com","NAN",1.05]
  ].map(function (a) { return { code: a[0], name: a[1], site: "https://www." + a[2], hubs: a[3].split(" "), cost: a[4], lowcost: !!a[5] }; });
  var AIRLINE_BY_CODE = {}; AIRLINES.forEach(function (a) { AIRLINE_BY_CODE[a.code] = a; });

  // Backdrop region for the first 40 airports (the rest carry it in their entry).
  var REGION = { JFK: "na", LAX: "na", ORD: "na", MIA: "na", YYZ: "na", MEX: "latam", GRU: "latam", EZE: "latam", BOG: "latam",
    LHR: "europe", CDG: "europe", FRA: "europe", AMS: "europe", MAD: "europe", FCO: "europe", IST: "europe", DXB: "gulf", DOH: "gulf", CAI: "egypt",
    NBO: "africa", JNB: "africa", LOS: "africa", DEL: "india", BOM: "india", BLR: "india", COK: "india", MAA: "india", CMB: "india",
    SIN: "sea", BKK: "sea", KUL: "sea", DPS: "islands", MLE: "islands", HKG: "eastasia", PEK: "eastasia", NRT: "eastasia", ICN: "eastasia",
    SYD: "oceania", MEL: "oceania", AKL: "oceania" };
  AIRPORTS.forEach(function (a) { if (!a.region) a.region = REGION[a.code] || "europe"; });

  // Which real airlines plausibly fly A -> B: direct if one end is their hub, one stop through their hub otherwise.
  var BIG = {};
  AIRLINES.forEach(function (al) { if (!al.lowcost) al.hubs.forEach(function (h) { BIG[h] = 1; }); });
  ["LHR", "CDG", "JFK", "LAX", "SFO", "ORD", "SYD", "MEL", "SIN", "HKG", "NRT", "BKK", "DEL", "BOM", "JNB", "GRU", "MEX", "YYZ", "FRA", "AMS"].forEach(function (h) { BIG[h] = 1; });
  function carriersFor(from, to, dist) {
    var list = [];
    var india = from.country === "India" || to.country === "India", pak = from.country === "Pakistan" || to.country === "Pakistan";
    AIRLINES.forEach(function (al) {
      // India and Pakistan carriers don't serve each other's airports
      if (india && al.code === "PK") return;
      if (pak && ["AI", "IX", "6E", "SG", "QP", "UK"].indexOf(al.code) >= 0) return;
      var atFrom = al.hubs.indexOf(from.code) >= 0, atTo = al.hubs.indexOf(to.code) >= 0;
      if (al.lowcost && dist > 4200) return;
      if (atFrom || atTo) {
        // long nonstops only between big hubs; small airports connect first
        var other = atFrom ? to : from;
        if (dist <= 6500 || BIG[other.code]) { list.push({ al: al, via: [] }); return; }
        return;
      }
      var best = null;
      al.hubs.forEach(function (hc) {
        var h = airport(hc); if (!h) return;
        var detour = km(from, h) + km(h, to);
        if (detour < dist * 1.3 + 700 && (!best || detour < best.d)) best = { h: hc, d: detour };
      });
      if (best && !al.lowcost) list.push({ al: al, via: [best.h] });
      else if (best && al.lowcost && best.d < 3500) list.push({ al: al, via: [best.h] });
    });
    if (!list.length) ["EK", "QR", "TK"].forEach(function (c) { var al = AIRLINE_BY_CODE[c], hub = al.hubs[0]; list.push({ al: al, via: [hub, (from.lat > 0 ? "SIN" : "JNB")].filter(function (x) { return x !== from.code && x !== to.code; }).slice(0, dist > 9000 ? 2 : 1) }); });
    return list;
  }

  // Real comparison sites, each opened already filled in with the traveller's search.
  function dmy(d, sep) { return d.slice(8, 10) + sep + d.slice(5, 7) + sep + d.slice(0, 4); }
  function mdy(d) { return d.slice(5, 7) + "/" + d.slice(8, 10) + "/" + d.slice(0, 4); }
  var FLIGHT_SITES = [
    ["Google Flights", function (q) { return "https://www.google.com/travel/flights?q=" + encodeURIComponent("Flights from " + q.from + " to " + q.to + " on " + q.date + (q.ret ? " returning " + q.ret : " one way")); }],
    ["Skyscanner", function (q) { var d = function (x) { return x.slice(2, 4) + x.slice(5, 7) + x.slice(8, 10); }; return "https://www.skyscanner.net/transport/flights/" + q.from.toLowerCase() + "/" + q.to.toLowerCase() + "/" + d(q.date) + "/" + (q.ret ? d(q.ret) + "/" : "") + "?adultsv2=" + (q.adults || 1); }],
    ["Kayak", function (q) { return "https://www.kayak.com/flights/" + q.from + "-" + q.to + "/" + q.date + (q.ret ? "/" + q.ret : "") + "/" + (q.adults || 1) + "adults?sort=price_a"; }],
    ["Momondo", function (q) { return "https://www.momondo.com/flight-search/" + q.from + "-" + q.to + "/" + q.date + (q.ret ? "/" + q.ret : "") + "/" + (q.adults || 1) + "adults?sort=price_a"; }],
    ["Expedia", function (q) { return "https://www.expedia.com/Flights-Search?trip=" + (q.ret ? "roundtrip" : "oneway") + "&leg1=from:" + q.from + ",to:" + q.to + ",departure:" + mdy(q.date) + "TANYT" + (q.ret ? "&leg2=from:" + q.to + ",to:" + q.from + ",departure:" + mdy(q.ret) + "TANYT" : "") + "&passengers=adults:" + (q.adults || 1) + "&mode=search"; }],
    ["Trip.com", function (q) { return "https://www.trip.com/flights/showfarefirst?dcity=" + q.from.toLowerCase() + "&acity=" + q.to.toLowerCase() + "&ddate=" + q.date + (q.ret ? "&rdate=" + q.ret + "&triptype=rt" : "&triptype=ow") + "&class=y&quantity=" + (q.adults || 1); }],
    ["Kiwi.com", function (q) { return "https://www.kiwi.com/en/search/results/" + q.from.toLowerCase() + "/" + q.to.toLowerCase() + "/" + q.date + "/" + (q.ret || "no-return"); }],
    ["MakeMyTrip", function (q) { return "https://www.makemytrip.com/flight/search?itinerary=" + q.from + "-" + q.to + "-" + dmy(q.date, "/") + (q.ret ? "_" + q.to + "-" + q.from + "-" + dmy(q.ret, "/") : "") + "&tripType=" + (q.ret ? "R" : "O") + "&paxType=A-" + (q.adults || 1) + "_C-0_I-0&cabinClass=E"; }],
    ["Cleartrip", function (q) { return "https://www.cleartrip.com/flights/results?adults=" + (q.adults || 1) + "&childs=0&infants=0&class=Economy&depart_date=" + dmy(q.date, "/") + (q.ret ? "&return_date=" + dmy(q.ret, "/") : "") + "&from=" + q.from + "&to=" + q.to; }],
    ["Aviasales", function (q) { var d = function (x) { return x.slice(8, 10) + x.slice(5, 7); }; return "https://www.aviasales.com/search/" + q.from + d(q.date) + q.to + (q.ret ? d(q.ret) : "") + (q.adults || 1); }]
  ];
  var HOTEL_SITES = [
    ["Booking.com", function (h) { return "https://www.booking.com/searchresults.html?ss=" + encodeURIComponent(h.city) + "&checkin=" + h.checkin + "&checkout=" + h.checkout + "&group_adults=" + (h.guests || 2) + "&no_rooms=1"; }],
    ["Agoda", function (h) { return "https://www.agoda.com/search?textToSearch=" + encodeURIComponent(h.city) + "&checkIn=" + h.checkin + "&checkOut=" + h.checkout + "&adults=" + (h.guests || 2) + "&rooms=1"; }],
    ["Expedia", function (h) { return "https://www.expedia.com/Hotel-Search?destination=" + encodeURIComponent(h.city) + "&startDate=" + h.checkin + "&endDate=" + h.checkout + "&adults=" + (h.guests || 2); }],
    ["Hotels.com", function (h) { return "https://www.hotels.com/Hotel-Search?destination=" + encodeURIComponent(h.city) + "&startDate=" + h.checkin + "&endDate=" + h.checkout + "&adults=" + (h.guests || 2); }],
    ["Google Hotels", function (h) { return "https://www.google.com/travel/search?q=" + encodeURIComponent("hotels in " + h.city + " " + h.checkin + " to " + h.checkout); }],
    ["Kayak", function (h) { return "https://www.kayak.com/hotels/" + encodeURIComponent(h.city.replace(/ /g, "-")) + "/" + h.checkin + "/" + h.checkout + "/" + (h.guests || 2) + "adults?sort=price_a"; }],
    ["Trip.com", function (h) { return "https://www.trip.com/hotels/list?cityName=" + encodeURIComponent(h.city) + "&checkin=" + h.checkin.replace(/-/g, "/") + "&checkout=" + h.checkout.replace(/-/g, "/") + "&adult=" + (h.guests || 2); }],
    ["Airbnb", function (h) { return "https://www.airbnb.com/s/" + encodeURIComponent(h.city.replace(/ /g, "-")) + "/homes?checkin=" + h.checkin + "&checkout=" + h.checkout + "&adults=" + (h.guests || 2); }],
    ["Tripadvisor", function (h) { return "https://www.tripadvisor.com/Search?q=" + encodeURIComponent("hotels " + h.city); }],
    ["MakeMyTrip", function (h) { return "https://www.makemytrip.com/hotels/hotel-listing/?checkin=" + h.checkin.slice(5, 7) + h.checkin.slice(8, 10) + h.checkin.slice(0, 4) + "&checkout=" + h.checkout.slice(5, 7) + h.checkout.slice(8, 10) + h.checkout.slice(0, 4) + "&searchText=" + encodeURIComponent(h.city) + "&roomStayQualifier=" + (h.guests || 2) + "e0e"; }]
  ];
  var links = {
    airline: function (code) { var a = AIRLINE_BY_CODE[code]; return a ? a.site : null; },
    flights: function (q) { return FLIGHT_SITES.map(function (s) { return { name: s[0], url: s[1](q) }; }); },
    hotels: function (h) { return HOTEL_SITES.map(function (s) { return { name: s[0], url: s[1](h) }; }); }
  };

  var SELLERS = ["Airline direct", "Travel agency A", "Travel agency B", "Deal finder C"];

  var HOTEL_WORDS = {
    a: ["Harbour", "Garden", "Grand", "Lantern", "Palm", "Old Town", "Riverside", "Skyline", "Cloister", "Monsoon", "Atlas", "Station"],
    b: ["House", "Hotel", "Suites", "Residency", "Inn", "Lodge", "Retreat", "Hostel", "Palace", "Rooms"]
  };
  var AREAS = ["City centre", "Old town", "Near airport", "Business district", "Waterfront", "Near main station", "Shopping district"];

  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function rng(seed) {
    var s = seed || 1;
    return function () { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
  }
  function airport(code) {
    code = String(code || "").trim().toUpperCase();
    for (var i = 0; i < AIRPORTS.length; i++) if (AIRPORTS[i].code === code) return AIRPORTS[i];
    return null;
  }
  function km(a, b) {
    var R = 6371, toR = Math.PI / 180;
    var dLat = (b.lat - a.lat) * toR, dLon = (b.lon - a.lon) * toR;
    var x = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(a.lat * toR) * Math.cos(b.lat * toR) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 2 * R * Math.asin(Math.sqrt(x));
  }
  function addMinutes(iso, min) { return new Date(new Date(iso).getTime() + min * 60000).toISOString(); }
  function dayFactor(date) {
    var d = new Date(date + "T00:00:00Z").getUTCDay(); // 0 Sun
    return [1.12, 0.96, 0.9, 0.88, 1.02, 1.15, 1.0][d];
  }
  function leadFactor(date) {
    var days = (new Date(date + "T00:00:00Z") - Date.now()) / 86400000;
    if (days < 7) return 1.45; if (days < 21) return 1.15; if (days < 90) return 0.95; return 1.0;
  }
  var CABIN = { economy: 1, premium_economy: 1.7, business: 3.4, first: 5.2 };

  function searchFlights(q) {
    var from = airport(q.from), to = airport(q.to);
    if (!from || !to) return { error: "Pick airports from the list (for example DEL, LHR or JFK)." };
    if (from.code === to.code) return { error: "Origin and destination must be different airports." };
    var adults = Math.max(1, Math.min(9, +q.adults || 1));
    var cabin = CABIN[q.cabin] ? q.cabin : "economy";
    var dist = km(from, to);
    var r = rng(hash(from.code + to.code + q.date + cabin));
    var base = (45 + dist * 0.075) * dayFactor(q.date) * leadFactor(q.date) * CABIN[cabin];
    var cands = carriersFor(from, to, dist);
    // shuffle, then up to two departures per airline
    // nonstop airlines first, then a mix of one-stop options
    var shuf = function (a) { return a.map(function (x) { return [r(), x]; }).sort(function (a, b) { return a[0] - b[0]; }).map(function (x) { return x[1]; }); };
    var direct = shuf(cands.filter(function (c) { return !c.via.length; })), conn = shuf(cands.filter(function (c) { return c.via.length; }));
    cands = direct.slice(0, 7).concat(conn).slice(0, 10);
    var offers = [];
    cands.forEach(function (c, ci) {
      var times = c.via.length ? 1 + (r() < 0.4 ? 1 : 0) : 1 + (r() < 0.6 ? 1 : 0);
      for (var t = 0; t < times; t++) {
        var via = c.via, stops = via.length;
        var flyMin = 0, pts = [from].concat(via.map(airport)).concat([to]);
        for (var k = 0; k < pts.length - 1; k++) flyMin += Math.round(km(pts[k], pts[k + 1]) / 13.5 + 35);
        var layover = 0;
        for (var l = 0; l < stops; l++) layover += 65 + Math.floor(r() * 260);
        var duration = flyMin + layover;
        var depHour = 1 + Math.floor(r() * 22), depMin = [0, 5, 15, 25, 35, 45, 50][Math.floor(r() * 7)];
        var departs = q.date + "T" + String(depHour).padStart(2, "0") + ":" + String(depMin).padStart(2, "0") + ":00Z";
        var price = Math.round(base * c.al.cost * (stops ? 0.88 : 1.06) * (0.88 + r() * 0.3) * adults);
        offers.push({
          id: "F" + ci + t + "-" + c.al.code,
          airline: c.al.name, airlineCode: c.al.code, flightNo: c.al.code, site: c.al.site, lowcost: c.al.lowcost,
          from: from.code, to: to.code, via: via, stops: stops,
          departs: departs, arrives: addMinutes(departs, duration), durationMin: duration,
          cabin: cabin, adults: adults, bags: c.al.lowcost ? "Cabin bag only, checked bag extra" : "Cabin + checked bag usually included",
          price: price, currency: "USD", estimated: true,
          sellers: [{ seller: c.al.name + " website", price: price, url: c.al.site }]
        });
      }
    });
    return { source: "sample", from: from, to: to, distanceKm: Math.round(dist), offers: offers };
  }

  function cheapestByDay(q, days) {
    var out = [];
    var start = new Date(q.date + "T00:00:00Z");
    for (var d = -Math.floor(days / 2); d <= Math.floor(days / 2); d++) {
      var dt = new Date(start.getTime() + d * 86400000).toISOString().slice(0, 10);
      var res = searchFlights({ from: q.from, to: q.to, date: dt, adults: q.adults, cabin: q.cabin });
      if (res.error) return [];
      out.push({ date: dt, price: Math.min.apply(null, res.offers.map(function (o) { return o.price; })) });
    }
    return out;
  }

  function nights(a, b) { return Math.max(1, Math.round((new Date(b) - new Date(a)) / 86400000)); }

  // Typical nightly rates by hotel class, estimated from the city's cost level and the dates.
  function searchHotels(q) {
    var ap = find(q.city);
    if (!ap) return { error: "Pick a city from the list." };
    var n = nights(q.checkin, q.checkout);
    var guests = Math.max(1, Math.min(8, +q.guests || 2));
    var costOfCity = { AUH: 1.2, DOH: 1.2, ZRH: 1.8, GVA: 1.7, HNL: 1.7, SFO: 1.6, BOS: 1.5, KEF: 1.6, OSL: 1.5, SEZ: 2.0, MRU: 1.3, CCJ: 0.45, TRV: 0.45, GOI: 0.55, HYD: 0.5, KTM: 0.4, HAN: 0.45, SGN: 0.45, MNL: 0.5, CGK: 0.5, NRT: 1.5, LHR: 1.6, JFK: 1.7, CDG: 1.45, SIN: 1.4, DXB: 1.25, SYD: 1.3, MLE: 2.2, DEL: 0.55, BOM: 0.6, BLR: 0.55, COK: 0.45, MAA: 0.5, CMB: 0.5, BKK: 0.55, DPS: 0.6, KUL: 0.55, CAI: 0.45, IST: 0.7, MEX: 0.65, BOG: 0.55 }[ap.code] || 1.0;
    var season = dayFactor(q.checkin) * (guests > 2 ? 1.35 : 1);
    var TIERS = [[2, "Budget", "Hostels, guesthouses and simple hotels", 26], [3, "Comfort", "Good-value city hotels", 55], [4, "Upscale", "Full-service hotels with pool or gym", 115], [5, "Luxury", "Five-star hotels and resorts", 260]];
    var tiers = TIERS.map(function (t) {
      var typical = Math.round(t[3] * costOfCity * season);
      return { stars: t[0], label: t[1], about: t[2], perNight: typical, low: Math.round(typical * 0.7), high: Math.round(typical * 1.45), total: typical * n };
    });
    return { source: "estimate", city: ap, nights: n, guests: guests, checkin: q.checkin, checkout: q.checkout, tiers: tiers };
  }

  // Cheapest fare from one airport to every other, sampled across a month.
  function explore(q) {
    var from = airport(q.from);
    if (!from) return { error: "Pick a departure airport from the list." };
    var month = /^\d{4}-\d{2}$/.test(q.month || "") ? q.month : new Date().toISOString().slice(0, 7);
    var out = [];
    AIRPORTS.forEach(function (to) {
      if (to.code === from.code) return;
      var best = null;
      for (var day = 2; day <= 28; day += 3) {
        var date = month + "-" + String(day).padStart(2, "0");
        var res = searchFlights({ from: from.code, to: to.code, date: date, adults: q.adults || 1, cabin: q.cabin || "economy" });
        res.offers.forEach(function (o) { if (!best || o.price < best.price) best = { price: o.price, date: date, durationMin: o.durationMin, stops: o.stops, airline: o.airline }; });
      }
      out.push({ to: to, price: best.price, date: best.date, durationMin: best.durationMin, stops: best.stops, airline: best.airline, distanceKm: Math.round(km(from, to)) });
    });
    out.sort(function (a, b) { return a.price - b.price; });
    return { source: "sample", from: from, month: month, results: out };
  }

  var api = { AIRPORTS: AIRPORTS, AIRLINES: AIRLINE_BY_CODE, links: links, airport: airport, find: find, searchFlights: searchFlights, cheapestByDay: cheapestByDay, searchHotels: searchHotels, explore: explore };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.FareMock = api;
})(typeof window !== "undefined" ? window : this);
