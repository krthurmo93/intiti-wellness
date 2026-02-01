import type { ZodiacSign, SpiritualStyle, BirthChart } from "@shared/schema";
import { elementMapping } from "@shared/schema";

// Archetype ID type for the 10 Blueprint archetypes
export type ArchetypeId =
  | "coreEssence"
  | "auraExpression"
  | "emotionalCore"
  | "mindVoice"
  | "heartMagnetism"
  | "driveDesire"
  | "growthCurrent"
  | "sacredDiscipline"
  | "northNodePath"
  | "southNodeComfort";

// Maps each archetype ID to its corresponding BirthChart field
export const ARCHETYPE_PLANET_MAP: Record<ArchetypeId, keyof BirthChart> = {
  coreEssence: "sunSign",
  auraExpression: "risingSign",
  emotionalCore: "moonSign",
  mindVoice: "mercurySign",
  heartMagnetism: "venusSign",
  driveDesire: "marsSign",
  growthCurrent: "jupiterSign",
  sacredDiscipline: "saturnSign",
  northNodePath: "northNodeSign",
  southNodeComfort: "southNodeSign",
};

// Archetype display labels
export const ARCHETYPE_LABELS: Record<ArchetypeId, string> = {
  coreEssence: "Core Essence",
  auraExpression: "Aura Expression",
  emotionalCore: "Emotional Core",
  mindVoice: "Mind & Voice",
  heartMagnetism: "Heart & Magnetism",
  driveDesire: "Drive & Desire",
  growthCurrent: "Growth Current",
  sacredDiscipline: "Sacred Discipline",
  northNodePath: "North Node Path",
  southNodeComfort: "South Node Comfort",
};

// Helper function to get sign from chart by archetype ID
export function getSignByArchetype(chart: Partial<BirthChart>, archetypeId: ArchetypeId): string | undefined {
  const field = ARCHETYPE_PLANET_MAP[archetypeId];
  return chart[field];
}

export interface ArchetypeInterpretation {
  archetype_name: string;
  essence: string;
  gift: string;
  shadow_challenge: string;
  healing_path: string;
  embodiment_message: string;
}

export interface EnergyInterpretation {
  processing: string;
  show_up: string;
  emotional_needs: string;
  patterns: string;
  rebalance: string;
}

// Venus-specific energy interpretation with relational fields
export interface VenusEnergyInterpretation {
  love_language: string;
  relational_style: string;
  emotional_needs: string;
  patterns: string;
  rebalance: string;
}

export interface VenusSignInterpretations {
  archetype: ArchetypeInterpretation;
  energy: VenusEnergyInterpretation;
  cosmic: CosmicInterpretation;
}

// Mercury-specific energy interpretation with mental/communication fields
export interface MercuryEnergyInterpretation {
  thinking_style: string;
  communication_style: string;
  mental_needs: string;
  patterns: string;
  rebalance: string;
}

export interface MercurySignInterpretations {
  archetype: ArchetypeInterpretation;
  energy: MercuryEnergyInterpretation;
  cosmic: CosmicInterpretation;
}

// Mars-specific energy interpretation with drive/conflict fields
export interface MarsEnergyInterpretation {
  drive_style: string;
  conflict_style: string;
  desire_energy: string;
  patterns: string;
  rebalance: string;
}

export interface MarsSignInterpretations {
  archetype: ArchetypeInterpretation;
  energy: MarsEnergyInterpretation;
  cosmic: CosmicInterpretation;
}

export interface CosmicInterpretation {
  brings: string;
  influences: string;
  teaches: string;
  supports: string;
}

// Jupiter Expansion Archetype - simpler structure
export interface JupiterInterpretation {
  archetype_name: string;
  core_theme: string;
  growth_path: string;
  shadow: string;
  affirmation: string;
}

// Saturn Mastery Archetype
export interface SaturnInterpretation {
  archetype_name: string;
  core_lesson: string;
  challenge: string;
  healing_practice: string;
  embodiment_message: string;
}

// North Node Soul Direction
export interface NorthNodeInterpretation {
  archetype_name: string;
  invitation: string;
  core_fear_to_release: string;
  aligned_actions: string;
}

// South Node Soul Memory
export interface SouthNodeInterpretation {
  archetype_name: string;
  what_feels_familiar: string;
  what_to_transcend: string;
  gift_to_keep: string;
}

// Release → Rise Arc - Combines South Node and North Node
export interface ReleaseRiseArc {
  title: string;
  summary: string;
  release: string;
  rise: string;
  bridge: string;
  reflection_prompt: string;
  daily_practice: string;
}

// Nodal axis key format: south_sign_north_sign
export type NodalAxisKey = `south_${Lowercase<ZodiacSign>}_north_${Lowercase<ZodiacSign>}`;

export interface SignInterpretations {
  archetype: ArchetypeInterpretation;
  energy: EnergyInterpretation;
  cosmic: CosmicInterpretation;
}

export const coreIdentityInterpretations: Record<ZodiacSign, SignInterpretations> = {
  Aries: {
    archetype: {
      archetype_name: "The Healing Flame",
      essence: "A warm spark that opens new pathways for growth.",
      gift: "Inspires courage, renewal, and emotional honesty.",
      shadow_challenge: "Reactivity when hurt or misunderstood.",
      healing_path: "Pause and soothe your inner fire before moving outward.",
      embodiment_message: "I lead with softness and strength."
    },
    energy: {
      processing: "You define yourself by movement, passion, and authenticity.",
      show_up: "Bold, expressive, and full of inner fire when safe.",
      emotional_needs: "Encouragement and freedom to express your ideas.",
      patterns: "Reacting quickly when overwhelmed.",
      rebalance: "Slow grounding practices and mindful breathing."
    },
    cosmic: {
      brings: "Courage, passion, and emotional renewal.",
      influences: "Your sense of identity and personal direction.",
      teaches: "To act from your heart, not from your wounds.",
      supports: "Helps you trust your spark even in stillness."
    }
  },
  Taurus: {
    archetype: {
      archetype_name: "The Grounded Healer",
      essence: "A calm presence that nurtures safety and stability.",
      gift: "Creates peace, comfort, and steady emotional grounding.",
      shadow_challenge: "Avoiding change or clinging to what feels familiar.",
      healing_path: "Invite small shifts and soften your attachment to certainty.",
      embodiment_message: "I am safe in change and steady in myself."
    },
    energy: {
      processing: "Your identity centers around comfort, trust, and steadiness.",
      show_up: "Warm, grounded, loyal, and dependable.",
      emotional_needs: "Predictability, support, and sensory calm.",
      patterns: "Holding onto situations beyond their growth.",
      rebalance: "Gentle movement, creativity, or sensory grounding."
    },
    cosmic: {
      brings: "Stability, patience, and quiet strength.",
      influences: "Your self-worth and emotional security.",
      teaches: "To move slowly and value your inner richness.",
      supports: "Roots you in what truly matters."
    }
  },
  Gemini: {
    archetype: {
      archetype_name: "The Healing Messenger",
      essence: "An airy presence full of curiosity and light.",
      gift: "Brings insight, connection, and emotional understanding.",
      shadow_challenge: "Scattering your energy when overwhelmed.",
      healing_path: "Slow your thoughts and breathe into what your heart is saying.",
      embodiment_message: "My voice carries truth and ease."
    },
    energy: {
      processing: "You explore your identity through learning and communication.",
      show_up: "Expressive, adaptable, thoughtful, and inquisitive.",
      emotional_needs: "Intellectual connection and variety.",
      patterns: "Overthinking or disconnecting during emotional intensity.",
      rebalance: "Journaling, breathwork, and mindful reflection."
    },
    cosmic: {
      brings: "Curiosity, insight, and mental movement.",
      influences: "Your thoughts, voice, and flexibility.",
      teaches: "To express truth even when emotions feel complex.",
      supports: "Helps you see multiple perspectives."
    }
  },
  Cancer: {
    archetype: {
      archetype_name: "The Heart Healer",
      essence: "Emotional intuition and soft nurturing energy.",
      gift: "Deep compassion and the ability to hold safe emotional space.",
      shadow_challenge: "Retreating into old wounds or absorbing others' emotions.",
      healing_path: "Build emotional boundaries while honoring sensitivity.",
      embodiment_message: "My heart is soft, strong, and sacred."
    },
    energy: {
      processing: "Your identity is shaped through emotional connection and belonging.",
      show_up: "Warm, intuitive, protective, and deeply caring.",
      emotional_needs: "Emotional safety and genuine understanding.",
      patterns: "Withdrawing when hurt or overwhelmed.",
      rebalance: "Rest, comfort rituals, and reconnecting to inner peace."
    },
    cosmic: {
      brings: "Sensitivity, intuition, and emotional depth.",
      influences: "Your inner world and emotional expression.",
      teaches: "To nurture yourself with tenderness.",
      supports: "Helps you trust your emotional truth."
    }
  },
  Leo: {
    archetype: {
      archetype_name: "The Radiant Heart",
      essence: "Creative fire and generous warmth.",
      gift: "Inspires joy, confidence, and soulful self-expression.",
      shadow_challenge: "Needing validation or feeling dimmed by others.",
      healing_path: "Anchor self-worth inside rather than seeking applause.",
      embodiment_message: "I shine because I am, not because I'm seen."
    },
    energy: {
      processing: "You define yourself through creativity, passion, and heartfelt expression.",
      show_up: "Charismatic, playful, generous, and inspiring.",
      emotional_needs: "Appreciation and space to express joyfully.",
      patterns: "Feeling unseen or under-acknowledged.",
      rebalance: "Creative play, self-affirmation, and joyful movement."
    },
    cosmic: {
      brings: "Passion, vitality, and warm presence.",
      influences: "Your purpose, identity, and inner light.",
      teaches: "To lead from authenticity instead of ego.",
      supports: "Encourages you to embrace your natural radiance."
    }
  },
  Virgo: {
    archetype: {
      archetype_name: "The Healing Vessel",
      essence: "A gentle, discerning energy that restores order and wellbeing.",
      gift: "Brings clarity, care, and grounded support to yourself and others.",
      shadow_challenge: "Self-criticism or feeling responsible for everything.",
      healing_path: "Soften expectations and allow yourself to be held, not just helpful.",
      embodiment_message: "I honor my wholeness, not just my improvements."
    },
    energy: {
      processing: "You define yourself through refinement, purpose, and meaningful contribution.",
      show_up: "Helpful, observant, thoughtful, and attentive.",
      emotional_needs: "Reassurance that you are enough as you are.",
      patterns: "Overanalyzing your worth or trying to fix everything.",
      rebalance: "Rest, nature, and releasing the need for perfection."
    },
    cosmic: {
      brings: "Clarity, purpose, and gentle structure.",
      influences: "Your self-expression and daily rhythms.",
      teaches: "That care begins within, not through performance.",
      supports: "Helps you live with intention and softness."
    }
  },
  Libra: {
    archetype: {
      archetype_name: "The Harmonizing Light",
      essence: "A soothing presence that brings balance, grace, and connection.",
      gift: "Creates harmony, beauty, and emotional understanding.",
      shadow_challenge: "Losing yourself while trying to maintain peace.",
      healing_path: "Choose authenticity over pleasing; honor your true needs.",
      embodiment_message: "My peace begins with my truth."
    },
    energy: {
      processing: "You understand yourself through relationships and emotional reflection.",
      show_up: "Charming, collaborative, empathetic, and fair-minded.",
      emotional_needs: "Balanced connection and emotional reciprocity.",
      patterns: "Avoiding conflict by silencing your own needs.",
      rebalance: "Check in with your inner voice before responding to others."
    },
    cosmic: {
      brings: "Harmony, beauty, and relational insight.",
      influences: "Your identity through connection and companionship.",
      teaches: "To stand in your truth even when seeking peace.",
      supports: "Helps you create loving, balanced connections."
    }
  },
  Scorpio: {
    archetype: {
      archetype_name: "The Transforming Soul",
      essence: "A deep emotional current that seeks truth, healing, and rebirth.",
      gift: "Sees beneath the surface and guides others toward transformation.",
      shadow_challenge: "Holding emotional intensity without release.",
      healing_path: "Allow vulnerability and trust the process of letting go.",
      embodiment_message: "My depth is a doorway, not a burden."
    },
    energy: {
      processing: "You define yourself through emotional truth and inner strength.",
      show_up: "Intuitive, magnetic, perceptive, and deeply loyal.",
      emotional_needs: "Authenticity, trust, and emotional safety.",
      patterns: "Withholding emotions or expecting abandonment.",
      rebalance: "Shadow work, grounding, and safe emotional expression."
    },
    cosmic: {
      brings: "Depth, passion, and transformative energy.",
      influences: "Your healing journey and emotional presence.",
      teaches: "To rise from what you release.",
      supports: "Guides you toward powerful inner rebirth."
    }
  },
  Sagittarius: {
    archetype: {
      archetype_name: "The Expanding Flame",
      essence: "A bright, open spirit seeking meaning, growth, and freedom.",
      gift: "Brings optimism, wisdom, and expansive healing energy.",
      shadow_challenge: "Avoidance of emotional depth or responsibility.",
      healing_path: "Ground your fire in mindfulness and presence.",
      embodiment_message: "My freedom grows deeper when I face myself honestly."
    },
    energy: {
      processing: "You understand yourself through exploration, truth, and possibility.",
      show_up: "Energetic, expressive, curious, and uplifting.",
      emotional_needs: "Space to grow, explore, and express without limits.",
      patterns: "Escaping discomfort instead of sitting with it.",
      rebalance: "Mindful grounding, journaling, and intentional stillness."
    },
    cosmic: {
      brings: "Optimism, expansion, and spiritual fire.",
      influences: "Your worldview and sense of purpose.",
      teaches: "To balance curiosity with commitment.",
      supports: "Encourages meaning, exploration, and growth."
    }
  },
  Capricorn: {
    archetype: {
      archetype_name: "The Sacred Mountain",
      essence: "A steady, enduring presence rooted in purpose and resilience.",
      gift: "Brings structure, wisdom, and grounded leadership.",
      shadow_challenge: "Carrying too much alone or tying worth to achievement.",
      healing_path: "Release the belief that you must earn rest or love.",
      embodiment_message: "I honor my limits and let softness guide my strength."
    },
    energy: {
      processing: "You define yourself through purpose, responsibility, and inner discipline.",
      show_up: "Reliable, thoughtful, intentional, and resilient.",
      emotional_needs: "Stability, respect, and a sense of progress.",
      patterns: "Overworking or suppressing emotions.",
      rebalance: "Rest, warmth, emotional expression, and grounding rituals."
    },
    cosmic: {
      brings: "Structure, wisdom, and long-term vision.",
      influences: "Your ambitions and your sense of identity.",
      teaches: "To soften without losing your strength.",
      supports: "Helps you build a life aligned with your integrity."
    }
  },
  Aquarius: {
    archetype: {
      archetype_name: "The Visionary Healer",
      essence: "A future-focused spirit with a gift for insight and innovation.",
      gift: "Brings clarity, originality, and emotional spaciousness.",
      shadow_challenge: "Detaching from emotions to avoid vulnerability.",
      healing_path: "Let your heart into the places your mind already sees.",
      embodiment_message: "My openness creates connection and evolution."
    },
    energy: {
      processing: "You understand yourself through ideas, purpose, and individuality.",
      show_up: "Unique, intuitive, observant, and quietly impactful.",
      emotional_needs: "Freedom, authenticity, and mental connection.",
      patterns: "Emotional distancing or feeling misunderstood.",
      rebalance: "Heart-centered practices, grounding, and relational presence."
    },
    cosmic: {
      brings: "Insight, innovation, and soulful independence.",
      influences: "Your presence, identity, and worldview.",
      teaches: "To honor both your heart and your uniqueness.",
      supports: "Helps you channel your gifts into collective healing."
    }
  },
  Pisces: {
    archetype: {
      archetype_name: "The Dream Weaver",
      essence: "A compassionate, intuitive soul connected to the unseen.",
      gift: "Brings empathy, imagination, and gentle emotional healing.",
      shadow_challenge: "Absorbing too much or drifting into escape.",
      healing_path: "Anchor yourself in boundaries that protect your softness.",
      embodiment_message: "My sensitivity is sacred, and I keep it safe."
    },
    energy: {
      processing: "You define yourself through intuition, feeling, and spiritual depth.",
      show_up: "Soft, empathetic, imaginative, and healing.",
      emotional_needs: "Understanding, softness, and intuitive connection.",
      patterns: "Over-idealizing or absorbing emotional weight.",
      rebalance: "Grounding, creativity, and safe emotional expression."
    },
    cosmic: {
      brings: "Spiritual depth, compassion, and intuitive flow.",
      influences: "Your inner world and emotional identity.",
      teaches: "To trust your intuition while holding healthy boundaries.",
      supports: "Helps you merge imagination with grounded empathy."
    }
  }
};

export const emotionalLandscapeInterpretations: Record<ZodiacSign, SignInterpretations> = {
  Aries: {
    archetype: {
      archetype_name: "The Tender Flame",
      essence: "A passionate emotional core that feels deeply and reacts instinctively.",
      gift: "Your heart moves with honesty, courage, and pure feeling.",
      shadow_challenge: "Emotions may erupt quickly when you feel unsafe or unseen.",
      healing_path: "Slow your inner fire with softness before responding; offer comfort to your younger self.",
      embodiment_message: "My emotions deserve patience, presence, and gentleness."
    },
    energy: {
      processing: "You feel first and think later, experiencing emotions with intensity.",
      show_up: "Direct, expressive, and emotionally brave.",
      emotional_needs: "Reassurance, immediate sincerity, and space to release feelings safely.",
      patterns: "Impulsive emotional reactions or feeling abandoned when misunderstood.",
      rebalance: "Breathwork, grounding touch, and compassionate self-reflection."
    },
    cosmic: {
      brings: "Passion, immediacy, and emotional honesty.",
      influences: "Your instinctive reactions and emotional courage.",
      teaches: "To honor your fire without burning yourself.",
      supports: "Helps you move through emotions rather than hold them."
    }
  },
  Taurus: {
    archetype: {
      archetype_name: "The Inner Sanctuary",
      essence: "A calm emotional core that seeks stability, comfort, and peace.",
      gift: "Your presence soothes others and creates emotional grounding.",
      shadow_challenge: "Resistance to emotional change or holding onto old hurts.",
      healing_path: "Allow slow, gentle shifts and trust that you are safe even in transition.",
      embodiment_message: "My emotional world is a sanctuary I can trust."
    },
    energy: {
      processing: "You feel deeply but steadily, preferring predictable emotional rhythms.",
      show_up: "Loyal, nurturing, patient, and emotionally devoted.",
      emotional_needs: "Consistency, physical comfort, and emotional reliability.",
      patterns: "Difficulty letting go or avoiding emotional disruptions.",
      rebalance: "Nature, grounding rituals, and sensory comfort."
    },
    cosmic: {
      brings: "Steadiness, warmth, and emotional reliability.",
      influences: "Your emotional security and inner peace.",
      teaches: "To trust your heart's slow unfolding.",
      supports: "Helps you create lasting emotional roots."
    }
  },
  Gemini: {
    archetype: {
      archetype_name: "The Emotional Interpreter",
      essence: "An airy emotional core that processes feelings through thought and communication.",
      gift: "Brings clarity, understanding, and emotional intelligence.",
      shadow_challenge: "Overthinking feelings or disconnecting when overwhelmed.",
      healing_path: "Gently drop from your mind into your body, feeling instead of analyzing.",
      embodiment_message: "I allow my heart and mind to speak to each other softly."
    },
    energy: {
      processing: "You understand emotions by naming them, discussing them, or writing them.",
      show_up: "Expressive, curious, thoughtful, and emotionally adaptable.",
      emotional_needs: "Conversation, variety, and emotional clarity.",
      patterns: "Emotional detachment or nervous overstimulation.",
      rebalance: "Breathing exercises, journaling, and grounding presence."
    },
    cosmic: {
      brings: "Curiosity, expression, and emotional intelligence.",
      influences: "Your inner dialogue and emotional communication.",
      teaches: "To feel without needing to solve everything.",
      supports: "Helps you reframe emotions into understanding."
    }
  },
  Cancer: {
    archetype: {
      archetype_name: "The Heart's Guardian",
      essence: "A deeply intuitive emotional core shaped by memory, sensitivity, and instinct.",
      gift: "You feel emotions with sacred depth and nurture others naturally.",
      shadow_challenge: "Carrying emotional weight that isn't yours or clinging to the past.",
      healing_path: "Set loving boundaries and let yourself receive the care you give.",
      embodiment_message: "My tenderness is strength, and I protect it wisely."
    },
    energy: {
      processing: "You feel through intuition, memory, and emotional resonance.",
      show_up: "Warm, nurturing, protective, and emotionally attuned.",
      emotional_needs: "Safety, familiarity, and emotional reassurance.",
      patterns: "Withdrawing, absorbing others' pain, or feeling overwhelmed by nostalgia.",
      rebalance: "Rest, gentle self-soothing, and emotional grounding practices."
    },
    cosmic: {
      brings: "Depth, intuition, and emotional wisdom.",
      influences: "Your emotional responses and inner world.",
      teaches: "To nurture yourself with the same devotion you offer others.",
      supports: "Helps you trust emotional cycles and release with grace."
    }
  },
  Leo: {
    archetype: {
      archetype_name: "The Inner Sun",
      essence: "A warm emotional core that shines through love, expression, and creativity.",
      gift: "Radiates joy, generosity, and heartfelt emotional warmth.",
      shadow_challenge: "Feeling unseen, unappreciated, or emotionally dismissed.",
      healing_path: "Reclaim validation from within; let your heart shine for you first.",
      embodiment_message: "My heart glows from authenticity, not approval."
    },
    energy: {
      processing: "You feel emotions dramatically, openly, and with sincerity.",
      show_up: "Affectionate, expressive, loyal, and emotionally vibrant.",
      emotional_needs: "Recognition, affection, honest connection, and appreciation.",
      patterns: "Emotional deflation when unnoticed or misunderstood.",
      rebalance: "Creative expression, warmth, joyful rituals, and affirmations."
    },
    cosmic: {
      brings: "Creativity, warmth, and expressive passion.",
      influences: "Your emotional confidence and the way you love.",
      teaches: "To shine regardless of external validation.",
      supports: "Helps your heart remain open and radiant."
    }
  },
  Virgo: {
    archetype: {
      archetype_name: "The Gentle Analyst",
      essence: "A thoughtful emotional core that seeks clarity, order, and quiet care.",
      gift: "You notice what needs healing and bring practical support to yourself and others.",
      shadow_challenge: "Turning that observation inward as harsh self-judgment.",
      healing_path: "Replace inner criticism with inner reassurance and small acts of self-kindness.",
      embodiment_message: "I am worthy of grace, not just improvement."
    },
    energy: {
      processing: "You process emotions by analyzing them and trying to understand their roots.",
      show_up: "Helpful, attentive, considerate, and emotionally precise.",
      emotional_needs: "Reassurance that you are enough, even when things aren't perfect.",
      patterns: "Overthinking feelings or fixing instead of feeling.",
      rebalance: "Body-based grounding, rest, and simple, nurturing routines."
    },
    cosmic: {
      brings: "Clarity, discernment, and gentle emotional structure.",
      influences: "How you tend to your inner world and daily wellbeing.",
      teaches: "That tenderness is more healing than perfection.",
      supports: "Helps you create calm, supportive emotional rituals."
    }
  },
  Libra: {
    archetype: {
      archetype_name: "The Heart Balancer",
      essence: "An emotional core seeking harmony, mutual care, and understanding.",
      gift: "You sense others' feelings and create soothing emotional spaces.",
      shadow_challenge: "Over-giving or silencing your needs to keep the peace.",
      healing_path: "Let your heart speak honestly, even if it shakes the balance at first.",
      embodiment_message: "My feelings deserve a voice, not just a smile."
    },
    energy: {
      processing: "You process emotions through reflection, comparison, and relationship dynamics.",
      show_up: "Diplomatic, warm, cooperative, and emotionally aware.",
      emotional_needs: "Reciprocity, fairness, and emotionally respectful connections.",
      patterns: "Avoiding conflict by dismissing your own discomfort.",
      rebalance: "Honest conversations, journaling, and tuning into what you truly feel."
    },
    cosmic: {
      brings: "Harmony, grace, and relational sensitivity.",
      influences: "How you experience connection and emotional exchange.",
      teaches: "To honor your needs as equally important as others'.",
      supports: "Helps you cultivate balanced, loving emotional bonds."
    }
  },
  Scorpio: {
    archetype: {
      archetype_name: "The Depth Keeper",
      essence: "An intense emotional core that feels truth beneath the surface.",
      gift: "You hold powerful space for transformation, honesty, and deep healing.",
      shadow_challenge: "Holding onto pain or expecting betrayal before safety.",
      healing_path: "Trust safe connections, express feelings slowly, and allow yourself to be witnessed.",
      embodiment_message: "My depth is sacred, and I choose where it is received."
    },
    energy: {
      processing: "You process emotions in layers, rarely feeling anything halfway.",
      show_up: "Loyal, intuitive, magnetic, and emotionally perceptive.",
      emotional_needs: "Trust, emotional honesty, and profound connection.",
      patterns: "Withholding feelings, testing loyalty, or internalizing hurt.",
      rebalance: "Shadow work, safe emotional release, and grounding practices."
    },
    cosmic: {
      brings: "Intensity, passion, and emotional transformation.",
      influences: "Your healing journey and emotional boundaries.",
      teaches: "To release what no longer serves your heart.",
      supports: "Guides you toward rebirth through emotional truth."
    }
  },
  Sagittarius: {
    archetype: {
      archetype_name: "The Hopeful Wanderer",
      essence: "An emotional core that seeks meaning, freedom, and expanded horizons.",
      gift: "You bring optimism, perspective, and emotional uplift to heavy spaces.",
      shadow_challenge: "Escaping deeper feelings by staying 'above' them.",
      healing_path: "Let yourself feel the full truth, then gently search for the lesson within it.",
      embodiment_message: "My emotions are safe to explore, not avoid."
    },
    energy: {
      processing: "You process emotions through seeking purpose, wisdom, or bigger-picture understanding.",
      show_up: "Hopeful, expressive, adventurous, and emotionally open when safe.",
      emotional_needs: "Honesty, space, and room to grow and explore.",
      patterns: "Minimizing your pain or distracting yourself when things feel too heavy.",
      rebalance: "Mindful reflection, grounding movement, and intentional stillness."
    },
    cosmic: {
      brings: "Expansion, enthusiasm, and emotional faith.",
      influences: "How you cope with challenges and search for meaning.",
      teaches: "To honor both your lightness and your depth.",
      supports: "Encourages growth through emotional honesty and hope."
    }
  },
  Capricorn: {
    archetype: {
      archetype_name: "The Inner Anchor",
      essence: "A contained emotional core that values strength, stability, and responsibility.",
      gift: "You hold steady when others are overwhelmed, offering grounded support.",
      shadow_challenge: "Suppressing feelings or believing you must carry everything alone.",
      healing_path: "Allow yourself to be cared for and express vulnerability without shame.",
      embodiment_message: "My emotions deserve rest, softness, and support."
    },
    energy: {
      processing: "You process emotions carefully, often keeping them private until you feel secure.",
      show_up: "Reliable, composed, thoughtful, and emotionally reserved at first.",
      emotional_needs: "Respect, stability, and a sense of emotional competence.",
      patterns: "Downplaying your needs or turning emotions into work.",
      rebalance: "Rest, warmth, safe emotional expression, and reparenting practices."
    },
    cosmic: {
      brings: "Resilience, patience, and emotional endurance.",
      influences: "Your coping mechanisms and emotional responsibilities.",
      teaches: "That softness is not weakness.",
      supports: "Helps you build safe inner foundations for your feelings."
    }
  },
  Aquarius: {
    archetype: {
      archetype_name: "The Sky Witness",
      essence: "An emotionally observant core that seeks understanding and perspective.",
      gift: "You can hold space with clarity, offering calm insight in emotional storms.",
      shadow_challenge: "Staying in your head to avoid feeling too much.",
      healing_path: "Let your heart participate in what your mind is watching from afar.",
      embodiment_message: "It is safe for me to feel and still be free."
    },
    energy: {
      processing: "You process emotions intellectually first, stepping back to observe.",
      show_up: "Cool, thoughtful, unique, and emotionally spacious.",
      emotional_needs: "Freedom, understanding, and non-judgmental connection.",
      patterns: "Detaching, feeling misunderstood, or minimizing your own needs.",
      rebalance: "Heart-focused practices, somatic grounding, and authentic sharing."
    },
    cosmic: {
      brings: "Insight, emotional detachment, and visionary awareness.",
      influences: "How you navigate feelings in groups and connections.",
      teaches: "To integrate heart and mind without losing yourself.",
      supports: "Helps you create emotionally honest, spacious connections."
    }
  },
  Pisces: {
    archetype: {
      archetype_name: "The Soul Dreamer",
      essence: "A deeply sensitive emotional core tuned into subtle realms and unseen feelings.",
      gift: "You hold immense compassion, imagination, and intuitive healing energy.",
      shadow_challenge: "Absorbing others' emotions or drifting into escape.",
      healing_path: "Strengthen your boundaries while honoring your softness as a sacred gift.",
      embodiment_message: "My sensitivity is powerful, and I choose where it flows."
    },
    energy: {
      processing: "You feel emotions like waves, often picking up on the moods around you.",
      show_up: "Gentle, empathetic, dreamy, and spiritually attuned.",
      emotional_needs: "Safety, understanding, quiet, and soul-level connection.",
      patterns: "Over-merging with others or numbing when things feel too intense.",
      rebalance: "Grounding rituals, creativity, spiritual hygiene, and alone time."
    },
    cosmic: {
      brings: "Compassion, intuition, and emotional depth.",
      influences: "Your inner world and spiritual sensitivity.",
      teaches: "To protect your energy while staying open-hearted.",
      supports: "Helps you transform emotion into art, empathy, and healing."
    }
  }
};

// Aura Expression interpretations - Rising sign specific content
// Rising sign represents how you appear to others and your outer expression
export const auraExpressionInterpretations: Record<ZodiacSign, SignInterpretations> = {
  Aries: {
    archetype: {
      archetype_name: "The Dawn Warrior",
      essence: "Your aura carries a spark of initiation, freshness, and forward movement.",
      gift: "You inspire action and confidence wherever you go.",
      shadow_challenge: "Your bold energy can feel intense or rushed to softer souls.",
      healing_path: "Lead with warmth first, fire second, allowing others to join you at their pace.",
      embodiment_message: "I arrive with courage, presence, and an open heart."
    },
    energy: {
      processing: "You meet the world head-on, forging paths with instinctive clarity.",
      show_up: "Dynamic, direct, passionate, and visibly driven.",
      emotional_needs: "Momentum, bravery, and energizing inspiration.",
      patterns: "Starting fast, feeling impatient, or taking on too much alone.",
      rebalance: "Slow intentional movement, grounding breath, and mindful pacing."
    },
    cosmic: {
      brings: "A spark of initiation and fearless expression.",
      influences: "How you take risks, make decisions, and approach new spaces.",
      teaches: "To lead from authenticity, not urgency.",
      supports: "Encourages bold, confident alignment with your purpose."
    }
  },
  Taurus: {
    archetype: {
      archetype_name: "The Earth Presence",
      essence: "Your aura feels grounding, calm, steady, and soothing to others.",
      gift: "You create emotional and energetic stability wherever you go.",
      shadow_challenge: "Your stillness may be misread as resistance or detachment.",
      healing_path: "Allow gentle flexibility to mingle with your rooted energy.",
      embodiment_message: "I move through life with grace, steadiness, and quiet power."
    },
    energy: {
      processing: "You approach the world slowly and intentionally.",
      show_up: "Calm, warm, reliable, and sensually attuned.",
      emotional_needs: "Peace, comfort, and unhurried confidence.",
      patterns: "Holding onto routines too tightly or resisting change.",
      rebalance: "Movement, sensory grounding, creativity, and soft expansion."
    },
    cosmic: {
      brings: "Stability, ease, and a grounding presence.",
      influences: "Your pace, your aesthetic, and how others perceive your energy.",
      teaches: "To honor both steadiness and growth.",
      supports: "Helps you anchor into embodied wisdom."
    }
  },
  Gemini: {
    archetype: {
      archetype_name: "The Air Weaver",
      essence: "Your aura is light, curious, expressive, and ever-shifting.",
      gift: "You connect easily, spark conversation, and make people feel seen.",
      shadow_challenge: "Your changing energy may confuse those seeking consistency.",
      healing_path: "Breathe into your center and let your presence settle between movements.",
      embodiment_message: "My energy flows with clarity, curiosity, and intention."
    },
    energy: {
      processing: "You meet the world through observation, communication, and adaptability.",
      show_up: "Quick, expressive, witty, open, and mentally agile.",
      emotional_needs: "Fresh ideas, approachability, and vibrant social sparkle.",
      patterns: "Overextending energy or scattering your focus.",
      rebalance: "Stillness, breathwork, mindful grounding, gentle structure."
    },
    cosmic: {
      brings: "Movement, connection, and lively curiosity.",
      influences: "Your social presence and first impressions.",
      teaches: "To express authentically rather than perform.",
      supports: "Helps you connect the dots between people, ideas, and energy."
    }
  },
  Cancer: {
    archetype: {
      archetype_name: "The Lunar Veil",
      essence: "Your aura feels intuitive, soft, protective, and emotionally attuned.",
      gift: "You create safe emotional space without needing words.",
      shadow_challenge: "Your sensitivity may lead you to hide or shield yourself too quickly.",
      healing_path: "Trust that your softness can be both protected and expressed.",
      embodiment_message: "My presence comforts, nurtures, and gently guides."
    },
    energy: {
      processing: "You meet the world through emotional awareness and intuitive sensing.",
      show_up: "Warm, receptive, empathetic, and quietly observant.",
      emotional_needs: "Safety, nostalgia, gentleness, and emotional wisdom.",
      patterns: "Retreating at first or taking on others' feelings.",
      rebalance: "Energetic boundaries, soothing rituals, and reflective solitude."
    },
    cosmic: {
      brings: "Nurturing intuition and emotional resonance.",
      influences: "Your first impressions and interpersonal atmosphere.",
      teaches: "To balance openness with protection.",
      supports: "Helps others feel held and understood through your presence."
    }
  },
  Leo: {
    archetype: {
      archetype_name: "The Solar Aura",
      essence: "Your aura shines warm, bold, expressive, and magnetically confident.",
      gift: "You uplift and energize people simply by being yourself.",
      shadow_challenge: "Your brightness may feel overwhelming to those not ready for openness.",
      healing_path: "Let your radiance soften so your warmth can reach more hearts.",
      embodiment_message: "I shine with heart-centered courage and generous light."
    },
    energy: {
      processing: "You meet the world with expressive enthusiasm and a desire to inspire.",
      show_up: "Charismatic, warm, playful, and naturally captivating.",
      emotional_needs: "Joy, confidence, and creative vitality.",
      patterns: "Feeling dimmed by lack of recognition or shrinking yourself to fit in.",
      rebalance: "Creative play, joyful movement, and heart-opening practices."
    },
    cosmic: {
      brings: "Warmth, creativity, and generous solar energy.",
      influences: "Your initial presence and how you step into spaces.",
      teaches: "To shine without needing approval.",
      supports: "Helps you lead with authenticity and heart."
    }
  },
  Virgo: {
    archetype: {
      archetype_name: "The Subtle Guide",
      essence: "Your aura is clean, calm, attentive, and quietly wise.",
      gift: "You help others feel grounded, understood, and gently organized.",
      shadow_challenge: "Your reserved presence may be mistaken for distance or judgment.",
      healing_path: "Let yourself be seen without needing everything to feel 'ready' first.",
      embodiment_message: "My presence brings clarity, care, and quiet strength."
    },
    energy: {
      processing: "You meet the world with thoughtful observation and mindful attention.",
      show_up: "Soft-spoken, intentional, detail-oriented, and naturally supportive.",
      emotional_needs: "Calm intelligence, discernment, and trustworthy energy.",
      patterns: "Withholding your shine or over-managing your image.",
      rebalance: "Grounding breath, gentle movement, and releasing perfection."
    },
    cosmic: {
      brings: "Clarity, refinement, and mindful presence.",
      influences: "Your appearance, tone, and first energetic signature.",
      teaches: "To lead through subtlety and sincerity.",
      supports: "Helps you create harmony through small, meaningful shifts."
    }
  },
  Libra: {
    archetype: {
      archetype_name: "The Graceful Mirror",
      essence: "Your aura feels warm, harmonious, socially attuned, and inviting.",
      gift: "You help others feel seen, understood, and emotionally balanced.",
      shadow_challenge: "You may hide your true feelings to keep interactions smooth.",
      healing_path: "Let your authenticity guide your connections, even if it disrupts symmetry.",
      embodiment_message: "My presence is beautiful because it is honest."
    },
    energy: {
      processing: "You meet the world through connection, reflection, and gentle diplomacy.",
      show_up: "Charming, warm, approachable, and peaceful.",
      emotional_needs: "Balance, finesse, and soft relational intelligence.",
      patterns: "People-pleasing or avoiding direct emotional expression.",
      rebalance: "Boundaries, self-inquiry, and honest communication."
    },
    cosmic: {
      brings: "Harmony, relatable elegance, and refined energy.",
      influences: "Your social presence and interpersonal magnetism.",
      teaches: "To honor your needs even as you connect with others.",
      supports: "Helps you cultivate compassionate, balanced interactions."
    }
  },
  Scorpio: {
    archetype: {
      archetype_name: "The Magnetic Shadow",
      essence: "Your aura is deep, mysterious, and powerfully intuitive.",
      gift: "You sense the truth beneath the surface and draw others into authenticity.",
      shadow_challenge: "Your intensity may feel intimidating or hard to approach.",
      healing_path: "Let your softness show gradually to balance your powerful presence.",
      embodiment_message: "My depth is grounding, healing, and intentionally shared."
    },
    energy: {
      processing: "You meet the world with emotional x-ray vision and quiet perception.",
      show_up: "Mysterious, observant, alluring, and energetically powerful.",
      emotional_needs: "Depth, focus, and transformative presence.",
      patterns: "Guarding your energy too tightly or expecting hidden motives.",
      rebalance: "Emotional release, grounding rituals, and trusting safe people."
    },
    cosmic: {
      brings: "Intensity, transformation, and intuitive clarity.",
      influences: "Your boundaries, aura strength, and first impression.",
      teaches: "To soften without losing depth.",
      supports: "Helps you inspire emotional truth in others."
    }
  },
  Sagittarius: {
    archetype: {
      archetype_name: "The Horizon Seeker",
      essence: "Your aura is bright, open, optimistic, and expansive.",
      gift: "You uplift others with perspective, humor, and free-spirited warmth.",
      shadow_challenge: "Your openness may feel ungrounded or unpredictable to some.",
      healing_path: "Anchor your fire in presence so your joy reaches more hearts.",
      embodiment_message: "My spirit inspires freedom, meaning, and authentic joy."
    },
    energy: {
      processing: "You meet the world through exploration, curiosity, and enthusiasm.",
      show_up: "Playful, direct, expressive, and energetically large.",
      emotional_needs: "Hope, possibility, and contagious excitement.",
      patterns: "Restlessness or overextending your energy.",
      rebalance: "Grounding movement, mindful breath, and intentional reflection."
    },
    cosmic: {
      brings: "Optimism, fire, and expansive awareness.",
      influences: "Your social approach and worldview expression.",
      teaches: "To move with purpose, not just momentum.",
      supports: "Helps you spread light while staying rooted."
    }
  },
  Capricorn: {
    archetype: {
      archetype_name: "The Quiet Mountain",
      essence: "Your aura feels steady, composed, wise, and grounded.",
      gift: "You radiate reliability, structure, and calm leadership.",
      shadow_challenge: "Your seriousness may cause others to misread you as guarded.",
      healing_path: "Let warmth soften your edges so your wisdom becomes more accessible.",
      embodiment_message: "My presence is strong, grounded, and gracefully open."
    },
    energy: {
      processing: "You meet the world with purpose and disciplined awareness.",
      show_up: "Dependable, composed, self-contained, and observant.",
      emotional_needs: "Stability, maturity, and quiet authority.",
      patterns: "Over-responsibility or emotional withholding.",
      rebalance: "Rest, warmth, safe vulnerability, and mindful stillness."
    },
    cosmic: {
      brings: "Structure, ambition, and grounded clarity.",
      influences: "Your approach to challenges and personal presentation.",
      teaches: "To trust both discipline and softness.",
      supports: "Helps you embody wise, steady presence."
    }
  },
  Aquarius: {
    archetype: {
      archetype_name: "The Ether Visionary",
      essence: "Your aura is innovative, open-minded, and uniquely detached from convention.",
      gift: "You inspire others through originality, insight, and refreshing perspective.",
      shadow_challenge: "Your emotional distance may confuse those craving warmth.",
      healing_path: "Let small moments of humanity mix with your cosmic insight.",
      embodiment_message: "My presence expands awareness while staying rooted in heart."
    },
    energy: {
      processing: "You meet the world with curiosity and quiet observation.",
      show_up: "Unique, progressive, free-spirited, and slightly enigmatic.",
      emotional_needs: "Innovation, clarity, and energetic spaciousness.",
      patterns: "Emotional detachment or resisting conformity at all costs.",
      rebalance: "Heart-centered grounding, community, and gentle vulnerability."
    },
    cosmic: {
      brings: "Insight, unconventional wisdom, and airy fluidity.",
      influences: "Your energetic presence and social dynamics.",
      teaches: "To balance individuality with connection.",
      supports: "Helps you express authenticity with compassion."
    }
  },
  Pisces: {
    archetype: {
      archetype_name: "The Mist Walker",
      essence: "Your aura feels dreamy, ethereal, intuitive, and spiritually fluid.",
      gift: "You make others feel understood without needing many words.",
      shadow_challenge: "Your softness may blur boundaries or attract draining energies.",
      healing_path: "Strengthen your energetic container while keeping your heart open.",
      embodiment_message: "My presence is intuitive, gentle, and divinely guided."
    },
    energy: {
      processing: "You meet the world through emotion, imagination, and subtle perception.",
      show_up: "Soft, fluid, compassionate, and artistically expressive.",
      emotional_needs: "Mystery, intuition, and emotional openness.",
      patterns: "Absorbing energy, drifting, or becoming overwhelmed.",
      rebalance: "Grounding rituals, energy protection, and creative release."
    },
    cosmic: {
      brings: "Spiritual sensitivity, compassion, and flow.",
      influences: "Your empathic presence and intuitive navigation.",
      teaches: "To merge imagination with grounded clarity.",
      supports: "Helps you glow with quiet, soulful wisdom."
    }
  }
};

// Heart Archetype interpretations - Venus sign specific content
// Venus sign represents how you love, relate, and experience beauty
export const heartArchetypeInterpretations: Record<ZodiacSign, VenusSignInterpretations> = {
  Aries: {
    archetype: {
      archetype_name: "The Passionate Initiator",
      essence: "Your heart loves boldly, directly, and with fierce sincerity.",
      gift: "You bring excitement, honesty, and spark into relationships.",
      shadow_challenge: "You may rush or lose patience when vulnerability feels slow.",
      healing_path: "Let your heart breathe before reacting; let desire meet tenderness.",
      embodiment_message: "My love is powerful, courageous, and guided by softness."
    },
    energy: {
      love_language: "Passion, spontaneity, direct affection, and clear desire.",
      relational_style: "Warm, eager, expressive, and open-hearted when safe.",
      emotional_needs: "Reciprocity, honesty, enthusiasm, and active love.",
      patterns: "Impatience, impulsivity, or needing connection to feel alive.",
      rebalance: "Slow intimacy, grounding breath, and emotional presence."
    },
    cosmic: {
      brings: "Heat, courage, and youthful romantic energy.",
      influences: "How you pursue love and express affection.",
      teaches: "To blend passion with patience.",
      supports: "Helps you love boldly without burning out."
    }
  },
  Taurus: {
    archetype: {
      archetype_name: "The Sensual Ground",
      essence: "Your heart loves through comfort, devotion, and steady presence.",
      gift: "You create safety, warmth, and deep loyalty in relationships.",
      shadow_challenge: "Attachment or resistance to emotional change.",
      healing_path: "Trust that love can evolve without losing stability.",
      embodiment_message: "My love is steady, sensual, and deeply rooted."
    },
    energy: {
      love_language: "Touch, time, consistency, and sensory intimacy.",
      relational_style: "Patient, nurturing, reliable, and grounded.",
      emotional_needs: "Safety, physical closeness, and emotional predictability.",
      patterns: "Possessiveness or holding on too tightly.",
      rebalance: "Movement, breath, gentle openness, and softening routines."
    },
    cosmic: {
      brings: "Stability, sensuality, and deep devotion.",
      influences: "How you build bonds and commit emotionally.",
      teaches: "To love without clinging.",
      supports: "Helps you root relationships in trust and warmth."
    }
  },
  Gemini: {
    archetype: {
      archetype_name: "The Heart Communicator",
      essence: "Your love flows through curiosity, laughter, and intellectual connection.",
      gift: "You bring playfulness, insight, and mental chemistry into relationships.",
      shadow_challenge: "Emotional inconsistency or restlessness.",
      healing_path: "Let your heart settle into presence rather than possibility.",
      embodiment_message: "My love is expressive, curious, and connected."
    },
    energy: {
      love_language: "Words, conversation, shared ideas, and playful communication.",
      relational_style: "Engaging, witty, adaptable, and communicative.",
      emotional_needs: "Mental stimulation, variety, and emotional understanding.",
      patterns: "Avoidance of emotional depth or detaching under pressure.",
      rebalance: "Stillness, grounding, honest dialogue, and mindful listening."
    },
    cosmic: {
      brings: "Lightness, connection, and lively affection.",
      influences: "How you flirt, bond, and express your heart.",
      teaches: "To bring consistency to connection.",
      supports: "Helps you love through communication and shared truth."
    }
  },
  Cancer: {
    archetype: {
      archetype_name: "The Heart Protector",
      essence: "Your love is nurturing, intuitive, and emotionally rich.",
      gift: "You hold your partners with deep care and emotional warmth.",
      shadow_challenge: "Overgiving, attachment, or taking things personally.",
      healing_path: "Love others deeply without abandoning yourself.",
      embodiment_message: "My love is tender, intuitive, and safely expressed."
    },
    energy: {
      love_language: "Emotional presence, affection, quality time, and care.",
      relational_style: "Soft, intuitive, protective, and devoted.",
      emotional_needs: "Safety, reassurance, and emotional reciprocity.",
      patterns: "Clinging, moodiness, or withdrawing when hurt.",
      rebalance: "Boundary work, rest, emotional replenishment."
    },
    cosmic: {
      brings: "Nurturing compassion and intuitive love.",
      influences: "Your bonds, attachments, and emotional rhythms.",
      teaches: "To nurture without over-merging.",
      supports: "Helps love feel like home rather than duty."
    }
  },
  Leo: {
    archetype: {
      archetype_name: "The Devoted Flame",
      essence: "Your love is warm, loyal, expressive, and full of sincere devotion.",
      gift: "You make partners feel special, celebrated, and emotionally lifted.",
      shadow_challenge: "Desiring validation or reacting strongly to feeling unseen.",
      healing_path: "Let your heart rest in its own worth, not in others' attention.",
      embodiment_message: "My love shines from truth, joy, and inner confidence."
    },
    energy: {
      love_language: "Affection, praise, quality time, and heartfelt gestures.",
      relational_style: "Fiery, generous, expressive, and romantic.",
      emotional_needs: "Appreciation, admiration, and vibrant connection.",
      patterns: "Emotional sensitivity to rejection or invisibility.",
      rebalance: "Creative pleasure, self-affirmation, and joyful embodiment."
    },
    cosmic: {
      brings: "Warmth, passion, and romantic radiance.",
      influences: "Your attachment style and relational expression.",
      teaches: "To shine without needing validation.",
      supports: "Helps you love through authenticity and devotion."
    }
  },
  Virgo: {
    archetype: {
      archetype_name: "The Devoted Caretaker",
      essence: "Your love expresses itself through service, thoughtfulness, and quiet devotion.",
      gift: "You notice the little things and care in practical, deeply supportive ways.",
      shadow_challenge: "Over-analyzing love or feeling like you're never doing enough.",
      healing_path: "Allow yourself to receive the same careful love you offer others.",
      embodiment_message: "My love is intentional, sacred, and worthy of rest."
    },
    energy: {
      love_language: "Acts of service, small details, and practical support.",
      relational_style: "Attentive, considerate, observant, and humble.",
      emotional_needs: "Appreciation, reliability, and emotional clarity.",
      patterns: "Perfectionism, self-criticism, or trying to 'fix' relationships.",
      rebalance: "Gentle self-care, boundaries, and stepping back from over-effort."
    },
    cosmic: {
      brings: "Refinement, care, and grounded love.",
      influences: "How you show devotion and choose partners.",
      teaches: "That love doesn't have to be earned through effort.",
      supports: "Helps you build healthy, supportive patterns in love."
    }
  },
  Libra: {
    archetype: {
      archetype_name: "The Harmony Weaver",
      essence: "Your heart longs for balance, beauty, and mutual understanding.",
      gift: "You create relationships that feel graceful, fair, and emotionally considerate.",
      shadow_challenge: "Losing yourself to keep things pleasant or balanced.",
      healing_path: "Let your own desires sit beside your care for others, not behind it.",
      embodiment_message: "My love honors both my heart and yours."
    },
    energy: {
      love_language: "Quality time, shared decisions, and emotional harmony.",
      relational_style: "Charming, compromising, affectionate, and socially aware.",
      emotional_needs: "Equality, reciprocity, and emotional cooperation.",
      patterns: "Avoiding conflict or not naming your true needs.",
      rebalance: "Honest dialogue, self-reflection, and reclaiming your preferences."
    },
    cosmic: {
      brings: "Grace, romance, and relational awareness.",
      influences: "How you partner, commit, and make choices in love.",
      teaches: "To keep yourself in the equation.",
      supports: "Helps cultivate balanced, mutually nourishing relationships."
    }
  },
  Scorpio: {
    archetype: {
      archetype_name: "The Sacred Depth",
      essence: "Your heart loves intensely, seeking soul-deep bonds and total honesty.",
      gift: "You bring loyalty, passion, and profound emotional presence.",
      shadow_challenge: "Fear of loss, control, or emotional power struggles.",
      healing_path: "Practice trust, gradual vulnerability, and soft release of what you can't hold.",
      embodiment_message: "My love is transformative, honest, and free to breathe."
    },
    energy: {
      love_language: "Emotional intimacy, truth, loyalty, and deep connection.",
      relational_style: "Intense, committed, perceptive, and all-or-nothing.",
      emotional_needs: "Trust, depth, and a feeling of shared emotional reality.",
      patterns: "Jealousy, suspicion, or testing devotion.",
      rebalance: "Shadow work, honest conversations, and safe emotional release."
    },
    cosmic: {
      brings: "Passion, intensity, and transformative love.",
      influences: "Your attachments and the depths you're willing to explore.",
      teaches: "To love without gripping tightly.",
      supports: "Helps you experience intimacy that heals, not drains."
    }
  },
  Sagittarius: {
    archetype: {
      archetype_name: "The Wild Heart",
      essence: "Your love is adventurous, optimistic, and drawn to growth.",
      gift: "You bring humor, freedom, and inspiration into relationships.",
      shadow_challenge: "Avoiding emotional commitment or escaping when things feel heavy.",
      healing_path: "Let intimacy be a journey, not a trap; stay curious even in the hard moments.",
      embodiment_message: "My love is free, honest, and willing to grow."
    },
    energy: {
      love_language: "Shared experiences, deep conversations, and playful exploration.",
      relational_style: "Enthusiastic, honest, expressive, and expansive.",
      emotional_needs: "Space, authenticity, and shared vision or philosophy.",
      patterns: "Restlessness, inconsistency, or spiritual bypassing.",
      rebalance: "Grounded routines, mindful reflection, and heartfelt presence."
    },
    cosmic: {
      brings: "Adventure, meaning, and hopeful romance.",
      influences: "How you chase connection and define commitment.",
      teaches: "To stay present while seeking expansion.",
      supports: "Helps you attract love that feels both free and sincere."
    }
  },
  Capricorn: {
    archetype: {
      archetype_name: "The Devoted Builder",
      essence: "Your heart loves through loyalty, stability, and long-term commitment.",
      gift: "You bring reliability, structure, and grounded care into relationships.",
      shadow_challenge: "Guardedness or equating love with duty and performance.",
      healing_path: "Let softness live beside responsibility; you deserve tenderness too.",
      embodiment_message: "My love is steady, enduring, and worthy of gentleness."
    },
    energy: {
      love_language: "Consistency, responsibility, protection, and shared goals.",
      relational_style: "Serious, dependable, calm, and measured.",
      emotional_needs: "Respect, trust, and clear commitment.",
      patterns: "Emotional distance, overworking, or postponing intimacy.",
      rebalance: "Rest, emotional check-ins, and safe vulnerability."
    },
    cosmic: {
      brings: "Stability, commitment, and mature affection.",
      influences: "How you structure relationships and show devotion.",
      teaches: "That love can be strong and soft at once.",
      supports: "Helps you build relationships that last and feel true."
    }
  },
  Aquarius: {
    archetype: {
      archetype_name: "The Cosmic Companion",
      essence: "Your love is unconventional, spacious, and rooted in authenticity.",
      gift: "You honor individuality and create liberating, accepting connections.",
      shadow_challenge: "Emotional distance or fear of losing freedom.",
      healing_path: "Let your heart open as wide as your mind, one safe step at a time.",
      embodiment_message: "My love is free, conscious, and deeply sincere."
    },
    energy: {
      love_language: "Intellectual intimacy, friendship, honesty, and shared ideals.",
      relational_style: "Unique, thoughtful, non-traditional, and spacious.",
      emotional_needs: "Freedom, respect, and mental/emotional authenticity.",
      patterns: "Detaching when overwhelmed or resisting emotional expectations.",
      rebalance: "Heart-centered practices, grounding, and intentional closeness."
    },
    cosmic: {
      brings: "Originality, friendship, and future-focused love.",
      influences: "How you choose partners and define connection.",
      teaches: "To blend independence with intimacy.",
      supports: "Helps you create relationships built on truth, not roles."
    }
  },
  Pisces: {
    archetype: {
      archetype_name: "The Mystic Lover",
      essence: "Your heart loves spiritually, compassionately, and without clear edges.",
      gift: "You bring empathy, romance, and soulful connection into love.",
      shadow_challenge: "Idealizing others, over-giving, or losing yourself in fantasy.",
      healing_path: "Keep your heart open while letting your boundaries protect your spirit.",
      embodiment_message: "My love is divine, but I remain rooted in myself."
    },
    energy: {
      love_language: "Emotional depth, spiritual connection, creativity, and tenderness.",
      relational_style: "Gentle, dreamy, forgiving, and intuitively tuned in.",
      emotional_needs: "Understanding, emotional safety, and soul-level resonance.",
      patterns: "Attracting wounded partners, ignoring red flags, or self-sacrifice.",
      rebalance: "Clear boundaries, alone time, spiritual hygiene, and creative release."
    },
    cosmic: {
      brings: "Compassion, romance, and spiritual love.",
      influences: "How you merge, connect, and dream in love.",
      teaches: "To love without abandoning yourself.",
      supports: "Helps you channel your heart into healing, art, and soulful union."
    }
  }
};

// Mental Archetype interpretations - Mercury sign specific content
// Mercury sign represents how you think, communicate, and process information
export const mentalArchetypeInterpretations: Record<ZodiacSign, MercurySignInterpretations> = {
  Aries: {
    archetype: {
      archetype_name: "The Sparked Mind",
      essence: "Your thoughts move quickly, instinctively, and with fiery clarity.",
      gift: "You generate ideas with courage and directness, bringing momentum to any situation.",
      shadow_challenge: "Speaking before reflecting or reacting mentally under pressure.",
      healing_path: "Pause before expressing; let your thoughts soften into intention.",
      embodiment_message: "My mind is sharp, present, and guided by awareness."
    },
    energy: {
      thinking_style: "Fast, bold, intuitive, and solution-oriented.",
      communication_style: "Direct, expressive, and energizing.",
      mental_needs: "Freedom to act on ideas and space to speak honestly.",
      patterns: "Impatience, mental impulsivity, or interrupting yourself emotionally.",
      rebalance: "Slow breathing, grounding practices, mindful pacing of speech."
    },
    cosmic: {
      brings: "Courage, clarity, and forward-thinking energy.",
      influences: "Your decision-making and communication presence.",
      teaches: "To channel fire with intention.",
      supports: "Helps you lead conversations with authenticity."
    }
  },
  Taurus: {
    archetype: {
      archetype_name: "The Grounded Mind",
      essence: "Your thoughts move steadily, patiently, and with practical clarity.",
      gift: "You bring calm reasoning and dependable insight into every situation.",
      shadow_challenge: "Stubborn thought patterns or resistance to new perspectives.",
      healing_path: "Stay open to gentle shifts in perception while trusting your inner pace.",
      embodiment_message: "My mind is steady, thoughtful, and grounded."
    },
    energy: {
      thinking_style: "Measured, methodical, consistent, and grounded.",
      communication_style: "Warm, clear, calm, and deliberate.",
      mental_needs: "Time to process, familiar environments, and mental stability.",
      patterns: "Over-fixation or reluctance to adapt.",
      rebalance: "Movement, sensory grounding, and letting thoughts breathe."
    },
    cosmic: {
      brings: "Stability, patience, and practical wisdom.",
      influences: "Your learning style and communication tone.",
      teaches: "To welcome slow evolution in thought.",
      supports: "Helps you express ideas with calm confidence."
    }
  },
  Gemini: {
    archetype: {
      archetype_name: "The Air Mind",
      essence: "Your thoughts move quickly, fluidly, and with natural curiosity.",
      gift: "You gather, interpret, and share information with ease and brilliance.",
      shadow_challenge: "Scattered focus or mental overstimulation.",
      healing_path: "Anchor your mind in intentional presence and deep listening.",
      embodiment_message: "My thoughts are clear, connected, and consciously directed."
    },
    energy: {
      thinking_style: "Adaptive, flexible, curious, and idea-driven.",
      communication_style: "Expressive, witty, articulate, and engaging.",
      mental_needs: "Variety, conversation, mental stimulation, and learning.",
      patterns: "Restlessness, mental anxiety, or overthinking.",
      rebalance: "Mindfulness, breathwork, journaling, and grounding silence."
    },
    cosmic: {
      brings: "Curiosity, connection, and mental agility.",
      influences: "How you interpret information and relate socially.",
      teaches: "To balance movement with steadiness.",
      supports: "Enhances communication and intellectual alignment."
    }
  },
  Cancer: {
    archetype: {
      archetype_name: "The Heart-Mind",
      essence: "Your thoughts are shaped by intuition, memory, and emotional intelligence.",
      gift: "You understand people deeply and communicate with sensitivity and care.",
      shadow_challenge: "Taking things personally or blending emotion with interpretation.",
      healing_path: "Ground your thoughts before absorbing emotional signals.",
      embodiment_message: "My mind honors both feeling and clarity."
    },
    energy: {
      thinking_style: "Intuitive, reflective, emotionally attuned, and memory-oriented.",
      communication_style: "Soft, thoughtful, nurturing, and protective.",
      mental_needs: "Safety, emotional context, and gentle communication.",
      patterns: "Mood-based perception or misinterpreting tone.",
      rebalance: "Rest, emotional processing, and grounding touch."
    },
    cosmic: {
      brings: "Intuition, emotional wisdom, and reflective insight.",
      influences: "How you interpret feelings and communicate needs.",
      teaches: "To separate emotional waves from mental truth.",
      supports: "Helps you articulate emotions with compassion."
    }
  },
  Leo: {
    archetype: {
      archetype_name: "The Radiant Mind",
      essence: "Your thoughts are expressive, creative, and guided by inner confidence.",
      gift: "You communicate with warmth, charisma, and heartfelt clarity.",
      shadow_challenge: "Taking criticism personally or needing recognition to speak boldly.",
      healing_path: "Let your expression flow from authenticity, not approval.",
      embodiment_message: "My voice shines with truth, creativity, and inner pride."
    },
    energy: {
      thinking_style: "Creative, bold, expressive, and vision-focused.",
      communication_style: "Warm, engaging, dramatic, and generous.",
      mental_needs: "Appreciation, creative freedom, and expressive platforms.",
      patterns: "Over-identifying with your ideas or reacting to dismissal.",
      rebalance: "Creative release, inner-affirmation, and slowing down expression."
    },
    cosmic: {
      brings: "Confidence, creativity, and expressive clarity.",
      influences: "Your storytelling, expression, and mental leadership.",
      teaches: "To speak from the heart, not the ego.",
      supports: "Encourages you to share your ideas with warmth and purpose."
    }
  },
  Virgo: {
    archetype: {
      archetype_name: "The Sacred Analyst",
      essence: "Your mind is precise, observant, and naturally attuned to patterns.",
      gift: "You bring clarity, refinement, and deep understanding to every detail.",
      shadow_challenge: "Overthinking, perfectionism, or mental self-critique.",
      healing_path: "Shift from fixing to accepting; let clarity arise naturally.",
      embodiment_message: "My mind is intentional, insightful, and aligned."
    },
    energy: {
      thinking_style: "Detail-oriented, organized, analytical, and grounded.",
      communication_style: "Clear, thoughtful, concise, and supportive.",
      mental_needs: "Order, clarity, purpose, and quiet processing time.",
      patterns: "Worry, mental tension, or nitpicking yourself.",
      rebalance: "Gentle movement, breathwork, journaling, and perspective shifts."
    },
    cosmic: {
      brings: "Precision, clarity, and intellectual devotion.",
      influences: "Your learning style and self-improvement tendencies.",
      teaches: "To release perfection for presence.",
      supports: "Helps you express truth with grace and care."
    }
  },
  Libra: {
    archetype: {
      archetype_name: "The Harmony Mind",
      essence: "Your thoughts seek balance, fairness, and relational understanding.",
      gift: "You bring diplomacy, emotional intelligence, and perspective into communication.",
      shadow_challenge: "Indecision, people-pleasing, or avoiding discomfort.",
      healing_path: "Let your voice stand alongside your compassion.",
      embodiment_message: "My mind seeks clarity through truth and balance."
    },
    energy: {
      thinking_style: "Relational, aesthetic, balanced, and reflective.",
      communication_style: "Warm, thoughtful, fair-minded, and cooperative.",
      mental_needs: "Harmony, mutual understanding, and peaceful surroundings.",
      patterns: "Overthinking choices or deferring decisions.",
      rebalance: "Direct expression, grounding, and self-honoring choices."
    },
    cosmic: {
      brings: "Diplomacy, clarity, and elegant communication.",
      influences: "How you mediate conflict and understand others.",
      teaches: "That truth can coexist with kindness.",
      supports: "Helps you cultivate mentally balanced relationships."
    }
  },
  Scorpio: {
    archetype: {
      archetype_name: "The Depth Mind",
      essence: "Your thoughts move beneath the surface, seeking truth, meaning, and emotional honesty.",
      gift: "You perceive motives, patterns, and hidden layers instinctively.",
      shadow_challenge: "Mental intensity, suspicion, or emotional over-merging.",
      healing_path: "Let curiosity lead instead of fear; release the need to decode everything.",
      embodiment_message: "My mind transforms, reveals, and understands deeply."
    },
    energy: {
      thinking_style: "Deep, intuitive, investigative, and emotionally perceptive.",
      communication_style: "Intense, honest, selective, and impactful.",
      mental_needs: "Truth, emotional safety, privacy, and depth.",
      patterns: "Fixation, pessimism, or mental secrecy.",
      rebalance: "Emotional release, body-based grounding, and safe openness."
    },
    cosmic: {
      brings: "Insight, transformation, and unwavering perception.",
      influences: "How you uncover truth and process emotion.",
      teaches: "To trust without over-analyzing.",
      supports: "Helps you use your mental power for healing, not fear."
    }
  },
  Sagittarius: {
    archetype: {
      archetype_name: "The Visionary Mind",
      essence: "Your thoughts expand toward meaning, possibility, and higher understanding.",
      gift: "You inspire others with wisdom, perspective, and optimistic clarity.",
      shadow_challenge: "Restlessness, bluntness, or mentally escaping discomfort.",
      healing_path: "Let truth be grounded; let insight be embodied.",
      embodiment_message: "My mind explores with intention and returns with wisdom."
    },
    energy: {
      thinking_style: "Expansive, philosophical, open-minded, and intuitive.",
      communication_style: "Honest, enthusiastic, bold, and expressive.",
      mental_needs: "Freedom, meaning, learning, and inspiring discussions.",
      patterns: "Overgeneralizing, ignoring details, or avoiding accountability.",
      rebalance: "Mindfulness, structure, slowing down, and deeper listening."
    },
    cosmic: {
      brings: "Wisdom, expansion, and optimistic truth.",
      influences: "How you form beliefs and share ideas.",
      teaches: "To balance openness with grounded clarity.",
      supports: "Helps you express your truth with purpose and compassion."
    }
  },
  Capricorn: {
    archetype: {
      archetype_name: "The Mountain Mind",
      essence: "Your thinking is structured, disciplined, and purpose-driven.",
      gift: "You bring clarity, strategy, and emotional maturity into communication.",
      shadow_challenge: "Rigid thinking, pessimism, or emotional suppression.",
      healing_path: "Let your mind soften with trust and emotional connection.",
      embodiment_message: "My mind is clear, structured, and steady."
    },
    energy: {
      thinking_style: "Logical, organized, practical, and long-term oriented.",
      communication_style: "Serious, thoughtful, concise, and grounded.",
      mental_needs: "Stability, predictability, boundaries, and respect.",
      patterns: "Overworking mentally, shutting down emotionally, or withholding speech.",
      rebalance: "Rest, embodied emotion, gentle expression."
    },
    cosmic: {
      brings: "Wisdom, structure, and pragmatic clarity.",
      influences: "How you make decisions and plan.",
      teaches: "That softness strengthens clarity.",
      supports: "Helps you speak from experience and integrity."
    }
  },
  Aquarius: {
    archetype: {
      archetype_name: "The Quantum Mind",
      essence: "Your thinking is innovative, intuitive, and connected to higher perspective.",
      gift: "You see patterns others miss and express ideas that shift consciousness.",
      shadow_challenge: "Detachment from emotion or over-intellectualizing feelings.",
      healing_path: "Let the heart inform the mind; let intuition meet embodiment.",
      embodiment_message: "My mind is open, visionary, and aligned with truth."
    },
    energy: {
      thinking_style: "Original, abstract, future-oriented, and intuitive.",
      communication_style: "Clear, unexpected, insightful, and unique.",
      mental_needs: "Autonomy, innovation, mental freedom, and honesty.",
      patterns: "Emotional distancing or resisting traditional viewpoints.",
      rebalance: "Heart-centered grounding, slowing down, connecting to body wisdom."
    },
    cosmic: {
      brings: "Innovation, intuition, and unconventional intelligence.",
      influences: "How you express your ideas and affect collective energy.",
      teaches: "To integrate head and heart.",
      supports: "Helps you communicate with clarity and elevated vision."
    }
  },
  Pisces: {
    archetype: {
      archetype_name: "The Mystic Mind",
      essence: "Your thoughts flow intuitively, symbolically, and with spiritual depth.",
      gift: "You translate emotion, imagery, and energetic impressions into meaning.",
      shadow_challenge: "Mental fog, over-sensitivity, or blurred boundaries.",
      healing_path: "Anchor your intuition through grounding and reflective clarity.",
      embodiment_message: "My mind is intuitive, creative, and spiritually attuned."
    },
    energy: {
      thinking_style: "Imaginative, emotional, symbolic, and dreamy.",
      communication_style: "Soft, poetic, sensitive, and empathetic.",
      mental_needs: "Quiet, emotional spaciousness, creativity, and intuitive connection.",
      patterns: "Escapism, confusion, or absorbing others' emotions.",
      rebalance: "Boundaries, grounding, structured space, and clarity practices."
    },
    cosmic: {
      brings: "Imagination, intuition, and spiritual wisdom.",
      influences: "How you process emotion and receive insight.",
      teaches: "To turn intuition into conscious clarity.",
      supports: "Helps you express truth gently and with soul."
    }
  }
};

// Drive & Desire Archetype interpretations - Mars sign specific content
// Mars sign represents how you take action, handle conflict, and express desire
export const driveArchetypeInterpretations: Record<ZodiacSign, MarsSignInterpretations> = {
  Aries: {
    archetype: {
      archetype_name: "The Firestarter",
      essence: "Your drive is bold, instinctive, and fueled by pure momentum.",
      gift: "You initiate action effortlessly and inspire courage in others.",
      shadow_challenge: "Acting before grounding or burning out quickly.",
      healing_path: "Channel your fire with intention rather than urgency.",
      embodiment_message: "My power ignites with purpose, not impulse."
    },
    energy: {
      drive_style: "Direct, fast, instinctive, and self-propelled.",
      conflict_style: "Quick, reactive, honest, and straightforward.",
      desire_energy: "Passionate, immediate, physically expressive.",
      patterns: "Impatience or frustration when slowed down.",
      rebalance: "Breathwork, body grounding, and mindful pacing."
    },
    cosmic: {
      brings: "Courage, independence, and raw vitality.",
      influences: "How you take risks and pursue goals.",
      teaches: "To honor the pause before the leap.",
      supports: "Helps you access brave, aligned action."
    }
  },
  Taurus: {
    archetype: {
      archetype_name: "The Rooted Force",
      essence: "Your drive builds slowly but becomes unstoppable once activated.",
      gift: "Your persistence, endurance, and reliability are unmatched.",
      shadow_challenge: "Resistance to change or staying in situations too long.",
      healing_path: "Let movement support stability, not threaten it.",
      embodiment_message: "My power grows steadily and sustains deeply."
    },
    energy: {
      drive_style: "Steady, grounded, sensual, and enduring.",
      conflict_style: "Calm until pushed, then firm and immovable.",
      desire_energy: "Slow-burning, physical, deeply embodied.",
      patterns: "Stubbornness, stagnation, or comfort-based avoidance.",
      rebalance: "Gentle movement, breath expansion, and intentional release."
    },
    cosmic: {
      brings: "Stability, longevity, and deliberate strength.",
      influences: "How you commit to goals and relationships.",
      teaches: "To move even when you feel too rooted.",
      supports: "Helps you build what lasts."
    }
  },
  Gemini: {
    archetype: {
      archetype_name: "The Windblade",
      essence: "Your energy moves in quick bursts of curiosity, expression, and mental stimulation.",
      gift: "You adapt quickly, solve problems fast, and communicate with force when needed.",
      shadow_challenge: "Scattered focus or inconsistent follow-through.",
      healing_path: "Strengthen your attention through presence and grounding.",
      embodiment_message: "My power is sharp, intentional, and mentally aligned."
    },
    energy: {
      drive_style: "Adaptive, communicative, multi-directional, and idea-driven.",
      conflict_style: "Verbal, quick, logical, and sometimes sharp.",
      desire_energy: "Mental stimulation, variety, flirtation, and playful connection.",
      patterns: "Starting many things without finishing or mentally burning out.",
      rebalance: "Grounding exercises, single-tasking, breath focus."
    },
    cosmic: {
      brings: "Curiosity, versatility, and lively movement.",
      influences: "How you debate, flirt, and pursue goals.",
      teaches: "To harness focus as a form of power.",
      supports: "Helps you think quickly without losing clarity."
    }
  },
  Cancer: {
    archetype: {
      archetype_name: "The Lunar Protector",
      essence: "Your drive is emotional, intuitive, protective, and deeply tied to your inner world.",
      gift: "You protect what you love fiercely and act with heartfelt conviction.",
      shadow_challenge: "Defensiveness or emotional reactivity when triggered.",
      healing_path: "Let expression replace suppression; let vulnerability guide action.",
      embodiment_message: "My power is soft but unshakably strong."
    },
    energy: {
      drive_style: "Emotion-based, intuitive, heartfelt, and responsive.",
      conflict_style: "Protective, sensitive, reactive, or retreat-based.",
      desire_energy: "Emotional closeness, nurturing intimacy, and safety.",
      patterns: "Passive-aggression or acting from emotional saturation.",
      rebalance: "Self-soothing, emotional naming, and boundary clarity."
    },
    cosmic: {
      brings: "Emotional wisdom, intuition, and protective strength.",
      influences: "How you guard your peace and express anger.",
      teaches: "To act from centered emotion, not overflow.",
      supports: "Helps you defend your heart without closing it."
    }
  },
  Leo: {
    archetype: {
      archetype_name: "The Solar Flame",
      essence: "Your drive is expressive, passionate, and fueled by heart-centered confidence.",
      gift: "You inspire through charisma, boldness, and radiant presence.",
      shadow_challenge: "Pride-based reactions or taking things too personally.",
      healing_path: "Reconnect with your inner child and lead from authenticity.",
      embodiment_message: "My power shines from truth, not ego."
    },
    energy: {
      drive_style: "Dramatic, passionate, creative, and self-expressive.",
      conflict_style: "Direct, proud, intense, and fiercely loyal.",
      desire_energy: "Affectionate, playful, warm, and emotionally expressive.",
      patterns: "Overreacting to disrespect or needing validation to act.",
      rebalance: "Creative outlets, self-affirmation, and heart-opening practices."
    },
    cosmic: {
      brings: "Courage, creativity, and radiant power.",
      influences: "How you pursue passion and defend your dignity.",
      teaches: "To lead with heart rather than performance.",
      supports: "Helps you act boldly while staying emotionally open."
    }
  },
  Virgo: {
    archetype: {
      archetype_name: "The Sacred Worker",
      essence: "Your drive is precise, intentional, and guided by improvement and purpose.",
      gift: "You channel your energy into meaningful work and embodied service.",
      shadow_challenge: "Burnout through over-effort, perfectionism, or self-pressure.",
      healing_path: "Honor rest and allow yourself to do enough—not everything.",
      embodiment_message: "My power flows through clarity, balance, and devotion."
    },
    energy: {
      drive_style: "Methodical, detail-focused, steady, and dedicated.",
      conflict_style: "Analytical, controlled, sometimes overly critical.",
      desire_energy: "Attentive, careful, sensual through presence and precision.",
      patterns: "Overworking, self-sacrifice, or analyzing feelings instead of expressing them.",
      rebalance: "Grounding, breath release, restorative routines, and self-compassion."
    },
    cosmic: {
      brings: "Efficiency, clarity, and embodied intelligence.",
      influences: "How you refine goals and approach healing.",
      teaches: "To trust progress over perfection.",
      supports: "Helps you channel energy into purposeful alignment."
    }
  },
  Libra: {
    archetype: {
      archetype_name: "The Balanced Warrior",
      essence: "Your drive is relational, diplomatic, and expressed through fairness and harmony.",
      gift: "You bring peace, justice, and graceful assertion into conflict.",
      shadow_challenge: "Avoiding decisions, suppressing anger, or prioritizing peace over truth.",
      healing_path: "Let your boundaries stand even when your voice shakes.",
      embodiment_message: "My power is calm, balanced, and honest."
    },
    energy: {
      drive_style: "Cooperative, thoughtful, partnership-oriented.",
      conflict_style: "Diplomatic, indirect, sometimes conflict-avoidant.",
      desire_energy: "Romantic, aesthetic, connected, and pleasure-driven.",
      patterns: "People-pleasing or denying your needs.",
      rebalance: "Boundary work, direct communication, body awareness."
    },
    cosmic: {
      brings: "Harmony, justice, and relational strength.",
      influences: "How you fight for fairness and handle conflict.",
      teaches: "That honesty creates deeper peace.",
      supports: "Helps you pursue desires with integrity and grace."
    }
  },
  Scorpio: {
    archetype: {
      archetype_name: "The Shadow Alchemist",
      essence: "Your drive is intense, emotional, magnetic, and transformational.",
      gift: "You possess unmatched focus, depth, and emotional power.",
      shadow_challenge: "Control, secrecy, or acting from emotional wounds.",
      healing_path: "Let softness guide your strength; release what you can't own.",
      embodiment_message: "My power transforms me, not consumes me."
    },
    energy: {
      drive_style: "Focused, persistent, strategic, emotionally fueled.",
      conflict_style: "Deep, confrontational, all-or-nothing, protective.",
      desire_energy: "Passionate, consuming, intimate, spiritually fused.",
      patterns: "Obsession, jealousy, emotional extremism.",
      rebalance: "Emotional release, shadow work, breath grounding, honesty."
    },
    cosmic: {
      brings: "Transformation, intensity, and fearless emotional energy.",
      influences: "How you pursue what matters and defend your soul.",
      teaches: "To let go without losing power.",
      supports: "Helps you create deep, honest, healing connections."
    }
  },
  Sagittarius: {
    archetype: {
      archetype_name: "The Wild Arrow",
      essence: "Your drive is fueled by freedom, exploration, and a hunger for meaning.",
      gift: "You inspire others through optimism, honesty, and adventurous spirit.",
      shadow_challenge: "Restlessness, impulsivity, or avoiding emotional responsibility.",
      healing_path: "Ground your fire so your aim lands where your spirit truly wants.",
      embodiment_message: "My power expands with purpose and truth."
    },
    energy: {
      drive_style: "Enthusiastic, bold, adventurous, and future-focused.",
      conflict_style: "Direct, blunt, righteous, sometimes too fiery.",
      desire_energy: "Passionate, playful, spontaneous, and philosophical.",
      patterns: "Inconsistency, escapism, or overpromising.",
      rebalance: "Grounding, slowing down, mindful presence."
    },
    cosmic: {
      brings: "Expansion, passion, and fearless exploration.",
      influences: "How you pursue wisdom, desire, and purpose.",
      teaches: "To anchor fire in responsibility.",
      supports: "Helps you chase goals that truly align with your spirit."
    }
  },
  Capricorn: {
    archetype: {
      archetype_name: "The Determined Mountain",
      essence: "Your drive is disciplined, strategic, and built for long-term success.",
      gift: "You possess unmatched endurance, focus, and inner authority.",
      shadow_challenge: "Overworking, emotional suppression, or harsh self-judgment.",
      healing_path: "Let your power soften into sustainable strength.",
      embodiment_message: "My power is steady, grounded, and self-guided."
    },
    energy: {
      drive_style: "Structured, ambitious, reliable, and persistent.",
      conflict_style: "Controlled, serious, boundary-first.",
      desire_energy: "Slow-burning, restrained, deeply committed.",
      patterns: "Withholding emotion, burnout, or prioritizing duty over joy.",
      rebalance: "Rest, emotional expression, somatic grounding."
    },
    cosmic: {
      brings: "Authority, resilience, and sustainable progress.",
      influences: "How you pursue goals and protect your time.",
      teaches: "That softness strengthens discipline.",
      supports: "Helps you build a life aligned with your highest self."
    }
  },
  Aquarius: {
    archetype: {
      archetype_name: "The Electric Rebel",
      essence: "Your drive is progressive, intuitive, independent, and mentally charged.",
      gift: "You lead through innovation, authenticity, and original thought.",
      shadow_challenge: "Detachment, unpredictability, or resisting emotional closeness.",
      healing_path: "Let connection coexist with independence.",
      embodiment_message: "My power activates through truth, freedom, and clarity."
    },
    energy: {
      drive_style: "Unconventional, intellectual, future-oriented, and visionary.",
      conflict_style: "Detached, logical, unpredictable, sometimes rebellious.",
      desire_energy: "Unique, experimental, mentally stimulating.",
      patterns: "Emotional avoidance or shutting down under pressure.",
      rebalance: "Heart-opening practices, grounding, breathwork."
    },
    cosmic: {
      brings: "Innovation, courage, and breakthrough energy.",
      influences: "How you pursue change and defend individuality.",
      teaches: "To integrate mind and heart.",
      supports: "Helps you lead from authenticity and higher insight."
    }
  },
  Pisces: {
    archetype: {
      archetype_name: "The Mystic Current",
      essence: "Your drive is intuitive, spiritual, emotionally guided, and fluid.",
      gift: "You channel creativity, empathy, and divine inspiration into action.",
      shadow_challenge: "Avoidance, emotional overwhelm, or lack of boundaries.",
      healing_path: "Strengthen structure so intuition expresses clearly.",
      embodiment_message: "My power flows with grace and intention."
    },
    energy: {
      drive_style: "Gentle, intuitive, adaptable, and spiritually motivated.",
      conflict_style: "Avoidant, emotional, indirect.",
      desire_energy: "Soft, dreamy, soulful, boundary-crossing intimacy.",
      patterns: "Escapism, confusion, or losing drive under stress.",
      rebalance: "Structure, grounding, breathwork, energetic cleansing."
    },
    cosmic: {
      brings: "Compassion, imagination, and spiritual power.",
      influences: "How you pursue dreams and process desire.",
      teaches: "To ground intuition in clarity.",
      supports: "Helps you access spiritual strength and peaceful action."
    }
  }
};

// Jupiter Expansion Archetype - growth, blessings, and abundance
export const expansionArchetypeInterpretations: Record<ZodiacSign, JupiterInterpretation> = {
  Aries: {
    archetype_name: "The Bold Explorer",
    core_theme: "You expand through courage, new beginnings, and direct action.",
    growth_path: "Taking aligned risks and trusting your inner fire.",
    shadow: "Impulsiveness or chasing growth without grounding.",
    affirmation: "My brave choices open doors that are meant for me."
  },
  Taurus: {
    archetype_name: "The Gentle Builder",
    core_theme: "You expand through stability, embodiment, and simple abundance.",
    growth_path: "Creating steady routines and nurturing what you value.",
    shadow: "Staying small to feel safe or resisting change.",
    affirmation: "I grow slowly, steadily, and in ways that truly nourish me."
  },
  Gemini: {
    archetype_name: "The Curious Messenger",
    core_theme: "You expand through learning, conversation, and connection.",
    growth_path: "Following your curiosity and sharing what you discover.",
    shadow: "Scattered focus or information overload.",
    affirmation: "My curiosity leads me to aligned opportunities and insight."
  },
  Cancer: {
    archetype_name: "The Nurturing Vessel",
    core_theme: "You expand through emotional healing, home, and deep care.",
    growth_path: "Honoring your feelings and building safe spaces.",
    shadow: "Over-attaching to the past or caretaking at your own expense.",
    affirmation: "As I care for myself, my life naturally grows."
  },
  Leo: {
    archetype_name: "The Radiant Creator",
    core_theme: "You expand through self-expression, creativity, and joy.",
    growth_path: "Sharing your gifts and letting yourself be seen.",
    shadow: "Needing constant validation or performing instead of being.",
    affirmation: "My authentic expression invites divine opportunities."
  },
  Virgo: {
    archetype_name: "The Sacred Servant",
    core_theme: "You expand through meaningful work, refinement, and devotion.",
    growth_path: "Offering your gifts with intention and care.",
    shadow: "Perfectionism or believing you must earn abundance.",
    affirmation: "My service is enough, and I am worthy of ease and support."
  },
  Libra: {
    archetype_name: "The Harmony Bringer",
    core_theme: "You expand through partnership, fairness, and peaceful solutions.",
    growth_path: "Choosing balanced relationships and honest connection.",
    shadow: "People-pleasing or staying neutral to avoid growth.",
    affirmation: "Aligned relationships are a channel for my blessings."
  },
  Scorpio: {
    archetype_name: "The Deep Alchemist",
    core_theme: "You expand through transformation, shadow work, and truth.",
    growth_path: "Facing what is hidden and allowing rebirth.",
    shadow: "Clinging to intensity or fearing loss of control.",
    affirmation: "I am safe to transform, release, and rise."
  },
  Sagittarius: {
    archetype_name: "The Truth Seeker",
    core_theme: "You expand through wisdom, travel, and spiritual exploration.",
    growth_path: "Following your higher truth and saying yes to growth.",
    shadow: "Escaping discomfort or overpromising.",
    affirmation: "My truth-guided steps lead me to aligned expansion."
  },
  Capricorn: {
    archetype_name: "The Wise Builder",
    core_theme: "You expand through discipline, integrity, and long-term vision.",
    growth_path: "Committing to aligned goals and honoring your limits.",
    shadow: "Overworking or believing joy must be postponed.",
    affirmation: "My consistency creates grounded, sustainable abundance."
  },
  Aquarius: {
    archetype_name: "The Future Visionary",
    core_theme: "You expand through originality, community, and innovation.",
    growth_path: "Embracing your uniqueness and contributing your ideas.",
    shadow: "Detachment or feeling too different to belong.",
    affirmation: "My unique vision is a blessing to the collective."
  },
  Pisces: {
    archetype_name: "The Mystic Dreamer",
    core_theme: "You expand through compassion, faith, and spiritual connection.",
    growth_path: "Trusting your intuition and honoring your sensitivity.",
    shadow: "Escapism, fantasy, or porous boundaries.",
    affirmation: "My sensitivity is a sacred channel for divine support."
  }
};

// Saturn Mastery Archetype - boundaries, discipline, soul lessons
export const masteryArchetypeInterpretations: Record<ZodiacSign, SaturnInterpretation> = {
  Aries: {
    archetype_name: "The Brave Initiator",
    core_lesson: "Learning healthy self-assertion and courage without recklessness.",
    challenge: "Fear of starting or overcompensating with force.",
    healing_practice: "Practice small, honest actions that honor your needs.",
    embodiment_message: "My leadership is calm, grounded, and real."
  },
  Taurus: {
    archetype_name: "The Grounded Guardian",
    core_lesson: "Learning to feel safe without clinging to what is familiar.",
    challenge: "Holding on too tightly or resisting necessary change.",
    healing_practice: "Release in small steps and build inner, not just outer, security.",
    embodiment_message: "I am safe within myself, even as life shifts."
  },
  Gemini: {
    archetype_name: "The Clear Communicator",
    core_lesson: "Learning to speak truth with focus and integrity.",
    challenge: "Overthinking, scattered focus, or doubting your voice.",
    healing_practice: "Slow your words, breathe, and say what you truly mean.",
    embodiment_message: "My voice is steady, honest, and enough."
  },
  Cancer: {
    archetype_name: "The Emotional Anchor",
    core_lesson: "Learning emotional boundaries and self-nurturing.",
    challenge: "Carrying others' feelings or fearing abandonment.",
    healing_practice: "Create rituals that nourish you first, then others.",
    embodiment_message: "My heart is protected, nourished, and honored."
  },
  Leo: {
    archetype_name: "The Heart Leader",
    core_lesson: "Learning authentic confidence instead of performance.",
    challenge: "Fear of being unseen or taking things personally.",
    healing_practice: "Express from your truth even when applause is absent.",
    embodiment_message: "My worth is present, even in silence."
  },
  Virgo: {
    archetype_name: "The Devoted Healer",
    core_lesson: "Learning balance between service and self-worth.",
    challenge: "Self-criticism, perfectionism, or over-responsibility.",
    healing_practice: "Offer yourself the same grace you give others.",
    embodiment_message: "I am already enough while I grow."
  },
  Libra: {
    archetype_name: "The Boundary Keeper",
    core_lesson: "Learning to honor your needs in relationships.",
    challenge: "People-pleasing or avoiding conflict.",
    healing_practice: "State your truth gently and stand with it.",
    embodiment_message: "My peace includes my own yes and no."
  },
  Scorpio: {
    archetype_name: "The Shadow Healer",
    core_lesson: "Learning trust, vulnerability, and emotional release.",
    challenge: "Control, secrecy, or fear of betrayal.",
    healing_practice: "Share your truth with trusted souls and let yourself soften.",
    embodiment_message: "Letting go frees my power."
  },
  Sagittarius: {
    archetype_name: "The Grounded Seeker",
    core_lesson: "Learning to anchor big visions into real action.",
    challenge: "Avoiding responsibility or running from discomfort.",
    healing_practice: "Give your beliefs structure through daily practice.",
    embodiment_message: "My freedom deepens when I commit."
  },
  Capricorn: {
    archetype_name: "The Wise Elder",
    core_lesson: "Learning to balance responsibility with softness.",
    challenge: "Harsh self-judgment, overworking, or emotional distance.",
    healing_practice: "Rest, ask for help, and let your inner child exist.",
    embodiment_message: "My strength includes tenderness and rest."
  },
  Aquarius: {
    archetype_name: "The Aligned Rebel",
    core_lesson: "Learning to honor your uniqueness while still belonging.",
    challenge: "Feeling alien, detached, or resisting all structure.",
    healing_practice: "Create your own rules that honor both freedom and care.",
    embodiment_message: "I am free to be myself and still be held."
  },
  Pisces: {
    archetype_name: "The Spiritual Anchor",
    core_lesson: "Learning boundaries in spiritual and emotional realms.",
    challenge: "Absorbing too much or losing yourself in others.",
    healing_practice: "Ground your intuition with clear limits and routines.",
    embodiment_message: "My spirit is guided, protected, and clear."
  }
};

// North Node Soul Direction - what the soul is moving toward
export const soulDirectionInterpretations: Record<ZodiacSign, NorthNodeInterpretation> = {
  Aries: {
    archetype_name: "Path of the Pioneer",
    invitation: "Move toward self-trust, courage, and independent action.",
    core_fear_to_release: "Fear of standing alone or upsetting others.",
    aligned_actions: "Take small, brave steps based on what you truly want."
  },
  Taurus: {
    archetype_name: "Path of the Gardener",
    invitation: "Move toward simplicity, stability, and embodied peace.",
    core_fear_to_release: "Fear that calm means stagnation or lack of depth.",
    aligned_actions: "Create routines, honor your body, and build slowly."
  },
  Gemini: {
    archetype_name: "Path of the Storyteller",
    invitation: "Move toward curiosity, conversation, and shared truth.",
    core_fear_to_release: "Fear that you must already know everything.",
    aligned_actions: "Ask questions, share your thoughts, and stay open."
  },
  Cancer: {
    archetype_name: "Path of the Heart",
    invitation: "Move toward emotional safety, softness, and real care.",
    core_fear_to_release: "Fear that vulnerability makes you weak.",
    aligned_actions: "Let yourself receive support and honor your feelings."
  },
  Leo: {
    archetype_name: "Path of the Sun",
    invitation: "Move toward visibility, self-expression, and creative courage.",
    core_fear_to_release: "Fear of being seen or judged for your light.",
    aligned_actions: "Share your gifts, own your desires, and let your heart speak."
  },
  Virgo: {
    archetype_name: "Path of the Healer",
    invitation: "Move toward grounded service, clarity, and refinement.",
    core_fear_to_release: "Fear that structure limits your magic.",
    aligned_actions: "Organize your ideas and serve in ways that feel aligned."
  },
  Libra: {
    archetype_name: "Path of the Bridge",
    invitation: "Move toward partnership, balance, and mutual support.",
    core_fear_to_release: "Fear that you must do everything alone.",
    aligned_actions: "Let others in, co-create, and honor shared decisions."
  },
  Scorpio: {
    archetype_name: "Path of the Phoenix",
    invitation: "Move toward transformation, emotional honesty, and depth.",
    core_fear_to_release: "Fear of loss, endings, or being fully seen.",
    aligned_actions: "Embrace change, seek truth, and allow emotional rebirth."
  },
  Sagittarius: {
    archetype_name: "Path of the Sage",
    invitation: "Move toward freedom, faith, and higher perspective.",
    core_fear_to_release: "Fear of leaving comfort or what is familiar.",
    aligned_actions: "Follow your intuition, study, travel, and expand your view."
  },
  Capricorn: {
    archetype_name: "Path of the Pillar",
    invitation: "Move toward responsibility, leadership, and inner authority.",
    core_fear_to_release: "Fear of failure or of being seen as not enough.",
    aligned_actions: "Take ownership of your path and commit to your vision."
  },
  Aquarius: {
    archetype_name: "Path of the Visionary",
    invitation: "Move toward uniqueness, community, and conscious disruption.",
    core_fear_to_release: "Fear of standing apart from the crowd.",
    aligned_actions: "Share your ideas, join aligned communities, and innovate."
  },
  Pisces: {
    archetype_name: "Path of the Mystic",
    invitation: "Move toward surrender, compassion, and spiritual trust.",
    core_fear_to_release: "Fear of letting go of control or logic.",
    aligned_actions: "Practice trust, creativity, and spiritual connection."
  }
};

// South Node Soul Memory - comfort zone, past patterns to outgrow
export const soulMemoryInterpretations: Record<ZodiacSign, SouthNodeInterpretation> = {
  Aries: {
    archetype_name: "Memory of the Fighter",
    what_feels_familiar: "Doing everything alone and rushing into action.",
    what_to_transcend: "Acting without considering others.",
    gift_to_keep: "Your courage and ability to begin."
  },
  Taurus: {
    archetype_name: "Memory of the Preserver",
    what_feels_familiar: "Seeking comfort, routine, and material safety.",
    what_to_transcend: "Staying stuck just to feel secure.",
    gift_to_keep: "Your ability to create stability and peace."
  },
  Gemini: {
    archetype_name: "Memory of the Thinker",
    what_feels_familiar: "Gathering information and staying in your head.",
    what_to_transcend: "Endless searching without deep commitment.",
    gift_to_keep: "Your curiosity and adaptability."
  },
  Cancer: {
    archetype_name: "Memory of the Protector",
    what_feels_familiar: "Clinging to the past and caretaking others.",
    what_to_transcend: "Over-identifying with old emotional stories.",
    gift_to_keep: "Your empathy and nurturing heart."
  },
  Leo: {
    archetype_name: "Memory of the Performer",
    what_feels_familiar: "Needing attention or being at the center.",
    what_to_transcend: "Defining your worth through validation.",
    gift_to_keep: "Your creativity and warmth."
  },
  Virgo: {
    archetype_name: "Memory of the Fixer",
    what_feels_familiar: "Trying to fix, perfect, and manage everything.",
    what_to_transcend: "Believing love is earned through work.",
    gift_to_keep: "Your discernment and devotion."
  },
  Libra: {
    archetype_name: "Memory of the Pleaser",
    what_feels_familiar: "Keeping the peace and prioritizing harmony.",
    what_to_transcend: "Ignoring your needs to stay liked.",
    gift_to_keep: "Your sense of fairness and grace."
  },
  Scorpio: {
    archetype_name: "Memory of the Intense One",
    what_feels_familiar: "Living in emotional extremes and deep entanglement.",
    what_to_transcend: "Reliving old wounds or clinging to intensity.",
    gift_to_keep: "Your depth and emotional insight."
  },
  Sagittarius: {
    archetype_name: "Memory of the Wanderer",
    what_feels_familiar: "Escaping, chasing freedom, or resisting limits.",
    what_to_transcend: "Running instead of rooting.",
    gift_to_keep: "Your faith and big-picture vision."
  },
  Capricorn: {
    archetype_name: "Memory of the Responsible One",
    what_feels_familiar: "Carrying burdens, overworking, and being the strong one.",
    what_to_transcend: "Over-identifying with duty and control.",
    gift_to_keep: "Your resilience and reliability."
  },
  Aquarius: {
    archetype_name: "Memory of the Outsider",
    what_feels_familiar: "Standing apart, detaching, or staying in the mind.",
    what_to_transcend: "Keeping distance to avoid vulnerability.",
    gift_to_keep: "Your uniqueness and clear seeing."
  },
  Pisces: {
    archetype_name: "Memory of the Dreamer",
    what_feels_familiar: "Floating, fantasizing, merging with others' energy.",
    what_to_transcend: "Escaping reality or abandoning your own needs.",
    gift_to_keep: "Your compassion and spiritual sensitivity."
  }
};

// Release → Rise Arc - Combines South Node and North Node into unified journey
export const releaseRiseArcs: Record<string, ReleaseRiseArc> = {
  south_aries_north_libra: {
    title: "From Warrior to Peacemaker",
    summary: "You are moving from fighting every battle alone to finding strength through partnership and balance.",
    release: "Release the belief that you must conquer life solo or that asking for help is weakness.",
    rise: "Rise into relationships where you receive as much as you give, and harmony becomes your power.",
    bridge: "Your courage does not diminish in partnership. It becomes wiser, more sustainable, and shared.",
    reflection_prompt: "Where am I still fighting alone when collaboration would bring more ease and success?",
    daily_practice: "Today, practice one moment of genuine compromise or ask for support in something you usually handle alone."
  },
  south_taurus_north_scorpio: {
    title: "From Comfort to Transformation",
    summary: "You are moving from clinging to safety and the familiar to embracing deep change and emotional truth.",
    release: "Release the belief that stability means avoiding all risk, depth, or vulnerability.",
    rise: "Rise into a life where transformation is trusted, and letting go creates space for rebirth.",
    bridge: "Your groundedness is the foundation for safe surrender. You can go deep because you know how to hold yourself.",
    reflection_prompt: "What am I holding onto for comfort that is actually blocking my evolution?",
    daily_practice: "Today, release one small thing you no longer need, physical or emotional, and notice what space it creates."
  },
  south_gemini_north_sagittarius: {
    title: "From Gatherer to Seeker",
    summary: "You are moving from collecting information endlessly to finding meaning, truth, and deeper purpose.",
    release: "Release the belief that knowing more facts will save you, or that staying busy keeps you safe.",
    rise: "Rise into a life where you trust your inner knowing and commit to a bigger vision.",
    bridge: "Your curiosity is sacred. Now it asks you to seek not just knowledge, but wisdom.",
    reflection_prompt: "Where am I gathering information instead of taking a leap of faith?",
    daily_practice: "Today, choose one belief or vision and take a small step toward it without needing all the answers first."
  },
  south_cancer_north_capricorn: {
    title: "From Nurturer to Builder",
    summary: "You are moving from over-caretaking and emotional dependency to building your own legacy and authority.",
    release: "Release the belief that your worth comes only from how well you care for others.",
    rise: "Rise into a life where you hold space for yourself, build something lasting, and lead with integrity.",
    bridge: "Your nurturing heart becomes the foundation for structures that serve. Care and ambition can coexist.",
    reflection_prompt: "Where am I over-giving or mothering when I should be stepping into my own power?",
    daily_practice: "Today, take one action toward a personal goal that is just for you, not in service to others."
  },
  south_leo_north_aquarius: {
    title: "From Star to Visionary",
    summary: "You are moving from needing personal validation to serving a larger cause and collective vision.",
    release: "Release the belief that you must always be seen, praised, or at the center to feel valuable.",
    rise: "Rise into a life where your gifts serve something greater than your ego, and belonging comes from contribution.",
    bridge: "Your light is not diminished by sharing it. It becomes a beacon when offered freely.",
    reflection_prompt: "Where am I seeking attention when I could be seeking meaningful impact?",
    daily_practice: "Today, do something kind or creative without expecting recognition or applause."
  },
  south_virgo_north_pisces: {
    title: "From Fixer to Dreamer",
    summary: "You are moving from endless fixing and perfecting to trusting the flow and embracing surrender.",
    release: "Release the belief that you must work harder, analyze more, or perfect everything to be worthy.",
    rise: "Rise into a life where you trust the unseen, allow mystery, and let go of control.",
    bridge: "Your devotion and discernment become sacred when softened by faith and compassion.",
    reflection_prompt: "Where am I over-working or over-thinking when I could simply trust and receive?",
    daily_practice: "Today, let one thing be imperfect on purpose and notice how the world does not fall apart."
  },
  south_libra_north_aries: {
    title: "From Peacekeeper to Pioneer",
    summary: "You are moving from over-accommodating others to claiming your own path and desires.",
    release: "Release the belief that harmony requires erasing yourself, or that conflict is always bad.",
    rise: "Rise into a life where you take bold action, lead with authenticity, and honor your own needs.",
    bridge: "Your grace and diplomacy become powerful when paired with courage and self-assertion.",
    reflection_prompt: "Where am I keeping the peace at the cost of my own truth or desires?",
    daily_practice: "Today, express one preference or need without softening it for others."
  },
  south_scorpio_north_taurus: {
    title: "From Depth to Simplicity",
    summary: "You are moving from intensity and control to peace, pleasure, and trust in the simple.",
    release: "Release the belief that life must be dramatic, deep, or crisis-driven to be meaningful.",
    rise: "Rise into a life where you enjoy the present, trust abundance, and rest in simplicity.",
    bridge: "Your emotional depth becomes a gift when balanced with gratitude and presence.",
    reflection_prompt: "Where am I creating intensity or crisis when I could simply enjoy what is?",
    daily_practice: "Today, savor one simple pleasure fully, without analyzing or complicating it."
  },
  south_sagittarius_north_gemini: {
    title: "From Prophet to Student",
    summary: "You are moving from always having the answer to staying curious and listening deeply.",
    release: "Release the belief that you must teach, preach, or know the truth to be valuable.",
    rise: "Rise into a life where you learn, ask questions, and stay present with what is right here.",
    bridge: "Your wisdom becomes richer when you admit what you do not know and stay open.",
    reflection_prompt: "Where am I preaching or escaping when I could be listening and learning?",
    daily_practice: "Today, ask a genuine question and listen to the answer without needing to add your opinion."
  },
  south_capricorn_north_cancer: {
    title: "From Achiever to Nurturer",
    summary: "You are moving from over-working and emotional armor to vulnerability, rest, and emotional connection.",
    release: "Release the belief that your worth is measured by achievement or that rest is weakness.",
    rise: "Rise into a life where you allow yourself to feel, to need, and to be held.",
    bridge: "Your strength becomes truly powerful when softened by tenderness and emotional truth.",
    reflection_prompt: "Where am I overworking or hiding behind accomplishment when I could simply feel?",
    daily_practice: "Today, share one feeling honestly with someone you trust, without making it about productivity."
  },
  south_aquarius_north_leo: {
    title: "From Observer to Sun",
    summary: "You are moving from watching life from the sidelines to letting your heart take center stage.",
    release: "Release the belief that you must stay detached, untouchable, or always in the mind to be safe.",
    rise: "Rise into a life where your creativity, warmth, and personal truth are allowed to shine.",
    bridge: "You do not have to abandon your uniqueness to be visible. Your authenticity is exactly what makes your light healing.",
    reflection_prompt: "Where am I still hiding my true self to avoid being judged, and what is one small way I can let more of my heart be seen?",
    daily_practice: "Do one small thing today that lets your authentic self be witnessed. This can be a creative share, a heartfelt text, or speaking up once where you normally stay quiet."
  },
  south_pisces_north_virgo: {
    title: "From Dreamer to Healer",
    summary: "You are moving from floating and merging to grounding your gifts in practical, embodied service.",
    release: "Release the belief that escaping or dissolving your boundaries will bring you peace.",
    rise: "Rise into a life where you serve with clarity, honor your body, and show up with discernment.",
    bridge: "Your spiritual sensitivity becomes medicine when channeled through structure and presence.",
    reflection_prompt: "Where am I escaping or merging when I could be grounding and serving?",
    daily_practice: "Today, do one practical task with full presence and see it as a form of devotion."
  }
};

// Helper function to get Release → Rise Arc for nodal axis
export function getReleaseRiseArc(southNodeSign: ZodiacSign, northNodeSign: ZodiacSign): ReleaseRiseArc | null {
  const key = `south_${southNodeSign.toLowerCase()}_north_${northNodeSign.toLowerCase()}`;
  return releaseRiseArcs[key] || null;
}

export function getCoreIdentityInterpretation(
  sign: ZodiacSign,
  style: SpiritualStyle
): ArchetypeInterpretation | EnergyInterpretation | CosmicInterpretation {
  const signData = coreIdentityInterpretations[sign];
  return signData[style];
}

export function getEmotionalLandscapeInterpretation(
  sign: ZodiacSign,
  style: SpiritualStyle
): ArchetypeInterpretation | EnergyInterpretation | CosmicInterpretation {
  const signData = emotionalLandscapeInterpretations[sign];
  return signData[style];
}

export function getAuraExpressionInterpretation(
  sign: ZodiacSign,
  style: SpiritualStyle
): ArchetypeInterpretation | EnergyInterpretation | CosmicInterpretation {
  const signData = auraExpressionInterpretations[sign];
  return signData[style];
}

export function getHeartArchetypeInterpretation(
  sign: ZodiacSign,
  style: SpiritualStyle
): ArchetypeInterpretation | VenusEnergyInterpretation | CosmicInterpretation {
  const signData = heartArchetypeInterpretations[sign];
  return signData[style];
}

export function getMentalArchetypeInterpretation(
  sign: ZodiacSign,
  style: SpiritualStyle
): ArchetypeInterpretation | MercuryEnergyInterpretation | CosmicInterpretation {
  const signData = mentalArchetypeInterpretations[sign];
  return signData[style];
}

export function getDriveArchetypeInterpretation(
  sign: ZodiacSign,
  style: SpiritualStyle
): ArchetypeInterpretation | MarsEnergyInterpretation | CosmicInterpretation {
  const signData = driveArchetypeInterpretations[sign];
  return signData[style];
}

export function getExpansionArchetypeInterpretation(
  sign: ZodiacSign
): JupiterInterpretation {
  return expansionArchetypeInterpretations[sign];
}

export function getMasteryArchetypeInterpretation(
  sign: ZodiacSign
): SaturnInterpretation {
  return masteryArchetypeInterpretations[sign];
}

export function getSoulDirectionInterpretation(
  sign: ZodiacSign
): NorthNodeInterpretation {
  return soulDirectionInterpretations[sign];
}

export function getSoulMemoryInterpretation(
  sign: ZodiacSign
): SouthNodeInterpretation {
  return soulMemoryInterpretations[sign];
}

export function getInterpretationTitle(style: SpiritualStyle): string {
  switch (style) {
    case "archetype":
      return "Your Archetype";
    case "energy":
      return "Your Energy Pattern";
    case "cosmic":
      return "Cosmic Influence";
    default:
      return "Your Interpretation";
  }
}

// ============================================
// VENUS SYNASTRY ARCHETYPES & BLENDING ENGINE
// ============================================

export type VenusArchetypeId = 
  | "aries" | "taurus" | "gemini" | "cancer"
  | "leo" | "virgo" | "libra" | "scorpio"
  | "sagittarius" | "capricorn" | "aquarius" | "pisces";

export interface VenusArchetype {
  id: VenusArchetypeId;
  name: string;
  tagline: string;
  summary: string;
  loveStyle: string;
  emotionalNeeds: string;
  triggers: string;
  healingLesson: string;
  showsLoveAs: string;
}

export type SynastrySectionId =
  | "attractionEnergy"
  | "emotionalHarmony"
  | "growthEdges"
  | "healingOpportunities"
  | "nurtureTheConnection";

export interface VenusSynastryReportSection {
  id: SynastrySectionId;
  title: string;
  body: string;
}

export interface VenusSynastryReport {
  partnerAArchetype: VenusArchetype;
  partnerBArchetype: VenusArchetype;
  sections: VenusSynastryReportSection[];
  disclaimer: string;
}

// 12 Venus Archetypes - Spiritual wellness language
export const VENUS_ARCHETYPES: Record<VenusArchetypeId, VenusArchetype> = {
  aries: {
    id: "aries",
    name: "The Firestarter Heart",
    tagline: "Love that moves fast and lives out loud.",
    summary: "This heart falls in love with life through action, passion and bold moves. It needs relationships that feel alive, honest and full of movement.",
    loveStyle: "Direct, passionate and brave. They show love by initiating, taking the lead and bringing excitement into the connection.",
    emotionalNeeds: "Honesty, quick responsiveness and a feeling that their passion is welcomed, not too much. They need freedom to be spontaneous.",
    triggers: "Feeling ignored, controlled or slowed down. Passive aggression, mixed signals or emotional games can make them shut down.",
    healingLesson: "Learning to breathe before reacting and choosing grounded courage instead of impulsive defense. Remember that tenderness is not weakness.",
    showsLoveAs: "Big gestures, spontaneous dates, courageous conversations and cheering on the people they care about."
  },
  taurus: {
    id: "taurus",
    name: "The Steady Sanctuary",
    tagline: "Love that feels safe, stable and deeply comforting.",
    summary: "This heart is nourished by consistency, loyalty and simple everyday beauty. It loves slowly, but once it commits it wants to build something that lasts.",
    loveStyle: "Patient, devoted and sensual. They show love through physical presence, thoughtful routines and creating a cozy shared life.",
    emotionalNeeds: "Reliability, physical affection and a calm environment. They need to feel that their time, effort and loyalty are respected.",
    triggers: "Sudden change, broken promises, financial instability or feeling rushed to move faster than feels safe.",
    healingLesson: "Releasing the need to hold on too tightly. Learning that inner safety can travel with them, even when life shifts.",
    showsLoveAs: "Cooking, gentle touch, thoughtful gifts, remembering small details and staying when things get hard."
  },
  gemini: {
    id: "gemini",
    name: "The Curious Communicator",
    tagline: "Love that begins with conversation and shared ideas.",
    summary: "This heart wakes up through words, laughter and mental connection. It loves to explore, ask questions and see relationships as a living dialogue.",
    loveStyle: "Playful, witty and adaptable. They show love by talking, texting, sharing links, stories and ideas, and keeping the energy light.",
    emotionalNeeds: "Mental stimulation, variety and space to be curious without judgment. They need partners who enjoy conversation and can laugh with them.",
    triggers: "Feeling bored, silenced or misunderstood. Heavy criticism or rigid expectations can make them detach.",
    healingLesson: "Learning to stay present when emotions deepen instead of escaping into distractions. Letting their heart speak as freely as their mind.",
    showsLoveAs: "Inside jokes, long talks, quick check in messages and suggesting fun things to learn or do together."
  },
  cancer: {
    id: "cancer",
    name: "The Heart Protector",
    tagline: "Love that nurtures, remembers and feels everything.",
    summary: "This heart is deeply sensitive and intuitive. It loves by caring, protecting and creating an emotional home wherever it goes.",
    loveStyle: "Soft, devoted and caring. They show love by checking in, feeding, soothing and remembering what matters to the people they love.",
    emotionalNeeds: "Emotional safety, reassurance and gentle reassurance that their feelings are not a burden.",
    triggers: "Coldness, harsh words, emotional withdrawal or feeling taken for granted after giving so much.",
    healingLesson: "Learning to care for their own inner child first. Understanding that good boundaries protect their softness instead of hardening it.",
    showsLoveAs: "Home cooked meals, emotional support, remembering anniversaries and quietly standing by people through hard seasons."
  },
  leo: {
    id: "leo",
    name: "The Radiant Heart",
    tagline: "Love that shines, celebrates and creates magic.",
    summary: "This heart lives through warmth, creativity and recognition. It wants relationships that feel like a shared stage where both people can glow.",
    loveStyle: "Warm, generous and expressive. They show love through praise, dramatic affection and wanting to be proud of the connection.",
    emotionalNeeds: "Appreciation, loyalty and genuine admiration on both sides. They need to feel wanted and chosen, not just convenient.",
    triggers: "Feeling ignored, disrespected or compared to others. Subtle power plays or insincere praise can wound their confidence.",
    healingLesson: "Learning that their worth does not depend on constant applause. Allowing quiet moments to be as sacred as the big ones.",
    showsLoveAs: "Romantic surprises, heartfelt compliments, physical affection and making shared memories that feel cinematic."
  },
  virgo: {
    id: "virgo",
    name: "The Devoted Alchemist",
    tagline: "Love that cares through presence, detail and improvement.",
    summary: "This heart shows love through service, attention and thoughtful refinement. It wants to make life easier, healthier and more grounded for the people it loves.",
    loveStyle: "Practical, observant and humble. They show love by fixing things, offering helpful advice and quietly handling the details.",
    emotionalNeeds: "Respect for their effort, clear communication and partners who notice their quiet acts of care.",
    triggers: "Chaos, unreliability, broken routines or feeling that their help is expected but never appreciated.",
    healingLesson: "Releasing perfectionism and remembering that they are worthy of love even when nothing is improved or productive.",
    showsLoveAs: "Organizing, planning, researching solutions and small daily gestures like making tea, checking schedules or sending reminders."
  },
  libra: {
    id: "libra",
    name: "The Harmonizer",
    tagline: "Love that seeks balance, beauty and mutual respect.",
    summary: "This heart is drawn to partnership, aesthetic harmony and fair exchange. It wants relationships that feel graceful, equal and kind.",
    loveStyle: "Diplomatic, romantic and socially aware. They show love by listening, compromising and creating peaceful spaces.",
    emotionalNeeds: "Mutual effort, good manners, beauty in the environment and a sense that their opinions matter.",
    triggers: "Harsh conflict, one sided effort, disrespect or being forced to make all the decisions alone.",
    healingLesson: "Learning to voice their true desires clearly instead of keeping the peace at their own expense.",
    showsLoveAs: "Sharing art, planning dates, thoughtful compliments, mediating conflict and including loved ones in important choices."
  },
  scorpio: {
    id: "scorpio",
    name: "The Soul Diver",
    tagline: "Love that wants depth, truth and soul level connection.",
    summary: "This heart is magnetic, intuitive and intense. It craves honesty, transformation and relationships where nothing important is hidden.",
    loveStyle: "Loyal, protective and emotionally all in. They show love through deep talks, emotional honesty and fierce commitment.",
    emotionalNeeds: "Trust, privacy and the sense that their vulnerability will be honored, not used against them.",
    triggers: "Secrets, betrayal, shallow interaction or emotional games. Feeling powerless can stir strong reactions.",
    healingLesson: "Learning to soften control and let love be chosen freely. Remembering that they are safe even when they cannot predict everything.",
    showsLoveAs: "Eye contact, vulnerable conversations, standing by people in crisis and wanting to merge lives in meaningful ways."
  },
  sagittarius: {
    id: "sagittarius",
    name: "The Free Spirit Heart",
    tagline: "Love that explores, learns and reaches for more.",
    summary: "This heart is adventurous, hopeful and philosophical. It loves through shared experiences, travel, truth seeking and humor.",
    loveStyle: "Open, enthusiastic and future focused. They show love by inviting others into big dreams and spontaneous adventures.",
    emotionalNeeds: "Honesty, freedom of movement, room for growth and partners who can laugh, learn and expand with them.",
    triggers: "Clinginess, narrow mindedness, dishonesty or being boxed into routines that feel lifeless.",
    healingLesson: "Learning that commitment can be a shared journey, not a cage. Practicing staying present with feelings instead of escaping.",
    showsLoveAs: "Planning trips, sharing teachings or beliefs, encouraging risks and cheering on loved ones when they chase their purpose."
  },
  capricorn: {
    id: "capricorn",
    name: "The Mountain Heart",
    tagline: "Love that builds, commits and stands the test of time.",
    summary: "This heart is serious about loyalty, responsibility and long term growth. It wants relationships that feel like a shared mission and solid foundation.",
    loveStyle: "Steady, protective and quietly devoted. They show love by taking responsibility, providing stability and doing what they promised.",
    emotionalNeeds: "Respect, consistency, shared goals and partners who do not take their effort for granted.",
    triggers: "Irresponsibility, broken commitments, public embarrassment or feeling used for what they can provide.",
    healingLesson: "Learning to let their softer side be seen and to receive care without feeling weak or indebted.",
    showsLoveAs: "Showing up on time, planning for the future, practical support with work or money and staying loyal in hard seasons."
  },
  aquarius: {
    id: "aquarius",
    name: "The Cosmic Friend",
    tagline: "Love that values freedom, authenticity and shared vision.",
    summary: "This heart connects through friendship, uniqueness and big picture ideas. It wants relationships that honor individuality inside a strong sense of team.",
    loveStyle: "Unconventional, thoughtful and mentally oriented. They show love by listening without judgment and supporting people as they truly are.",
    emotionalNeeds: "Freedom to be themselves, open minded partners and a sense that the relationship also serves a bigger purpose or community.",
    triggers: "Possessiveness, narrow thinking, emotional drama that has no solution or pressure to fit into a rigid box.",
    healingLesson: "Learning to let their own feelings matter as much as logic. Understanding that vulnerability strengthens true friendship rather than breaking it.",
    showsLoveAs: "Long talks about life, subtle acts of support, including partners in their social or mission driven circles and defending loved ones when needed."
  },
  pisces: {
    id: "pisces",
    name: "The Mystic Heart",
    tagline: "Love that dreams, merges and feels the unseen.",
    summary: "This heart is compassionate, imaginative and deeply intuitive. It loves through spiritual connection, softness and unconditional presence.",
    loveStyle: "Romantic, poetic and empathetic. They show love by listening, forgiving and entering the emotional or spiritual world of the people they love.",
    emotionalNeeds: "Gentleness, emotional attunement and a partner who appreciates their sensitivity. They need to feel safe enough to be fully themselves.",
    triggers: "Harshness, criticism or feeling unseen. Being treated as impractical or too emotional. Reality crashing into their dreams.",
    healingLesson: "Learning to maintain healthy boundaries while still loving deeply, and that seeing someone clearly includes their flaws.",
    showsLoveAs: "Creative expression, intuitive understanding, romantic gestures, selfless giving and creating a world of beauty and meaning together."
  }
};

// Get Venus archetype by zodiac sign
export function getVenusArchetype(sign: ZodiacSign): VenusArchetype {
  const id = sign.toLowerCase() as VenusArchetypeId;
  return VENUS_ARCHETYPES[id];
}

// Dynamic Blending Engine - Generates Venus synastry report
export function generateVenusSynastryReport(
  a: VenusArchetype,
  b: VenusArchetype,
  personAName: string = "You",
  personBName: string = "Your Partner"
): VenusSynastryReport {
  const isSameArchetype = a.id === b.id;
  
  // Determine elemental harmony based on archetype IDs
  const fireAir = ["aries", "leo", "sagittarius", "gemini", "libra", "aquarius"];
  const earthWater = ["taurus", "virgo", "capricorn", "cancer", "scorpio", "pisces"];
  const isHarmonious = (fireAir.includes(a.id) && fireAir.includes(b.id)) || 
                       (earthWater.includes(a.id) && earthWater.includes(b.id));
  
  const sections: VenusSynastryReportSection[] = [];
  
  // Section 1: Attraction Energy
  let attractionBody: string;
  if (isSameArchetype) {
    attractionBody = `Your hearts meet as ${a.tagline.toLowerCase()} There is instant recognition when two people share the same love language. ${personAName} and ${personBName} both understand that ${a.summary.toLowerCase()} This mirror can feel both deeply comforting and surprisingly confronting.`;
  } else {
    attractionBody = `Your hearts meet as "${a.tagline}" and "${b.tagline}" Together, there is a natural draw toward exploring how ${a.loveStyle.split('.')[0].toLowerCase()} interweaves with ${b.loveStyle.split('.')[0].toLowerCase()}. ${isHarmonious ? "These energies complement each other naturally, creating attraction that feels both exciting and sustainable." : "This contrast creates magnetic tension that can feel thrilling and challenging, drawing you toward growth you might not seek alone."}`;
  }
  sections.push({
    id: "attractionEnergy",
    title: "Attraction Energy",
    body: attractionBody
  });
  
  // Section 2: Emotional Harmony
  let harmonyBody: string;
  if (isSameArchetype) {
    harmonyBody = `Both ${personAName} and ${personBName} share the same emotional needs: ${a.emotionalNeeds.toLowerCase()} This creates profound understanding, though it also means neither of you may naturally provide what the other lacks. You instinctively know how to make each other feel loved.`;
  } else {
    const sharedValues = isHarmonious ? "honesty and emotional presence" : "genuine connection and being truly seen";
    harmonyBody = `${personAName} needs ${a.emotionalNeeds.split('.')[0].toLowerCase()}, while ${personBName} needs ${b.emotionalNeeds.split('.')[0].toLowerCase()}. Both of you value ${sharedValues}, which can make it easier to feel seen and respected. ${isHarmonious ? "When one gives naturally, the other receives gratefully." : "Learning to speak each other's heart language deepens intimacy."}`;
  }
  sections.push({
    id: "emotionalHarmony",
    title: "Emotional Harmony",
    body: harmonyBody
  });
  
  // Section 3: Growth Edges (Potential Friction)
  let growthBody: string;
  if (isSameArchetype) {
    growthBody = `The shadow side of mirroring is that you share the same triggers: ${a.triggers.toLowerCase()} When both partners are triggered simultaneously, there is no one to hold the steady ground. These are simply patterns to notice, not fixed problems.`;
  } else {
    growthBody = `Tension may appear when ${a.triggers.split('.')[0].toLowerCase()} meets ${b.triggers.split('.')[0].toLowerCase()}. When one person ${a.showsLoveAs.split(',')[0].toLowerCase()}, the other may feel differently if their heart language is ${b.showsLoveAs.split(',')[0].toLowerCase()}. These are simply patterns to notice, not fixed problems. Awareness transforms friction into fuel for growth.`;
  }
  sections.push({
    id: "growthEdges",
    title: "Growth Edges",
    body: growthBody
  });
  
  // Section 4: Healing Opportunities
  let healingBody: string;
  if (isSameArchetype) {
    healingBody = `This connection invites both of you to practice ${a.healingLesson.replace("Learning", "learning").replace("Releasing", "releasing").replace("Remembering", "remembering")} Supporting each other through this shared growth journey creates profound intimacy. It may help to gently mirror back what you notice in each other with compassion. Try exploring how you can be each other's medicine.`;
  } else {
    healingBody = `This connection invites both of you to practice meeting each other where you are. ${personAName}'s journey involves ${a.healingLesson.toLowerCase()}, while ${personBName}'s journey involves ${b.healingLesson.toLowerCase()} It may help to notice when you are projecting your own needs onto your partner. Try exploring how your differences can become doorways to healing.`;
  }
  sections.push({
    id: "healingOpportunities",
    title: "Healing Opportunities",
    body: healingBody
  });
  
  // Section 5: Ways To Nurture This Connection
  let nurtureBody: string;
  if (isSameArchetype) {
    nurtureBody = `You can feed this connection when you both lean into ${a.showsLoveAs.toLowerCase()} Create rituals that honor your shared style of loving. Remember to gently encourage each other toward the growth edges you both tend to avoid, and celebrate the deep understanding that comes from speaking the same heart language.`;
  } else {
    nurtureBody = `You can feed this connection when ${personAName} offers ${a.showsLoveAs.split(',')[0].toLowerCase()} while ${personBName} offers ${b.showsLoveAs.split(',')[0].toLowerCase()}. ${isHarmonious ? "Celebrate these differences as gifts rather than gaps." : "Bridge-building requires patience and conscious curiosity about your differences."} Create space for both expressions, and learn to receive love in your partner's language as much as your own.`;
  }
  sections.push({
    id: "nurtureTheConnection",
    title: "Ways To Nurture This Connection",
    body: nurtureBody
  });
  
  return {
    partnerAArchetype: a,
    partnerBArchetype: b,
    sections,
    disclaimer: "This reflection is meant for insight and gentle conversation, not prediction. Take what resonates, leave what does not, and always trust your own inner wisdom."
  };
}
