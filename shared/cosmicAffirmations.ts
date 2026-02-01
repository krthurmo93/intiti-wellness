// Cosmic Daily Affirmation Generator with 10 Distinct Templates
// Tone: mystical, intuitive, in-between worlds, soft but powerful

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const cosmicFlows = [
  "cosmic flow",
  "mystical current of the universe",
  "unseen rivers of the cosmos",
  "sacred in-between spaces",
  "subtle realms of spirit",
  "invisible threads of fate",
  "starlit pathways of destiny"
];

const guidanceWords = [
  "intuition",
  "inner knowing",
  "higher self",
  "inner oracle",
  "soul wisdom",
  "deep inner voice",
  "sacred instinct"
];

const gifts = [
  "clarity",
  "peace",
  "insight",
  "healing",
  "courage",
  "tender self-trust",
  "quiet strength",
  "gentle wonder"
];

const qualities = [
  "soft yet powerful",
  "grounded and luminous",
  "open, curious, and protected",
  "mystical yet practical",
  "deeply loving toward myself",
  "centered and expansive",
  "calm yet fully alive"
];

// 10 structurally distinct templates
function template1(): string {
  return `I am in gentle conversation with the ${pick(cosmicFlows)}, and each day it reveals new ways for me to choose ${pick(gifts)}.`;
}

function template2(): string {
  return `Today I let my ${pick(guidanceWords)} lead, trusting that the universe is arranging what I cannot yet see in my favor.`;
}

function template3(): string {
  return `There is a quiet, ${pick(qualities)} part of me that already knows the way, and I allow that part to guide my next steps.`;
}

function template4(): string {
  return `With every breath, I move deeper into alignment with the unseen support that has always been holding me.`;
}

function template5(): string {
  return `I welcome synchronicities, signs, and subtle nudges, knowing each one mirrors my growing ${pick(gifts)}.`;
}

function template6(): string {
  return `Even in the in-between, I am guided, protected, and loved; nothing meant for me can pass me by.`;
}

function template7(): string {
  return `My body, mind, and spirit soften into trust as I release control and allow the ${pick(cosmicFlows)} to carry me where I am ready to grow.`;
}

function template8(): string {
  return `I honor the magic within me by moving slowly, listening deeply, and choosing only what feels true to my soul.`;
}

function template9(): string {
  return `Every day, I become more attuned to the whispers of my ${pick(guidanceWords)}, and I act on them with calm, quiet confidence.`;
}

function template10(): string {
  return `I give myself permission to live as a mystical being in a practical world, weaving ${pick(gifts)} into everything I do.`;
}

const cosmicTemplates = [
  template1,
  template2,
  template3,
  template4,
  template5,
  template6,
  template7,
  template8,
  template9,
  template10
];

// Personalized versions that incorporate sun/moon signs
function personalizedTemplate1(sunSign: string, moonSign: string): string {
  return `As a ${sunSign}, I am in gentle conversation with the ${pick(cosmicFlows)}, and each day it reveals new ways for me to choose ${pick(gifts)}.`;
}

function personalizedTemplate2(sunSign: string, moonSign: string): string {
  return `Today I let my ${pick(guidanceWords)} lead, trusting that my ${moonSign} sensitivity guides me toward what the universe is arranging in my favor.`;
}

function personalizedTemplate3(sunSign: string, moonSign: string): string {
  return `There is a quiet, ${pick(qualities)} part of my ${sunSign} spirit that already knows the way, and I allow that part to guide my next steps.`;
}

function personalizedTemplate4(sunSign: string, moonSign: string): string {
  return `With every breath, my ${moonSign} heart moves deeper into alignment with the unseen support that has always been holding me.`;
}

function personalizedTemplate5(sunSign: string, moonSign: string): string {
  return `I welcome synchronicities, signs, and subtle nudges, knowing each one mirrors my ${sunSign} journey toward ${pick(gifts)}.`;
}

function personalizedTemplate6(sunSign: string, moonSign: string): string {
  return `Even in the in-between, my ${moonSign} intuition reminds me I am guided, protected, and loved; nothing meant for me can pass me by.`;
}

function personalizedTemplate7(sunSign: string, moonSign: string): string {
  return `My body, mind, and spirit soften into trust as I release control and allow my ${sunSign} nature to flow with the ${pick(cosmicFlows)}.`;
}

function personalizedTemplate8(sunSign: string, moonSign: string): string {
  return `As a ${sunSign} with ${moonSign} sensitivity, I honor my magic by moving slowly, listening deeply, and choosing only what feels true.`;
}

function personalizedTemplate9(sunSign: string, moonSign: string): string {
  return `Every day, I become more attuned to the whispers of my ${pick(guidanceWords)}, and my ${sunSign} courage helps me act on them with quiet confidence.`;
}

function personalizedTemplate10(sunSign: string, moonSign: string): string {
  return `I give myself permission to live as a mystical ${sunSign}, weaving ${pick(gifts)} into everything I do while honoring my ${moonSign} depths.`;
}

const personalizedCosmicTemplates = [
  personalizedTemplate1,
  personalizedTemplate2,
  personalizedTemplate3,
  personalizedTemplate4,
  personalizedTemplate5,
  personalizedTemplate6,
  personalizedTemplate7,
  personalizedTemplate8,
  personalizedTemplate9,
  personalizedTemplate10
];

export function getCosmicDailyAffirmation(): string {
  const template = pick(cosmicTemplates);
  return template();
}

export function getPersonalizedCosmicAffirmation(sunSign: string, moonSign: string): string {
  const template = pick(personalizedCosmicTemplates);
  return template(sunSign, moonSign);
}
