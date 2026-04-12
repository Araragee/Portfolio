# Monolith Architectural Design System

### 1. Overview & Creative North Star
**Creative North Star: "Stark Structuralism"**
Monolith Architectural is a design system that champions the beauty of technical precision and structural clarity. It is inspired by brutalist architecture and high-end editorial archives. By stripping away all ornamentation—no shadows, no rounded corners, no gradients—the system forces the user's focus onto content, typography, and the rhythm of the grid. 

The system rejects traditional "app" metaphors in favor of a "document" feel, utilizing intentional asymmetry (such as the 30/70 split layout) and high-contrast typographic scales to create a sense of curated authority.

### 2. Colors
The palette is strictly monochromatic, utilizing a warm off-white (`#F9F9F8`) to provide a more sophisticated, "paper-like" feel than a clinical pure white.

*   **The "No-Line" Rule:** Sectioning is achieved through two primary methods: background shifts between `surface` and `surface_container`, or single-pixel hairline dividers (`#E5E5E5`). 1px solid borders for component enclosures are permitted only when framing media or code blocks.
*   **Surface Hierarchy:**
    *   `Surface`: The base paper layer (#F9F9F8).
    *   `Surface Container`: Used for secondary modules or sidebar accents.
    *   `Inverse Surface`: Reserved for "Next Project" transitions or primary CTAs.
*   **Signature Textures:** This system utilizes zero textures. Depth is achieved solely through high-contrast inversions (Black on White vs. White on Black).

### 3. Typography
The typography system uses a high-contrast pairing: a geometric headline face for impact and a clean, legible sans for utility.

*   **Display / Headline:** Uses 'Clash Display' (or Plus Jakarta Sans). It is defined by tight tracking and a bold weight. Sizes range from **3rem (48px)** for section headers to a massive **64px+** for hero statements.
*   **Body:** Uses 'Switzer' (or Public Sans). Set at **1.125rem (18px)** for general reading, it ensures high legibility against the stark background.
*   **Utility / Mono:** Uses 'JetBrains Mono' (or Space Grotesk) at **13px** with **tracking-widest (approx 0.1em)**. This is used for metadata, labels, and technical data.
*   **The Scale:** The system ignores standard incremental scales in favor of "Extreme Hierarchy." Small labels are strictly 13px, while headlines immediately jump to 36px and above, creating an editorial rhythmic gap.

### 4. Elevation & Depth
Elevation in Monolith Architectural is **flat**.

*   **The Layering Principle:** There is no Z-axis. Depth is simulated through "Horizontal Stacking." Components do not float; they sit flush on the surface.
*   **Ambient Shadows:** Prohibited. No box-shadows are used in this system.
*   **Glassmorphism:** Use only as a functional background blur for fixed navigation bars (`background/90` with backdrop-blur) to maintain legibility over scrolling content.
*   **The Hairline:** Use a 1px solid border in `#E5E5E5` for structural separation. These are never used for "cards," only for axes.

### 5. Components
*   **Buttons:** Rectangular with `0px` radius. Primary buttons are solid `on_surface` (Black) with `surface` (Off-white) text. Hover states trigger a total color inversion.
*   **Chips/Labels:** Minimal text-only labels in Mono font. No background containers unless they are strictly functional (like code snippets).
*   **Inputs:** Bottom-border only or a 1px frame. Focus states use a bold 2px bottom border rather than a glow.
*   **Imagery:** Images must be framed with a 1px hairline (`#E5E5E5`). High-contrast photography or architectural renders are preferred.

### 6. Do's and Don'ts
*   **Do:** Use extreme whitespace. The `spacing: 3` setting is the baseline. 
*   **Do:** Align everything to a strict grid. If an element is off-grid, it must be intentionally and aggressively so.
*   **Don't:** Use rounded corners. Ever. Not even on buttons or checkboxes.
*   **Don't:** Introduce a third color. The system relies on the tension between Black, White, and the Grey mid-tones.
*   **Do:** Use 13px Mono caps for all technical metadata to maintain the "Lead Architect's Blueprint" aesthetic.