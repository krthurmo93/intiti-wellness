import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { Sunrise, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ElementSelector } from "@/components/ElementSelector";
import { DailyAffirmation } from "@/components/home/DailyAffirmation";
import { MoodCheckIn } from "@/components/home/MoodCheckIn";
import { IntentionSetter } from "@/components/home/IntentionSetter";
import { BreathworkTimer } from "@/components/home/BreathworkTimer";
import { UpcomingFeatures } from "@/components/UpcomingFeatures";
import { getUserProfile, canAccessGoldenDawn } from "@/lib/storage";
import { useElementTheme } from "@/lib/element-theme";
import { getGoldenDawnBackgroundClasses, getGoldenDawnFloatClasses } from "@/lib/golden-dawn-styles";
import { GoldenDawnTheme } from "@/lib/golden-dawn-theme";
import type { UserProfile } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { colors, element } = useElementTheme();
  const isGoldenDawn = element === "golden_dawn" && canAccessGoldenDawn();

  useEffect(() => {
    const loadedProfile = getUserProfile();
    if (!loadedProfile) {
      setLocation("/onboarding");
      return;
    }
    setProfile(loadedProfile);
    setIsLoading(false);
  }, [setLocation]);

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-stone-100 to-stone-50">
        <div className="text-stone-400">Loading your sanctuary...</div>
      </div>
    );
  }

  const goldenDawnGlow = isGoldenDawn ? {
    background: `radial-gradient(ellipse 80% 50% at 50% 110%, rgba(245, 200, 106, 0.2) 0%, rgba(239, 160, 69, 0.1) 40%, transparent 70%)`
  } : {};
  
  const bgClasses = getGoldenDawnBackgroundClasses(element);
  const floatClasses = getGoldenDawnFloatClasses(element);

  return (
    <div 
      className="min-h-screen-safe transition-colors duration-500 relative"
      style={{ background: colors.gradientStyle }}
    >
      {isGoldenDawn && (
        <div 
          className="absolute inset-0 pointer-events-none" 
          style={goldenDawnGlow}
        />
      )}
      <div className={`${colors.overlay} min-h-screen-safe transition-colors duration-500 relative z-10`}>
        <div className="max-w-2xl mx-auto px-4 py-8 pb-safe-nav">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 
              className="font-serif text-3xl md:text-4xl font-light mb-1"
              style={{ color: colors.textPrimary }}
              data-testid="text-home-welcome"
            >
              Welcome, {profile.name}
            </h1>
            <p className="font-sans" style={{ color: colors.textMuted }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            
            {isGoldenDawn && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mt-4 flex items-center justify-center gap-2"
                style={{ 
                  color: colors.textSecondary,
                  textShadow: "0 0 20px rgba(245, 200, 106, 0.4)"
                }}
              >
                <Sunrise className={`w-4 h-4 ${floatClasses}`} style={{ color: colors.accentPrimary || "#F5C86A" }} />
                <span className="text-sm italic opacity-80">Your path opens with the first light.</span>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <ElementSelector />
          </motion.div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <DailyAffirmation />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <MoodCheckIn />
              <Link href="/emotional-timeline">
                <Button
                  variant="ghost"
                  className="w-full mt-3 gap-2"
                  style={isGoldenDawn 
                    ? { 
                        color: GoldenDawnTheme.text.secondary,
                        borderColor: 'rgba(92, 59, 21, 0.2)',
                      } 
                    : { 
                        color: colors.isDark ? 'rgba(255,255,255,0.7)' : colors.textSecondary 
                      }
                  }
                  data-testid="button-emotional-timeline"
                >
                  <History className="w-4 h-4" />
                  Emotional Timeline
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <IntentionSetter />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <BreathworkTimer />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <UpcomingFeatures />
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
