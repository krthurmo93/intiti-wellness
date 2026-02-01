import type { Express } from "express";
import { createServer, type Server } from "http";
import OpenAI from "openai";
import { z } from "zod";
import { calculateBirthChart } from "./astrology";
import { 
  pricingPlans, 
  userProfileUpdateSchema,
  moodEntryInputSchema,
  moodEntrySyncSchema,
  intentionInputSchema,
  intentionSyncSchema,
  intentionUpdateSchema,
  dreamEntryInputSchema,
  betaLimits,
  tarotReadingInputSchema,
  clarityInputSchema,
  subliminalInputSchema,
  featureTierLimits,
  tarotSpreadAccess,
  majorArcana,
  minorArcanaSuits,
  minorArcanaRanks,
  type AIFeature,
  type SubscriptionTier,
  type TarotCard,
  type TarotSpreadType,
} from "@shared/schema";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { storage } from "./storage";
import { getCosmicDailyAffirmation, getPersonalizedCosmicAffirmation } from "@shared/cosmicAffirmations";

const affirmationRequestSchema = z.object({
  sunSign: z.string().optional(),
  moonSign: z.string().optional(),
  element: z.enum(["fire", "water", "air", "earth", "cosmic"]),
});

const elementDescriptions: Record<string, string> = {
  fire: "passionate, energetic, and action-oriented",
  water: "intuitive, emotional, and deeply connected",
  air: "intellectual, communicative, and social",
  earth: "grounded, practical, and stable",
  cosmic: "mystical, open, and dwelling in the in-between",
};

const signQualities: Record<string, string> = {
  Aries: "courage and initiative",
  Taurus: "stability and sensuality",
  Gemini: "curiosity and adaptability",
  Cancer: "nurturing and intuition",
  Leo: "creativity and self-expression",
  Virgo: "service and refinement",
  Libra: "harmony and partnership",
  Scorpio: "transformation and depth",
  Sagittarius: "adventure and wisdom",
  Capricorn: "ambition and discipline",
  Aquarius: "innovation and humanitarianism",
  Pisces: "compassion and imagination",
};

const birthChartRequestSchema = z.object({
  dateOfBirth: z.string(),
  timeOfBirth: z.string().optional().default("12:00"),
  cityOfBirth: z.string(),
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  await setupAuth(app);

  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.put('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      const result = userProfileUpdateSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid profile data", 
          errors: result.error.flatten().fieldErrors 
        });
      }
      
      const validatedData = result.data;
      
      if (Object.keys(validatedData).length === 0) {
        return res.status(400).json({ message: "No valid fields to update" });
      }
      
      const updateData: Record<string, any> = {};
      for (const [key, value] of Object.entries(validatedData)) {
        if (value !== undefined) {
          updateData[key] = value === null ? null : 
            (typeof value === 'boolean' ? String(value) : value);
        }
      }
      
      const user = await storage.updateUser(userId, updateData);
      res.json(user);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.get('/api/auth/subscription', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({
        tier: user.subscriptionTier || "free",
        hasUsedTrial: user.hasUsedTrial === "true",
      });
    } catch (error) {
      console.error("Error fetching subscription:", error);
      res.status(500).json({ message: "Failed to fetch subscription" });
    }
  });

  app.post("/api/birth-chart", async (req, res) => {
    try {
      const result = birthChartRequestSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ error: "Invalid request body", details: result.error });
      }
      
      const { dateOfBirth, timeOfBirth, cityOfBirth } = result.data;
      const chart = calculateBirthChart(dateOfBirth, timeOfBirth || "12:00", cityOfBirth);
      
      res.json(chart);
    } catch (error) {
      console.error("Error calculating birth chart:", error);
      res.status(500).json({ error: "Failed to calculate birth chart" });
    }
  });

  app.get('/api/auth/moods', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const moods = await storage.getMoodEntries(userId);
      res.json(moods);
    } catch (error) {
      console.error("Error fetching mood entries:", error);
      res.status(500).json({ message: "Failed to fetch mood entries" });
    }
  });

  app.post('/api/auth/moods', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const result = moodEntryInputSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid mood entry data",
          errors: result.error.flatten().fieldErrors 
        });
      }
      
      const { id, mood, notes, element, timestamp } = result.data;
      const entry = await storage.createMoodEntry({
        id,
        userId,
        mood,
        notes: notes ?? null,
        element: element ?? null,
        timestamp,
      });
      res.json(entry);
    } catch (error) {
      console.error("Error creating mood entry:", error);
      res.status(500).json({ message: "Failed to create mood entry" });
    }
  });

  app.post('/api/auth/moods/sync', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const result = moodEntrySyncSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid sync data",
          errors: result.error.flatten().fieldErrors 
        });
      }
      
      const validatedEntries = result.data.entries.map(e => ({
        id: e.id,
        userId,
        mood: e.mood,
        notes: e.notes ?? null,
        element: e.element ?? null,
        timestamp: e.timestamp,
      }));
      
      const synced = await storage.syncMoodEntries(userId, validatedEntries);
      res.json(synced);
    } catch (error) {
      console.error("Error syncing mood entries:", error);
      res.status(500).json({ message: "Failed to sync mood entries" });
    }
  });

  app.delete('/api/auth/moods/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      await storage.deleteMoodEntry(id, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting mood entry:", error);
      res.status(500).json({ message: "Failed to delete mood entry" });
    }
  });

  app.get('/api/auth/intentions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const intentionsList = await storage.getIntentions(userId);
      res.json(intentionsList);
    } catch (error) {
      console.error("Error fetching intentions:", error);
      res.status(500).json({ message: "Failed to fetch intentions" });
    }
  });

  app.post('/api/auth/intentions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const result = intentionInputSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid intention data",
          errors: result.error.flatten().fieldErrors 
        });
      }
      
      const { id, text, timestamp, completed } = result.data;
      const intention = await storage.createIntention({
        id,
        userId,
        text,
        timestamp,
        completed: completed ? "true" : "false",
      });
      res.json(intention);
    } catch (error) {
      console.error("Error creating intention:", error);
      res.status(500).json({ message: "Failed to create intention" });
    }
  });

  app.post('/api/auth/intentions/sync', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const result = intentionSyncSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid sync data",
          errors: result.error.flatten().fieldErrors 
        });
      }
      
      const validatedIntentions = result.data.intentions.map(i => ({
        id: i.id,
        userId,
        text: i.text,
        timestamp: i.timestamp,
        completed: i.completed ? "true" : "false",
      }));
      
      const synced = await storage.syncIntentions(userId, validatedIntentions);
      res.json(synced);
    } catch (error) {
      console.error("Error syncing intentions:", error);
      res.status(500).json({ message: "Failed to sync intentions" });
    }
  });

  app.put('/api/auth/intentions/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      const result = intentionUpdateSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid update data",
          errors: result.error.flatten().fieldErrors 
        });
      }
      
      const updateData: Record<string, any> = {};
      if (result.data.text !== undefined) updateData.text = result.data.text;
      if (result.data.completed !== undefined) updateData.completed = result.data.completed ? "true" : "false";
      
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "No valid fields to update" });
      }
      
      const updated = await storage.updateIntention(id, userId, updateData);
      if (!updated) {
        return res.status(404).json({ message: "Intention not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating intention:", error);
      res.status(500).json({ message: "Failed to update intention" });
    }
  });

  app.delete('/api/auth/intentions/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      await storage.deleteIntention(id, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting intention:", error);
      res.status(500).json({ message: "Failed to delete intention" });
    }
  });
  
  app.get("/api/affirmation", async (req, res) => {
    try {
      const sunSign = req.query.sunSign as string | undefined;
      const moonSign = req.query.moonSign as string | undefined;
      const element = req.query.element as string;

      if (!element) {
        return res.status(400).json({ error: "Missing element parameter" });
      }

      const affirmation = await generateAffirmation(element, sunSign, moonSign);
      res.json({ affirmation });
    } catch (error) {
      console.error("Error generating affirmation:", error);
      res.status(500).json({ error: "Failed to generate affirmation" });
    }
  });

  app.post("/api/affirmation", async (req, res) => {
    try {
      const result = affirmationRequestSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ error: "Invalid request body" });
      }

      const { sunSign, moonSign, element } = result.data;
      const affirmation = await generateAffirmation(element, sunSign, moonSign);
      res.json({ affirmation });
    } catch (error) {
      console.error("Error generating affirmation:", error);
      res.status(500).json({ error: "Failed to generate affirmation" });
    }
  });

  app.get('/api/auth/dreams', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const dreams = await storage.getDreamEntries(userId);
      res.json(dreams);
    } catch (error) {
      console.error("Error fetching dream entries:", error);
      res.status(500).json({ message: "Failed to fetch dream entries" });
    }
  });

  app.get('/api/auth/dreams/usage', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const usedToday = await storage.getDreamEntriesToday(userId);
      res.json({ 
        used: usedToday, 
        limit: betaLimits.dreamEntriesPerDay,
        remaining: Math.max(0, betaLimits.dreamEntriesPerDay - usedToday)
      });
    } catch (error) {
      console.error("Error fetching dream usage:", error);
      res.status(500).json({ message: "Failed to fetch dream usage" });
    }
  });

  app.get('/api/auth/dreams/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      const dream = await storage.getDreamEntry(id, userId);
      if (!dream) {
        return res.status(404).json({ message: "Dream entry not found" });
      }
      res.json(dream);
    } catch (error) {
      console.error("Error fetching dream entry:", error);
      res.status(500).json({ message: "Failed to fetch dream entry" });
    }
  });

  app.post('/api/auth/dreams', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const result = dreamEntryInputSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid dream entry data",
          errors: result.error.flatten().fieldErrors 
        });
      }

      const usedToday = await storage.getDreamEntriesToday(userId);
      if (usedToday >= betaLimits.dreamEntriesPerDay) {
        return res.status(429).json({ 
          message: "Daily dream entry limit reached",
          limit: betaLimits.dreamEntriesPerDay
        });
      }
      
      const { date, title, content, mood } = result.data;
      const entry = await storage.createDreamEntry({
        id: crypto.randomUUID(),
        userId,
        date,
        title,
        content,
        mood: mood ?? null,
        aiInsight: null,
      });
      res.json(entry);
    } catch (error) {
      console.error("Error creating dream entry:", error);
      res.status(500).json({ message: "Failed to create dream entry" });
    }
  });

  app.put('/api/auth/dreams/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      const result = dreamEntryInputSchema.partial().safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid dream entry data",
          errors: result.error.flatten().fieldErrors 
        });
      }
      
      const updated = await storage.updateDreamEntry(id, userId, result.data);
      if (!updated) {
        return res.status(404).json({ message: "Dream entry not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating dream entry:", error);
      res.status(500).json({ message: "Failed to update dream entry" });
    }
  });

  app.delete('/api/auth/dreams/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      await storage.deleteDreamEntry(id, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting dream entry:", error);
      res.status(500).json({ message: "Failed to delete dream entry" });
    }
  });

  app.post('/api/auth/dreams/:id/interpret', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      
      const dream = await storage.getDreamEntry(id, userId);
      if (!dream) {
        return res.status(404).json({ message: "Dream entry not found" });
      }
      
      const interpretation = await generateDreamInterpretation(dream.content, dream.mood);
      
      const updated = await storage.updateDreamEntry(id, userId, {
        aiInsight: interpretation,
      });
      
      res.json(updated);
    } catch (error) {
      console.error("Error interpreting dream:", error);
      res.status(500).json({ message: "Failed to interpret dream" });
    }
  });

  const meditationRequestSchema = z.object({
    theme: z.enum(["calm", "focus", "sleep", "gratitude", "energy", "healing"]),
    duration: z.enum(["short", "medium", "long"]),
    element: z.enum(["fire", "water", "air", "earth", "cosmic"]).optional(),
  });

  app.post('/api/auth/meditation/generate', isAuthenticated, async (req: any, res) => {
    try {
      const result = meditationRequestSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid meditation request",
          errors: result.error.flatten().fieldErrors 
        });
      }
      
      const { theme, duration, element } = result.data;
      const meditationResult = await generateMeditationScript(theme, duration, element);
      
      res.json({ 
        script: meditationResult.script, 
        audioBase64: meditationResult.audioBase64,
        voice: meditationResult.voice,
        theme, 
        duration, 
        element 
      });
    } catch (error) {
      console.error("Error generating meditation:", error);
      res.status(500).json({ message: "Failed to generate meditation" });
    }
  });

  // =====================================================
  // Feature Usage Tracking
  // =====================================================
  
  app.get('/api/auth/usage', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const today = new Date().toISOString().split('T')[0];
      const usage = await storage.getAllFeatureUsage(userId, today);
      const user = await storage.getUser(userId);
      const tier = (user?.subscriptionTier || "free") as SubscriptionTier;
      const limits = featureTierLimits[tier];
      
      res.json({ usage, limits, tier });
    } catch (error) {
      console.error("Error fetching usage:", error);
      res.status(500).json({ message: "Failed to fetch usage" });
    }
  });

  // =====================================================
  // AI TAROT ROUTES
  // =====================================================
  
  app.get('/api/auth/tarot/history', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const readings = await storage.getTarotReadings(userId, 10);
      res.json(readings);
    } catch (error) {
      console.error("Error fetching tarot history:", error);
      res.status(500).json({ message: "Failed to fetch tarot history" });
    }
  });

  app.post('/api/auth/tarot/draw', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const result = tarotReadingInputSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid tarot request",
          errors: result.error.flatten().fieldErrors 
        });
      }
      
      const { spreadType, question } = result.data;
      
      const user = await storage.getUser(userId);
      const tier = (user?.subscriptionTier || "free") as SubscriptionTier;
      
      if (!tarotSpreadAccess[tier].includes(spreadType)) {
        return res.status(403).json({ 
          message: "This spread type is not available for your subscription tier",
          requiredTier: spreadType === "single" ? "premium" : spreadType === "three_card" ? "ascended" : "initiates"
        });
      }
      
      const today = new Date().toISOString().split('T')[0];
      const currentUsage = await storage.getFeatureUsage(userId, "tarot", today);
      const limit = featureTierLimits[tier].tarot;
      
      if (currentUsage >= limit) {
        return res.status(429).json({ 
          message: "You've reached today's tarot reading limit",
          limit,
          used: currentUsage
        });
      }
      
      const cards = drawTarotCards(spreadType);
      const interpretation = await generateTarotInterpretation(cards, question, user);
      
      await storage.incrementFeatureUsage(userId, "tarot");
      
      const reading = await storage.createTarotReading({
        userId,
        spreadType,
        question: question || null,
        cards,
        interpretation,
      });
      
      res.json(reading);
    } catch (error) {
      console.error("Error drawing tarot:", error);
      res.status(500).json({ message: "Failed to draw tarot cards" });
    }
  });

  // =====================================================
  // INTENTION PROMPTS ROUTES
  // =====================================================
  
  app.get('/api/auth/intention-prompts/history', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const prompts = await storage.getIntentionPrompts(userId, 20);
      res.json(prompts);
    } catch (error) {
      console.error("Error fetching intention prompts:", error);
      res.status(500).json({ message: "Failed to fetch intention prompts" });
    }
  });

  app.post('/api/auth/intention-prompts/generate', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      const tier = (user?.subscriptionTier || "free") as SubscriptionTier;
      
      const today = new Date().toISOString().split('T')[0];
      const currentUsage = await storage.getFeatureUsage(userId, "intentions", today);
      const limit = featureTierLimits[tier].intentions;
      
      if (currentUsage >= limit) {
        return res.status(429).json({ 
          message: "You've reached today's intention prompt limit",
          limit,
          used: currentUsage
        });
      }
      
      const prompt = await generateIntentionPrompt(user, tier);
      
      await storage.incrementFeatureUsage(userId, "intentions");
      
      const saved = await storage.createIntentionPrompt({
        userId,
        prompt,
        response: null,
      });
      
      res.json(saved);
    } catch (error) {
      console.error("Error generating intention prompt:", error);
      res.status(500).json({ message: "Failed to generate intention prompt" });
    }
  });

  // =====================================================
  // CLARITY PORTAL ROUTES
  // =====================================================
  
  app.get('/api/auth/clarity/history', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessions = await storage.getClaritySessions(userId, 20);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching clarity sessions:", error);
      res.status(500).json({ message: "Failed to fetch clarity sessions" });
    }
  });

  app.post('/api/auth/clarity', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const result = clarityInputSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid clarity request",
          errors: result.error.flatten().fieldErrors 
        });
      }
      
      const { question, focusArea } = result.data;
      const user = await storage.getUser(userId);
      const tier = (user?.subscriptionTier || "free") as SubscriptionTier;
      const trialBypass = req.body.trialBypass === true;
      
      // Premium tiers that have access
      const hasPremiumAccess = tier === "initiates" || tier === "premium" || tier === "ascended";
      
      if (tier === "free" && !trialBypass && !hasPremiumAccess) {
        return res.status(403).json({ 
          message: "Ask for Clarity requires a Premium subscription or higher"
        });
      }
      
      const today = new Date().toISOString().split('T')[0];
      const currentUsage = await storage.getFeatureUsage(userId, "clarity", today);
      const limit = featureTierLimits[tier].clarity;
      
      if (currentUsage >= limit) {
        return res.status(429).json({ 
          message: "You've reached today's clarity session limit",
          limit,
          used: currentUsage
        });
      }
      
      const guidance = await generateClarityGuidance(question, focusArea, user, tier);
      
      await storage.incrementFeatureUsage(userId, "clarity");
      
      const session = await storage.createClaritySession({
        userId,
        question,
        focusArea,
        guidance,
      });
      
      res.json(session);
    } catch (error) {
      console.error("Error generating clarity guidance:", error);
      res.status(500).json({ message: "Failed to generate clarity guidance" });
    }
  });

  // =====================================================
  // SLEEP RITUAL ROUTES
  // =====================================================
  
  app.get('/api/auth/sleep/history', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const rituals = await storage.getSleepRituals(userId, 20);
      res.json(rituals);
    } catch (error) {
      console.error("Error fetching sleep rituals:", error);
      res.status(500).json({ message: "Failed to fetch sleep rituals" });
    }
  });

  app.post('/api/auth/sleep/generate', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      const tier = (user?.subscriptionTier || "free") as SubscriptionTier;
      
      const today = new Date().toISOString().split('T')[0];
      const currentUsage = await storage.getFeatureUsage(userId, "sleep_ritual", today);
      const limit = featureTierLimits[tier].sleep_ritual;
      
      if (currentUsage >= limit) {
        return res.status(429).json({ 
          message: "You've reached today's sleep ritual limit",
          limit,
          used: currentUsage
        });
      }
      
      const ritual = await generateSleepRitual(user, tier);
      
      await storage.incrementFeatureUsage(userId, "sleep_ritual");
      
      const saved = await storage.createSleepRitual({
        userId,
        reflection: ritual.reflection,
        breathwork: ritual.breathwork,
        intention: ritual.intention,
        tarotInsight: ritual.tarotInsight || null,
        meditation: ritual.meditation || null,
        subliminalSuggestion: ritual.subliminalSuggestion || null,
      });
      
      res.json(saved);
    } catch (error) {
      console.error("Error generating sleep ritual:", error);
      res.status(500).json({ message: "Failed to generate sleep ritual" });
    }
  });

  // =====================================================
  // SUBLIMINALS ROUTES
  // =====================================================
  
  app.get('/api/auth/subliminals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const subliminalsList = await storage.getSubliminals(userId);
      res.json(subliminalsList);
    } catch (error) {
      console.error("Error fetching subliminals:", error);
      res.status(500).json({ message: "Failed to fetch subliminals" });
    }
  });

  app.post('/api/auth/subliminals/generate', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const result = subliminalInputSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid subliminal request",
          errors: result.error.flatten().fieldErrors 
        });
      }
      
      const { category, duration, intention, background, style } = result.data;
      const isDevelopment = process.env.NODE_ENV !== 'production';
      const betaBypass = isDevelopment && req.body.betaBypass === true;
      const trialBypass = req.body.trialBypass === true;
      const user = await storage.getUser(userId);
      const tier = (user?.subscriptionTier || "free") as SubscriptionTier;
      
      // Dev bypass: unlimited access for testing
      const devWhitelistEmails = ['stj6ckxdnx@privaterelay.appleid.com'];
      const isDevBypass = process.env.UNLIMITED_DEV === 'true' || 
                          devWhitelistEmails.includes(user?.email || '');
      
      // Premium tiers that have access
      const hasPremiumAccess = tier === "initiates" || tier === "premium" || tier === "ascended";
      
      if (tier === "free" && !betaBypass && !isDevBypass && !trialBypass && !hasPremiumAccess) {
        return res.status(403).json({ 
          message: "Subliminal generation requires a Premium subscription or higher"
        });
      }
      
      // Skip limit check for dev bypass users
      if (!isDevBypass) {
        const today = new Date().toISOString().split('T')[0];
        const currentUsage = await storage.getFeatureUsage(userId, "subliminals", today);
        const limit = featureTierLimits[tier].subliminals;
        
        if (currentUsage >= limit) {
          return res.status(429).json({ 
            message: "You've reached today's subliminal generation limit. Upgrade for more.",
            limit,
            used: currentUsage
          });
        }
      }
      
      const categoryLabels: Record<string, string> = {
        love_relationships: "Heart Opening",
        self_worth_confidence: "Self-Worth",
        money_overflow: "Abundance Flow",
        healing_nervous_system: "Nervous System Reset",
        protection_boundaries: "Sacred Boundaries",
        shadow_integration: "Shadow Work",
        spiritual_alignment: "Spiritual Alignment",
      };
      
      const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const title = `${categoryLabels[category]} — ${dateStr}`;
      const affirmations = await generateSubliminalAffirmations(category, intention, style, user);
      
      await storage.incrementFeatureUsage(userId, "subliminals");
      
      const subliminal = await storage.createSubliminal({
        id: crypto.randomUUID(),
        userId,
        title,
        category,
        intention,
        affirmations,
        background,
        duration,
        style,
      });
      
      res.json(subliminal);
    } catch (error) {
      console.error("Error generating subliminal:", error);
      res.status(500).json({ message: "Failed to generate subliminal" });
    }
  });

  app.delete('/api/auth/subliminals/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      await storage.deleteSubliminal(id, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting subliminal:", error);
      res.status(500).json({ message: "Failed to delete subliminal" });
    }
  });

  return httpServer;
}

async function generateDreamInterpretation(dreamContent: string, mood?: string | null): Promise<string> {
  const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;
  const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
  
  if (!baseURL || !apiKey) {
    return getFallbackDreamInterpretation(mood);
  }

  try {
    const openai = new OpenAI({ baseURL, apiKey });
    
    const moodContext = mood ? `The dreamer described the overall feeling as ${mood}.` : '';
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a gentle, intuitive dream interpreter who blends Jungian psychology with spiritual wisdom. Provide insightful, compassionate interpretations that help the dreamer understand potential meanings and symbols in their dreams. Keep interpretations positive and growth-oriented. Be concise but meaningful (2-3 paragraphs).`
        },
        {
          role: "user",
          content: `Please interpret this dream:\n\n"${dreamContent}"\n\n${moodContext}`
        }
      ],
      max_completion_tokens: 400,
    });

    return response.choices[0].message.content?.trim() || getFallbackDreamInterpretation(mood);
  } catch (error) {
    console.error("OpenAI API error for dream interpretation:", error);
    return getFallbackDreamInterpretation(mood);
  }
}

function getFallbackDreamInterpretation(mood?: string | null): string {
  const interpretations: Record<string, string> = {
    calm: "Your dream reflects a period of inner peace and harmony. The tranquil energy suggests your subconscious is processing experiences in a balanced way. This is a time of integration and acceptance.",
    confusing: "Dreams that feel puzzling often contain important messages from your deeper self. The confusion may represent aspects of your life that are seeking clarity. Trust that understanding will come with reflection.",
    scary: "Challenging dreams often arise when we're working through fears or facing necessary changes. Rather than seeing this as negative, consider what your subconscious might be preparing you to confront with courage.",
    powerful: "Your dream carries significant energy and transformation potential. These vivid experiences often mark periods of personal growth and awakening to new possibilities within yourself.",
    sweet: "The gentle, pleasant nature of your dream suggests contentment and positive emotional processing. Your subconscious is nurturing you with comforting imagery and peaceful resolution.",
  };
  
  return interpretations[mood || "calm"] || "Your dream contains meaningful symbols from your subconscious mind. Take time to reflect on the emotions and imagery that stood out most. Dreams often reveal insights about our inner world that our waking mind overlooks.";
}

// Voice mapping for meditation focuses - NEVER use "alloy"
const meditationVoiceMap: Record<string, "fable" | "onyx" | "echo" | "shimmer" | "nova"> = {
  calm: "fable",      // Soft, gentle, story-like tone
  focus: "onyx",      // Clear, grounded, slightly firmer tone
  sleep: "echo",      // Slow, soothing, low and relaxing
  gratitude: "shimmer", // Warm, bright, heart-opening
  energy: "nova",     // Upbeat and lively, still calm
  healing: "fable",   // Nurturing, comforting tone
};

// Focus-specific style instructions for meditation scripts
const meditationStyleGuides: Record<string, string> = {
  calm: `STYLE: Slow, spacious, very soothing. Focus on nervous system regulation, releasing tension in shoulders, jaw, and belly. Use short, reassuring phrases.
MUST INCLUDE:
- 4-7-8 breathing (inhale 4, hold 7, exhale 8) for at least 3 cycles
- Imagery: gentle light, warm water, or soft glow filling the body
- Closing affirmation: "I am held. I am safe. I am at ease."`,

  focus: `STYLE: More awake and structured but still soft. Emphasize clarity, single task focus, and mental organization. Avoid hype language. Support grounded productivity.
MUST INCLUDE:
- Simple box breathing (inhale 4, hold 4, exhale 4, hold 4) for a few cycles
- A moment where the listener imagines putting distractions into a container or box
- Closing affirmation: "My mind is clear. I move through my priorities with ease."`,

  sleep: `STYLE: Very slow, sleepy, and lulling. Sentences can be longer and more flowing. Avoid any stimulating language or calls to action.
MUST INCLUDE:
- Instructions to listen while already in bed or lying down
- A gentle body scan from head to toe releasing tension as they go
- Imagery: night sky, waves, or drifting on a cloud
- Closing: Give permission to drift off and not finish listening if they fall asleep`,

  gratitude: `STYLE: Warm, heart centered, gently uplifting. Focus on appreciation, small joys, and moments of support.
MUST INCLUDE:
- Prompts to remember 3 things or people they are grateful for
- A brief heart breathing exercise (imagine breathing in and out through the heart space)
- Closing affirmation: "My life is filled with quiet blessings."`,

  energy: `STYLE: Brighter and more activating but still grounded. Keep the pace slightly quicker, with some rhythmic repetition. Encourage movement or upright posture if appropriate.
MUST INCLUDE:
- A few rounds of energizing breath (in through nose for 4, out through mouth for 4)
- Imagery: sunrise, golden light moving through the body, or turning on a gentle internal flame
- Closing affirmation: "I am awake. I am plugged into my power."`,

  healing: `STYLE: Deeply nurturing, compassionate, safe. Focus on emotional healing, self forgiveness, and self acceptance. Validate feelings without promising outcomes.
MUST INCLUDE:
- A simple grounding exercise (feeling the support of the bed, chair, or earth)
- Visualization of sending soft light or care to a part of the body or a heavy emotion
- Closing affirmation: "I am allowed to heal in my own time."`,
};

function getMeditationVoice(theme: string): "fable" | "onyx" | "echo" | "shimmer" | "nova" {
  return meditationVoiceMap[theme] || "fable"; // Default to fable, NEVER alloy
}

interface MeditationResult {
  script: string;
  audioBase64?: string;
  voice: string;
}

async function generateMeditationScript(theme: string, duration: string, element?: string): Promise<MeditationResult> {
  const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;
  const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
  
  const durationMinutes = duration === "short" ? 5 : duration === "medium" ? 7 : 10;
  const targetWords = duration === "short" ? "650-750" : duration === "medium" ? "750-850" : "850-900";
  const voice = getMeditationVoice(theme);
  
  if (!baseURL || !apiKey) {
    return { script: getFallbackMeditation(theme, element), voice };
  }

  try {
    const openai = new OpenAI({ baseURL, apiKey });
    
    const elementContext = element ? `Incorporate ${element} element imagery (${element === "fire" ? "warmth, light, transformation" : element === "water" ? "flow, emotions, intuition" : element === "air" ? "breath, clarity, freedom" : element === "earth" ? "grounding, stability, nature" : "cosmic expansion, stars, infinite possibility"}).` : '';
    
    const styleGuide = meditationStyleGuides[theme] || meditationStyleGuides.calm;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a meditation guide creating scripts for text-to-speech playback.

GENERAL RULES:
- Length: ${durationMinutes} minutes of speech. Aim for about ${targetWords} words.
- Structure: 1) Short welcoming intro, 2) Simple breath guidance, 3) Main visualization or reflection, 4) Soft closing and affirmation
- Tone: gentle, grounding, nurturing. Never predictive or absolute. No medical claims.
- Voice pacing: include occasional pauses using "[pause]" so timing feels natural
- Address the user in second person ("you") and keep language clear and simple

${styleGuide}`
        },
        {
          role: "user",
          content: `Create a ${duration} (${durationMinutes} minute) meditation script focused on ${theme}. ${elementContext}`
        }
      ],
      max_completion_tokens: 2000,
    });

    const script = response.choices[0].message.content?.trim() || getFallbackMeditation(theme, element);
    
    // Generate TTS audio with focus-specific voice
    // Use direct OpenAI API for TTS (Replit AI Integrations doesn't support audio/speech endpoint)
    let audioBase64: string | undefined;
    const directOpenAIKey = process.env.OPENAI_API_KEY;
    console.log(`[Meditation TTS] Theme: ${theme}, Voice: ${voice}, Duration: ${duration}`);
    
    if (directOpenAIKey) {
      try {
        const ttsOpenAI = new OpenAI({ apiKey: directOpenAIKey });
        const speechResponse = await ttsOpenAI.audio.speech.create({
          model: "tts-1",
          voice: voice,
          input: script.replace(/\[pause\]/g, '...'),
          speed: theme === "sleep" ? 0.9 : 1.0, // Slower for sleep
        });
        console.log(`[Meditation TTS] Audio generated successfully for theme: ${theme}, voice: ${voice}`);
        
        const arrayBuffer = await speechResponse.arrayBuffer();
        audioBase64 = Buffer.from(arrayBuffer).toString('base64');
      } catch (ttsError) {
        console.error("OpenAI TTS error:", ttsError);
        // Continue without audio - frontend will fall back to browser TTS
      }
    } else {
      console.log("[Meditation TTS] No OPENAI_API_KEY available for TTS, using browser fallback");
    }
    
    return { script, audioBase64, voice };
  } catch (error) {
    console.error("OpenAI API error for meditation:", error);
    return { script: getFallbackMeditation(theme, element), voice };
  }
}

function getFallbackMeditation(theme: string, element?: string): string {
  const meditations: Record<string, string> = {
    calm: `Welcome to this moment of stillness... Take a deep breath in... and slowly release...

Let your body settle into a comfortable position... Feel the support beneath you, holding you safely...

With each breath, allow tension to melt away... Your shoulders soften... Your jaw relaxes... Your hands rest gently...

Imagine a warm, golden light surrounding you... This light brings peace with every breath you take... It flows through your entire being...

Continue breathing slowly and deeply... You are safe... You are calm... You are at peace...

When you're ready, gently return to awareness... carrying this tranquility with you...`,

    focus: `Welcome to this moment of clarity... Begin by taking three deep, intentional breaths...

Feel your mind becoming clear and sharp... like still water reflecting the sky perfectly...

With each breath, your focus sharpens... Distractions fade into the background... You are fully present in this moment...

Visualize a single point of light at your center... This is your focus... bright and unwavering...

This clarity is always available to you... Your mind is a powerful tool... ready and alert...

Carry this focused energy with you as you gently return...`,

    sleep: `Welcome to this journey into restful sleep... Let your eyes softly close...

Feel your body becoming heavy... sinking deeper into comfort... Release the day with each exhale...

Imagine yourself floating on a calm, warm sea... The gentle waves rock you softly... back and forth...

Every muscle relaxes... Every thought drifts away like clouds... You are safe to let go completely...

Sleep comes naturally now... deeply... peacefully... Rest well...`,

    gratitude: `Welcome to this practice of thankfulness... Take a moment to arrive fully...

Feel your heart space opening... Warmth spreading through your chest...

Bring to mind one thing you're grateful for today... Let this feeling expand... filling you with appreciation...

Notice how gratitude feels in your body... Perhaps a smile touches your lips... A softness in your eyes...

You are surrounded by blessings... seen and unseen... This awareness transforms your perspective...

Carry this grateful heart with you always...`,

    energy: `Welcome to this practice of renewal... Take a deep, energizing breath...

Feel life force flowing through you... awakening every cell... With each breath, vitality increases...

Visualize bright, vibrant light entering through the top of your head... flowing down through your entire body...

This energy is yours... unlimited and powerful... You feel alive... refreshed... ready for anything...

Your spirit is renewed... Your body is energized... Move forward with confidence and vitality...`,

    healing: `Welcome to this sacred space of healing... Breathe deeply and settle in...

Your body has innate wisdom... an incredible capacity to heal and restore... Trust this process...

Imagine healing light flowing to any area that needs attention... warm... soothing... restorative...

With each breath, balance returns... Harmony is restored... You are becoming whole...

This healing continues even after this meditation ends... Trust your body... Trust the process... You are healing...`,
  };
  
  return meditations[theme] || meditations.calm;
}

async function generateAffirmation(element: string, sunSign?: string, moonSign?: string): Promise<string> {
  const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;
  const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
  
  if (!baseURL || !apiKey) {
    return getFallbackAffirmation(element, sunSign, moonSign);
  }

  try {
    // Using Replit AI Integrations for OpenAI access
    const openai = new OpenAI({ baseURL, apiKey });
    
    const elementDesc = elementDescriptions[element] || "balanced";
    const hasAstrology = sunSign && moonSign;

    let prompt: string;
    
    if (hasAstrology) {
      const sunQuality = signQualities[sunSign] || "inner strength";
      const moonQuality = signQualities[moonSign] || "emotional wisdom";
      
      prompt = `Create a daily affirmation for someone with:
- Sun in ${sunSign} (core energy: ${sunQuality})
- Moon in ${moonSign} (emotional nature: ${moonQuality})
- Currently feeling ${element} energy (${elementDesc})

Generate a single, personalized affirmation that honors their cosmic makeup and current energy state.`;
    } else {
      prompt = `Create a daily affirmation for someone feeling ${element} energy today (${elementDesc}).

Generate a single, uplifting affirmation that honors their current energy state and supports their wellness journey. Focus on general spiritual wisdom and self-care.`;
    }

    // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a gentle, spiritual wellness guide who creates personalized daily affirmations. 
Your affirmations should be:
- Warm, nurturing, and uplifting
- Short (1-2 sentences, under 30 words)
- Present tense and positive
- Focused on self-acceptance and growth
Do not include quotation marks in your response.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_completion_tokens: 100,
    });

    const affirmation = response.choices[0].message.content?.trim();
    
    if (affirmation) {
      return affirmation.replace(/^["']|["']$/g, '');
    }
    
    return getFallbackAffirmation(element, sunSign, moonSign);
  } catch (error) {
    console.error("OpenAI API error:", error);
    return getFallbackAffirmation(element, sunSign, moonSign);
  }
}

function getFallbackAffirmation(element: string, sunSign?: string, moonSign?: string): string {
  const hasAstrology = sunSign && moonSign;
  
  // Use dedicated cosmic affirmation generator with 10 distinct templates
  if (element === "cosmic") {
    if (hasAstrology) {
      return getPersonalizedCosmicAffirmation(sunSign, moonSign);
    }
    return getCosmicDailyAffirmation();
  }
  
  const generalAffirmations: Record<string, string[]> = {
    fire: [
      "Your inner fire burns bright today. Trust your passion to light the way forward.",
      "You are bold, courageous, and capable of achieving anything you set your mind to.",
      "Let your enthusiasm guide you. Your energy inspires those around you.",
    ],
    water: [
      "Your emotions are your strength. Let your feelings flow like healing waters today.",
      "Trust your intuition. Your inner wisdom knows the way.",
      "Like water, you adapt and flow with grace through any situation.",
    ],
    air: [
      "Your mind is clear and your ideas are brilliant. Trust the thoughts that come to you.",
      "Communication flows easily today. Share your truth with confidence.",
      "Fresh perspectives bring new possibilities. Embrace the clarity of this moment.",
    ],
    earth: [
      "You are grounded and steady. Each step you take creates lasting positive change.",
      "Trust your practical wisdom. You build beautiful things with patience.",
      "You are stable, reliable, and deeply connected to what matters most.",
    ],
  };

  const personalizedAffirmations: Record<string, string[]> = {
    fire: [
      `Your ${sunSign} fire burns bright today. Trust your passion to light the way forward.`,
      `With your ${moonSign} intuition and fiery energy, you are unstoppable in pursuit of your dreams.`,
      `The spark within you grows stronger. Embrace your natural ${sunSign} courage today.`,
    ],
    water: [
      `Your ${moonSign} emotional depth is a gift. Let your feelings flow like healing waters today.`,
      `As a ${sunSign}, you understand the power of going with the flow. Trust the current today.`,
      `Your intuitive ${moonSign} nature guides you through deep waters with grace and wisdom.`,
    ],
    air: [
      `Your ${sunSign} mind is sharp and clear today. Trust the ideas that flow to you.`,
      `With ${moonSign} emotional intelligence and airy clarity, you communicate your truth beautifully.`,
      `Let your thoughts take flight, ${sunSign}. Your perspective brings fresh insight to the world.`,
    ],
    earth: [
      `Your ${sunSign} determination grounds you in what matters most. You are solid and steady.`,
      `With your ${moonSign} heart rooted in wisdom, you build lasting foundations today.`,
      `Trust your practical ${sunSign} nature. Each step you take creates lasting positive change.`,
    ],
  };

  const affirmations = hasAstrology 
    ? (personalizedAffirmations[element] || generalAffirmations.fire)
    : (generalAffirmations[element] || generalAffirmations.fire);
    
  const randomIndex = Math.floor(Math.random() * affirmations.length);
  return affirmations[randomIndex];
}

// =====================================================
// AI TAROT HELPER FUNCTIONS
// =====================================================

function drawTarotCards(spreadType: TarotSpreadType): TarotCard[] {
  const allCards: TarotCard[] = [];
  
  for (const card of majorArcana) {
    allCards.push({
      name: card,
      suit: undefined,
      isReversed: Math.random() > 0.5,
    });
  }
  
  for (const suit of minorArcanaSuits) {
    for (const rank of minorArcanaRanks) {
      allCards.push({
        name: `${rank} of ${suit}`,
        suit,
        isReversed: Math.random() > 0.5,
      });
    }
  }
  
  for (let i = allCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allCards[i], allCards[j]] = [allCards[j], allCards[i]];
  }
  
  const positions: Record<TarotSpreadType, string[]> = {
    single: ["Present Insight"],
    three_card: ["Past", "Present", "Future"],
    love: ["You", "Partner Energy", "Relationship Potential", "Advice", "Outcome"],
    career: ["Current Situation", "Challenge", "Hidden Factor", "Advice", "Outcome"],
    shadow: ["Shadow Aspect", "Root Cause", "How It Manifests", "Release", "Integration"],
  };
  
  const numCards = positions[spreadType].length;
  const drawnCards = allCards.slice(0, numCards);
  
  return drawnCards.map((card, index) => ({
    ...card,
    position: positions[spreadType][index],
  }));
}

async function generateTarotInterpretation(cards: TarotCard[], question?: string, user?: any): Promise<string> {
  const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;
  const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
  
  if (!baseURL || !apiKey) {
    return getFallbackTarotInterpretation(cards);
  }

  try {
    const openai = new OpenAI({ baseURL, apiKey });
    
    const cardDescriptions = cards.map(c => 
      `${c.position}: ${c.name}${c.isReversed ? " (Reversed)" : ""}`
    ).join("\n");
    
    const userContext = user?.sunSign 
      ? `The seeker is a ${user.sunSign} sun${user.moonSign ? ` with ${user.moonSign} moon` : ""}.`
      : "";
    
    const questionContext = question ? `They asked: "${question}"` : "";
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a gentle, intuitive tarot reader. Provide meaningful interpretations that blend traditional tarot meanings with spiritual wisdom. Be supportive and empowering, never fatalistic or frightening. Focus on guidance and personal growth.`
        },
        {
          role: "user",
          content: `Please interpret this tarot spread:\n\n${cardDescriptions}\n\n${userContext}\n${questionContext}\n\nProvide a cohesive reading that weaves the cards together into meaningful guidance.`
        }
      ],
      max_completion_tokens: 800,
    });

    return response.choices[0].message.content?.trim() || getFallbackTarotInterpretation(cards);
  } catch (error) {
    console.error("OpenAI API error for tarot:", error);
    return getFallbackTarotInterpretation(cards);
  }
}

function getFallbackTarotInterpretation(cards: TarotCard[]): string {
  const interpretations = cards.map(card => {
    const reversed = card.isReversed ? " In its reversed position, this card invites you to look within and consider what might be blocking this energy." : "";
    return `**${card.position}: ${card.name}${card.isReversed ? " (Reversed)" : ""}**\nThis card speaks to transformation and insight in your journey.${reversed}`;
  });
  
  return interpretations.join("\n\n") + "\n\nTrust your intuition as you reflect on these cards. The guidance they offer is meant to illuminate your path forward.";
}

// =====================================================
// INTENTION PROMPT HELPER FUNCTIONS
// =====================================================

async function generateIntentionPrompt(user: any, tier: SubscriptionTier): Promise<string> {
  const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;
  const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
  
  if (!baseURL || !apiKey) {
    return getFallbackIntentionPrompt(tier);
  }

  try {
    const openai = new OpenAI({ baseURL, apiKey });
    
    const userContext = user?.sunSign 
      ? `The user is a ${user.sunSign} sun${user.moonSign ? ` with ${user.moonSign} moon` : ""}.`
      : "";
    
    const tierContext = tier === "ascended" || tier === "initiates"
      ? "Include subtle astrological or celestial themes."
      : "";
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a gentle spiritual guide creating intention prompts for reflection. Generate a single, soft, open-ended question that invites deep self-reflection. The question should be nurturing and mystical but simple. ${tierContext}`
        },
        {
          role: "user",
          content: `Create one intention prompt for today. ${userContext} The prompt should be a simple question like "What energy do you want to embody today?" or "What is your heart asking for right now?" Keep it under 15 words.`
        }
      ],
      max_completion_tokens: 50,
    });

    return response.choices[0].message.content?.trim() || getFallbackIntentionPrompt(tier);
  } catch (error) {
    console.error("OpenAI API error for intention prompt:", error);
    return getFallbackIntentionPrompt(tier);
  }
}

function getFallbackIntentionPrompt(tier: SubscriptionTier): string {
  const prompts = [
    "What energy do you want to embody today?",
    "What are you releasing before bed?",
    "What is your heart asking for right now?",
    "What blessing would you like to receive today?",
    "What intention will guide your next steps?",
    "What feels most true for you in this moment?",
    "What would bring you peace today?",
    "What are you grateful for in this breath?",
  ];
  
  return prompts[Math.floor(Math.random() * prompts.length)];
}

// =====================================================
// CLARITY GUIDANCE HELPER FUNCTIONS
// =====================================================

async function generateClarityGuidance(question: string, focusArea: string, user: any, tier: SubscriptionTier): Promise<string> {
  const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;
  const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
  
  const focusLabels: Record<string, string> = {
    love: "love and relationships",
    career: "career and purpose",
    healing: "healing and wellbeing",
    shadow_work: "shadow work and self-discovery",
    protection: "protection and boundaries",
    flow_alignment: "flow and alignment",
  };
  
  if (!baseURL || !apiKey) {
    return getFallbackClarityGuidance(focusArea);
  }

  try {
    const openai = new OpenAI({ baseURL, apiKey });
    
    const userContext = user?.sunSign 
      ? `The seeker is a ${user.sunSign} sun${user.moonSign ? ` with ${user.moonSign} moon` : ""}.`
      : "";
    
    const depthContext = tier === "initiates" || tier === "ascended"
      ? "Include deeper behavioral and astrological insights where relevant."
      : "";
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a gentle, intuitive guide providing spiritual clarity. Your guidance should be soft, supportive, and empowering - never predictive or fatalistic. Focus on ${focusLabels[focusArea] || "general guidance"}. ${depthContext} Write 2-3 paragraphs of nurturing guidance.`
        },
        {
          role: "user",
          content: `The seeker asks: "${question}"\n\n${userContext}\n\nProvide intuitive-style guidance that helps them find clarity and peace.`
        }
      ],
      max_completion_tokens: 500,
    });

    return response.choices[0].message.content?.trim() || getFallbackClarityGuidance(focusArea);
  } catch (error) {
    console.error("OpenAI API error for clarity:", error);
    return getFallbackClarityGuidance(focusArea);
  }
}

function getFallbackClarityGuidance(focusArea: string): string {
  const guidances: Record<string, string> = {
    love: "Your heart knows what it needs. Trust the love that flows to you and from you. The connections meant for your highest good are being drawn into your life. Allow yourself to both give and receive love with an open heart.\n\nRemember that love starts within. The more you nurture self-love, the more beautiful connections will bloom around you. You are worthy of the love you seek.",
    career: "Your path is unfolding in divine timing. Trust that your skills and passions are leading you toward your purpose. Even moments of uncertainty are guiding you toward something meaningful.\n\nListen to what lights you up. Your authentic calling often whispers in moments of flow and joy. The work that feels most like you is the work that matters most.",
    healing: "Healing is not linear, and every step forward matters. Be gentle with yourself as you navigate this journey. Your body and spirit know how to heal when given love and patience.\n\nAllow yourself to rest. Allow yourself to feel. The process of healing is sacred, and you are exactly where you need to be.",
    shadow_work: "The parts of yourself that feel difficult to face are also the parts that hold profound wisdom. Shadow work is not about fixing what is broken but integrating what is whole.\n\nApproach your shadow with curiosity rather than judgment. These hidden aspects are not your enemy but teachers waiting to be understood.",
    protection: "You have the power to create sacred boundaries. Trust your intuition when something doesn't feel right. Your energy is precious, and you are allowed to protect it.\n\nSurround yourself with what uplifts you. Release what drains you. You are worthy of spaces and relationships that feel safe and nourishing.",
    flow_alignment: "When you are in alignment, life flows more effortlessly. Notice what brings you ease and what creates resistance. These signals guide you toward your natural rhythm.\n\nTrust the timing of your life. What is meant for you will not pass you by. Stay present, stay open, and let the current carry you forward.",
  };
  
  return guidances[focusArea] || guidances.flow_alignment;
}

// =====================================================
// SLEEP RITUAL HELPER FUNCTIONS
// =====================================================

interface SleepRitualResult {
  reflection: string;
  breathwork: string;
  intention: string;
  tarotInsight?: string;
  meditation?: string;
  subliminalSuggestion?: string;
}

async function generateSleepRitual(user: any, tier: SubscriptionTier): Promise<SleepRitualResult> {
  const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;
  const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
  
  const fallback = getFallbackSleepRitual(tier);
  
  if (!baseURL || !apiKey) {
    return fallback;
  }

  try {
    const openai = new OpenAI({ baseURL, apiKey });
    
    const userContext = user?.sunSign 
      ? `personalized for a ${user.sunSign} sun${user.moonSign ? ` with ${user.moonSign} moon` : ""}`
      : "";
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a gentle sleep guide creating bedtime rituals. Generate a JSON object with these fields:
- reflection: A single sentence for letting go (e.g., "Release anything that felt heavy today.")
- breathwork: A breathing pattern name (e.g., "4-7-8 Breath" or "Box Breathing")
- intention: A single soft intention for the night (e.g., "Tonight I soften into trust.")
${tier === "ascended" || tier === "initiates" ? '- tarotInsight: A brief tarot-inspired night message' : ''}
${tier === "initiates" ? '- meditation: A short meditation script (3-4 sentences)' : ''}
Keep everything soft, nurturing, and simple.`
        },
        {
          role: "user",
          content: `Create a sleep ritual ${userContext}. Return only valid JSON.`
        }
      ],
      max_completion_tokens: 400,
    });

    try {
      const content = response.choices[0].message.content?.trim() || "";
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          reflection: parsed.reflection || fallback.reflection,
          breathwork: parsed.breathwork || fallback.breathwork,
          intention: parsed.intention || fallback.intention,
          tarotInsight: parsed.tarotInsight,
          meditation: parsed.meditation,
          subliminalSuggestion: tier !== "free" ? "Try a Calm & Grounding subliminal as you drift off." : undefined,
        };
      }
    } catch (parseError) {
      console.error("Error parsing sleep ritual JSON:", parseError);
    }
    
    return fallback;
  } catch (error) {
    console.error("OpenAI API error for sleep ritual:", error);
    return fallback;
  }
}

function getFallbackSleepRitual(tier: SubscriptionTier): SleepRitualResult {
  const reflections = [
    "Release anything that felt heavy today.",
    "Let go of all that you cannot control.",
    "Set down the worries of the day.",
    "Allow your mind to rest and be still.",
  ];
  
  const intentions = [
    "Tonight I soften into trust.",
    "I welcome peaceful, restorative sleep.",
    "My body knows how to heal as I rest.",
    "I release and I receive.",
  ];
  
  const result: SleepRitualResult = {
    reflection: reflections[Math.floor(Math.random() * reflections.length)],
    breathwork: "4-7-8 Breath: Inhale for 4 counts, hold for 7, exhale for 8.",
    intention: intentions[Math.floor(Math.random() * intentions.length)],
  };
  
  if (tier === "ascended" || tier === "initiates") {
    result.tarotInsight = "The Star watches over your dreams tonight, bringing hope and healing.";
  }
  
  if (tier === "initiates") {
    result.meditation = "Close your eyes and imagine yourself floating on a calm sea under the stars. With each breath, you sink deeper into peace. The water holds you gently as you drift into restful sleep.";
  }
  
  if (tier !== "free") {
    result.subliminalSuggestion = "Try a Deep Sleep subliminal as you drift off.";
  }
  
  return result;
}

// =====================================================
// SUBLIMINAL AFFIRMATION HELPER FUNCTIONS
// =====================================================

async function generateSubliminalAffirmations(category: string, intention: string, style: string, user: any): Promise<string> {
  const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;
  const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
  
  const categoryLabels: Record<string, string> = {
    love_relationships: "love, relationships, and heart opening",
    self_worth_confidence: "self-worth, confidence, and inner power",
    money_overflow: "abundance, wealth, and financial overflow",
    healing_nervous_system: "healing, nervous system regulation, and inner peace",
    protection_boundaries: "protection, boundaries, and sacred space",
    shadow_integration: "shadow work, acceptance, and integration",
    spiritual_alignment: "spiritual alignment and higher self connection",
  };
  
  const affirmationCounts: Record<string, number> = {
    gentle: 22,
    balanced: 35,
    deep: 55,
  };
  
  const count = affirmationCounts[style] || 35;
  
  if (!baseURL || !apiKey) {
    return getFallbackSubliminalAffirmations(category);
  }

  try {
    const openai = new OpenAI({ baseURL, apiKey });
    
    let astroContext = "";
    if (user?.sunSign || user?.moonSign) {
      astroContext = `The user's astrological profile: Sun in ${user.sunSign || "unknown"}, Moon in ${user.moonSign || "unknown"}.`;
    }
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are creating affirmations for a subliminal audio track focused on ${categoryLabels[category] || category}.

The user's intention: "${intention}"
${astroContext}

Generate exactly ${count} short, positive, present-tense affirmations. Each affirmation should be:
- First person ("I am", "I receive", "I trust", "I allow")
- Present tense only
- Simple and clear (under 12 words each)
- Positive framing (no negative words like "not", "don't", "never")
- Soft, nurturing, mystical tone

Return only the affirmations, one per line, without numbers or bullets.`
        },
        {
          role: "user",
          content: `Generate ${count} subliminal affirmations for ${categoryLabels[category] || category} based on the intention: "${intention}"`
        }
      ],
      max_completion_tokens: 1000,
    });

    return response.choices[0].message.content?.trim() || getFallbackSubliminalAffirmations(category);
  } catch (error) {
    console.error("OpenAI API error for subliminal:", error);
    return getFallbackSubliminalAffirmations(category);
  }
}

function getFallbackSubliminalAffirmations(category: string): string {
  const affirmations: Record<string, string> = {
    love_relationships: `I am worthy of deep, unconditional love.
I attract loving and healthy relationships.
My heart is open to giving and receiving love.
I am safe to be vulnerable and authentic.
Love flows to me effortlessly.
I deserve a partner who honors me.
I release old patterns that block love.
My relationships nurture my soul.
I am loved exactly as I am.
I trust the timing of love in my life.
I radiate love and attract it back.
My heart heals more each day.
I am complete within myself.
I welcome intimacy and connection.
Love supports my highest good.
I forgive and release the past.
My love life flourishes.
I am magnetic to healthy love.
I trust my heart's wisdom.
I am lovable and loving.`,
    self_worth_confidence: `I am enough exactly as I am.
My worth is inherent and infinite.
I trust my inner wisdom.
I speak my truth with confidence.
I am capable and powerful.
I celebrate my unique gifts.
I deserve success and abundance.
I honor my boundaries.
I am proud of who I am becoming.
My confidence grows daily.
I am worthy of respect.
I trust my decisions.
I release self-doubt.
My voice matters.
I am strong and resilient.
I believe in my abilities.
I radiate self-assurance.
I am deserving of good things.
I honor my journey.
I am powerful beyond measure.`,
    money_overflow: `I am a magnet for abundance.
Money flows to me easily.
I am worthy of financial prosperity.
I release limiting beliefs about wealth.
Abundance is my natural state.
I attract opportunities for wealth.
I am open to receiving.
Money supports my dreams.
I am grateful for my abundance.
Prosperity follows me everywhere.
I deserve to be paid well.
Wealth expands in my life.
I trust the flow of money.
I am financially secure.
Abundance finds me easily.
I welcome unexpected income.
Money is a positive force.
I am abundant in all ways.
Wealth flows through me.
I celebrate my prosperity.`,
    healing_nervous_system: `My body knows how to heal.
I am safe in this moment.
My nervous system is calm.
I release tension with each breath.
Peace flows through my body.
I am grounded and centered.
My body is relaxed and at ease.
I trust my body's wisdom.
Healing happens naturally for me.
I am gentle with myself.
My mind is quiet and clear.
I release stored stress.
Safety surrounds me always.
I breathe in calm, breathe out tension.
My cells regenerate with ease.
I honor my body's need for rest.
Tranquility is my natural state.
I am healing on all levels.
My body supports my wellbeing.
I am restored and renewed.`,
    protection_boundaries: `I am safe and protected.
My boundaries are sacred.
I honor my limits.
I release what is not mine.
I am shielded from negativity.
My energy is my own.
I protect my peace.
I say no with love.
I am surrounded by light.
My aura is strong and clear.
I attract respectful relationships.
I release energy that harms me.
I stand in my power.
My space is sacred.
I am worthy of protection.
I set boundaries with ease.
I honor my needs.
Divine protection surrounds me.
I am energetically sovereign.
I claim my sacred space.`,
    shadow_integration: `I accept all parts of myself.
My shadow holds wisdom.
I embrace my wholeness.
I forgive my past selves.
Darkness teaches me strength.
I integrate with compassion.
My wounds become wisdom.
I honor my full humanity.
I release shame and guilt.
All of me is welcome.
I transform pain into power.
My shadow is my teacher.
I love my imperfections.
Healing includes all of me.
I accept what I once rejected.
My darkness holds light.
I am whole and complete.
Integration brings freedom.
I honor my complexity.
Every part of me belongs.`,
    spiritual_alignment: `I am connected to source.
My spirit guides me.
I trust divine timing.
I am aligned with my purpose.
The universe supports me.
I am a spiritual being.
My intuition is clear.
I am connected to all that is.
Divine wisdom flows through me.
I am on my sacred path.
My higher self leads me.
I trust the journey.
Spiritual gifts awaken in me.
I am one with the cosmos.
My soul knows the way.
I receive divine guidance.
I am spiritually protected.
My purpose unfolds perfectly.
I am aligned and at peace.
The divine dwells within me.`,
  };
  
  return affirmations[category] || affirmations.self_worth_confidence;
}

function getFallbackSubliminalScriptOld(focus: string): string {
  const scripts: Record<string, string> = {
    calm_grounding: `I am calm and centered.
I am safe in this moment.
Peace flows through me.
I am grounded and steady.
I release all tension.
My body is relaxed.
I breathe deeply and freely.
Calm energy fills me.
I am at peace with myself.
I trust the flow of life.
I am stable and secure.
Tranquility is my natural state.
I embrace stillness.
My mind is quiet and clear.
I am rooted in the present.
Serenity surrounds me.
I let go of worry.
I am balanced and whole.
Peace radiates from within.
I rest in calm awareness.`,
    self_love: `I love and accept myself.
I am worthy of love.
I treat myself with kindness.
I am enough exactly as I am.
I honor my needs.
I deserve compassion.
I embrace all parts of myself.
My heart is open to love.
I am beautiful inside and out.
I forgive myself completely.
I celebrate who I am.
I am gentle with myself.
I trust my inner wisdom.
I am worthy of care.
Self-love flows through me.
I appreciate my unique gifts.
I am my own best friend.
I nurture my spirit.
I radiate self-acceptance.
I am loved unconditionally.`,
    confidence: `I am confident and capable.
I trust in my abilities.
I radiate magnetism.
I am powerful and strong.
I believe in myself.
I attract success naturally.
I am worthy of recognition.
My presence is felt.
I speak my truth boldly.
I embrace my power.
I am unstoppable.
I deserve great things.
I shine my light brightly.
I am a natural leader.
Confidence flows through me.
I take up space unapologetically.
I am magnetic and attractive.
I trust my path.
I am capable of anything.
I embody strength and grace.`,
    abundance: `I am open to receiving.
Abundance flows to me.
I am worthy of prosperity.
Wealth comes to me easily.
I receive with gratitude.
I am a magnet for blessings.
Money flows freely to me.
I deserve abundance.
The universe provides for me.
I attract opportunities.
Prosperity is my birthright.
I welcome all good things.
I am surrounded by plenty.
Financial freedom is mine.
I release all lack.
Abundance is my natural state.
I receive with open arms.
Blessings multiply in my life.
I am financially secure.
I live in grateful abundance.`,
    heart_healing: `My heart is healing.
I release all past pain.
Love flows through me.
I am worthy of healing.
I forgive and let go.
My heart is open.
I embrace emotional freedom.
Healing energy surrounds me.
I release old wounds.
My heart is whole.
I welcome new love.
I am gentle with my heart.
Compassion fills me.
I heal with every breath.
My heart knows peace.
I trust the healing process.
Love heals all things.
I am emotionally free.
My heart radiates love.
I embrace heart-centered living.`,
    deep_sleep: `I drift into deep sleep.
My body is completely relaxed.
I release the day.
Sleep comes easily to me.
I am safe to rest.
My mind is quiet.
I surrender to sleep.
Peaceful dreams await me.
I sleep deeply and fully.
Rest restores my body.
I let go completely.
Sleep heals and renews me.
I embrace deep rest.
My sleep is peaceful.
I wake refreshed and renewed.
I trust the night.
Sleep is my sanctuary.
I rest without worry.
Deep sleep is natural for me.
I am held in peaceful slumber.`,
  };
  
  return scripts[focus] || scripts.calm_grounding;
}
