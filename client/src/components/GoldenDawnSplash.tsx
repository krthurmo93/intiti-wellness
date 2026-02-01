import { motion, AnimatePresence } from "framer-motion";
import { Sun } from "lucide-react";

interface GoldenDawnSplashProps {
  isVisible: boolean;
  onComplete?: () => void;
}

export function GoldenDawnSplash({ isVisible, onComplete }: GoldenDawnSplashProps) {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gd-gradient-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          data-testid="splash-golden-dawn"
        >
          <motion.div
            className="relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(245, 200, 106, 0.6) 0%, transparent 70%)",
                filter: "blur(20px)",
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.6, 0.8, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <div className="relative p-8">
              <Sun 
                className="w-24 h-24 no-gd-recolor" 
                style={{ color: "#F5C86A" }}
                strokeWidth={1.5}
              />
            </div>
          </motion.div>
          
          <motion.p
            className="mt-8 text-xl font-serif tracking-wide"
            style={{ color: "#1B1A17" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Entering Golden Dawn...
          </motion.p>
          
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-32"
            style={{
              background: "linear-gradient(to top, rgba(226, 117, 91, 0.3), transparent)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
