# Portfolio Revamp: "Monolith Architectural" Design System

## Context
Current portfolio is a dark-themed SPA with orange/teal accents, carousel cards, floating shapes, parallax effects, and loading screens. Target is a brutalist monochromatic editorial design ("Stark Structuralism") with 3 routes, edge-to-edge project rows, 30/70 case study layouts, and grayscale-to-color image hover interactions.

**Stack stays**: Vue 3, TypeScript, Tailwind, Vite.

### Decisions
- **Content**: Keep real personal data from current `aboutData.ts` and project data
- **Dark mode**: Remove entirely (code + CSS vars + toggle)
- **Animations**: Keep anime.js (subtle entrance animations), remove GSAP entirely. CSS for marquee + hovers.

---

## PHASE 0: Design System Foundation Reset
**Goal:** Replace all visual tokens. Site will look broken (expected) but builds clean.

**Modify:**
- `tailwind.config.js` -- Monochromatic color tokens (`surface: #F9F9F8`, `on-surface: #111`, `outline: #E5E5E5`, `secondary: #888`), zero border-radius, new font families (Clash Display, Switzer, Space Grotesk, JetBrains Mono), remove dark mode
- `src/assets/main.css` -- Replace CSS vars, remove `.glass-effect`, `.gradient-text`, `.btn-primary`, `.btn-ghost`, add `.btn-monolith` (rectangular, inversion hover), update scrollbar/selection colors
- `index.html` -- Add Fontshare CDN link for Clash Display + Switzer, keep Google Fonts for Space Grotesk + JetBrains Mono, update title

**Delete:**
- `src/composables/useParallax.ts`
- `src/composables/useEasterEgg.ts`
- `src/components/Landing/FloatingShapes.vue`
- `src/components/Landing/ScrollIndicator.vue`
- `src/components/LoadingScreen.vue`

**Test:** `npm run dev` builds, fonts load, no errors.

---

## PHASE 1: Routing + Layout Shell
**Goal:** Convert SPA to multi-route. Shared navbar + footer render on all routes.

**Modify:**
- `src/router/index.ts` -- 3 routes: `/` (Home), `/manifesto` (About), `/case-study/:slug` (Detail)
- `src/App.vue` -- Gut to layout shell: `<TheNavbar />` + `<router-view />` + `<TheFooter />`. Remove all old section imports, theme toggle, scroll progress, easter eggs.

**Create:**
- `src/views/HomePage.vue` -- empty shell
- `src/views/ManifestoPage.vue` -- empty shell
- `src/views/CaseStudyPage.vue` -- empty shell, reads `:slug`
- `src/components/TheNavbar.vue` -- Fixed glassmorphic navbar (`bg-[#F9F9F8]/90 backdrop-blur-md`), "ARCHITECT.VUE" logo, nav links, "VUE3 / TS / NODE" label, mobile menu, case-study variant (back arrow + project label)
- `src/components/TheFooter.vue` -- Minimal: copyright + GitHub/LinkedIn/Source links

**Delete:**
- `src/components/Navigation.vue`

**Test:** Navigate `/`, `/manifesto`, `/case-study/test` -- all show navbar + footer.

---

## PHASE 2: Home -- Hero + Tech Marquee
**Goal:** First real visual content. Validates design system.

**Create:**
- `src/components/Home/HeroSection.vue` -- Massive "SENIOR VUE.JS & TS ENGINEER" typography, availability tag, description, location. Uses `clamp()` for responsive sizing. Minimal CSS fade-in animation.
- `src/components/Home/TechMarquee.vue` -- Scrolling tech labels (VUE3, TYPESCRIPT, VITE, PINIA, NUXT) with alternating opacity, CSS `animate-marquee`.

**Modify:** `src/views/HomePage.vue` -- Import + render both.

**Delete:** `src/components/Landing/HeroSection.vue` (old hero)

**Test:** Visit `/` -- hero + marquee render correctly.

---

## PHASE 3: Home -- Project Rows + Data Layer
**Goal:** Edge-to-edge project rows with hover image reveal. Extract project data.

**Create:**
- `src/data/projectsData.ts` -- Project array with `slug`, `title`, `categoryLabel`, `description`, `backgroundImage`, case study content
- `src/types/caseStudy.ts` -- Types for case study data
- `src/components/Home/ProjectRow.vue` -- Full-width row: index number, giant title (~90px), category + description right-aligned. Background image: `opacity-0 grayscale` -> `group-hover:opacity-[0.1] scale-[1.01]`. Row links to `/case-study/:slug`.
- `src/components/Home/ProjectsArchive.vue` -- Container with "PROJECTS ARCHIVE" header + renders rows

**Modify:**
- `src/types/project.ts` -- Add `slug`, `backgroundImage`, `categoryLabel`
- `src/views/HomePage.vue` -- Add `ProjectsArchive`

**Delete:**
- `src/components/Projects/ProjectsSection.vue`
- `src/components/Projects/ProjectCard.vue`

**Test:** Scroll past marquee, see project rows. Hover reveals background image.

---

## PHASE 4: Home -- Bento Split + CTA
**Goal:** Complete home page with philosophy grid and black CTA.

**Create:**
- `src/components/Home/BentoSection.vue` -- 2-col grid with 1px gap. Left: "Code as Architecture" + CTA button. Right top: inverted black expertise list with years. Right bottom: collaborations.
- `src/components/Home/CTASection.vue` -- Black bg, massive "Let's construct the future.", contact links.

**Modify:** `src/views/HomePage.vue` -- Add both.

**Test:** Full home page matches `home_final/screen.png`.

---

## PHASE 5: Manifesto Page (parallel with 2-4)
**Goal:** Complete about/manifesto page.

**Modify:**
- `src/views/ManifestoPage.vue` -- Full implementation: hero "Engineering Philosophy", philosophy text, chronology grid (date | role/company/description), philosophical pillars 2-col grid, decorative grayscale image, black CTA.
- `src/data/aboutData.ts` -- Restructure for manifesto format (simplify timeline, remove skills/social)
- `src/types/about.ts` -- Simplify types

**Delete:**
- `src/components/About/AboutSection.vue`
- `src/components/About/SkillsGrid.vue`
- `src/components/About/Timeline.vue`
- `src/components/About/SocialLinks.vue`

**Test:** Navigate `/manifesto` -- matches `about_final/screen.png`.

---

## PHASE 6: Case Study Detail Page
**Goal:** 30/70 split layout with grayscale-to-color hover interaction.

**Create:**
- `src/views/CaseStudyPage.vue` -- 30% sticky sidebar (metadata) + 70% scrolling narrative. Reads slug from route, finds matching project data.
- `src/components/CaseStudy/GrayscaleImage.vue` -- Reusable: `grayscale` default, `hover:grayscale-0 transition-all duration-700`. Uses `group`/`group-hover` so parent section gets subtle bg tint on image hover.
- `src/components/CaseStudy/NextProjectFooter.vue` -- Massive typography, full-width, bg inverts on hover, links to next project.
- `src/data/caseStudiesData.ts` -- Full narrative content per project (challenge, strategy, outcomes, code snippets, images)

**Modify:** `src/components/TheNavbar.vue` -- Case study variant (back arrow + project number)

**Test:** Navigate `/case-study/:slug` -- 30/70 layout, sticky sidebar, image hover reveals color + section tints.

---

## PHASE 7: Cleanup + Polish
**Goal:** Remove legacy code, optimize build, verify everything.

**Modify:**
- `src/components/SEOHead.vue` -- Update defaults, per-page title/description
- `src/composables/useScrollAnimation.ts` -- Simplify, keep anime.js for entrance fade/slide animations
- `vite.config.ts` -- Update `manualChunks` for new component structure
- `package.json` -- Remove `gsap`. Keep `animejs` + `@types/animejs` for subtle entrance animations.

**Delete:** Any remaining unused files from old design.

**Test:** Full site works, no console errors, responsive at all breakpoints, Lighthouse audit.

---

## Grayscale-to-Color Hover System (Special Request)
- All images default to `grayscale` CSS filter
- On hover: `grayscale-0` with `transition-all duration-700`
- **Section response**: Image wrapper uses `group` class. Sibling elements in section use `group-hover:bg-[#f0f0ef]` (subtle warm tint) to create visual "awakening" effect when hovering images
- Applied in: ProjectRow (home), GrayscaleImage (case study), decorative image (manifesto)

---

## Dependency Graph
```
Phase 0 (Foundation)
  |
  v
Phase 1 (Routing + Shell)
  |
  +---> Phase 2 -> Phase 3 -> Phase 4 (Home, sequential)
  |
  +---> Phase 5 (Manifesto, parallel with 2-4)
  |
  +---> Phase 6 (Case Study, needs Phase 3 data)
  |
  v
Phase 7 (Cleanup, after all pages)
```

## Key Reference Files
- `new design/home_final/code.html` -- Home HTML reference
- `new design/about_final/code.html` -- Manifesto HTML reference
- `new design/case_study_detail_final/code.html` -- Case study HTML reference
- `new design/monolith_architectural/DESIGN.md` -- Design system rules
