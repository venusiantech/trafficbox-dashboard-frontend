// Country coordinates for map markers (approximate center/capital locations)
// Coordinates format: [longitude, latitude]
export const countryCoordinates: Record<string, [number, number]> = {
  // North America
  US: [-95.7129, 37.0902],
  CA: [-106.3468, 56.1304],
  MX: [-102.5528, 23.6345],
  
  // Central America & Caribbean
  GT: [-90.2308, 15.7835],
  BZ: [-88.4976, 17.1899],
  SV: [-88.8965, 13.7942],
  HN: [-86.2419, 15.2000],
  NI: [-85.2072, 12.8654],
  CR: [-83.7534, 9.7489],
  PA: [-80.7821, 8.5380],
  CU: [-77.7812, 21.5218],
  JM: [-77.2975, 18.1096],
  HT: [-72.2852, 18.9712],
  DO: [-70.1627, 18.7357],
  PR: [-66.5901, 18.2208],
  TT: [-61.2225, 10.6918],
  
  // South America
  BR: [-51.9253, -14.2350],
  AR: [-63.6167, -38.4161],
  CL: [-71.5430, -35.6751],
  CO: [-74.2973, 4.5709],
  PE: [-75.0152, -9.1900],
  VE: [-66.5897, 6.4238],
  EC: [-78.1834, -1.8312],
  BO: [-63.5887, -16.2902],
  PY: [-58.4438, -23.4425],
  UY: [-55.7658, -32.5228],
  GY: [-58.9302, 4.8604],
  SR: [-56.0278, 3.9193],
  
  // Europe - Western
  GB: [-3.4360, 55.3781],
  IE: [-8.2439, 53.4129],
  FR: [2.2137, 46.2276],
  ES: [-3.7492, 40.4637],
  PT: [-8.2245, 39.3999],
  IT: [12.5674, 41.8719],
  DE: [10.4515, 51.1657],
  NL: [5.2913, 52.1326],
  BE: [4.4699, 50.5039],
  LU: [6.1296, 49.8153],
  CH: [8.2275, 46.8182],
  AT: [14.5501, 47.5162],
  
  // Europe - Northern
  NO: [8.4689, 60.4720],
  SE: [18.6435, 60.1282],
  FI: [25.7482, 61.9241],
  DK: [9.5018, 56.2639],
  IS: [-19.0208, 64.9631],
  
  // Europe - Eastern
  PL: [19.1451, 51.9194],
  CZ: [15.4730, 49.8175],
  SK: [19.6990, 48.6690],
  HU: [19.5033, 47.1625],
  RO: [24.9668, 45.9432],
  BG: [25.4858, 42.7339],
  RU: [105.3188, 61.5240],
  UA: [31.1656, 48.3794],
  BY: [27.9534, 53.7098],
  
  // Europe - Southern
  GR: [21.8243, 39.0742],
  AL: [20.1683, 41.1533],
  RS: [21.0059, 44.0165],
  HR: [15.2000, 45.1000],
  SI: [14.9955, 46.1512],
  BA: [17.6791, 43.9159],
  ME: [19.3744, 42.7087],
  MK: [21.7453, 41.6086],
  
  // Middle East
  AE: [53.8478, 23.4241],
  SA: [45.0792, 23.8859],
  QA: [51.1839, 25.3548],
  KW: [47.4818, 29.3117],
  BH: [50.5577, 26.0667],
  OM: [55.9233, 21.4735],
  YE: [48.5164, 15.5527],
  IQ: [43.6793, 33.2232],
  IL: [34.8516, 31.0461],
  JO: [36.2384, 30.5852],
  LB: [35.8623, 33.8547],
  SY: [38.9968, 34.8021],
  TR: [35.2433, 38.9637],
  IR: [53.6880, 32.4279],
  
  // Africa - Northern
  EG: [30.8025, 26.8206],
  LY: [17.2283, 26.3351],
  TN: [9.5375, 33.8869],
  DZ: [1.6596, 28.0339],
  MA: [-7.0926, 31.7917],
  SD: [30.2176, 12.8628],
  
  // Africa - Western
  NG: [8.6753, 9.0820],
  GH: [-1.0232, 7.9465],
  SN: [-14.4524, 14.4974],
  CI: [-5.5471, 7.5400],
  ML: [-3.9962, 17.5707],
  BF: [-1.5616, 12.2383],
  NE: [8.0817, 17.6078],
  TG: [0.8248, 8.6195],
  BJ: [2.3158, 9.3077],
  GM: [-15.3101, 13.4432],
  GN: [-9.6966, 9.9456],
  SL: [-11.7799, 8.4606],
  LR: [-9.4295, 6.4281],
  
  // Africa - Eastern
  KE: [37.9062, -0.0236],
  TZ: [34.8888, -6.3690],
  UG: [32.2903, 1.3733],
  ET: [40.4897, 9.1450],
  SO: [46.1996, 5.1521],
  RW: [29.8739, -1.9403],
  BI: [29.9189, -3.3731],
  
  // Africa - Southern
  ZA: [22.9375, -30.5595],
  ZW: [29.1549, -19.0154],
  ZM: [27.8493, -13.1339],
  MW: [34.3015, -13.2543],
  MZ: [35.5296, -18.6657],
  BW: [24.6849, -22.3285],
  NA: [18.4904, -22.9576],
  AO: [17.8739, -11.2027],
  
  // Asia - South
  IN: [78.9629, 20.5937],
  PK: [69.3451, 30.3753],
  BD: [90.3563, 23.6850],
  LK: [80.7718, 7.8731],
  NP: [84.1240, 28.3949],
  BT: [90.4336, 27.5142],
  MV: [73.2207, 3.2028],
  AF: [67.7099, 33.9391],
  
  // Asia - Southeast
  TH: [100.9925, 15.8700],
  VN: [108.2772, 14.0583],
  MY: [101.9758, 4.2105],
  SG: [103.8198, 1.3521],
  ID: [113.9213, -0.7893],
  PH: [121.7740, 12.8797],
  MM: [95.9560, 21.9162],
  KH: [104.9910, 12.5657],
  LA: [102.4955, 19.8563],
  BN: [114.7277, 4.5353],
  
  // Asia - East
  CN: [104.1954, 35.8617],
  JP: [138.2529, 36.2048],
  KR: [127.7669, 35.9078],
  KP: [127.5101, 40.3399],
  MN: [103.8467, 46.8625],
  TW: [120.9605, 23.6978],
  HK: [114.1095, 22.3193],
  
  // Asia - Central
  KZ: [66.9237, 48.0196],
  UZ: [64.5853, 41.3775],
  TM: [59.5563, 38.9697],
  KG: [74.7661, 41.2044],
  TJ: [71.2761, 38.8610],
  
  // Oceania
  AU: [133.7751, -25.2744],
  NZ: [174.8860, -40.9006],
  PG: [143.9555, -6.3150],
  FJ: [179.4144, -17.7134],
  NC: [165.6180, -20.9043],
  PF: [-149.4068, -17.6797],
  VU: [166.9592, -15.3767],
  WS: [-172.1046, -13.7590],
  
  // Other territories
  GL: [-42.6043, 71.7069],
  VA: [12.4534, 41.9029],
};

// Country names mapping (ISO 2-letter code to full name)
export const countryNames: Record<string, string> = {
  // North America
  US: "United States",
  CA: "Canada",
  MX: "Mexico",
  
  // Central America & Caribbean
  GT: "Guatemala",
  BZ: "Belize",
  SV: "El Salvador",
  HN: "Honduras",
  NI: "Nicaragua",
  CR: "Costa Rica",
  PA: "Panama",
  CU: "Cuba",
  JM: "Jamaica",
  HT: "Haiti",
  DO: "Dominican Republic",
  PR: "Puerto Rico",
  TT: "Trinidad and Tobago",
  
  // South America
  BR: "Brazil",
  AR: "Argentina",
  CL: "Chile",
  CO: "Colombia",
  PE: "Peru",
  VE: "Venezuela",
  EC: "Ecuador",
  BO: "Bolivia",
  PY: "Paraguay",
  UY: "Uruguay",
  GY: "Guyana",
  SR: "Suriname",
  
  // Europe - Western
  GB: "United Kingdom",
  IE: "Ireland",
  FR: "France",
  ES: "Spain",
  PT: "Portugal",
  IT: "Italy",
  DE: "Germany",
  NL: "Netherlands",
  BE: "Belgium",
  LU: "Luxembourg",
  CH: "Switzerland",
  AT: "Austria",
  
  // Europe - Northern
  NO: "Norway",
  SE: "Sweden",
  FI: "Finland",
  DK: "Denmark",
  IS: "Iceland",
  
  // Europe - Eastern
  PL: "Poland",
  CZ: "Czech Republic",
  SK: "Slovakia",
  HU: "Hungary",
  RO: "Romania",
  BG: "Bulgaria",
  RU: "Russia",
  UA: "Ukraine",
  BY: "Belarus",
  
  // Europe - Southern
  GR: "Greece",
  AL: "Albania",
  RS: "Serbia",
  HR: "Croatia",
  SI: "Slovenia",
  BA: "Bosnia and Herzegovina",
  ME: "Montenegro",
  MK: "North Macedonia",
  
  // Middle East
  AE: "United Arab Emirates",
  SA: "Saudi Arabia",
  QA: "Qatar",
  KW: "Kuwait",
  BH: "Bahrain",
  OM: "Oman",
  YE: "Yemen",
  IQ: "Iraq",
  IL: "Israel",
  JO: "Jordan",
  LB: "Lebanon",
  SY: "Syria",
  TR: "Turkey",
  IR: "Iran",
  
  // Africa - Northern
  EG: "Egypt",
  LY: "Libya",
  TN: "Tunisia",
  DZ: "Algeria",
  MA: "Morocco",
  SD: "Sudan",
  
  // Africa - Western
  NG: "Nigeria",
  GH: "Ghana",
  SN: "Senegal",
  CI: "Côte d'Ivoire",
  ML: "Mali",
  BF: "Burkina Faso",
  NE: "Niger",
  TG: "Togo",
  BJ: "Benin",
  GM: "Gambia",
  GN: "Guinea",
  SL: "Sierra Leone",
  LR: "Liberia",
  
  // Africa - Eastern
  KE: "Kenya",
  TZ: "Tanzania",
  UG: "Uganda",
  ET: "Ethiopia",
  SO: "Somalia",
  RW: "Rwanda",
  BI: "Burundi",
  
  // Africa - Southern
  ZA: "South Africa",
  ZW: "Zimbabwe",
  ZM: "Zambia",
  MW: "Malawi",
  MZ: "Mozambique",
  BW: "Botswana",
  NA: "Namibia",
  AO: "Angola",
  
  // Asia - South
  IN: "India",
  PK: "Pakistan",
  BD: "Bangladesh",
  LK: "Sri Lanka",
  NP: "Nepal",
  BT: "Bhutan",
  MV: "Maldives",
  AF: "Afghanistan",
  
  // Asia - Southeast
  TH: "Thailand",
  VN: "Vietnam",
  MY: "Malaysia",
  SG: "Singapore",
  ID: "Indonesia",
  PH: "Philippines",
  MM: "Myanmar",
  KH: "Cambodia",
  LA: "Laos",
  BN: "Brunei",
  
  // Asia - East
  CN: "China",
  JP: "Japan",
  KR: "South Korea",
  KP: "North Korea",
  MN: "Mongolia",
  TW: "Taiwan",
  HK: "Hong Kong",
  
  // Asia - Central
  KZ: "Kazakhstan",
  UZ: "Uzbekistan",
  TM: "Turkmenistan",
  KG: "Kyrgyzstan",
  TJ: "Tajikistan",
  
  // Oceania
  AU: "Australia",
  NZ: "New Zealand",
  PG: "Papua New Guinea",
  FJ: "Fiji",
  NC: "New Caledonia",
  PF: "French Polynesia",
  VU: "Vanuatu",
  WS: "Samoa",
  
  // Other territories
  GL: "Greenland",
  VA: "Vatican City",
};

