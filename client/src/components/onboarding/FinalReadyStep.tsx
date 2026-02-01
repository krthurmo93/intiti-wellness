import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";

interface FinalReadyStepProps {
  name: string;
  hasAstrologyProfile: boolean;
  onComplete: () => void;
  isLoading?: boolean;
}

export function FinalReadyStep({ name, hasAstrologyProfile, onComplete, isLoading }: FinalReadyStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-amber-50/80 via-stone-50 to-amber-50/60"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
          className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg"
        >
          <Sparkles className="w-10 h-10 text-white" />
        </motion.div>

        <h1 
          className="font-serif text-4xl md:text-5xl font-light text-stone-800 mb-4 tracking-wide"
          data-testid="text-ready-title"
        >
          You&apos;re all set, {name}.
        </h1>
        
        <p className="text-stone-500 text-lg mb-10 font-sans" data-testid="text-ready-subtitle">
          Welcome to Intiti. This is your space to breathe, reflect, and realign.
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Button
            onClick={onComplete}
            disabled={isLoading}
            className="px-12 py-6 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium text-lg shadow-md"
            data-testid="button-enter-space"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Preparing your chart...
              </>
            ) : (
              "Enter my space"
            )}
          </Button>
        </motion.div>

        {!hasAstrologyProfile && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="text-stone-400 text-sm mt-8"
          >
            Add your birth details anytime to unlock your full chart.
          </motion.p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 text-stone-400 text-sm font-sans"
      >
        Intiti
      </motion.div>
    </motion.div>
  );
}
