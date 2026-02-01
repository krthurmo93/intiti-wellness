import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sun, Moon, Sunrise, ArrowRight } from "lucide-react";
import type { UserProfile } from "@shared/schema";
import { signDescriptions } from "@shared/schema";

interface ChartRevealProps {
  profile: UserProfile;
  onContinue: () => void;
}

export function ChartReveal({ profile, onContinue }: ChartRevealProps) {
  const signs = [
    {
      type: "Sun",
      sign: profile.sunSign,
      icon: Sun,
      description: signDescriptions[profile.sunSign].sun,
      gradient: "from-amber-400 to-orange-500",
      delay: 0.3,
    },
    {
      type: "Moon",
      sign: profile.moonSign,
      icon: Moon,
      description: signDescriptions[profile.moonSign].moon,
      gradient: "from-slate-400 to-slate-600",
      delay: 0.5,
    },
    {
      type: "Rising",
      sign: profile.risingSign,
      icon: Sunrise,
      description: signDescriptions[profile.risingSign].rising,
      gradient: "from-rose-400 to-pink-500",
      delay: 0.7,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-b from-amber-50/80 via-stone-50 to-amber-50/60"
    >
      <div className="w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-8"
        >
          <h1 
            className="font-serif text-3xl md:text-4xl font-light text-stone-800 mb-2"
            data-testid="text-welcome-name"
          >
            Welcome to your space, {profile.name}.
          </h1>
          <p className="font-serif text-lg text-stone-600 italic" data-testid="text-chart-summary">
            You are a {profile.sunSign} Sun, {profile.moonSign} Moon, {profile.risingSign} Rising.
          </p>
        </motion.div>

        <div className="space-y-4 mb-8">
          {signs.map(({ type, sign, icon: Icon, description, gradient, delay }) => (
            <motion.div
              key={type}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay }}
            >
              <Card className="p-5 bg-white/80 backdrop-blur-sm border-stone-200/50">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-sm font-medium text-stone-500 uppercase tracking-wide">
                        {type}
                      </span>
                      <span className="font-serif text-xl text-stone-800" data-testid={`text-${type.toLowerCase()}-sign`}>
                        {sign}
                      </span>
                    </div>
                    <p className="text-stone-600 text-sm leading-relaxed" data-testid={`text-${type.toLowerCase()}-description`}>
                      {description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="text-center"
        >
          <Button
            onClick={onContinue}
            className="px-10 py-6 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium text-lg shadow-md"
            data-testid="button-continue-home"
          >
            Enter Your Space
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
