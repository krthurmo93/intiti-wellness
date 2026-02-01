import type { ZodiacSign, MoonPhase } from "@shared/schema";

const zodiacDates: { sign: ZodiacSign; startMonth: number; startDay: number; endMonth: number; endDay: number }[] = [
  { sign: "Aries", startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
  { sign: "Taurus", startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
  { sign: "Gemini", startMonth: 5, startDay: 21, endMonth: 6, endDay: 20 },
  { sign: "Cancer", startMonth: 6, startDay: 21, endMonth: 7, endDay: 22 },
  { sign: "Leo", startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
  { sign: "Virgo", startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
  { sign: "Libra", startMonth: 9, startDay: 23, endMonth: 10, endDay: 22 },
  { sign: "Scorpio", startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
  { sign: "Sagittarius", startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 },
  { sign: "Capricorn", startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 },
  { sign: "Aquarius", startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
  { sign: "Pisces", startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 },
];

export function calculateSunSign(dateOfBirth: string): ZodiacSign {
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

export function calculateMoonSign(dateOfBirth: string, timeOfBirth: string): ZodiacSign {
  return calculateSunSign(dateOfBirth);
}

export function calculateRisingSign(dateOfBirth: string, timeOfBirth: string, cityOfBirth: string): ZodiacSign {
  return calculateSunSign(dateOfBirth);
}

export interface FullBirthChart {
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
  coordinates?: { lat: number; lng: number };
  locationMatched?: boolean;
  matchedCity?: string;
}

export async function fetchBirthChart(
  dateOfBirth: string,
  timeOfBirth: string,
  cityOfBirth: string
): Promise<FullBirthChart> {
  try {
    const response = await fetch('/api/birth-chart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dateOfBirth,
        timeOfBirth: timeOfBirth || '12:00',
        cityOfBirth,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch birth chart');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching birth chart from API:', error);
    const sunSign = calculateSunSign(dateOfBirth);
    return {
      sun: sunSign,
      moon: sunSign,
      rising: sunSign,
    };
  }
}

export function calculateMoonPhase(date: Date = new Date()): MoonPhase {
  const knownNewMoon = new Date('2026-01-18T19:52:00Z');
  const lunarCycle = 29.53058867;
  
  const daysSinceKnown = (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  let currentCycleDay = daysSinceKnown % lunarCycle;
  if (currentCycleDay < 0) currentCycleDay += lunarCycle;
  
  if (currentCycleDay < 1.85 || currentCycleDay >= 27.68) {
    return "new";
  } else if (currentCycleDay < 13.27) {
    return "waxing";
  } else if (currentCycleDay < 16.27) {
    return "full";
  } else {
    return "waning";
  }
}

export function getMoonPhaseEmoji(phase: MoonPhase): string {
  switch (phase) {
    case "new": return "dark";
    case "waxing": return "first quarter";
    case "full": return "bright";
    case "waning": return "last quarter";
  }
}

export function getMoonIllumination(date: Date = new Date()): number {
  const knownNewMoon = new Date('2026-01-18T19:52:00Z');
  const lunarCycle = 29.53058867;
  
  const daysSinceKnown = (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  let currentCycleDay = daysSinceKnown % lunarCycle;
  if (currentCycleDay < 0) currentCycleDay += lunarCycle;
  
  const angle = (currentCycleDay / lunarCycle) * 2 * Math.PI;
  return Math.round((1 - Math.cos(angle)) / 2 * 100);
}
