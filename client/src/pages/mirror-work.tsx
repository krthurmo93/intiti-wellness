import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  ArrowLeft, 
  Camera,
  CameraOff,
  Circle,
  Square,
  Play,
  Pause,
  Heart,
  Star,
  Sparkles,
  Shield,
  Sun,
  Leaf,
  History,
  RotateCcw,
  ChevronUp,
  ChevronDown,
  Download,
  Trash2
} from "lucide-react";
import { useElementTheme } from "@/lib/element-theme";
import { getGoldenDawnBackgroundClasses } from "@/lib/golden-dawn-styles";
import { canAccessGoldenDawn } from "@/lib/storage";

type AffirmationCategory = "self_love" | "worthiness" | "abundance" | "kindness" | "protection" | "healing";

interface AffirmationSet {
  category: AffirmationCategory;
  label: string;
  icon: typeof Heart;
  affirmations: string[];
}

const affirmationSets: AffirmationSet[] = [
  {
    category: "self_love",
    label: "Self Love",
    icon: Heart,
    affirmations: [
      "I am beautiful exactly as I am.",
      "I love and accept myself completely.",
      "I am worthy of love and belonging.",
      "My heart is open to giving and receiving love.",
      "I embrace my unique beauty.",
      "I am enough, just as I am.",
      "I radiate love and others reflect it back to me.",
      "I deserve all the love in the world.",
      "My self-love grows stronger every day.",
      "I am a beautiful soul having a human experience."
    ]
  },
  {
    category: "worthiness",
    label: "Worthiness",
    icon: Star,
    affirmations: [
      "I am worthy of all good things.",
      "I deserve happiness and success.",
      "I am deserving of my dreams.",
      "My worthiness is not determined by others.",
      "I am valuable and important.",
      "I matter and my voice matters.",
      "I am worthy of respect and kindness.",
      "I deserve to take up space in this world.",
      "My worth is inherent and unchanging.",
      "I am worthy simply because I exist."
    ]
  },
  {
    category: "abundance",
    label: "Abundance",
    icon: Sparkles,
    affirmations: [
      "I am a magnet for abundance.",
      "Prosperity flows to me easily.",
      "I am open to receiving all the good life offers.",
      "Money comes to me in expected and unexpected ways.",
      "I live in an abundant universe.",
      "I attract wealth and success effortlessly.",
      "I am grateful for the abundance in my life.",
      "I deserve financial freedom.",
      "Abundance is my birthright.",
      "I welcome prosperity into my life."
    ]
  },
  {
    category: "kindness",
    label: "Kindness",
    icon: Sun,
    affirmations: [
      "I am kind to myself and others.",
      "I treat myself with compassion.",
      "I speak to myself with love and kindness.",
      "I extend grace to myself daily.",
      "My kindness makes a difference.",
      "I am gentle with myself as I grow.",
      "I deserve my own compassion.",
      "I am patient with myself.",
      "I forgive myself and let go.",
      "I nurture myself with loving thoughts."
    ]
  },
  {
    category: "protection",
    label: "Protection",
    icon: Shield,
    affirmations: [
      "I am safe and protected.",
      "I set healthy boundaries with love.",
      "I am surrounded by divine protection.",
      "I trust that I am always guided.",
      "I release what no longer serves me.",
      "I am shielded from negativity.",
      "My energy is protected and sacred.",
      "I honor my need for safety.",
      "I attract only positive energy.",
      "I am secure in who I am."
    ]
  },
  {
    category: "healing",
    label: "Healing",
    icon: Leaf,
    affirmations: [
      "I am healing every day.",
      "My body knows how to heal itself.",
      "I release all that weighs me down.",
      "I am becoming stronger and healthier.",
      "Healing energy flows through me.",
      "I trust my healing journey.",
      "I am gentle with myself as I heal.",
      "Every breath brings me peace.",
      "I let go of pain and embrace peace.",
      "I am worthy of deep healing."
    ]
  }
];

interface MirrorRecording {
  id: string;
  date: string;
  category: AffirmationCategory;
  duration: number;
  videoUrl: string;
  blob: Blob;
}

export default function MirrorWork() {
  const { colors, element } = useElementTheme();
  const isGoldenDawn = element === "golden_dawn" && canAccessGoldenDawn();
  const bgClasses = getGoldenDawnBackgroundClasses(element);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const teleprompterRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<number | null>(null);
  
  const [hasCamera, setHasCamera] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  const [selectedCategory, setSelectedCategory] = useState<AffirmationCategory>("self_love");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAffirmationIndex, setCurrentAffirmationIndex] = useState(0);
  const [scrollSpeed, setScrollSpeed] = useState(50);
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  
    const [showRecordings, setShowRecordings] = useState(false);
  const [recordings, setRecordings] = useState<MirrorRecording[]>([]);

  const currentSet = affirmationSets.find(s => s.category === selectedCategory) || affirmationSets[0];
  const CategoryIcon = currentSet.icon;

  
  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.mediaDevices) {
      setHasCamera(true);
    }
  }, []);

  useEffect(() => {
    return () => {
      recordings.forEach(rec => {
        URL.revokeObjectURL(rec.videoUrl);
      });
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    let interval: number;
    if (isRecording && recordingStartTime) {
      interval = window.setInterval(() => {
        setRecordingDuration(Math.floor((Date.now() - recordingStartTime) / 1000));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, recordingStartTime]);

  useEffect(() => {
    if (isPlaying) {
      const intervalTime = (101 - scrollSpeed) * 80;
      scrollIntervalRef.current = window.setInterval(() => {
        setCurrentAffirmationIndex(prev => (prev + 1) % currentSet.affirmations.length);
      }, intervalTime);
    } else if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, [isPlaying, scrollSpeed, currentSet.affirmations.length]);

  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
      setCameraActive(true);
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError("Unable to access camera. Please allow camera permissions.");
      setCameraActive(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setIsRecording(false);
  }, [stream]);

  const startRecording = useCallback(() => {
    if (!stream) return;
    
    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const videoUrl = URL.createObjectURL(blob);
      const recording: MirrorRecording = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        category: selectedCategory,
        duration: recordingDuration,
        videoUrl,
        blob
      };
      setRecordings(prev => [recording, ...prev].slice(0, 10));
    };
    
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
    setRecordingStartTime(Date.now());
    setRecordingDuration(0);
  }, [stream, selectedCategory, recordingDuration]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setRecordingStartTime(null);
  }, []);

  const resetTeleprompter = useCallback(() => {
    if (teleprompterRef.current) {
      teleprompterRef.current.scrollTop = 0;
    }
    setCurrentAffirmationIndex(0);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleDeleteRecording = (id: string) => {
    setRecordings(prev => {
      const recording = prev.find(r => r.id === id);
      if (recording) {
        URL.revokeObjectURL(recording.videoUrl);
      }
      return prev.filter(r => r.id !== id);
    });
  };

  return (
    <div 
      className={`min-h-screen bg-gradient-to-b ${colors.gradient} transition-colors duration-500 relative ${bgClasses}`}
      style={isGoldenDawn ? { background: `linear-gradient(to bottom, #FFE7B3, #EFA045, #E2755B)` } : {}}
    >
      <div className={`${colors.overlay} min-h-screen transition-colors duration-500 relative z-10`}>
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
              Mirror Work
            </h1>
            <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowRecordings(!showRecordings)}
                style={{ color: colors.textSecondary }}
                data-testid="button-recordings"
              >
                <History className="w-5 h-5" />
              </Button>
          </div>

          {/* Category Selection */}
          {!cameraActive && (
            <div className="mb-6">
              <p 
                className="text-sm mb-3 text-center"
                style={{ color: colors.textSecondary }}
              >
                Choose your affirmation focus
              </p>
              <div className="grid grid-cols-3 gap-3">
                {affirmationSets.map((set) => {
                  const Icon = set.icon;
                  const isSelected = selectedCategory === set.category;
                  return (
                    <motion.button
                      key={set.category}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCategory(set.category)}
                      className={`p-4 rounded-xl text-center transition-all ${
                        isSelected ? "ring-2" : ""
                      } ${colors.isDark ? "bg-violet-900/50 border border-violet-400/30" : ""}`}
                      style={{ 
                        backgroundColor: colors.isDark 
                          ? (isSelected ? "rgba(139, 92, 246, 0.4)" : "rgba(76, 29, 149, 0.5)")
                          : (isSelected ? colors.accentPrimary + "30" : colors.cardBg),
                        borderColor: isSelected ? colors.accentPrimary : colors.cardBorder,
                        boxShadow: isSelected ? `0 0 0 2px ${colors.accentPrimary}` : "none"
                      }}
                      data-testid={`button-category-${set.category}`}
                    >
                      <Icon 
                        className="w-6 h-6 mx-auto mb-2" 
                        style={{ color: isSelected ? colors.accentPrimary : colors.textSecondary }}
                      />
                      <span 
                        className="text-xs font-medium block"
                        style={{ color: isSelected ? colors.textPrimary : colors.textSecondary }}
                      >
                        {set.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Speed Control - only show when camera not active */}
          {!cameraActive && (
            <Card 
              className={`p-4 mb-4 ${colors.isDark ? "bg-violet-900/40 border-violet-400/30" : ""}`}
              style={{ 
                backgroundColor: colors.isDark ? "rgba(76, 29, 149, 0.4)" : colors.cardBg,
                borderColor: colors.isDark ? "rgba(167, 139, 250, 0.3)" : colors.cardBorder
              }}
            >
              <label 
                className="text-sm font-medium mb-2 block"
                style={{ color: colors.textSecondary }}
              >
                Scroll Speed: {scrollSpeed}%
              </label>
              <Slider
                value={[scrollSpeed]}
                onValueChange={([v]) => setScrollSpeed(v)}
                min={10}
                max={100}
                step={5}
                className="w-full"
                data-testid="slider-speed"
              />
            </Card>
          )}

          
          <AnimatePresence>
            {showRecordings && recordings.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-4"
              >
                <Card 
                  className={`p-4 ${colors.isDark ? "bg-violet-900/40 border-violet-400/30" : ""}`}
                  style={{ 
                    backgroundColor: colors.isDark ? "rgba(76, 29, 149, 0.4)" : colors.cardBg,
                    borderColor: colors.isDark ? "rgba(167, 139, 250, 0.3)" : colors.cardBorder
                  }}
                >
                  <h3 
                    className="text-sm font-medium mb-2"
                    style={{ color: colors.textSecondary }}
                  >
                    Recent Recordings
                  </h3>
                  <p 
                    className="text-xs mb-3"
                    style={{ color: colors.textMuted }}
                  >
                    Recordings available this session only - download to save
                  </p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {recordings.map((rec) => {
                      const set = affirmationSets.find(s => s.category === rec.category);
                      const Icon = set?.icon || Heart;
                      return (
                        <div 
                          key={rec.id}
                          className="flex items-center justify-between p-2 rounded-lg"
                          style={{ backgroundColor: colors.cardBg }}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" style={{ color: colors.accentPrimary }} />
                            <div>
                              <p 
                                className="text-sm font-medium"
                                style={{ color: colors.textPrimary }}
                              >
                                {set?.label || "Mirror Work"}
                              </p>
                              <p 
                                className="text-xs"
                                style={{ color: colors.textMuted }}
                              >
                                {new Date(rec.date).toLocaleDateString()} - {formatDuration(rec.duration)}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => window.open(rec.videoUrl, "_blank")}
                              style={{ color: colors.textSecondary }}
                              data-testid={`button-play-recording-${rec.id}`}
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const a = document.createElement("a");
                                a.href = rec.videoUrl;
                                a.download = `mirror-work-${rec.date.split("T")[0]}.webm`;
                                a.click();
                              }}
                              style={{ color: colors.textSecondary }}
                              data-testid={`button-download-recording-${rec.id}`}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteRecording(rec.id)}
                              style={{ color: colors.textMuted }}
                              data-testid={`button-delete-recording-${rec.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card 
              className={`overflow-hidden relative ${colors.isDark ? "bg-violet-900/40 border-violet-400/30" : ""}`}
              style={{ 
                backgroundColor: colors.isDark ? "rgba(76, 29, 149, 0.4)" : colors.cardBg,
                borderColor: colors.isDark ? "rgba(167, 139, 250, 0.3)" : colors.cardBorder
              }}
            >
              <div className="relative aspect-[3/4] bg-black">
                {!cameraActive ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {cameraError ? (
                      <div className="text-center p-4">
                        <CameraOff className="w-12 h-12 mx-auto mb-4 text-red-400" />
                        <p className="text-white/80 mb-4">{cameraError}</p>
                        <Button onClick={startCamera} variant="outline" data-testid="button-retry-camera">
                          Try Again
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center p-4">
                        <Camera className="w-16 h-16 mx-auto mb-4 text-white/60" />
                        <p className="text-white/80 mb-2 text-lg font-light">Mirror Work</p>
                        <p className="text-white/60 text-sm mb-6 max-w-xs">
                          Look into the mirror and speak loving affirmations to yourself
                        </p>
                        <Button 
                          onClick={startCamera}
                          className="gap-2"
                          style={{ 
                            backgroundColor: colors.accentPrimary,
                            color: colors.accentForeground || "#fff"
                          }}
                          data-testid="button-start-camera"
                        >
                          <Camera className="w-4 h-4" />
                          Start Mirror
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ transform: "scaleX(-1)" }}
                      data-testid="video-mirror"
                    />
                    
                    <div 
                      ref={teleprompterRef}
                      className="absolute inset-x-0 bottom-0 h-2/3 overflow-hidden pointer-events-none"
                      style={{
                        background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)"
                      }}
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-end pb-24 px-6">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={isPlaying ? "playing" : "paused"}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center"
                          >
                            {isPlaying ? (
                              <AnimatePresence mode="wait">
                                <motion.p
                                  key={currentAffirmationIndex}
                                  initial={{ opacity: 0, y: 30 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -30 }}
                                  transition={{ duration: 0.5 }}
                                  className="text-2xl md:text-3xl font-serif font-light text-white leading-relaxed max-w-lg"
                                  style={{
                                    textShadow: "0 2px 15px rgba(0,0,0,0.9)"
                                  }}
                                  data-testid="text-current-affirmation"
                                >
                                  {currentSet.affirmations[currentAffirmationIndex % currentSet.affirmations.length]}
                                </motion.p>
                              </AnimatePresence>
                            ) : (
                              <div className="flex flex-col items-center gap-3">
                                <CategoryIcon className="w-8 h-8 text-white/80" />
                                <p className="text-xl text-white/80 font-light">
                                  {currentSet.label}
                                </p>
                                <p className="text-white/60 text-sm">
                                  Tap play to begin
                                </p>
                              </div>
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>

                    {isRecording && (
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <motion.div
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="w-3 h-3 rounded-full bg-red-500"
                        />
                        <span className="text-white text-sm font-medium">
                          {formatDuration(recordingDuration)}
                        </span>
                      </div>
                    )}

                    <div className="absolute top-4 right-4">
                      <Badge 
                        variant="secondary"
                        className="gap-1"
                        style={{ backgroundColor: "rgba(0,0,0,0.5)", color: "#fff" }}
                      >
                        <CategoryIcon className="w-3 h-3" />
                        {currentSet.label}
                      </Badge>
                    </div>
                  </>
                )}
              </div>

              {cameraActive && (
                <div 
                  className="p-4 flex items-center justify-center gap-4"
                  style={{ backgroundColor: colors.cardBg }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={resetTeleprompter}
                    style={{ color: colors.textSecondary }}
                    data-testid="button-reset"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setCurrentAffirmationIndex(prev => 
                        prev > 0 ? prev - 1 : currentSet.affirmations.length - 1
                      );
                    }}
                    style={{ color: colors.textSecondary }}
                    data-testid="button-prev"
                  >
                    <ChevronUp className="w-5 h-5" />
                  </Button>

                  <Button
                    size="icon"
                    className="w-14 h-14 rounded-full"
                    onClick={() => setIsPlaying(!isPlaying)}
                    style={{ 
                      backgroundColor: colors.accentPrimary,
                      color: colors.accentForeground || "#fff"
                    }}
                    data-testid="button-play-pause"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setCurrentAffirmationIndex(prev => 
                        (prev + 1) % currentSet.affirmations.length
                      );
                    }}
                    style={{ color: colors.textSecondary }}
                    data-testid="button-next"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </Button>

                  <Button
                    variant={isRecording ? "destructive" : "ghost"}
                    size="icon"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={isRecording ? "" : ""}
                    style={!isRecording ? { color: colors.textSecondary } : {}}
                    data-testid="button-record"
                  >
                    {isRecording ? <Square className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                  </Button>
                </div>
              )}
            </Card>

            {cameraActive && (
              <div className="mt-4 text-center">
                <Button
                  variant="ghost"
                  onClick={stopCamera}
                  style={{ color: colors.textMuted }}
                  data-testid="button-stop-camera"
                >
                  <CameraOff className="w-4 h-4 mr-2" />
                  Stop Camera
                </Button>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-center"
          >
            <p 
              className="text-sm italic"
              style={{ color: colors.textMuted }}
            >
              "The most powerful relationship you will ever have is the relationship with yourself."
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
