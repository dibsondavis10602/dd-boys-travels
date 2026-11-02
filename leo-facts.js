// Facts Leo uses to answer accurately: what each city is good for, money and language by country,
// country and region names people type, and multi-city routes for regions.
(function (root) {
  // What each destination is really known for.
  var TAGS = {
    JFK: "city culture", LAX: "city beach", ORD: "city", MIA: "beach city", YYZ: "city", MEX: "culture city", GRU: "city", EZE: "city culture", BOG: "city culture mountains",
    LHR: "city culture", CDG: "city culture", FRA: "city", AMS: "city culture", MAD: "city culture", FCO: "culture city", IST: "culture city",
    DXB: "city beach", DOH: "city culture", CAI: "culture", NBO: "nature", JNB: "city nature", LOS: "city",
    DEL: "culture city", BOM: "city culture", BLR: "city", COK: "culture nature beach", MAA: "culture beach", CMB: "beach culture",
    SIN: "city", BKK: "city culture", KUL: "city", HKG: "city", PEK: "culture city", NRT: "city culture", ICN: "city culture",
    SYD: "city beach", MEL: "city", AKL: "city nature", DPS: "beach culture nature", MLE: "beach",
    AUH: "city culture", SHJ: "culture", MCT: "culture nature beach", BAH: "culture", KWI: "city", RUH: "culture city", JED: "culture", DMM: "city",
    AMM: "culture nature", TLV: "beach city", BEY: "culture city", GYD: "culture city", TAS: "culture", ALA: "mountains nature",
    CCJ: "beach", TRV: "beach culture", HYD: "culture city", CCU: "culture", GOI: "beach", AMD: "culture", PNQ: "city", JAI: "culture",
    LKO: "culture", ATQ: "culture", IXE: "beach", CJB: "mountains nature", KTM: "mountains culture", DAC: "city", KHI: "city", LHE: "culture", ISB: "mountains nature",
    CGK: "city", MNL: "city", SGN: "city culture", HAN: "culture nature", HKT: "beach", PNH: "culture", RGN: "culture", CEB: "beach nature", LGK: "beach nature",
    PVG: "city", CAN: "city", SZX: "city", CTU: "culture nature", TPE: "city culture", KIX: "culture city", PUS: "beach city", MFM: "city", ULN: "nature mountains",
    MUC: "culture city", BER: "city culture", ZRH: "mountains city", GVA: "mountains city", VIE: "culture city", BCN: "beach culture city", AGP: "beach", PMI: "beach",
    LIS: "city culture", DUB: "city culture", MAN: "city", EDI: "culture", CPH: "city", ARN: "city", OSL: "nature city", HEL: "city", KEF: "nature mountains",
    BRU: "city culture", PRG: "culture city", WAW: "city", BUD: "culture city", OTP: "city", ATH: "culture beach", MXP: "city", VCE: "culture", NCE: "beach",
    MLA: "beach culture", LCA: "beach", AYT: "beach culture", TBS: "culture mountains", SVO: "city culture",
    ADD: "culture", CPT: "nature beach mountains", DAR: "beach", ZNZ: "beach culture", CMN: "city", RAK: "culture", TUN: "culture beach", ALG: "city",
    HRG: "beach", SSH: "beach", ACC: "city beach", DKR: "beach city", ABV: "city", EBB: "nature", KGL: "nature", LAD: "city", MRU: "beach", SEZ: "beach nature",
    SFO: "city", SEA: "city nature", LAS: "city", DFW: "city", IAH: "city", ATL: "city", BOS: "city culture", IAD: "culture city", DEN: "mountains city", MCO: "city",
    EWR: "city", PHX: "nature", MSP: "city", DTW: "city", PHL: "culture city", HNL: "beach nature", YVR: "nature city mountains", YUL: "city culture", YYC: "mountains nature",
    CUN: "beach", GDL: "culture", SJU: "beach", NAS: "beach", MBJ: "beach", PTY: "city", SJO: "nature", HAV: "culture", LIM: "city culture", CUZ: "mountains culture",
    SCL: "city mountains", GIG: "beach city", BSB: "city", UIO: "mountains culture", MDE: "city", CTG: "beach culture", CCS: "city", MVD: "city beach", LPB: "mountains",
    BNE: "city", PER: "beach city", ADL: "city", OOL: "beach", CNS: "nature beach", CHC: "nature mountains", NAN: "beach", PPT: "beach"
  };
  // Country: [currency code, currency name, main languages]
  var COUNTRY = {
    "United States": ["USD", "US dollar", "English"], "Canada": ["CAD", "Canadian dollar", "English and French"], "Mexico": ["MXN", "Mexican peso", "Spanish"],
    "Brazil": ["BRL", "Brazilian real", "Portuguese"], "Argentina": ["ARS", "Argentine peso", "Spanish"], "Colombia": ["COP", "Colombian peso", "Spanish"],
    "United Kingdom": ["GBP", "British pound", "English"], "France": ["EUR", "euro", "French"], "Germany": ["EUR", "euro", "German"], "Netherlands": ["EUR", "euro", "Dutch (English widely spoken)"],
    "Spain": ["EUR", "euro", "Spanish (Catalan in Barcelona)"], "Italy": ["EUR", "euro", "Italian"], "Türkiye": ["TRY", "Turkish lira", "Turkish"],
    "United Arab Emirates": ["AED", "UAE dirham", "Arabic (English widely spoken)"], "Qatar": ["QAR", "Qatari riyal", "Arabic and English"], "Egypt": ["EGP", "Egyptian pound", "Arabic"],
    "Kenya": ["KES", "Kenyan shilling", "English and Swahili"], "South Africa": ["ZAR", "South African rand", "English, Afrikaans, Zulu and others"], "Nigeria": ["NGN", "Nigerian naira", "English"],
    "India": ["INR", "Indian rupee", "Hindi, English and regional languages (Malayalam in Kerala)"], "Sri Lanka": ["LKR", "Sri Lankan rupee", "Sinhala and Tamil (English common)"],
    "Singapore": ["SGD", "Singapore dollar", "English, Malay, Mandarin and Tamil"], "Thailand": ["THB", "Thai baht", "Thai"], "Malaysia": ["MYR", "Malaysian ringgit", "Malay (English common)"],
    "China": ["CNY", "Chinese yuan (HKD in Hong Kong, MOP in Macau)", "Mandarin (Cantonese in Hong Kong)"], "Japan": ["JPY", "Japanese yen", "Japanese"], "South Korea": ["KRW", "South Korean won", "Korean"],
    "Australia": ["AUD", "Australian dollar", "English"], "New Zealand": ["NZD", "New Zealand dollar", "English and Māori"], "Indonesia": ["IDR", "Indonesian rupiah", "Indonesian (Balinese in Bali)"],
    "Maldives": ["MVR", "Maldivian rufiyaa (US dollars accepted at resorts)", "Dhivehi (English at resorts)"], "Oman": ["OMR", "Omani rial", "Arabic"], "Bahrain": ["BHD", "Bahraini dinar", "Arabic"],
    "Kuwait": ["KWD", "Kuwaiti dinar", "Arabic"], "Saudi Arabia": ["SAR", "Saudi riyal", "Arabic"], "Jordan": ["JOD", "Jordanian dinar", "Arabic"], "Israel": ["ILS", "Israeli shekel", "Hebrew and Arabic"],
    "Lebanon": ["LBP", "Lebanese pound (US dollars widely used)", "Arabic, French and English"], "Azerbaijan": ["AZN", "Azerbaijani manat", "Azerbaijani"], "Uzbekistan": ["UZS", "Uzbek som", "Uzbek and Russian"],
    "Kazakhstan": ["KZT", "Kazakh tenge", "Kazakh and Russian"], "Nepal": ["NPR", "Nepalese rupee", "Nepali"], "Bangladesh": ["BDT", "Bangladeshi taka", "Bengali"], "Pakistan": ["PKR", "Pakistani rupee", "Urdu and English"],
    "Philippines": ["PHP", "Philippine peso", "Filipino and English"], "Vietnam": ["VND", "Vietnamese dong", "Vietnamese"], "Cambodia": ["KHR", "Cambodian riel (US dollars widely used)", "Khmer"],
    "Myanmar": ["MMK", "Myanmar kyat", "Burmese"], "Taiwan": ["TWD", "New Taiwan dollar", "Mandarin"], "Mongolia": ["MNT", "Mongolian tögrög", "Mongolian"],
    "Switzerland": ["CHF", "Swiss franc", "German, French and Italian"], "Austria": ["EUR", "euro", "German"], "Portugal": ["EUR", "euro", "Portuguese"], "Ireland": ["EUR", "euro", "English and Irish"],
    "Denmark": ["DKK", "Danish krone", "Danish"], "Sweden": ["SEK", "Swedish krona", "Swedish"], "Norway": ["NOK", "Norwegian krone", "Norwegian"], "Finland": ["EUR", "euro", "Finnish and Swedish"],
    "Iceland": ["ISK", "Icelandic króna", "Icelandic"], "Belgium": ["EUR", "euro", "Dutch, French and German"], "Czechia": ["CZK", "Czech koruna", "Czech"], "Poland": ["PLN", "Polish złoty", "Polish"],
    "Hungary": ["HUF", "Hungarian forint", "Hungarian"], "Romania": ["RON", "Romanian leu", "Romanian"], "Greece": ["EUR", "euro", "Greek"], "Malta": ["EUR", "euro", "Maltese and English"],
    "Cyprus": ["EUR", "euro", "Greek and Turkish"], "Georgia": ["GEL", "Georgian lari", "Georgian"], "Russia": ["RUB", "Russian ruble", "Russian"], "Ethiopia": ["ETB", "Ethiopian birr", "Amharic"],
    "Tanzania": ["TZS", "Tanzanian shilling", "Swahili and English"], "Morocco": ["MAD", "Moroccan dirham", "Arabic, Berber and French"], "Tunisia": ["TND", "Tunisian dinar", "Arabic and French"],
    "Algeria": ["DZD", "Algerian dinar", "Arabic and French"], "Ghana": ["GHS", "Ghanaian cedi", "English"], "Senegal": ["XOF", "West African CFA franc", "French and Wolof"],
    "Uganda": ["UGX", "Ugandan shilling", "English and Swahili"], "Rwanda": ["RWF", "Rwandan franc", "Kinyarwanda, English and French"], "Angola": ["AOA", "Angolan kwanza", "Portuguese"],
    "Mauritius": ["MUR", "Mauritian rupee", "English, French and Mauritian Creole"], "Seychelles": ["SCR", "Seychellois rupee", "Seychellois Creole, English and French"],
    "Puerto Rico": ["USD", "US dollar", "Spanish and English"], "Bahamas": ["BSD", "Bahamian dollar (US dollars accepted)", "English"], "Jamaica": ["JMD", "Jamaican dollar", "English"],
    "Panama": ["PAB", "Panamanian balboa and US dollar", "Spanish"], "Costa Rica": ["CRC", "Costa Rican colón", "Spanish"], "Cuba": ["CUP", "Cuban peso (bring euros or cash)", "Spanish"],
    "Peru": ["PEN", "Peruvian sol", "Spanish and Quechua"], "Chile": ["CLP", "Chilean peso", "Spanish"], "Ecuador": ["USD", "US dollar", "Spanish"], "Venezuela": ["VES", "bolívar (US dollars widely used)", "Spanish"],
    "Uruguay": ["UYU", "Uruguayan peso", "Spanish"], "Bolivia": ["BOB", "boliviano", "Spanish"], "Fiji": ["FJD", "Fijian dollar", "English, Fijian and Hindi"], "French Polynesia": ["XPF", "CFP franc", "French and Tahitian"]
  };
  // Names people type for a country or place, mapped to its main airport.
  var ALIAS = {
    "uk": "LHR", "u.k.": "LHR", "england": "LHR", "britain": "LHR", "great britain": "LHR", "scotland": "EDI", "ireland": "DUB",
    "usa": "JFK", "us": "JFK", "u.s.": "JFK", "america": "JFK", "united states": "JFK", "new york city": "JFK", "nyc": "JFK", "hawaii": "HNL", "florida": "MIA", "california": "LAX",
    "uae": "DXB", "emirates": "DXB", "korea": "ICN", "south korea": "ICN", "holland": "AMS", "turkey": "IST", "turkiye": "IST", "czech": "PRG", "czech republic": "PRG",
    "japan": "NRT", "france": "CDG", "italy": "FCO", "spain": "BCN", "germany": "BER", "switzerland": "ZRH", "swiss": "ZRH", "austria": "VIE", "greece": "ATH", "portugal": "LIS",
    "egypt": "CAI", "morocco": "RAK", "kenya": "NBO", "tanzania": "ZNZ", "south africa": "CPT", "mauritius": "MRU", "seychelles": "SEZ", "zanzibar": "ZNZ",
    "thailand": "BKK", "vietnam": "HAN", "malaysia": "KUL", "indonesia": "DPS", "bali": "DPS", "philippines": "MNL", "cambodia": "PNH", "singapore": "SIN", "maldives": "MLE",
    "sri lanka": "CMB", "nepal": "KTM", "india": "DEL", "kerala": "COK", "goa": "GOI", "rajasthan": "JAI", "kashmir": "ISB", "china": "PEK", "taiwan": "TPE", "hong kong": "HKG",
    "australia": "SYD", "new zealand": "AKL", "fiji": "NAN", "tahiti": "PPT", "canada": "YYZ", "mexico": "CUN", "brazil": "GIG", "peru": "CUZ", "machu picchu": "CUZ", "argentina": "EZE",
    "cuba": "HAV", "jamaica": "MBJ", "bahamas": "NAS", "colombia": "CTG", "chile": "SCL", "iceland": "KEF", "norway": "OSL", "sweden": "ARN", "denmark": "CPH", "finland": "HEL",
    "belgium": "BRU", "poland": "WAW", "hungary": "BUD", "cyprus": "LCA", "malta": "MLA", "georgia": "TBS", "azerbaijan": "GYD", "jordan": "AMM", "petra": "AMM", "oman": "MCT",
    "qatar": "DOH", "saudi": "RUH", "saudi arabia": "RUH", "bahrain": "BAH", "kuwait": "KWI", "lebanon": "BEY", "uzbekistan": "TAS", "kazakhstan": "ALA", "pakistan": "LHE",
    "bangladesh": "DAC", "mongolia": "ULN", "myanmar": "RGN", "russia": "SVO", "ethiopia": "ADD", "rwanda": "KGL", "uganda": "EBB", "ghana": "ACC", "senegal": "DKR", "tunisia": "TUN",
    "phuket": "HKT", "langkawi": "LGK", "cebu": "CEB", "kyoto": "KIX", "osaka": "KIX", "mecca": "JED", "makkah": "JED", "medina": "JED", "munnar": "COK", "alleppey": "COK", "trivandrum": "TRV",
    "calicut": "CCJ", "bombay": "BOM", "madras": "MAA", "calcutta": "CCU", "bangalore": "BLR", "saigon": "SGN", "rome": "FCO", "venice": "VCE", "milan": "MXP", "nice": "NCE", "monaco": "NCE"
  };
  // Regions: name, the season key, and a classic multi-city route for longer trips.
  var REGIONS = [
    [/\beurope\b|\beuropean\b/, "Europe", "europe", ["CDG", "FCO", "BCN"]],
    [/scandinavia|nordic/, "Scandinavia", "europe", ["CPH", "ARN", "OSL"]],
    [/south.?east asia|\bsea\b(?! view)|indochina/, "Southeast Asia", "sea", ["BKK", "HKT", "SIN"]],
    [/east asia|japan and korea|korea and japan/, "East Asia", "eastasia", ["NRT", "KIX", "ICN"]],
    [/\basia\b/, "Asia", "sea", ["BKK", "SIN", "DPS"]],
    [/middle east|\bgulf\b|arabia/, "the Middle East", "gulf", ["MCT", "AMM", "DOH"]],
    [/\bafrica\b/, "Africa", "africa", ["NBO", "ZNZ", "CPT"]],
    [/north africa|maghreb/, "North Africa", "egypt", ["CAI", "RAK"]],
    [/south america|latin america/, "South America", "latam", ["GIG", "EZE", "CUZ"]],
    [/caribbean/, "the Caribbean", "islands", ["CUN", "HAV", "MBJ"]],
    [/north america|\bthe states\b|usa road trip/, "North America", "na", ["JFK", "LAS", "LAX"]],
    [/oceania|down under/, "Australia and New Zealand", "oceania", ["SYD", "MEL", "AKL"]],
    [/south india/, "South India", "india", ["COK", "TRV", "MAA"]],
    [/north india|golden triangle/, "North India", "india", ["DEL", "JAI"]],
    [/italy tour|italia/, "Italy", "europe", ["FCO", "VCE", "MXP"]],
    [/balkans|eastern europe|central europe/, "Central Europe", "europe", ["PRG", "VIE", "BUD"]]
  ];
  // Commonly ranked among the safest countries (Global Peace Index top tier, recent years).
  var SAFE = ["Iceland", "Ireland", "Austria", "New Zealand", "Singapore", "Switzerland", "Portugal", "Denmark", "Japan", "Slovenia"];
  root.LeoFacts = { TAGS: TAGS, COUNTRY: COUNTRY, ALIAS: ALIAS, REGIONS: REGIONS, SAFE: SAFE };
})(window);
