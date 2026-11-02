# ANIMATION INVENTORY & MOTION SPECIFICATION

A comprehensive registry of every motion, transition, and interactive physics layer in the **Mayuresh Sonawane** portfolio.

---

## 1. Global & Architectural Motion

| Feature | Engine / Tool | Trigger | Easing / Timing | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Inertial Smooth Scroll** | Lenis | Wheel / Touch / Drag | `duration: 1.2`, cubic deceleration | **Active (Phase 1)** |
| **Lime Transition Curtain** | CSS Transforms / State | Navigation / Wipes | `cubic-bezier(0.85, 0, 0.15, 1)`, 700ms | **Active (Phase 1)** |
| **Monogram Badge Scale** | CSS Keyframes | Transition Curtain | `scale(0.8) -> scale(1.0)` | **Active (Phase 1)** |
| **Availability Beacon** | CSS Keyframes | Continuous Loop | `pulse-glow 2.2s ease-in-out infinite` | **Active (Phase 1)** |

---

## 2. Section Motion Specifications

### 2.1 Hero Section
* **WebGL Cursor Displacement:** Three.js fragment shader passing `uMouse` & `uHover` uniforms. Generates sinusoidal wave ripples, chromatic dispersion, and lime edge glow on pointer movement. **(Active - Phase 2)**
* **ScrollTrigger Pinning Anchor:** Coordinates portrait position for docking transition. **(Active - Phase 2)**

### 2.2 About Section ("A Message from Me")
* **Portrait-to-Card Docking:** GSAP ScrollTrigger scrub scaling portrait from `1.15` down to `1.0` and docking into the framed letterbox card. **(Active - Phase 2)**
* **Headline & Copy Slide-in:** Staggered X/Y reveal triggered as card locks in place. **(Active - Phase 2)**
* **Handwritten Signature Stroke:** Dynamic SVG `stroke-dashoffset` interpolation drawing path lengths on scroll or click. **(Active - Phase 2)**

### 2.3 BUILD / EXPLORE Split Doors
* **Asymmetric Flex Expansion:** CSS Flex transition expanding target side from 50% to ~65% while compressing sibling to 35% on hover. **(Active - Phase 3)**
* **Image Depth Zoom:** Background image scales gently (`scale(1.0) -> scale(1.05)`) with darkened vignette on hover. **(Active - Phase 3)**

### 2.4 The Mask Collection
* **Mesh Scan Toggle:** Interactive toggle activating a 6×6 geometric wireframe scan overlay across the mask. **(Active - Phase 3)**
* **Lens Reflection Reveal:** Crossfade revealing macro optical fabric and reflective white eye contour on hover. **(Active - Phase 3)**
* **Artifact Edition Switching:** Instant smooth fade transition between mask specifications. **(Active - Phase 3)**

### 2.5 Journey Section (Horizontal Documentary Strip)
* **Vertical-to-Horizontal Pinning:** GSAP ScrollTrigger pinning section container and translating track `-(scrollWidth - windowWidth)` proportionally to vertical scroll progress. **(Active - Phase 3)**
* **Progress Bar Scrub:** Real-time width interpolation tracking journey completion from 0% to 100%. **(Active - Phase 3)**
* **Mobile Touch Fallback:** Native smooth touch drag with chevron navigation controls for screens < 1024px. **(Active - Phase 3)**

### 2.6 Project Management Dashboard
* **Backdrop Fade & Modal Zoom:** Spring easing (`cubic-bezier(0.16, 1, 0.3, 1)`) on admin dashboard entrance. **(Active - Phase 3)**
* **Drag / Reorder Feedback:** Immediate visual update when projects are moved up or down. **(Active - Phase 3)**
