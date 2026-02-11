import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useLocation, Link } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Square, 
  Sparkles, 
  Heart,
  Shield,
  DollarSign,
  Brain,
  Moon,
  Eye,
  Star,
  Waves,
  Cloud,
  Volume2,
  Loader2,
  History,
  HelpCircle,
  Bookmark,
  MoreVertical,
  Pencil,
  Trash2,
  BookmarkPlus
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useElementTheme } from "@/lib/element-theme";
import { getGoldenDawnCardStyle, isGoldenDawnActive, getGoldenDawnButtonClasses, getGoldenDawnBackgroundClasses, getGoldenDawnCardClasses, getGoldenDawnTextColors, getGoldenDawnInputStyle } from "@/lib/golden-dawn-styles";
import { 
  getSavedSubliminals,
  saveSubliminal,
  updateSubliminalTitle,
  deleteSavedSubliminal,
  type SavedSubliminal 
} from "@/lib/storage";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  subliminalCategories,
  subliminalCategoryLabels,
  subliminalBackgrounds,
  subliminalBackgroundLabels,
  subliminalDurations,
  subliminalStyles,
  subliminalStyleLabels,
  type SubliminalCategory,
  type SubliminalBackground,
  type SubliminalDuration,
  type SubliminalStyle,
  type SelectSubliminal,
} from "@shared/schema";
import { TextToSpeechButton } from "@/components/speech-buttons";

const categoryIcons: Record<SubliminalCategory, typeof Heart> = {
  love_relationships: Heart,
  self_worth_confidence: Star,
  money_overflow: DollarSign,
  healing_nervous_system: Brain,
  protection_boundaries: Shield,
  shadow_integration: Eye,
  spiritual_alignment: Moon
};

// MVP: Only Ocean Calm background shown in UI
const backgroundIcons: Record<SubliminalBackground, typeof Waves> = {
  delta_waves: Moon,
  theta_waves: Brain,
  celestial_echo: Star,
  ocean_calm: Waves,
  pure_silence: Cloud
};

// ============================================
// MVP AUDIO SYSTEM - Ocean Calm Only
// ============================================
// Background: 85% volume | Voice: 1% volume (HARD CAP 2%)
// No oscillators - HTML5 Audio only

const OCEAN_CALM_URL = "/ocean-calm.mp3";
const BACKGROUND_VOLUME = 0.85;
const VOICE_VOLUME = 0.01;      // 1% - extremely faint whisper
const VOICE_MAX_CAP = 0.02;     // Hard cap - voice can NEVER exceed 2%

let backgroundAudio: HTMLAudioElement | null = null;

// Clamp voice volume - ensures it can NEVER exceed VOICE_MAX_CAP
function clampVoiceVolume(vol: number): number {
  return Math.min(vol, VOICE_MAX_CAP);
}

function startBackground(): void {
  if (backgroundAudio) {
    backgroundAudio.pause();
    backgroundAudio.currentTime = 0;
  }
  
  backgroundAudio = new Audio(OCEAN_CALM_URL);
  backgroundAudio.loop = true;
  backgroundAudio.volume = BACKGROUND_VOLUME;
  const actualVoiceLevel = clampVoiceVolume(VOICE_VOLUME);
  backgroundAudio.play().then(() => {
    console.log("[AUDIO] Ocean Calm background=0.85, voice=", actualVoiceLevel);
  }).catch(err => {
    console.error("[AUDIO] Failed to play:", err);
  });
}

function pauseBackground(): void {
  if (backgroundAudio) {
    backgroundAudio.pause();
  }
}

function resumeBackground(): void {
  if (backgroundAudio) {
    backgroundAudio.play();
  }
}

function stopBackground(): void {
  if (backgroundAudio) {
    backgroundAudio.pause();
    backgroundAudio.currentTime = 0;
  }
}

export default function Subliminals() {
  const [, setLocation] = useLocation();
  const { colors, element } = useElementTheme();
  const isGoldenDawn = isGoldenDawnActive(element);
  const cardClasses = getGoldenDawnCardClasses(element);
  const gdTextColors = getGoldenDawnTextColors(element);
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  // All features are now free and accessible - no beta check needed
  const [selectedCategory, setSelectedCategory] = useState<SubliminalCategory>("self_worth_confidence");
  const [intention, setIntention] = useState("");
  const [selectedBackground, setSelectedBackground] = useState<SubliminalBackground>("ocean_calm"); // TEST MODE: Only ocean_calm enabled
  const [selectedDuration, setSelectedDuration] = useState<SubliminalDuration>("10");
  const [selectedStyle, setSelectedStyle] = useState<SubliminalStyle>("balanced");
  const [generatedAffirmations, setGeneratedAffirmations] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const [savedSubliminals, setSavedSubliminals] = useState<SavedSubliminal[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveTitle, setSaveTitle] = useState("");
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameTitle, setRenameTitle] = useState("");
  
  // Refs to track current state for use in onend callback (avoids stale closure)
  const isPlayingRef = useRef(false);
  const isPausedRef = useRef(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // All features are now free and accessible - no beta check needed

  useEffect(() => {
    return () => {
      stopBackground();
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    setSavedSubliminals(getSavedSubliminals());
  }, []);

  const handleSaveSubliminal = () => {
    if (!generatedAffirmations || !saveTitle.trim()) return;
    
    const newSaved: SavedSubliminal = {
      id: crypto.randomUUID(),
      title: saveTitle.trim(),
      intention,
      category: selectedCategory,
      style: selectedStyle,
      background: selectedBackground,
      duration: selectedDuration,
      affirmations: generatedAffirmations,
      createdAt: new Date().toISOString(),
    };
    
    saveSubliminal(newSaved);
    setSavedSubliminals(getSavedSubliminals());
    setShowSaveDialog(false);
    setSaveTitle("");
    toast({
      title: "Subliminal Saved",
      description: "You can replay it anytime from your saved list.",
    });
  };

  const handleLoadSaved = (saved: SavedSubliminal) => {
    setSelectedCategory(saved.category as SubliminalCategory);
    setIntention(saved.intention);
    setSelectedStyle(saved.style as SubliminalStyle);
    setSelectedBackground(saved.background as SubliminalBackground);
    setSelectedDuration(saved.duration as SubliminalDuration);
    setGeneratedAffirmations(saved.affirmations);
    toast({
      title: "Subliminal Loaded",
      description: "Press play to start listening.",
    });
  };

  const handleRename = () => {
    if (!renameId || !renameTitle.trim()) return;
    updateSubliminalTitle(renameId, renameTitle.trim());
    setSavedSubliminals(getSavedSubliminals());
    setShowRenameDialog(false);
    setRenameId(null);
    setRenameTitle("");
    toast({ title: "Renamed", description: "Subliminal title updated." });
  };

  const handleDelete = (id: string) => {
    deleteSavedSubliminal(id);
    setSavedSubliminals(getSavedSubliminals());
    toast({ title: "Deleted", description: "Subliminal removed from saved list." });
  };

  const { data: subliminalHistory } = useQuery<SelectSubliminal[]>({
    queryKey: ['/api/auth/subliminals'],
    enabled: isAuthenticated,
  });

  const generateMutation = useMutation({
    mutationFn: async (data: { 
      category: SubliminalCategory;
      intention: string;
      background: SubliminalBackground;
      duration: SubliminalDuration;
      style: SubliminalStyle;
      betaBypass?: boolean;
      trialBypass?: boolean;
    }) => {
      const res = await apiRequest('POST', '/api/auth/subliminals/generate', data);
      return res.json();
    },
    onSuccess: (data: SelectSubliminal) => {
      setGeneratedAffirmations(data.affirmations);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/subliminals'] });
      toast({
        title: "Subliminal Created",
        description: "Your personalized subliminal is ready to play.",
      });
    },
    onError: (error: any) => {
      // Parse error message - handle both JSON and plain text responses
      let errorMessage = "We couldn't create that subliminal. Try again in a few moments.";
      try {
        if (error.message) {
          // Check if it's a rate limit error with JSON
          const jsonMatch = error.message.match(/\{.*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            errorMessage = parsed.message || errorMessage;
          } else {
            errorMessage = error.message;
          }
        }
      } catch {
        errorMessage = error.message || errorMessage;
      }
      
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    if (!intention.trim()) {
      toast({
        title: "Intention Required",
        description: "Please enter what you would like to reprogram.",
        variant: "destructive",
      });
      return;
    }

    generateMutation.mutate({
      category: selectedCategory,
      intention: intention.trim(),
      background: selectedBackground,
      duration: selectedDuration,
      style: selectedStyle,
      betaBypass: false,
      trialBypass: false,
    });
  };

  const handlePlay = () => {
    if (!generatedAffirmations) return;

    // Resume from pause
    if (isPaused) {
      speechSynthesis.resume();
      resumeBackground();
      setIsPaused(false);
      isPausedRef.current = false;
      setIsPlaying(true);
      isPlayingRef.current = true;
      return;
    }

    // Fresh start
    speechSynthesis.cancel();
    startBackground();

    // Voice at 1% volume (HARD CAPPED at 2%)
    const utterance = new SpeechSynthesisUtterance(generatedAffirmations);
    utterance.rate = 0.35;
    utterance.pitch = 0.85;
    utterance.volume = clampVoiceVolume(VOICE_VOLUME); // Enforces hard cap

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

    // Use refs to check current state (avoids stale closure problem)
    utterance.onend = () => {
      console.log("[SUBLIMINAL] onend fired, isPlayingRef:", isPlayingRef.current, "isPausedRef:", isPausedRef.current);
      if (isPlayingRef.current && !isPausedRef.current) {
        console.log("[SUBLIMINAL] Looping - restarting affirmations");
        speechSynthesis.speak(utterance);
      } else {
        console.log("[SUBLIMINAL] Stopping playback");
        setIsPlaying(false);
        isPlayingRef.current = false;
        setIsPaused(false);
        isPausedRef.current = false;
        stopBackground();
      }
    };

    utterance.onerror = (event) => {
      console.error("[SUBLIMINAL] Speech error:", event);
      setIsPlaying(false);
      isPlayingRef.current = false;
      setIsPaused(false);
      isPausedRef.current = false;
      stopBackground();
      toast({ title: "Playback error", description: "Unable to play audio", variant: "destructive" });
    };

    speechRef.current = utterance;
    
    // Set refs BEFORE starting speech so onend sees correct values
    isPlayingRef.current = true;
    isPausedRef.current = false;
    setIsPlaying(true);
    setIsPaused(false);
    
    speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.pause();
    }
    pauseBackground();
    setIsPaused(true);
    isPausedRef.current = true;
    setIsPlaying(false);
    isPlayingRef.current = false;
  };

  const handleStop = () => {
    // Update refs FIRST to prevent onend from restarting
    isPlayingRef.current = false;
    isPausedRef.current = false;
    speechSynthesis.cancel();
    stopBackground();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const placeholders = [
    "I want to feel safe in love.",
    "I want to soften anxiety before sleep.",
    "I want to trust my decisions.",
    "I am worthy of abundance.",
    "I release what no longer serves me."
  ];

  const bgClasses = getGoldenDawnBackgroundClasses(element);

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
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-serif text-2xl" style={{ color: gdTextColors?.primary || colors.textPrimary }}>
              Subliminal Builder
            </h1>
            <p className="text-sm" style={{ color: gdTextColors?.secondary || colors.textSecondary }}>
              Create a personalized subliminal for your intention
            </p>
          </div>
          {subliminalHistory && subliminalHistory.length > 0 && (
            <Link href="/subliminals/history">
              <Button variant="outline" size="sm" data-testid="button-view-history">
                <History className="w-4 h-4 mr-2" />
                History
              </Button>
            </Link>
          )}
        </motion.div>

        <div className="space-y-6">
          {/* Saved Subliminals Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.02 }}
          >
            <Card 
              className={`p-4 ${isGoldenDawn ? "border border-[#FAD792]/35" : ""} ${cardClasses}`}
              style={getGoldenDawnCardStyle(colors, element)}
            >
              <div className="flex items-center gap-2 mb-3">
                <Bookmark className="w-4 h-4" style={{ color: gdTextColors?.primary || colors.textPrimary }} />
                <h3 className="font-medium" style={{ color: gdTextColors?.primary || (colors.isDark ? '#fff' : colors.textPrimary) }}>
                  Saved Subliminals
                </h3>
              </div>
              
              {savedSubliminals.length === 0 ? (
                <p className="text-sm" style={{ color: gdTextColors?.muted || colors.textMuted }}>
                  You haven't saved any subliminals yet. Create one and save it to reuse later.
                </p>
              ) : (
                <div className="space-y-2">
                  {savedSubliminals.map((saved) => {
                    const CategoryIcon = categoryIcons[saved.category as SubliminalCategory] || Star;
                    return (
                      <div 
                        key={saved.id}
                        className="flex items-center gap-3 p-3 rounded-md"
                        style={{ 
                          background: isGoldenDawn ? 'rgba(244, 201, 139, 0.2)' : 'rgba(255,255,255,0.05)',
                          border: isGoldenDawn ? '1px solid rgba(92, 59, 21, 0.2)' : '1px solid rgba(255,255,255,0.1)'
                        }}
                      >
                        <CategoryIcon 
                          className="w-4 h-4 flex-shrink-0" 
                          style={{ color: gdTextColors?.secondary || colors.textSecondary }} 
                        />
                        <div className="flex-1 min-w-0">
                          <p 
                            className="font-medium text-sm truncate" 
                            style={{ color: gdTextColors?.primary || colors.textPrimary }}
                          >
                            {saved.title}
                          </p>
                          <p 
                            className="text-xs truncate" 
                            style={{ color: gdTextColors?.muted || colors.textMuted }}
                          >
                            {saved.intention.length > 40 ? saved.intention.slice(0, 40) + '...' : saved.intention}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLoadSaved(saved)}
                          className={isGoldenDawn ? "text-[#4A2E0B]" : ""}
                          data-testid={`button-load-subliminal-${saved.id}`}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={isGoldenDawn ? "text-[#4A2E0B]" : ""}
                              data-testid={`button-menu-subliminal-${saved.id}`}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => {
                                setRenameId(saved.id);
                                setRenameTitle(saved.title);
                                setShowRenameDialog(true);
                              }}
                              data-testid={`button-rename-subliminal-${saved.id}`}
                            >
                              <Pencil className="w-4 h-4 mr-2" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(saved.id)}
                              className="text-destructive"
                              data-testid={`button-delete-subliminal-${saved.id}`}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </motion.div>

          {/* Collapsible Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <Card 
              className={`${isGoldenDawn ? "border border-[#FAD792]/35" : ""} ${cardClasses}`}
              style={getGoldenDawnCardStyle(colors, element)}
            >
              <Accordion type="single" collapsible>
                <AccordionItem value="what-are-subliminals" className="border-none">
                  <AccordionTrigger 
                    className="px-4 py-3 hover:no-underline" 
                    style={{ color: gdTextColors?.primary || (colors.isDark ? '#fff' : colors.textPrimary) }}
                    data-testid="accordion-what-are-subliminals"
                  >
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4" />
                      <span className="font-medium">What Are Subliminals?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent 
                    className="px-4 text-sm leading-relaxed"
                    style={{ color: gdTextColors?.secondary || (colors.isDark ? 'rgba(255,255,255,0.8)' : colors.textSecondary) }}
                  >
                    <p className="mb-3">
                      Subliminals are affirmations spoken at a very soft volume so they bypass the conscious mind and speak directly to the subconscious. You may not clearly hear the voice layer, but your deeper mind is still receiving the message.
                    </p>
                    <p className="font-medium mb-2" style={{ color: gdTextColors?.primary || (colors.isDark ? '#fff' : colors.textPrimary) }}>Why the Voice Is Quiet:</p>
                    <p className="mb-3">
                      Subliminals work best when the conscious mind cannot analyze or resist the message. A whisper-like tone gently slips beneath awareness and allows the subconscious to accept the intention without pressure or effort.
                    </p>
                    <p className="font-medium mb-2" style={{ color: gdTextColors?.primary || (colors.isDark ? '#fff' : colors.textPrimary) }}>How to Listen:</p>
                    <ul className="list-disc list-inside mb-3 space-y-1">
                      <li>Use daily or at night</li>
                      <li>Headphones optional</li>
                      <li>Relax and let the sound wash over you</li>
                      <li>No need to focus on the words — your subconscious already knows how to interpret them</li>
                    </ul>
                    <p className="font-medium mb-2" style={{ color: gdTextColors?.primary || (colors.isDark ? '#fff' : colors.textPrimary) }}>Intention:</p>
                    <p>
                      This system supports gentle internal reprogramming — small shifts that grow stronger each time you listen.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card 
              className={`p-4 ${isGoldenDawn ? "border border-[#FAD792]/35" : ""} ${cardClasses}`}
              style={getGoldenDawnCardStyle(colors, element)}
            >
              <h3 className="font-medium mb-3" style={{ color: gdTextColors?.primary || (colors.isDark ? '#fff' : colors.textPrimary) }}>
                Category
              </h3>
              <div className="flex flex-wrap gap-2">
                {subliminalCategories.map((cat) => {
                  const Icon = categoryIcons[cat];
                  const isSelected = selectedCategory === cat;
                  return (
                    <Button
                      key={cat}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(cat)}
                      className={isSelected ? colors.accent : (isGoldenDawn ? "border-[#5C3B15]/40" : "text-white border-white/30 hover:bg-white/10")}
                      style={!isSelected && isGoldenDawn ? { color: gdTextColors?.primary } : undefined}
                      data-testid={`button-category-${cat}`}
                    >
                      <Icon className="w-4 h-4 mr-1" />
                      {subliminalCategoryLabels[cat]}
                    </Button>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card 
              className={`p-4 ${isGoldenDawn ? "border border-[#FAD792]/35" : ""} ${cardClasses}`}
              style={getGoldenDawnCardStyle(colors, element)}
            >
              <h3 className="font-medium mb-3" style={{ color: gdTextColors?.primary || (colors.isDark ? '#fff' : colors.textPrimary) }}>
                What would you like to reprogram?
              </h3>
              <Textarea
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                placeholder={placeholders[Math.floor(Math.random() * placeholders.length)]}
                className={`min-h-[100px] resize-none ${isGoldenDawn ? "border-[#5C3B15]/30" : "bg-white/10 text-white placeholder:text-white/50 border-white/20"}`}
                style={isGoldenDawn ? getGoldenDawnInputStyle(element) : undefined}
                
                data-testid="input-intention"
              />
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card 
              className={`p-4 ${isGoldenDawn ? "border border-[#FAD792]/35" : ""} ${cardClasses}`}
              style={getGoldenDawnCardStyle(colors, element)}
            >
              <h3 className="font-medium mb-3" style={{ color: gdTextColors?.primary || (colors.isDark ? '#fff' : colors.textPrimary) }}>
                Background Sound
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {/* MVP: Only Ocean Calm available */}
                <Button
                  variant="default"
                  size="sm"
                  className={`justify-start ${colors.accent}`}
                  
                  data-testid="button-background-ocean_calm"
                >
                  <Waves className="w-4 h-4 mr-2" />
                  Ocean Calm (gentle water)
                </Button>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card 
              className={`p-4 ${isGoldenDawn ? "border border-[#FAD792]/35" : ""} ${cardClasses}`}
              style={getGoldenDawnCardStyle(colors, element)}
            >
              <h3 className="font-medium mb-3" style={{ color: gdTextColors?.primary || (colors.isDark ? '#fff' : colors.textPrimary) }}>
                Duration
              </h3>
              <div className="flex gap-2">
                {/* MVP: Fixed 10-minute duration (audio file length) */}
                <Button
                  variant="default"
                  size="sm"
                  className={colors.accent}
                  
                  data-testid="button-duration-10"
                >
                  10 min
                </Button>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card 
              className={`p-4 ${isGoldenDawn ? "border border-[#FAD792]/35" : ""} ${cardClasses}`}
              style={getGoldenDawnCardStyle(colors, element)}
            >
              <h3 className="font-medium mb-3" style={{ color: gdTextColors?.primary || (colors.isDark ? '#fff' : colors.textPrimary) }}>
                Scripting Style
              </h3>
              <div className="flex flex-wrap gap-2">
                {subliminalStyles.map((style) => {
                  const isSelected = selectedStyle === style;
                  return (
                    <Button
                      key={style}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedStyle(style)}
                      className={isSelected ? colors.accent : (isGoldenDawn ? "border-[#5C3B15]/40" : "text-white border-white/30 hover:bg-white/10")}
                      style={!isSelected && isGoldenDawn ? { color: gdTextColors?.primary } : undefined}
                      
                      data-testid={`button-style-${style}`}
                    >
                      {subliminalStyleLabels[style]}
                    </Button>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Button
                className={`w-full ${colors.accent} ${getGoldenDawnButtonClasses(element, true)}`}
                onClick={handleGenerate}
                disabled={generateMutation.isPending}
                data-testid="button-create-subliminal"
              >
                {generateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Your Subliminal...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Create Subliminal
                  </>
                )}
              </Button>
          </motion.div>

          {generatedAffirmations && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card 
                className={`p-4 ${isGoldenDawn ? "border border-[#FAD792]/35" : ""} ${cardClasses}`}
                style={getGoldenDawnCardStyle(colors, element)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium" style={{ color: gdTextColors?.primary || (colors.isDark ? '#fff' : colors.textPrimary) }}>
                    Your Subliminal
                  </h3>
                  <div className="flex items-center gap-2">
                    <TextToSpeechButton
                      text={generatedAffirmations}
                      element={element}
                      testId="button-tts-subliminal"
                    />
                    <Badge variant="secondary">
                      <Volume2 className="w-3 h-3 mr-1" />
                      Ready
                    </Badge>
                  </div>
                </div>
                
                <div 
                  className="p-3 rounded-md mb-4 max-h-48 overflow-y-auto text-sm"
                  style={{ color: gdTextColors?.secondary || (colors.isDark ? 'rgba(255,255,255,0.8)' : colors.textSecondary) }}
                >
                  {generatedAffirmations.split('\n').map((line, i) => (
                    <p key={i} className="mb-1">{line}</p>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className={`w-full ${isGoldenDawn ? "border-[#5C3B15]/40 text-[#4A2E0B]" : ""}`}
                  onClick={() => setShowSaveDialog(true)}
                  data-testid="button-save-subliminal"
                >
                  <BookmarkPlus className="w-4 h-4 mr-2" />
                  Save Subliminal
                </Button>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
      </div>

      {/* FIXED BOTTOM CONTROL BAR - Outside all cards */}
      {generatedAffirmations && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px 24px',
            background: isGoldenDawn 
              ? 'linear-gradient(to top, rgba(229, 167, 84, 0.95), rgba(244, 201, 139, 0.9))'
              : 'linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.8))',
            backdropFilter: 'blur(10px)',
            borderTop: isGoldenDawn 
              ? '1px solid rgba(92, 59, 21, 0.3)'
              : '1px solid rgba(255,255,255,0.1)',
            zIndex: 9999,
          }}
        >
          <div className="max-w-2xl mx-auto flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                console.log("PLAY BUTTON CLICKED");
                handlePlay();
              }}
              disabled={isPlaying && !isPaused}
              style={{
                flex: 1,
                maxWidth: '160px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '14px 24px',
                borderRadius: '50px',
                border: 'none',
                fontWeight: 600,
                fontSize: '15px',
                color: isGoldenDawn ? '#4A2E0B' : 'white',
                background: isGoldenDawn 
                  ? 'linear-gradient(90deg, #F7D49C, #E7A55A)'
                  : 'linear-gradient(90deg, #ff66cc, #9955ff)',
                opacity: (isPlaying && !isPaused) ? 0.5 : 1,
                cursor: (isPlaying && !isPaused) ? 'not-allowed' : 'pointer',
              }}
              data-testid="button-play"
            >
              <Play style={{ width: '18px', height: '18px' }} />
              {isPaused ? "Resume" : "Play"}
            </button>
            
            <button
              type="button"
              onClick={() => {
                console.log("PAUSE BUTTON CLICKED");
                handlePause();
              }}
              disabled={!isPlaying || isPaused}
              style={{
                flex: 1,
                maxWidth: '160px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '14px 24px',
                borderRadius: '50px',
                fontWeight: 600,
                fontSize: '15px',
                color: isGoldenDawn ? '#4A2E0B' : 'white',
                background: isGoldenDawn 
                  ? 'rgba(244, 201, 139, 0.4)'
                  : 'rgba(255, 255, 255, 0.15)',
                border: isGoldenDawn 
                  ? '1px solid rgba(92, 59, 21, 0.4)'
                  : '1px solid rgba(255, 255, 255, 0.3)',
                opacity: (!isPlaying || isPaused) ? 0.5 : 1,
                cursor: (!isPlaying || isPaused) ? 'not-allowed' : 'pointer',
              }}
              data-testid="button-pause"
            >
              <Pause style={{ width: '18px', height: '18px' }} />
              Pause
            </button>
            
            <button
              type="button"
              onClick={() => {
                console.log("STOP BUTTON CLICKED");
                handleStop();
              }}
              disabled={!isPlaying && !isPaused}
              style={{
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                color: isGoldenDawn ? '#4A2E0B' : 'white',
                background: isGoldenDawn 
                  ? 'rgba(244, 201, 139, 0.3)'
                  : 'rgba(255, 255, 255, 0.1)',
                border: isGoldenDawn 
                  ? '1px solid rgba(92, 59, 21, 0.3)'
                  : '1px solid rgba(255, 255, 255, 0.2)',
                opacity: (!isPlaying && !isPaused) ? 0.5 : 1,
                cursor: (!isPlaying && !isPaused) ? 'not-allowed' : 'pointer',
              }}
              data-testid="button-stop"
            >
              <Square style={{ width: '18px', height: '18px' }} />
            </button>
          </div>
        </div>
      )}

      {/* Save Subliminal Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className={isGoldenDawn ? "bg-[#F7E4C1] border-[#5C3B15]/30" : ""}>
          <DialogHeader>
            <DialogTitle style={isGoldenDawn ? { color: '#4A2E0B' } : undefined}>
              Save Subliminal
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label 
              className="text-sm font-medium mb-2 block"
              style={isGoldenDawn ? { color: '#5C3B15' } : undefined}
            >
              Give it a name
            </label>
            <Input
              value={saveTitle}
              onChange={(e) => setSaveTitle(e.target.value)}
              placeholder="e.g., Morning Confidence Boost"
              className={isGoldenDawn ? "border-[#5C3B15]/30 bg-white/50" : ""}
              style={isGoldenDawn ? { color: '#4A2E0B' } : undefined}
              data-testid="input-save-title"
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowSaveDialog(false)}
              className={isGoldenDawn ? "border-[#5C3B15]/40 text-[#4A2E0B]" : ""}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveSubliminal}
              disabled={!saveTitle.trim()}
              className={isGoldenDawn ? "bg-[#D4A050] text-[#4A2E0B] hover:bg-[#C99040]" : ""}
              data-testid="button-confirm-save"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent className={isGoldenDawn ? "bg-[#F7E4C1] border-[#5C3B15]/30" : ""}>
          <DialogHeader>
            <DialogTitle style={isGoldenDawn ? { color: '#4A2E0B' } : undefined}>
              Rename Subliminal
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={renameTitle}
              onChange={(e) => setRenameTitle(e.target.value)}
              placeholder="New name"
              className={isGoldenDawn ? "border-[#5C3B15]/30 bg-white/50" : ""}
              style={isGoldenDawn ? { color: '#4A2E0B' } : undefined}
              data-testid="input-rename-title"
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowRenameDialog(false)}
              className={isGoldenDawn ? "border-[#5C3B15]/40 text-[#4A2E0B]" : ""}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleRename}
              disabled={!renameTitle.trim()}
              className={isGoldenDawn ? "bg-[#D4A050] text-[#4A2E0B] hover:bg-[#C99040]" : ""}
              data-testid="button-confirm-rename"
            >
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
