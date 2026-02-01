import { z } from "zod";
import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  name: varchar("name"),
  dateOfBirth: varchar("date_of_birth"),
  timeOfBirth: varchar("time_of_birth"),
  cityOfBirth: varchar("city_of_birth"),
  birthTimeKnown: varchar("birth_time_known"),
  hasAstrologyProfile: varchar("has_astrology_profile"),
  sunSign: varchar("sun_sign"),
  moonSign: varchar("moon_sign"),
  risingSign: varchar("rising_sign"),
  currentElement: varchar("current_element"),
  subscriptionTier: varchar("subscription_tier").default("free"),
  stripeCustomerId: varchar("stripe_customer_id"),
  hasUsedTrial: varchar("has_used_trial").default("false"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const moodEntries = pgTable("mood_entries", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  mood: varchar("mood").notNull(),
  notes: varchar("notes"),
  element: varchar("element"),
  timestamp: varchar("timestamp").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type InsertMoodEntry = typeof moodEntries.$inferInsert;
export type SelectMoodEntry = typeof moodEntries.$inferSelect;

export const intentions = pgTable("intentions", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  text: varchar("text").notNull(),
  timestamp: varchar("timestamp").notNull(),
  completed: varchar("completed").default("false"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type InsertIntention = typeof intentions.$inferInsert;
export type SelectIntention = typeof intentions.$inferSelect;

export const dreamMoods = ["calm", "confusing", "scary", "powerful", "sweet"] as const;
export type DreamMood = typeof dreamMoods[number];

export const dreamEntries = pgTable("dream_entries", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  date: varchar("date").notNull(),
  title: varchar("title").notNull(),
  content: varchar("content").notNull(),
  mood: varchar("mood"),
  aiInsight: varchar("ai_insight"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type InsertDreamEntry = typeof dreamEntries.$inferInsert;
export type SelectDreamEntry = typeof dreamEntries.$inferSelect;

export const dreamEntryInputSchema = z.object({
  date: z.string(),
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(5000),
  mood: z.enum(dreamMoods).optional().nullable(),
});

export const dreamEntrySchema = z.object({
  id: z.string(),
  date: z.string(),
  title: z.string(),
  content: z.string(),
  mood: z.enum(dreamMoods).optional().nullable(),
  aiInsight: z.string().optional().nullable(),
});

export type DreamEntry = z.infer<typeof dreamEntrySchema>;

export const betaUsageSchema = z.object({
  date: z.string(),
  dreamEntriesUsed: z.number().default(0),
  subliminalsUsed: z.number().default(0),
});

export type BetaUsage = z.infer<typeof betaUsageSchema>;

export const betaLimits = {
  dreamEntriesPerDay: Infinity,
  subliminalsPerDay: Infinity,
};

export const subliminalCategories = [
  "love_relationships",
  "self_worth_confidence", 
  "money_overflow",
  "healing_nervous_system",
  "protection_boundaries",
  "shadow_integration",
  "spiritual_alignment"
] as const;
export type SubliminalCategory = typeof subliminalCategories[number];

export const subliminalCategoryLabels: Record<SubliminalCategory, string> = {
  love_relationships: "Love & Relationships",
  self_worth_confidence: "Self-Worth & Confidence",
  money_overflow: "Money & Overflow",
  healing_nervous_system: "Healing & Nervous System",
  protection_boundaries: "Protection & Boundaries",
  shadow_integration: "Shadow Integration",
  spiritual_alignment: "Spiritual Alignment"
};

export const subliminalBackgrounds = [
  "delta_waves",
  "theta_waves", 
  "celestial_echo",
  "ocean_calm",
  "pure_silence"
] as const;
export type SubliminalBackground = typeof subliminalBackgrounds[number];

export const subliminalBackgroundLabels: Record<SubliminalBackground, string> = {
  delta_waves: "Soft Delta Waves (deep sleep)",
  theta_waves: "Deep Theta Waves (inner work)",
  celestial_echo: "Celestial Echo (cosmic ambience)",
  ocean_calm: "Ocean Calm (gentle water)",
  pure_silence: "Pure Silence Layer (no music)"
};

// MVP: Only 10-minute duration supported (audio file is 10 minutes)
export const subliminalDurations = ["10"] as const;
export type SubliminalDuration = typeof subliminalDurations[number];

export const subliminalStyles = ["gentle", "balanced", "deep"] as const;
export type SubliminalStyle = typeof subliminalStyles[number];

export const subliminalStyleLabels: Record<SubliminalStyle, string> = {
  gentle: "Gentle (slow, fewer affirmations)",
  balanced: "Balanced (default)",
  deep: "Deep Reprogram (denser affirmations)"
};

export const subliminals = pgTable("subliminals", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar("title").notNull(),
  category: varchar("category").notNull(),
  intention: varchar("intention").notNull(),
  affirmations: varchar("affirmations").notNull(),
  background: varchar("background").notNull(),
  duration: varchar("duration").notNull(),
  style: varchar("style").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type InsertSubliminal = typeof subliminals.$inferInsert;
export type SelectSubliminal = typeof subliminals.$inferSelect;

export const subliminalInputSchema = z.object({
  category: z.enum(subliminalCategories),
  intention: z.string().min(1).max(1000),
  background: z.enum(subliminalBackgrounds),
  duration: z.enum(subliminalDurations),
  style: z.enum(subliminalStyles).default("balanced"),
});

export type SubliminalInput = z.infer<typeof subliminalInputSchema>;

export const subliminalTierLimits: Record<SubscriptionTier, number> = {
  free: Infinity,
  premium: Infinity,
  ascended: Infinity,
  initiates: Infinity,
};

export const zodiacSigns = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
] as const;

export type ZodiacSign = typeof zodiacSigns[number];

export const elements = ["fire", "water", "air", "earth", "cosmic", "golden_dawn"] as const;
export type Element = typeof elements[number];

export const spiritualStyles = ["archetype", "energy", "cosmic"] as const;
export type SpiritualStyle = typeof spiritualStyles[number];

export const spiritualStyleLabels: Record<SpiritualStyle, string> = {
  archetype: "Archetype Mode",
  energy: "Energy Mode", 
  cosmic: "Cosmic Mode",
};

export const spiritualStyleDescriptions: Record<SpiritualStyle, string> = {
  archetype: "Mystical archetypes and healing wisdom",
  energy: "Grounded spiritual wellness language",
  cosmic: "Light cosmic energy references",
};

export const elementMapping: Record<ZodiacSign, Element> = {
  Aries: "fire", Leo: "fire", Sagittarius: "fire",
  Cancer: "water", Scorpio: "water", Pisces: "water",
  Gemini: "air", Libra: "air", Aquarius: "air",
  Taurus: "earth", Virgo: "earth", Capricorn: "earth"
};

export const moodOptions = ["happy", "calm", "anxious", "tired", "overwhelmed", "grateful"] as const;
export type MoodOption = typeof moodOptions[number];

export const moonPhases = ["new", "waxing", "full", "waning"] as const;
export type MoonPhase = typeof moonPhases[number];

export const userProfileSchema = z.object({
  name: z.string().min(1),
  dateOfBirth: z.string().optional(),
  timeOfBirth: z.string().optional(),
  cityOfBirth: z.string().optional(),
  birthTimeKnown: z.boolean().optional(),
  hasAstrologyProfile: z.boolean().default(false),
  sunSign: z.enum(zodiacSigns).optional(),
  moonSign: z.enum(zodiacSigns).optional(),
  risingSign: z.enum(zodiacSigns).optional(),
  mercurySign: z.enum(zodiacSigns).optional(),
  venusSign: z.enum(zodiacSigns).optional(),
  marsSign: z.enum(zodiacSigns).optional(),
  jupiterSign: z.enum(zodiacSigns).optional(),
  saturnSign: z.enum(zodiacSigns).optional(),
  northNodeSign: z.enum(zodiacSigns).optional(),
  southNodeSign: z.enum(zodiacSigns).optional(),
  currentElement: z.enum(elements).optional(),
  spiritualStyle: z.enum(spiritualStyles).optional().default("archetype"),
});

export type UserProfile = z.infer<typeof userProfileSchema>;

export interface BirthChart {
  sunSign: string;
  moonSign: string;
  risingSign: string;
  mercurySign: string;
  venusSign: string;
  marsSign: string;
  jupiterSign: string;
  saturnSign: string;
  northNodeSign: string;
  southNodeSign: string;
}

const coerceBoolean = z.preprocess((val) => {
  if (typeof val === 'boolean') return val;
  if (val === 'true') return true;
  if (val === 'false') return false;
  return val;
}, z.boolean());

export const userProfileUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  dateOfBirth: z.string().optional().nullable(),
  timeOfBirth: z.string().optional().nullable(),
  cityOfBirth: z.string().optional().nullable(),
  birthTimeKnown: coerceBoolean.optional(),
  hasAstrologyProfile: coerceBoolean.optional(),
  sunSign: z.enum(zodiacSigns).optional().nullable(),
  moonSign: z.enum(zodiacSigns).optional().nullable(),
  risingSign: z.enum(zodiacSigns).optional().nullable(),
  mercurySign: z.enum(zodiacSigns).optional().nullable(),
  venusSign: z.enum(zodiacSigns).optional().nullable(),
  marsSign: z.enum(zodiacSigns).optional().nullable(),
  jupiterSign: z.enum(zodiacSigns).optional().nullable(),
  saturnSign: z.enum(zodiacSigns).optional().nullable(),
  northNodeSign: z.enum(zodiacSigns).optional().nullable(),
  southNodeSign: z.enum(zodiacSigns).optional().nullable(),
  currentElement: z.enum(elements).optional().nullable(),
  spiritualStyle: z.enum(spiritualStyles).optional().nullable(),
}).strict();

export type UserProfileUpdate = z.infer<typeof userProfileUpdateSchema>;

export const moodEntrySchema = z.object({
  id: z.string(),
  mood: z.enum(moodOptions),
  notes: z.string().optional(),
  timestamp: z.string(),
  element: z.enum(elements).optional(),
});

export type MoodEntry = z.infer<typeof moodEntrySchema>;

export const moodEntryInputSchema = z.object({
  id: z.string().uuid(),
  mood: z.enum(moodOptions),
  notes: z.string().max(1000).optional().nullable(),
  timestamp: z.string().datetime(),
  element: z.enum(elements).optional().nullable(),
});

export const moodEntrySyncSchema = z.object({
  entries: z.array(moodEntryInputSchema).max(100),
});

export const intentionSchema = z.object({
  id: z.string(),
  text: z.string().min(1),
  timestamp: z.string(),
  completed: z.boolean().default(false),
});

export type Intention = z.infer<typeof intentionSchema>;

export const intentionInputSchema = z.object({
  id: z.string().uuid(),
  text: z.string().min(1).max(1000),
  timestamp: z.string().datetime(),
  completed: coerceBoolean.default(false),
});

export const intentionSyncSchema = z.object({
  intentions: z.array(intentionInputSchema).max(100),
});

export const intentionUpdateSchema = z.object({
  text: z.string().min(1).max(1000).optional(),
  completed: coerceBoolean.optional(),
});

export const affirmationRequestSchema = z.object({
  sunSign: z.enum(zodiacSigns),
  moonSign: z.enum(zodiacSigns),
  element: z.enum(elements),
});

export type AffirmationRequest = z.infer<typeof affirmationRequestSchema>;

export const affirmationResponseSchema = z.object({
  affirmation: z.string(),
});

export type AffirmationResponse = z.infer<typeof affirmationResponseSchema>;

export const subscriptionTiers = ["free", "initiates", "premium", "ascended"] as const;
export type SubscriptionTier = typeof subscriptionTiers[number];

export const subscriptionStatuses = ["active", "trialing", "expired", "cancelled"] as const;
export type SubscriptionStatus = typeof subscriptionStatuses[number];

export const billingCycles = ["monthly", "yearly"] as const;
export type BillingCycle = typeof billingCycles[number];

export const subscriptionSchema = z.object({
  tier: z.enum(subscriptionTiers).default("free"),
  status: z.enum(subscriptionStatuses).default("active"),
  billingCycle: z.enum(billingCycles).optional(),
  trialEndDate: z.string().optional(),
  renewalDate: z.string().optional(),
  hasUsedTrial: z.boolean().optional(),
});

export type Subscription = z.infer<typeof subscriptionSchema>;

export const usageTrackingSchema = z.object({
  date: z.string(),
  affirmationsUsed: z.number().default(0),
  journalEntriesUsed: z.number().default(0),
  astrologyInsightsUsed: z.number().default(0),
});

export type UsageTracking = z.infer<typeof usageTrackingSchema>;

export const tierLimits: Record<SubscriptionTier, { affirmations: number; journals: number; astrologyInsights: number }> = {
  free: { affirmations: Infinity, journals: Infinity, astrologyInsights: Infinity },
  initiates: { affirmations: Infinity, journals: Infinity, astrologyInsights: Infinity },
  premium: { affirmations: Infinity, journals: Infinity, astrologyInsights: Infinity },
  ascended: { affirmations: Infinity, journals: Infinity, astrologyInsights: Infinity },
};

export const pricingPlans = {
  free: {
    name: "Intiti Free",
    tagline: "A gentle introduction to your inner world.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    tag: "Always free",
    stripePriceIdMonthly: null,
    stripePriceIdYearly: null,
    features: [
      "2 affirmations per day",
      "1 Emotional Weather check-in per day",
      "Breathwork exercises",
      "Preview Today's Energy guidance",
    ],
  },
  initiates: {
    name: "Initiates",
    tagline: "For the first souls to enter this sacred space.",
    monthlyPrice: null,
    yearlyPrice: 49.99,
    tag: "Price locked for life",
    label: "Limited to 500",
    stripePriceIdMonthly: null,
    stripePriceIdYearly: "price_1Sau6m5FWFGC1A5nCTNcHNQc",
    features: [
      "10 affirmations per day",
      "5 Emotional Weather check-ins per day",
      "1 energy insight per day",
      "All themes unlocked",
      "Full meditation and subliminal library",
    ],
  },
  premium: {
    name: "Intiti Premium",
    tagline: "Deep alignment. Daily support. Personalized guidance.",
    monthlyPrice: 12.99,
    yearlyPrice: 99.99,
    tag: "Most popular",
    trialText: "Includes a 7 day free trial",
    stripePriceIdMonthly: "price_1Sau6n5FWFGC1A5ndZBQ6BMZ",
    stripePriceIdYearly: "price_1Sau6n5FWFGC1A5nPanxPOcM",
    features: [
      "10 affirmations and 5 check-ins per day",
      "2 energy insights per day",
      "Full Energetic Blueprint",
      "Connection Energy Reading",
      "All meditations and subliminals",
    ],
  },
  ascended: {
    name: "Intiti Ascended",
    tagline: "For the souls who are ready for deep, unlimited work.",
    monthlyPrice: 19.99,
    yearlyPrice: 149.99,
    tag: "Unlimited",
    stripePriceIdMonthly: "price_1Sau6n5FWFGC1A5nuf0eZcp4",
    stripePriceIdYearly: "price_1Sau6n5FWFGC1A5neHKBZgfG",
    features: [
      "Unlimited affirmations and check-ins",
      "Unlimited energy insights and reports",
      "Monthly Energy Report",
      "All subliminals, meditations and themes",
      "Priority support and early features",
    ],
  },
} as const;

export const featureAccessMap: Record<SubscriptionTier, string[]> = {
  free: ["mood_checkin", "all_themes", "breathwork", "unlimited_affirmations", "unlimited_journal", "full_chart", "daily_horoscope", "meditations", "subliminals", "moon_insights", "energy_dashboard", "golden_dawn_theme", "energy_wall", "weekly_moon_report", "monthly_energy_reading", "compatibility_readings", "priority_ai", "affirmations", "journal", "priority_access"],
  initiates: ["mood_checkin", "all_themes", "breathwork", "unlimited_affirmations", "unlimited_journal", "full_chart", "daily_horoscope", "meditations", "subliminals", "moon_insights", "energy_dashboard", "golden_dawn_theme", "energy_wall", "weekly_moon_report", "monthly_energy_reading", "compatibility_readings", "priority_ai", "affirmations", "journal", "priority_access"],
  premium: ["mood_checkin", "all_themes", "breathwork", "unlimited_affirmations", "unlimited_journal", "full_chart", "daily_horoscope", "meditations", "subliminals", "moon_insights", "energy_dashboard", "golden_dawn_theme", "energy_wall", "weekly_moon_report", "monthly_energy_reading", "compatibility_readings", "priority_ai", "affirmations", "journal", "priority_access"],
  ascended: ["mood_checkin", "all_themes", "breathwork", "unlimited_affirmations", "unlimited_journal", "full_chart", "daily_horoscope", "meditations", "subliminals", "moon_insights", "energy_dashboard", "golden_dawn_theme", "energy_wall", "weekly_moon_report", "monthly_energy_reading", "compatibility_readings", "priority_ai", "affirmations", "journal", "priority_access"],
};

export const signDescriptions: Record<ZodiacSign, { sun: string; moon: string; rising: string }> = {
  Aries: {
    sun: "You are a natural-born leader with fiery determination. Your pioneering spirit drives you to take bold action and embrace new beginnings.",
    moon: "Your emotional nature is passionate and impulsive. You process feelings quickly and prefer direct expression over dwelling on emotions.",
    rising: "You present yourself with confidence and enthusiasm. Others see you as courageous, energetic, and ready to take on any challenge."
  },
  Taurus: {
    sun: "You embody stability and sensuality. Your patient nature and appreciation for beauty guide you toward building lasting comfort and security.",
    moon: "Emotionally, you seek stability and comfort. You process feelings slowly but deeply, finding peace in familiar routines and sensory pleasures.",
    rising: "You appear grounded and reliable to others. Your calm presence and appreciation for quality make strong first impressions."
  },
  Gemini: {
    sun: "Your mind is curious and adaptable. You thrive on variety, communication, and making connections between ideas and people.",
    moon: "Your emotional world is dynamic and changeable. You process feelings through conversation and intellectual understanding.",
    rising: "You come across as witty, sociable, and intellectually engaging. Others are drawn to your animated communication style."
  },
  Cancer: {
    sun: "You are deeply intuitive and nurturing. Your emotional intelligence and protective nature make you a natural caretaker.",
    moon: "Your emotions run deep like the ocean. You are highly empathic, intuitive, and need emotional security to feel at peace.",
    rising: "You appear caring and approachable. Others sense your warmth and often feel safe opening up to you."
  },
  Leo: {
    sun: "You radiate warmth and creativity. Your generous spirit and natural charisma draw others to your light.",
    moon: "Emotionally, you need recognition and appreciation. Your feelings are dramatic and heartfelt, seeking authentic expression.",
    rising: "You present yourself with confidence and flair. Others notice your presence immediately and are drawn to your magnetic energy."
  },
  Virgo: {
    sun: "You possess keen analytical abilities and a desire to be of service. Your attention to detail helps you improve everything you touch.",
    moon: "Emotionally, you process through analysis and practical action. You feel most secure when things are organized and purposeful.",
    rising: "You appear thoughtful, helpful, and attentive. Others appreciate your practical approach and eye for improvement."
  },
  Libra: {
    sun: "You seek harmony, beauty, and balanced relationships. Your diplomatic nature helps you see all sides and create peace.",
    moon: "Your emotional wellbeing is tied to your relationships. You process feelings through connection and seek equilibrium in your inner world.",
    rising: "You present yourself with grace and charm. Others find you approachable, fair-minded, and aesthetically pleasing."
  },
  Scorpio: {
    sun: "You possess deep intensity and transformative power. Your ability to see beneath the surface gives you profound insight.",
    moon: "Your emotions are intense and all-consuming. You feel everything deeply and are drawn to exploring life's mysteries.",
    rising: "You appear mysterious and magnetic. Others sense your depth and are either intrigued or intimidated by your intensity."
  },
  Sagittarius: {
    sun: "You are an adventurer and seeker of truth. Your optimistic spirit and love of freedom drive you toward expansion and growth.",
    moon: "Emotionally, you need freedom and meaning. You process feelings through philosophy, adventure, and maintaining your independence.",
    rising: "You come across as friendly, optimistic, and adventurous. Others are inspired by your enthusiasm and open-minded perspective."
  },
  Capricorn: {
    sun: "You are ambitious and disciplined. Your practical wisdom and determination help you achieve long-term goals with integrity.",
    moon: "Emotionally, you are reserved but deeply committed. You feel most secure when working toward meaningful achievements.",
    rising: "You appear professional, capable, and mature. Others respect your composure and sense your underlying ambition."
  },
  Aquarius: {
    sun: "You are a visionary and humanitarian. Your innovative thinking and desire for progress help you imagine better futures.",
    moon: "Your emotional nature is unconventional and independent. You process feelings through detachment and intellectual understanding.",
    rising: "You come across as unique and progressive. Others notice your individuality and appreciate your forward-thinking perspective."
  },
  Pisces: {
    sun: "You are deeply compassionate and imaginative. Your intuitive gifts and creative spirit connect you to the mystical realms.",
    moon: "Your emotional world is boundless and empathic. You absorb feelings from your environment and need time for creative expression.",
    rising: "You appear gentle, dreamy, and compassionate. Others sense your sensitivity and are drawn to your ethereal presence."
  }
};

export const moonPhaseDescriptions: Record<MoonPhase, string> = {
  new: "The New Moon is a time of new beginnings and setting intentions. The sky is dark, inviting you to plant seeds for what you want to manifest.",
  waxing: "The Waxing Moon is a time of growth and building momentum. Energy is expanding, supporting action toward your goals.",
  full: "The Full Moon illuminates and brings things to completion. Emotions are heightened, and hidden truths may be revealed.",
  waning: "The Waning Moon is a time of release and letting go. Reflect on what no longer serves you and prepare for renewal."
};

export const planetDescriptions: Record<ZodiacSign, { mercury: string; venus: string; mars: string }> = {
  Aries: {
    mercury: "Your mind is quick and decisive. You think fast, speak directly, and prefer to get straight to the point rather than dancing around issues.",
    venus: "In love, you're passionate and spontaneous. You fall fast, pursue boldly, and need excitement and independence in relationships.",
    mars: "Your drive is fierce and unstoppable. You take action immediately, compete to win, and have abundant physical energy and courage."
  },
  Taurus: {
    mercury: "Your thinking is methodical and practical. You process information slowly but thoroughly, preferring concrete facts over abstract theories.",
    venus: "In love, you're devoted and sensual. You value stability, physical affection, and building lasting bonds based on trust and comfort.",
    mars: "Your drive is steady and determined. You work patiently toward goals, rarely give up, and channel energy into building tangible results."
  },
  Gemini: {
    mercury: "Your mind is exceptionally quick and versatile. You juggle multiple ideas, communicate brilliantly, and thrive on mental stimulation.",
    venus: "In love, you need intellectual connection. You're drawn to witty, curious partners and enjoy playful banter and variety in romance.",
    mars: "Your drive is mental and adaptable. You pursue goals through communication, multitasking, and clever problem-solving rather than brute force."
  },
  Cancer: {
    mercury: "Your thinking is intuitive and emotionally intelligent. You remember feelings associated with information and communicate with sensitivity.",
    venus: "In love, you're nurturing and deeply devoted. You seek emotional security, create cozy bonds, and express love through caring actions.",
    mars: "Your drive is protective and tenacious. You fight fiercely for loved ones, pursue goals with emotional investment, and have strong intuitive instincts."
  },
  Leo: {
    mercury: "Your thinking is creative and dramatic. You express ideas with flair, enjoy being heard, and think in bold, confident strokes.",
    venus: "In love, you're generous and romantic. You want to be adored, express affection grandly, and bring warmth and joy to relationships.",
    mars: "Your drive is proud and charismatic. You pursue goals with confidence, lead naturally, and put your whole heart into everything you do."
  },
  Virgo: {
    mercury: "Your mind is analytical and precise. You notice details others miss, think critically, and excel at organizing information systematically.",
    venus: "In love, you show devotion through service. You appreciate practical gestures, value reliability, and express care through helpful actions.",
    mars: "Your drive is focused and efficient. You work methodically toward perfection, analyze before acting, and achieve through careful planning."
  },
  Libra: {
    mercury: "Your thinking is balanced and fair-minded. You consider all perspectives, communicate diplomatically, and excel at finding middle ground.",
    venus: "In love, you're romantic and partnership-oriented. You value harmony, appreciate beauty and elegance, and thrive in balanced relationships.",
    mars: "Your drive seeks harmony through action. You pursue goals through collaboration, prefer negotiation to conflict, and fight for fairness."
  },
  Scorpio: {
    mercury: "Your mind is penetrating and investigative. You see through facades, think strategically, and are drawn to hidden truths and mysteries.",
    venus: "In love, you're intensely passionate and loyal. You seek deep soul bonds, value emotional honesty, and love with transformative power.",
    mars: "Your drive is powerful and relentless. You pursue goals with laser focus, overcome obstacles through sheer will, and never forget what matters."
  },
  Sagittarius: {
    mercury: "Your mind is expansive and philosophical. You think big, seek meaning, and communicate with enthusiasm about ideas and possibilities.",
    venus: "In love, you value freedom and adventure. You're drawn to growth-minded partners and need space to explore within relationships.",
    mars: "Your drive is optimistic and adventurous. You pursue goals with enthusiasm, take bold risks, and channel energy into exploration and growth."
  },
  Capricorn: {
    mercury: "Your thinking is strategic and realistic. You plan carefully, speak with authority, and focus on practical applications of ideas.",
    venus: "In love, you're loyal and committed. You value stability and achievement in partners, and show love through dependability and support.",
    mars: "Your drive is ambitious and disciplined. You work tirelessly toward long-term goals, exercise remarkable self-control, and achieve through persistence."
  },
  Aquarius: {
    mercury: "Your mind is innovative and unconventional. You think outside boxes, embrace unique perspectives, and communicate progressive ideas.",
    venus: "In love, you value friendship and individuality. You need intellectual connection, appreciate uniqueness, and maintain independence in relationships.",
    mars: "Your drive is idealistic and humanitarian. You pursue goals that benefit the collective, innovate boldly, and fight for progress and equality."
  },
  Pisces: {
    mercury: "Your thinking is intuitive and imaginative. You absorb information through feeling, think in images and symbols, and communicate poetically.",
    venus: "In love, you're romantic and compassionate. You merge deeply with partners, love unconditionally, and express affection through creative gestures.",
    mars: "Your drive is subtle and adaptable. You pursue goals through intuition, flow around obstacles, and channel energy into creative and spiritual pursuits."
  }
};

// =====================================================
// NEW AI FEATURES - Database Tables
// =====================================================

// Feature types for usage tracking
export const aiFeatures = ["tarot", "intentions", "clarity", "sleep_ritual", "subliminals"] as const;
export type AIFeature = typeof aiFeatures[number];

// Daily feature usage tracking
export const featureUsage = pgTable("feature_usage", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  feature: varchar("feature").notNull(),
  date: varchar("date").notNull(),
  count: varchar("count").notNull().default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type InsertFeatureUsage = typeof featureUsage.$inferInsert;
export type SelectFeatureUsage = typeof featureUsage.$inferSelect;

// Tarot spread types
export const tarotSpreadTypes = ["single", "three_card", "love", "career", "shadow"] as const;
export type TarotSpreadType = typeof tarotSpreadTypes[number];

// Tarot readings history
export const tarotReadings = pgTable("tarot_readings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  spreadType: varchar("spread_type").notNull(),
  question: varchar("question"),
  cards: jsonb("cards").notNull(),
  interpretation: varchar("interpretation").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type InsertTarotReading = typeof tarotReadings.$inferInsert;
export type SelectTarotReading = typeof tarotReadings.$inferSelect;

export const tarotReadingInputSchema = z.object({
  spreadType: z.enum(tarotSpreadTypes),
  question: z.string().max(500).optional(),
});

export const tarotCardSchema = z.object({
  name: z.string(),
  suit: z.string().optional(),
  isReversed: z.boolean(),
  position: z.string().optional(),
});

export type TarotCard = z.infer<typeof tarotCardSchema>;

// AI Intention prompts history
export const intentionPrompts = pgTable("intention_prompts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  prompt: varchar("prompt").notNull(),
  response: varchar("response"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type InsertIntentionPrompt = typeof intentionPrompts.$inferInsert;
export type SelectIntentionPrompt = typeof intentionPrompts.$inferSelect;

// Clarity focus areas
export const clarityFocusAreas = ["love", "career", "healing", "shadow_work", "protection", "flow_alignment"] as const;
export type ClarityFocusArea = typeof clarityFocusAreas[number];

// Clarity sessions history
export const claritySessions = pgTable("clarity_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  question: varchar("question").notNull(),
  focusArea: varchar("focus_area").notNull(),
  guidance: varchar("guidance").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type InsertClaritySession = typeof claritySessions.$inferInsert;
export type SelectClaritySession = typeof claritySessions.$inferSelect;

export const clarityInputSchema = z.object({
  question: z.string().min(1).max(1000),
  focusArea: z.enum(clarityFocusAreas),
});

// Sleep rituals history
export const sleepRituals = pgTable("sleep_rituals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  reflection: varchar("reflection").notNull(),
  breathwork: varchar("breathwork").notNull(),
  intention: varchar("intention").notNull(),
  tarotInsight: varchar("tarot_insight"),
  meditation: varchar("meditation"),
  subliminalSuggestion: varchar("subliminal_suggestion"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type InsertSleepRitual = typeof sleepRituals.$inferInsert;
export type SelectSleepRitual = typeof sleepRituals.$inferSelect;


// =====================================================
// Feature Tier Limits Configuration
// =====================================================

export const featureTierLimits: Record<SubscriptionTier, Record<AIFeature, number>> = {
  free: {
    tarot: 0,
    intentions: 1,
    clarity: 0,
    sleep_ritual: 1,
    subliminals: 1,
  },
  initiates: {
    tarot: Infinity,
    intentions: Infinity,
    clarity: Infinity,
    sleep_ritual: Infinity,
    subliminals: Infinity,
  },
  premium: {
    tarot: 3,
    intentions: 3,
    clarity: 1,
    sleep_ritual: 3,
    subliminals: 5,
  },
  ascended: {
    tarot: 5,
    intentions: Infinity,
    clarity: 5,
    sleep_ritual: 5,
    subliminals: 10,
  },
};

// Tarot spread access by tier
export const tarotSpreadAccess: Record<SubscriptionTier, TarotSpreadType[]> = {
  free: [],
  initiates: ["single", "three_card", "love", "career", "shadow"],
  premium: ["single"],
  ascended: ["single", "three_card"],
};

// =====================================================
// Standard 78-card Tarot Deck
// =====================================================

export const majorArcana = [
  "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
  "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit",
  "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance",
  "The Devil", "The Tower", "The Star", "The Moon", "The Sun",
  "Judgement", "The World"
] as const;

export const minorArcanaSuits = ["Wands", "Cups", "Swords", "Pentacles"] as const;
export const minorArcanaRanks = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King"] as const;

export const moonSignMeanings: Record<ZodiacSign, Record<MoonPhase, string>> = {
  Aries: {
    new: "Channel your pioneering spirit into bold new projects. Your courage is amplified now.",
    waxing: "Your enthusiasm builds. Take inspired action while maintaining patience.",
    full: "Your passions are intensified. Find healthy outlets for your fiery emotions.",
    waning: "Release impatience and anger. Slow down and rest before your next adventure."
  },
  Taurus: {
    new: "Plant seeds for material security and sensual pleasures. Ground your intentions in reality.",
    waxing: "Steady progress builds comfort. Trust your pace and enjoy the journey.",
    full: "Appreciate the beauty around you. Your values are illuminated now.",
    waning: "Release attachments to possessions or routines that no longer serve you."
  },
  Gemini: {
    new: "Begin new learning journeys and communication projects. Your curiosity is sparked.",
    waxing: "Gather information and make connections. Your mind is especially active.",
    full: "Share your ideas and insights. Important conversations may arise.",
    waning: "Release scattered thinking. Focus your mental energy inward."
  },
  Cancer: {
    new: "Nurture new emotional connections and home projects. Create a sanctuary.",
    waxing: "Your emotional intuition strengthens. Trust your feelings to guide you.",
    full: "Deep emotions surface. Honor your need for comfort and security.",
    waning: "Release old emotional patterns. Create space for new nurturing."
  },
  Leo: {
    new: "Start creative projects that express your authentic self. Let your light shine.",
    waxing: "Your confidence grows. Share your gifts with the world.",
    full: "Your radiance is magnified. Receive the appreciation you deserve.",
    waning: "Release need for external validation. Your worth is inherent."
  },
  Virgo: {
    new: "Begin new health routines or service projects. Small improvements matter.",
    waxing: "Refine your daily practices. Your attention to detail serves you well.",
    full: "Recognize the value of your work. Your contributions are seen.",
    waning: "Release perfectionism and worry. You are enough as you are."
  },
  Libra: {
    new: "Initiate new partnerships and creative collaborations. Seek harmony.",
    waxing: "Relationships deepen and balance improves. Embrace cooperation.",
    full: "Partnership dynamics are illuminated. Seek fair resolution.",
    waning: "Release codependency patterns. Find balance within yourself."
  },
  Scorpio: {
    new: "Begin deep inner work and transformation. Embrace your shadow.",
    waxing: "Your intuition intensifies. Trust the process of becoming.",
    full: "Hidden truths emerge. Embrace powerful emotional revelations.",
    waning: "Release control and old resentments. Allow rebirth."
  },
  Sagittarius: {
    new: "Start new adventures in learning or travel. Expand your horizons.",
    waxing: "Your optimism and faith grow. Follow your vision.",
    full: "Your beliefs and philosophies are tested. Embrace truth.",
    waning: "Release rigid beliefs. Make room for new perspectives."
  },
  Capricorn: {
    new: "Set new career goals and long-term plans. Build with intention.",
    waxing: "Your ambition strengthens. Take practical steps toward success.",
    full: "Your achievements are recognized. Own your authority.",
    waning: "Release fear of failure. Your worth isn't measured by productivity."
  },
  Aquarius: {
    new: "Begin innovative projects and community connections. Think differently.",
    waxing: "Your vision for the future clarifies. Connect with like-minded souls.",
    full: "Your unique contributions are appreciated. Stand in your individuality.",
    waning: "Release attachment to being different. True freedom comes from within."
  },
  Pisces: {
    new: "Begin creative or spiritual practices. Open to divine inspiration.",
    waxing: "Your intuition and imagination expand. Trust the unseen.",
    full: "Spiritual insights and dreams are heightened. Embrace the mystical.",
    waning: "Release escapism and boundaries. Ground your spiritual gifts."
  }
};
