import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Check } from "lucide-react";
import { getMoodEntries, incrementJournalUsage } from "@/lib/storage";
import { useElementTheme } from "@/lib/element-theme";
import { useToast } from "@/hooks/use-toast";
import { useDataSync } from "@/hooks/useDataSync";
import { isGoldenDawnActive, getGoldenDawnCardStyle, getGoldenDawnCardClasses, getGoldenDawnTextColors } from "@/lib/golden-dawn-styles";
import { GoldenDawnTheme } from "@/lib/golden-dawn-theme";
import type { MoodOption, MoodEntry } from "@shared/schema";
import { moodOptions } from "@shared/schema";

const moodLabels: Record<MoodOption, { label: string; color: string }> = {
  happy: { label: "Happy", color: "from-yellow-400 to-amber-500" },
  calm: { label: "Calm", color: "from-teal-400 to-cyan-500" },
  anxious: { label: "Anxious", color: "from-orange-400 to-red-400" },
  tired: { label: "Tired", color: "from-slate-400 to-slate-500" },
  overwhelmed: { label: "Overwhelmed", color: "from-purple-400 to-indigo-500" },
  grateful: { label: "Grateful", color: "from-pink-400 to-rose-500" },
};

export function MoodCheckIn() {
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);
  const { element, colors } = useElementTheme();
  const { toast } = useToast();
  const { saveMoodEntry } = useDataSync();

  const todayEntries = getMoodEntries().filter(
    (e) => new Date(e.timestamp).toDateString() === new Date().toDateString()
  );

  const handleSave = async () => {
    if (!selectedMood) return;

    incrementJournalUsage();

    const entry: MoodEntry = {
      id: crypto.randomUUID(),
      mood: selectedMood,
      notes: notes.trim() || undefined,
      timestamp: new Date().toISOString(),
      element: element || undefined,
    };

    await saveMoodEntry(entry);
    setSaved(true);
    
    toast({
      title: "Mood logged",
      description: "Your check-in has been saved.",
    });

    setTimeout(() => {
      setSelectedMood(null);
      setNotes("");
      setSaved(false);
    }, 2000);
  };

  const isGoldenDawn = isGoldenDawnActive(element);
  const cardClasses = getGoldenDawnCardClasses(element);
  const gdTextColors = getGoldenDawnTextColors(element);

  return (
    <Card 
      className={`p-6 md:p-8 border ${isGoldenDawn ? "border-[#FAD792]/35" : ""} ${cardClasses}`}
      style={getGoldenDawnCardStyle(colors, element)}
    >
      <div className="flex items-center gap-3 mb-4">
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
          <h3 
            className="font-sans font-semibold text-lg" 
            style={{ color: gdTextColors?.primary || colors.textPrimary }}
          >
            Emotional Weather
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
            {moodOptions.map((mood) => {
              const { label, color } = moodLabels[mood];
              const isSelected = selectedMood === mood;
              
              return (
                <Button
                  key={mood}
                  variant="outline"
                  onClick={() => setSelectedMood(mood)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    isSelected
                      ? `bg-gradient-to-r ${color} text-white border-transparent shadow-md`
                      : isGoldenDawn
                        ? ""
                        : colors.isDark 
                          ? "border-violet-400/50 bg-violet-500/10 text-violet-100" 
                          : "border-stone-300 bg-stone-50 text-stone-700"
                  }`}
                  style={!isSelected ? (isGoldenDawn ? {
                    background: GoldenDawnTheme.buttons.secondary.background,
                    borderColor: GoldenDawnTheme.borders.gold,
                    color: GoldenDawnTheme.buttons.secondary.textColor,
                  } : {
                    boxShadow: colors.isDark 
                      ? 'inset 0 1px 0 0 rgba(167, 139, 250, 0.1)' 
                      : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.5)'
                  }) : undefined}
                  data-testid={`button-mood-${mood}`}
                >
                  {label}
                </Button>
              );
            })}
          </div>

          <motion.div
            initial={false}
            animate={{ height: selectedMood ? "auto" : 0, opacity: selectedMood ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <Textarea
              placeholder="Any notes about how you're feeling? (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`mb-4 resize-none ${isGoldenDawn ? 'gd-input' : colors.isDark ? 'border-white/20 bg-white/5 text-white placeholder:text-violet-300/50' : 'border-stone-200 bg-white/50'} focus:border-amber-400`}
              style={isGoldenDawn ? {
                background: GoldenDawnTheme.inputs.backgroundSolid,
                borderColor: GoldenDawnTheme.inputs.border,
                color: GoldenDawnTheme.inputs.text,
              } : undefined}
              rows={3}
              data-testid="input-mood-notes"
            />

            <Button
              onClick={handleSave}
              disabled={!selectedMood || saved}
              className="w-full rounded-full"
              style={saved 
                ? { background: '#22c55e', color: 'white' }
                : isGoldenDawn
                  ? {
                      background: GoldenDawnTheme.buttons.primary.background,
                      color: GoldenDawnTheme.buttons.primary.textColor,
                      boxShadow: GoldenDawnTheme.buttons.primary.shadow,
                    }
                  : {
                      background: colors.isDark 
                        ? 'linear-gradient(to right, #8b5cf6, #d946ef)'
                        : 'linear-gradient(to right, #f59e0b, #d97706)',
                      color: 'white'
                    }
              }
              data-testid="button-save-mood"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Saved
                </>
              ) : (
                "Log Mood"
              )}
            </Button>
          </motion.div>
    </Card>
  );
}
