import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Sparkles, Zap, Stars } from "lucide-react";
import { saveOnboardingData, getOnboardingData } from "@/lib/storage";
import type { SpiritualStyle } from "@shared/schema";

const styleOptions: { id: SpiritualStyle; title: string; description: string; icon: typeof Sparkles }[] = [
  {
    id: "archetype",
    title: "Archetype Mode",
    description: "Mystical archetypes and deep healing wisdom. Connect with ancient symbolic meanings.",
    icon: Sparkles,
  },
  {
    id: "energy",
    title: "Energy Mode",
    description: "Grounded spiritual wellness language. Practical insights for everyday life.",
    icon: Zap,
  },
  {
    id: "cosmic",
    title: "Cosmic Mode",
    description: "Light cosmic energy references. Celestial influences and universal flow.",
    icon: Stars,
  },
];

export default function OnboardingSpiritualStyle() {
  const [, setLocation] = useLocation();
  const [selectedStyle, setSelectedStyle] = useState<SpiritualStyle>("archetype");

  useEffect(() => {
    const existing = getOnboardingData();
    if (existing?.spiritualStyle) {
      setSelectedStyle(existing.spiritualStyle);
    }
  }, []);

  const handleNext = () => {
    saveOnboardingData({ spiritualStyle: selectedStyle });
    setLocation("/onboarding/account");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-slate-950 via-indigo-950 to-violet-950"
    >
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation("/onboarding/intention")}
          className="mb-8 text-violet-300"
          data-testid="button-back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2, type: "spring" }}
            className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center border border-violet-500/30"
          >
            <Sparkles className="w-8 h-8 text-violet-400" />
          </motion.div>

          <h2 
            className="font-serif text-3xl font-light text-white mb-3"
            data-testid="text-style-title"
          >
            Choose your lens
          </h2>
          <p className="text-violet-200 font-sans">
            How would you like to receive your energy insights?
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="space-y-3"
        >
          {styleOptions.map((option) => {
            const IconComponent = option.icon;
            const isSelected = selectedStyle === option.id;
            return (
              <button
                key={option.id}
                onClick={() => setSelectedStyle(option.id)}
                className={`w-full p-4 rounded-lg text-left transition-all duration-200 border ${
                  isSelected
                    ? "bg-violet-500/20 border-violet-400 shadow-md shadow-violet-500/20"
                    : "bg-white/5 border-violet-500/20 hover-elevate"
                }`}
                data-testid={`button-style-${option.id}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isSelected 
                      ? "bg-gradient-to-br from-violet-500 to-fuchsia-500" 
                      : "bg-violet-500/20"
                  }`}>
                    <IconComponent className={`w-5 h-5 ${isSelected ? "text-white" : "text-violet-400"}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-medium ${isSelected ? "text-white" : "text-violet-100"}`}>
                      {option.title}
                    </h3>
                    <p className="text-sm text-violet-300 mt-1">
                      {option.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="text-xs text-violet-400/70 mt-4 text-center"
        >
          You can change this anytime in Settings
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mt-8 flex justify-end"
        >
          <Button
            onClick={handleNext}
            className="px-8 py-6 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium shadow-md shadow-violet-500/30"
            data-testid="button-next"
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
