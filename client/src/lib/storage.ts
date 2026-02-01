import type { UserProfile, MoodEntry, Intention, Element, Subscription, SubscriptionTier, UsageTracking, SpiritualStyle } from "@shared/schema";
import { featureAccessMap, tierLimits } from "@shared/schema";
import { fetchBirthChart } from "./astrology";

const STORAGE_KEYS = {
  USER_PROFILE: 'intiti_user_profile',
  MOOD_ENTRIES: 'intiti_mood_entries',
  INTENTIONS: 'intiti_intentions',
  CURRENT_ELEMENT: 'intiti_current_element',
  ONBOARDING_COMPLETE: 'intiti_onboarding_complete',
  HAS_SEEN_WELCOME: 'intiti_has_seen_welcome',
  ONBOARDING_DATA: 'intiti_onboarding_data',
  SUBSCRIPTION: 'intiti_subscription',
  USAGE_TRACKING: 'intiti_usage_tracking',
  BETA_FEATURES: 'intiti_beta_features',
  GOLDEN_DAWN_WELCOME_SEEN: 'intiti_golden_dawn_welcome_seen',
  SAVED_SUBLIMINALS: 'intiti_saved_subliminals',
};

export interface SavedSubliminal {
  id: string;
  title: string;
  intention: string;
  category: string;
  style: string;
  background: string;
  duration: string;
  affirmations: string;
  createdAt: string;
}

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

export function saveUserProfile(profile: UserProfile): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
}

export function getUserProfile(): UserProfile | null {
  if (!isBrowser()) return null;
  const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
  if (!data) return null;
  try {
    return JSON.parse(data) as UserProfile;
  } catch {
    return null;
  }
}

/**
 * Migration function: Ensures existing users have full birth chart data.
 * If a profile has birth data but is missing newer planetary placements
 * (Mercury, Venus, Mars, Jupiter, Saturn, Nodes), recalculates the full chart
 * and saves it back to the profile.
 */
export async function ensureFullChart(): Promise<UserProfile | null> {
  if (!isBrowser()) return null;
  
  const profile = getUserProfile();
  if (!profile) return null;
  
  // Check if we have birth data to work with
  const hasBirthData = profile.dateOfBirth && profile.hasAstrologyProfile;
  if (!hasBirthData) return profile;
  
  // Check if any of the newer planetary placements are missing
  const missingPlanets = 
    !profile.mercurySign ||
    !profile.venusSign ||
    !profile.marsSign ||
    !profile.jupiterSign ||
    !profile.saturnSign ||
    !profile.northNodeSign ||
    !profile.southNodeSign;
  
  if (!missingPlanets) return profile;
  
  // Recalculate the full birth chart
  try {
    console.log("Migrating chart: recalculating full birth chart for existing user...");
    const chart = await fetchBirthChart(
      profile.dateOfBirth!,
      profile.timeOfBirth || "12:00",
      profile.cityOfBirth || ""
    );
    
    // Update profile with full chart data
    const updatedProfile: UserProfile = {
      ...profile,
      sunSign: chart.sun,
      moonSign: chart.moon,
      risingSign: chart.rising,
      mercurySign: chart.mercury,
      venusSign: chart.venus,
      marsSign: chart.mars,
      jupiterSign: chart.jupiter,
      saturnSign: chart.saturn,
      northNodeSign: chart.northNode,
      southNodeSign: chart.southNode,
    };
    
    // Save back to localStorage
    saveUserProfile(updatedProfile);
    console.log("Chart migration complete - full chart now available");
    
    return updatedProfile;
  } catch (error) {
    console.error("Error during chart migration:", error);
    return profile;
  }
}

export function saveMoodEntry(entry: MoodEntry): void {
  if (!isBrowser()) return;
  const entries = getMoodEntries();
  entries.unshift(entry);
  localStorage.setItem(STORAGE_KEYS.MOOD_ENTRIES, JSON.stringify(entries.slice(0, 100)));
}

export function getMoodEntries(): MoodEntry[] {
  if (!isBrowser()) return [];
  const data = localStorage.getItem(STORAGE_KEYS.MOOD_ENTRIES);
  if (!data) return [];
  try {
    return JSON.parse(data) as MoodEntry[];
  } catch {
    return [];
  }
}

export function saveIntention(intention: Intention): void {
  if (!isBrowser()) return;
  const intentions = getIntentions();
  intentions.unshift(intention);
  localStorage.setItem(STORAGE_KEYS.INTENTIONS, JSON.stringify(intentions.slice(0, 100)));
}

export function getIntentions(): Intention[] {
  if (!isBrowser()) return [];
  const data = localStorage.getItem(STORAGE_KEYS.INTENTIONS);
  if (!data) return [];
  try {
    return JSON.parse(data) as Intention[];
  } catch {
    return [];
  }
}

export function getTodayIntention(): Intention | null {
  if (!isBrowser()) return null;
  const intentions = getIntentions();
  const today = new Date().toDateString();
  return intentions.find(i => new Date(i.timestamp).toDateString() === today) || null;
}

export function saveCurrentElement(element: Element): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.CURRENT_ELEMENT, element);
  const profile = getUserProfile();
  if (profile) {
    profile.currentElement = element;
    saveUserProfile(profile);
  }
}

export function getCurrentElement(): Element | null {
  if (!isBrowser()) return null;
  const element = localStorage.getItem(STORAGE_KEYS.CURRENT_ELEMENT);
  const validElements = ['fire', 'water', 'air', 'earth', 'cosmic', 'golden_dawn'];
  if (element && validElements.includes(element)) {
    if (element === 'golden_dawn' && !canAccessGoldenDawn()) {
      return 'fire';
    }
    return element as Element;
  }
  return null;
}

export function setOnboardingComplete(complete: boolean): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, JSON.stringify(complete));
}

export function isOnboardingComplete(): boolean {
  if (!isBrowser()) return false;
  const data = localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
  if (!data) return false;
  try {
    return JSON.parse(data) === true;
  } catch {
    return false;
  }
}

export function hasSeenWelcome(): boolean {
  if (!isBrowser()) return false;
  const data = localStorage.getItem(STORAGE_KEYS.HAS_SEEN_WELCOME);
  if (!data) {
    if (isOnboardingComplete()) {
      return true;
    }
    return false;
  }
  try {
    return JSON.parse(data) === true;
  } catch {
    return false;
  }
}

export function setHasSeenWelcome(seen: boolean): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.HAS_SEEN_WELCOME, JSON.stringify(seen));
}

export interface OnboardingData {
  name: string;
  dateOfBirth?: string;
  timeOfBirth?: string;
  cityOfBirth?: string;
  birthTimeKnown?: boolean;
  currentElement?: Element | null;
  intention?: string;
  spiritualStyle?: SpiritualStyle;
}

export function saveOnboardingData(data: Partial<OnboardingData>): void {
  if (!isBrowser()) return;
  const existing = getOnboardingData();
  const merged = { ...existing, ...data };
  localStorage.setItem(STORAGE_KEYS.ONBOARDING_DATA, JSON.stringify(merged));
}

export function getOnboardingData(): OnboardingData | null {
  if (!isBrowser()) return null;
  const data = localStorage.getItem(STORAGE_KEYS.ONBOARDING_DATA);
  if (!data) return null;
  try {
    return JSON.parse(data) as OnboardingData;
  } catch {
    return null;
  }
}

export function clearOnboardingData(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEYS.ONBOARDING_DATA);
}

export function clearAllData(): void {
  if (!isBrowser()) return;
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}

export function getSubscription(): Subscription {
  if (!isBrowser()) return { tier: "free", status: "active" };
  const data = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION);
  if (!data) {
    return { tier: "free", status: "active" };
  }
  try {
    return JSON.parse(data) as Subscription;
  } catch {
    return { tier: "free", status: "active" };
  }
}

export function saveSubscription(subscription: Subscription): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(subscription));
}

export function startFreeTrial(): void {
  if (!isBrowser()) return;
  const trialEnd = new Date();
  trialEnd.setDate(trialEnd.getDate() + 7);
  
  const subscription: Subscription = {
    tier: "premium",
    status: "trialing",
    trialEndDate: trialEnd.toISOString(),
  };
  saveSubscription(subscription);
}

export function startTrialWithEndDate(trialEndDate: string, billingCycle: "monthly" | "yearly" = "yearly"): void {
  if (!isBrowser()) return;
  
  const subscription: Subscription = {
    tier: "premium",
    status: "trialing",
    trialEndDate: trialEndDate,
    billingCycle: billingCycle,
  };
  saveSubscription(subscription);
}

export function upgradeToPremium(billingCycle: "monthly" | "yearly"): void {
  if (!isBrowser()) return;
  const renewalDate = new Date();
  if (billingCycle === "monthly") {
    renewalDate.setMonth(renewalDate.getMonth() + 1);
  } else {
    renewalDate.setFullYear(renewalDate.getFullYear() + 1);
  }
  
  const subscription: Subscription = {
    tier: "premium",
    status: "active",
    billingCycle,
    renewalDate: renewalDate.toISOString(),
  };
  saveSubscription(subscription);
}

export function upgradeToInitiates(): void {
  if (!isBrowser()) return;
  const renewalDate = new Date();
  renewalDate.setFullYear(renewalDate.getFullYear() + 1);
  
  const subscription: Subscription = {
    tier: "initiates",
    status: "active",
    billingCycle: "yearly",
    renewalDate: renewalDate.toISOString(),
  };
  saveSubscription(subscription);
}

export function upgradeToAscended(billingCycle: "monthly" | "yearly"): void {
  if (!isBrowser()) return;
  const renewalDate = new Date();
  if (billingCycle === "monthly") {
    renewalDate.setMonth(renewalDate.getMonth() + 1);
  } else {
    renewalDate.setFullYear(renewalDate.getFullYear() + 1);
  }
  
  const subscription: Subscription = {
    tier: "ascended",
    status: "active",
    billingCycle,
    renewalDate: renewalDate.toISOString(),
  };
  saveSubscription(subscription);
}

export function cancelSubscription(): void {
  if (!isBrowser()) return;
  const subscription: Subscription = {
    tier: "free",
    status: "active",
  };
  saveSubscription(subscription);
}

export function getTodayUsage(): UsageTracking {
  if (!isBrowser()) return { date: new Date().toDateString(), affirmationsUsed: 0, journalEntriesUsed: 0, astrologyInsightsUsed: 0 };
  const data = localStorage.getItem(STORAGE_KEYS.USAGE_TRACKING);
  const today = new Date().toDateString();
  
  if (!data) {
    return { date: today, affirmationsUsed: 0, journalEntriesUsed: 0, astrologyInsightsUsed: 0 };
  }
  
  try {
    const usage = JSON.parse(data) as UsageTracking;
    if (usage.date !== today) {
      return { date: today, affirmationsUsed: 0, journalEntriesUsed: 0, astrologyInsightsUsed: 0 };
    }
    return usage;
  } catch {
    return { date: today, affirmationsUsed: 0, journalEntriesUsed: 0, astrologyInsightsUsed: 0 };
  }
}

export function saveUsage(usage: UsageTracking): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.USAGE_TRACKING, JSON.stringify(usage));
}

export function incrementAffirmationUsage(): boolean {
  const tier = getCurrentTier();
  const limits = tierLimits[tier];
  const usage = getTodayUsage();
  
  if (usage.affirmationsUsed >= limits.affirmations) {
    return false;
  }
  
  usage.affirmationsUsed += 1;
  saveUsage(usage);
  return true;
}

export function incrementJournalUsage(): boolean {
  const tier = getCurrentTier();
  const limits = tierLimits[tier];
  const usage = getTodayUsage();
  
  if (usage.journalEntriesUsed >= limits.journals) {
    return false;
  }
  
  usage.journalEntriesUsed += 1;
  saveUsage(usage);
  return true;
}

export function incrementAstrologyUsage(): boolean {
  const tier = getCurrentTier();
  const limits = tierLimits[tier];
  const usage = getTodayUsage();
  
  if (usage.astrologyInsightsUsed >= limits.astrologyInsights) {
    return false;
  }
  
  usage.astrologyInsightsUsed += 1;
  saveUsage(usage);
  return true;
}

export function getRemainingUsage(): { affirmations: number; journals: number; astrologyInsights: number } {
  const tier = getCurrentTier();
  const limits = tierLimits[tier];
  const usage = getTodayUsage();
  
  return {
    affirmations: Math.max(0, limits.affirmations - usage.affirmationsUsed),
    journals: Math.max(0, limits.journals - usage.journalEntriesUsed),
    astrologyInsights: Math.max(0, limits.astrologyInsights - usage.astrologyInsightsUsed),
  };
}

export function canAccessGoldenDawn(): boolean {
  return true;
}

export function canAccessEnergyWall(): boolean {
  return true;
}

export function hasFeatureAccess(feature: string): boolean {
  return true;
}

export function isTrialExpired(): boolean {
  const subscription = getSubscription();
  if (subscription.status !== "trialing" || !subscription.trialEndDate) {
    return false;
  }
  return new Date() > new Date(subscription.trialEndDate);
}

export function getCurrentTier(): SubscriptionTier {
  const subscription = getSubscription();
  if (isTrialExpired()) {
    return "free";
  }
  return subscription.tier;
}

/**
 * Centralized helper for premium feature access.
 * All features are now free for everyone.
 */
export function hasPremiumAccess(): boolean {
  return true;
}

/**
 * Check if user is currently on a free trial
 */
export function isOnFreeTrial(): boolean {
  const subscription = getSubscription();
  return subscription.status === "trialing" && !isTrialExpired();
}

/**
 * Get trial end date if on trial
 */
export function getTrialEndDate(): Date | null {
  const subscription = getSubscription();
  if (subscription.status === "trialing" && subscription.trialEndDate) {
    return new Date(subscription.trialEndDate);
  }
  return null;
}

export function getBetaFeaturesEnabled(): boolean {
  if (!isBrowser()) return false;
  const data = localStorage.getItem(STORAGE_KEYS.BETA_FEATURES);
  if (!data) return false;
  try {
    return JSON.parse(data) === true;
  } catch {
    return false;
  }
}

export function setBetaFeaturesEnabled(enabled: boolean): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.BETA_FEATURES, JSON.stringify(enabled));
}

export function hasSeenGoldenDawnWelcome(): boolean {
  if (!isBrowser()) return true;
  const data = localStorage.getItem(STORAGE_KEYS.GOLDEN_DAWN_WELCOME_SEEN);
  if (!data) return false;
  try {
    return JSON.parse(data) === true;
  } catch {
    return false;
  }
}

export function setGoldenDawnWelcomeSeen(seen: boolean): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.GOLDEN_DAWN_WELCOME_SEEN, JSON.stringify(seen));
}

export function getSpiritualStyle(): SpiritualStyle {
  const profile = getUserProfile();
  return profile?.spiritualStyle || "archetype";
}

export function saveSpiritualStyle(style: SpiritualStyle): void {
  if (!isBrowser()) return;
  const profile = getUserProfile();
  if (profile) {
    profile.spiritualStyle = style;
    saveUserProfile(profile);
  }
}

export function getSavedSubliminals(): SavedSubliminal[] {
  if (!isBrowser()) return [];
  const data = localStorage.getItem(STORAGE_KEYS.SAVED_SUBLIMINALS);
  if (!data) return [];
  try {
    return JSON.parse(data) as SavedSubliminal[];
  } catch {
    return [];
  }
}

export function saveSubliminal(subliminal: SavedSubliminal): void {
  if (!isBrowser()) return;
  const subliminals = getSavedSubliminals();
  subliminals.unshift(subliminal);
  localStorage.setItem(STORAGE_KEYS.SAVED_SUBLIMINALS, JSON.stringify(subliminals.slice(0, 50)));
}

export function updateSubliminalTitle(id: string, newTitle: string): void {
  if (!isBrowser()) return;
  const subliminals = getSavedSubliminals();
  const index = subliminals.findIndex(s => s.id === id);
  if (index !== -1) {
    subliminals[index].title = newTitle;
    localStorage.setItem(STORAGE_KEYS.SAVED_SUBLIMINALS, JSON.stringify(subliminals));
  }
}

export function deleteSavedSubliminal(id: string): void {
  if (!isBrowser()) return;
  const subliminals = getSavedSubliminals();
  const filtered = subliminals.filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEYS.SAVED_SUBLIMINALS, JSON.stringify(filtered));
}
