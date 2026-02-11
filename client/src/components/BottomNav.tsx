import { useLocation, Link } from "wouter";
import { Home, Moon, User, Settings } from "lucide-react";
import { useElementTheme } from "@/lib/element-theme";
import { isGoldenDawnActive, getGoldenDawnNavAccentStyle } from "@/lib/golden-dawn-styles";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/moon", icon: Moon, label: "Energy" },
  { path: "/chart", icon: User, label: "Blueprint" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

export function BottomNav() {
  const [location] = useLocation();
  const { colors, element } = useElementTheme();
  const isGoldenDawn = isGoldenDawnActive(element);

  const navBgClass = isGoldenDawn 
    ? "bg-[#FFE7B3]/95 border-[#F5C86A]/40" 
    : colors.isDark 
      ? "bg-slate-900/95 border-slate-700" 
      : "bg-white/95 border-stone-200";

  const getActiveColor = () => {
    if (isGoldenDawn) return "#EFA045";
    return colors.isDark ? "#a78bfa" : "#d97706";
  };

  const getInactiveColor = () => {
    if (isGoldenDawn) return "#1B1A17";
    return colors.isDark ? "#9ca3af" : "#78716c";
  };

  return (
    <nav 
      className={`fixed bottom-0 left-0 right-0 backdrop-blur-md border-t z-50 ${navBgClass}`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-around py-2">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location === path;
            const navAccentStyle = getGoldenDawnNavAccentStyle(element, isActive);
            return (
              <Link key={path} href={path}>
                <button
                  className="flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all"
                  style={{ color: isActive ? getActiveColor() : getInactiveColor() }}
                  data-testid={`nav-${label.toLowerCase().replace(' ', '-')}`}
                  aria-label={label}
                >
                  <Icon 
                    className={`w-6 h-6 ${isActive ? "stroke-[2.5px]" : ""}`}
                    style={isActive && isGoldenDawn ? navAccentStyle : {}}
                  />
                  <span 
                    className="text-xs font-medium"
                    style={{ color: isActive ? getActiveColor() : getInactiveColor() }}
                  >
                    {label}
                  </span>
                </button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
