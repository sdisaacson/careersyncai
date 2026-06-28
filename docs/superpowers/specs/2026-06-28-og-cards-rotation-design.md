# OG Cards Rotation Design

## Overview
Generate 10 Open Graph (OG) images for CareerSyncAI and rotate which one is served every 24 hours using a Vercel Cron function backed by a database setting.

## Goals
- Make social shares more engaging with varied, eye-catching preview images.
- Test two tones: sleek tech/futuristic and bright humorous.
- Automate daily rotation without manual deploys or ongoing AI API costs.

## The 10 Cards

### Set A — Sleek Tech/Futuristic
1. **"Your career, decoded by AI"** — Neural network brain made of constellations, electric blue and violet light trails, deep navy void background, cinematic sci-fi.
2. **"Stop applying. Start matching."** — Two luminous geometric forms sliding into perfect alignment, electric blue and violet energy at the seam, dark space background.
3. **"The resume that gets the interview"** — A glowing resume page morphing into a crystal key, electric blue light emanating, dark tech background.
4. **"AI-powered interview prep, tailored to you"** — A holographic human silhouette surrounded by concentric soundwaves and data rings, electric blue and violet, dark background.
5. **"Find your next role before it finds you"** — A futuristic city skyline at night with career paths as glowing circuits lighting up across buildings, electric blue and violet.

### Set B — Bright & Humorous
6. **"AI took the jobs. We brought better ones."** — Friendly cartoon robots carrying briefcases and coffee, bright coral-to-yellow gradient, bold playful typography, flat illustration style.
7. **"Your robot overlords make great recruiters."** — A friendly robot in a tie pointing at a glowing job board, purple and blue gradient, human silhouettes cheering, bold comic style.
8. **"Don't panic. We came to fix this."** — A calm robot holding a "You're hired" sign while humans relax, bright green gradient, emergency-panic-turned-to-relief vibe, flat illustration.
9. **"AI caused the problem. AI will find your next gig."** — A robot with a magnifying glass scanning a sea of job listings, pink-to-red gradient, bright optimistic style, flat illustration.
10. **"Humans wanted. AI assistants standing by."** — A neon "Now Hiring" sign with friendly robots waving humans forward, bright cyan-blue gradient, retro-futuristic job fair energy.

## Architecture

```
┌─────────────────────────────────────┐
│  Build-time: scripts/generate-og-cards.ts  │
│  Generates 10 PNGs → public/og-cards/     │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│  Vercel Cron (daily) → /api/og/rotate    │
│  Updates app_settings.current_og_index   │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│  /api/og/current.png                    │
│  Reads DB index → streams card-N.png     │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│  index.html OG meta tag                 │
│  content=".../api/og/current.png"        │
└─────────────────────────────────────┘
```

## Files

- `src/lib/og-cards.ts` — Card config: phrase, prompt, background, accent color.
- `scripts/generate-og-cards.ts` — Build-time script. Uses SVG templates + sharp to render 1200×630 PNGs.
- `public/og-cards/card-0.png` … `card-9.png` — Generated assets.
- `api/og/rotate.ts` — Vercel Cron endpoint. Updates `current_og_index` in `app_settings`.
- `api/og/current.ts` — Public API route. Reads current index and serves the matching PNG.
- `vercel.json` — Adds cron schedule.
- `index.html` — Adds `og:image`, `og:title`, `og:description`, `twitter:card` meta tags.

## Data Flow

1. Developer runs `npm run generate:og-cards` (or build script) to create/update PNGs.
2. Vercel Cron invokes `/api/og/rotate` every 24 hours.
3. Rotate endpoint reads `app_settings` row `key='current_og_index'`.
4. It increments the index modulo 10 and writes it back.
5. Social crawlers request `/api/og/current.png`.
6. Current endpoint reads the DB index and streams `public/og-cards/card-{index}.png`.

## Error Handling & Fallbacks

- If `current_og_index` row is missing, default to index `0`.
- If the requested image file is missing, return a 302 redirect to `/og-careersync.jpg`.
- If the DB is unavailable, return the fallback image with a short cache header.

## Security & Cost

- No external AI image API is called at runtime. Cards are pre-generated.
- The rotate endpoint requires no auth because Vercel Cron invokes it internally.
- The current endpoint is public, which is required for OG crawlers.

## Open Questions / Future Work

- Should we also support `og:title` and `og:description` rotation? (Out of scope for now.)
- Should the cron schedule be configurable via env var? (Out of scope for now.)
