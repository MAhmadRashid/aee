# Product Requirement Document (PRD): 3D Luxury Perfume Interactive Showcase (Antigravity Experience)

**Project Name:** AURA 3D Antigravity Fragrance Showcase  
**Document Version:** 1.0  
**Status:** MVP Ready  
**Target Audience:** Luxury Fragrance Brands, D2C Beauty E-commerce, Experiential Web Designers  

---

## 1. Executive Summary & Objectives

### 1.1 Problem Statement
Luxury fragrances are notoriously difficult to sell online because buyers rely heavily on emotional storytelling, scent aesthetics, and tactile bottle craftsmanship. Traditional 2D imagery and video loops fail to convey bottle materials (glass refraction, metallic finishes) or the olfactory composition (fragrance notes breakdown).

### 1.2 Proposed Solution
An immersive, WebGL-powered 3D showcase featuring a **zero-gravity (Antigravity) interactive experience**. The perfume bottle floats in a dynamic particle field with levitating raw ingredients, real-time liquid physics, an interactive exploded-view scroll journey, and multi-note fragrance discovery hotspots.

### 1.3 Key Metrics (KPIs)
* **Average Session Time:** $\ge 2.5\text{ minutes}$ on product detail pages.
* **Canvas Interaction Rate:** $\ge 70\%$ of visitors engage with the 3D orbit / explode / note selectors.
* **Frame Rate Consistency:** $60\text{ FPS}$ on desktop, $\ge 50\text{ FPS}$ on modern mobile GPUs.
* **Conversion Rate Lift:** $\ge 35\%$ increase in sample discovery kit and bottle checkout intent.

---

## 2. User Personas & Core Journeys

### 2.1 Personas
* **The Luxury Shopper (Amina):** Seeks an elevated, sensory digital buying journey; wants to understand the scent pyramid (Top/Heart/Base notes) and admire the bottle aesthetics before committing to a premium purchase.
* **The Brand Curator (D2C Admin):** Wants to configure liquid variants, customize floating botanical elements, and embed the 3D scene effortlessly into Shopify / Next.js storefronts.

### 2.2 Core User Stories
* *As a shopper*, I want to rotate the bottle $360^\circ$ with realistic glass caustics and fluid movement so that I can appreciate the bottle's design.
* *As a shopper*, I want to scroll down to trigger an exploded view that lifts the magnetic cap and isolates fragrance layers in zero gravity.
* *As a shopper*, I want to click interactive floating notes (e.g., Bergamot, Jasmine, Amber) to view their origins and concentration percentages.
* *As a shopper*, I want to toggle liquid variants (Amber Gold, Midnight Iris, Rose Oud) with instantaneous PBR shader transitions.

---

## 3. Core Functional & Interactive Requirements

### 3.1 Antigravity Physics & 3D Environment
* **Continuous Micro-Levitation:** Gentle sine-wave bobbing ($Y$-axis float) for the bottle and orbital drifting for surrounding particles/petals.
* **Interactive Disassembly (Scroll Scrubbing):**
  * **$0\%\text{ Scroll}$ (Assembled State):** Complete bottle resting in zero-gravity with surrounding floating droplets.
  * **$50\%\text{ Scroll}$ (Exploded Component State):** Magnetic gold cap detaches upward ($+Y$), atomizer nozzle raises, glass outer wall expands, floating notes drift into focused orbits.
  * **$100\%\text{ Scroll}$ (Scent Pyramid State):** Camera dollies in close with dynamic depth-of-field (DoF) to isolate olfactory ingredients.

### 3.2 Dynamic Materials & Liquid Shading
* **Glass Refraction & Transmission:** High-index refraction ($IOR = 1.52$) with real-time roughness and dispersion.
* **Liquid Physics Simulation:** Dynamic internal fluid level reacting to mouse inertial movements with subtle slosh calculations.
* **Gold & Metallic Cap:** Anisotropic brushed metal PBR shader reflecting studio HDRI environment lighting.

### 3.3 Interactive Olfactory Hotspots (Scent Pyramid)
* **Screen-Space 3D Anchors:** Pins floating next to orbital botanical elements (Top: Bergamot, Heart: Jasmine Sambac, Base: Amber Crystal).
* **Focus Transition:** Clicking a hotspot smoothly interpolates the Three.js camera to the target ingredient, shifts focus, and pops up a glassmorphism spec card.

### 3.4 Translucent HUD & Customization Dock
* **Variant Palette:** Translucent dock at the screen bottom to switch liquid PBR color and label typography style.
* **Particle Density Slider:** User toggle to adjust floating debris count and background atmospheric smoke.
* **Direct Checkout Callout:** Sticky bottom-right glass CTA with dynamic bottle assembly snapshot.

---

## 4. Technical Architecture & Tech Stack

| Layer | Recommended Technology | Role & Purpose |
|---|---|---|
| **Frontend Framework** | Next.js 14/15 (React, TypeScript) | Page lifecycle, SSR for SEO metadata, route handling |
| **3D Rendering Engine** | Three.js + React Three Fiber (R3F) | Declarative WebGL canvas, custom GLSL liquid/glass shaders |
| **Helper Libraries** | `@react-three/drei` + `@react-three/postprocessing` | Bloom, Chromatic Aberration, Depth of Field, Environment HDR |
| **Animation Engine** | GSAP (ScrollTrigger) + Framer Motion | Smooth scroll-synchronized 3D timeline and camera rigging |
| **Asset Format** | `.glb` (Draco + Meshopt compressed) | Highly optimized 3D geometry ($< 4\text{ MB}$ payload budget) |
| **Styling** | Tailwind CSS + CSS Modules | Glassmorphism floating HUD, typography overlays |

---

## 5. Non-Functional & Performance Constraints

* **Asset Budget:**
  * Perfume bottle + cap mesh: $< 45\text{k}$ polygons.
  * Floating botanical/particle meshes (instanced): $< 30\text{k}$ total polygons.
  * Total initial scene transfer size: $< 5.5\text{ MB}$ compressed.
* **Shader Fallbacks:** Automatic downgrade of post-processing effects (disabling high-pass Bloom and DoF) on lower-tier mobile GPUs ($< 30\text{ FPS}$ detection).
* **Cross-Device Input:** Unified pointer event handling supporting mouse drag, trackpad inertial scrolling, and mobile touch pinch/pan.

---

## 6. Implementation Roadmap

### Sprint 1: 3D Scene Foundation
- [x] Studio lighting setup (HDRI + 3-point rim lighting).
- [x] PBR Glass and fluid shaders with transmission and roughness control.
- [x] Inertial OrbitControls with pitch and distance constraints.

### Sprint 2: Antigravity Physics & Scroll Rigging
- [ ] ScrollTrigger integration linking page scroll progress to component separation ($Y$-axis offsets).
- [ ] Particle system for floating ingredients (Bergamot, Jasmine, Amber particles) using instanced meshes.
- [ ] Antigravity floating sine-wave idle loops.

### Sprint 3: UI & Scent Exploration
- [ ] 3D clickable hotspot annotations with camera fly-to easing.
- [ ] Glassmorphism floating variant dock with real-time shader color interpolation.
- [ ] Add-to-cart integration with assembly snap-back animation.
