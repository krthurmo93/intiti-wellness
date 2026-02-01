import {
  users,
  moodEntries,
  intentions,
  dreamEntries,
  featureUsage,
  tarotReadings,
  intentionPrompts,
  claritySessions,
  sleepRituals,
  subliminals,
  type User,
  type UpsertUser,
  type InsertMoodEntry,
  type SelectMoodEntry,
  type InsertIntention,
  type SelectIntention,
  type InsertDreamEntry,
  type SelectDreamEntry,
  type InsertFeatureUsage,
  type SelectFeatureUsage,
  type InsertTarotReading,
  type SelectTarotReading,
  type InsertIntentionPrompt,
  type SelectIntentionPrompt,
  type InsertClaritySession,
  type SelectClaritySession,
  type InsertSleepRitual,
  type SelectSleepRitual,
  type InsertSubliminal,
  type SelectSubliminal,
  type AIFeature,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, data: Partial<UpsertUser>): Promise<User | undefined>;
  
  getMoodEntries(userId: string): Promise<SelectMoodEntry[]>;
  createMoodEntry(entry: InsertMoodEntry): Promise<SelectMoodEntry>;
  deleteMoodEntry(id: string, userId: string): Promise<void>;
  syncMoodEntries(userId: string, entries: InsertMoodEntry[]): Promise<SelectMoodEntry[]>;
  
  getIntentions(userId: string): Promise<SelectIntention[]>;
  createIntention(intention: InsertIntention): Promise<SelectIntention>;
  updateIntention(id: string, userId: string, data: Partial<InsertIntention>): Promise<SelectIntention | undefined>;
  deleteIntention(id: string, userId: string): Promise<void>;
  syncIntentions(userId: string, intentionList: InsertIntention[]): Promise<SelectIntention[]>;
  
  getDreamEntries(userId: string): Promise<SelectDreamEntry[]>;
  getDreamEntry(id: string, userId: string): Promise<SelectDreamEntry | undefined>;
  createDreamEntry(entry: InsertDreamEntry): Promise<SelectDreamEntry>;
  updateDreamEntry(id: string, userId: string, data: Partial<InsertDreamEntry>): Promise<SelectDreamEntry | undefined>;
  deleteDreamEntry(id: string, userId: string): Promise<void>;
  getDreamEntriesToday(userId: string): Promise<number>;
  
  // Feature usage tracking
  getFeatureUsage(userId: string, feature: AIFeature, date: string): Promise<number>;
  incrementFeatureUsage(userId: string, feature: AIFeature): Promise<number>;
  getAllFeatureUsage(userId: string, date: string): Promise<Record<AIFeature, number>>;
  
  // Tarot readings
  getTarotReadings(userId: string, limit?: number): Promise<SelectTarotReading[]>;
  createTarotReading(reading: InsertTarotReading): Promise<SelectTarotReading>;
  
  // Intention prompts
  getIntentionPrompts(userId: string, limit?: number): Promise<SelectIntentionPrompt[]>;
  createIntentionPrompt(prompt: InsertIntentionPrompt): Promise<SelectIntentionPrompt>;
  
  // Clarity sessions
  getClaritySessions(userId: string, limit?: number): Promise<SelectClaritySession[]>;
  createClaritySession(session: InsertClaritySession): Promise<SelectClaritySession>;
  
  // Sleep rituals
  getSleepRituals(userId: string, limit?: number): Promise<SelectSleepRitual[]>;
  createSleepRitual(ritual: InsertSleepRitual): Promise<SelectSleepRitual>;
  
  // Subliminals
  getSubliminals(userId: string): Promise<SelectSubliminal[]>;
  getSubliminal(id: string, userId: string): Promise<SelectSubliminal | undefined>;
  createSubliminal(subliminal: InsertSubliminal): Promise<SelectSubliminal>;
  deleteSubliminal(id: string, userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUser(id: string, data: Partial<UpsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getMoodEntries(userId: string): Promise<SelectMoodEntry[]> {
    return db
      .select()
      .from(moodEntries)
      .where(eq(moodEntries.userId, userId))
      .orderBy(desc(moodEntries.timestamp))
      .limit(100);
  }

  async createMoodEntry(entry: InsertMoodEntry): Promise<SelectMoodEntry> {
    const [created] = await db
      .insert(moodEntries)
      .values(entry)
      .returning();
    return created;
  }

  async deleteMoodEntry(id: string, userId: string): Promise<void> {
    await db
      .delete(moodEntries)
      .where(and(eq(moodEntries.id, id), eq(moodEntries.userId, userId)));
  }

  async syncMoodEntries(userId: string, entries: InsertMoodEntry[]): Promise<SelectMoodEntry[]> {
    if (entries.length === 0) {
      return this.getMoodEntries(userId);
    }
    
    for (const entry of entries) {
      const safeEntry = {
        id: entry.id,
        userId,
        mood: entry.mood,
        notes: entry.notes ?? null,
        element: entry.element ?? null,
        timestamp: entry.timestamp,
      };
      
      await db
        .insert(moodEntries)
        .values(safeEntry)
        .onConflictDoUpdate({
          target: moodEntries.id,
          set: {
            mood: safeEntry.mood,
            notes: safeEntry.notes,
            element: safeEntry.element,
            timestamp: safeEntry.timestamp,
          },
        });
    }
    
    return this.getMoodEntries(userId);
  }

  async getIntentions(userId: string): Promise<SelectIntention[]> {
    return db
      .select()
      .from(intentions)
      .where(eq(intentions.userId, userId))
      .orderBy(desc(intentions.timestamp))
      .limit(100);
  }

  async createIntention(intention: InsertIntention): Promise<SelectIntention> {
    const [created] = await db
      .insert(intentions)
      .values(intention)
      .returning();
    return created;
  }

  async updateIntention(id: string, userId: string, data: Partial<InsertIntention>): Promise<SelectIntention | undefined> {
    const [updated] = await db
      .update(intentions)
      .set(data)
      .where(and(eq(intentions.id, id), eq(intentions.userId, userId)))
      .returning();
    return updated;
  }

  async deleteIntention(id: string, userId: string): Promise<void> {
    await db
      .delete(intentions)
      .where(and(eq(intentions.id, id), eq(intentions.userId, userId)));
  }

  async syncIntentions(userId: string, intentionList: InsertIntention[]): Promise<SelectIntention[]> {
    if (intentionList.length === 0) {
      return this.getIntentions(userId);
    }
    
    for (const intention of intentionList) {
      const safeIntention = {
        id: intention.id,
        userId,
        text: intention.text,
        timestamp: intention.timestamp,
        completed: intention.completed ?? "false",
      };
      
      await db
        .insert(intentions)
        .values(safeIntention)
        .onConflictDoUpdate({
          target: intentions.id,
          set: {
            text: safeIntention.text,
            timestamp: safeIntention.timestamp,
            completed: safeIntention.completed,
          },
        });
    }
    
    return this.getIntentions(userId);
  }

  async getDreamEntries(userId: string): Promise<SelectDreamEntry[]> {
    return db
      .select()
      .from(dreamEntries)
      .where(eq(dreamEntries.userId, userId))
      .orderBy(desc(dreamEntries.createdAt))
      .limit(100);
  }

  async getDreamEntry(id: string, userId: string): Promise<SelectDreamEntry | undefined> {
    const [entry] = await db
      .select()
      .from(dreamEntries)
      .where(and(eq(dreamEntries.id, id), eq(dreamEntries.userId, userId)));
    return entry;
  }

  async createDreamEntry(entry: InsertDreamEntry): Promise<SelectDreamEntry> {
    const [created] = await db
      .insert(dreamEntries)
      .values(entry)
      .returning();
    return created;
  }

  async updateDreamEntry(id: string, userId: string, data: Partial<InsertDreamEntry>): Promise<SelectDreamEntry | undefined> {
    const [updated] = await db
      .update(dreamEntries)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(and(eq(dreamEntries.id, id), eq(dreamEntries.userId, userId)))
      .returning();
    return updated;
  }

  async deleteDreamEntry(id: string, userId: string): Promise<void> {
    await db
      .delete(dreamEntries)
      .where(and(eq(dreamEntries.id, id), eq(dreamEntries.userId, userId)));
  }

  async getDreamEntriesToday(userId: string): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    const entries = await db
      .select()
      .from(dreamEntries)
      .where(and(eq(dreamEntries.userId, userId), eq(dreamEntries.date, today)));
    return entries.length;
  }

  // Feature usage tracking
  async getFeatureUsage(userId: string, feature: AIFeature, date: string): Promise<number> {
    const [usage] = await db
      .select()
      .from(featureUsage)
      .where(and(
        eq(featureUsage.userId, userId),
        eq(featureUsage.feature, feature),
        eq(featureUsage.date, date)
      ));
    return usage ? parseInt(usage.count) : 0;
  }

  async incrementFeatureUsage(userId: string, feature: AIFeature): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    const [existing] = await db
      .select()
      .from(featureUsage)
      .where(and(
        eq(featureUsage.userId, userId),
        eq(featureUsage.feature, feature),
        eq(featureUsage.date, today)
      ));

    if (existing) {
      const newCount = parseInt(existing.count) + 1;
      await db
        .update(featureUsage)
        .set({ count: newCount.toString() })
        .where(eq(featureUsage.id, existing.id));
      return newCount;
    } else {
      await db.insert(featureUsage).values({
        userId,
        feature,
        date: today,
        count: "1",
      });
      return 1;
    }
  }

  async getAllFeatureUsage(userId: string, date: string): Promise<Record<AIFeature, number>> {
    const usages = await db
      .select()
      .from(featureUsage)
      .where(and(eq(featureUsage.userId, userId), eq(featureUsage.date, date)));
    
    const result: Record<AIFeature, number> = {
      tarot: 0,
      intentions: 0,
      clarity: 0,
      sleep_ritual: 0,
      subliminals: 0,
    };
    
    for (const usage of usages) {
      if (usage.feature in result) {
        result[usage.feature as AIFeature] = parseInt(usage.count);
      }
    }
    
    return result;
  }

  // Tarot readings
  async getTarotReadings(userId: string, limit: number = 10): Promise<SelectTarotReading[]> {
    return db
      .select()
      .from(tarotReadings)
      .where(eq(tarotReadings.userId, userId))
      .orderBy(desc(tarotReadings.createdAt))
      .limit(limit);
  }

  async createTarotReading(reading: InsertTarotReading): Promise<SelectTarotReading> {
    const [created] = await db
      .insert(tarotReadings)
      .values(reading)
      .returning();
    return created;
  }

  // Intention prompts
  async getIntentionPrompts(userId: string, limit: number = 20): Promise<SelectIntentionPrompt[]> {
    return db
      .select()
      .from(intentionPrompts)
      .where(eq(intentionPrompts.userId, userId))
      .orderBy(desc(intentionPrompts.createdAt))
      .limit(limit);
  }

  async createIntentionPrompt(prompt: InsertIntentionPrompt): Promise<SelectIntentionPrompt> {
    const [created] = await db
      .insert(intentionPrompts)
      .values(prompt)
      .returning();
    return created;
  }

  // Clarity sessions
  async getClaritySessions(userId: string, limit: number = 20): Promise<SelectClaritySession[]> {
    return db
      .select()
      .from(claritySessions)
      .where(eq(claritySessions.userId, userId))
      .orderBy(desc(claritySessions.createdAt))
      .limit(limit);
  }

  async createClaritySession(session: InsertClaritySession): Promise<SelectClaritySession> {
    const [created] = await db
      .insert(claritySessions)
      .values(session)
      .returning();
    return created;
  }

  // Sleep rituals
  async getSleepRituals(userId: string, limit: number = 20): Promise<SelectSleepRitual[]> {
    return db
      .select()
      .from(sleepRituals)
      .where(eq(sleepRituals.userId, userId))
      .orderBy(desc(sleepRituals.createdAt))
      .limit(limit);
  }

  async createSleepRitual(ritual: InsertSleepRitual): Promise<SelectSleepRitual> {
    const [created] = await db
      .insert(sleepRituals)
      .values(ritual)
      .returning();
    return created;
  }

  // Subliminals
  async getSubliminals(userId: string): Promise<SelectSubliminal[]> {
    return db
      .select()
      .from(subliminals)
      .where(eq(subliminals.userId, userId))
      .orderBy(desc(subliminals.createdAt));
  }

  async getSubliminal(id: string, userId: string): Promise<SelectSubliminal | undefined> {
    const [subliminal] = await db
      .select()
      .from(subliminals)
      .where(and(eq(subliminals.id, id), eq(subliminals.userId, userId)));
    return subliminal;
  }

  async createSubliminal(subliminal: InsertSubliminal): Promise<SelectSubliminal> {
    const [created] = await db
      .insert(subliminals)
      .values(subliminal)
      .returning();
    return created;
  }

  async deleteSubliminal(id: string, userId: string): Promise<void> {
    await db
      .delete(subliminals)
      .where(and(eq(subliminals.id, id), eq(subliminals.userId, userId)));
  }
}

export const storage = new DatabaseStorage();
