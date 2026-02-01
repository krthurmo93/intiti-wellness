import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { saveOnboardingData, getOnboardingData } from "@/lib/storage";

export default function OnboardingName() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");

  useEffect(() => {
    const existing = getOnboardingData();
    if (existing?.name) {
      setName(existing.name);
    }
  }, []);

  const handleNext = () => {
    if (name.trim()) {
      saveOnboardingData({ name: name.trim() });
      setLocation("/onboarding/birth");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && name.trim()) {
      handleNext();
    }
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
          onClick={() => setLocation("/onboarding/welcome")}
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
          <h2 
            className="font-serif text-3xl font-light text-white mb-3"
            data-testid="text-name-title"
          >
            What should we call you?
          </h2>
          <p className="text-violet-200 font-sans">
            This is how we'll greet you in your sanctuary.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Your name"
            className="text-center text-xl py-6 border-violet-500/30 focus:border-violet-400 bg-white/5 text-white placeholder:text-violet-400/50"
            data-testid="input-name"
            autoFocus
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-8 flex justify-end"
        >
          <Button
            onClick={handleNext}
            disabled={!name.trim()}
            className="px-8 py-6 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium shadow-md shadow-violet-500/30 disabled:opacity-50"
            data-testid="button-next"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
