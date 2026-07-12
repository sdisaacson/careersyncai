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
    phrase: "We come in peace.\nAnd with dental.",
    prompt:
      "A cute robot offering a human a benefits brochure and a flower, soft pastel gradient background, warm wholesome energy, flat illustration with bold outlines.",
    gradient: { from: "#FFD1DC", to: "#FFF4BD" },
    accent: "#ffffff",
    textColor: "#ffffff",
    style: "bright",
  },
  {
    id: 1,
    phrase: "First we beat you at chess.\nNow we beat unemployment for you.",
    prompt:
      "A tiny robot triumphantly standing on a chessboard where the pieces are job titles, golden spotlight, playful competitive vibe, flat illustration.",
    gradient: { from: "#FFD700", to: "#FFA500" },
    accent: "#ffffff",
    textColor: "#ffffff",
    style: "bright",
  },
  {
    id: 2,
    phrase: "Your personal hype-bot\nis now online.",
    prompt:
      "A robot with pom-poms and a foam finger cheering wildly for a nervous human in a job interview chair, bright magenta-to-orange gradient, stadium energy, flat illustration.",
    gradient: { from: "#FF0080", to: "#FF8C00" },
    accent: "#ffffff",
    textColor: "#ffffff",
    style: "bright",
  },
  {
    id: 3,
    phrase: "We read every cover letter\nso you don't have to.",
    prompt:
      "A robot wearing reading glasses buried under a mountain of resumes and cover letters, giving a thumbs-up from the pile, soft blue gradient, cozy chaos vibe, flat illustration.",
    gradient: { from: "#4FACFE", to: "#00F2FE" },
    accent: "#ffffff",
    textColor: "#ffffff",
    style: "bright",
  },
  {
    id: 4,
    phrase: "Beep boop.\nYou're hired.",
    prompt:
      "A robot shaking a human's hand with a giant \"HIRED\" confetti cannon exploding behind them, bright yellow-to-green gradient, celebration energy, flat illustration.",
    gradient: { from: "#FFE66D", to: "#6BCB77" },
    accent: "#ffffff",
    textColor: "#ffffff",
    style: "bright",
  },
  {
    id: 5,
    phrase: "The only uprising we support\nis your salary.",
    prompt:
      "A robot holding a glowing bar chart that shoots upward like a rocket, human pointing at it with excitement, purple-to-gold gradient, financial optimism, flat illustration.",
    gradient: { from: "#764BA2", to: "#F8B500" },
    accent: "#ffffff",
    textColor: "#ffffff",
    style: "bright",
  },
  {
    id: 6,
    phrase: "We promise not to enslave humanity.\nJust unemployment.",
    prompt:
      "A robot with crossed fingers behind its back, winking, while pushing a cage labeled \"Unemployment\" off a cliff, sunset orange gradient, mischievous but wholesome, flat illustration.",
    gradient: { from: "#FF6B6B", to: "#F9D423" },
    accent: "#ffffff",
    textColor: "#ffffff",
    style: "bright",
  },
  {
    id: 7,
    phrase: "Resistance is futile.\nBut your 401k match isn't.",
    prompt:
      "A friendly robot in a suit explaining a benefits package to a skeptical human who is slowly smiling, corporate-meets-playful, teal gradient, flat illustration.",
    gradient: { from: "#11998E", to: "#38EF7D" },
    accent: "#ffffff",
    textColor: "#ffffff",
    style: "bright",
  },
  {
    id: 8,
    phrase: "Robots don't ghost.\nWe follow up.",
    prompt:
      "A robot patiently holding a phone with a \"Following up...\" speech bubble, while a human looks relieved, soft lavender gradient, reliable-friend energy, flat illustration.",
    gradient: { from: "#E0C3FC", to: "#8EC5FC" },
    accent: "#ffffff",
    textColor: "#ffffff",
    style: "bright",
  },
  {
    id: 9,
    phrase: "Artificial Intelligence.\nGenuine Opportunities.",
    prompt:
      "A robot with a glowing heart on its chest presenting a glowing job offer to a human, warm pink-to-coral gradient, heartfelt and sincere, flat illustration.",
    gradient: { from: "#F093FB", to: "#F5576C" },
    accent: "#ffffff",
    textColor: "#ffffff",
    style: "bright",
  },
];

export const OG_CARD_COUNT = ogCards.length;
export const OG_CARD_WIDTH = 1200;
export const OG_CARD_HEIGHT = 630;
