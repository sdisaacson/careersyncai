# OG Cards Rotation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

> **Note:** `tsx` is already used by the `start` script but not declared in `package.json`. This plan installs it explicitly.

**Goal:** Build 10 Open Graph preview images, pre-generate them as PNGs, and rotate which one is served every 24 hours via a Vercel Cron + database setting.

**Architecture:** Card config lives in `src/lib/og-cards.ts`. A Node script renders each card to a 1200×630 PNG using SVG templates and sharp, saving to `public/og-cards/`. A Vercel Cron invokes `/api/og/rotate` daily to update `current_og_index` in `app_settings`. `/api/og/current.png` reads that index and streams the active PNG. `index.html` points its `og:image` meta tag at the current endpoint.

**Tech Stack:** TypeScript, SVG, sharp, Vercel Cron, Supabase (postgres), Drizzle ORM.

---

## File Structure

- **Create** `src/lib/og-cards.ts` — card config (phrase, prompt, colors, style).
- **Create** `scripts/generate-og-cards.ts` — build-time script that renders PNGs.
- **Create** `public/og-cards/` — generated 1200×630 PNG assets.
- **Create** `api/og/rotate.ts` — Vercel Cron endpoint; updates DB index.
- **Create** `api/og/current.ts` — public endpoint; serves current card PNG.
- **Modify** `vercel.json` — add daily cron schedule.
- **Modify** `index.html` — add OG/Twitter meta tags.
- **Modify** `package.json` — add `generate:og-cards` script and `sharp` dev dependency.

---

## Task 1: Add sharp dependency

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install dependencies**

```bash
npm install -D sharp tsx
```

- [ ] **Step 2: Verify package.json**

Run: `grep -E '("sharp"|"tsx")' package.json`

Expected: Both `sharp` and `tsx` appear under `devDependencies`.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
npm run check 2>&1 | grep -E "(ProtectedRoute|og-cards|generate-og)" || echo "no new type errors"
git commit -m "chore: add sharp for OG image generation"
```

---

## Task 2: Create card config

**Files:**
- Create: `src/lib/og-cards.ts`

- [ ] **Step 1: Write config file**

```ts
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
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/og-cards.ts
git commit -m "feat: add OG card config"
```

---

## Task 3: Create generation script

**Files:**
- Create: `scripts/generate-og-cards.ts`

- [ ] **Step 1: Write script**

```ts
import fs from "fs";
import path from "path";
import sharp from "sharp";
import {
  ogCards,
  OG_CARD_WIDTH,
  OG_CARD_HEIGHT,
} from "../src/lib/og-cards";

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
```

- [ ] **Step 2: Add script to package.json**

Modify `package.json` scripts section. Add:

```json
"generate:og-cards": "tsx scripts/generate-og-cards.ts"
```

- [ ] **Step 3: Commit**

```bash
git add scripts/generate-og-cards.ts package.json
git commit -m "feat: add OG card generation script"
```

---

## Task 4: Generate PNG assets

**Files:**
- Create: `public/og-cards/card-0.png` … `public/og-cards/card-9.png`

- [ ] **Step 1: Run generation script**

```bash
npm run generate:og-cards
```

Expected output: 10 lines like `Generated /path/to/public/og-cards/card-N.png`.

- [ ] **Step 2: Verify files**

```bash
ls -la public/og-cards/
```

Expected: 10 PNG files, each roughly 50–200 KB.

- [ ] **Step 3: Commit assets**

```bash
git add public/og-cards/
git commit -m "feat: generate initial OG card assets"
```

---

## Task 5: Create rotate cron endpoint

**Files:**
- Create: `api/og/rotate.ts`

- [ ] **Step 1: Write endpoint**

```ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../../db/schema.js";
import { OG_CARD_COUNT } from "../../src/lib/og-cards";

const CURRENT_OG_KEY = "current_og_index";

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not configured");
  }
  return url;
}

export default async function handler(
  _req: VercelRequest,
  res: VercelResponse
) {
  try {
    const client = postgres(getDatabaseUrl(), {
      prepare: false,
      ssl: { rejectUnauthorized: false },
    });
    const db = drizzle(client, { schema });

    const existing = await db
      .select({ value: schema.appSettings.value })
      .from(schema.appSettings)
      .where(eq(schema.appSettings.key, CURRENT_OG_KEY))
      .limit(1);

    const currentIndex = existing[0]?.value
      ? parseInt(existing[0].value, 10)
      : 0;
    const nextIndex = Number.isNaN(currentIndex)
      ? 0
      : (currentIndex + 1) % OG_CARD_COUNT;

    if (existing.length === 0) {
      await db.insert(schema.appSettings).values({
        key: CURRENT_OG_KEY,
        value: String(nextIndex),
      });
    } else {
      await db
        .update(schema.appSettings)
        .set({ value: String(nextIndex) })
        .where(eq(schema.appSettings.key, CURRENT_OG_KEY));
    }

    await client.end();

    res.status(200).json({
      success: true,
      previousIndex: currentIndex,
      currentIndex: nextIndex,
    });
  } catch (err) {
    console.error("[og/rotate] error:", err);
    res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add api/og/rotate.ts
git commit -m "feat: add OG card rotation cron endpoint"
```

---

## Task 6: Create current image endpoint

**Files:**
- Create: `api/og/current.ts`

- [ ] **Step 1: Write endpoint**

```ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import fs from "fs";
import path from "path";
import postgres from "postgres";
import * as schema from "../../db/schema.js";
import { OG_CARD_COUNT } from "../../src/lib/og-cards";

const CURRENT_OG_KEY = "current_og_index";
const FALLBACK_IMAGE = "/og-careersync.jpg";

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not configured");
  }
  return url;
}

function getCardPath(index: number): string {
  return path.resolve(process.cwd(), "public", "og-cards", `card-${index}.png`);
}

export default async function handler(
  _req: VercelRequest,
  res: VercelResponse
) {
  let index = 0;
  let client: ReturnType<typeof postgres> | null = null;

  try {
    client = postgres(getDatabaseUrl(), {
      prepare: false,
      ssl: { rejectUnauthorized: false },
    });
    const db = drizzle(client, { schema });

    const row = await db
      .select({ value: schema.appSettings.value })
      .from(schema.appSettings)
      .where(eq(schema.appSettings.key, CURRENT_OG_KEY))
      .limit(1);

    const parsed = row[0]?.value ? parseInt(row[0].value, 10) : 0;
    index = Number.isNaN(parsed) ? 0 : parsed % OG_CARD_COUNT;
  } catch (err) {
    console.error("[og/current] database error:", err);
    index = 0;
  } finally {
    await client?.end();
  }

  const cardPath = getCardPath(index);

  if (!fs.existsSync(cardPath)) {
    res.redirect(302, FALLBACK_IMAGE);
    return;
  }

  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "public, max-age=300, stale-while-revalidate=86400");
  const stream = fs.createReadStream(cardPath);
  stream.pipe(res);
}
```

- [ ] **Step 2: Commit**

```bash
git add api/og/current.ts
git commit -m "feat: add current OG card image endpoint"
```

---

## Task 7: Add Vercel cron schedule

**Files:**
- Modify: `vercel.json`

- [ ] **Step 1: Add cron config**

Read current `vercel.json`, then add a `crons` array:

```json
{
  "crons": [
    {
      "path": "/api/og/rotate",
      "schedule": "0 0 * * *"
    }
  ]
}
```

If `vercel.json` already has `version` and `rewrites`, merge `crons` alongside them:

```json
{
  "version": 2,
  "rewrites": [...],
  "crons": [
    {
      "path": "/api/og/rotate",
      "schedule": "0 0 * * *"
    }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add vercel.json
git commit -m "feat: schedule daily OG card rotation cron"
```

---

## Task 8: Add OG meta tags

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Insert meta tags**

Add inside `<head>` after `<title>`:

```html
<meta property="og:title" content="CareerSyncAI — AI-Powered Career Matching" />
<meta property="og:description" content="Upload your resume, practice interviews, and discover roles matched to you by AI." />
<meta property="og:image" content="https://careersync.sisaacson.io/api/og/current.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://careersync.sisaacson.io" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="CareerSyncAI — AI-Powered Career Matching" />
<meta name="twitter:description" content="Upload your resume, practice interviews, and discover roles matched to you by AI." />
<meta name="twitter:image" content="https://careersync.sisaacson.io/api/og/current.png" />
```

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat: add OG and Twitter card meta tags"
```

---

## Task 9: Test locally

- [ ] **Step 1: Type-check**

```bash
npx tsc -p tsconfig.server.json --noEmit
```

Expected: no errors.

- [ ] **Step 2: Test rotate endpoint**

With `DATABASE_URL` set to the working Supabase pooler URL:

```bash
curl -s http://localhost:3000/api/og/rotate
```

Expected: JSON like `{"success":true,"previousIndex":0,"currentIndex":1}`.

- [ ] **Step 3: Test current endpoint**

```bash
curl -s -o /tmp/og-current.png -w "%{http_code}" http://localhost:3000/api/og/current.png
file /tmp/og-current.png
```

Expected: HTTP 200 and file type `PNG image data, 1200 x 630`.

- [ ] **Step 4: Verify meta tags**

Open `index.html` and confirm the `og:image` URL is `https://careersync.sisaacson.io/api/og/current.png`.

---

## Task 10: Deploy

- [ ] **Step 1: Push all commits**

```bash
git push origin HEAD
```

- [ ] **Step 2: Redeploy on Vercel**

Go to Vercel → Deployments → Redeploy with fresh build cache.

- [ ] **Step 3: Verify cron is registered**

After deploy, check Vercel → Settings → Cron Jobs. You should see `/api/og/rotate` scheduled daily.

- [ ] **Step 4: Trigger rotation manually**

```bash
curl -s https://careersync.sisaacson.io/api/og/rotate
```

Expected: JSON showing incremented index.

- [ ] **Step 5: Verify current image**

```bash
curl -s -o /tmp/og-prod.png -w "%{http_code}" https://careersync.sisaacson.io/api/og/current.png
file /tmp/og-prod.png
```

Expected: HTTP 200, PNG, 1200×630.

---

## Spec Coverage Check

| Spec Requirement | Implementing Task |
|---|---|
| 10 cards with phrases & prompts | Task 2 |
| Pre-generate PNGs | Task 3 & 4 |
| 1200×630 dimensions | `OG_CARD_WIDTH` / `OG_CARD_HEIGHT` in Task 2 |
| Vercel Cron rotation | Task 5 & 7 |
| Database-backed index | Task 5 |
| Public current endpoint | Task 6 |
| OG meta tags | Task 8 |
| Fallback image | Task 6 |

## Placeholder Scan

- No TBD/TODO/fill-in-later items.
- All code blocks contain complete, runnable code.
- All file paths are exact.
- All commands include expected outputs.

## Type Consistency Check

- `current_og_index` key string is consistent between `api/og/rotate.ts` and `api/og/current.ts`.
- `OG_CARD_COUNT` imported from same source in both endpoints.
- `app_settings` table schema used consistently via Drizzle.
