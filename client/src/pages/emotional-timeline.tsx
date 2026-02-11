import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, Heart, Calendar, Clock } from "lucide-react";
import { getMoodEntries } from "@/lib/storage";
import { useElementTheme } from "@/lib/element-theme";
import { useDataSync } from "@/hooks/useDataSync";
import { useToast } from "@/hooks/use-toast";
import { isGoldenDawnActive, getGoldenDawnCardStyle, getGoldenDawnCardClasses, getGoldenDawnTextColors, getGoldenDawnBackgroundClasses } from "@/lib/golden-dawn-styles";
import { GoldenDawnTheme } from "@/lib/golden-dawn-theme";
import type { MoodOption, MoodEntry } from "@shared/schema";
import { format } from "date-fns";

const moodLabels: Record<MoodOption, { label: string; color: string; bgColor: string }> = {
  happy: { label: "Happy", color: "from-yellow-400 to-amber-500", bgColor: "#fbbf24" },
  calm: { label: "Calm", color: "from-teal-400 to-cyan-500", bgColor: "#2dd4bf" },
  anxious: { label: "Anxious", color: "from-orange-400 to-red-400", bgColor: "#fb923c" },
  tired: { label: "Tired", color: "from-slate-400 to-slate-500", bgColor: "#94a3b8" },
  overwhelmed: { label: "Overwhelmed", color: "from-purple-400 to-indigo-500", bgColor: "#a78bfa" },
  grateful: { label: "Grateful", color: "from-pink-400 to-rose-500", bgColor: "#f472b6" },
};

export default function EmotionalTimeline() {
  const [, setLocation] = useLocation();
  const { colors, element } = useElementTheme();
  const { deleteMoodEntry } = useDataSync();
  const { toast } = useToast();
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isGoldenDawn = isGoldenDawnActive(element);
  const cardClasses = getGoldenDawnCardClasses(element);
  const gdTextColors = getGoldenDawnTextColors(element);
  const bgClasses = getGoldenDawnBackgroundClasses(element);

  useEffect(() => {
    const loadEntries = () => {
      const moodEntries = getMoodEntries();
      setEntries(moodEntries);
    };
    loadEntries();
    
    const handleStorage = () => loadEntries();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteMoodEntry(id);
      setEntries(prev => prev.filter(e => e.id !== id));
      toast({
        title: "Entry deleted",
        description: "Your mood entry has been removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete entry.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const groupEntriesByDate = (entries: MoodEntry[]) => {
    const groups: Record<string, MoodEntry[]> = {};
    entries.forEach(entry => {
      const dateKey = format(new Date(entry.timestamp), 'yyyy-MM-dd');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(entry);
    });
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  };

  const groupedEntries = groupEntriesByDate(entries);

  return (
    <div 
      className="min-h-screen transition-colors duration-500"
      style={{ background: colors.gradientStyle }}
    >
      <div className={`${colors.overlay} min-h-screen-safe transition-colors duration-500`}>
        <div className="container mx-auto px-4 py-6 pb-safe-nav max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-6"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/")}
              className={isGoldenDawn ? "" : "text-white/80 hover:text-white hover:bg-white/10"}
              style={isGoldenDawn ? { color: gdTextColors?.primary } : undefined}
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: isGoldenDawn
                    ? `linear-gradient(135deg, ${GoldenDawnTheme.primary.gold}, ${GoldenDawnTheme.primary.deepOrange})`
                    : colors.isDark
                      ? 'radial-gradient(circle at 30% 20%, #f472b6 0%, #ec4899 60%, #831843 100%)'
                      : 'radial-gradient(circle at 30% 20%, #fda4af 0%, #f43f5e 60%, #881337 100%)'
                }}
              >
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 
                  className="font-serif text-2xl font-semibold"
                  style={{ color: gdTextColors?.primary || (colors.isDark ? '#fff' : colors.textPrimary) }}
                >
                  Emotional Timeline
                </h1>
                <p 
                  className="text-sm opacity-80"
                  style={{ color: gdTextColors?.secondary || (colors.isDark ? 'rgba(255,255,255,0.7)' : colors.textSecondary) }}
                >
                  Your emotional weather history
                </p>
              </div>
            </div>
          </motion.div>

          {entries.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card 
                className={`p-8 text-center ${isGoldenDawn ? "border border-[#FAD792]/35" : ""} ${cardClasses}`}
                style={getGoldenDawnCardStyle(colors, element)}
              >
                <div 
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{
                    background: isGoldenDawn
                      ? 'rgba(244, 201, 139, 0.3)'
                      : colors.isDark
                        ? 'rgba(255,255,255,0.1)'
                        : 'rgba(0,0,0,0.05)'
                  }}
                >
                  <Calendar className="w-8 h-8" style={{ color: gdTextColors?.secondary || (colors.isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)') }} />
                </div>
                <h3 
                  className="font-medium text-lg mb-2"
                  style={{ color: gdTextColors?.primary || (colors.isDark ? '#fff' : colors.textPrimary) }}
                >
                  No entries yet
                </h3>
                <p 
                  className="text-sm mb-4"
                  style={{ color: gdTextColors?.secondary || (colors.isDark ? 'rgba(255,255,255,0.6)' : colors.textSecondary) }}
                >
                  Start tracking your emotional weather to see your history here.
                </p>
                <Button
                  onClick={() => setLocation("/")}
                  style={isGoldenDawn
                    ? {
                        background: GoldenDawnTheme.buttons.primary.background,
                        color: GoldenDawnTheme.buttons.primary.textColor,
                      }
                    : {
                        background: colors.isDark 
                          ? 'linear-gradient(to right, #8b5cf6, #d946ef)'
                          : 'linear-gradient(to right, #f59e0b, #d97706)',
                        color: 'white'
                      }
                  }
                  data-testid="button-check-in"
                >
                  Check In Now
                </Button>
              </Card>
            </motion.div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence>
                {groupedEntries.map(([dateKey, dayEntries], groupIndex) => (
                  <motion.div
                    key={dateKey}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: groupIndex * 0.05 }}
                  >
                    <div 
                      className="text-sm font-medium mb-3 flex items-center gap-2"
                      style={{ color: gdTextColors?.secondary || (colors.isDark ? 'rgba(255,255,255,0.7)' : colors.textSecondary) }}
                    >
                      <Calendar className="w-4 h-4" />
                      {format(new Date(dateKey), 'EEEE, MMMM d, yyyy')}
                    </div>
                    
                    <div className="space-y-3">
                      {dayEntries.map((entry, entryIndex) => {
                        const moodInfo = moodLabels[entry.mood];
                        const isDeleting = deletingId === entry.id;
                        
                        return (
                          <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: isDeleting ? 0.5 : 1, x: 0 }}
                            exit={{ opacity: 0, x: -100, height: 0 }}
                            transition={{ delay: entryIndex * 0.03 }}
                          >
                            <Card 
                              className={`p-4 ${isGoldenDawn ? "border border-[#FAD792]/35" : ""} ${cardClasses}`}
                              style={getGoldenDawnCardStyle(colors, element)}
                            >
                              <div className="flex items-start gap-3">
                                <div 
                                  className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center"
                                  style={{ background: `linear-gradient(135deg, ${moodInfo.bgColor}, ${moodInfo.bgColor}dd)` }}
                                >
                                  <Heart className="w-5 h-5 text-white" />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2">
                                    <span 
                                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${moodInfo.color} text-white`}
                                    >
                                      {moodInfo.label}
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <span 
                                        className="text-xs flex items-center gap-1"
                                        style={{ color: gdTextColors?.muted || (colors.isDark ? 'rgba(255,255,255,0.5)' : colors.textSecondary) }}
                                      >
                                        <Clock className="w-3 h-3" />
                                        {format(new Date(entry.timestamp), 'h:mm a')}
                                      </span>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(entry.id)}
                                        disabled={isDeleting}
                                        className="h-8 w-8"
                                        style={{ color: isGoldenDawn ? '#8B4513' : (colors.isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)') }}
                                        data-testid={`button-delete-${entry.id}`}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  
                                  {entry.notes && (
                                    <p 
                                      className="mt-2 text-sm"
                                      style={{ color: gdTextColors?.secondary || (colors.isDark ? 'rgba(255,255,255,0.7)' : colors.textSecondary) }}
                                    >
                                      {entry.notes}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
