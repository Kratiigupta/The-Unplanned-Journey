import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { useAuth } from '../context/AuthContext';
import { useExplorer } from '../context/ExplorerContext';
import { FaSearch, FaGlobeAmericas, FaArrowLeft, FaChevronRight } from 'react-icons/fa';
import countries from '../data/countries';
import FlightTransition from '../components/FlightTransition';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Map our country codes to world-atlas ISO numeric codes
const countryCodeToISO = {
  "AW": "533",
  "AF": "004",
  "AO": "024",
  "AI": "660",
  "AX": "248",
  "AL": "008",
  "AD": "020",
  "AE": "784",
  "AR": "032",
  "AM": "051",
  "AS": "016",
  "AQ": "010",
  "TF": "260",
  "AG": "028",
  "AU": "036",
  "AT": "040",
  "AZ": "031",
  "BI": "108",
  "BE": "056",
  "BJ": "204",
  "BF": "854",
  "BD": "050",
  "BG": "100",
  "BH": "048",
  "BS": "044",
  "BA": "070",
  "BL": "652",
  "SH": "654",
  "BY": "112",
  "BZ": "084",
  "BM": "060",
  "BO": "068",
  "BQ": "535",
  "BR": "076",
  "BB": "052",
  "BN": "096",
  "BT": "064",
  "BV": "074",
  "BW": "072",
  "CF": "140",
  "CA": "124",
  "CC": "166",
  "CH": "756",
  "CL": "152",
  "CN": "156",
  "CI": "384",
  "CM": "120",
  "CD": "180",
  "CG": "178",
  "CK": "184",
  "CO": "170",
  "KM": "174",
  "CV": "132",
  "CR": "188",
  "CU": "192",
  "CW": "531",
  "CX": "162",
  "KY": "136",
  "CY": "196",
  "CZ": "203",
  "DE": "276",
  "DJ": "262",
  "DM": "212",
  "DK": "208",
  "DO": "214",
  "DZ": "012",
  "EC": "218",
  "EG": "818",
  "ER": "232",
  "EH": "732",
  "ES": "724",
  "EE": "233",
  "ET": "231",
  "FI": "246",
  "FJ": "242",
  "FK": "238",
  "FR": "250",
  "FO": "234",
  "FM": "583",
  "GA": "266",
  "GB": "826",
  "GE": "268",
  "GG": "831",
  "GH": "288",
  "GI": "292",
  "GN": "324",
  "GP": "312",
  "GM": "270",
  "GW": "624",
  "GQ": "226",
  "GR": "300",
  "GD": "308",
  "GL": "304",
  "GT": "320",
  "GF": "254",
  "GU": "316",
  "GY": "328",
  "HK": "344",
  "HM": "334",
  "HN": "340",
  "HR": "191",
  "HT": "332",
  "HU": "348",
  "ID": "360",
  "IM": "833",
  "IN": "356",
  "IO": "086",
  "IE": "372",
  "IR": "364",
  "IQ": "368",
  "IS": "352",
  "IL": "376",
  "IT": "380",
  "JM": "388",
  "JE": "832",
  "JO": "400",
  "JP": "392",
  "KZ": "398",
  "KE": "404",
  "KG": "417",
  "KH": "116",
  "KI": "296",
  "KN": "659",
  "KR": "410",
  "KW": "414",
  "LA": "418",
  "LB": "422",
  "LR": "430",
  "LY": "434",
  "LC": "662",
  "LI": "438",
  "LK": "144",
  "LS": "426",
  "LT": "440",
  "LU": "442",
  "LV": "428",
  "MO": "446",
  "MF": "663",
  "MA": "504",
  "MC": "492",
  "MD": "498",
  "MG": "450",
  "MV": "462",
  "MX": "484",
  "MH": "584",
  "MK": "807",
  "ML": "466",
  "MT": "470",
  "MM": "104",
  "ME": "499",
  "MN": "496",
  "MP": "580",
  "MZ": "508",
  "MR": "478",
  "MS": "500",
  "MQ": "474",
  "MU": "480",
  "MW": "454",
  "MY": "458",
  "YT": "175",
  "NA": "516",
  "NC": "540",
  "NE": "562",
  "NF": "574",
  "NG": "566",
  "NI": "558",
  "NU": "570",
  "NL": "528",
  "NO": "578",
  "NP": "524",
  "NR": "520",
  "NZ": "554",
  "OM": "512",
  "PK": "586",
  "PA": "591",
  "PN": "612",
  "PE": "604",
  "PH": "608",
  "PW": "585",
  "PG": "598",
  "PL": "616",
  "PR": "630",
  "KP": "408",
  "PT": "620",
  "PY": "600",
  "PS": "275",
  "PF": "258",
  "QA": "634",
  "RE": "638",
  "RO": "642",
  "RU": "643",
  "RW": "646",
  "SA": "682",
  "SD": "729",
  "SN": "686",
  "SG": "702",
  "GS": "239",
  "SJ": "744",
  "SB": "090",
  "SL": "694",
  "SV": "222",
  "SM": "674",
  "SO": "706",
  "PM": "666",
  "RS": "688",
  "SS": "728",
  "ST": "678",
  "SR": "740",
  "SK": "703",
  "SI": "705",
  "SE": "752",
  "SZ": "748",
  "SX": "534",
  "SC": "690",
  "SY": "760",
  "TC": "796",
  "TD": "148",
  "TG": "768",
  "TH": "764",
  "TJ": "762",
  "TK": "772",
  "TM": "795",
  "TL": "626",
  "TO": "776",
  "TT": "780",
  "TN": "788",
  "TR": "792",
  "TV": "798",
  "TW": "158",
  "TZ": "834",
  "UG": "800",
  "UA": "804",
  "UM": "581",
  "UY": "858",
  "US": "840",
  "UZ": "860",
  "VA": "336",
  "VC": "670",
  "VE": "862",
  "VG": "092",
  "VI": "850",
  "VN": "704",
  "VU": "548",
  "WF": "876",
  "WS": "882",
  "YE": "887",
  "ZA": "710",
  "ZM": "894",
  "ZW": "716"
};

const isoToCountryCode = Object.fromEntries(Object.entries(countryCodeToISO).map(([k, v]) => [v, k]));

const MapPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getProgress, isCountryVisited } = useExplorer();
  const progress = getProgress();
  const [tooltip, setTooltip] = useState(null);
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [transitionCountry, setTransitionCountry] = useState(null);

  const filteredCountries = useMemo(() => {
    if (!search) return countries;
    return countries.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const getCountryFill = (isoCode) => {
    const code = isoToCountryCode[isoCode];
    if (!code) return '#1f2937'; // Not in our list
    if (isCountryVisited(code)) return '#22c55e'; // Visited - green
    if (user?.dreamDestination && countries.find(c => c.code === code)?.name === user.dreamDestination) return '#d4a843'; // Dream - gold
    return '#374151'; // Unvisited
  };

  const isOurCountry = (isoCode) => isoToCountryCode[isoCode] !== undefined;

  return (
    <div className="min-h-screen bg-bgPrimary flex relative overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="w-80 bg-[#0d0d20] border-r border-borderColor flex flex-col h-screen sticky top-0 z-20"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'spring', damping: 25 }}
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-borderColor">
              <button onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-textSecondary hover:text-white/80 text-sm mb-4 transition-colors">
                <FaArrowLeft /> Back to Dashboard
              </button>
              <h2 className="font-display text-xl font-bold text-textPrimary flex items-center gap-2">
                <FaGlobeAmericas className="text-ocean-400" /> World Map
              </h2>
              {/* Progress */}
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-textSecondary">Explored</span>
                  <span className="text-ocean-400 font-semibold">{progress.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-bgSecondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-ocean-500 to-forest-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress.percentage}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
                <p className="text-textSecondary text-xs mt-1">{progress.visited}/{progress.total} countries</p>
              </div>
            </div>

            {/* Search */}
            <div className="p-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-bgSecondary border border-borderColor text-textPrimary text-sm placeholder-white/30 focus:border-ocean-500 focus:outline-none transition-all"
                  placeholder="Search countries..." />
              </div>
            </div>

            {/* Country List */}
            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1">
              {filteredCountries.map(country => {
                const visited = isCountryVisited(country.code);
                return (
                  <motion.button
                    key={country.code}
                    onClick={() => setTransitionCountry({ name: country.name, code: country.code })}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                      visited
                        ? 'bg-forest-500/10 border border-forest-500/20'
                        : 'hover:bg-bgSecondary border border-transparent'
                    }`}
                    whileHover={{ x: 4 }}
                  >
                    <span className="text-xl">{country.flag}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm truncate ${visited ? 'text-forest-300' : 'text-white/80'}`}>
                        {country.name}
                      </p>
                      <p className="text-textSecondary text-xs">{country.continent}</p>
                    </div>
                    {visited && <span className="text-forest-400 text-sm">✓</span>}
                    <FaChevronRight className="text-white/20 text-xs" />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Sidebar */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute top-4 left-4 z-30 p-2 rounded-lg bg-bgSecondary text-textSecondary hover:text-textPrimary hover:bg-white/20 transition-all md:hidden"
      >
        ☰
      </button>

      {/* Map Area */}
      <div className="flex-1 relative">
        {/* Tooltip */}
        <AnimatePresence>
          {tooltip && (
            <motion.div
              className="fixed z-50 glass-card px-4 py-3 pointer-events-none"
              style={{ left: tooltip.x + 10, top: tooltip.y - 10 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{tooltip.flag}</span>
                <div>
                  <p className="text-textPrimary font-display font-semibold text-sm">{tooltip.name}</p>
                  <p className={`text-xs ${tooltip.visited ? 'text-forest-400' : 'text-textSecondary'}`}>
                    {tooltip.visited ? '✓ Explored' : 'Click to explore'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legend */}
        <div className="absolute top-4 right-4 z-20 glass-card p-3">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-forest-500" />
              <span className="text-textSecondary">Visited</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-gray-600" />
              <span className="text-textSecondary">Unvisited</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-passport-gold" />
              <span className="text-textSecondary">Dream</span>
            </div>
          </div>
        </div>

        <ComposableMap
          projectionConfig={{ rotate: [-10, 0, 0], scale: 160 }}
          className="w-full h-screen"
          style={{ background: 'transparent' }}
        >
          <ZoomableGroup zoom={1} minZoom={1} maxZoom={8}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const isoCode = geo.id;
                  const ourCountry = isOurCountry(isoCode);
                  const countryData = ourCountry ? countries.find(c => c.code === isoToCountryCode[isoCode]) : null;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={getCountryFill(isoCode)}
                      stroke="rgba(255,255,255,0.15)"
                      strokeWidth={0.5}
                      className={ourCountry ? 'cursor-pointer' : ''}
                      onClick={() => {
                        if (ourCountry && countryData) {
                          setTransitionCountry({ name: countryData.name, code: countryData.code });
                        }
                      }}
                      onMouseEnter={(e) => {
                        if (ourCountry && countryData) {
                          setTooltip({
                            name: countryData.name,
                            flag: countryData.flag,
                            visited: isCountryVisited(countryData.code),
                            x: e.clientX,
                            y: e.clientY,
                          });
                        }
                      }}
                      onMouseMove={(e) => {
                        if (tooltip) {
                          setTooltip(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null);
                        }
                      }}
                      onMouseLeave={() => setTooltip(null)}
                      style={{
                        default: { outline: 'none' },
                        hover: { fill: ourCountry ? '#4ade80' : '#1f2937', outline: 'none', strokeWidth: ourCountry ? 1.5 : 0.5 },
                        pressed: { fill: '#22c55e', outline: 'none' },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {/* Flight Transition Overlay */}
      {transitionCountry && (
        <FlightTransition 
          destinationCode={transitionCountry.name} 
          onComplete={() => navigate(`/country/${transitionCountry.code}`)} 
        />
      )}
    </div>
  );
};

export default MapPage;
