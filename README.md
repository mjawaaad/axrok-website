# Axrok website

Marketing site for Axrok Infosec. Home tells a scroll-driven story with a real, colour-graded wolf, and every call to action leads to the single contact form on `/contact`.

**Versions.** v2 lives on `main` once approved; v1 (the 3D sculpture site) is preserved as the `v1` tag and release. See [Rolling back](#rolling-back).

## Sitemap

| Route | Page |
| --- | --- |
| `/` | Home: the wolf story, a services teaser and a "why Axrok" teaser |
| `/services` | All six services and the Scout, Strike and Siege tiers |
| `/services/[slug]` | One template, six entries: `penetration-testing`, `managed-security`, `grc-compliance`, `threat-intelligence-investigations`, `post-quantum-security`, `space-satellite-security` |
| `/products` | The platforms behind service delivery (not sold standalone) |
| `/labs` | Coming soon |
| `/about` | Mission, vision, story, team, partners |
| `/contact` | The only form on the site |

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 · shadcn/ui (Radix: navigation menu, accordion, select, sheet, field) · Magic UI (`magic-card`) · Aceternity UI (`spotlight-new`) · React Three Fiber 9 + drei · GSAP 3.15 (ScrollTrigger, SplitText) · Lenis · Motion (Framer Motion) · react-hook-form + zod.

## Getting started

Requires Node 20 or newer (built on Node 24 LTS).

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
```

| Script | What it does |
| --- | --- |
| `npm run prepare:wolf` | Builds every wolf asset from `assets/wolf/frames/` (see below). |
| `npm run gen:logo` | Re-cuts the logo into the loader's shards (`src/content/logo-shards.json`). |

## The wolf

The story is a push-in through three frames of the same shot, each closer than the last: `assets/wolf/frames/wolf-1.png` to `wolf-3.png` (same size and aspect ratio). To change them:

1. Replace the frames. Keep the order wide to close.
2. In `src/content/wolf.json`, set each frame's `eyes` and `anchor` (the midpoint between the eyes), as fractions of width and height from the top-left, and its `scale`: how much closer it is than the frame before (eye spacing in this frame ÷ eye spacing in the previous one). `gain` evens out brightness between frames. Update the `alt` text.
3. Run `npm run prepare:wolf`. Depth maps are estimated locally with Depth Anything V2 on first run and cached as `assets/wolf/frames/depth-<n>.png` (delete them after changing a frame).

The script writes the WebGL textures (`public/wolf/`), the pre-graded frames and head crop used on phones, interior pages and in reduced motion (`src/assets/wolf/`), and the Open Graph source (`assets/og/`). The navy-to-cobalt grade is defined once in `wolf.json` and applied identically by the script and the shader.

**How the story works** (`src/components/home/`). One pinned stage, scrubbed by a GSAP ScrollTrigger timeline on Lenis-smoothed scroll, drives a shared `story` object:

- **The zoom** (`zoom.ts`): each frame is a layer aligned on the eyes and scaled by its cumulative `scale`, so all three line up exactly. As the zoom passes a frame's own scale, that frame fades in as a soft-edged window over the one before it, giving the next frame's detail without a cut. Zoom moves in log space at a constant speed (eased only at the start and end), so the push-in never seems to speed up or stall between frames.
- **Capable desktops:** a full-screen WebGL pass (`WolfCanvas.tsx`) composites the frames in luminance, then grades, adds a slow depth-map parallax, the cobalt rim light along depth edges, eye catchlights, grain and the fade into beat 4.
- **Phones and low-power devices:** the pre-graded frames as stacked images following the same `zoom.ts` maths with GPU transforms (`LiteVisual`).
- **Reduced motion:** the wide and close frames as stills with simple fade-ins, no pin (`StoryStatic`).
- Beats: 1 distant in the cave mouth, 2 closer, 3 face to face with light in the eyes, 4 the mark and tagline resolve out of cobalt light, then the CTA. Copy is in `WolfStory.tsx` (tagged `[PLACEHOLDER]`).

Force a tier for testing with `?quality=high` or `?quality=static`.

## Contact form

The only form on the site. Service CTAs link to `/contact?service=<key>` (`pentest`, `soc`, `grc`, `cti`, `pqc`, `space`, `unsure`); tier CTAs to `/contact?tier=<scout|strike|siege>`. Both pre-fill the form.

`POST /api/contact` validates with the same zod schema as the form, drops honeypot submissions silently and rate-limits by IP. **Delivery is a placeholder:** copy `.env.example` to `.env.local` and set `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` to send through Resend, or replace `deliver()` in `src/app/api/contact/route.ts`.

## Deployment

- **GitHub Pages (preview):** every push to `main` runs `.github/workflows/nextjs.yml`, which builds a static export (`GITHUB_PAGES=true` switches `next.config.ts` to `output: "export"` with the Pages base path) and publishes https://mjawaaad.github.io/axrok-website/. Pages is static-only, so the workflow removes `/api/contact`; the form posts to the repository variable `NEXT_PUBLIC_CONTACT_ENDPOINT` if set, and otherwise tells visitors the preview cannot send enquiries.
- **Production (recommended):** a Node host such as Vercel runs the normal build, including `/api/contact` and optimized images. Set the email variables from `.env.example`.

## Rolling back

v1 is tagged `v1` and published as a GitHub release. To put v1 back on the live site:

```bash
git checkout main
git revert --no-edit v1..HEAD && git push            # undoes every change since v1, keeping history
# or, to make main exactly v1 again (rewrites history):
git reset --hard v1 && git push --force-with-lease
```

Either push redeploys GitHub Pages automatically. To look at v1 locally without changing anything: `git checkout v1`.

## Placeholders to replace before launch

Search the repo for `[PLACEHOLDER]`. Copy lives in `src/content/site.ts` and `src/components/home/WolfStory.tsx`. Items that make factual claims also show the tag on the page:

- Mission and vision statements (from the brand bible)
- Each team member's certifications
- Post-quantum partner name
- Name story wording
- Social profile URLs, production domain (`brand.siteUrl`)
- Budget ranges, the contact "next steps"
- Drafted service, tier, product and story copy
- Email delivery (above)

## Brand notes

- Cobalt `#1E3AFF` on void navy `#0B0139` measures about 2.9:1, which fails WCAG AA for text and UI outlines. Cobalt is used for fills, the wolf grade and decoration; outlines and focus rings use a lifted cobalt `#5B70FF` (4.8:1), and accent text uses periwinkle `#A3B1FF` (9.4:1). Tokens are documented in `src/app/globals.css`.
- The hot accent (ember `#FF5B2E`) appears only on CTA arrow hover.
- Copy rule: no em dashes.
