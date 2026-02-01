import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sparkles, Moon, Heart, Wind } from "lucide-react";
import { 
  setHasSeenWelcome, 
  getUserProfile, 
  getOnboardingData, 
  clearOnboardingData,
  saveUserProfile,
  setOnboardingComplete,
  saveCurrentElement,
  saveIntention
} from "@/lib/storage";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { fetchBirthChart, calculateSunSign } from "@/lib/astrology";
import { useElementTheme } from "@/lib/element-theme";
import type { UserProfile, Intention } from "@shared/schema";

export default function WelcomeScreen() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { setElement: setThemeElement } = useElementTheme();
  const [isSyncing, setIsSyncing] = useState(false);
  const syncAttemptedRef = useRef(false);
  
  const profile = getUserProfile();
  const name = user?.name || user?.firstName || profile?.name || "friend";

  useEffect(() => {
    const syncOnboardingData = async () => {
      if (syncAttemptedRef.current) return;
      syncAttemptedRef.current = true;

      const onboardingData = getOnboardingData();
      
      if (!onboardingData?.name) return;
      
      setIsSyncing(true);
      
      let sunSign, moonSign, risingSign, mercurySign, venusSign, marsSign;
      
      try {
        if (onboardingData.dateOfBirth) {
          const effectiveTime = onboardingData.birthTimeKnown && onboardingData.timeOfBirth 
            ? onboardingData.timeOfBirth 
            : "12:00";
          const effectiveCity = onboardingData.cityOfBirth || "New York";
          
          const chart = await fetchBirthChart(onboardingData.dateOfBirth, effectiveTime, effectiveCity);
          
          sunSign = chart.sun;
          moonSign = chart.moon;
          risingSign = onboardingData.birthTimeKnown && onboardingData.timeOfBirth ? chart.rising : undefined;
          mercurySign = chart.mercury;
          venusSign = chart.venus;
          marsSign = chart.mars;
        }
      } catch (error) {
        console.error("Error calculating birth chart:", error);
        if (onboardingData.dateOfBirth) {
          sunSign = calculateSunSign(onboardingData.dateOfBirth);
          moonSign = sunSign;
        }
      }
      
      const newProfile: UserProfile = {
        name: onboardingData.name,
        hasAstrologyProfile: !!onboardingData.dateOfBirth,
        dateOfBirth: onboardingData.dateOfBirth,
        timeOfBirth: onboardingData.birthTimeKnown ? onboardingData.timeOfBirth : undefined,
        cityOfBirth: onboardingData.cityOfBirth,
        birthTimeKnown: onboardingData.birthTimeKnown,
        sunSign,
        moonSign,
        risingSign,
        mercurySign,
        venusSign,
        marsSign,
        currentElement: onboardingData.currentElement || undefined,
      };
      
      saveUserProfile(newProfile);
      
      if (onboardingData.intention) {
        const intention: Intention = {
          id: crypto.randomUUID(),
          text: onboardingData.intention,
          timestamp: new Date().toISOString(),
          completed: false,
        };
        saveIntention(intention);
      }
      
      if (onboardingData.currentElement) {
        saveCurrentElement(onboardingData.currentElement);
        setThemeElement(onboardingData.currentElement);
      }
      
      if (isAuthenticated) {
        try {
          await apiRequest("PUT", "/api/auth/user", {
            name: onboardingData.name,
            dateOfBirth: onboardingData.dateOfBirth || null,
            timeOfBirth: onboardingData.birthTimeKnown ? onboardingData.timeOfBirth : null,
            cityOfBirth: onboardingData.cityOfBirth || null,
            birthTimeKnown: onboardingData.birthTimeKnown ? "true" : "false",
            hasAstrologyProfile: onboardingData.dateOfBirth ? "true" : "false",
            sunSign: sunSign || null,
            moonSign: moonSign || null,
            risingSign: risingSign || null,
            mercurySign: mercurySign || null,
            venusSign: venusSign || null,
            marsSign: marsSign || null,
            currentElement: onboardingData.currentElement || null,
          });
        } catch (error) {
          console.error("Error syncing profile to server:", error);
        }
      }
      
      setOnboardingComplete(true);
      clearOnboardingData();
      setIsSyncing(false);
    };

    syncOnboardingData();
  }, [isAuthenticated, setThemeElement]);

  const handleEnter = () => {
    setHasSeenWelcome(true);
    setLocation("/");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-slate-950 via-indigo-950 to-violet-950"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center max-w-lg"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
          className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30"
        >
          <Sparkles className="w-12 h-12 text-white" />
        </motion.div>

        <h1 
          className="font-serif text-3xl md:text-4xl font-light text-white mb-4 tracking-wide"
          style={{ letterSpacing: "0.02em" }}
          data-testid="text-welcome-title"
        >
          Welcome to your space, {name}
        </h1>
        
        <p 
          className="text-violet-200 text-lg mb-8 font-sans"
          data-testid="text-welcome-subtitle"
        >
          A sanctuary for your mind, body, and spirit.
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white/5 rounded-xl p-6 mb-8 border border-violet-500/20"
        >
          <p className="text-violet-200 leading-relaxed mb-6" data-testid="text-welcome-body">
            Here you can track your moods, breathe with intention, tune into the moon, 
            and receive guidance shaped around your chart.
          </p>

          <div className="flex justify-center gap-6 text-violet-400">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
                <Heart className="w-5 h-5" />
              </div>
              <span className="text-xs text-violet-300">Mood</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
                <Wind className="w-5 h-5" />
              </div>
              <span className="text-xs text-violet-300">Breathe</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
                <Moon className="w-5 h-5" />
              </div>
              <span className="text-xs text-violet-300">Moon</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xs text-violet-300">Guidance</span>
            </motion.div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="text-violet-400/70 text-sm mb-8"
          data-testid="text-welcome-helper"
        >
          You can update your details anytime in Settings.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <Button
            onClick={handleEnter}
            disabled={isSyncing}
            className="px-12 py-6 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium text-lg shadow-md shadow-violet-500/30 disabled:opacity-50"
            data-testid="button-enter"
          >
            {isSyncing ? "Setting up..." : "Enter Intiti"}
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 text-violet-400 text-sm font-sans"
      >
        Intiti
      </motion.div>
    </motion.div>
  );
}
