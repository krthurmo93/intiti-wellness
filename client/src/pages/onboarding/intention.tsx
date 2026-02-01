import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Feather } from "lucide-react";
import { saveOnboardingData, getOnboardingData } from "@/lib/storage";

export default function OnboardingIntention() {
  const [, setLocation] = useLocation();
  const [intention, setIntention] = useState("");

  useEffect(() => {
    const existing = getOnboardingData();
    if (existing?.intention) {
      setIntention(existing.intention);
    }
  }, []);

  const handleNext = () => {
    saveOnboardingData({ intention: intention.trim() || undefined });
    setLocation("/onboarding/spiritual-style");
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
          onClick={() => setLocation("/onboarding/birth")}
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
            <Feather className="w-8 h-8 text-violet-400" />
          </motion.div>

          <h2 
            className="font-serif text-3xl font-light text-white mb-3"
            data-testid="text-intention-title"
          >
            Set your intention
          </h2>
          <p className="text-violet-200 font-sans">
            What brings you here today? What are you seeking?
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Textarea
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            placeholder="I want to find inner peace and clarity..."
            className="min-h-32 text-lg border-violet-500/30 focus:border-violet-400 bg-white/5 text-white placeholder:text-violet-400/50 resize-none"
            data-testid="input-intention"
          />
          <p className="text-xs text-violet-400/70 mt-2 text-center">
            Optional - you can set intentions anytime in the app
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
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
