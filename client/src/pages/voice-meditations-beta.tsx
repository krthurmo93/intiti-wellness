import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Mic, 
  Play, 
  Pause, 
  Square, 
  Sparkles, 
  Flame, 
  Droplets, 
  Wind, 
  Mountain, 
  Star,
  Moon,
  Sun,
  Heart,
  Battery,
  Leaf,
  Loader2,
  Volume2
} from "lucide-react";
import { useElementTheme } from "@/lib/element-theme";
import { getBetaFeaturesEnabled, getCurrentElement } from "@/lib/storage";
import { isGoldenDawnActive } from "@/lib/golden-dawn-styles";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Voice descriptions for user info
const voiceDescriptions: Record<string, string> = {
  calm: "Fable - Soft & gentle",
  focus: "Onyx - Clear & grounded",
  sleep: "Echo - Slow & soothing",
  gratitude: "Shimmer - Warm & bright",
  energy: "Nova - Lively & upbeat",
  healing: "Fable - Nurturing & safe",
};

const meditationThemes = [
  { value: "calm", label: "Calm", icon: Moon, description: "Find inner peace" },
  { value: "focus", label: "Focus", icon: Sun, description: "Sharpen your mind" },
  { value: "sleep", label: "Sleep", icon: Star, description: "Drift into rest" },
  { value: "gratitude", label: "Gratitude", icon: Heart, description: "Cultivate thankfulness" },
  { value: "energy", label: "Energy", icon: Battery, description: "Awaken vitality" },
  { value: "healing", label: "Healing", icon: Leaf, description: "Restore balance" },
] as const;

const durations = [
  { value: "short", label: "5 min", description: "Quick reset" },
  { value: "medium", label: "7 min", description: "Standard practice" },
  { value: "long", label: "10 min", description: "Deep session" },
] as const;

const elements = [
  { value: "fire", label: "Fire", icon: Flame, color: "from-orange-400 to-red-500" },
  { value: "water", label: "Water", icon: Droplets, color: "from-cyan-400 to-blue-500" },
  { value: "air", label: "Air", icon: Wind, color: "from-indigo-400 to-purple-500" },
  { value: "earth", label: "Earth", icon: Mountain, color: "from-amber-500 to-green-600" },
  { value: "cosmic", label: "Cosmic", icon: Star, color: "from-violet-500 to-purple-700" },
] as const;

export default function VoiceMeditationsBeta() {
  const [, setLocation] = useLocation();
  const { colors, element } = useElementTheme();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string>("calm");
  const [selectedDuration, setSelectedDuration] = useState<string>("medium");
  const [selectedElement, setSelectedElement] = useState<string | undefined>(undefined);
  const [script, setScript] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [currentVoice, setCurrentVoice] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [usingOpenAIAudio, setUsingOpenAIAudio] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const betaEnabled = getBetaFeaturesEnabled();
    if (!betaEnabled) {
      setLocation("/");
    } else {
      setIsAuthorized(true);
      const currentElement = getCurrentElement();
      if (currentElement && currentElement !== "cosmic") {
        setSelectedElement(currentElement);
      }
    }
  }, [setLocation]);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  const generateMutation = useMutation({
    mutationFn: async (data: { theme: string; duration: string; element?: string }) => {
      const res = await apiRequest('POST', '/api/auth/meditation/generate', data);
      return res.json();
    },
    onSuccess: (data: { script: string; audioBase64?: string; voice?: string }) => {
      setScript(data.script);
      setAudioBase64(data.audioBase64 || null);
      setCurrentVoice(data.voice || null);
      setUsingOpenAIAudio(!!data.audioBase64);
      
      // Reset playback state
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
      setIsPlaying(false);
      setIsPaused(false);
      
      toast({ 
        title: "Meditation generated", 
        description: data.audioBase64 
          ? `Using ${voiceDescriptions[selectedTheme] || 'AI'} voice` 
          : "Your personalized meditation is ready"
      });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to generate meditation", variant: "destructive" });
    },
  });

  const handleGenerate = () => {
    generateMutation.mutate({
      theme: selectedTheme,
      duration: selectedDuration,
      element: selectedElement,
    });
  };

  const handlePlay = () => {
    if (!script) return;

    // If OpenAI audio is available, use HTML5 audio playback
    if (audioBase64) {
      // Resume if paused
      if (isPaused && audioRef.current) {
        audioRef.current.play();
        setIsPaused(false);
        setIsPlaying(true);
        return;
      }
      
      // Create new audio element
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`);
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };
      
      audio.onerror = () => {
        setIsPlaying(false);
        setIsPaused(false);
        toast({ title: "Playback error", description: "Unable to play audio", variant: "destructive" });
      };
      
      audio.play();
      setIsPlaying(true);
      setIsPaused(false);
      setUsingOpenAIAudio(true);
      return;
    }

    // Fall back to browser TTS
    if (isPaused && speechRef.current) {
      speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    speechSynthesis.cancel();

    // Clean the script for browser TTS (remove [pause] markers)
    const cleanScript = script.replace(/\[pause\]/g, '...');
    const utterance = new SpeechSynthesisUtterance(cleanScript);
    utterance.rate = 0.5;
    utterance.pitch = 0.9;
    utterance.volume = 1;

    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.name.includes('Samantha') || 
      v.name.includes('Karen') || 
      v.name.includes('Google UK English Female') ||
      v.name.includes('Microsoft Zira') ||
      (v.lang.startsWith('en') && v.name.toLowerCase().includes('female'))
    ) || voices.find(v => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      toast({ title: "Playback error", description: "Unable to play audio", variant: "destructive" });
    };

    speechRef.current = utterance;
    speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
    setUsingOpenAIAudio(false);
  };

  const handlePause = () => {
    if (audioRef.current && usingOpenAIAudio) {
      audioRef.current.pause();
      setIsPaused(true);
      setIsPlaying(false);
    } else if (speechSynthesis.speaking) {
      speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  if (!isAuthorized || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  const isGoldenDawn = isGoldenDawnActive(element);

  if (!isAuthenticated) {
    return (
      <div 
        className={`min-h-screen bg-gradient-to-b ${colors.gradient} transition-colors duration-500`}
        style={isGoldenDawn ? { background: "linear-gradient(180deg, #FFE7B3 0%, #EFA045 40%, #E2755B 100%)" } : {}}
      >
        <div className={`${colors.overlay} min-h-screen transition-colors duration-500`}>
          <div className="max-w-2xl mx-auto px-4 py-8">
            <Card className={`p-8 ${colors.cardBorder} text-center`}>
              <Mic className="w-12 h-12 mx-auto mb-4 text-orange-500" />
              <h2 className="font-serif text-2xl mb-4" style={{ color: colors.textPrimary }}>
                Sign In Required
              </h2>
              <p className="mb-6" style={{ color: colors.textSecondary }}>
                AI Voice Meditations requires an account to access personalized content.
              </p>
              <Button onClick={() => setLocation("/settings")} data-testid="button-signin-prompt">
                Go to Settings to Sign In
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen bg-gradient-to-b ${colors.gradient} transition-colors duration-500`}
      style={isGoldenDawn ? { background: "linear-gradient(180deg, #FFE7B3 0%, #EFA045 40%, #E2755B 100%)" } : {}}
    >
      <div className={`${colors.overlay} min-h-screen transition-colors duration-500`}>
        <div className="max-w-2xl mx-auto px-4 py-8">
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
                  background: isGoldenDawn ? 'radial-gradient(circle, #F5C86A 0%, #E2755B 100%)' : 'radial-gradient(circle at 30% 20%, #fbbf24 0%, #f59e0b 60%, #d97706 100%)'
                }}
              >
                <Mic className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 
                    className="font-serif text-2xl md:text-3xl font-light"
                    style={{ color: colors.textPrimary }}
                    data-testid="text-meditation-title"
                  >
                    AI Voice Meditations
                  </h1>
                  <Badge variant="secondary" className="text-xs">Beta</Badge>
                </div>
                <p style={{ color: colors.textMuted }}>Personalized guided sessions</p>
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
                <h3 className="font-sans font-semibold mb-4" style={{ color: colors.textPrimary }}>
                  Choose Your Focus
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {meditationThemes.map((theme) => {
                    const Icon = theme.icon;
                    const isSelected = selectedTheme === theme.value;
                    return (
                      <button
                        key={theme.value}
                        type="button"
                        onClick={() => setSelectedTheme(theme.value)}
                        className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                          isSelected ? 'ring-2 ring-offset-2 ring-purple-500' : ''
                        }`}
                        style={{
                          background: isSelected 
                            ? colors.isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.15)'
                            : colors.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                        }}
                        data-testid={`button-theme-${theme.value}`}
                      >
                        <Icon 
                          className="w-6 h-6"
                          style={{ color: isSelected ? '#a78bfa' : colors.textSecondary }}
                        />
                        <span 
                          className="font-medium text-sm"
                          style={{ color: isSelected ? colors.textPrimary : colors.textSecondary }}
                        >
                          {theme.label}
                        </span>
                        <span 
                          className="text-xs"
                          style={{ color: colors.textMuted }}
                        >
                          {theme.description}
                        </span>
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
                <h3 className="font-sans font-semibold mb-4" style={{ color: colors.textPrimary }}>
                  Duration
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {durations.map((dur) => {
                    const isSelected = selectedDuration === dur.value;
                    return (
                      <button
                        key={dur.value}
                        type="button"
                        onClick={() => setSelectedDuration(dur.value)}
                        className={`p-4 rounded-xl flex flex-col items-center gap-1 transition-all ${
                          isSelected ? 'ring-2 ring-offset-2 ring-purple-500' : ''
                        }`}
                        style={{
                          background: isSelected 
                            ? colors.isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.15)'
                            : colors.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                        }}
                        data-testid={`button-duration-${dur.value}`}
                      >
                        <span 
                          className="font-semibold"
                          style={{ color: isSelected ? colors.textPrimary : colors.textSecondary }}
                        >
                          {dur.label}
                        </span>
                        <span 
                          className="text-xs"
                          style={{ color: colors.textMuted }}
                        >
                          {dur.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
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
                  <h3 className="font-sans font-semibold" style={{ color: colors.textPrimary }}>
                    Element Infusion (Optional)
                  </h3>
                  {selectedElement && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedElement(undefined)}
                      data-testid="button-clear-element"
                    >
                      Clear
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {elements.map((elem) => {
                    const Icon = elem.icon;
                    const isSelected = selectedElement === elem.value;
                    return (
                      <button
                        key={elem.value}
                        type="button"
                        onClick={() => setSelectedElement(isSelected ? undefined : elem.value)}
                        className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                          isSelected ? 'ring-2 ring-offset-2' : ''
                        }`}
                        style={{
                          background: isSelected 
                            ? `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))`
                            : colors.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                        }}
                        data-testid={`button-element-${elem.value}`}
                      >
                        <div 
                          className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br ${elem.color}`}
                        >
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span 
                          className="text-xs"
                          style={{ color: isSelected ? colors.textPrimary : colors.textMuted }}
                        >
                          {elem.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button
                className="w-full"
                size="lg"
                onClick={handleGenerate}
                disabled={generateMutation.isPending}
                data-testid="button-generate-meditation"
              >
                {generateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Meditation...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Meditation
                  </>
                )}
              </Button>
            </motion.div>

            {script && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card 
                  className={`p-6 md:p-8 ${colors.cardBorder}`}
                  style={{
                    background: colors.isDark 
                      ? 'linear-gradient(180deg, rgba(30, 27, 75, 0.9) 0%, rgba(49, 46, 129, 0.9) 50%, rgba(88, 28, 135, 0.8) 100%)'
                      : 'linear-gradient(180deg, #fdf4ff 0%, #fae8ff 50%, #f5d0fe 100%)'
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Volume2 className="w-5 h-5 text-purple-400" />
                      <h3 className="font-sans font-semibold" style={{ color: colors.textPrimary }}>
                        Your Meditation
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {isPlaying ? (
                        <>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={handlePause}
                            data-testid="button-pause"
                          >
                            <Pause className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={handleStop}
                            data-testid="button-stop"
                          >
                            <Square className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={handlePlay}
                          data-testid="button-play"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          {isPaused ? 'Resume' : 'Play'}
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div 
                    className="max-h-[300px] overflow-y-auto p-4 rounded-xl"
                    style={{
                      background: colors.isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)'
                    }}
                  >
                    <p 
                      className="font-serif text-base leading-relaxed whitespace-pre-line"
                      style={{ color: colors.textSecondary }}
                      data-testid="text-meditation-script"
                    >
                      {script}
                    </p>
                  </div>
                  
                  <p className="text-xs mt-4 text-center" style={{ color: colors.textMuted }}>
                    {audioBase64 ? (
                      <>Voice: {voiceDescriptions[selectedTheme] || 'AI Voice'}</>
                    ) : (
                      <>Uses browser text-to-speech for audio playback</>
                    )}
                  </p>
                </Card>
              </motion.div>
            )}
          </div>

          <div className="h-32" />
        </div>
      </div>
    </div>
  );
}
