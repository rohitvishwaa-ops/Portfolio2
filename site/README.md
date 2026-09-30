# A Rohit Vishwa, portfolio

A scroll-driven "fly through the world" portfolio. Scrolling moves a camera through floating low-poly islands, one per chapter (studio, IMD weather station, SpendSmart, Vital AI, NomadAI, toolkit, contact beacon), while copy panels fade in over each scene.

Everything is free and open source: Vite, React 19, TypeScript, Tailwind CSS v4, React Three Fiber + drei + postprocessing, Lenis (smooth scroll), Motion, Phosphor icons and Geist fonts. The 3D world is built from code (no paid models or AI video).

UI effects in `src/components/ui/` are adapted from free, MIT-licensed originals that are also listed on 21st.dev: Shimmer Button and Border Beam (Magic UI), Magnetic, Text Scramble and Text Effect (Motion Primitives). Floating rocks react to the cursor via a small spring simulation in `src/world/push.ts`.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the build locally
```

## Edit content

- **Text, links, projects, skills:** `src/data.ts`
- **Photo, screenshots, link preview image:** `public/media/`
- **Resume:** `public/Rohit_Vishwa_Resume.pdf` (replace the file, keep the name)
- **Chapter layout and copy blocks:** `src/ui/Chapters.tsx`
- **Camera shots per chapter:** `SHOTS` in `src/world/World.tsx`
- **Island scenes:** `src/world/islands.tsx`
- **Colours:** `@theme` in `src/index.css` (UI) and `C` in `src/world/parts.tsx` (3D)

Deep links work: `/#spendsmart`, `/#vital`, `/#nomad`, `/#contact`, and so on.

## Deploy (free)

**Vercel:** import the repo, set the root directory to `site`, framework preset "Vite". Build command `npm run build`, output `dist`.

**Netlify:** base directory `site`, build command `npm run build`, publish directory `site/dist`.

## Accessibility and performance

- Honours `prefers-reduced-motion` (no smooth scroll, no idle animation, no intro flight).
- Phones get a lighter scene (lower DPR, no bloom, fewer particles) and bottom-sheet panels.
- Falls back to a static background if WebGL is unavailable; all content stays readable.
- The 3D bundle is lazy-loaded so the hero text paints first.
