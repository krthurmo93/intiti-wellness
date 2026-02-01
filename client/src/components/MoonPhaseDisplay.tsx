import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";
import { calculateMoonPhase, getMoonIllumination } from "@/lib/astrology";
import { getUserProfile } from "@/lib/storage";
import { moonPhaseDescriptions, moonSignMeanings } from "@shared/schema";
import type { MoonPhase } from "@shared/schema";
import { Link } from "wouter";
import { useElementTheme } from "@/lib/element-theme";
import { isGoldenDawnActive, getGoldenDawnCardStyle, getGoldenDawnCardClasses } from "@/lib/golden-dawn-styles";

const moonPhaseVisuals: Record<MoonPhase, { icon: string; name: string }> = {
  new: { icon: "New Moon", name: "New Moon" },
  waxing: { icon: "First Quarter", name: "Waxing Moon" },
  full: { icon: "Full Moon", name: "Full Moon" },
  waning: { icon: "Last Quarter", name: "Waning Moon" },
};

interface MoonSvgProps {
  phase: MoonPhase;
  size?: number;
}

function MoonSvg({ phase, size = 120 }: MoonSvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF8E7" />
          <stop offset="70%" stopColor="#E8DCC8" />
          <stop offset="100%" stopColor="#D4C5B0" />
        </radialGradient>
        <filter id="moonShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#D4A574" floodOpacity="0.4" />
        </filter>
      </defs>
      
      <circle cx="50" cy="50" r="40" fill="url(#moonGlow)" filter="url(#moonShadow)" />
      
      {phase === "new" && (
        <circle cx="50" cy="50" r="38" fill="#2D2D2D" opacity="0.85" />
      )}
      
      {phase === "waxing" && (
        <path
          d="M 50 10 A 40 40 0 0 0 50 90 A 20 40 0 0 1 50 10"
          fill="#2D2D2D"
          opacity="0.85"
        />
      )}
      
      {phase === "waning" && (
        <path
          d="M 50 10 A 40 40 0 0 1 50 90 A 20 40 0 0 0 50 10"
          fill="#2D2D2D"
          opacity="0.85"
        />
      )}
      
      {phase !== "new" && (
        <>
          <circle cx="35" cy="35" r="5" fill="#C9B896" opacity="0.3" />
          <circle cx="60" cy="55" r="8" fill="#C9B896" opacity="0.2" />
          <circle cx="45" cy="65" r="4" fill="#C9B896" opacity="0.25" />
          <circle cx="55" cy="30" r="3" fill="#C9B896" opacity="0.2" />
        </>
      )}
    </svg>
  );
}

interface MoonPhaseDisplayProps {
  showPersonalized?: boolean;
}

export function MoonPhaseDisplay({ showPersonalized = true }: MoonPhaseDisplayProps) {
  const profile = getUserProfile();
  const { colors, element } = useElementTheme();
  const isGoldenDawn = isGoldenDawnActive(element);
  const gdCardClasses = getGoldenDawnCardClasses(element);
  const currentPhase = calculateMoonPhase();
  const { name } = moonPhaseVisuals[currentPhase];
  const description = moonPhaseDescriptions[currentPhase];
  const illumination = getMoonIllumination();
  
  const hasAstrologyProfile = profile?.hasAstrologyProfile && profile?.moonSign;
  const personalMeaning = hasAstrologyProfile && profile?.moonSign
    ? moonSignMeanings[profile.moonSign][currentPhase]
    : null;

  // Golden Dawn specific colors
  const textPrimary = isGoldenDawn ? '#1B1A17' : 'rgb(253 230 138)'; // amber-200
  const textMuted = isGoldenDawn ? '#5D5548' : 'rgb(148 163 184)'; // slate-400
  const textDesc = isGoldenDawn ? '#3D3A34' : 'rgb(203 213 225)'; // slate-300

  return (
    <Card 
      className={`p-8 overflow-hidden ${isGoldenDawn ? gdCardClasses : 'bg-gradient-to-b from-slate-900 to-slate-800 border-slate-700 text-white'}`}
      style={isGoldenDawn ? getGoldenDawnCardStyle(colors, element) : {}}
    >
      <div className="relative">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.2,
              }}
              animate={{
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <MoonSvg phase={currentPhase} size={140} />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-serif text-3xl mb-1"
            style={{ color: textPrimary }}
            data-testid="text-moon-phase-name"
          >
            {name}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-sm mb-6"
            style={{ color: textMuted }}
            data-testid="text-moon-illumination"
          >
            {illumination}% illuminated
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center leading-relaxed mb-6 max-w-md"
            style={{ color: textDesc }}
            data-testid="text-moon-description"
          >
            {description}
          </motion.p>

          {showPersonalized && hasAstrologyProfile && personalMeaning && profile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="w-full max-w-md rounded-xl p-5 border"
              style={{
                backgroundColor: isGoldenDawn ? 'rgba(255, 245, 224, 0.7)' : 'rgba(30, 41, 59, 0.5)',
                borderColor: isGoldenDawn ? 'rgba(245, 200, 106, 0.3)' : 'rgb(51 65 85)'
              }}
            >
              <h3 
                className="font-sans font-medium text-sm mb-2"
                style={{ color: isGoldenDawn ? '#1B1A17' : 'rgb(252 211 77)' }}
              >
                For Your {profile.moonSign} Emotional Landscape
              </h3>
              <p 
                className="font-serif italic leading-relaxed" 
                style={{ color: isGoldenDawn ? '#3D3A34' : 'rgb(226 232 240)' }}
                data-testid="text-moon-personal"
              >
                {personalMeaning}
              </p>
              {profile.birthTimeKnown !== true && (
                <p 
                  className="text-xs mt-3 text-center" 
                  style={{ color: isGoldenDawn ? '#5D5548' : 'rgb(100 116 139)' }}
                  data-testid="text-birth-time-note"
                >
                  Add your birth time in Settings for deeper energy insights.
                </p>
              )}
            </motion.div>
          )}

          {showPersonalized && !hasAstrologyProfile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="w-full max-w-md rounded-xl p-5 border text-center"
              style={{
                backgroundColor: isGoldenDawn ? 'rgba(255, 245, 224, 0.7)' : 'rgba(30, 41, 59, 0.5)',
                borderColor: isGoldenDawn ? 'rgba(245, 200, 106, 0.3)' : 'rgb(51 65 85)'
              }}
            >
              <div 
                className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
                style={{
                  background: isGoldenDawn 
                    ? 'linear-gradient(135deg, rgba(245, 200, 106, 0.3), rgba(239, 160, 69, 0.3))'
                    : 'linear-gradient(135deg, rgba(167, 139, 250, 0.3), rgba(99, 102, 241, 0.3))'
                }}
              >
                <Sparkles 
                  className="w-6 h-6" 
                  style={{ color: isGoldenDawn ? '#EFA045' : 'rgb(196 181 253)' }} 
                />
              </div>
              <h3 
                className="font-sans font-medium text-sm mb-2"
                style={{ color: isGoldenDawn ? '#1B1A17' : 'rgb(252 211 77)' }}
              >
                Personalize Your Energy Insights
              </h3>
              <p 
                className="text-sm mb-4"
                style={{ color: isGoldenDawn ? '#5D5548' : 'rgb(148 163 184)' }}
              >
                Add your birth details to unlock personalized cosmic guidance for each energy cycle.
              </p>
              <Link href="/settings">
                <Button 
                  variant="outline" 
                  className="rounded-full"
                  style={{
                    borderColor: isGoldenDawn ? '#F5C86A' : 'rgb(71 85 105)',
                    color: isGoldenDawn ? '#1B1A17' : 'rgb(226 232 240)'
                  }}
                  data-testid="button-add-birth-details"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create My Blueprint
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </Card>
  );
}
