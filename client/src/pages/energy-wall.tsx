import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Sparkles, Heart, Crown } from "lucide-react";
import { useElementTheme } from "@/lib/element-theme";
import { getUserProfile } from "@/lib/storage";
import { isGoldenDawnActive } from "@/lib/golden-dawn-styles";

const sampleMembers = [
  { name: "Luna", tier: "initiates" },
  { name: "Orion", tier: "ascended" },
  { name: "Sage", tier: "initiates" },
  { name: "Nova", tier: "ascended" },
  { name: "River", tier: "initiates" },
  { name: "Phoenix", tier: "initiates" },
  { name: "Aurora", tier: "ascended" },
  { name: "Celeste", tier: "initiates" },
];

export default function EnergyWall() {
  const { colors, element } = useElementTheme();
  const isGoldenDawn = isGoldenDawnActive(element);
  const profile = getUserProfile();
  const userName = profile?.name || "You";

  return (
    <div 
      className={`min-h-screen bg-gradient-to-b ${colors.gradient} transition-colors duration-500`}
      style={isGoldenDawn ? { background: "linear-gradient(180deg, #FFE7B3 0%, #EFA045 40%, #E2755B 100%)" } : {}}
    >
      <div className={`${colors.overlay} min-h-screen transition-colors duration-500`}>
        <div className="max-w-2xl mx-auto px-4 py-8 pb-32">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div 
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ background: isGoldenDawn ? 'radial-gradient(circle, #F5C86A 0%, #E2755B 100%)' : colors.isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(217, 119, 6, 0.1)' }}
            >
              <Heart 
                className="w-8 h-8"
                style={{ color: isGoldenDawn ? '#1B1A17' : colors.isDark ? '#a78bfa' : '#d97706' }}
              />
            </div>
            
            <h1 
              className="font-serif text-3xl mb-2"
              style={{ color: colors.textPrimary }}
            >
              The Energy Wall
            </h1>
            
            <p 
              className="text-lg mb-4"
              style={{ color: colors.textSecondary }}
            >
              A quiet place to honor the souls who said yes to this journey.
            </p>
            
            <p 
              className="text-sm max-w-md mx-auto"
              style={{ color: colors.textMuted }}
            >
              Each name on this wall represents someone who chose alignment, intention, and courage. 
              Take a breath and send a silent blessing to everyone here, including yourself.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card
              className="p-6 backdrop-blur-sm"
              style={{ 
                backgroundColor: colors.cardBg, 
                borderColor: colors.cardBorder 
              }}
            >
              <div className="flex flex-wrap gap-3 justify-center">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <div 
                    className="px-4 py-2 rounded-full flex items-center gap-2 ring-2 ring-amber-400/50"
                    style={{ 
                      background: colors.isDark 
                        ? 'linear-gradient(to right, rgba(217, 119, 6, 0.3), rgba(251, 146, 60, 0.3))' 
                        : 'linear-gradient(to right, rgba(251, 191, 36, 0.3), rgba(251, 146, 60, 0.3))',
                    }}
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span style={{ color: colors.textPrimary }} className="font-medium">
                      {userName}
                    </span>
                    <span 
                      className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20"
                      style={{ color: colors.isDark ? '#fbbf24' : '#b45309' }}
                    >
                      You
                    </span>
                  </div>
                </motion.div>

                {sampleMembers.map((member, index) => (
                  <motion.div
                    key={member.name}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                  >
                    <div 
                      className="px-4 py-2 rounded-full flex items-center gap-2"
                      style={{ 
                        background: colors.isDark 
                          ? 'rgba(255, 255, 255, 0.05)' 
                          : 'rgba(255, 255, 255, 0.8)',
                        border: `1px solid ${colors.cardBorder}`
                      }}
                    >
                      {member.tier === "ascended" ? (
                        <Crown className="w-3 h-3 text-purple-500" />
                      ) : (
                        <Sparkles className="w-3 h-3 text-amber-500" />
                      )}
                      <span style={{ color: colors.textSecondary }} className="text-sm">
                        {member.name}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 text-center"
          >
            <p 
              className="text-xs"
              style={{ color: colors.textMuted }}
            >
              <Sparkles className="w-3 h-3 inline mr-1" /> Initiates 
              <span className="mx-2">|</span>
              <Crown className="w-3 h-3 inline mr-1" /> Ascended
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
