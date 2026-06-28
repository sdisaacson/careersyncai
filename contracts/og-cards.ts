export type OgCardStyle = "sleek" | "bright";

export type OgCard = {
  id: number;
  phrase: string;
  prompt: string;
  gradient: {
    from: string;
    to: string;
  };
  accent: string;
  textColor: string;
  style: OgCardStyle;
};

export const ogCards: OgCard[] = [
  {
    id: 0,
    phrase: "Your career,\ndecoded by AI",
    prompt:
      "Neural network brain made of constellations, electric blue and violet light trails, deep navy void background, cinematic sci-fi.",
    gradient: { from: "#0B0E14", to: "#1a1f2e" },
    accent: "#00C9FF",
    textColor: "#ffffff",
    style: "sleek",
  },
  {
    id: 1,
    phrase: "Stop applying.\nStart matching.",
    prompt:
      "Two luminous geometric forms sliding into perfect alignment, electric blue and violet energy at the seam, dark space background.",
    gradient: { from: "#0B0E14", to: "#1a1f2e" },
    accent: "#00C9FF",
    textColor: "#ffffff",
    style: "sleek",
  },
  {
    id: 2,
    phrase: "The resume that\ngets the interview",
    prompt:
      "A glowing resume page morphing into a crystal key, electric blue light emanating, dark tech background.",
    gradient: { from: "#0B0E14", to: "#1a1f2e" },
    accent: "#00C9FF",
    textColor: "#ffffff",
    style: "sleek",
  },
  {
    id: 3,
    phrase: "AI-powered interview prep,\ntailored to you",
    prompt:
      "A holographic human silhouette surrounded by concentric soundwaves and data rings, electric blue and violet, dark background.",
    gradient: { from: "#0B0E14", to: "#1a1f2e" },
    accent: "#00C9FF",
    textColor: "#ffffff",
    style: "sleek",
  },
  {
    id: 4,
    phrase: "Find your next role\nbefore it finds you",
    prompt:
      "A futuristic city skyline at night with career paths as glowing circuits lighting up across buildings, electric blue and violet.",
    gradient: { from: "#0B0E14", to: "#1a1f2e" },
    accent: "#00C9FF",
    textColor: "#ffffff",
    style: "sleek",
  },
  {
    id: 5,
    phrase: "AI took the jobs.\nWe brought better ones.",
    prompt:
      "Friendly cartoon robots carrying briefcases and coffee, bright coral-to-yellow gradient, bold playful typography, flat illustration style.",
    gradient: { from: "#FF6B6B", to: "#FFE66D" },
    accent: "#ffffff",
    textColor: "#ffffff",
    style: "bright",
  },
  {
    id: 6,
    phrase: "Your robot overlords\nmake great recruiters.",
    prompt:
      "A friendly robot in a tie pointing at a glowing job board, purple and blue gradient, human silhouettes cheering, bold comic style.",
    gradient: { from: "#667EEA", to: "#764BA2" },
    accent: "#ffffff",
    textColor: "#ffffff",
    style: "bright",
  },
  {
    id: 7,
    phrase: "Don't panic.\nWe came to fix this.",
    prompt:
      "A calm robot holding a 'You're hired' sign while humans relax, bright green gradient, emergency-panic-turned-to-relief vibe, flat illustration.",
    gradient: { from: "#11998E", to: "#38EF7D" },
    accent: "#ffffff",
    textColor: "#ffffff",
    style: "bright",
  },
  {
    id: 8,
    phrase: "AI caused the problem.\nAI will find your next gig.",
    prompt:
      "A robot with a magnifying glass scanning a sea of job listings, pink-to-red gradient, bright optimistic style, flat illustration.",
    gradient: { from: "#F093FB", to: "#F5576C" },
    accent: "#ffffff",
    textColor: "#ffffff",
    style: "bright",
  },
  {
    id: 9,
    phrase: "Humans wanted.\nAI assistants standing by.",
    prompt:
      "A neon 'Now Hiring' sign with friendly robots waving humans forward, bright cyan-blue gradient, retro-futuristic job fair energy.",
    gradient: { from: "#4FACFE", to: "#00F2FE" },
    accent: "#ffffff",
    textColor: "#ffffff",
    style: "bright",
  },
];

export const OG_CARD_COUNT = ogCards.length;
export const OG_CARD_WIDTH = 1200;
export const OG_CARD_HEIGHT = 630;
