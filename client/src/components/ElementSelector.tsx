import { motion } from "framer-motion";
import { Flame, Droplets, Wind, Mountain, Sparkles, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Element } from "@shared/schema";
import { useElementTheme } from "@/lib/element-theme";
import { hasSeenGoldenDawnWelcome, setGoldenDawnWelcomeSeen } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

interface ElementSelectorProps {
  onSelect?: (element: Element) => void;
  showTitle?: boolean;
}

const elements: { id: Element; name: string; icon: typeof Flame; colors: string; gradient: string; label: string }[] = [
  {
    id: "fire",
    name: "Fiery",
    icon: Flame,
    colors: "from-orange-400 to-red-500",
    gradient: "linear-gradient(to bottom right, #fb923c, #ef4444)",
    label: "Passionate",
  },
  {
    id: "water",
    name: "Watery",
    icon: Droplets,
    colors: "from-cyan-400 to-blue-500",
    gradient: "linear-gradient(to bottom right, #22d3ee, #3b82f6)",
    label: "Intuitive",
  },
  {
    id: "air",
    name: "Airy",
    icon: Wind,
    colors: "from-purple-400 to-indigo-500",
    gradient: "linear-gradient(to bottom right, #c084fc, #6366f1)",
    label: "Curious",
  },
  {
    id: "earth",
    name: "Earthy",
    icon: Mountain,
    colors: "from-amber-500 to-green-600",
    gradient: "linear-gradient(to bottom right, #f59e0b, #16a34a)",
    label: "Grounded",
  },
  {
    id: "cosmic",
    name: "Cosmic",
    icon: Sparkles,
    colors: "from-violet-500 to-indigo-600",
    gradient: "linear-gradient(to bottom right, #8b5cf6, #4f46e5)",
    label: "Mystical",
  },
  {
    id: "golden_dawn",
    name: "Golden Dawn",
    icon: Sun,
    colors: "from-[#F5C86A] via-[#EFA045] to-[#E2755B]",
    gradient: "linear-gradient(135deg, #F5C86A 0%, #EFA045 50%, #E2755B 100%)",
    label: "Radiant",
  },
];

export function ElementSelector({ onSelect, showTitle = true }: ElementSelectorProps) {
  const { element: selectedElement, setElement, colors } = useElementTheme();
  const { toast } = useToast();

  const handleSelect = (element: Element) => {
    if (element === "golden_dawn" && !hasSeenGoldenDawnWelcome()) {
      setGoldenDawnWelcomeSeen(true);
      toast({
        title: "Golden Dawn Activated",
        description: "Welcome to the gateway into higher consciousness. Intuition sharpens, energy aligns, and inner guidance becomes louder than fear.",
        className: "bg-gradient-to-r from-[#FFE7B3] via-[#EFA045] to-[#E2755B] text-[#1B1A17] border border-[#F5C86A]/50",
      });
    }
    setElement(element);
    onSelect?.(element);
  };

  return (
    <div className="w-full">
      {showTitle && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h2 
            className="font-serif text-2xl mb-2" 
            style={{ color: colors.textPrimary }}
            data-testid="text-element-title"
          >
            How are you feeling today?
          </h2>
          <p className="text-sm" style={{ color: colors.textMuted }}>Choose the energy that resonates with you</p>
        </motion.div>
      )}

      <div 
        className="grid grid-cols-2 gap-3 md:grid-cols-3"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '0.75rem'
        }}
      >
        {elements.map(({ id, name, icon: Icon, colors: elementColors, gradient, label }, index) => {
          const isSelected = selectedElement === id;
          const isGoldenDawn = id === "golden_dawn";
          
          // Comprehensive inline styles for iOS WebView compatibility
          const buttonStyles: React.CSSProperties = {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            width: '100%',
            borderRadius: '0.75rem',
            borderWidth: '2px',
            borderStyle: 'solid',
            padding: isGoldenDawn ? '1rem' : '0.75rem',
            minHeight: isGoldenDawn ? '130px' : 'auto',
            transition: 'all 0.3s ease',
            ...(isGoldenDawn ? {
              background: isSelected 
                ? "linear-gradient(135deg, #F5C86A 0%, #EFA045 50%, #E2755B 100%)" 
                : "linear-gradient(135deg, rgba(245, 200, 106, 0.85), rgba(239, 160, 69, 0.7))",
              borderColor: isSelected ? "#F5C86A" : "rgba(245, 200, 106, 0.5)",
              boxShadow: isSelected 
                ? "0 0 25px rgba(245, 200, 106, 0.5), inset 0 0 20px rgba(245, 200, 106, 0.15)" 
                : "0 0 12px rgba(245, 200, 106, 0.25)",
              color: '#1B1A17',
            } : isSelected ? {
              background: gradient,
              borderColor: 'transparent',
              color: 'white',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            } : colors.isDark ? {
              background: 'rgba(139, 92, 246, 0.5)',
              borderColor: 'rgba(167, 139, 250, 0.4)',
              color: 'white',
            } : {
              background: 'rgba(255, 255, 255, 0.8)',
              borderColor: '#e7e5e4',
              color: '#44403c',
            }),
          };
          
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Button
                variant="outline"
                onClick={() => handleSelect(id)}
                className={`w-full flex flex-col items-center gap-2 rounded-xl border-2 transition-all duration-300 overflow-visible relative ${
                  isGoldenDawn 
                    ? "min-h-[130px] p-4" 
                    : "h-auto p-3"
                } ${
                  isGoldenDawn
                    ? "text-[#1B1A17]"
                    : isSelected
                      ? `border-transparent bg-gradient-to-br ${elementColors} text-white shadow-lg`
                      : colors.isDark 
                        ? "border-violet-400/40 bg-violet-900/50 text-white" 
                        : "border-stone-200 bg-white/80 text-stone-700"
                }`}
                style={buttonStyles}
                data-testid={`button-element-${id}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isGoldenDawn
                      ? ""
                      : isSelected 
                        ? "bg-white/20" 
                        : `bg-gradient-to-br ${elementColors}`
                  }`}
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '9999px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    ...(isGoldenDawn ? {
                      background: "radial-gradient(circle at 50% 50%, rgba(245, 200, 106, 0.5) 0%, transparent 70%), linear-gradient(135deg, #F5C86A, #EFA045)",
                      boxShadow: "0 0 20px rgba(245, 200, 106, 0.5), 0 0 40px rgba(239, 160, 69, 0.3)",
                    } : isSelected ? {
                      background: 'rgba(255, 255, 255, 0.2)',
                    } : {
                      background: gradient,
                    }),
                  }}
                >
                  <Icon className={`w-5 h-5 ${isGoldenDawn ? "text-[#1B1A17]" : "text-white"}`} />
                </div>
                <span className={`text-sm w-full text-center ${
                  isGoldenDawn 
                    ? "text-[#1B1A17] font-semibold" 
                    : "font-medium"
                }`}>{name}</span>
                <span className={`text-xs text-center leading-relaxed w-full px-1 ${
                  isGoldenDawn ? "" : "line-clamp-2"
                } ${
                  isGoldenDawn
                    ? "text-[#3D3A34]"
                    : isSelected 
                      ? "text-white/80" 
                      : colors.isDark 
                        ? "text-violet-300/70" 
                        : "text-stone-500"
                }`}>
                  {label}
                </span>
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
