import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Flame, Droplets, Wind, Mountain, Sparkles, ArrowRight } from "lucide-react";
import type { Element } from "@shared/schema";

interface ElementSelectStepProps {
  value: Element | null;
  onChange: (element: Element) => void;
  onNext: () => void;
  onBack: () => void;
}

const elements: { id: Element; name: string; icon: typeof Flame; description: string; colors: string }[] = [
  {
    id: "fire",
    name: "Fire",
    icon: Flame,
    description: "Bold. Passionate. Activated.",
    colors: "from-orange-400 to-red-500",
  },
  {
    id: "water",
    name: "Water",
    icon: Droplets,
    description: "Soft. Intuitive. Emotional flow.",
    colors: "from-cyan-400 to-blue-500",
  },
  {
    id: "air",
    name: "Air",
    icon: Wind,
    description: "Clear. Open. Expansive.",
    colors: "from-purple-400 to-indigo-500",
  },
  {
    id: "earth",
    name: "Earth",
    icon: Mountain,
    description: "Grounded. Steady. Supported.",
    colors: "from-amber-500 to-green-600",
  },
  {
    id: "cosmic",
    name: "Cosmic",
    icon: Sparkles,
    description: "Mystical. Open. In-between.",
    colors: "from-violet-500 to-indigo-600",
  },
];

export function ElementSelectStep({ value, onChange, onNext, onBack }: ElementSelectStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-8 bg-gradient-to-b from-amber-50/80 via-stone-50 to-amber-50/60"
    >
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <h2 
            className="font-serif text-3xl md:text-4xl font-light text-stone-800 mb-3 tracking-wide text-center"
            data-testid="text-element-title"
          >
            Choose your elemental vibe
          </h2>
          <p className="text-stone-500 text-center font-sans">
            Fire, Water, Earth, Air, or Cosmic: each colors your space differently.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-3 mb-8"
        >
          {elements.map(({ id, name, icon: Icon, description, colors }, index) => {
            const isSelected = value === id;
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
              >
                <Button
                  variant="outline"
                  onClick={() => onChange(id)}
                  className={`w-full h-auto flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 ${
                    isSelected
                      ? `border-transparent bg-gradient-to-r ${colors} text-white shadow-lg`
                      : "border-stone-200 bg-white/80 text-stone-700"
                  }`}
                  data-testid={`button-element-${id}`}
                >
                  <div
                    className={`w-12 h-12 min-w-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isSelected ? "bg-white/20" : `bg-gradient-to-br ${colors}`
                    }`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="font-medium text-base block">{name}</span>
                    <span className={`text-sm ${isSelected ? "text-white/80" : "text-stone-500"}`}>
                      {description}
                    </span>
                  </div>
                </Button>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex justify-between items-center"
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

          <Button
            onClick={onNext}
            disabled={!value}
            className="px-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium shadow-md disabled:opacity-50"
            data-testid="button-next"
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>

        <div className="flex justify-center mt-8 gap-2">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === 6 ? "bg-amber-500 w-6" : "bg-stone-300"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
