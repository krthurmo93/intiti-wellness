import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  BookOpen, 
  Plus, 
  Sparkles, 
  Moon, 
  Cloud, 
  CloudLightning, 
  Flame, 
  Heart,
  Trash2,
  ChevronDown,
  ChevronUp,
  Loader2,
  HelpCircle
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useElementTheme } from "@/lib/element-theme";
import { isGoldenDawnActive, getGoldenDawnBackgroundClasses } from "@/lib/golden-dawn-styles";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { TextToSpeechButton } from "@/components/speech-buttons";
import type { SelectDreamEntry } from "@shared/schema";

const dreamMoods = [
  { value: "calm", label: "Calm", icon: Moon, color: "from-blue-400 to-indigo-500" },
  { value: "confusing", label: "Confusing", icon: Cloud, color: "from-gray-400 to-slate-500" },
  { value: "scary", label: "Scary", icon: CloudLightning, color: "from-purple-500 to-violet-700" },
  { value: "powerful", label: "Powerful", icon: Flame, color: "from-orange-400 to-red-500" },
  { value: "sweet", label: "Sweet", icon: Heart, color: "from-pink-400 to-rose-500" },
] as const;

export default function DreamJournalBeta() {
  const [, setLocation] = useLocation();
  const { colors, element } = useElementTheme();
  const isGoldenDawn = isGoldenDawnActive(element);
  const bgClasses = getGoldenDawnBackgroundClasses(element);
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  // All features are now free and accessible - no beta check needed
  const [showForm, setShowForm] = useState(false);
  const [expandedDream, setExpandedDream] = useState<string | null>(null);
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const { data: dreams = [], isLoading: dreamsLoading } = useQuery<SelectDreamEntry[]>({
    queryKey: ['/api/auth/dreams'],
    enabled: isAuthenticated,
  });

  const { data: usage } = useQuery<{ used: number; limit: number; remaining: number }>({
    queryKey: ['/api/auth/dreams/usage'],
    enabled: isAuthenticated,
  });

  const createDreamMutation = useMutation({
    mutationFn: async (data: { date: string; title: string; content: string; mood: string | null }) => {
      const res = await apiRequest('POST', '/api/auth/dreams', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/dreams'] });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/dreams/usage'] });
      setTitle("");
      setContent("");
      setSelectedMood(null);
      setDate(format(new Date(), "yyyy-MM-dd"));
      setShowForm(false);
      toast({ title: "Dream recorded", description: "Your dream has been saved" });
    },
    onError: (error: any) => {
      if (error?.message?.includes("limit")) {
        toast({ title: "Daily limit reached", description: "You've used all your dream entries for today", variant: "destructive" });
      } else {
        toast({ title: "Error", description: "Failed to save dream", variant: "destructive" });
      }
    },
  });

  const interpretMutation = useMutation({
    mutationFn: async (dreamId: string) => {
      const res = await apiRequest('POST', `/api/auth/dreams/${dreamId}/interpret`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/dreams'] });
      toast({ title: "Interpretation complete", description: "Your dream has been interpreted" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to interpret dream", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (dreamId: string) => {
      const res = await apiRequest('DELETE', `/api/auth/dreams/${dreamId}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/dreams'] });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/dreams/usage'] });
      toast({ title: "Dream deleted", description: "Your dream entry has been removed" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete dream", variant: "destructive" });
    },
  });

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    
    createDreamMutation.mutate({
      date,
      title: title.trim(),
      content: content.trim(),
      mood: selectedMood,
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div 
        className="min-h-screen transition-colors duration-500"
        style={{ background: colors.gradientStyle }}
      >
        <div className={`${colors.overlay} min-h-screen transition-colors duration-500`}>
          <div className="max-w-2xl mx-auto px-4 py-8">
            <Card className={`p-8 ${colors.cardBorder} text-center`}>
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-cyan-500" />
              <h2 className="font-serif text-2xl mb-4" style={{ color: colors.textPrimary }}>
                Sign In Required
              </h2>
              <p className="mb-6" style={{ color: colors.textSecondary }}>
                Dream Journal requires an account to save your dreams across devices.
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
      className="min-h-screen transition-colors duration-500"
      style={{ background: colors.gradientStyle }}
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
            
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: 'radial-gradient(circle at 30% 20%, #22d3ee 0%, #06b6d4 60%, #0e7490 100%)'
                  }}
                >
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 
                      className="font-serif text-2xl md:text-3xl font-light"
                      style={{ color: colors.textPrimary }}
                      data-testid="text-dream-journal-title"
                    >
                      Dream Journal
                    </h1>
                    <Badge variant="secondary" className="text-xs">Beta</Badge>
                  </div>
                  <p style={{ color: colors.textMuted }}>Record and interpret your dreams</p>
                </div>
              </div>
              {usage && (
                <Badge variant="outline" className="text-xs">
                  {usage.remaining}/{usage.limit} today
                </Badge>
              )}
            </div>
          </motion.div>

          <div className="space-y-6">
            {/* Collapsible Info Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <Card className={colors.cardBorder}>
                <Accordion type="single" collapsible>
                  <AccordionItem value="why-dream-journaling" className="border-none">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline" style={{ color: colors.textPrimary }} data-testid="accordion-why-dream-journaling">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4" />
                        <span className="font-medium">Why Dream Journaling Helps</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
                      <p className="mb-3">
                        Dream journaling strengthens intuition, improves dream recall, and reveals messages your subconscious sends each night. Recording dreams upon waking makes patterns, symbols, and emotions easier to notice over time.
                      </p>
                      <p className="font-medium mb-2" style={{ color: colors.textPrimary }}>How to Use:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Write as soon as you wake up</li>
                        <li>Include symbols, sensations, people, colors, and emotional tone</li>
                        <li>There is no right or wrong way — simply record whatever you remember</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {!showForm ? (
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => setShowForm(true)}
                  disabled={usage?.remaining === 0}
                  data-testid="button-new-dream"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Record New Dream
                </Button>
              ) : (
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
                      Record Your Dream
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowForm(false)}
                      data-testid="button-cancel-dream"
                    >
                      Cancel
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="dreamDate" style={{ color: colors.textSecondary }}>Date</Label>
                      <Input
                        id="dreamDate"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="mt-1"
                        data-testid="input-dream-date"
                      />
                    </div>

                    <div>
                      <Label htmlFor="dreamTitle" style={{ color: colors.textSecondary }}>Title</Label>
                      <Input
                        id="dreamTitle"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Give your dream a title..."
                        className="mt-1"
                        data-testid="input-dream-title"
                      />
                    </div>

                    <div>
                      <Label htmlFor="dreamContent" style={{ color: colors.textSecondary }}>Description</Label>
                      <Textarea
                        id="dreamContent"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Describe your dream in as much detail as you can remember..."
                        className="min-h-[150px] mt-1"
                        data-testid="input-dream-content"
                      />
                    </div>

                    <div>
                      <Label style={{ color: colors.textSecondary }}>How did it feel?</Label>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {dreamMoods.map((mood) => {
                          const Icon = mood.icon;
                          const isSelected = selectedMood === mood.value;
                          return (
                            <button
                              key={mood.value}
                              type="button"
                              onClick={() => setSelectedMood(isSelected ? null : mood.value)}
                              className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                                isSelected ? 'ring-2 ring-offset-2' : ''
                              }`}
                              style={{
                                background: isSelected 
                                  ? `linear-gradient(135deg, ${mood.color.split(' ')[0].replace('from-', '')} 0%, ${mood.color.split(' ')[1].replace('to-', '')} 100%)`
                                  : colors.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                                color: isSelected ? 'white' : colors.textSecondary,
                              }}
                              data-testid={`button-mood-${mood.value}`}
                            >
                              <Icon className="w-5 h-5" />
                              <span className="text-xs">{mood.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      onClick={handleSubmit}
                      disabled={!title.trim() || !content.trim() || createDreamMutation.isPending}
                      data-testid="button-save-dream"
                    >
                      {createDreamMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-4 h-4 mr-2" />
                          Save Dream
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              )}
            </motion.div>

            {dreamsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: colors.textMuted }} />
              </div>
            ) : dreams.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card 
                  className={`p-8 text-center ${colors.cardBorder}`}
                  style={{
                    background: colors.isDark 
                      ? 'linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 27, 75, 0.9) 40%, rgba(49, 46, 129, 0.8) 100%)'
                      : 'linear-gradient(180deg, #f7fbff 0%, #fdf8ff 40%, #f8f5ff 100%)'
                  }}
                >
                  <Moon className="w-12 h-12 mx-auto mb-4" style={{ color: colors.textMuted }} />
                  <h3 className="font-sans font-semibold mb-2" style={{ color: colors.textPrimary }}>
                    No Dreams Recorded Yet
                  </h3>
                  <p style={{ color: colors.textMuted }}>
                    Start recording your dreams to unlock AI-powered interpretations
                  </p>
                </Card>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <h3 className="font-sans font-semibold" style={{ color: colors.textPrimary }}>
                  Recent Dreams ({dreams.length})
                </h3>
                {dreams.map((dream, index) => {
                  const moodInfo = dreamMoods.find(m => m.value === dream.mood);
                  const MoodIcon = moodInfo?.icon || Moon;
                  const isExpanded = expandedDream === dream.id;
                  
                  return (
                    <motion.div
                      key={dream.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card 
                        className={`${colors.cardBorder} overflow-hidden`}
                        style={{
                          background: colors.isDark 
                            ? 'linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 27, 75, 0.9) 40%, rgba(49, 46, 129, 0.8) 100%)'
                            : 'linear-gradient(180deg, #f7fbff 0%, #fdf8ff 40%, #f8f5ff 100%)'
                        }}
                      >
                        <button
                          className="w-full p-4 text-left flex items-start gap-3"
                          onClick={() => setExpandedDream(isExpanded ? null : dream.id)}
                          data-testid={`button-expand-dream-${dream.id}`}
                        >
                          <div 
                            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${moodInfo ? `bg-gradient-to-br ${moodInfo.color}` : ''}`}
                            style={!moodInfo ? { background: colors.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' } : {}}
                          >
                            <MoodIcon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium truncate" style={{ color: colors.isDark ? '#F5F3FF' : colors.textPrimary }}>
                                {dream.title}
                              </h4>
                              {dream.aiInsight && (
                                <Badge 
                                  variant="secondary" 
                                  className={`text-xs shrink-0 ${colors.isDark ? 'bg-purple-500/30 text-purple-200' : 'bg-purple-100 text-purple-700'}`}
                                >
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  Interpreted
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm" style={{ color: colors.isDark ? '#C4B5FD' : colors.textMuted }}>
                              {format(new Date(dream.date), "MMM d, yyyy")}
                              {moodInfo && ` - ${moodInfo.label}`}
                            </p>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 shrink-0" style={{ color: colors.isDark ? '#A5B4FC' : colors.textMuted }} />
                          ) : (
                            <ChevronDown className="w-5 h-5 shrink-0" style={{ color: colors.isDark ? '#A5B4FC' : colors.textMuted }} />
                          )}
                        </button>
                        
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="px-4 pb-4 space-y-4"
                          >
                            <div className="pl-13">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="text-sm font-medium" style={{ color: colors.isDark ? '#C4B5FD' : colors.textSecondary }}>
                                  Dream Description
                                </h5>
                                <TextToSpeechButton
                                  text={dream.content}
                                  element={element}
                                  testId={`button-tts-dream-${dream.id}`}
                                />
                              </div>
                              <p className="text-sm leading-relaxed" style={{ color: colors.isDark ? '#F5F3FF' : colors.textPrimary }}>
                                {dream.content}
                              </p>
                            </div>
                            
                            {dream.aiInsight ? (
                              <div 
                                className="p-4 rounded-xl"
                                style={{
                                  background: colors.isDark 
                                    ? 'rgba(139, 92, 246, 0.25)'
                                    : 'rgba(139, 92, 246, 0.1)'
                                }}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-purple-300" />
                                    <h5 className="text-sm font-medium" style={{ color: colors.isDark ? '#E9D5FF' : colors.textPrimary }}>
                                      AI Interpretation
                                    </h5>
                                  </div>
                                  <TextToSpeechButton
                                    text={dream.aiInsight}
                                    element={element}
                                    testId={`button-tts-interpretation-${dream.id}`}
                                  />
                                </div>
                                <p className="text-sm leading-relaxed" style={{ color: colors.isDark ? '#DDD6FE' : colors.textSecondary }}>
                                  {dream.aiInsight}
                                </p>
                              </div>
                            ) : (
                              <Button
                                className="w-full bg-gradient-to-r from-purple-500 to-violet-600 text-white border-0 font-medium shadow-lg"
                                onClick={() => interpretMutation.mutate(dream.id)}
                                disabled={interpretMutation.isPending}
                                data-testid={`button-interpret-dream-${dream.id}`}
                              >
                                {interpretMutation.isPending ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Interpreting...
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Get AI Interpretation
                                  </>
                                )}
                              </Button>
                            )}
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              className={colors.isDark ? "text-red-400 hover:text-red-300" : "text-red-500 hover:text-red-600"}
                              onClick={() => deleteMutation.mutate(dream.id)}
                              disabled={deleteMutation.isPending}
                              data-testid={`button-delete-dream-${dream.id}`}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Dream
                            </Button>
                          </motion.div>
                        )}
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="h-32" />
        </div>
      </div>
    </div>
  );
}
