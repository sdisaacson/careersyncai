import fs from "fs";
import path from "path";
import sharp from "sharp";
import {
  ogCards,
  OG_CARD_WIDTH,
  OG_CARD_HEIGHT,
} from "../contracts/og-cards";

const OUT_DIR = path.resolve(process.cwd(), "public/og-cards");

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
  <text x="600" y="${brandY}" text-anchor="middle" font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="700" letter-spacing="4" fill="${card.accent}">CAREERSYNCAI</text>
  <text x="600" y="${line1Y}" text-anchor="middle" font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="72" font-weight="800" fill="${card.textColor}">${lines[0] || ""}</text>
  ${lines[1] ? `<text x="600" y="${line2Y}" text-anchor="middle" font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="72" font-weight="800" fill="${card.textColor}">${lines[1]}</text>` : ""}
</svg>`;
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  for (const card of ogCards) {
    const svg = buildSvg(card);
    const outPath = path.join(OUT_DIR, `card-${card.id}.png`);
    await sharp(Buffer.from(svg))
      .resize(OG_CARD_WIDTH, OG_CARD_HEIGHT)
      .png()
      .toFile(outPath);
    console.log(`Generated ${outPath}`);
  }
}

main().catch(err => {
  console.error("Failed to generate OG cards:", err);
  process.exit(1);
});
