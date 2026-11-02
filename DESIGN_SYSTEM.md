# DESIGN SYSTEM: MAYURESH SONAWANE (EDITORIAL MOTORSPORT INFLUENCE)

A specialized design system derived from the visual language of **OFF+BRAND's Lando Norris website** (`landonorris.com`), re-architected for **Mayuresh Sonawane** (Creative Developer & Builder).

---

## 1. Core Principles

1. **Editorial Tension (Light vs. Dark):** The experience alternates intentionally between high-detail off-white editorial paper sections (`#F5F5F0`) and deep cinematic charcoal sections (`#0E0E10`).
2. **Surgical Color Allocation:** Electric lime (`#D2FD52`) is never used as a background wash. It is an electrical laser reserved for focal interactions, hover states, status pills, and page transitions.
3. **No Physical Location Displayed:** The visual system uses pure architectural and technical telemetry (`SYS.STATUS // OPERATIONAL`, `EDITION // 2026`) instead of physical geographic coordinates or city names.
4. **Spider-Man Mask Identity Motif:** Replaces motorsport helmet imagery with tactile Spider-Man mask artifacts, heroic geometry, and optical lens textures.
5. **Visceral Motion Physics:** Smooth inertial deceleration (Lenis) powering scroll-scrubbed transformations (scale, translation, horizontal scroll pinning, mask reveals).

---

## 2. Color Palette & Surface Tokens

### 2.1 The Primaries
* **Editorial Off-White (Paper Base):** `#F5F5F0`
  * Secondary Tint: `#ECECE6`
  * Card Surface: `#FFFFFF`
  * Light Border / Rule: `rgba(0, 0, 0, 0.09)`
  * Light Crosshair / Tick: `rgba(0, 0, 0, 0.25)`

* **Cinematic Charcoal (Dark Editorial Base):** `#0E0E10`
  * Surface Dark: `#151518`
  * Surface Dark Elevated: `#1E1E23`
  * Dark Border / Rule: `rgba(255, 255, 255, 0.12)`
  * Dark Crosshair / Tick: `rgba(255, 255, 255, 0.3)`

* **Electric Voltage Lime (Signature Accent):** `#D2FD52`
  * Deep Accent: `#B0D936`
  * High-Glow Accent: `rgba(210, 253, 82, 0.35)`
  * Muted Accent: `rgba(210, 253, 82, 0.12)`

---

## 3. Component Design Specifications

### 3.1 The Mask Collection Showcase
* **Structure:** Deep charcoal section with high-contrast spotlighting.
* **Viewer Aspect:** `4:3` or `16:10` framed viewer with corner coordinates and edition badges.
* **Scan Effect:** Interactive wireframe mesh toggle activating a technical green-matrix overlay (`rgba(210, 253, 82, 0.1)`).
* **Hover Reveal:** Seamless crossfade from primary mask silhouette to close-up optical lens texture.
* **Switcher:** Segmented monospaced pill controls for switching mask editions.

### 3.2 Project Management Dashboard
* **Container:** Floating modal overlay with backdrop blur (`rgba(0, 0, 0, 0.85)`).
* **Surface:** `#151518` with hairline volt border (`rgba(210, 253, 82, 0.4)`).
* **Status Badges:**
  * `DRAFT`: Amber tone (`bg-amber-500/15 text-amber-300 border-amber-500/30`)
  * `PUBLISHED`: Voltage lime (`bg-volt/15 text-volt border-volt/40`)
  * `HIDDEN`: Neutral slate (`bg-white/10 text-charcoal-muted border-white/10`)
* **Controls:** Reorder up/down buttons, instant status dropdown, GitHub URL import bar.

### 3.3 Public Gallery Empty State
* **Typography:** Oversized display headline (`Syne 800`) *"THE NEXT CHAPTER IS YOURS TO DISCOVER."*
* **Telemetry Badge:** Pulsing volt dot with monospaced status stamp `[STATUS // GALLERY READY]`.
* **Framing:** Hairline bordered card with dashed registration marks.
