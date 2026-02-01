import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function OnboardingWelcome() {
  const [, setLocation] = useLocation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-gray-50 to-white"
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
          className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg"
        >
          <Sparkles className="w-10 h-10 text-white" />
        </motion.div>

        <h1 
          className="font-serif text-4xl md:text-5xl font-light text-gray-900 mb-4 tracking-wide"
          style={{ letterSpacing: "0.02em" }}
          data-testid="text-welcome-title"
        >
          Welcome to Intiti
        </h1>
        
        <p className="text-gray-500 text-lg mb-12 font-sans" data-testid="text-welcome-subtitle">
          A sanctuary for your mind, body, and spirit.
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Button
            onClick={() => setLocation("/onboarding/name")}
            className="px-12 py-6 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium text-lg shadow-md"
            data-testid="button-begin"
          >
            Begin
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 text-gray-400 text-sm font-sans"
      >
        Intiti
      </motion.div>
    </motion.div>
  );
}
