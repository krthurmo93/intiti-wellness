import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wind, Play, Pause, RotateCcw, Waves } from "lucide-react";
import { useElementTheme } from "@/lib/element-theme";
import { isGoldenDawnActive, getGoldenDawnCardStyle, getGoldenDawnCardClasses, getGoldenDawnTextColors } from "@/lib/golden-dawn-styles";
import { GoldenDawnTheme } from "@/lib/golden-dawn-theme";

type BreathPhase = "inhale" | "hold" | "exhale" | "holdEmpty";
type ExerciseType = "478" | "box";

interface BreathExercise {
  id: ExerciseType;
  name: string;
  description: string;
  phases: { phase: BreathPhase; duration: number; label: string }[];
}

const exercises: BreathExercise[] = [
  {
    id: "478",
    name: "4-7-8 Breathing",
    description: "Calming technique for relaxation",
    phases: [
      { phase: "inhale", duration: 4, label: "Breathe In" },
      { phase: "hold", duration: 7, label: "Hold" },
      { phase: "exhale", duration: 8, label: "Breathe Out" },
    ],
  },
  {
    id: "box",
    name: "Box Breathing",
    description: "Balance and focus technique",
    phases: [
      { phase: "inhale", duration: 4, label: "Breathe In" },
      { phase: "hold", duration: 4, label: "Hold" },
      { phase: "exhale", duration: 4, label: "Breathe Out" },
      { phase: "holdEmpty", duration: 4, label: "Hold" },
    ],
  },
];

export function BreathworkTimer() {
  const [selectedExercise, setSelectedExercise] = useState<ExerciseType>("478");
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseTime, setPhaseTime] = useState(0);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { element, colors } = useElementTheme();
  const isGoldenDawn = isGoldenDawnActive(element);
  const cardClasses = getGoldenDawnCardClasses(element);
  const gdTextColors = getGoldenDawnTextColors(element);

  const exercise = exercises.find((e) => e.id === selectedExercise)!;
  const currentPhase = exercise.phases[currentPhaseIndex];
  const totalPhaseTime = currentPhase.duration;

  const resetTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    setCurrentPhaseIndex(0);
    setPhaseTime(0);
    setCycles(0);
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setPhaseTime((prev) => {
          const newTime = prev + 0.1;
          if (newTime >= totalPhaseTime) {
            setCurrentPhaseIndex((prevIndex) => {
              const nextIndex = (prevIndex + 1) % exercise.phases.length;
              if (nextIndex === 0) {
                setCycles((c) => c + 1);
              }
              return nextIndex;
            });
            return 0;
          }
          return newTime;
        });
      }, 100);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, totalPhaseTime, exercise.phases.length]);

  useEffect(() => {
    resetTimer();
  }, [selectedExercise, resetTimer]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const progress = (phaseTime / totalPhaseTime) * 100;
  const circleScale = currentPhase.phase === "inhale" ? 1 + (phaseTime / totalPhaseTime) * 0.25 :
                      currentPhase.phase === "exhale" ? 1.25 - (phaseTime / totalPhaseTime) * 0.25 : 1.125;

  return (
    <Card 
      className={`p-6 md:p-8 border ${isGoldenDawn ? "border-[#FAD792]/35" : ""} ${cardClasses}`}
      style={getGoldenDawnCardStyle(colors, element)}
    >
      <div className="flex items-center gap-3 mb-6">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: isGoldenDawn
              ? `linear-gradient(135deg, ${GoldenDawnTheme.primary.gold}, ${GoldenDawnTheme.primary.deepOrange})`
              : colors.isDark
                ? 'radial-gradient(circle at 30% 20%, #a78bfa 0%, #8b5cf6 60%, #4c1d95 100%)'
                : 'radial-gradient(circle at 30% 20%, #76e4ff 0%, #3b82f6 60%, #1d1b4f 100%)'
          }}
        >
          <Wind className="w-5 h-5 text-white" />
        </div>
        <h3 
          className="font-sans font-semibold text-lg" 
          style={{ color: gdTextColors?.primary || colors.textPrimary }}
        >
          Breathwork
        </h3>
      </div>

      <div className="flex flex-col gap-4 mb-8 md:flex-row md:flex-wrap">
        {exercises.map((ex) => (
          <Button
            key={ex.id}
            variant="ghost"
            onClick={() => setSelectedExercise(ex.id)}
            className={`
              flex flex-row items-center gap-3 p-4 h-auto rounded-2xl text-left justify-start
              md:flex-1 md:min-w-[calc(50%-8px)] toggle-elevate ${selectedExercise === ex.id ? 'toggle-elevated' : ''}
            `}
            style={isGoldenDawn ? {
              background: selectedExercise === ex.id 
                ? `linear-gradient(135deg, ${GoldenDawnTheme.gradients.surfaceSolid}, ${GoldenDawnTheme.surface.backgroundSolid})`
                : GoldenDawnTheme.surface.backgroundSolid,
              boxShadow: selectedExercise === ex.id
                ? `${GoldenDawnTheme.cards.shadow}, inset 0 0 0 2px ${GoldenDawnTheme.borders.gold}`
                : GoldenDawnTheme.cards.shadow,
              minHeight: '90px'
            } : {
              background: colors.isDark
                ? (selectedExercise === ex.id 
                    ? 'radial-gradient(circle at top left, rgba(139, 92, 246, 0.3) 0%, rgba(168, 85, 247, 0.2) 45%, rgba(30, 27, 75, 0.9) 100%)'
                    : 'radial-gradient(circle at top left, rgba(139, 92, 246, 0.15) 0%, rgba(168, 85, 247, 0.1) 45%, rgba(30, 27, 75, 0.8) 100%)')
                : (selectedExercise === ex.id 
                    ? 'radial-gradient(circle at top left, #d4e8ff 0%, #e8dcff 45%, #fdf8ff 100%)'
                    : 'radial-gradient(circle at top left, #e6f7ff 0%, #f5ecff 45%, #fdf8ff 100%)'),
              boxShadow: colors.isDark
                ? (selectedExercise === ex.id
                    ? '0 10px 30px rgba(139, 92, 246, 0.35), inset 0 0 0 2px rgba(139, 92, 246, 0.4)'
                    : '0 10px 25px rgba(0, 0, 0, 0.4)')
                : (selectedExercise === ex.id
                    ? '0 10px 30px rgba(59, 130, 246, 0.25), inset 0 0 0 2px rgba(59, 130, 246, 0.3)'
                    : '0 10px 25px rgba(41, 54, 102, 0.18)'),
              minHeight: '90px'
            }}
            data-testid={`button-exercise-${ex.id}`}
            aria-pressed={selectedExercise === ex.id}
          >
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: isGoldenDawn
                  ? `linear-gradient(135deg, ${GoldenDawnTheme.primary.gold}, ${GoldenDawnTheme.primary.deepOrange})`
                  : colors.isDark
                    ? 'radial-gradient(circle at 30% 20%, #a78bfa 0%, #8b5cf6 60%, #4c1d95 100%)'
                    : 'radial-gradient(circle at 30% 20%, #76e4ff 0%, #3b82f6 60%, #1d1b4f 100%)'
              }}
            >
              <Waves className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <span 
                className="font-semibold leading-tight text-base"
                style={{ color: gdTextColors?.primary || colors.textPrimary }}
              >
                {ex.name}
              </span>
              <span 
                className="leading-snug text-sm opacity-85"
                style={{ color: gdTextColors?.secondary || colors.textSecondary }}
              >
                {ex.description}
              </span>
            </div>
          </Button>
        ))}
      </div>

      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center mb-6">
          <motion.div
            className="relative"
            animate={{ 
              scale: isRunning ? circleScale : 1,
            }}
            transition={{ 
              duration: 0.5, 
              ease: "easeInOut" 
            }}
          >
            <div 
              className="w-48 h-48 rounded-full flex flex-col items-center justify-center text-center relative"
              style={{
                background: isGoldenDawn
                  ? `radial-gradient(circle at 30% 10%, ${GoldenDawnTheme.primary.gold}40 0%, ${GoldenDawnTheme.primary.warmOrange}60 50%, ${GoldenDawnTheme.surface.backgroundSolid} 100%)`
                  : colors.isDark
                    ? 'radial-gradient(circle at 30% 10%, rgba(139, 92, 246, 0.4) 0%, rgba(88, 28, 135, 0.6) 50%, rgba(30, 27, 75, 0.9) 100%)'
                    : 'radial-gradient(circle at 30% 10%, #e0f2ff 0%, #edf2ff 50%, #fdf7ff 100%)',
                boxShadow: isRunning 
                  ? (isGoldenDawn
                      ? `0 14px 40px rgba(196, 130, 14, 0.5), 0 0 60px rgba(218, 165, 32, 0.3)`
                      : colors.isDark
                        ? '0 14px 40px rgba(139, 92, 246, 0.5), 0 0 60px rgba(168, 85, 247, 0.3)'
                        : '0 14px 40px rgba(59, 130, 246, 0.35), 0 0 60px rgba(139, 92, 246, 0.2)')
                  : (isGoldenDawn
                      ? GoldenDawnTheme.cards.shadow
                      : colors.isDark
                        ? '0 14px 30px rgba(0, 0, 0, 0.5)'
                        : '0 14px 30px rgba(15, 23, 42, 0.25)'),
              }}
            >
              {isRunning && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: isGoldenDawn
                      ? `radial-gradient(circle at 30% 10%, ${GoldenDawnTheme.primary.gold}33 0%, ${GoldenDawnTheme.primary.warmOrange}1A 50%, transparent 100%)`
                      : colors.isDark
                        ? 'radial-gradient(circle at 30% 10%, rgba(139, 92, 246, 0.2) 0%, rgba(168, 85, 247, 0.1) 50%, transparent 100%)'
                        : 'radial-gradient(circle at 30% 10%, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 50%, transparent 100%)',
                  }}
                  animate={{
                    opacity: [0.5, 1, 0.5],
                    scale: [0.98, 1.02, 0.98],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}
              
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentPhase.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`uppercase tracking-widest relative z-10 ${isGoldenDawn ? '' : colors.isDark ? 'text-violet-200' : 'text-stone-500'}`}
                  style={{ 
                    fontSize: '15px', 
                    letterSpacing: '0.08em',
                    color: isGoldenDawn ? gdTextColors?.secondary : undefined
                  }}
                >
                  {currentPhase.label}
                </motion.span>
              </AnimatePresence>
              
              <motion.span 
                className={`font-semibold relative z-10 mt-1 ${isGoldenDawn ? '' : colors.isDark ? 'text-white' : 'text-stone-900'}`}
                style={{ 
                  fontSize: '44px',
                  color: isGoldenDawn ? gdTextColors?.primary : undefined
                }}
                key={Math.ceil(totalPhaseTime - phaseTime)}
              >
                {Math.ceil(totalPhaseTime - phaseTime)}
              </motion.span>
            </div>
          </motion.div>
        </div>

        {cycles > 0 && (
          <p 
            className="text-sm mb-4" 
            style={{ color: isGoldenDawn ? gdTextColors?.secondary : colors.textMuted }} 
            data-testid="text-breath-cycles"
          >
            {cycles} cycle{cycles > 1 ? 's' : ''} completed
          </p>
        )}

        <div className="flex gap-3">
          <Button
            onClick={toggleTimer}
            className="px-8 rounded-full"
            style={isGoldenDawn ? {
              background: GoldenDawnTheme.buttons.primary.background,
              color: GoldenDawnTheme.buttons.primary.textColor,
              boxShadow: GoldenDawnTheme.buttons.primary.shadow,
            } : {
              background: colors.isDark
                ? 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #c084fc 100%)'
                : 'linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)',
              color: 'white',
              boxShadow: colors.isDark
                ? '0 8px 20px rgba(139, 92, 246, 0.45)'
                : '0 8px 20px rgba(99, 102, 241, 0.35)'
            }}
            data-testid="button-breath-toggle"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={resetTimer}
            className={`rounded-full backdrop-blur-sm ${isGoldenDawn ? '' : colors.isDark ? 'border-white/20 bg-white/10 text-white' : 'border-stone-300 bg-white/80'}`}
            style={isGoldenDawn ? {
              borderColor: GoldenDawnTheme.borders.gold,
              background: GoldenDawnTheme.buttons.secondary.background,
              color: GoldenDawnTheme.buttons.secondary.textColor,
            } : {}}
            data-testid="button-breath-reset"
            aria-label="Reset timer"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
