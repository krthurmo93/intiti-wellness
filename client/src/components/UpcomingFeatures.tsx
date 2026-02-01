import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { 
  Heart, 
  Calendar, 
  BookOpen, 
  Mic,
  Sparkles,
  Camera,
  Circle
} from "lucide-react";
import { useElementTheme } from "@/lib/element-theme";
import { isGoldenDawnActive, getGoldenDawnCardStyle, getGoldenDawnCardClasses, getGoldenDawnTextColors } from "@/lib/golden-dawn-styles";
import { GoldenDawnTheme } from "@/lib/golden-dawn-theme";

const features = [
  {
    id: "synastry",
    name: "Connection Energy",
    description: "Compare charts with loved ones",
    icon: Heart,
    color: "from-pink-400 to-rose-500",
    route: "/synastry-beta",
  },
  {
    id: "transits",
    name: "Transits Calendar",
    description: "Track planetary movements",
    icon: Calendar,
    color: "from-indigo-400 to-purple-500",
    route: "/transits-beta",
  },
  {
    id: "dream-journal",
    name: "Dream Journal",
    description: "Record and interpret dreams",
    icon: BookOpen,
    color: "from-cyan-400 to-blue-500",
    route: "/dream-journal-beta",
  },
  {
    id: "subliminals",
    name: "AI Subliminals",
    description: "Personalized affirmation tracks",
    icon: Mic,
    color: "from-violet-400 to-purple-500",
    route: "/subliminals",
  },
  {
    id: "mirror-work",
    name: "Mirror Work",
    description: "Camera affirmation practice",
    icon: Camera,
    color: "from-rose-400 to-pink-500",
    route: "/mirror-work",
  },
  {
    id: "presence",
    name: "Presence",
    description: "Dark-screen stillness timer",
    icon: Circle,
    color: "from-slate-400 to-gray-600",
    route: "/presence",
  },
];

export function UpcomingFeatures() {
  const { element, colors } = useElementTheme();
  const [, setLocation] = useLocation();
  const isGoldenDawn = isGoldenDawnActive(element);
  const cardClasses = getGoldenDawnCardClasses(element);
  const gdTextColors = getGoldenDawnTextColors(element);

  const handleFeatureClick = (route: string) => {
    setLocation(route);
  };

  return (
    <Card 
      className={`p-6 md:p-8 border ${isGoldenDawn ? "border-[#FAD792]/35" : ""} ${cardClasses}`}
      style={getGoldenDawnCardStyle(colors, element)}
    >
      <div className="flex items-center gap-3 mb-6">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: isGoldenDawn
              ? `linear-gradient(135deg, ${GoldenDawnTheme.primary.gold}, ${GoldenDawnTheme.primary.deepOrange})`
              : colors.isDark
                ? 'radial-gradient(circle at 30% 20%, #a78bfa 0%, #8b5cf6 60%, #4c1d95 100%)'
                : 'radial-gradient(circle at 30% 20%, #c4b5fd 0%, #8b5cf6 60%, #5b21b6 100%)'
          }}
        >
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 
            className="font-sans font-semibold text-lg" 
            style={{ color: gdTextColors?.primary || colors.textPrimary }}
          >
            Wellness Tools
          </h3>
          <p className="text-sm" style={{ color: gdTextColors?.secondary || colors.textMuted }}>
            Your advanced wellness features
          </p>
        </div>
      </div>

      <div 
        className="grid grid-cols-2 gap-3"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '0.75rem'
        }}
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;
          
          return (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="relative group cursor-pointer"
              onClick={() => handleFeatureClick(feature.route)}
              data-testid={`card-feature-${feature.id}`}
            >
              <div 
                className="p-4 rounded-xl min-h-[120px] transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: isGoldenDawn
                    ? `linear-gradient(135deg, ${GoldenDawnTheme.surface.backgroundSolid} 0%, ${GoldenDawnTheme.gradients.surfaceSolid} 100%)`
                    : colors.isDark 
                      ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(168, 85, 247, 0.2) 50%, rgba(49, 46, 129, 0.8) 100%)'
                      : 'linear-gradient(135deg, rgba(221, 214, 254, 0.95) 0%, rgba(237, 233, 254, 0.95) 50%, rgba(245, 243, 255, 0.95) 100%)',
                  border: isGoldenDawn
                    ? `1px solid ${GoldenDawnTheme.borders.gold}`
                    : colors.isDark ? '1px solid rgba(167, 139, 250, 0.4)' : '1px solid rgba(139, 92, 246, 0.4)',
                  boxShadow: isGoldenDawn
                    ? GoldenDawnTheme.cards.shadow
                    : colors.isDark 
                      ? '0 4px 20px rgba(139, 92, 246, 0.2)' 
                      : '0 4px 20px rgba(139, 92, 246, 0.15)'
                }}
              >
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${isGoldenDawn ? '' : `bg-gradient-to-br ${feature.color}`}`}
                  style={{ 
                    background: isGoldenDawn 
                      ? `linear-gradient(135deg, ${GoldenDawnTheme.primary.gold}, ${GoldenDawnTheme.primary.deepOrange})`
                      : undefined
                  }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h4 
                  className="font-medium text-sm mb-1"
                  style={{ 
                    color: isGoldenDawn
                      ? gdTextColors?.primary
                      : colors.isDark ? 'rgba(237, 233, 254, 0.95)' : 'rgba(88, 28, 135, 0.95)',
                  }}
                  data-testid={`text-feature-title-${feature.id}`}
                >
                  {feature.name}
                </h4>
                <p 
                  className="text-xs"
                  style={{ 
                    color: isGoldenDawn
                      ? gdTextColors?.secondary
                      : colors.isDark ? 'rgba(196, 181, 253, 0.8)' : 'rgba(107, 70, 193, 0.8)',
                  }}
                  data-testid={`text-feature-desc-${feature.id}`}
                >
                  {feature.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="text-center text-xs mt-4" style={{ color: gdTextColors?.secondary || colors.textMuted }}>
        Tap to explore your wellness tools
      </p>
    </Card>
  );
}
