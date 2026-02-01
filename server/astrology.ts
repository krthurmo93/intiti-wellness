import circularNatalHoroscope from "circular-natal-horoscope-js";
const { Origin, Horoscope } = circularNatalHoroscope;

export type ZodiacSign = 
  | "Aries" | "Taurus" | "Gemini" | "Cancer" | "Leo" | "Virgo"
  | "Libra" | "Scorpio" | "Sagittarius" | "Capricorn" | "Aquarius" | "Pisces";

const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "new york": { lat: 40.7128, lng: -74.0060 },
  "los angeles": { lat: 34.0522, lng: -118.2437 },
  "chicago": { lat: 41.8781, lng: -87.6298 },
  "houston": { lat: 29.7604, lng: -95.3698 },
  "phoenix": { lat: 33.4484, lng: -112.0740 },
  "philadelphia": { lat: 39.9526, lng: -75.1652 },
  "san antonio": { lat: 29.4241, lng: -98.4936 },
  "san diego": { lat: 32.7157, lng: -117.1611 },
  "dallas": { lat: 32.7767, lng: -96.7970 },
  "san jose": { lat: 37.3382, lng: -121.8863 },
  "austin": { lat: 30.2672, lng: -97.7431 },
  "jacksonville": { lat: 30.3322, lng: -81.6557 },
  "san francisco": { lat: 37.7749, lng: -122.4194 },
  "columbus": { lat: 39.9612, lng: -82.9988 },
  "charlotte": { lat: 35.2271, lng: -80.8431 },
  "indianapolis": { lat: 39.7684, lng: -86.1581 },
  "seattle": { lat: 47.6062, lng: -122.3321 },
  "denver": { lat: 39.7392, lng: -104.9903 },
  "washington": { lat: 38.9072, lng: -77.0369 },
  "boston": { lat: 42.3601, lng: -71.0589 },
  "nashville": { lat: 36.1627, lng: -86.7816 },
  "detroit": { lat: 42.3314, lng: -83.0458 },
  "portland": { lat: 45.5051, lng: -122.6750 },
  "memphis": { lat: 35.1495, lng: -90.0490 },
  "oklahoma city": { lat: 35.4676, lng: -97.5164 },
  "las vegas": { lat: 36.1699, lng: -115.1398 },
  "baltimore": { lat: 39.2904, lng: -76.6122 },
  "milwaukee": { lat: 43.0389, lng: -87.9065 },
  "albuquerque": { lat: 35.0844, lng: -106.6504 },
  "tucson": { lat: 32.2226, lng: -110.9747 },
  "fresno": { lat: 36.7378, lng: -119.7871 },
  "sacramento": { lat: 38.5816, lng: -121.4944 },
  "kansas city": { lat: 39.0997, lng: -94.5786 },
  "atlanta": { lat: 33.7490, lng: -84.3880 },
  "miami": { lat: 25.7617, lng: -80.1918 },
  "cleveland": { lat: 41.4993, lng: -81.6944 },
  "pittsburgh": { lat: 40.4406, lng: -79.9959 },
  "new orleans": { lat: 29.9511, lng: -90.0715 },
  "tampa": { lat: 27.9506, lng: -82.4572 },
  "minneapolis": { lat: 44.9778, lng: -93.2650 },
  "st louis": { lat: 38.6270, lng: -90.1994 },
  "cincinnati": { lat: 39.1031, lng: -84.5120 },
  "orlando": { lat: 28.5383, lng: -81.3792 },
  "salt lake city": { lat: 40.7608, lng: -111.8910 },
  "richmond": { lat: 37.5407, lng: -77.4360 },
  "san juan": { lat: 18.4655, lng: -66.1057 },
  "honolulu": { lat: 21.3069, lng: -157.8583 },
  "augusta": { lat: 33.4735, lng: -82.0105 },
  "savannah": { lat: 32.0809, lng: -81.0912 },
  "birmingham": { lat: 33.5207, lng: -86.8025 },
  "louisville": { lat: 38.2527, lng: -85.7585 },
  "buffalo": { lat: 42.8864, lng: -78.8784 },
  "raleigh": { lat: 35.7796, lng: -78.6382 },
  "hartford": { lat: 41.7658, lng: -72.6734 },
  "providence": { lat: 41.8240, lng: -71.4128 },
  "des moines": { lat: 41.5868, lng: -93.6250 },
  "boise": { lat: 43.6150, lng: -116.2023 },
  "omaha": { lat: 41.2565, lng: -95.9345 },
  "anchorage": { lat: 61.2181, lng: -149.9003 },
  
  "london": { lat: 51.5074, lng: -0.1278 },
  "paris": { lat: 48.8566, lng: 2.3522 },
  "berlin": { lat: 52.5200, lng: 13.4050 },
  "madrid": { lat: 40.4168, lng: -3.7038 },
  "rome": { lat: 41.9028, lng: 12.4964 },
  "amsterdam": { lat: 52.3676, lng: 4.9041 },
  "vienna": { lat: 48.2082, lng: 16.3738 },
  "dublin": { lat: 53.3498, lng: -6.2603 },
  "brussels": { lat: 50.8503, lng: 4.3517 },
  "lisbon": { lat: 38.7223, lng: -9.1393 },
  "barcelona": { lat: 41.3851, lng: 2.1734 },
  "milan": { lat: 45.4642, lng: 9.1900 },
  "munich": { lat: 48.1351, lng: 11.5820 },
  "stockholm": { lat: 59.3293, lng: 18.0686 },
  "oslo": { lat: 59.9139, lng: 10.7522 },
  "copenhagen": { lat: 55.6761, lng: 12.5683 },
  "helsinki": { lat: 60.1699, lng: 24.9384 },
  "warsaw": { lat: 52.2297, lng: 21.0122 },
  "prague": { lat: 50.0755, lng: 14.4378 },
  "budapest": { lat: 47.4979, lng: 19.0402 },
  "athens": { lat: 37.9838, lng: 23.7275 },
  "istanbul": { lat: 41.0082, lng: 28.9784 },
  "moscow": { lat: 55.7558, lng: 37.6173 },
  "st petersburg": { lat: 59.9343, lng: 30.3351 },
  "edinburgh": { lat: 55.9533, lng: -3.1883 },
  "manchester": { lat: 53.4808, lng: -2.2426 },
  "glasgow": { lat: 55.8642, lng: -4.2518 },
  "zurich": { lat: 47.3769, lng: 8.5417 },
  "geneva": { lat: 46.2044, lng: 6.1432 },
  
  "tokyo": { lat: 35.6762, lng: 139.6503 },
  "beijing": { lat: 39.9042, lng: 116.4074 },
  "shanghai": { lat: 31.2304, lng: 121.4737 },
  "hong kong": { lat: 22.3193, lng: 114.1694 },
  "singapore": { lat: 1.3521, lng: 103.8198 },
  "seoul": { lat: 37.5665, lng: 126.9780 },
  "taipei": { lat: 25.0330, lng: 121.5654 },
  "bangkok": { lat: 13.7563, lng: 100.5018 },
  "mumbai": { lat: 19.0760, lng: 72.8777 },
  "delhi": { lat: 28.7041, lng: 77.1025 },
  "bangalore": { lat: 12.9716, lng: 77.5946 },
  "chennai": { lat: 13.0827, lng: 80.2707 },
  "kolkata": { lat: 22.5726, lng: 88.3639 },
  "hyderabad": { lat: 17.3850, lng: 78.4867 },
  "jakarta": { lat: -6.2088, lng: 106.8456 },
  "manila": { lat: 14.5995, lng: 120.9842 },
  "kuala lumpur": { lat: 3.1390, lng: 101.6869 },
  "ho chi minh": { lat: 10.8231, lng: 106.6297 },
  "hanoi": { lat: 21.0285, lng: 105.8542 },
  "osaka": { lat: 34.6937, lng: 135.5023 },
  "kyoto": { lat: 35.0116, lng: 135.7681 },
  
  "sydney": { lat: -33.8688, lng: 151.2093 },
  "melbourne": { lat: -37.8136, lng: 144.9631 },
  "brisbane": { lat: -27.4705, lng: 153.0260 },
  "perth": { lat: -31.9505, lng: 115.8605 },
  "auckland": { lat: -36.8509, lng: 174.7645 },
  "wellington": { lat: -41.2866, lng: 174.7756 },
  
  "toronto": { lat: 43.6532, lng: -79.3832 },
  "vancouver": { lat: 49.2827, lng: -123.1207 },
  "montreal": { lat: 45.5017, lng: -73.5673 },
  "calgary": { lat: 51.0447, lng: -114.0719 },
  "ottawa": { lat: 45.4215, lng: -75.6972 },
  "edmonton": { lat: 53.5461, lng: -113.4938 },
  
  "mexico city": { lat: 19.4326, lng: -99.1332 },
  "guadalajara": { lat: 20.6597, lng: -103.3496 },
  "monterrey": { lat: 25.6866, lng: -100.3161 },
  "buenos aires": { lat: -34.6037, lng: -58.3816 },
  "sao paulo": { lat: -23.5505, lng: -46.6333 },
  "rio de janeiro": { lat: -22.9068, lng: -43.1729 },
  "lima": { lat: -12.0464, lng: -77.0428 },
  "bogota": { lat: 4.7110, lng: -74.0721 },
  "santiago": { lat: -33.4489, lng: -70.6693 },
  "caracas": { lat: 10.4806, lng: -66.9036 },
  
  "cairo": { lat: 30.0444, lng: 31.2357 },
  "johannesburg": { lat: -26.2041, lng: 28.0473 },
  "cape town": { lat: -33.9249, lng: 18.4241 },
  "lagos": { lat: 6.5244, lng: 3.3792 },
  "nairobi": { lat: -1.2921, lng: 36.8219 },
  "casablanca": { lat: 33.5731, lng: -7.5898 },
  "dubai": { lat: 25.2048, lng: 55.2708 },
  "tel aviv": { lat: 32.0853, lng: 34.7818 },
  "jerusalem": { lat: 31.7683, lng: 35.2137 },
  "riyadh": { lat: 24.7136, lng: 46.6753 },
  
  "georgia": { lat: 33.0, lng: -83.5 },
};

export function getCityCoordinates(cityInput: string): { lat: number; lng: number; matched: boolean; matchedCity?: string } {
  if (!cityInput || !cityInput.trim()) {
    return { lat: 40.7128, lng: -74.0060, matched: false };
  }
  
  const cityLower = cityInput.toLowerCase().trim()
    .replace(/[,\.]/g, ' ')
    .replace(/\s+/g, ' ');
  
  for (const [cityName, coords] of Object.entries(CITY_COORDINATES)) {
    if (cityLower === cityName) {
      return { ...coords, matched: true, matchedCity: cityName };
    }
  }
  
  for (const [cityName, coords] of Object.entries(CITY_COORDINATES)) {
    if (cityLower.includes(cityName)) {
      return { ...coords, matched: true, matchedCity: cityName };
    }
    if (cityLower.length >= 4 && cityName.includes(cityLower)) {
      return { ...coords, matched: true, matchedCity: cityName };
    }
  }
  
  const cityAliases: Record<string, string> = {
    'nyc': 'new york',
    'la': 'los angeles',
    'sf': 'san francisco',
    'dc': 'washington',
    'philly': 'philadelphia',
    'vegas': 'las vegas',
    'nola': 'new orleans',
    'chi': 'chicago',
  };
  
  const allWords = cityLower.split(/\s+/).filter(w => w.length >= 2);
  for (const word of allWords) {
    const aliasCity = cityAliases[word];
    if (aliasCity && CITY_COORDINATES[aliasCity]) {
      return { ...CITY_COORDINATES[aliasCity], matched: true, matchedCity: aliasCity };
    }
  }
  
  const words = cityLower.split(/\s+/).filter(w => w.length > 3);
  for (const word of words) {
    for (const [cityName, coords] of Object.entries(CITY_COORDINATES)) {
      const cityFirstWord = cityName.split(' ')[0];
      if (word === cityFirstWord || (word.length >= 4 && cityFirstWord.startsWith(word)) || (word.length >= 4 && word.startsWith(cityFirstWord))) {
        return { ...coords, matched: true, matchedCity: cityName };
      }
    }
  }
  
  return { lat: 40.7128, lng: -74.0060, matched: false };
}

function normalizeSignLabel(label: string): ZodiacSign {
  const signMap: Record<string, ZodiacSign> = {
    "aries": "Aries",
    "taurus": "Taurus",
    "gemini": "Gemini",
    "cancer": "Cancer",
    "leo": "Leo",
    "virgo": "Virgo",
    "libra": "Libra",
    "scorpio": "Scorpio",
    "sagittarius": "Sagittarius",
    "capricorn": "Capricorn",
    "aquarius": "Aquarius",
    "pisces": "Pisces",
  };
  
  const normalized = label.toLowerCase().trim();
  return signMap[normalized] || "Aries";
}

function getOppositeSign(sign: ZodiacSign): ZodiacSign {
  const opposites: Record<ZodiacSign, ZodiacSign> = {
    "Aries": "Libra",
    "Taurus": "Scorpio",
    "Gemini": "Sagittarius",
    "Cancer": "Capricorn",
    "Leo": "Aquarius",
    "Virgo": "Pisces",
    "Libra": "Aries",
    "Scorpio": "Taurus",
    "Sagittarius": "Gemini",
    "Capricorn": "Cancer",
    "Aquarius": "Leo",
    "Pisces": "Virgo",
  };
  return opposites[sign];
}

export interface BirthChartResult {
  sun: ZodiacSign;
  moon: ZodiacSign;
  rising: ZodiacSign;
  mercury?: ZodiacSign;
  venus?: ZodiacSign;
  mars?: ZodiacSign;
  jupiter?: ZodiacSign;
  saturn?: ZodiacSign;
  northNode?: ZodiacSign;
  southNode?: ZodiacSign;
  coordinates: { lat: number; lng: number };
  locationMatched: boolean;
  matchedCity?: string;
}

export function calculateBirthChart(
  dateOfBirth: string,
  timeOfBirth: string,
  cityOfBirth: string
): BirthChartResult {
  const date = new Date(dateOfBirth + 'T12:00:00');
  const [hours, minutes] = timeOfBirth ? timeOfBirth.split(':').map(Number) : [12, 0];
  const coordsResult = getCityCoordinates(cityOfBirth);
  const coords = { lat: coordsResult.lat, lng: coordsResult.lng };
  
  try {
    const origin = new Origin({
      year: date.getFullYear(),
      month: date.getMonth(),
      date: date.getDate(),
      hour: hours || 12,
      minute: minutes || 0,
      latitude: coords.lat,
      longitude: coords.lng,
    });
    
    const horoscope = new Horoscope({
      origin: origin,
      houseSystem: "placidus",
      zodiac: "tropical",
      aspectPoints: ['bodies', 'angles'],
      aspectWithPoints: ['bodies', 'angles'],
      aspectTypes: ["major"],
      customOrbs: {},
      language: 'en'
    });
    
    const bodies = horoscope.CelestialBodies;
    const ascendant = horoscope.Ascendant;
    
    const northNodeSign = bodies?.northnode?.Sign?.label 
      ? normalizeSignLabel(bodies.northnode.Sign.label) 
      : undefined;
    
    const southNodeSign = northNodeSign 
      ? getOppositeSign(northNodeSign)
      : undefined;
    
    return {
      sun: bodies?.sun?.Sign?.label ? normalizeSignLabel(bodies.sun.Sign.label) : fallbackSunSign(dateOfBirth),
      moon: bodies?.moon?.Sign?.label ? normalizeSignLabel(bodies.moon.Sign.label) : fallbackSunSign(dateOfBirth),
      rising: ascendant?.Sign?.label ? normalizeSignLabel(ascendant.Sign.label) : fallbackSunSign(dateOfBirth),
      mercury: bodies?.mercury?.Sign?.label ? normalizeSignLabel(bodies.mercury.Sign.label) : undefined,
      venus: bodies?.venus?.Sign?.label ? normalizeSignLabel(bodies.venus.Sign.label) : undefined,
      mars: bodies?.mars?.Sign?.label ? normalizeSignLabel(bodies.mars.Sign.label) : undefined,
      jupiter: bodies?.jupiter?.Sign?.label ? normalizeSignLabel(bodies.jupiter.Sign.label) : undefined,
      saturn: bodies?.saturn?.Sign?.label ? normalizeSignLabel(bodies.saturn.Sign.label) : undefined,
      northNode: northNodeSign,
      southNode: southNodeSign,
      coordinates: coords,
      locationMatched: coordsResult.matched,
      matchedCity: coordsResult.matchedCity,
    };
  } catch (error) {
    console.error("Error calculating birth chart with ephemeris:", error);
    return {
      sun: fallbackSunSign(dateOfBirth),
      moon: fallbackSunSign(dateOfBirth),
      rising: fallbackSunSign(dateOfBirth),
      coordinates: coords,
      locationMatched: coordsResult.matched,
      matchedCity: coordsResult.matchedCity,
    };
  }
}

const zodiacDates = [
  { sign: "Aries" as ZodiacSign, startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
  { sign: "Taurus" as ZodiacSign, startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
  { sign: "Gemini" as ZodiacSign, startMonth: 5, startDay: 21, endMonth: 6, endDay: 20 },
  { sign: "Cancer" as ZodiacSign, startMonth: 6, startDay: 21, endMonth: 7, endDay: 22 },
  { sign: "Leo" as ZodiacSign, startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
  { sign: "Virgo" as ZodiacSign, startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
  { sign: "Libra" as ZodiacSign, startMonth: 9, startDay: 23, endMonth: 10, endDay: 22 },
  { sign: "Scorpio" as ZodiacSign, startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
  { sign: "Sagittarius" as ZodiacSign, startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 },
  { sign: "Capricorn" as ZodiacSign, startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 },
  { sign: "Aquarius" as ZodiacSign, startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
  { sign: "Pisces" as ZodiacSign, startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 },
];

function fallbackSunSign(dateOfBirth: string): ZodiacSign {
  const date = new Date(dateOfBirth + 'T12:00:00');
  const month = date.getMonth() + 1;
  const day = date.getDate();

  for (const zodiac of zodiacDates) {
    if (zodiac.startMonth === zodiac.endMonth) {
      if (month === zodiac.startMonth && day >= zodiac.startDay && day <= zodiac.endDay) {
        return zodiac.sign;
      }
    } else if (zodiac.startMonth > zodiac.endMonth) {
      if ((month === zodiac.startMonth && day >= zodiac.startDay) || 
          (month === zodiac.endMonth && day <= zodiac.endDay)) {
        return zodiac.sign;
      }
    } else {
      if ((month === zodiac.startMonth && day >= zodiac.startDay) || 
          (month === zodiac.endMonth && day <= zodiac.endDay)) {
        return zodiac.sign;
      }
    }
  }
  
  return "Aries";
}
