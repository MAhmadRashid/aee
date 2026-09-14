# Product Requirement Document (PRD)

**Document Reference:** PRD-ZTO-2026-V2.1  
**Project Title:** ZERO TO ONE (ZTO) — Phase 2: Experiential 3D Engine & Interactive Scent Discovery  
**Author:** Lead Technical Product Manager  
**Target Release Window:** Q3 2026  
**Status:** Under Engineering Review  
**Distribution:** Core Engineering, UI/UX Design, 3D Technical Artists, Product Marketing  

---

## 1. Document Overview & Strategic Context

### 1.1 Executive Summary
Phase 1 established the baseline production pipeline: WebGL canvas rendering, PBR material loading, basic orbit controls, and RESTful product metadata endpoints.

**Phase 2** upgrades the static viewer into a high-conversion, interactive digital luxury experience. It introduces a scroll-driven exploded mechanism (Antigravity physics engine), 3D olfactory scent pyramid callouts, camera tweening with Depth of Field (DoF), and zero-friction WebXR / Apple AR Quick Look integration.

### 1.2 Business Objectives & Quantitative Success Metrics

| Metric Category | Baseline (Phase 1) | Phase 2 Target KPI | Measurement Tool |
|---|---|---|---|
| **Average Dwell Time** | $45	ext{ s}$ | $\ge 2	ext{ min } 30	ext{ s}$ | Google Analytics 4 / Custom Event Stream |
| **3D Canvas Interaction Depth** | $40\%$ | $\ge 72\%$ (≥2 variant/hotspot triggers) | Mixpanel 3D Telemetry |
| **Scroll Journey Completion** | N/A | $\ge 65\%$ (Reach full exploded state) | ScrollTrigger Event Hook |
| **Mobile AR Launch Rate** | N/A | $\ge 15\%$ of mobile traffic | WebXR / QuickLook Intent Listener |
| **Add-to-Bag / Sample Kit CVR** | $1.8\%$ | $\ge 3.4\%$ | Shopify Headless Storefront API |

---

## 2. Technical Architecture & Data Pipeline

```
[ Headless CMS / S3 CDN ]
         │ (GLB, USDZ, HDRIs, KTX2)
         ▼
[ Client Application (Next.js App Router) ]
 ├── GSAP ScrollTrigger ────────► Drives 3D Timeline & Mesh Offsets
 ├── React Three Fiber (R3F) ───► WebGL Render Loop & GLSL Shaders
 ├── @react-three/drei ─────────► Html Annotations & Occlusion Engine
 └── @react-three/postprocessing ► Bokeh DoF, Bloom, SMAA Anti-Aliasing
```

---

## 3. Detailed Feature Specifications

### 3.1 Scroll-Synchronized Antigravity Exploded View

* **Trigger Mechanism:** Scrub-synchronized timeline powered by `GSAP ScrollTrigger` bound to the parent container viewport.
* **Component Mesh Transformation Matrix:**

| Scroll Progress | Component Sub-Assembly | Transform Axis & Vector | Visual Feedback & Shader Behavior |
|---|---|---|---|
| **$0\% - 15\%$** | Monolith Assembly | Resting position ($Y=0$) | Sine-wave micro-levitation ($f=1.2	ext{ Hz}$, $A=0.05$) |
| **$15\% - 45\%$** | Magnetic Gold Cap | $+Y$ translation $+1.4	ext{ units}$ | Anisotropic specular flare under overhead key light |
| **$45\% - 75\%$** | Atomizer & Collar | $+Y$ translation $+0.7	ext{ units}$ | Internal pump tube reveals chrome finish |
| **$75\% - 100\%$** | Crystal Glass Outer Wall | Scale outwards $+12\%$ ($X/Z$) | Liquid core remains suspended in zero-gravity |

* **Reversibility:** Full bi-directional interpolation; scrolling upwards reconstructs the bottle seamlessly with ease curve `power2.out`.

### 3.2 3D Olfactory Hotspot Architecture

* **Anchor System:** 3D world vectors mapped directly to parent mesh nodes using `@react-three/drei` `<Html />` with `distanceFactor={8}`.
* **Occlusion & Normal Culling Algorithm:**
  * System calculates the dot product between the surface vertex normal and the camera position vector ($\mathbf{N} \cdot \mathbf{V}$).
  * If $\mathbf{N} \cdot \mathbf{V} < 0.1$, the pin transitions to `opacity: 0` via a CSS $200	ext{ ms}$ ease-out transition to eliminate backface clutter.
* **Hotspot Payload Breakdown:**
  * **Hotspot 1 (Top Note):** Kashmiri Saffron & Italian Bergamot (Zesty, warm opening).
  * **Hotspot 2 (Heart Note):** Jasmine Sambac Absolute & Taif Rose (Rich floral core).
  * **Hotspot 3 (Base Note):** Aged Cambodian Oud & Golden Amber (Heavy resinous fixative).
* **Camera Easing:** Clicking an active pin initiates a camera fly-to interpolation ($1.2	ext{ s}$ duration, cubic bezier curve) focusing on the sub-mesh with an expanded glassmorphism side drawer.

### 3.3 GPU-Optimized Instanced Particle Field

* **Implementation:** `THREE.InstancedMesh` with 60 instances representing amber resin crystals, sliced botanicals, and levitating fluid beads.
* **Shader Calculation:** GPU vertex shader applies procedural curl noise to displace instances dynamically around the container perimeter without CPU compute overhead.

### 3.4 WebXR & AR Quick Look Pipeline

* **iOS Implementation:** Direct anchor link serving lightweight `<model>.usdz` utilizing Apple AR Quick Look with custom banners (`checkout-action`).
* **Android Implementation:** `<model-viewer>` component triggering native Google Scene Viewer with environmental lighting estimation enabled.

---

## 4. Performance & Engineering Constraints

* **Maximum Asset Size Budget:**
  * Primary Model (`.glb` with Draco + Meshopt): $\le 3.5	ext{ MB}$.
  * AR Model (`.usdz`): $\le 2.8	ext{ MB}$.
  * Environment Map (HDR/EXR compressed): $\le 1.2	ext{ MB}$.
* **Frame Rate Thresholds:**
  * Desktop (GPU Tier 2+): Consistent $60	ext{ FPS}$.
  * Mobile (iOS A14+ / Snapdragon 8 Gen 1+): Minimum $50	ext{ FPS}$.
* **Draw Call Ceiling:** $\le 28	ext{ total draw calls}$ per frame (instanced particles included).
* **Graceful Degradation:** When rendering drops below $25	ext{ FPS}$ for $>3	ext{ seconds}$, post-processing passes (Depth of Field & Bloom) automatically disengage.

---

## 5. User Stories & Acceptance Criteria

### US-201: Exploded Scroll Navigation
* **Story:** As a customer, I want to scroll down the page so that the fragrance bottle disassembles in 3D to reveal its internal engineering and core liquid layer.
* **Acceptance Criteria:**
  - [ ] Scroll position accurately scrubs the 3D timeline with zero input delay.
  - [ ] All floating elements maintain continuous zero-gravity particle oscillation.
  - [ ] Rapid scrolling does not break camera bounding boxes or introduce mesh clipping.

### US-202: Scent Exploration Hotspots
* **Story:** As a fragrance buyer, I want to click interactive nodes on the bottle so that I can discover the notes and origin of each ingredient.
* **Acceptance Criteria:**
  - [ ] Hotspots project accurately across all desktop and mobile viewport resolutions.
  - [ ] Pins correctly hide when occluded by the bottle geometry.
  - [ ] Triggering a pin pans the camera smoothly and opens the note details sidebar.

---

## 6. Implementation Timeline & Engineering Sprints

```
Sprint 2.1 (Weeks 1-2) ──► Mesh Rigging & GSAP ScrollTrigger Integration
Sprint 2.2 (Weeks 3-4) ──► Instanced Particle Shaders & Hotspot Occlusion
Sprint 2.3 (Weeks 5-6) ──► Camera Fly-To Interpolation & Post-Processing Setup
Sprint 2.4 (Weeks 7-8) ──► WebXR / USDZ Pipeline, QA, & Cross-Device Optimization
```

---

## 7. Risk Analysis & Mitigation Strategies

| Identified Risk | Severity | Probability | Mitigation Strategy |
|---|---|---|---|
| **Mobile Thermal Throttling** | High | Medium | Dynamic resolution scaling ($DPR = 1.0	ext{ to }1.5$) & post-processing kill-switch on low battery/FPS drops. |
| **High Initial Asset Latency** | High | High | Lazy-load heavy textures; display animated SVG loader until Draco decompression completes. |
| **Touch vs. Scroll Conflicts on Mobile** | Medium | High | Lock canvas orbit gesture to 2-finger touch; dedicate 1-finger vertical swipe strictly to page scroll. |
