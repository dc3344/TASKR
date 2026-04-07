# DESIGN SYSTEM: THE KINETIC TERMINAL

## 1. Overview & Creative North Star
**Creative North Star: The Kinetic Terminal**
This design system moves away from the "software as a service" aesthetic and toward "software as an instrument." It is an industrial, high-precision environment designed for high-velocity decision-making. We reject the softness of modern web design in favor of **Kinetic Brutalism**—a style defined by zero-radius corners, monolithic surfaces, and a high-contrast typographic hierarchy that feels like a mission-critical heads-up display (HUD).

To break the "template" look, layouts must embrace **intentional asymmetry**. Use large blocks of negative space to isolate critical data points, and allow display elements to overlap slightly with container edges to create a sense of depth and technical sophistication.

---

## 2. Colors & Tonal Hierarchy
The palette is rooted in a deep, pressurized "Near-Black" environment. The goal is to reduce ocular strain while using high-chroma accents to signal status.

*   **The "No-Line" Rule:** Under no circumstances are 1px solid borders to be used for sectioning content. Boundaries must be defined strictly through background color shifts. Use `surface-container-low` (#1a1c20) for the main body and `surface-container-high` (#282a2e) for interactive cards. This creates a "milled" effect, as if the UI was carved out of a single piece of dark metal.
*   **Surface Hierarchy & Nesting:**
    *   **Base:** `background` (#111318).
    *   **Level 1 (Panels):** `surface-container-low` (#1a1c20).
    *   **Level 2 (In-Panel Cards):** `surface-container` (#1e2024).
    *   **Level 3 (Interactive/Active):** `surface-container-highest` (#333539).
*   **Signature Textures:** For high-priority CTAs or header backgrounds, use a subtle vertical gradient transitioning from `primary` (#adc6ff) to `primary_container` (#4d8eff). This provides a "glow" that mimics an illuminated hardware console.
*   **The "Glass" Protocol:** Use semi-transparent versions of `surface_variant` with a 12px backdrop-blur for floating overlays or command palettes. This ensures the underlying data grid remains visible, maintaining the "HUD" feel.

---

## 3. Typography
The typography is designed to feel like architectural blueprints: precise, technical, and authoritative.

*   **Display & Headlines (Space Grotesk):** These are your "Status Numbers." Use `display-lg` for mission-critical metrics. The geometric, slightly eccentric nature of Space Grotesk provides the "Industrial" soul of the system.
*   **Data & Body (Inter):** While the system feels "Mono," we use Inter for body text to ensure maximum readability during high-stress operations.
*   **The Label Protocol:** All labels (using `label-md` or `label-sm`) must be **UPPERCASE** with a letter-spacing of `0.1em` to `0.2em`. This mimics the engraved plates found on industrial machinery.
*   **Hierarchy as Identity:** Pair a massive `display-md` value with a tiny `label-sm` immediately above it. This extreme scale contrast is the signature of an editorial, high-end experience.

---

## 4. Elevation & Depth
In this system, elevation is not about "floating"—it is about "lighting."

*   **The Layering Principle:** Achieve depth by "stacking" the surface-container tiers. A `surface-container-lowest` (#0c0e12) area acts as a "well" where data resides, while `surface-container-high` (#282a2e) acts as a "raised" platform for action.
*   **Ambient Shadows:** For rare floating elements (like a task-edit modal), use an ultra-diffused shadow: `box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5)`. The shadow should not be grey; it should be a darker version of the `background` to feel like a natural light occlusion.
*   **The "Ghost Border" Fallback:** If a distinction is required for accessibility, use the `outline_variant` token at **15% opacity**. It should be felt, not seen.
*   **Corner Treatment:** All `borderRadius` tokens are strictly **0px**. No exceptions. Softness is the enemy of the Kinetic Terminal.

---

## 5. Components

### Buttons
*   **Primary:** Solid `primary` (#adc6ff) background with `on_primary` (#002e6a) text. Sharp corners.
*   **Secondary (Utilitarian):** `outline` (#8c909f) ghost button with a 10% opacity `surface_variant` fill on hover.
*   **Tertiary:** Text-only, uppercase, wide letter-spacing. Use `primary` for the text color.

### Status Chips
Chips are not rounded; they are rectangular blocks.
*   **New:** `secondary_container` (#00b55d) background with `on_secondary_container` text.
*   **In Progress:** `primary_container` (#4d8eff) background.
*   **Blocked/Critical:** `error_container` (#93000a) background with a pulsing 2px `error` left-border.

### Input Fields
*   **State:** Background should be `surface_container_lowest`. 
*   **Focus:** Do not use a border-box focus ring. Use a 2px bottom-bar in `primary` (#adc6ff) and a subtle glow (5% opacity `primary` fill).
*   **Labels:** Always positioned above the input, uppercase, using `label-sm`.

### Task Lists & Cards
*   **No Dividers:** Prohibit the use of 1px lines between tasks. Instead, use a 12px vertical gap (from the Spacing Scale) and shift the `surface-container` color of every second item (zebra-striping) for legibility.
*   **Priority Indicators:** A 4px wide vertical "Status Bar" on the extreme left of a card. `tertiary` (#ffb3ad) for Critical, `tertiary_fixed_variant` for High.

---

## 6. Do's and Don'ts

### Do
*   **DO** use monochromatic icons (phosphor-style) that match the text color.
*   **DO** leave generous "breathing room" around critical numbers.
*   **DO** use "staggered" layouts—e.g., the left column is 10% lower than the right column to break the grid.
*   **DO** embrace the 0px radius. It communicates speed and lack of compromise.

### Don't
*   **DON'T** use soft drop-shadows or "card" containers with borders.
*   **DON'T** use Title Case for labels; it looks too much like a standard consumer app.
*   **DON'T** use gradients on secondary or tertiary elements. Gradients are reserved for "Primary Power" actions only.
*   **DON'T** use any color outside the defined Material tokens. The "Command Center" feel relies on a tightly controlled chromatic environment.