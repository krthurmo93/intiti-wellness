import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Calendar, Clock } from "lucide-react";
import { saveOnboardingData, getOnboardingData } from "@/lib/storage";
import { CityAutocomplete } from "@/components/CityAutocomplete";

export default function OnboardingBirth() {
  const [, setLocation] = useLocation();
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [timeOfBirth, setTimeOfBirth] = useState("");
  const [cityOfBirth, setCityOfBirth] = useState("");

  useEffect(() => {
    const existing = getOnboardingData();
    if (existing) {
      if (existing.dateOfBirth) setDateOfBirth(existing.dateOfBirth);
      if (existing.timeOfBirth) setTimeOfBirth(existing.timeOfBirth);
      if (existing.cityOfBirth) setCityOfBirth(existing.cityOfBirth);
    }
  }, []);

  const handleNext = () => {
    saveOnboardingData({
      dateOfBirth: dateOfBirth || undefined,
      timeOfBirth: timeOfBirth || undefined,
      cityOfBirth: cityOfBirth || undefined,
      birthTimeKnown: !!timeOfBirth,
    });
    setLocation("/onboarding/intention");
  };

  const handleSkip = () => {
    saveOnboardingData({
      dateOfBirth: undefined,
      timeOfBirth: undefined,
      cityOfBirth: undefined,
      birthTimeKnown: false,
    });
    setLocation("/onboarding/intention");
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
          onClick={() => setLocation("/onboarding/name")}
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
            data-testid="text-birth-title"
          >
            Your birth details
          </h2>
          <p className="text-violet-200 font-sans">
            Optional - helps personalize your astrological experience.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="space-y-4"
        >
          <div className="relative flex items-center">
            <Calendar className="absolute left-3 w-5 h-5 text-violet-400 z-10" />
            <Input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="pl-12 h-auto py-3 border-violet-500/30 focus:border-violet-400 bg-white/5 text-white [color-scheme:dark]"
              data-testid="input-date-of-birth"
            />
          </div>

          <div>
            <div className="relative flex items-center">
              <Clock className="absolute left-3 w-5 h-5 text-violet-400 z-10" />
              <Input
                type="time"
                value={timeOfBirth}
                onChange={(e) => setTimeOfBirth(e.target.value)}
                placeholder="Birth time (optional)"
                className="pl-12 h-auto py-3 border-violet-500/30 focus:border-violet-400 bg-white/5 text-white [color-scheme:dark]"
                data-testid="input-time-of-birth"
              />
            </div>
            <p className="text-xs text-violet-400/70 mt-1.5 ml-1">Optional - needed for rising sign</p>
          </div>

          <CityAutocomplete
            value={cityOfBirth}
            onChange={setCityOfBirth}
            placeholder="Birth city (optional)"
            className="pl-12 h-auto py-3 border-violet-500/30 focus:border-violet-400 bg-white/5 text-white placeholder:text-violet-400/50"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-8 flex justify-between items-center"
        >
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-violet-300"
            data-testid="button-skip"
          >
            Skip for now
          </Button>

          <Button
            onClick={handleNext}
            className="px-8 py-6 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium shadow-md shadow-violet-500/30"
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
