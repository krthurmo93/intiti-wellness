import { motion } from "framer-motion";
import { MoonPhaseDisplay } from "@/components/MoonPhaseDisplay";
import { useElementTheme } from "@/lib/element-theme";
import { isGoldenDawnActive, getGoldenDawnBackgroundClasses } from "@/lib/golden-dawn-styles";

export default function MoonPage() {
  const { colors, element } = useElementTheme();
  const isGoldenDawn = isGoldenDawnActive(element);
  const bgClasses = getGoldenDawnBackgroundClasses(element);

  return (
    <div 
      className={`min-h-screen bg-gradient-to-b ${colors.gradient} transition-colors duration-500 ${bgClasses}`}
      style={isGoldenDawn ? { background: `linear-gradient(to bottom, #FFE7B3, #EFA045, #E2755B)` } : {}}
    >
      <div className={`${colors.overlay} min-h-screen transition-colors duration-500`}>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="font-serif text-3xl md:text-4xl font-light mb-1" style={{ color: colors.textPrimary }}>
              Today's Energy
            </h1>
            <p className="font-sans" style={{ color: colors.textMuted }}>
              Cosmic guidance for your journey
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <MoonPhaseDisplay showPersonalized={true} />
          </motion.div>

          <div className="h-24" />
        </div>
      </div>
    </div>
  );
}
