import fs from "fs";
import path from "path";
import sharp from "sharp";
import "dotenv/config";
import { generateText } from "ai";
import {
  ogCards,
  OG_CARD_WIDTH,
  OG_CARD_HEIGHT,
} from "../contracts/og-cards";

const OUT_DIR = path.resolve(process.cwd(), "public/og-cards");

// The Vercel AI SDK automatically uses the AI Gateway for provider/model
// strings. On Vercel (or locally after `vercel env pull`) it authenticates
// via OIDC; otherwise set AI_GATEWAY_API_KEY in your .env.
const IMAGE_MODEL = "google/gemini-3-pro-preview";

const SYSTEM_PROMPT = `You are an expert SVG artist. The user will provide a description inside square brackets like [Use this verbiage as the heading using the font Inter: "AI's took your jobs? We brought better ones." — Display Friendly cartoon robots carrying briefcases and coffee, bright coral-to-yellow gradient, bold playful typography, flat illustration style.]. Based on that description, generate a complete and valid SVG file using pure SVG markup. The SVG canvas should default to [1200x630] unless the user specifies otherwise. Output only the raw SVG code wrapped in a code block for easy copying. Do not include any HTML, webpage scaffolding, or external dependencies. The SVG must be fully self-contained so it can be saved directly as a .svg file and opened in any browser or vector editor. Always prioritize visually appealing, clean vector shapes and completely static designs. **Do not include any CSS animations, keyframes, transitions, or \`<animate>\` tags.** If the description is vague, make creative decisions to produce something visually interesting while staying true to the intent of the description.`;

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function renderSleekDecorations(): string {
  return `
    <defs>
      <radialGradient id="glow1" cx="70%" cy="30%" r="50%">
        <stop offset="0%" stop-color="#00C9FF" stop-opacity="0.18" />
        <stop offset="100%" stop-color="#00C9FF" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="glow2" cx="20%" cy="80%" r="50%">
        <stop offset="0%" stop-color="#7C3AED" stop-opacity="0.14" />
        <stop offset="100%" stop-color="#7C3AED" stop-opacity="0" />
      </radialGradient>
    </defs>
    <circle cx="840" cy="189" r="220" fill="url(#glow1)" />
    <circle cx="240" cy="504" r="160" fill="url(#glow2)" />
  `;
}

function renderBrightDecorations(): string {
  return `
    <defs>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000000" flood-opacity="0.15" />
      </filter>
    </defs>
    <text x="1080" y="90" font-size="60" opacity="0.12" filter="url(#shadow)">🤖</text>
    <text x="80" y="580" font-size="50" opacity="0.12" filter="url(#shadow)">💼</text>
  `;
}

function buildSvg(card: (typeof ogCards)[number]): string {
  const lines = card.phrase.split("\n").map(line => escapeXml(line));
  const isSleek = card.style === "sleek";
  const brandY = isSleek ? 210 : 190;
  const line1Y = isSleek ? 270 : 250;
  const line2Y = isSleek ? 340 : 330;
  const decorations = isSleek
    ? renderSleekDecorations()
    : renderBrightDecorations();

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${OG_CARD_WIDTH}" height="${OG_CARD_HEIGHT}" viewBox="0 0 ${OG_CARD_WIDTH} ${OG_CARD_HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${card.gradient.from}" />
      <stop offset="100%" stop-color="${card.gradient.to}" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)" />
  ${decorations}
  <text x="600" y="${brandY}" text-anchor="middle" font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="700" letter-spacing="4"><tspan fill="#FFFFFF">CAREERSYNC</tspan><tspan fill="#12C6FF">AI</tspan></text>
  <text x="600" y="${line1Y}" text-anchor="middle" font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="72" font-weight="800" fill="${card.textColor}">${lines[0] || ""}</text>
  ${lines[1] ? `<text x="600" y="${line2Y}" text-anchor="middle" font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="72" font-weight="800" fill="${card.textColor}">${lines[1]}</text>` : ""}
</svg>`;
}

async function renderFallbackPng(card: (typeof ogCards)[number]): Promise<Buffer> {
  const svg = buildSvg(card);
  return sharp(Buffer.from(svg))
    .resize(OG_CARD_WIDTH, OG_CARD_HEIGHT)
    .png({ quality: 85, compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
}

async function generateCardPng(
  card: (typeof ogCards)[number]
): Promise<Buffer | null> {
  try {
    const phrase = card.phrase.replace(/\n/g, " ");
    const result = await generateText({
      model: IMAGE_MODEL,
      system: SYSTEM_PROMPT,
      prompt: `[Use this verbiage as the heading using the font Inter: "${phrase}" — ${card.prompt}]`,
    });

    if (result.warnings?.length) {
      console.warn(`[${card.id}] warnings:`, result.warnings);
    }

    // Extract the SVG from the code block in the model response.
    const svg = extractSvgFromResponse(result.text);
    if (!svg) {
      console.warn(`[${card.id}] No SVG found in response; falling back to SVG.`);
      return null;
    }

    // Validate rough structure before attempting to rasterize.
    if (!svg.includes("<svg") || !svg.includes("</svg>")) {
      console.warn(`[${card.id}] Response did not contain a valid SVG; falling back.`);
      return null;
    }

    // Render the AI-generated SVG to a 1200x630 PNG.
    return sharp(Buffer.from(svg))
      .resize(OG_CARD_WIDTH, OG_CARD_HEIGHT, { fit: "fill" })
      .png({ quality: 85, compressionLevel: 9, adaptiveFiltering: true })
      .toBuffer();
  } catch (err) {
    console.error(`[${card.id}] SVG generation failed:`, err);
    console.log(`[${card.id}] Falling back to SVG renderer.`);
    return null;
  }
}

function extractSvgFromResponse(text: string): string | null {
  // Match an SVG inside a markdown code block (with or without "svg" label).
  const codeBlockMatch = text.match(/```(?:svg)?\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch?.[1]?.trim()) {
    const content = codeBlockMatch[1].trim();
    if (content.startsWith("<svg")) return content;
  }

  // Fallback: grab the first <svg...>...</svg> block in the raw text.
  const inlineMatch = text.match(/(<svg\b[\s\S]*?<\/svg>)/);
  return inlineMatch?.[1]?.trim() ?? null;
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  for (const card of ogCards) {
    const outPath = path.join(OUT_DIR, `card-${card.id}.png`);
    let buffer = await generateCardPng(card);

    if (!buffer) {
      buffer = await renderFallbackPng(card);
      console.log(`[${card.id}] Generated ${outPath} (SVG fallback)`);
    } else {
      console.log(`[${card.id}] Generated ${outPath} (AI Gateway)`);
    }

    await fs.promises.writeFile(outPath, buffer);
  }
}

main().catch(err => {
  console.error("Failed to generate OG cards:", err);
  process.exit(1);
});
