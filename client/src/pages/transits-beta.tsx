import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Moon, ChevronLeft, ChevronRight } from "lucide-react";
import { useElementTheme } from "@/lib/element-theme";
import { isGoldenDawnActive } from "@/lib/golden-dawn-styles";
import { calculateMoonPhase } from "@/lib/astrology";
import { moonPhaseDescriptions } from "@shared/schema";
import type { MoonPhase } from "@shared/schema";
import { format, addDays, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from "date-fns";

const moonPhaseNames: Record<MoonPhase, string> = {
  new: "New Moon",
  waxing: "Waxing Moon",
  full: "Full Moon",
  waning: "Waning Moon",
};

const moonPhaseSymbols: Record<MoonPhase, string> = {
  new: "🌑",
  waxing: "🌓",
  full: "🌕",
  waning: "🌗",
};

function getMoonPhaseEnergy(phase: MoonPhase): { type: 'positive' | 'neutral' | 'challenging'; summary: string } {
  switch (phase) {
    case "new":
      return { type: "neutral", summary: "Time for new beginnings and setting intentions" };
    case "waxing":
      return { type: "positive", summary: "Building energy for growth and manifestation" };
    case "full":
      return { type: "positive", summary: "Peak illumination for completion and celebration" };
    case "waning":
      return { type: "neutral", summary: "Release and reflection as energy recedes" };
  }
}

export default function TransitsBeta() {
  const [, setLocation] = useLocation();
  const { colors, element } = useElementTheme();
  const isGoldenDawn = isGoldenDawnActive(element);
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  // All features are now free and accessible - no beta check needed

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const startDayOfWeek = monthStart.getDay();
  const paddingDays = Array(startDayOfWeek).fill(null);

  const selectedMoonPhase = calculateMoonPhase(selectedDate);
  const moonEnergy = getMoonPhaseEnergy(selectedMoonPhase);

  const goToPreviousMonth = () => setCurrentMonth(prev => subDays(startOfMonth(prev), 1));
  const goToNextMonth = () => setCurrentMonth(prev => addDays(endOfMonth(prev), 1));

  const getTypeColor = (type: 'positive' | 'neutral' | 'challenging') => {
    switch (type) {
      case 'positive': return colors.isDark ? 'text-emerald-400' : 'text-emerald-600';
      case 'challenging': return colors.isDark ? 'text-amber-400' : 'text-amber-600';
      default: return colors.isDark ? 'text-blue-400' : 'text-blue-600';
    }
  };

  const getTypeBgColor = (type: 'positive' | 'neutral' | 'challenging') => {
    switch (type) {
      case 'positive': return colors.isDark ? 'bg-emerald-500/20' : 'bg-emerald-100';
      case 'challenging': return colors.isDark ? 'bg-amber-500/20' : 'bg-amber-100';
      default: return colors.isDark ? 'bg-blue-500/20' : 'bg-blue-100';
    }
  };

  return (
    <div 
      className="min-h-screen transition-colors duration-500"
      style={{ background: colors.gradientStyle }}
    >
      <div className={`${colors.overlay} min-h-screen-safe transition-colors duration-500`}>
        <div className="max-w-2xl mx-auto px-4 py-8 pb-safe-nav">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/")}
              className="mb-4"
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background: isGoldenDawn ? 'radial-gradient(circle, #F5C86A 0%, #E2755B 100%)' : 'radial-gradient(circle at 30% 20%, #818cf8 0%, #6366f1 60%, #4338ca 100%)'
                }}
              >
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 
                    className="font-serif text-2xl md:text-3xl font-light"
                    style={{ color: colors.textPrimary }}
                    data-testid="text-transits-title"
                  >
                    Transits Calendar
                  </h1>
                  <Badge variant="secondary" className="text-xs">Beta</Badge>
                </div>
                <p style={{ color: colors.textMuted }}>Track planetary movements</p>
              </div>
            </div>
          </motion.div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card 
                className={`p-6 md:p-8 ${colors.cardBorder}`}
                style={{
                  background: colors.isDark 
                    ? 'linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 27, 75, 0.9) 40%, rgba(49, 46, 129, 0.8) 100%)'
                    : 'linear-gradient(180deg, #f7fbff 0%, #fdf8ff 40%, #f8f5ff 100%)'
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={goToPreviousMonth}
                    data-testid="button-prev-month"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <h3 
                    className="font-sans font-semibold text-lg"
                    style={{ color: colors.textPrimary }}
                    data-testid="text-current-month"
                  >
                    {format(currentMonth, "MMMM yyyy")}
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={goToNextMonth}
                    data-testid="button-next-month"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                    <div 
                      key={day} 
                      className="text-center text-xs font-medium py-2"
                      style={{ color: colors.textMuted }}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {paddingDays.map((_, index) => (
                    <div key={`pad-${index}`} className="aspect-square" />
                  ))}
                  {daysInMonth.map(day => {
                    const isSelected = isSameDay(day, selectedDate);
                    const isTodayDate = isToday(day);
                    const noonOfDay = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 12, 0, 0);
                    const dayPhase = calculateMoonPhase(noonOfDay);
                    const isFullOrNew = dayPhase === "full" || dayPhase === "new";
                    
                    return (
                      <button
                        key={day.toISOString()}
                        onClick={() => setSelectedDate(day)}
                        className={`aspect-square rounded-md flex flex-col items-center justify-center text-sm transition-all ${
                          isSelected 
                            ? 'ring-2 ring-purple-500' 
                            : 'hover:bg-purple-500/10'
                        }`}
                        style={{
                          background: isSelected 
                            ? colors.isDark 
                              ? 'rgba(139, 92, 246, 0.3)' 
                              : 'rgba(139, 92, 246, 0.15)'
                            : isFullOrNew
                              ? colors.isDark
                                ? 'rgba(251, 191, 36, 0.15)'
                                : 'rgba(251, 191, 36, 0.1)'
                              : 'transparent',
                          color: isSelected 
                            ? colors.isDark ? '#c4b5fd' : '#7c3aed'
                            : colors.textSecondary
                        }}
                        data-testid={`button-day-${format(day, 'd')}`}
                      >
                        <span className={isTodayDate ? 'font-bold' : ''}>
                          {format(day, "d")}
                        </span>
                        {isFullOrNew && (
                          <span className="text-[10px] leading-none mt-0.5">
                            {dayPhase === "full" ? "🌕" : "🌑"}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card 
                className={`p-6 md:p-8 ${colors.cardBorder}`}
                style={{
                  background: colors.isDark 
                    ? 'linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 27, 75, 0.9) 40%, rgba(49, 46, 129, 0.8) 100%)'
                    : 'linear-gradient(180deg, #f7fbff 0%, #fdf8ff 40%, #f8f5ff 100%)'
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Moon className="w-5 h-5" style={{ color: colors.textSecondary }} />
                  <div>
                    <h3 className="font-sans font-semibold" style={{ color: colors.textPrimary }}>
                      Moon Energy for {format(selectedDate, "MMMM d, yyyy")}
                    </h3>
                    <p className="text-sm" style={{ color: colors.textMuted }}>
                      {isToday(selectedDate) ? "Today's lunar energy" : "Lunar energy for this day"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`p-4 rounded-lg ${getTypeBgColor(moonEnergy.type)}`}
                    data-testid="moon-phase-info"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{moonPhaseSymbols[selectedMoonPhase]}</span>
                      <div>
                        <span className={`font-medium text-lg ${getTypeColor(moonEnergy.type)}`}>
                          {moonPhaseNames[selectedMoonPhase]}
                        </span>
                        <p className="text-sm" style={{ color: colors.textMuted }}>
                          {moonEnergy.summary}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                      {moonPhaseDescriptions[selectedMoonPhase]}
                    </p>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
