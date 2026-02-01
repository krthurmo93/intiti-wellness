import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Play, 
  Square,
  Circle,
  Settings2,
  Smartphone,
  Volume2,
  VolumeX,
  Vibrate,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useElementTheme } from "@/lib/element-theme";

type SessionState = "setup" | "active" | "complete";

type CueFrequency = "none" | "every5" | "every10" | "endOnly";

interface PresenceSettings {
  vibrationEnabled: boolean;
  soundEnabled: boolean;
  cueFrequency: CueFrequency;
}

const PRESENCE_JOURNAL_PROMPTS = [
  "What came up during the stillness?",
  "What do you notice in your body right now?",
  "What thoughts are lingering?",
  "What feels different now?",
  "What wants your attention?",
  "What are you releasing?",
  "What clarity emerged?",
  "What are you grateful for in this moment?",
];

interface PresenceJournalEntry {
  id: string;
  content: string;
  prompt: string;
  sessionDuration: number;
  timestamp: string;
  source: "presence";
}

const PRESENCE_JOURNAL_KEY = "presence_journal_entries";

interface SessionLog {
  id: string;
  duration: number;
  completedFully: boolean;
  timestamp: string;
  reflection?: string;
}

const PRESENCE_SESSIONS_KEY = "intiti_presence_sessions";
const PRESENCE_SETTINGS_KEY = "intiti_presence_settings";

const defaultSettings: PresenceSettings = {
  vibrationEnabled: true,
  soundEnabled: false,
  cueFrequency: "endOnly"
};

const presetDurations = [5, 10, 30];

export default function Presence() {
  const { colors } = useElementTheme();
  
  const [sessionState, setSessionState] = useState<SessionState>("setup");
  const [selectedDuration, setSelectedDuration] = useState(10);
  const [customDuration, setCustomDuration] = useState(15);
  const [isCustom, setIsCustom] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<PresenceSettings>(defaultSettings);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [reflection, setReflection] = useState("");
  const [sessionLogs, setSessionLogs] = useState<SessionLog[]>([]);
  const [actualDuration, setActualDuration] = useState(0);
  const [sessionLogged, setSessionLogged] = useState(false);
  const [showJournalPrompt, setShowJournalPrompt] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState("");
  
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastCueTimeRef = useRef<number>(0);

  useEffect(() => {
    const savedSettings = localStorage.getItem(PRESENCE_SETTINGS_KEY);
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    const savedLogs = localStorage.getItem(PRESENCE_SESSIONS_KEY);
    if (savedLogs) {
      setSessionLogs(JSON.parse(savedLogs));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(PRESENCE_SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const saveSessionLog = useCallback((completedFully: boolean, durationSeconds: number) => {
    if (sessionLogged) return null;
    const sessionId = Date.now().toString();
    const log: SessionLog = {
      id: sessionId,
      duration: durationSeconds,
      completedFully,
      timestamp: new Date().toISOString()
    };
    const savedLogs = JSON.parse(localStorage.getItem(PRESENCE_SESSIONS_KEY) || "[]") as SessionLog[];
    const updatedLogs = [log, ...savedLogs].slice(0, 50);
    setSessionLogs(updatedLogs);
    localStorage.setItem(PRESENCE_SESSIONS_KEY, JSON.stringify(updatedLogs));
    setSessionLogged(true);
    setCurrentSessionId(sessionId);
    return sessionId;
  }, [sessionLogged]);

  const playCue = useCallback(() => {
    if (settings.vibrationEnabled && "vibrate" in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
    if (settings.soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(() => {});
    }
  }, [settings]);

  const checkForCue = useCallback((remaining: number, total: number) => {
    const elapsed = total - remaining;
    const elapsedMinutes = Math.floor(elapsed / 60);
    
    if (settings.cueFrequency === "none") return;
    if (settings.cueFrequency === "endOnly") return;
    
    const interval = settings.cueFrequency === "every5" ? 5 : 10;
    
    if (elapsedMinutes > 0 && elapsedMinutes % interval === 0 && elapsedMinutes !== lastCueTimeRef.current) {
      lastCueTimeRef.current = elapsedMinutes;
      playCue();
    }
  }, [settings, playCue]);

  const startSession = useCallback(() => {
    const duration = isCustom ? customDuration : selectedDuration;
    const totalSeconds = duration * 60;
    setTimeRemaining(totalSeconds);
    setActualDuration(0);
    setSessionLogged(false);
    setShowJournalPrompt(false);
    setSessionState("active");
    startTimeRef.current = Date.now();
    lastCueTimeRef.current = 0;
    
    timerRef.current = window.setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1;
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setActualDuration(elapsed);
        
        if (newTime <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          playCue();
          const finalElapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
          const sessionId = Date.now().toString();
          const log: SessionLog = {
            id: sessionId,
            duration: finalElapsed,
            completedFully: true,
            timestamp: new Date().toISOString()
          };
          const savedLogs = JSON.parse(localStorage.getItem(PRESENCE_SESSIONS_KEY) || "[]");
          const updatedLogs = [log, ...savedLogs].slice(0, 50);
          localStorage.setItem(PRESENCE_SESSIONS_KEY, JSON.stringify(updatedLogs));
          setSessionLogs(updatedLogs);
          setSessionLogged(true);
          setCurrentSessionId(sessionId);
          setSessionState("complete");
          return 0;
        }
        
        checkForCue(newTime, totalSeconds);
        return newTime;
      });
    }, 1000);
  }, [isCustom, customDuration, selectedDuration, playCue, checkForCue]);

  const endSessionEarly = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
    saveSessionLog(false, elapsed);
    setSessionState("complete");
    setShowEndConfirm(false);
  }, [saveSessionLog]);

  const saveReflection = useCallback(() => {
    if (!reflection.trim()) {
      setReflection("");
      setShowJournalPrompt(false);
      setSessionState("setup");
      return;
    }
    
    const journalEntry: PresenceJournalEntry = {
      id: Date.now().toString(),
      content: reflection.trim(),
      prompt: currentPrompt,
      sessionDuration: actualDuration,
      timestamp: new Date().toISOString(),
      source: "presence"
    };
    const existingEntries = JSON.parse(localStorage.getItem(PRESENCE_JOURNAL_KEY) || "[]") as PresenceJournalEntry[];
    const updatedEntries = [journalEntry, ...existingEntries].slice(0, 100);
    localStorage.setItem(PRESENCE_JOURNAL_KEY, JSON.stringify(updatedEntries));
    
    if (currentSessionId) {
      const logs = JSON.parse(localStorage.getItem(PRESENCE_SESSIONS_KEY) || "[]") as SessionLog[];
      const logIndex = logs.findIndex(l => l.id === currentSessionId);
      if (logIndex !== -1) {
        logs[logIndex].reflection = reflection.trim();
        localStorage.setItem(PRESENCE_SESSIONS_KEY, JSON.stringify(logs));
        setSessionLogs(logs);
      }
    }
    
    setReflection("");
    setShowJournalPrompt(false);
    setSessionState("setup");
  }, [reflection, currentSessionId, currentPrompt, actualDuration]);

  const returnHome = useCallback(() => {
    setSessionState("setup");
    setReflection("");
    setShowJournalPrompt(false);
    setCurrentPrompt("");
  }, []);
  
  const openJournalPrompt = useCallback(() => {
    const randomPrompt = PRESENCE_JOURNAL_PROMPTS[Math.floor(Math.random() * PRESENCE_JOURNAL_PROMPTS.length)];
    setCurrentPrompt(randomPrompt);
    setShowJournalPrompt(true);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const totalMinutes = sessionLogs.reduce((sum, log) => sum + Math.floor(log.duration / 60), 0);

  if (sessionState === "active") {
    return (
      <div 
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: "#050508" }}
      >
        <audio ref={audioRef} preload="auto">
          <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleUs8LIDp8qVdPywsjc3XmlIlIH/R5p1oQCsmq9v/" type="audio/wav" />
        </audio>
        
        <div className="flex-1 flex flex-col justify-between p-6">
          <div className="text-right">
            <span 
              className="text-lg font-light opacity-60"
              style={{ color: "#EAEAF2" }}
            >
              {formatTime(timeRemaining)}
            </span>
          </div>
          
          <div className="flex-1" />
          
          <div className="text-center pb-12">
            <AnimatePresence>
              {showEndConfirm ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <p style={{ color: "#EAEAF2" }} className="text-sm opacity-70">
                    End session early?
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button
                      variant="ghost"
                      onClick={() => setShowEndConfirm(false)}
                      style={{ color: "#EAEAF2" }}
                      data-testid="button-cancel-end"
                    >
                      Continue
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={endSessionEarly}
                      className="text-red-400"
                      data-testid="button-confirm-end"
                    >
                      End Now
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowEndConfirm(true)}
                    className="w-14 h-14 rounded-full border opacity-40 hover:opacity-70"
                    style={{ borderColor: "#EAEAF2", color: "#EAEAF2" }}
                    data-testid="button-end-session"
                  >
                    <Square className="w-5 h-5" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  if (sessionState === "complete") {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center p-6"
        style={{ backgroundColor: "#050508" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm w-full"
        >
          <Circle className="w-16 h-16 mx-auto mb-6 opacity-40" style={{ color: "#EAEAF2" }} />
          <h2 
            className="text-2xl font-serif font-light mb-2"
            style={{ color: "#EAEAF2" }}
          >
            Session complete
          </h2>
          <p className="text-sm opacity-50 mb-8" style={{ color: "#EAEAF2" }}>
            {Math.floor(actualDuration / 60)} minutes of stillness
          </p>
          
          <AnimatePresence mode="wait">
            {showJournalPrompt ? (
              <motion.div
                key="journal"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6"
              >
                <p className="text-sm opacity-70 mb-4" style={{ color: "#EAEAF2" }}>
                  {currentPrompt}
                </p>
                <Textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="Write freely..."
                  className="bg-transparent border-opacity-30 text-sm resize-none mb-4"
                  style={{ 
                    borderColor: "#EAEAF2",
                    color: "#EAEAF2"
                  }}
                  rows={4}
                  autoFocus
                  data-testid="input-reflection"
                />
                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    className="flex-1"
                    onClick={() => setShowJournalPrompt(false)}
                    style={{ color: "#EAEAF2" }}
                    data-testid="button-cancel-journal"
                  >
                    Cancel
                  </Button>
                  <Link href="/">
                    <Button
                      className="flex-1"
                      onClick={saveReflection}
                      style={{ 
                        backgroundColor: "rgba(234, 234, 242, 0.15)",
                        color: "#EAEAF2"
                      }}
                      data-testid="button-save-reflection"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="buttons"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-3"
              >
                <Link href="/">
                  <Button
                    className="w-full"
                    onClick={returnHome}
                    style={{ 
                      backgroundColor: "rgba(234, 234, 242, 0.15)",
                      color: "#EAEAF2"
                    }}
                    data-testid="button-return-home"
                  >
                    Return Home
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={openJournalPrompt}
                  style={{ color: "#EAEAF2" }}
                  data-testid="button-journal"
                >
                  Journal (1–3 minutes)
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen transition-colors duration-500"
      style={{ background: colors.gradientStyle }}
    >
      <div className={`${colors.overlay} min-h-screen transition-colors duration-500`}>
        <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
          <div className="flex items-center justify-between mb-6">
            <Link href="/">
              <Button 
                variant="ghost" 
                size="icon"
                style={{ color: colors.textSecondary }}
                data-testid="button-back"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 
              className="font-serif text-2xl font-light"
              style={{ color: colors.textPrimary }}
            >
              Presence
            </h1>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
              style={{ color: colors.textSecondary }}
              data-testid="button-options"
            >
              <Settings2 className="w-5 h-5" />
            </Button>
          </div>

          <div className="text-center mb-8">
            <p 
              className="text-sm mb-1"
              style={{ color: colors.textSecondary }}
            >
              Dark-screen stillness for grounding and nervous system reset.
            </p>
            <p 
              className="text-xs"
              style={{ color: colors.textMuted }}
            >
              Optional cues can be turned on/off in settings.
            </p>
          </div>

          <Card 
            className="p-4 mb-4 flex items-start gap-3"
            style={{ 
              backgroundColor: colors.cardBg,
              borderColor: colors.cardBorder
            }}
          >
            <Smartphone className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: colors.accentPrimary }} />
            <div>
              <p 
                className="text-sm font-medium mb-1"
                style={{ color: colors.textPrimary }}
              >
                Focus Reminder
              </p>
              <p 
                className="text-xs"
                style={{ color: colors.textMuted }}
              >
                For best results, enable Do Not Disturb on your device before starting.
              </p>
            </div>
          </Card>

          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-4"
              >
                <Card 
                  className="p-4"
                  style={{ 
                    backgroundColor: colors.cardBg,
                    borderColor: colors.cardBorder
                  }}
                >
                  <h3 
                    className="text-sm font-medium mb-4"
                    style={{ color: colors.textPrimary }}
                  >
                    Session Options
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Vibrate className="w-4 h-4" style={{ color: colors.textSecondary }} />
                        <span className="text-sm" style={{ color: colors.textSecondary }}>
                          Vibration cue
                        </span>
                      </div>
                      <Switch
                        checked={settings.vibrationEnabled}
                        onCheckedChange={(checked) => setSettings(s => ({ ...s, vibrationEnabled: checked }))}
                        data-testid="switch-vibration"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {settings.soundEnabled ? (
                          <Volume2 className="w-4 h-4" style={{ color: colors.textSecondary }} />
                        ) : (
                          <VolumeX className="w-4 h-4" style={{ color: colors.textSecondary }} />
                        )}
                        <span className="text-sm" style={{ color: colors.textSecondary }}>
                          Sound cue
                        </span>
                      </div>
                      <Switch
                        checked={settings.soundEnabled}
                        onCheckedChange={(checked) => setSettings(s => ({ ...s, soundEnabled: checked }))}
                        data-testid="switch-sound"
                      />
                    </div>
                    
                    <div>
                      <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>
                        Cue frequency
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { value: "none", label: "None" },
                          { value: "every5", label: "Every 5 min" },
                          { value: "every10", label: "Every 10 min" },
                          { value: "endOnly", label: "End only" }
                        ].map((option) => (
                          <Button
                            key={option.value}
                            variant={settings.cueFrequency === option.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSettings(s => ({ ...s, cueFrequency: option.value as CueFrequency }))}
                            className="text-xs"
                            data-testid={`button-cue-${option.value}`}
                          >
                            {option.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <Card 
            className="p-6 mb-6"
            style={{ 
              backgroundColor: colors.cardBg,
              borderColor: colors.cardBorder
            }}
          >
            <h3 
              className="text-sm font-medium mb-4 text-center"
              style={{ color: colors.textSecondary }}
            >
              Session Length
            </h3>
            
            <div className="grid grid-cols-3 gap-3 mb-4">
              {presetDurations.map((duration) => (
                <motion.button
                  key={duration}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedDuration(duration);
                    setIsCustom(false);
                  }}
                  className={`p-4 rounded-xl text-center transition-all`}
                  style={{ 
                    backgroundColor: !isCustom && selectedDuration === duration 
                      ? colors.accentPrimary + "30" 
                      : colors.cardBg,
                    boxShadow: !isCustom && selectedDuration === duration 
                      ? `0 0 0 2px ${colors.accentPrimary}` 
                      : "none"
                  }}
                  data-testid={`button-duration-${duration}`}
                >
                  <span 
                    className="text-2xl font-light block"
                    style={{ color: colors.textPrimary }}
                  >
                    {duration}
                  </span>
                  <span 
                    className="text-xs"
                    style={{ color: colors.textMuted }}
                  >
                    minutes
                  </span>
                </motion.button>
              ))}
            </div>
            
            <div className="border-t pt-4" style={{ borderColor: colors.cardBorder }}>
              <Button
                variant={isCustom ? "default" : "outline"}
                size="sm"
                className="w-full mb-3"
                onClick={() => setIsCustom(true)}
                data-testid="button-custom-duration"
              >
                Custom: {customDuration} minutes
              </Button>
              
              {isCustom && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                >
                  <Slider
                    value={[customDuration]}
                    onValueChange={([v]) => setCustomDuration(v)}
                    min={1}
                    max={60}
                    step={1}
                    className="w-full"
                    data-testid="slider-custom-duration"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs" style={{ color: colors.textMuted }}>1 min</span>
                    <span className="text-xs" style={{ color: colors.textMuted }}>60 min</span>
                  </div>
                </motion.div>
              )}
            </div>
          </Card>

          <Button
            className="w-full h-14 text-lg font-medium"
            onClick={startSession}
            style={{
              background: `linear-gradient(135deg, ${colors.accentPrimary}, ${colors.accentSecondary || colors.accentPrimary})`,
              color: "white"
            }}
            data-testid="button-start-session"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Session
          </Button>

          {sessionLogs.length > 0 && (
            <Card 
              className="p-4 mt-6"
              style={{ 
                backgroundColor: colors.cardBg,
                borderColor: colors.cardBorder
              }}
            >
              <h3 
                className="text-sm font-medium mb-2"
                style={{ color: colors.textSecondary }}
              >
                Your Practice
              </h3>
              <div className="flex gap-6">
                <div>
                  <span 
                    className="text-2xl font-light"
                    style={{ color: colors.textPrimary }}
                  >
                    {sessionLogs.length}
                  </span>
                  <p className="text-xs" style={{ color: colors.textMuted }}>sessions</p>
                </div>
                <div>
                  <span 
                    className="text-2xl font-light"
                    style={{ color: colors.textPrimary }}
                  >
                    {totalMinutes}
                  </span>
                  <p className="text-xs" style={{ color: colors.textMuted }}>total minutes</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
