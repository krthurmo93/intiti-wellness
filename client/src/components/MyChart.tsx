import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Sun, Moon, Sunrise, Flame, Droplets, Wind, Mountain, Sparkles, Plus, Crown, MessageCircle, Heart, Zap, Stars, Target, Compass, ArrowUp, ArrowDown, ChevronDown, ChevronUp } from "lucide-react";
import { getUserProfile, getSpiritualStyle } from "@/lib/storage";
import { signDescriptions, elementMapping, planetDescriptions, spiritualStyleLabels } from "@shared/schema";
import type { Element, ZodiacSign, SpiritualStyle } from "@shared/schema";
import { Link } from "wouter";
import { useElementTheme } from "@/lib/element-theme";
import { isGoldenDawnActive, getGoldenDawnCardStyle, getGoldenDawnCardClasses, getGoldenDawnTextColors } from "@/lib/golden-dawn-styles";
import { GoldenDawnTheme } from "@/lib/golden-dawn-theme";
import { 
  coreIdentityInterpretations, 
  emotionalLandscapeInterpretations, 
  auraExpressionInterpretations,
  heartArchetypeInterpretations,
  mentalArchetypeInterpretations,
  driveArchetypeInterpretations,
  expansionArchetypeInterpretations,
  masteryArchetypeInterpretations,
  soulDirectionInterpretations,
  soulMemoryInterpretations,
  getReleaseRiseArc,
  getVenusArchetype,
  type ArchetypeInterpretation, 
  type EnergyInterpretation, 
  type CosmicInterpretation,
  type VenusEnergyInterpretation,
  type MercuryEnergyInterpretation,
  type MarsEnergyInterpretation,
  type JupiterInterpretation,
  type SaturnInterpretation,
  type NorthNodeInterpretation,
  type SouthNodeInterpretation,
  type ReleaseRiseArc
} from "@/lib/interpretations";

const elementIcons: Record<Element, typeof Flame> = {
  fire: Flame,
  water: Droplets,
  air: Wind,
  earth: Mountain,
  cosmic: Sparkles,
  golden_dawn: Crown,
};

const elementLabels: Record<Element, string> = {
  fire: "Fire",
  water: "Water",
  air: "Air",
  earth: "Earth",
  cosmic: "Cosmic",
  golden_dawn: "Golden Dawn",
};

const elementColors: Record<Element, string> = {
  fire: "from-orange-400 to-red-500",
  water: "from-cyan-400 to-blue-500",
  air: "from-purple-400 to-indigo-500",
  earth: "from-amber-500 to-green-600",
  cosmic: "from-violet-500 to-indigo-600",
  golden_dawn: "from-amber-400 to-yellow-500",
};

type PlacementType = "core" | "emotional" | "outer" | "venus" | "mercury" | "mars";

function renderInterpretation(
  sign: ZodiacSign, 
  style: SpiritualStyle, 
  colors: { isDark: boolean; textSecondary: string; textMuted: string },
  placement: PlacementType = "core"
) {
  // Select the correct interpretation data based on placement type
  let interpretationData;
  switch (placement) {
    case "emotional":
      interpretationData = emotionalLandscapeInterpretations;
      break;
    case "outer":
      interpretationData = auraExpressionInterpretations;
      break;
    case "venus":
      interpretationData = heartArchetypeInterpretations;
      break;
    case "mercury":
      interpretationData = mentalArchetypeInterpretations;
      break;
    case "mars":
      interpretationData = driveArchetypeInterpretations;
      break;
    default:
      interpretationData = coreIdentityInterpretations;
  }
  const interpretation = interpretationData[sign][style];
  
  if (style === "archetype") {
    const arch = interpretation as ArchetypeInterpretation;
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span 
            className="font-serif text-sm font-medium"
            style={{ color: colors.isDark ? '#F6EFAF' : '#D4A574' }}
          >
            {arch.archetype_name}
          </span>
        </div>
        <p className="text-sm" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.85)' : colors.textSecondary }}>
          {arch.essence}
        </p>
        <div className="pt-2 space-y-1.5">
          <p className="text-xs" style={{ color: colors.textMuted }}>
            <span className="font-medium" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.7)' : colors.textSecondary }}>Gift:</span> {arch.gift}
          </p>
          <p className="text-xs" style={{ color: colors.textMuted }}>
            <span className="font-medium" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.7)' : colors.textSecondary }}>Shadow:</span> {arch.shadow_challenge}
          </p>
          <p className="text-xs" style={{ color: colors.textMuted }}>
            <span className="font-medium" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.7)' : colors.textSecondary }}>Healing:</span> {arch.healing_path}
          </p>
        </div>
        <p 
          className="text-sm italic pt-2"
          style={{ color: colors.isDark ? '#a78bfa' : '#7c3aed' }}
        >
          "{arch.embodiment_message}"
        </p>
      </div>
    );
  }
  
  if (style === "energy") {
    // Handle different energy structures based on placement type
    if (placement === "venus") {
      const venusEnergy = interpretation as VenusEnergyInterpretation;
      return (
        <div className="space-y-2">
          <div className="pt-2 space-y-1.5">
            <p className="text-xs" style={{ color: colors.textMuted }}>
              <span className="font-medium" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.7)' : colors.textSecondary }}>Love Language:</span> {venusEnergy.love_language}
            </p>
            <p className="text-xs" style={{ color: colors.textMuted }}>
              <span className="font-medium" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.7)' : colors.textSecondary }}>Relational Style:</span> {venusEnergy.relational_style}
            </p>
            <p className="text-xs" style={{ color: colors.textMuted }}>
              <span className="font-medium" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.7)' : colors.textSecondary }}>Emotional Needs:</span> {venusEnergy.emotional_needs}
            </p>
            <p className="text-xs" style={{ color: colors.textMuted }}>
              <span className="font-medium" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.7)' : colors.textSecondary }}>Watch for:</span> {venusEnergy.patterns}
            </p>
            <p className="text-xs" style={{ color: colors.textMuted }}>
              <span className="font-medium" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.7)' : colors.textSecondary }}>Rebalance with:</span> {venusEnergy.rebalance}
            </p>
          </div>
        </div>
      );
    }
    if (placement === "mercury") {
      const mercuryEnergy = interpretation as MercuryEnergyInterpretation;
      return (
        <div className="space-y-2">
          <div className="pt-2 space-y-1.5">
            <p className="text-xs" style={{ color: colors.textMuted }}>
              <span className="font-medium" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.7)' : colors.textSecondary }}>Thinking Style:</span> {mercuryEnergy.thinking_style}
            </p>
            <p className="text-xs" style={{ color: colors.textMuted }}>
              <span className="font-medium" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.7)' : colors.textSecondary }}>Communication:</span> {mercuryEnergy.communication_style}
            </p>
            <p className="text-xs" style={{ color: colors.textMuted }}>
              <span className="font-medium" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.7)' : colors.textSecondary }}>Mental Needs:</span> {mercuryEnergy.mental_needs}
            </p>
            <p className="text-xs" style={{ color: colors.textMuted }}>
              <span className="font-medium" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.7)' : colors.textSecondary }}>Watch for:</span> {mercuryEnergy.patterns}
            </p>
            <p className="text-xs" style={{ color: colors.textMuted }}>
              <span className="font-medium" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.7)' : colors.textSecondary }}>Rebalance with:</span> {mercuryEnergy.rebalance}
            </p>
          </div>
        </div>
      );
    }
    if (placement === "mars") {
      const marsEnergy = interpretation as MarsEnergyInterpretation;
      return (
        <div className="space-y-2">
          <div className="pt-2 space-y-1.5">
            <p className="text-xs" style={{ color: colors.textMuted }}>
              <span className="font-medium" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.7)' : colors.textSecondary }}>Drive Style:</span> {marsEnergy.drive_style}
            </p>
            <p className="text-xs" style={{ color: colors.textMuted }}>
              <span className="font-medium" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.7)' : colors.textSecondary }}>Conflict Style:</span> {marsEnergy.conflict_style}
            </p>
            <p className="text-xs" style={{ color: colors.textMuted }}>
              <span className="font-medium" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.7)' : colors.textSecondary }}>Desire Energy:</span> {marsEnergy.desire_energy}
            </p>
            <p className="text-xs" style={{ color: colors.textMuted }}>
              <span className="font-medium" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.7)' : colors.textSecondary }}>Watch for:</span> {marsEnergy.patterns}
            </p>
            <p className="text-xs" style={{ color: colors.textMuted }}>
              <span className="font-medium" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.7)' : colors.textSecondary }}>Rebalance with:</span> {marsEnergy.rebalance}
            </p>
          </div>
        </div>
      );
    }
    // Default energy interpretation (Sun, Moon, Rising)
    const energy = interpretation as EnergyInterpretation;
    return (
      <div className="space-y-2">
        <p className="text-sm" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.85)' : colors.textSecondary }}>
          {energy.processing}
        </p>
        <div className="pt-2 space-y-1.5">
          <p className="text-xs" style={{ color: colors.textMuted }}>
            <span className="font-medium" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.7)' : colors.textSecondary }}>How you show up:</span> {energy.show_up}
          </p>
          <p className="text-xs" style={{ color: colors.textMuted }}>
            <span className="font-medium" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.7)' : colors.textSecondary }}>What you need:</span> {energy.emotional_needs}
          </p>
          <p className="text-xs" style={{ color: colors.textMuted }}>
            <span className="font-medium" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.7)' : colors.textSecondary }}>Watch for:</span> {energy.patterns}
          </p>
          <p className="text-xs" style={{ color: colors.textMuted }}>
            <span className="font-medium" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.7)' : colors.textSecondary }}>Rebalance with:</span> {energy.rebalance}
          </p>
        </div>
      </div>
    );
  }
  
  const cosmic = interpretation as CosmicInterpretation;
  return (
    <div className="space-y-2">
      <div className="pt-1 space-y-1.5">
        <p className="text-sm" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.85)' : colors.textSecondary }}>
          <span className="font-medium" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.95)' : colors.textSecondary }}>Brings:</span> {cosmic.brings}
        </p>
        <p className="text-sm" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.85)' : colors.textSecondary }}>
          <span className="font-medium" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.95)' : colors.textSecondary }}>Influences:</span> {cosmic.influences}
        </p>
        <p className="text-sm" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.85)' : colors.textSecondary }}>
          <span className="font-medium" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.95)' : colors.textSecondary }}>Teaches:</span> {cosmic.teaches}
        </p>
        <p className="text-sm" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.85)' : colors.textSecondary }}>
          <span className="font-medium" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.95)' : colors.textSecondary }}>Supports:</span> {cosmic.supports}
        </p>
      </div>
    </div>
  );
}

// Render Jupiter (Expansion) interpretation - single format
function renderJupiterInterpretation(
  sign: ZodiacSign,
  colors: { isDark: boolean; textSecondary: string; textMuted: string }
) {
  const interpretation = expansionArchetypeInterpretations[sign];
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <span 
          className="font-serif text-sm font-medium"
          style={{ color: colors.isDark ? '#F6EFAF' : '#D4A574' }}
        >
          {interpretation.archetype_name}
        </span>
      </div>
      <p className="text-sm" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.85)' : colors.textSecondary }}>
        {interpretation.core_theme}
      </p>
      <div className="pt-2 space-y-1.5">
        <p className="text-xs" style={{ color: colors.textMuted }}>
          <span className="font-medium" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.7)' : colors.textSecondary }}>Growth Path:</span> {interpretation.growth_path}
        </p>
        <p className="text-xs" style={{ color: colors.textMuted }}>
          <span className="font-medium" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.7)' : colors.textSecondary }}>Shadow:</span> {interpretation.shadow}
        </p>
      </div>
      <p 
        className="text-sm italic pt-2"
        style={{ color: colors.isDark ? '#a78bfa' : '#7c3aed' }}
      >
        "{interpretation.affirmation}"
      </p>
    </div>
  );
}

// Render Saturn (Mastery) interpretation - single format
function renderSaturnInterpretation(
  sign: ZodiacSign,
  colors: { isDark: boolean; textSecondary: string; textMuted: string }
) {
  const interpretation = masteryArchetypeInterpretations[sign];
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <span 
          className="font-serif text-sm font-medium"
          style={{ color: colors.isDark ? '#F6EFAF' : '#D4A574' }}
        >
          {interpretation.archetype_name}
        </span>
      </div>
      <p className="text-sm" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.85)' : colors.textSecondary }}>
        {interpretation.core_lesson}
      </p>
      <div className="pt-2 space-y-1.5">
        <p className="text-xs" style={{ color: colors.textMuted }}>
          <span className="font-medium" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.7)' : colors.textSecondary }}>Challenge:</span> {interpretation.challenge}
        </p>
        <p className="text-xs" style={{ color: colors.textMuted }}>
          <span className="font-medium" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.7)' : colors.textSecondary }}>Healing Practice:</span> {interpretation.healing_practice}
        </p>
      </div>
      <p 
        className="text-sm italic pt-2"
        style={{ color: colors.isDark ? '#a78bfa' : '#7c3aed' }}
      >
        "{interpretation.embodiment_message}"
      </p>
    </div>
  );
}

// Render North Node (Soul Direction) interpretation
function renderNorthNodeInterpretation(
  sign: ZodiacSign,
  colors: { isDark: boolean; textSecondary: string; textMuted: string }
) {
  const interpretation = soulDirectionInterpretations[sign];
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <span 
          className="font-serif text-sm font-medium"
          style={{ color: colors.isDark ? '#F6EFAF' : '#D4A574' }}
        >
          {interpretation.archetype_name}
        </span>
      </div>
      <p className="text-sm" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.85)' : colors.textSecondary }}>
        {interpretation.invitation}
      </p>
      <div className="pt-2 space-y-1.5">
        <p className="text-xs" style={{ color: colors.textMuted }}>
          <span className="font-medium" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.7)' : colors.textSecondary }}>Release:</span> {interpretation.core_fear_to_release}
        </p>
        <p className="text-xs" style={{ color: colors.textMuted }}>
          <span className="font-medium" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.7)' : colors.textSecondary }}>Actions:</span> {interpretation.aligned_actions}
        </p>
      </div>
    </div>
  );
}

// Render South Node (Soul Memory) interpretation
function renderSouthNodeInterpretation(
  sign: ZodiacSign,
  colors: { isDark: boolean; textSecondary: string; textMuted: string }
) {
  const interpretation = soulMemoryInterpretations[sign];
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <span 
          className="font-serif text-sm font-medium"
          style={{ color: colors.isDark ? '#F6EFAF' : '#D4A574' }}
        >
          {interpretation.archetype_name}
        </span>
      </div>
      <p className="text-sm" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.85)' : colors.textSecondary }}>
        {interpretation.what_feels_familiar}
      </p>
      <div className="pt-2 space-y-1.5">
        <p className="text-xs" style={{ color: colors.textMuted }}>
          <span className="font-medium" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.7)' : colors.textSecondary }}>Transcend:</span> {interpretation.what_to_transcend}
        </p>
        <p className="text-xs" style={{ color: colors.textMuted }}>
          <span className="font-medium" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.7)' : colors.textSecondary }}>Keep:</span> {interpretation.gift_to_keep}
        </p>
      </div>
    </div>
  );
}

// Release → Rise Arc rendering function
function renderReleaseRiseArc(
  arc: ReleaseRiseArc,
  colors: { isDark: boolean; textSecondary: string; textMuted: string }
) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card 
        className="p-6 md:p-8 backdrop-blur-sm rounded-2xl"
        style={{
          background: colors.isDark 
            ? 'linear-gradient(180deg, rgba(59, 34, 108, 0.9) 0%, rgba(42, 29, 85, 0.9) 50%, rgba(28, 20, 64, 0.9) 100%)'
            : 'linear-gradient(180deg, #f7fbff 0%, #fdf8ff 40%, #f8f5ff 100%)',
          borderColor: colors.isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)',
          boxShadow: colors.isDark ? '0 10px 40px rgba(139, 92, 246, 0.15)' : '0 10px 30px rgba(0, 0, 0, 0.1)'
        }}
        data-testid="card-release-rise-arc"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: colors.isDark
                  ? 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 50%, #7c3aed 100%)'
                  : 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)'
              }}
            >
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 
                className="font-serif text-lg font-semibold"
                style={{ color: colors.isDark ? '#F6EFAF' : '#D4A574' }}
                data-testid="text-arc-title"
              >
                {arc.title}
              </h3>
              <p 
                className="text-xs"
                style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.6)' : colors.textMuted }}
              >
                Your Soul's Journey
              </p>
            </div>
          </div>

          <p 
            className="text-sm leading-relaxed"
            style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.9)' : colors.textSecondary }}
            data-testid="text-arc-summary"
          >
            {arc.summary}
          </p>

          <div className="space-y-3 pt-2">
            <div 
              className="p-3 rounded-lg"
              style={{ 
                background: colors.isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
                borderLeft: `3px solid ${colors.isDark ? 'rgba(248, 113, 113, 0.7)' : '#f87171'}`
              }}
            >
              <p className="text-xs font-medium mb-1" style={{ color: colors.isDark ? 'rgba(248, 113, 113, 0.9)' : '#dc2626' }}>
                Release
              </p>
              <p className="text-sm" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.85)' : colors.textSecondary }}>
                {arc.release}
              </p>
            </div>

            <div 
              className="p-3 rounded-lg"
              style={{ 
                background: colors.isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
                borderLeft: `3px solid ${colors.isDark ? 'rgba(74, 222, 128, 0.7)' : '#22c55e'}`
              }}
            >
              <p className="text-xs font-medium mb-1" style={{ color: colors.isDark ? 'rgba(74, 222, 128, 0.9)' : '#16a34a' }}>
                Rise
              </p>
              <p className="text-sm" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.85)' : colors.textSecondary }}>
                {arc.rise}
              </p>
            </div>

            <div 
              className="p-3 rounded-lg"
              style={{ 
                background: colors.isDark ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.08)',
                borderLeft: `3px solid ${colors.isDark ? 'rgba(251, 191, 36, 0.7)' : '#f59e0b'}`
              }}
            >
              <p className="text-xs font-medium mb-1" style={{ color: colors.isDark ? 'rgba(251, 191, 36, 0.9)' : '#d97706' }}>
                Bridge
              </p>
              <p className="text-sm italic" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.85)' : colors.textSecondary }}>
                {arc.bridge}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t" style={{ borderColor: colors.isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)' }}>
            <p className="text-xs font-medium mb-2" style={{ color: colors.isDark ? 'rgba(167, 139, 250, 0.9)' : '#7c3aed' }}>
              Reflection
            </p>
            <p className="text-sm italic" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.75)' : colors.textMuted }}>
              "{arc.reflection_prompt}"
            </p>
          </div>

          <div 
            className="p-3 rounded-lg"
            style={{ 
              background: colors.isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)'
            }}
          >
            <p className="text-xs font-medium mb-1" style={{ color: colors.isDark ? 'rgba(167, 139, 250, 0.9)' : '#7c3aed' }}>
              Daily Practice
            </p>
            <p className="text-sm" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.85)' : colors.textSecondary }}>
              {arc.daily_practice}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function generateEnergyProfile(profile: ReturnType<typeof getUserProfile>) {
  if (!profile || !profile.sunSign || !profile.moonSign) return "";
  
  const sunElement = elementMapping[profile.sunSign];
  const moonElement = elementMapping[profile.moonSign];
  const risingElement = profile.risingSign ? elementMapping[profile.risingSign] : null;
  
  const elements = [sunElement, moonElement];
  if (risingElement) elements.push(risingElement);
  
  const elementCounts = elements.reduce((acc, el) => {
    if (el) acc[el] = (acc[el] || 0) + 1;
    return acc;
  }, {} as Record<Element, number>);
  
  const dominantElement = Object.entries(elementCounts).sort((a, b) => b[1] - a[1])[0];
  const preferredElement = profile.currentElement;
  
  let profile_text = `Your birth chart reveals a ${profile.sunSign} core identity with a ${profile.moonSign} emotional landscape`;
  
  if (profile.risingSign) {
    profile_text += ` and a ${profile.risingSign} first impression. `;
  } else {
    profile_text += `. `;
  }
  
  if (dominantElement && dominantElement[1] >= 2) {
    profile_text += `With ${dominantElement[1]} placements in ${elementLabels[dominantElement[0] as Element]} signs, you carry a strong ${dominantElement[0]} energy - `;
    switch (dominantElement[0]) {
      case "fire":
        profile_text += "passionate, action-oriented, and inspiring.";
        break;
      case "water":
        profile_text += "intuitive, emotionally deep, and nurturing.";
        break;
      case "air":
        profile_text += "intellectual, communicative, and socially aware.";
        break;
      case "earth":
        profile_text += "grounded, practical, and reliability-focused.";
        break;
    }
  } else {
    profile_text += "Your chart shows a balanced distribution across elements, giving you adaptability and versatility in how you navigate the world.";
  }
  
  if (preferredElement && preferredElement !== "cosmic") {
    profile_text += ` Today, you're resonating with ${elementLabels[preferredElement]} energy, which `;
    switch (preferredElement) {
      case "fire":
        profile_text += "amplifies your drive and creative spark.";
        break;
      case "water":
        profile_text += "deepens your intuition and emotional awareness.";
        break;
      case "air":
        profile_text += "sharpens your mental clarity and social connections.";
        break;
      case "earth":
        profile_text += "grounds you in practical wisdom and stability.";
        break;
    }
  } else if (preferredElement === "cosmic") {
    profile_text += " Today, you're embracing Cosmic energy - open to the mysteries, dwelling in the space between.";
  }
  
  return profile_text;
}

export function MyChart() {
  const profile = getUserProfile();
  const { colors, element } = useElementTheme();
  const spiritualStyle = getSpiritualStyle();
  const isGoldenDawn = isGoldenDawnActive(element);
  const gdCardClasses = getGoldenDawnCardClasses(element);
  
  // Get card style based on theme
  const getCardStyle = () => {
    if (isGoldenDawn) {
      return getGoldenDawnCardStyle(colors, element);
    }
    return {
      background: colors.isDark 
        ? 'linear-gradient(180deg, rgba(59, 34, 108, 0.9) 0%, rgba(42, 29, 85, 0.9) 50%, rgba(28, 20, 64, 0.9) 100%)'
        : 'linear-gradient(180deg, #f7fbff 0%, #fdf8ff 40%, #f8f5ff 100%)',
      borderColor: colors.isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)',
      boxShadow: colors.isDark ? '0 10px 40px rgba(139, 92, 246, 0.15)' : '0 10px 30px rgba(0, 0, 0, 0.1)'
    };
  };
  
  // Text colors for Golden Dawn
  const getTextPrimary = () => isGoldenDawn ? '#1B1A17' : (colors.isDark ? '#F6EFAF' : '#D4A574');
  const getTextSecondary = () => isGoldenDawn ? '#3D3A34' : (colors.isDark ? 'rgba(221, 214, 254, 0.85)' : colors.textSecondary);
  const getTextMuted = () => isGoldenDawn ? '#5D5548' : (colors.isDark ? 'rgba(221, 214, 254, 0.6)' : colors.textMuted);
  
  if (!profile) {
    return (
      <Card 
        className="p-6 backdrop-blur-sm"
        style={{ 
          backgroundColor: colors.cardBg, 
          borderColor: colors.cardBorder 
        }}
      >
        <p style={{ color: colors.textSecondary }} className="text-center">Complete onboarding to see your chart</p>
      </Card>
    );
  }

  if (!profile.hasAstrologyProfile || !profile.sunSign || !profile.moonSign) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 
            className="font-serif text-2xl font-semibold mb-1" 
            style={{ color: colors.isDark ? '#F6EFAF' : '#D4A574' }}
            data-testid="text-chart-name"
          >
            Your Blueprint
          </h1>
          <p style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.75)' : colors.textSecondary }}>
            Discover your unique energy signature
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card 
            className="p-6 md:p-8 text-center backdrop-blur-sm rounded-2xl"
            style={{
              background: colors.isDark 
                ? 'linear-gradient(180deg, #2A1D55 0%, #1C1440 100%)'
                : 'linear-gradient(180deg, #f7fbff 0%, #fdf8ff 40%, #f8f5ff 100%)',
              borderColor: colors.isDark ? 'rgba(139, 92, 246, 0.2)' : colors.cardBorder,
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)'
            }}
          >
            <div 
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{
                background: colors.isDark
                  ? 'radial-gradient(circle at 30% 20%, #a78bfa 0%, #8b5cf6 60%, #4c1d95 100%)'
                  : 'radial-gradient(circle at 30% 20%, #76e4ff 0%, #3b82f6 60%, #1d1b4f 100%)'
              }}
            >
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-serif text-xl mb-2" style={{ color: colors.isDark ? '#ffffff' : colors.textPrimary }}>
              Unlock Your Energetic Blueprint
            </h3>
            <p className="mb-6 max-w-sm mx-auto" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.85)' : colors.textSecondary }}>
              Add your birth details to discover your unique energy signature.
            </p>
            <Link href="/settings">
              <Button 
                className="px-8 rounded-full text-white"
                style={{
                  background: colors.isDark
                    ? 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #c084fc 100%)'
                    : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  boxShadow: colors.isDark
                    ? '0 8px 20px rgba(139, 92, 246, 0.45)'
                    : '0 8px 20px rgba(217, 119, 6, 0.35)'
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Birth Details
              </Button>
            </Link>
          </Card>
        </motion.div>

        {profile.currentElement && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Card 
              className="p-6 md:p-8 backdrop-blur-sm rounded-2xl"
              style={{
                background: colors.isDark 
                  ? 'linear-gradient(180deg, #2A1D55 0%, #1C1440 100%)'
                  : 'linear-gradient(180deg, #f7fbff 0%, #fdf8ff 40%, #f8f5ff 100%)',
                borderColor: colors.isDark ? 'rgba(139, 92, 246, 0.2)' : colors.cardBorder,
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)'
              }}
            >
              <div className="flex items-center gap-4">
                {(() => {
                  const ElementIcon = elementIcons[profile.currentElement];
                  return (
                    <div 
                      className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{
                        background: colors.isDark
                          ? 'radial-gradient(circle at 30% 20%, #a78bfa 0%, #8b5cf6 60%, #4c1d95 100%)'
                          : 'radial-gradient(circle at 30% 20%, #76e4ff 0%, #3b82f6 60%, #1d1b4f 100%)'
                      }}
                    >
                      <ElementIcon className="w-7 h-7 text-white" />
                    </div>
                  );
                })()}
                <div>
                  <span className="text-sm font-medium" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.85)' : colors.textSecondary }}>Current Element</span>
                  <p className="font-serif text-lg" style={{ color: colors.isDark ? '#ffffff' : colors.textPrimary }} data-testid="text-current-element">
                    {elementLabels[profile.currentElement]}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    );
  }

  const sunElement = elementMapping[profile.sunSign];
  const moonElement = elementMapping[profile.moonSign];
  const risingElement = profile.risingSign ? elementMapping[profile.risingSign] : null;
  const preferredElement = profile.currentElement;
  
  const mercuryElement = profile.mercurySign ? elementMapping[profile.mercurySign] : null;
  const venusElement = profile.venusSign ? elementMapping[profile.venusSign] : null;
  const marsElement = profile.marsSign ? elementMapping[profile.marsSign] : null;
  const jupiterElement = profile.jupiterSign ? elementMapping[profile.jupiterSign] : null;
  const saturnElement = profile.saturnSign ? elementMapping[profile.saturnSign] : null;
  const northNodeElement = profile.northNodeSign ? elementMapping[profile.northNodeSign] : null;
  const southNodeElement = profile.southNodeSign ? elementMapping[profile.southNodeSign] : null;
  
  // Get Venus archetype for Heart Energy card
  const venusArchetype = profile.venusSign ? getVenusArchetype(profile.venusSign as ZodiacSign) : null;
  const [heartEnergyDeepDiveOpen, setHeartEnergyDeepDiveOpen] = useState(false);

  const energyProfile = generateEnergyProfile(profile);

  // Helper function to render a placement card
  const gdTextColors = getGoldenDawnTextColors(element);
  
  const renderPlacementCard = (
    type: string,
    sign: ZodiacSign,
    icon: typeof Sun,
    cardElement: Element,
    subtitle: string,
    placement: PlacementType | "jupiter" | "saturn" | "northNode" | "southNode",
    delay: number
  ) => {
    const ElementIcon = elementIcons[cardElement];
    return (
      <motion.div
        key={type}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay }}
      >
        <Card 
          className={`p-6 md:p-8 backdrop-blur-sm rounded-2xl ${isGoldenDawn ? 'border-[#FAD792]/35' : ''}`}
          style={{
            background: isGoldenDawn
              ? GoldenDawnTheme.cards.background
              : colors.isDark 
                ? 'linear-gradient(180deg, #2A1D55 0%, #1C1440 100%)'
                : 'linear-gradient(180deg, #f7fbff 0%, #fdf8ff 40%, #f8f5ff 100%)',
            borderColor: isGoldenDawn 
              ? GoldenDawnTheme.borders.gold
              : colors.isDark ? 'rgba(139, 92, 246, 0.2)' : colors.cardBorder,
            boxShadow: isGoldenDawn 
              ? GoldenDawnTheme.cards.shadow
              : '0 10px 30px rgba(0, 0, 0, 0.25)'
          }}
        >
          <div className="flex items-start gap-4">
            <div 
              className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: isGoldenDawn
                  ? `linear-gradient(135deg, ${GoldenDawnTheme.primary.gold}, ${GoldenDawnTheme.primary.deepOrange})`
                  : colors.isDark
                    ? 'radial-gradient(circle at 30% 20%, #a78bfa 0%, #8b5cf6 60%, #4c1d95 100%)'
                    : 'radial-gradient(circle at 30% 20%, #76e4ff 0%, #3b82f6 60%, #1d1b4f 100%)'
              }}
            >
              {icon === Sun ? <Sun className="w-7 h-7 text-white" /> :
               icon === Moon ? <Moon className="w-7 h-7 text-white" /> :
               icon === Sunrise ? <Sunrise className="w-7 h-7 text-white" /> :
               icon === Heart ? <Heart className="w-7 h-7 text-white" /> :
               icon === MessageCircle ? <MessageCircle className="w-7 h-7 text-white" /> :
               icon === Zap ? <Zap className="w-7 h-7 text-white" /> :
               icon === Stars ? <Stars className="w-7 h-7 text-white" /> :
               icon === Target ? <Target className="w-7 h-7 text-white" /> :
               icon === Compass ? <Compass className="w-7 h-7 text-white" /> :
               icon === ArrowUp ? <ArrowUp className="w-7 h-7 text-white" /> :
               icon === ArrowDown ? <ArrowDown className="w-7 h-7 text-white" /> :
               <Sparkles className="w-7 h-7 text-white" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span 
                  className="font-sans font-semibold text-base"
                  style={{ color: isGoldenDawn ? gdTextColors?.primary : colors.isDark ? '#ffffff' : colors.textPrimary }}
                >
                  {type}
                </span>
                <span 
                  className="font-serif text-lg"
                  style={{ color: isGoldenDawn ? GoldenDawnTheme.primary.deepOrange : colors.isDark ? '#F6EFAF' : '#D4A574' }}
                  data-testid={`text-chart-${type.toLowerCase().replace(/ /g, '-')}`}
                >
                  {sign}
                </span>
                <span 
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs text-white"
                  style={{
                    background: isGoldenDawn
                      ? `linear-gradient(135deg, ${GoldenDawnTheme.primary.gold}, ${GoldenDawnTheme.primary.coral})`
                      : colors.isDark
                        ? 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)'
                        : `linear-gradient(135deg, ${cardElement === 'fire' ? '#f97316, #ef4444' : cardElement === 'water' ? '#06b6d4, #3b82f6' : cardElement === 'air' ? '#a855f7, #6366f1' : cardElement === 'earth' ? '#f59e0b, #16a34a' : '#8b5cf6, #4f46e5'})`
                  }}
                >
                  <ElementIcon className="w-3 h-3" />
                  {elementLabels[cardElement]}
                </span>
              </div>
              <p 
                className="text-xs mb-2"
                style={{ color: isGoldenDawn ? gdTextColors?.secondary : colors.isDark ? 'rgba(221, 214, 254, 0.5)' : colors.textMuted }}
              >
                {subtitle}
              </p>
              {placement === "jupiter" && renderJupiterInterpretation(sign, isGoldenDawn ? { isDark: false, textSecondary: gdTextColors?.secondary || colors.textSecondary, textMuted: gdTextColors?.secondary || colors.textMuted } : colors)}
              {placement === "saturn" && renderSaturnInterpretation(sign, isGoldenDawn ? { isDark: false, textSecondary: gdTextColors?.secondary || colors.textSecondary, textMuted: gdTextColors?.secondary || colors.textMuted } : colors)}
              {placement === "northNode" && renderNorthNodeInterpretation(sign, isGoldenDawn ? { isDark: false, textSecondary: gdTextColors?.secondary || colors.textSecondary, textMuted: gdTextColors?.secondary || colors.textMuted } : colors)}
              {placement === "southNode" && renderSouthNodeInterpretation(sign, isGoldenDawn ? { isDark: false, textSecondary: gdTextColors?.secondary || colors.textSecondary, textMuted: gdTextColors?.secondary || colors.textMuted } : colors)}
              {(placement === "core" || placement === "emotional" || placement === "outer" || placement === "venus" || placement === "mercury" || placement === "mars") && 
                renderInterpretation(sign, spiritualStyle, isGoldenDawn ? { isDark: false, textSecondary: gdTextColors?.secondary || colors.textSecondary, textMuted: gdTextColors?.secondary || colors.textMuted } : colors, placement)}
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  // Section header component
  const renderSectionHeader = (title: string, subtitle: string, delay: number) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="pt-4 pb-2"
    >
      <h2 
        className="font-serif text-xl font-semibold"
        style={{ color: isGoldenDawn ? gdTextColors?.primary : colors.isDark ? 'rgba(221, 214, 254, 0.9)' : colors.textPrimary }}
      >
        {title}
      </h2>
      <p 
        className="text-sm"
        style={{ color: isGoldenDawn ? gdTextColors?.secondary : colors.isDark ? 'rgba(221, 214, 254, 0.6)' : colors.textMuted }}
      >
        {subtitle}
      </p>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 
          className="font-serif text-2xl font-semibold mb-1" 
          style={{ color: isGoldenDawn ? GoldenDawnTheme.primary.deepOrange : colors.isDark ? '#F6EFAF' : '#D4A574' }}
          data-testid="text-chart-name"
        >
          {profile.name}'s Energetic Blueprint
        </h1>
        <p style={{ color: isGoldenDawn ? gdTextColors?.secondary : colors.isDark ? 'rgba(221, 214, 254, 0.75)' : colors.textSecondary }}>
          Your unique energy signature
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-4"
      >
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h2 
            className="font-serif text-xl font-semibold"
            style={{ color: isGoldenDawn ? gdTextColors?.primary : colors.isDark ? 'rgba(221, 214, 254, 0.9)' : colors.textPrimary }}
          >
            Your Energy Centers
          </h2>
          <span 
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
            style={{
              background: isGoldenDawn 
                ? GoldenDawnTheme.buttons.secondary.background
                : colors.isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)',
              color: isGoldenDawn 
                ? GoldenDawnTheme.buttons.secondary.textColor
                : colors.isDark ? '#c4b5fd' : '#7c3aed',
              border: isGoldenDawn 
                ? `1px solid ${GoldenDawnTheme.borders.gold}`
                : `1px solid ${colors.isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'}`
            }}
          >
            {spiritualStyle === "archetype" && <Sparkles className="w-3 h-3" />}
            {spiritualStyle === "energy" && <Zap className="w-3 h-3" />}
            {spiritualStyle === "cosmic" && <Stars className="w-3 h-3" />}
            {spiritualStyleLabels[spiritualStyle]}
          </span>
        </div>
        <p 
          className="text-sm"
          style={{ color: isGoldenDawn ? gdTextColors?.secondary : colors.isDark ? 'rgba(221, 214, 254, 0.6)' : colors.textMuted }}
        >
          {spiritualStyle === "archetype" && "The healing archetypes shaping your experience"}
          {spiritualStyle === "energy" && "Your energy patterns and emotional landscape"}
          {spiritualStyle === "cosmic" && "Celestial influences on your journey"}
        </p>
      </motion.div>

      <div className="space-y-4">
        {/* SECTION 1: Identity & Aura */}
        {renderSectionHeader("Identity & Aura", "Your core essence and how you radiate it to the world", 0.1)}
        {renderPlacementCard("Core Essence", profile.sunSign, Sun, sunElement, "Your fundamental life force and purpose", "core", 0.15)}
        {profile.risingSign && risingElement && 
          renderPlacementCard("Aura Expression", profile.risingSign, Sunrise, risingElement, "How you project yourself outward", "outer", 0.2)}
        {!profile.risingSign && profile.hasAstrologyProfile && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card 
              className="p-6 md:p-8 backdrop-blur-sm rounded-2xl border-dashed"
              style={{
                background: colors.isDark 
                  ? 'linear-gradient(180deg, rgba(42, 29, 85, 0.7) 0%, rgba(28, 20, 64, 0.7) 100%)'
                  : 'linear-gradient(180deg, #f7fbff 0%, #fdf8ff 40%, #f8f5ff 100%)',
                borderColor: colors.isDark ? 'rgba(139, 92, 246, 0.3)' : colors.cardBorder
              }}
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 opacity-60"
                  style={{ background: colors.isDark ? 'radial-gradient(circle at 30% 20%, #6b7280 0%, #4b5563 60%, #1f2937 100%)' : 'radial-gradient(circle at 30% 20%, #d1d5db 0%, #9ca3af 60%, #6b7280 100%)' }}>
                  <Sunrise className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-sans font-semibold text-base" style={{ color: colors.isDark ? 'rgba(255, 255, 255, 0.5)' : colors.textMuted }}>Aura Expression</span>
                  <p className="text-sm" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.5)' : colors.textMuted }}>Add your birth time to unlock</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* SECTION 2: Emotional Landscape */}
        {renderSectionHeader("Emotional Landscape", "Your inner world and emotional patterns", 0.25)}
        {renderPlacementCard("Emotional Core", profile.moonSign, Moon, moonElement, "How you process feelings and nurture yourself", "emotional", 0.3)}

        {/* SECTION 3: Heart & Relationships */}
        {profile.venusSign && venusElement && venusArchetype && (
          <>
            {renderSectionHeader("Heart & Relationships", "How you give and receive love", 0.35)}
            {renderPlacementCard("Heart & Magnetism", profile.venusSign, Heart, venusElement, "Your love language and relational style", "venus", 0.4)}
            
            {/* Heart Energy — Venus Archetype Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.45 }}
            >
              <Card 
                className="p-6 md:p-8 backdrop-blur-sm rounded-2xl"
                style={{
                  background: colors.isDark 
                    ? 'linear-gradient(180deg, rgba(88, 28, 135, 0.4) 0%, rgba(157, 23, 77, 0.3) 50%, rgba(30, 27, 75, 0.9) 100%)'
                    : 'linear-gradient(180deg, #fdf4ff 0%, #fce7f3 50%, #fff1f2 100%)',
                  borderColor: colors.isDark ? 'rgba(236, 72, 153, 0.3)' : 'rgba(236, 72, 153, 0.2)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)'
                }}
                data-testid="card-heart-energy"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'radial-gradient(circle at 30% 20%, #f472b6 0%, #ec4899 60%, #be185d 100%)'
                    }}
                  >
                    <Heart className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span 
                      className="font-sans font-semibold text-base block"
                      style={{ color: colors.isDark ? '#ffffff' : colors.textPrimary }}
                    >
                      Heart Energy
                    </span>
                    <span 
                      className="font-serif text-lg block"
                      style={{ color: colors.isDark ? '#f9a8d4' : '#db2777' }}
                      data-testid="text-venus-archetype-name"
                    >
                      {venusArchetype.name}
                    </span>
                    <p 
                      className="text-sm italic mt-1"
                      style={{ color: colors.isDark ? 'rgba(244, 114, 182, 0.8)' : '#be185d' }}
                    >
                      "{venusArchetype.tagline}"
                    </p>
                  </div>
                </div>
                
                <p 
                  className="text-sm leading-relaxed mb-4"
                  style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.85)' : colors.textSecondary }}
                >
                  {venusArchetype.summary}
                </p>
                
                <Collapsible 
                  open={heartEnergyDeepDiveOpen}
                  onOpenChange={setHeartEnergyDeepDiveOpen}
                >
                  <CollapsibleTrigger asChild>
                    <button
                      className="w-full flex items-center justify-between p-3 rounded-lg transition-colors hover-elevate"
                      style={{
                        background: colors.isDark 
                          ? 'rgba(236, 72, 153, 0.1)'
                          : 'rgba(236, 72, 153, 0.05)',
                        border: `1px solid ${colors.isDark ? 'rgba(236, 72, 153, 0.2)' : 'rgba(236, 72, 153, 0.1)'}`
                      }}
                      data-testid="button-toggle-heart-deep-dive"
                    >
                      <span className="font-medium text-sm" style={{ color: colors.isDark ? '#f9a8d4' : '#db2777' }}>
                        Deep Dive
                      </span>
                      {heartEnergyDeepDiveOpen ? (
                        <ChevronUp className="w-4 h-4" style={{ color: colors.isDark ? '#f9a8d4' : '#db2777' }} />
                      ) : (
                        <ChevronDown className="w-4 h-4" style={{ color: colors.isDark ? '#f9a8d4' : '#db2777' }} />
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
                        className="pt-4 space-y-4"
                      >
                        <div>
                          <h4 className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: colors.isDark ? 'rgba(244, 114, 182, 0.7)' : '#be185d' }}>
                            How you naturally love
                          </h4>
                          <p className="text-sm leading-relaxed" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.85)' : colors.textSecondary }}>
                            {venusArchetype.loveStyle}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: colors.isDark ? 'rgba(244, 114, 182, 0.7)' : '#be185d' }}>
                            What your heart needs
                          </h4>
                          <p className="text-sm leading-relaxed" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.85)' : colors.textSecondary }}>
                            {venusArchetype.emotionalNeeds}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: colors.isDark ? 'rgba(244, 114, 182, 0.7)' : '#be185d' }}>
                            When your heart feels tender
                          </h4>
                          <p className="text-sm leading-relaxed" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.85)' : colors.textSecondary }}>
                            {venusArchetype.triggers}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: colors.isDark ? 'rgba(244, 114, 182, 0.7)' : '#be185d' }}>
                            Your healing invitation
                          </h4>
                          <p className="text-sm leading-relaxed" style={{ color: colors.isDark ? 'rgba(221, 214, 254, 0.85)' : colors.textSecondary }}>
                            {venusArchetype.healingLesson}
                          </p>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            </motion.div>
          </>
        )}
        
        {/* Venus not available - show prompt */}
        {!profile.venusSign && profile.hasAstrologyProfile && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
          >
            <Card 
              className="p-4 backdrop-blur-sm rounded-2xl border-dashed"
              style={{
                background: colors.isDark 
                  ? 'rgba(30, 27, 75, 0.6)'
                  : 'rgba(248, 245, 255, 0.8)',
                borderColor: colors.isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'
              }}
            >
              <p className="text-sm text-center" style={{ color: colors.textMuted }}>
                Add your birth date and time to unlock a Heart Energy insight for your chart.
              </p>
            </Card>
          </motion.div>
        )}

        {/* SECTION 4: Mind & Communication */}
        {profile.mercurySign && mercuryElement && (
          <>
            {renderSectionHeader("Mind & Communication", "How you think and express ideas", 0.45)}
            {renderPlacementCard("Mind & Voice", profile.mercurySign, MessageCircle, mercuryElement, "Your thinking and communication style", "mercury", 0.5)}
          </>
        )}

        {/* SECTION 5: Drive & Boundaries */}
        {profile.marsSign && marsElement && (
          <>
            {renderSectionHeader("Drive & Boundaries", "Your action energy and assertive power", 0.55)}
            {renderPlacementCard("Drive & Desire", profile.marsSign, Zap, marsElement, "How you pursue desires and set boundaries", "mars", 0.6)}
          </>
        )}

        {/* SECTION 6: Expansion & Blessings */}
        {profile.jupiterSign && jupiterElement && (
          <>
            {renderSectionHeader("Expansion & Blessings", "Where abundance flows easily for you", 0.65)}
            {renderPlacementCard("Growth Current", profile.jupiterSign, Stars, jupiterElement, "Your path to growth and good fortune", "jupiter", 0.7)}
          </>
        )}

        {/* SECTION 7: Mastery & Lessons */}
        {profile.saturnSign && saturnElement && (
          <>
            {renderSectionHeader("Mastery & Lessons", "Your karmic curriculum this lifetime", 0.75)}
            {renderPlacementCard("Sacred Discipline", profile.saturnSign, Target, saturnElement, "The wisdom you are here to embody", "saturn", 0.8)}
          </>
        )}

        {/* SECTION 8: Soul Direction */}
        {(profile.southNodeSign || profile.northNodeSign) && (
          <>
            {renderSectionHeader("Soul Direction", "Your karmic journey from past to future", 0.85)}
            {profile.southNodeSign && southNodeElement && 
              renderPlacementCard("South Node Comfort", profile.southNodeSign, ArrowDown, southNodeElement, "What you bring from past lives", "southNode", 0.9)}
            {profile.northNodeSign && northNodeElement && 
              renderPlacementCard("North Node Path", profile.northNodeSign, ArrowUp, northNodeElement, "Where your soul is evolving toward", "northNode", 0.95)}
            {/* Release → Rise Arc when both nodes are present */}
            {profile.southNodeSign && profile.northNodeSign && (() => {
              const arc = getReleaseRiseArc(profile.southNodeSign as ZodiacSign, profile.northNodeSign as ZodiacSign);
              return arc ? renderReleaseRiseArc(arc, colors) : null;
            })()}
          </>
        )}
      </div>

      {preferredElement && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card 
            className={`p-6 md:p-8 backdrop-blur-sm rounded-2xl ${isGoldenDawn ? 'border-[#FAD792]/35' : ''}`}
            style={{
              background: isGoldenDawn
                ? GoldenDawnTheme.cards.background
                : colors.isDark 
                  ? 'linear-gradient(180deg, #2A1D55 0%, #1C1440 100%)'
                  : 'linear-gradient(180deg, #f7fbff 0%, #fdf8ff 40%, #f8f5ff 100%)',
              borderColor: isGoldenDawn 
                ? GoldenDawnTheme.borders.gold
                : colors.isDark ? 'rgba(139, 92, 246, 0.2)' : colors.cardBorder,
              boxShadow: isGoldenDawn 
                ? GoldenDawnTheme.cards.shadow
                : '0 10px 30px rgba(0, 0, 0, 0.25)'
            }}
          >
            <div className="flex items-center gap-4">
              {(() => {
                const ElementIcon = elementIcons[preferredElement];
                return (
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{
                      background: isGoldenDawn
                        ? `linear-gradient(135deg, ${GoldenDawnTheme.primary.gold}, ${GoldenDawnTheme.primary.deepOrange})`
                        : colors.isDark
                          ? 'radial-gradient(circle at 30% 20%, #a78bfa 0%, #8b5cf6 60%, #4c1d95 100%)'
                          : 'radial-gradient(circle at 30% 20%, #76e4ff 0%, #3b82f6 60%, #1d1b4f 100%)'
                    }}
                  >
                    <ElementIcon className="w-7 h-7 text-white" />
                  </div>
                );
              })()}
              <div>
                <span className="text-sm font-medium" style={{ color: isGoldenDawn ? gdTextColors?.secondary : colors.isDark ? 'rgba(221, 214, 254, 0.85)' : colors.textSecondary }}>Current Element</span>
                <p className="font-serif text-lg" style={{ color: isGoldenDawn ? gdTextColors?.primary : colors.isDark ? '#ffffff' : colors.textPrimary }} data-testid="text-current-element">
                  {elementLabels[preferredElement]}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <Card 
          className={`p-6 md:p-8 backdrop-blur-sm rounded-2xl ${isGoldenDawn ? 'border-[#FAD792]/35' : ''}`}
          style={{
            background: isGoldenDawn
              ? GoldenDawnTheme.cards.background
              : colors.isDark 
                ? 'linear-gradient(180deg, #2A1D55 0%, #1C1440 100%)'
                : 'linear-gradient(180deg, #f7fbff 0%, #fdf8ff 40%, #f8f5ff 100%)',
            borderColor: isGoldenDawn 
              ? GoldenDawnTheme.borders.gold
              : colors.isDark ? 'rgba(139, 92, 246, 0.2)' : colors.cardBorder,
            boxShadow: isGoldenDawn 
              ? GoldenDawnTheme.cards.shadow
              : '0 10px 30px rgba(0, 0, 0, 0.25)'
          }}
        >
          <h3 className="font-sans font-semibold text-lg mb-3" style={{ color: isGoldenDawn ? gdTextColors?.primary : colors.isDark ? '#ffffff' : colors.textPrimary }}>Your Energy Profile</h3>
          <p className="font-serif leading-relaxed" style={{ color: isGoldenDawn ? gdTextColors?.secondary : colors.isDark ? 'rgba(221, 214, 254, 0.85)' : colors.textSecondary }} data-testid="text-energy-profile">
            {energyProfile}
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
