import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Target, Check, Pencil } from "lucide-react";
import { getTodayIntention } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { useElementTheme } from "@/lib/element-theme";
import { useDataSync } from "@/hooks/useDataSync";
import { 
  isGoldenDawnActive, 
  getGoldenDawnCardStyle, 
  getGoldenDawnCardClasses,
  getGoldenDawnInputStyle,
  getGoldenDawnTextColors,
  getGoldenDawnButtonStyle as getGDButtonStyle,
  getGoldenDawnIconColor
} from "@/lib/golden-dawn-styles";
import { GoldenDawnTheme } from "@/lib/golden-dawn-theme";
import { TextToSpeechButton } from "@/components/speech-buttons";
import type { Intention } from "@shared/schema";

export function IntentionSetter() {
  const [intention, setIntention] = useState("");
  const [todayIntention, setTodayIntention] = useState<Intention | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();
  const { element, colors } = useElementTheme();
  const { saveIntention } = useDataSync();
  const isGoldenDawn = isGoldenDawnActive(element);
  const cardClasses = getGoldenDawnCardClasses(element);
  const gdTextColors = getGoldenDawnTextColors(element);
  const gdIconColor = getGoldenDawnIconColor(element);

  useEffect(() => {
    const existing = getTodayIntention();
    if (existing) {
      setTodayIntention(existing);
      setIntention(existing.text);
    }
  }, []);

  const handleSave = async () => {
    if (!intention.trim()) return;

    const newIntention: Intention = {
      id: crypto.randomUUID(),
      text: intention.trim(),
      timestamp: new Date().toISOString(),
      completed: false,
    };

    await saveIntention(newIntention);
    setTodayIntention(newIntention);
    setSaved(true);
    setIsEditing(false);

    toast({
      title: "Intention set",
      description: "Your intention for today has been saved.",
    });

    setTimeout(() => setSaved(false), 2000);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const showInput = !todayIntention || isEditing;

  return (
    <Card 
      className={`p-6 md:p-8 border ${isGoldenDawn ? "border-[#FAD792]/35" : ""} ${cardClasses}`}
      style={getGoldenDawnCardStyle(colors, element)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: isGoldenDawn
                ? `linear-gradient(135deg, ${GoldenDawnTheme.primary.gold}, ${GoldenDawnTheme.primary.deepOrange})`
                : colors.isDark
                  ? 'radial-gradient(circle at 30% 20%, #a78bfa 0%, #8b5cf6 60%, #4c1d95 100%)'
                  : 'radial-gradient(circle at 30% 20%, #76e4ff 0%, #3b82f6 60%, #1d1b4f 100%)'
            }}
          >
            <Target className="w-5 h-5 text-white" />
          </div>
          <h3 
            className="font-sans font-semibold text-lg" 
            style={{ color: gdTextColors?.primary || colors.textPrimary }}
          >
            Intention for Today
          </h3>
        </div>
        {todayIntention && !isEditing && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleEdit}
            style={{ color: gdIconColor || colors.textMuted }}
            data-testid="button-edit-intention"
            aria-label="Edit intention"
          >
            <Pencil className="w-4 h-4" />
          </Button>
        )}
      </div>

      {showInput ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Textarea
            placeholder="What is your intention for today? What would you like to focus on or manifest?"
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            className={`resize-none min-h-[120px] mb-4 ${isGoldenDawn ? 'gd-input' : ''}`}
            style={isGoldenDawn ? {
              background: GoldenDawnTheme.inputs.backgroundSolid,
              border: `1px solid ${GoldenDawnTheme.inputs.border}`,
              color: GoldenDawnTheme.inputs.text,
            } : {
              background: colors.isDark 
                ? 'radial-gradient(circle at top left, rgba(139, 92, 246, 0.15) 0%, rgba(168, 85, 247, 0.1) 45%, rgba(30, 27, 75, 0.8) 100%)'
                : 'radial-gradient(circle at top left, #e6f7ff 0%, #f5ecff 45%, #fdf8ff 100%)',
              border: colors.isDark ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(59, 130, 246, 0.2)',
              color: colors.textPrimary,
            }}
            data-testid="input-intention"
          />

          <Button
            onClick={handleSave}
            disabled={!intention.trim() || saved}
            className="w-full rounded-full"
            style={saved
              ? { background: '#22c55e', color: 'white', boxShadow: '0 8px 20px rgba(34, 197, 94, 0.35)' }
              : isGoldenDawn
                ? {
                    background: GoldenDawnTheme.buttons.primary.background,
                    color: GoldenDawnTheme.buttons.primary.textColor,
                    boxShadow: GoldenDawnTheme.buttons.primary.shadow,
                  }
                : {
                    background: colors.isDark
                      ? 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #c084fc 100%)'
                      : 'linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)',
                    color: 'white',
                    boxShadow: colors.isDark
                      ? '0 8px 20px rgba(139, 92, 246, 0.45)'
                      : '0 8px 20px rgba(99, 102, 241, 0.35)'
                  }
            }
            data-testid="button-save-intention"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Saved
              </>
            ) : (
              "Save Intention"
            )}
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="py-2"
        >
          <div className="flex items-start justify-center gap-2">
            <p 
              className="font-serif text-lg italic text-center leading-relaxed" 
              style={{ color: gdTextColors?.secondary || colors.textSecondary }} 
              data-testid="text-today-intention"
            >
              &ldquo;{todayIntention.text}&rdquo;
            </p>
            <TextToSpeechButton
              text={todayIntention.text}
              element={element}
              testId="button-tts-intention"
            />
          </div>
          <p 
            className="text-xs text-center mt-2" 
            style={{ color: gdTextColors?.muted || colors.textMuted }}
          >
            Set at {new Date(todayIntention.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </motion.div>
      )}
    </Card>
  );
}
