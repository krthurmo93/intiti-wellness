import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface AstrologyOptInProps {
  onYes: () => void;
  onSkip: () => void;
  onBack: () => void;
}

export function AstrologyOptIn({ onYes, onSkip, onBack }: AstrologyOptInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-amber-50/80 via-stone-50 to-amber-50/60"
    >
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10"
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 
            className="font-serif text-3xl md:text-4xl font-light text-stone-800 mb-3 tracking-wide text-center"
            data-testid="text-astrology-optin-title"
          >
            Do you want astrology in your space?
          </h2>
          <p className="text-stone-500 text-center font-sans">
            We can personalize your experience with your birth chart, or you can skip this for now.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-3"
        >
          <Button
            onClick={onYes}
            className="w-full py-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium text-lg shadow-md"
            data-testid="button-astrology-yes"
          >
            Yes, personalize with my birth chart
          </Button>

          <Button
            variant="outline"
            onClick={onSkip}
            className="w-full py-6 rounded-xl border-2 border-stone-300 text-stone-600 font-medium text-lg"
            data-testid="button-astrology-skip"
          >
            Skip for now
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-stone-400 text-sm text-center mt-6"
        >
          You can always add or update your birth details later in Settings.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex justify-start pt-8"
        >
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            className="text-stone-500"
            data-testid="button-back"
          >
            Back
          </Button>
        </motion.div>

        <div className="flex justify-center mt-8 gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === 2 ? "bg-amber-500 w-6" : "bg-stone-300"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
