# Axrok website

Four-page marketing site for Axrok Infosec: Home, Services, About, Contact. One persistent 3D scene (the Amarok, built from the Axrok mark) carries across every route, and every call to action leads to the single contact form on `/contact`.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 · shadcn/ui (Radix) · Magic UI (`marquee`, `blur-fade`) · React Three Fiber 9 + drei + postprocessing · GSAP 3.15 (ScrollTrigger, SplitText) · Lenis · Motion (Framer Motion) · react-hook-form + zod.

## Getting started

Requires Node 20 or newer (built on Node 24 LTS).

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
```

| Script | What it does |
| --- | --- |
| `npm run gen:logo` | Re-cuts the logo into loader shards (`src/content/logo-shards.json`). |
| `npm run build:wolf` | Rebuilds the 3D model from the logo geometry into `public/models/amarok.glb` (Meshopt, about 19 KB). |
| `npm run render:stills` | With the app running, captures the static fallback stills and OG sources from the live scene. Set `CHROME_PATH` if Chrome is not in the default location. |

## How it fits together

- **Persistent scene.** `SceneRoot` is mounted once in `src/app/layout.tsx`, so the canvas survives navigation. Each route has a target pose (camera, wolf position and rotation, lighting) in `src/lib/scene-state.ts`. On route change GSAP tweens the live pose to the new target. `@14islands/r3f-scroll-rig` was evaluated and not used: its last release was December 2024, and it is built for many DOM-synced scenes, while this site has one object moving between four poses.
- **Scroll choreography.** Pages mark sections with `data-scene` and render `<ScenePath path={...} />`, which blends the wolf through per-section offsets as you scroll (Lenis-smoothed, ScrollTrigger-driven). Home also pins the manifesto and scrubs its words.
- **The model.** `scripts/build-wolf.mjs` cuts the mark into facets along its own lines (the eye becomes the seam between brow and cheek), extrudes each with a chamfered bevel and folds them onto shared planes. Materials are assigned in code (`src/components/scene/Wolf.tsx`) so they stay art-directable.
- **Lighting.** A hand-built environment of Lightformers (cobalt rim strips, front softboxes, a thin specular strip), subtle bloom, neutral tone mapping (ACES pushes cobalt toward magenta), vignette and light film grain.
- **Quality tiers.** `src/lib/capability.ts` gives phones, low-power devices, Save-Data, software GL and browsers without WebGL the static tier: a pre-rendered still of the same wolf with Motion transitions. Force a tier with `?quality=high` or `?quality=static`; `?fx=0` disables post-processing for debugging.
- **Intro.** Once per session (sessionStorage). The shard assembly is pure CSS, so it starts at first paint. The percentage tracks real asset progress and never holds a visitor more than 2.6 s from navigation start; a slow 3D scene fades in when ready.
- **Reduced motion.** No sway, cursor orbit, pins, scrubbing or split-text. Route changes crossfade, reveals fade, and the scene dims behind text once you scroll.

## Contact form

The only form on the site, at `/contact`. Service CTAs link to `/contact?service=<key>` (`pentest`, `soc`, `grc`, `cti`, `pqc`, `unsure`) and tier CTAs to `/contact?tier=<scout|strike|siege>`. Both pre-fill the form.

`POST /api/contact` validates with the same zod schema as the form, drops honeypot submissions silently and rate-limits by IP. **Delivery is a placeholder:** copy `.env.example` to `.env.local` and set `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` to send through Resend. Without them, enquiries are logged to the server console. To use a different provider, replace `deliver()` in `src/app/api/contact/route.ts`.

## Placeholders to replace before launch

Search the repo for `[PLACEHOLDER]`. All copy lives in `src/content/site.ts`. Items that make factual claims also show the tag on the page:

- Mission and vision statements (from the brand bible)
- Each founder's certifications
- Post-quantum partner name
- Name story wording
- Social profile URLs, production domain (`brand.siteUrl`)
- Industries list, budget ranges
- Drafted service descriptions, tier narratives and section copy
- Email delivery (above)

## Brand notes

- Cobalt `#1E3AFF` on void navy `#0B0139` measures about 2.9:1, which fails WCAG AA for text and UI outlines. Cobalt is used for fills, 3D and decoration. Outlines and focus rings use a lifted cobalt `#5B70FF` (4.8:1), and accent text uses periwinkle `#A3B1FF` (9.4:1). Tokens are documented in `src/app/globals.css`.
- The hot accent (ember `#FF5B2E`) appears only on CTA arrow hover.
- Copy rule: no em dashes.
