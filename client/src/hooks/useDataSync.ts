import { useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { apiRequest } from "@/lib/queryClient";
import {
  getMoodEntries,
  getIntentions,
  saveMoodEntry as saveLocalMoodEntry,
  saveIntention as saveLocalIntention,
} from "@/lib/storage";
import type { MoodEntry, Intention } from "@shared/schema";

export function useDataSync() {
  const { user, isAuthenticated } = useAuth();

  const syncData = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    try {
      const localMoods = getMoodEntries();
      const localIntentions = getIntentions();

      if (localMoods.length > 0) {
        await apiRequest("POST", "/api/auth/moods/sync", { entries: localMoods });
      }

      if (localIntentions.length > 0) {
        await apiRequest("POST", "/api/auth/intentions/sync", { intentions: localIntentions });
      }
    } catch (error) {
      console.error("Error syncing data:", error);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (isAuthenticated && user) {
      syncData();
    }
  }, [isAuthenticated, user, syncData]);

  const saveMoodEntry = useCallback(async (entry: MoodEntry) => {
    saveLocalMoodEntry(entry);
    
    if (isAuthenticated && user) {
      try {
        await apiRequest("POST", "/api/auth/moods", entry);
      } catch (error) {
        console.error("Error saving mood to server:", error);
      }
    }
  }, [isAuthenticated, user]);

  const saveIntention = useCallback(async (intention: Intention) => {
    saveLocalIntention(intention);
    
    if (isAuthenticated && user) {
      try {
        await apiRequest("POST", "/api/auth/intentions", intention);
      } catch (error) {
        console.error("Error saving intention to server:", error);
      }
    }
  }, [isAuthenticated, user]);

  const updateIntention = useCallback(async (id: string, data: Partial<Intention>) => {
    const intentions = getIntentions();
    const index = intentions.findIndex(i => i.id === id);
    if (index !== -1) {
      intentions[index] = { ...intentions[index], ...data };
      localStorage.setItem("intiti_intentions", JSON.stringify(intentions));
    }
    
    if (isAuthenticated && user) {
      try {
        await apiRequest("PUT", `/api/auth/intentions/${id}`, data);
      } catch (error) {
        console.error("Error updating intention on server:", error);
      }
    }
  }, [isAuthenticated, user]);

  const deleteMoodEntry = useCallback(async (id: string) => {
    const entries = getMoodEntries();
    const filtered = entries.filter(e => e.id !== id);
    localStorage.setItem("intiti_mood_entries", JSON.stringify(filtered));
    
    if (isAuthenticated && user) {
      try {
        await apiRequest("DELETE", `/api/auth/moods/${id}`);
      } catch (error) {
        console.error("Error deleting mood from server:", error);
      }
    }
  }, [isAuthenticated, user]);

  const deleteIntention = useCallback(async (id: string) => {
    const intentions = getIntentions();
    const filtered = intentions.filter(i => i.id !== id);
    localStorage.setItem("intiti_intentions", JSON.stringify(filtered));
    
    if (isAuthenticated && user) {
      try {
        await apiRequest("DELETE", `/api/auth/intentions/${id}`);
      } catch (error) {
        console.error("Error deleting intention from server:", error);
      }
    }
  }, [isAuthenticated, user]);

  return {
    syncData,
    saveMoodEntry,
    saveIntention,
    updateIntention,
    deleteMoodEntry,
    deleteIntention,
    isAuthenticated,
  };
}
