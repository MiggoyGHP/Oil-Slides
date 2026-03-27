# Design System Document

## 1. Overview & Creative North Star: "The Global Auditor"

This design system is engineered for high-stakes environments where clarity, authority, and premium aesthetics are non-negotiable. Moving away from the generic "blue-and-yellow" corporate template, we embrace a Creative North Star titled **"The Global Auditor."** 

This approach treats the UI as a digital executive suite: expansive, quiet, and profoundly structured. We utilize **intentional asymmetry**—pairing heavy typographic displays with vast negative space—to command attention. By layering deep navy surfaces and using refined gold accents sparingly, we create an editorial experience that feels less like a slide deck and more like a bespoke intelligence report.

---

## 2. Colors: Tonal Depth & Liquid Gold

The palette is anchored in the deep obsidian-blues of the oil industry, punctuated by a refined amber that mimics the "liquid gold" of raw commodities.

### The "No-Line" Rule
To maintain a high-end editorial feel, **1px solid borders are strictly prohibited for sectioning.** Do not use lines to separate content. Boundaries must be defined solely through background color shifts. For example, a card should sit as a `surface-container-low` block on a `surface` background. The transition between these two values is the only "border" allowed.

### Surface Hierarchy & Nesting
Treat the interface as a physical stack of semi-transparent materials:
- **Base Layer:** `surface` (#0c141f) – The foundation of all slides.
- **Sectioning:** `surface-container-low` (#141c28) – For large content blocks.
- **Interactive/Floating Layers:** `surface-container-highest` (#2d3542) – For high-priority modals or overlays.

### The "Glass & Gradient" Rule
Standard flat colors feel static. To elevate the presentation:
- **Signature Gradients:** For primary CTAs and hero titles, use a subtle linear gradient from `primary` (#fff4c3) to `primary_container` (#f2d801) at a 135-degree angle.
- **Glassmorphism:** For floating navigational elements or secondary data overlays, use `surface_variant` at 60% opacity with a `20px` backdrop-blur. This ensures the deep navy "oil" background bleeds through, softening the layout.

---

## 3. Typography: Authority Through Scale

We utilize a dual-typeface system to balance modern industrial strength with readable executive summaries.

- **Display & Headlines (Manrope):** A geometric sans-serif that feels engineered and precise. 
    - Use `display-lg` for single-word thematic shifts.
    - Use **intentional tight tracking** (-2%) on `headline-lg` to create a more "locked-in," authoritative look.
- **Body & Titles (Inter):** A highly legible neutral sans-serif. 
    - `body-lg` should be used for core insights.
    - Use `label-sm` in all caps with increased letter spacing (+10%) for "Confidential" or "Internal Use" markers to mimic high-end legal documentation.

---

## 4. Elevation & Depth: Tonal Layering

Traditional drop shadows are too "web-standard" for this context. Instead, we use **Tonal Layering.**

- **The Layering Principle:** Depth is achieved by "stacking" container tiers. Place a `surface-container-highest` card inside a `surface-container-low` area to create a soft, natural lift.
- **Ambient Shadows:** If a floating effect is required (e.g., a critical data tooltip), use a shadow with a `40px` blur and `4%` opacity, using the `on_surface` color as the shadow tint. This mimics natural light rather than digital noise.
- **The "Ghost Border" Fallback:** If a container lacks sufficient contrast, use a `1px` stroke of `outline_variant` at **15% opacity**. It should be felt, not seen.

---

## 5. Components: Precision & Minimalist Logic

### Buttons
- **Primary:** Gradient fill (`primary` to `primary_container`) with `on_primary` text. No border. Roundedness: `md` (0.375rem).
- **Secondary:** `surface_container_high` fill with a `Ghost Border`.
- **Tertiary:** Text-only in `primary`, using `label-md` for a technical, precise feel.

### Cards & Data Lists
- **Rule:** Forbid divider lines. 
- **Execution:** Separate list items using `spacing-4` (1.4rem) of vertical white space or by alternating background tones between `surface-container-low` and `surface-container-lowest`.

### Input Fields & Search
- Use `surface_container_highest` for the field background. 
- The "Active" state is indicated not by a thick border, but by a `2px` bottom-bar in `primary_fixed_dim`.

### Industry-Specific Components
- **The Metric Monolith:** A large `display-md` number in `primary` paired with a `label-sm` unit descriptor. This creates a focal point for high-stakes KPIs.
- **Data Callouts:** Use `tertiary_container` for secondary insights—this cooler blue-grey tone provides a "neutral" space for data that isn't the primary focus.

---

## 6. Do's and Don'ts

### Do:
- **Do** use `spacing-16` or `spacing-20` for margins. High-stakes presentations require "breathing room" to convey confidence.
- **Do** use `primary` (#fff4c3) for emphasis only. If everything is gold, nothing is valuable.
- **Do** ensure all text on dark backgrounds uses `on_surface` (#dbe3f4) for optimal contrast.

### Don't:
- **Don't** use 100% white (#FFFFFF). It is too harsh for dark-themed boardroom presentations. Use `tertiary` (#eff3ff) instead.
- **Don't** use sharp corners (`none`). Use the `md` or `lg` roundedness scale to make the industrial theme feel sophisticated rather than aggressive.
- **Don't** use "glow" effects or heavy drop shadows (as seen in the reference image's title). Instead, use high-contrast typography and subtle gradients for visibility.