# Lakshit Tyagi — Portfolio

Personal portfolio positioning Lakshit as **AI MarTech**: full-stack builds + AI automation + creator-led growth.
Content comes from `public/Lakshit-Tyagi-Resume.pdf` (Nov 2026 résumé).

## Run

```bash
npm install
npm run dev      # http://localhost:5176
npm run build    # static production build
```

## Where things live

| File | What |
|---|---|
| `src/data/profile.ts` | **All content** — intro, stats, pillars, projects, experience, skills, links. Edit here. |
| `app/page.tsx` | Page sections: hero → ticker → pillars → work → experience → skills → contact |
| `app/globals.css` | Design tokens (`:root`), all styles, motion, responsive breakpoints |
| `app/layout.tsx` | Fonts (Instrument Serif / Schibsted Grotesk / IBM Plex Mono) + SEO metadata |
| `src/components/Reveal.tsx` | Scroll-reveal for `[data-reveal]` elements |
| `public/Lakshit-Tyagi-Resume.pdf` | Downloadable résumé — replace the file to update |
| `public/work/*.webp` | Project screenshots (1280×720, homepage of each live site). Referenced by `shot` in `projects`. |

## Design

Warm paper (`#f2ede4`) + ink + vermilion accent (`#ff4f1a`). Editorial serif headlines, mono annotations.
Dark "Work" section for contrast. Respects `prefers-reduced-motion`.

## Ideas / next steps

- Swap project screenshots for short screen-recordings, or deeper in-app shots
- Fix Food Product Explorer's live demo: OpenFoodFacts `search.pl` now blocks browser CORS, so search never loads (its screenshot shows the empty state)
- Add a "Campaigns" section with BLEP / Skillsnap reels (embed or thumbnails)
- Add Solution Bowl internship work (3D portfolio site) as a case study, if allowed
- Deploy to Vercel and set a custom domain; add an OG image (`app/opengraph-image.png`)
