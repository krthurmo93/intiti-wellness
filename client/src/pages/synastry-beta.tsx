import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ArrowLeft, Heart, Sparkles, User, Users, Sun, Moon, Sunrise, MessageCircle, Zap, Stars, ChevronDown, ChevronUp } from "lucide-react";
import { useElementTheme } from "@/lib/element-theme";
import { getUserProfile, getSpiritualStyle, canAccessGoldenDawn } from "@/lib/storage";
import { isGoldenDawnActive } from "@/lib/golden-dawn-styles";
import { CityAutocomplete } from "@/components/CityAutocomplete";
import { fetchBirthChart, type FullBirthChart } from "@/lib/astrology";
import { elementMapping, spiritualStyleLabels, type ZodiacSign, type Element, type SpiritualStyle } from "@shared/schema";
import { getVenusArchetype, generateVenusSynastryReport, type VenusSynastryReport } from "@/lib/interpretations";

function getSunSignFromDate(dateStr: string): ZodiacSign {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  return "Pisces";
}

function getElementCompatibility(el1: Element, el2: Element): "harmonious" | "challenging" {
  const harmonious: Record<Element, Element[]> = {
    fire: ["fire", "air"],
    earth: ["earth", "water"],
    air: ["air", "fire"],
    water: ["water", "earth"],
    cosmic: ["cosmic", "fire", "water", "air", "earth"],
    golden_dawn: ["golden_dawn", "fire", "water", "air", "earth"],
  };
  if (harmonious[el1]?.includes(el2)) return "harmonious";
  if (el1 === el2) return "harmonious";
  return "challenging";
}

interface SynastryConnection {
  planet: string;
  yourSign: ZodiacSign;
  theirSign: ZodiacSign;
  yourElement: Element;
  theirElement: Element;
  compatibility: "harmonious" | "challenging";
  interpretation: string;
  icon: typeof Sun;
}

const synastryInterpretations = {
  sun: {
    harmonious: (s1: ZodiacSign, s2: ZodiacSign) => 
      `Your ${s1} Core Self and their ${s2} Core Self share a natural understanding. Your essential energies complement each other, making it easy to support each other's growth and purpose.`,
    challenging: (s1: ZodiacSign, s2: ZodiacSign) => 
      `Your ${s1} Core Self and their ${s2} Core Self create dynamic tension. While this can spark growth, you may need to consciously appreciate your different approaches to life and self-expression.`,
  },
  moon: {
    harmonious: (s1: ZodiacSign, s2: ZodiacSign) => 
      `Your ${s1} Emotional Landscape and their ${s2} Emotional Landscape create deep resonance. You intuitively understand each other's needs and can provide genuine comfort and nurturing.`,
    challenging: (s1: ZodiacSign, s2: ZodiacSign) => 
      `Your ${s1} Emotional Landscape and their ${s2} Emotional Landscape process feelings differently. Building emotional bridges requires patience and learning to speak each other's heart language.`,
  },
  rising: {
    harmonious: (s1: ZodiacSign, s2: ZodiacSign) => 
      `Your ${s1} Outer Expression and their ${s2} Outer Expression approach life similarly. First impressions flow naturally, and you likely feel comfortable in each other's presence from the start.`,
    challenging: (s1: ZodiacSign, s2: ZodiacSign) => 
      `Your ${s1} Outer Expression and their ${s2} Outer Expression present differently to the world. This can bring fascinating variety to your partnership, though initial impressions may require adjustment.`,
  },
  venus: {
    harmonious: (s1: ZodiacSign, s2: ZodiacSign) => 
      `Your ${s1} love nature and their ${s2} love nature share deep language fluency. Romance, affection, and appreciation flow easily between you, creating natural attraction.`,
    challenging: (s1: ZodiacSign, s2: ZodiacSign) => 
      `Your ${s1} love nature and their ${s2} love nature express affection differently. Learning to give and receive in each other's style deepens intimacy over time.`,
  },
  mercury: {
    harmonious: (s1: ZodiacSign, s2: ZodiacSign) => 
      `Your ${s1} communication style and their ${s2} communication style flow effortlessly. Conversations are natural, and you find it easy to understand each other's thoughts and ideas.`,
    challenging: (s1: ZodiacSign, s2: ZodiacSign) => 
      `Your ${s1} communication style and their ${s2} communication style differ. Taking time to listen fully before responding prevents misunderstandings.`,
  },
  mars: {
    harmonious: (s1: ZodiacSign, s2: ZodiacSign) => 
      `Your ${s1} drive energy and their ${s2} drive energy share compatible passion. You motivate each other and handle challenges constructively, channeling energy productively together.`,
    challenging: (s1: ZodiacSign, s2: ZodiacSign) => 
      `Your ${s1} drive energy and their ${s2} drive energy may clash in how you pursue goals or handle challenges. Understanding each other's triggers helps transform friction into passion.`,
  },
};

function generateDetailedSynastry(
  yourProfile: { sunSign?: ZodiacSign; moonSign?: ZodiacSign; risingSign?: ZodiacSign; mercurySign?: ZodiacSign; venusSign?: ZodiacSign; marsSign?: ZodiacSign },
  partnerChart: FullBirthChart
): SynastryConnection[] {
  const connections: SynastryConnection[] = [];
  
  const partnerSun = partnerChart.sun;
  const partnerMoon = partnerChart.moon !== partnerChart.sun ? partnerChart.moon : partnerChart.moon;
  const partnerRising = partnerChart.rising !== partnerChart.sun ? partnerChart.rising : null;
  const partnerVenus = partnerChart.venus;
  const partnerMercury = partnerChart.mercury;
  const partnerMars = partnerChart.mars;
  
  if (yourProfile.sunSign) {
    const yourEl = elementMapping[yourProfile.sunSign];
    const theirEl = elementMapping[partnerSun];
    const compat = getElementCompatibility(yourEl, theirEl);
    connections.push({
      planet: "Shared Energy Theme",
      yourSign: yourProfile.sunSign,
      theirSign: partnerSun,
      yourElement: yourEl,
      theirElement: theirEl,
      compatibility: compat,
      interpretation: synastryInterpretations.sun[compat](yourProfile.sunSign, partnerSun),
      icon: Sun,
    });
  }
  
  if (yourProfile.moonSign) {
    const yourEl = elementMapping[yourProfile.moonSign];
    const theirEl = elementMapping[partnerMoon];
    const compat = getElementCompatibility(yourEl, theirEl);
    connections.push({
      planet: "Emotional Compatibility",
      yourSign: yourProfile.moonSign,
      theirSign: partnerMoon,
      yourElement: yourEl,
      theirElement: theirEl,
      compatibility: compat,
      interpretation: synastryInterpretations.moon[compat](yourProfile.moonSign, partnerMoon),
      icon: Moon,
    });
  }
  
  if (yourProfile.risingSign && partnerRising && partnerRising !== partnerSun) {
    const yourEl = elementMapping[yourProfile.risingSign];
    const theirEl = elementMapping[partnerRising];
    const compat = getElementCompatibility(yourEl, theirEl);
    connections.push({
      planet: "First Impression Energy",
      yourSign: yourProfile.risingSign,
      theirSign: partnerRising,
      yourElement: yourEl,
      theirElement: theirEl,
      compatibility: compat,
      interpretation: synastryInterpretations.rising[compat](yourProfile.risingSign, partnerRising),
      icon: Sunrise,
    });
  }
  
  if (yourProfile.venusSign && partnerVenus) {
    const yourEl = elementMapping[yourProfile.venusSign];
    const theirEl = elementMapping[partnerVenus];
    const compat = getElementCompatibility(yourEl, theirEl);
    connections.push({
      planet: "Love Language Resonance",
      yourSign: yourProfile.venusSign,
      theirSign: partnerVenus,
      yourElement: yourEl,
      theirElement: theirEl,
      compatibility: compat,
      interpretation: synastryInterpretations.venus[compat](yourProfile.venusSign, partnerVenus),
      icon: Heart,
    });
  }
  
  if (yourProfile.mercurySign && partnerMercury) {
    const yourEl = elementMapping[yourProfile.mercurySign];
    const theirEl = elementMapping[partnerMercury];
    const compat = getElementCompatibility(yourEl, theirEl);
    connections.push({
      planet: "Communication Flow",
      yourSign: yourProfile.mercurySign,
      theirSign: partnerMercury,
      yourElement: yourEl,
      theirElement: theirEl,
      compatibility: compat,
      interpretation: synastryInterpretations.mercury[compat](yourProfile.mercurySign, partnerMercury),
      icon: MessageCircle,
    });
  }
  
  if (yourProfile.marsSign && partnerMars) {
    const yourEl = elementMapping[yourProfile.marsSign];
    const theirEl = elementMapping[partnerMars];
    const compat = getElementCompatibility(yourEl, theirEl);
    connections.push({
      planet: "Growth Lessons",
      yourSign: yourProfile.marsSign,
      theirSign: partnerMars,
      yourElement: yourEl,
      theirElement: theirEl,
      compatibility: compat,
      interpretation: synastryInterpretations.mars[compat](yourProfile.marsSign, partnerMars),
      icon: Zap,
    });
  }
  
  return connections;
}

function generateOverallInsight(connections: SynastryConnection[], style: SpiritualStyle): string {
  const harmoniousCount = connections.filter(c => c.compatibility === "harmonious").length;
  const total = connections.length;
  
  let partialDataNote = "";
  if (total <= 3) {
    partialDataNote = " (Based on Core Self and Emotional Landscape energies. Add birth time for deeper Outer Expression insights.)";
  }
  
  if (style === "archetype") {
    if (harmoniousCount >= total * 0.7) {
      return "Your archetypal patterns reveal a soul contract of harmony. The Healer and Visionary archetypes within you recognize each other, creating space for mutual flourishing and deep understanding. This connection carries the signature of destined meeting." + partialDataNote;
    } else if (harmoniousCount >= total * 0.4) {
      return "Your archetypal dance weaves between harmony and shadow work. You mirror each other's gifts while illuminating hidden wounds ready for healing. This partnership archetype often brings the most profound transformation." + partialDataNote;
    } else {
      return "Your archetypes present as sacred teachers for one another. Where shadow meets shadow, there lies the gold of transformation. These challenging patterns often forge the strongest bonds through conscious growth work." + partialDataNote;
    }
  } else if (style === "energy") {
    if (harmoniousCount >= total * 0.7) {
      return "Your energy fields resonate at compatible frequencies. You naturally regulate each other's nervous systems, creating a sense of safety and ease. This energetic compatibility supports co-regulation and emotional attunement." + partialDataNote;
    } else if (harmoniousCount >= total * 0.4) {
      return "Your energy patterns create a dynamic exchange of activation and settling. Some areas flow effortlessly while others require conscious energetic boundaries. This balance invites growth through intentional presence." + partialDataNote;
    } else {
      return "Your energy signatures create significant activation for growth. Where there's friction, there's opportunity to develop new capacities for holding complexity. Grounding practices will support this energetically rich connection." + partialDataNote;
    }
  } else {
    if (harmoniousCount >= total * 0.7) {
      return "The celestial alignments between you reveal a cosmic choreography of ease. The stars have woven your paths together with threads of natural understanding and mutual support. This connection carries the blessing of celestial harmony." + partialDataNote;
    } else if (harmoniousCount >= total * 0.4) {
      return "Your cosmic signatures blend celestial harmony with evolutionary tension. The universe brings you together as mirrors and teachers, where starlight illuminates both gifts and growing edges." + partialDataNote;
    } else {
      return "Your celestial patterns suggest a karmic contract of profound learning. Where cosmic friction exists, the universe is offering accelerated soul growth. These connections often carry the deepest spiritual lessons." + partialDataNote;
    }
  }
}

export default function SynastryBeta() {
  const [, setLocation] = useLocation();
  const { colors, element } = useElementTheme();
  const profile = getUserProfile();
  const spiritualStyle = getSpiritualStyle();

  const [partnerName, setPartnerName] = useState("");
  const [partnerBirthDate, setPartnerBirthDate] = useState("");
  const [partnerBirthTime, setPartnerBirthTime] = useState("");
  const [partnerBirthCity, setPartnerBirthCity] = useState("");
  const [useTestPartner, setUseTestPartner] = useState(false);
  const [overallInsight, setOverallInsight] = useState<string | null>(null);
  const [synastryConnections, setSynastryConnections] = useState<SynastryConnection[]>([]);
  const [venusSynastryReport, setVenusSynastryReport] = useState<VenusSynastryReport | null>(null);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  // All features are now free and accessible - no beta check needed

  const handleGenerateInsight = async () => {
    setIsGenerating(true);
    setVenusSynastryReport(null);
    setOpenSections({});
    
    try {
      const birthDate = useTestPartner ? "1995-06-15" : partnerBirthDate;
      const birthTime = useTestPartner ? "14:30" : (partnerBirthTime || "12:00");
      const birthCity = useTestPartner ? "Los Angeles, CA, USA" : (partnerBirthCity || "New York, NY, USA");
      
      const partnerChart = await fetchBirthChart(birthDate, birthTime, birthCity);
      
      const connections = generateDetailedSynastry(
        {
          sunSign: profile?.sunSign as ZodiacSign | undefined,
          moonSign: profile?.moonSign as ZodiacSign | undefined,
          risingSign: profile?.risingSign as ZodiacSign | undefined,
          mercurySign: profile?.mercurySign as ZodiacSign | undefined,
          venusSign: profile?.venusSign as ZodiacSign | undefined,
          marsSign: profile?.marsSign as ZodiacSign | undefined,
        },
        partnerChart
      );
      
      setSynastryConnections(connections);
      setOverallInsight(generateOverallInsight(connections, spiritualStyle));
      
      // Generate Venus synastry report if both have Venus signs
      if (profile?.venusSign && partnerChart.venus) {
        const yourVenus = getVenusArchetype(profile.venusSign as ZodiacSign);
        const theirVenus = getVenusArchetype(partnerChart.venus);
        const yourName = profile?.name || "You";
        const theirName = useTestPartner ? "Test Partner" : (partnerName || "Your Partner");
        const report = generateVenusSynastryReport(yourVenus, theirVenus, yourName, theirName);
        setVenusSynastryReport(report);
      }
    } catch (error) {
      console.error("Error generating synastry:", error);
      const partnerSunSign = getSunSignFromDate(useTestPartner ? "1995-06-15" : partnerBirthDate);
      const fallbackChart: FullBirthChart = {
        sun: partnerSunSign,
        moon: partnerSunSign,
        rising: partnerSunSign,
      };
      const connections = generateDetailedSynastry(
        {
          sunSign: profile?.sunSign as ZodiacSign | undefined,
          moonSign: profile?.moonSign as ZodiacSign | undefined,
        },
        fallbackChart
      );
      setSynastryConnections(connections);
      setOverallInsight("Based on Core Self energy only. For deeper analysis, please try again or verify the birth details." + (connections.length > 0 ? " " + generateOverallInsight(connections, spiritualStyle) : ""));
    } finally {
      setIsGenerating(false);
    }
  };
  
  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const handleUseTestPartner = () => {
    setUseTestPartner(true);
    setPartnerName("Test Partner");
    setPartnerBirthDate("1995-06-15");
    setPartnerBirthTime("14:30");
    setPartnerBirthCity("Los Angeles");
  };

  const canGenerate = useTestPartner || (partnerName && partnerBirthDate);

  const isGoldenDawn = isGoldenDawnActive(element);

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
                  background: 'radial-gradient(circle at 30% 20%, #f472b6 0%, #ec4899 60%, #be185d 100%)'
                }}
              >
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 
                    className="font-serif text-2xl md:text-3xl font-light"
                    style={{ color: colors.textPrimary }}
                    data-testid="text-synastry-title"
                  >
                    Connection Energy Reading
                  </h1>
                  <Badge variant="secondary" className="text-xs">Beta</Badge>
                  <span 
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: colors.isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)',
                      color: colors.isDark ? '#c4b5fd' : '#7c3aed',
                      border: `1px solid ${colors.isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'}`
                    }}
                  >
                    {spiritualStyle === "archetype" && <Sparkles className="w-3 h-3" />}
                    {spiritualStyle === "energy" && <Zap className="w-3 h-3" />}
                    {spiritualStyle === "cosmic" && <Stars className="w-3 h-3" />}
                    {spiritualStyleLabels[spiritualStyle]}
                  </span>
                </div>
                <p style={{ color: colors.textMuted }}>
                  {spiritualStyle === "archetype" && "Explore archetypal patterns in your connection"}
                  {spiritualStyle === "energy" && "Explore energetic dynamics in your connection"}
                  {spiritualStyle === "cosmic" && "Explore the celestial bond between souls"}
                </p>
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
                <div className="flex items-center gap-3 mb-4">
                  <User className="w-5 h-5" style={{ color: colors.textSecondary }} />
                  <h3 className="font-sans font-semibold" style={{ color: colors.textPrimary }}>Your Energy Profile</h3>
                </div>
                
                {profile?.hasAstrologyProfile ? (
                  <div className="space-y-2 pl-8">
                    <p style={{ color: colors.textSecondary }}>
                      <span className="font-medium">Name:</span> {profile.name}
                    </p>
                    <p style={{ color: colors.textSecondary }}>
                      <span className="font-medium">Birth Date:</span> {profile.dateOfBirth}
                    </p>
                    <p style={{ color: colors.textSecondary }}>
                      <span className="font-medium">Core Self:</span> {profile.sunSign}
                    </p>
                    <p style={{ color: colors.textSecondary }}>
                      <span className="font-medium">Emotional Landscape:</span> {profile.moonSign}
                    </p>
                    <p style={{ color: colors.textSecondary }}>
                      <span className="font-medium">Outer Expression:</span> {profile.risingSign || "Add birth time"}
                    </p>
                  </div>
                ) : (
                  <p className="pl-8 text-sm" style={{ color: colors.textMuted }}>
                    No energy profile saved. Please complete your blueprint in Settings.
                  </p>
                )}
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
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5" style={{ color: colors.textSecondary }} />
                    <h3 className="font-sans font-semibold" style={{ color: colors.textPrimary }}>Their Energy Profile</h3>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUseTestPartner}
                    data-testid="button-use-test-partner"
                  >
                    Use Test Partner
                  </Button>
                </div>
                
                <div className="space-y-4 pl-8">
                  <div>
                    <Label htmlFor="partnerName" style={{ color: colors.textSecondary }}>Name</Label>
                    <Input
                      id="partnerName"
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                      placeholder="Partner's name"
                      className="mt-1"
                      data-testid="input-partner-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="partnerBirthDate" style={{ color: colors.textSecondary }}>Birth Date</Label>
                    <Input
                      id="partnerBirthDate"
                      type="date"
                      value={partnerBirthDate}
                      onChange={(e) => setPartnerBirthDate(e.target.value)}
                      className="mt-1"
                      data-testid="input-partner-birthdate"
                    />
                  </div>
                  <div>
                    <Label htmlFor="partnerBirthTime" style={{ color: colors.textSecondary }}>Birth Time (optional)</Label>
                    <Input
                      id="partnerBirthTime"
                      type="time"
                      value={partnerBirthTime}
                      onChange={(e) => setPartnerBirthTime(e.target.value)}
                      className="mt-1"
                      data-testid="input-partner-birthtime"
                    />
                  </div>
                  <div>
                    <Label htmlFor="partnerBirthCity" style={{ color: colors.textSecondary }}>Birth City (optional)</Label>
                    <CityAutocomplete
                      value={partnerBirthCity}
                      onChange={setPartnerBirthCity}
                      placeholder="City of birth"
                      className={`mt-1 pl-10 h-auto py-3 ${colors.isDark ? 'bg-slate-900/50 border-violet-500/30 text-white placeholder:text-violet-300/50' : 'bg-white border-stone-200'}`}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button
                className="w-full"
                size="lg"
                onClick={handleGenerateInsight}
                disabled={!canGenerate || isGenerating}
                data-testid="button-generate-insight"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                    Analyzing Cosmic Connection...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Connection Insight
                  </>
                )}
              </Button>
            </motion.div>

            {overallInsight && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <Card 
                  className={`p-6 md:p-8 ${colors.cardBorder}`}
                  style={{
                    background: colors.isDark 
                      ? 'linear-gradient(180deg, rgba(30, 27, 75, 0.9) 0%, rgba(49, 46, 129, 0.9) 50%, rgba(88, 28, 135, 0.8) 100%)'
                      : 'linear-gradient(180deg, #fdf4ff 0%, #fae8ff 50%, #f5d0fe 100%)'
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Heart className="w-5 h-5 text-pink-500" />
                    <h3 className="font-sans font-semibold" style={{ color: colors.textPrimary }}>Connection Summary</h3>
                  </div>
                  <p 
                    className="font-serif text-lg leading-relaxed"
                    style={{ color: colors.textSecondary }}
                    data-testid="text-insight-result"
                  >
                    {overallInsight}
                  </p>
                </Card>

                {/* Heart To Heart — Venus Connection Report */}
                {venusSynastryReport ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <Card 
                      className={`p-6 md:p-8 ${colors.cardBorder}`}
                      style={{
                        background: colors.isDark 
                          ? 'linear-gradient(180deg, rgba(88, 28, 135, 0.4) 0%, rgba(157, 23, 77, 0.3) 50%, rgba(30, 27, 75, 0.9) 100%)'
                          : 'linear-gradient(180deg, #fdf4ff 0%, #fce7f3 50%, #fff1f2 100%)'
                      }}
                      data-testid="card-venus-synastry"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{
                            background: 'radial-gradient(circle at 30% 20%, #f472b6 0%, #ec4899 60%, #be185d 100%)'
                          }}
                        >
                          <Heart className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-sans font-semibold text-lg" style={{ color: colors.textPrimary }}>
                            Heart To Heart
                          </h3>
                          <p className="text-sm" style={{ color: colors.textMuted }}>
                            Venus Connection
                          </p>
                        </div>
                      </div>
                      
                      <p 
                        className="text-sm mb-4 pl-[52px]"
                        style={{ color: colors.textSecondary }}
                      >
                        {venusSynastryReport.partnerAArchetype.name} and {venusSynastryReport.partnerBArchetype.name}
                      </p>
                      
                      <div className="space-y-3">
                        {venusSynastryReport.sections.map((section) => (
                          <Collapsible 
                            key={section.id}
                            open={openSections[section.id]}
                            onOpenChange={() => toggleSection(section.id)}
                          >
                            <CollapsibleTrigger asChild>
                              <button
                                className="w-full flex items-center justify-between p-3 rounded-lg transition-colors hover-elevate"
                                style={{
                                  background: colors.isDark 
                                    ? 'rgba(139, 92, 246, 0.1)'
                                    : 'rgba(139, 92, 246, 0.05)',
                                  border: `1px solid ${colors.isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)'}`
                                }}
                                data-testid={`button-toggle-${section.id}`}
                              >
                                <span className="font-medium text-sm" style={{ color: colors.textPrimary }}>
                                  {section.title}
                                </span>
                                {openSections[section.id] ? (
                                  <ChevronUp className="w-4 h-4" style={{ color: colors.textMuted }} />
                                ) : (
                                  <ChevronDown className="w-4 h-4" style={{ color: colors.textMuted }} />
                                )}
                              </button>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <AnimatePresence>
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="px-3 py-4"
                                >
                                  <p 
                                    className="text-sm leading-relaxed"
                                    style={{ color: colors.textSecondary }}
                                  >
                                    {section.body}
                                  </p>
                                </motion.div>
                              </AnimatePresence>
                            </CollapsibleContent>
                          </Collapsible>
                        ))}
                      </div>
                      
                      <div 
                        className="mt-4 pt-4 border-t"
                        style={{ borderColor: colors.isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)' }}
                      >
                        <p 
                          className="text-xs italic text-center"
                          style={{ color: colors.textMuted }}
                        >
                          {venusSynastryReport.disclaimer}
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                ) : (
                  profile?.venusSign && !venusSynastryReport && synastryConnections.length > 0 && (
                    <Card 
                      className={`p-4 ${colors.cardBorder}`}
                      style={{
                        background: colors.isDark 
                          ? 'rgba(30, 27, 75, 0.6)'
                          : 'rgba(248, 245, 255, 0.8)'
                      }}
                    >
                      <p className="text-sm text-center" style={{ color: colors.textMuted }}>
                        We could not read one of the Venus placements. Add or update both birth dates to see your Heart To Heart insight.
                      </p>
                    </Card>
                  )
                )}

                {synastryConnections.map((connection, index) => {
                  const Icon = connection.icon;
                  return (
                    <motion.div
                      key={connection.planet}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card 
                        className={`p-5 md:p-6 ${colors.cardBorder}`}
                        style={{
                          background: colors.isDark 
                            ? 'linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 27, 75, 0.9) 100%)'
                            : 'linear-gradient(180deg, #f7fbff 0%, #fdf8ff 100%)'
                        }}
                      >
                        <div className="flex items-start gap-4">
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{
                              background: connection.compatibility === "harmonious"
                                ? 'radial-gradient(circle at 30% 20%, #34d399 0%, #10b981 60%, #047857 100%)'
                                : 'radial-gradient(circle at 30% 20%, #f472b6 0%, #ec4899 60%, #be185d 100%)'
                            }}
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h4 className="font-sans font-semibold" style={{ color: colors.textPrimary }}>
                                {connection.planet}
                              </h4>
                              <Badge 
                                variant="secondary" 
                                className={`text-xs ${
                                  connection.compatibility === "harmonious" 
                                    ? "bg-emerald-500/20 text-emerald-400" 
                                    : "bg-pink-500/20 text-pink-400"
                                }`}
                              >
                                {connection.compatibility === "harmonious" ? "Harmonious" : "Growth Edge"}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <span 
                                className="text-sm px-2 py-1 rounded-full"
                                style={{ 
                                  backgroundColor: colors.isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)',
                                  color: colors.isDark ? '#c084fc' : '#7c3aed'
                                }}
                              >
                                Your {connection.yourSign}
                              </span>
                              <span 
                                className="text-sm px-2 py-1 rounded-full"
                                style={{ 
                                  backgroundColor: colors.isDark ? 'rgba(236, 72, 153, 0.2)' : 'rgba(236, 72, 153, 0.1)',
                                  color: colors.isDark ? '#f472b6' : '#db2777'
                                }}
                              >
                                Their {connection.theirSign}
                              </span>
                            </div>
                            <p 
                              className="text-sm leading-relaxed"
                              style={{ color: colors.textSecondary }}
                            >
                              {connection.interpretation}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
