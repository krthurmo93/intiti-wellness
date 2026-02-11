import { motion } from "framer-motion";
import { MyChart } from "@/components/MyChart";
import { useElementTheme } from "@/lib/element-theme";
import { isGoldenDawnActive, getGoldenDawnBackgroundClasses } from "@/lib/golden-dawn-styles";

export default function ChartPage() {
  const { colors, element } = useElementTheme();
  const isGoldenDawn = isGoldenDawnActive(element);
  const bgClasses = getGoldenDawnBackgroundClasses(element);

  return (
    <div 
      className="min-h-screen transition-colors duration-500"
      style={{ background: colors.gradientStyle }}
    >
      <div className={`${colors.overlay} min-h-screen-safe transition-colors duration-500`}>
        <div className="max-w-2xl mx-auto px-4 py-8 pb-safe-nav">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MyChart />
          </motion.div>

          <div className="h-24" />
        </div>
      </div>
    </div>
  );
}
