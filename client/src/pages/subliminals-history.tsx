import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Square, 
  Trash2,
  Volume2,
  Heart,
  Shield,
  DollarSign,
  Brain,
  Moon,
  Eye,
  Star,
  Calendar
} from "lucide-react";
import { useElementTheme } from "@/lib/element-theme";
import { isGoldenDawnActive, getGoldenDawnCardStyle, getGoldenDawnCardClasses, getGoldenDawnBackgroundClasses } from "@/lib/golden-dawn-styles";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  subliminalCategoryLabels,
  type SubliminalCategory,
  type SelectSubliminal,
} from "@shared/schema";
import { format } from "date-fns";

const categoryIcons: Record<SubliminalCategory, typeof Heart> = {
  love_relationships: Heart,
  self_worth_confidence: Star,
  money_overflow: DollarSign,
  healing_nervous_system: Brain,
  protection_boundaries: Shield,
  shadow_integration: Eye,
  spiritual_alignment: Moon
};

// Audio volume constants - SIMPLE TWO TRACK SYSTEM
const VOICE_VOLUME = 0.05;           // 5% - quiet subliminal voice
const AMBIENT_VOLUME = 0.85;         // 85% - dominant ambient level

// HTML5 Audio for ambient sounds (using real audio files)
let ambientAudio: HTMLAudioElement | null = null;

// Map background types to audio file URLs (TEST MODE: only Ocean Calm and Soft Rain)
function getAmbientAudioUrl(backgroundType: string): string | null {
  switch (backgroundType) {
    case 'ocean_calm':
      return '/audio/ambient/ocean-calm.mp3';
    case 'theta_waves':
      return '/audio/ambient/soft-rain.mp3'; // Using Theta Waves to test soft-rain.mp3
    default:
      // All other backgrounds return null for clean testing
      return null;
  }
}

// Start ambient sound using HTML5 Audio with real audio files
async function startAmbient(backgroundType: string): Promise<void> {
  if (backgroundType === 'pure_silence') {
    console.log("Pure silence selected - no ambient sound");
    return;
  }
  
  try {
    stopAmbient(); // Clean up any existing audio
    
    const audioUrl = getAmbientAudioUrl(backgroundType);
    if (!audioUrl) {
      console.log("No audio file for background:", backgroundType);
      return;
    }
    
    ambientAudio = new Audio(audioUrl);
    ambientAudio.loop = true;
    ambientAudio.volume = AMBIENT_VOLUME;
    
    // Wait for audio to be ready before playing
    await new Promise<void>((resolve, reject) => {
      if (!ambientAudio) return reject("No audio element");
      ambientAudio.oncanplaythrough = () => resolve();
      ambientAudio.onerror = (e) => reject(e);
      ambientAudio.load();
    });
    
    await ambientAudio.play();
    console.log("Ambient audio started:", backgroundType, "url:", audioUrl, "volume:", AMBIENT_VOLUME);
  } catch (err) {
    console.error("Error starting ambient audio:", err);
  }
}

function stopAmbient(): void {
  if (ambientAudio) {
    try {
      ambientAudio.pause();
      ambientAudio.currentTime = 0;
      ambientAudio = null;
    } catch (e) {
      console.error("Error stopping ambient:", e);
    }
  }
}

function pauseAmbient(): void {
  if (ambientAudio) {
    try {
      ambientAudio.pause();
      console.log("Ambient audio paused");
    } catch (e) {
      console.error("Error pausing ambient:", e);
    }
  }
}

function resumeAmbient(): void {
  if (ambientAudio) {
    try {
      ambientAudio.play();
      console.log("Ambient audio resumed");
    } catch (e) {
      console.error("Error resuming ambient:", e);
    }
  }
}

export default function SubliminalsHistory() {
  const [, setLocation] = useLocation();
  const { colors, element } = useElementTheme();
  const isGoldenDawn = isGoldenDawnActive(element);
  const cardClasses = getGoldenDawnCardClasses(element);
  const bgClasses = getGoldenDawnBackgroundClasses(element);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [playingSubliminalId, setPlayingSubliminalId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const { data: subliminals, isLoading } = useQuery<SelectSubliminal[]>({
    queryKey: ['/api/auth/subliminals'],
    enabled: isAuthenticated,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/auth/subliminals/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/subliminals'] });
      toast({
        title: "Subliminal Deleted",
        description: "Your subliminal has been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Delete Failed",
        description: "Could not delete the subliminal.",
        variant: "destructive",
      });
    },
  });

  const handlePlay = async (subliminal: SelectSubliminal) => {
    // Resume from pause
    if (playingSubliminalId === subliminal.id && isPaused && speechRef.current) {
      speechSynthesis.resume();
      resumeAmbient();
      setIsPaused(false);
      return;
    }

    // Stop any previous playback
    if (playingSubliminalId !== subliminal.id) {
      speechSynthesis.cancel();
      stopAmbient();
    }

    // Start ambient with fade-in
    const background = subliminal.background || 'theta_waves';
    await startAmbient(background);

    // Create speech with subliminal whisper volume (5%)
    const utterance = new SpeechSynthesisUtterance(subliminal.affirmations);
    utterance.rate = 0.35;
    utterance.pitch = 0.85;
    utterance.volume = VOICE_VOLUME; // 5% - quiet subliminal whisper

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
      // Loop the voice
      if (playingSubliminalId === subliminal.id && !isPaused) {
        speechSynthesis.speak(utterance);
      } else {
        setPlayingSubliminalId(null);
        setIsPaused(false);
        stopAmbient();
      }
    };

    utterance.onerror = () => {
      setPlayingSubliminalId(null);
      setIsPaused(false);
      stopAmbient();
    };

    speechRef.current = utterance;
    speechSynthesis.speak(utterance);
    setPlayingSubliminalId(subliminal.id);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.pause();
    }
    pauseAmbient();
    setIsPaused(true);
  };

  const handleStop = () => {
    speechSynthesis.cancel();
    stopAmbient();
    setPlayingSubliminalId(null);
    setIsPaused(false);
  };

  return (
    <div 
      className="min-h-screen transition-colors duration-500"
      style={{ background: colors.gradientStyle }}
    >
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/subliminals")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-serif text-2xl" style={{ color: colors.textPrimary }}>
              Saved Subliminals
            </h1>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Your personalized subliminal library
            </p>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse text-center" style={{ color: colors.textMuted }}>
              Loading your subliminals...
            </div>
          </div>
        ) : !subliminals || subliminals.length === 0 ? (
          <Card 
            className={`p-6 text-center ${isGoldenDawn ? "border border-[#FAD792]/35" : ""} ${cardClasses}`}
            style={getGoldenDawnCardStyle(colors, element)}
          >
            <Volume2 className="w-12 h-12 mx-auto mb-4 opacity-50" style={{ color: isGoldenDawn ? "rgba(255,255,255,0.5)" : colors.textMuted }} />
            <h3 className="font-medium mb-2" style={{ color: colors.textPrimary }}>
              No Subliminals Yet
            </h3>
            <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
              Create your first personalized subliminal to begin your reprogramming journey.
            </p>
            <Button
              onClick={() => setLocation("/subliminals")}
              className="bg-purple-500"
              data-testid="button-create-first"
            >
              Create Your First Subliminal
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {subliminals.map((subliminal, index) => {
              const Icon = categoryIcons[subliminal.category as SubliminalCategory] || Star;
              const isPlaying = playingSubliminalId === subliminal.id;
              const createdDate = subliminal.createdAt 
                ? format(new Date(subliminal.createdAt), 'MMM d, yyyy')
                : 'Unknown date';

              return (
                <motion.div
                  key={subliminal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    className={`p-4 ${isPlaying ? 'ring-2 ring-purple-400' : ''} ${isGoldenDawn ? "border border-[#FAD792]/35" : ""} ${cardClasses}`}
                    style={getGoldenDawnCardStyle(colors, element)}
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className="p-2 rounded-full"
                        style={{ backgroundColor: `${colors.accent}20` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: colors.accent }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate" style={{ color: colors.textPrimary }}>
                          {subliminal.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm" style={{ color: colors.textSecondary }}>
                          <Badge variant="outline" className="text-xs">
                            {subliminalCategoryLabels[subliminal.category as SubliminalCategory] || subliminal.category}
                          </Badge>
                          <span>{subliminal.duration} min</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-xs" style={{ color: colors.textMuted }}>
                          <Calendar className="w-3 h-3" />
                          {createdDate}
                        </div>
                        <p 
                          className="text-sm mt-2 line-clamp-2"
                          style={{ color: colors.textSecondary }}
                        >
                          {subliminal.intention}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                      <Button
                        size="sm"
                        onClick={() => handlePlay(subliminal)}
                        disabled={isPlaying && !isPaused}
                        className="flex-1 rounded-full font-semibold text-white shadow-lg transition-all duration-150 hover:translate-y-[-1px] hover:shadow-xl active:translate-y-0"
                        style={{
                          background: 'linear-gradient(90deg, #ff66cc, #9955ff)',
                          opacity: (isPlaying && !isPaused) ? 0.5 : 1,
                        }}
                        data-testid={`button-play-${subliminal.id}`}
                      >
                        <Play className="w-4 h-4 mr-1" />
                        {isPaused && isPlaying ? "Resume" : "Play"}
                      </Button>
                      
                      <Button
                        size="sm"
                        onClick={handlePause}
                        disabled={!isPlaying || isPaused}
                        className="flex-1 rounded-full font-semibold text-white shadow-lg transition-all duration-150 hover:translate-y-[-1px] hover:shadow-xl active:translate-y-0"
                        style={{
                          background: 'rgba(255, 255, 255, 0.18)',
                          border: '1px solid rgba(255, 255, 255, 0.35)',
                          opacity: (!isPlaying || isPaused) ? 0.5 : 1,
                        }}
                        data-testid={`button-pause-${subliminal.id}`}
                      >
                        <Pause className="w-4 h-4 mr-1" />
                        Pause
                      </Button>
                      
                      <Button
                        size="icon"
                        onClick={handleStop}
                        disabled={!isPlaying && !isPaused}
                        className="rounded-full text-white shadow transition-all duration-150 hover:translate-y-[-1px]"
                        style={{
                          background: 'rgba(255, 255, 255, 0.12)',
                          border: '1px solid rgba(255, 255, 255, 0.25)',
                          opacity: (!isPlaying && !isPaused) ? 0.5 : 1,
                        }}
                        data-testid={`button-stop-${subliminal.id}`}
                      >
                        <Square className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate(subliminal.id)}
                        disabled={deleteMutation.isPending}
                        className="text-white/70 hover:text-white hover:bg-white/10"
                        data-testid={`button-delete-${subliminal.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
