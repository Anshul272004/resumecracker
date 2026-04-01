

# ResumeCracker Cinematic 3D Redesign -- Implementation Plan

## Overview
Transform the current flat landing page into a cinematic, Apple-style 3D experience with floating resume elements, parallax depth, interactive hover effects, and premium motion design. The brand name shifts from "ProfileX" to "ResumeCracker" throughout the UI.

---

## Step 1: Install 3D Dependencies

Install `@react-three/fiber@^8.18`, `@react-three/drei@^9.122.0`, `three@^0.133`, and `@types/three` (dev).

---

## Step 2: Create 3D Components

### `src/components/3d/HeroScene.tsx`
A React Three Fiber `<Canvas>` component with:
- **Floating resume document**: A white rounded `RoundedBox` mesh with subtle rotation animation, mouse-parallax (useFrame + pointer tracking)
- **Orbiting skill chips**: Small `Text` elements ("React", "Python", "AWS") orbiting around the resume using sin/cos rotation
- **Glowing ATS score ring**: A `Torus` mesh with gold emissive material, slowly rotating
- **Ambient particles**: `Stars` from drei for depth, plus `Float` wrapper for gentle bobbing
- **Lighting**: `ambientLight` + `pointLight` with gold hue + `Environment` preset
- Wrapped in `Suspense` with a glass-blur fallback

### `src/components/3d/TiltCard.tsx`
Reusable wrapper using CSS `perspective` + `framer-motion`:
- Tracks mouse position over the card
- Applies `rotateX` / `rotateY` transforms (max 8deg)
- Adds subtle glow on hover via dynamic `boxShadow`
- Used for feature cards, template cards, pricing cards

---

## Step 3: Redesign Landing Page (`src/pages/LandingPage.tsx`)

Complete rewrite with these cinematic sections:

### Hero (Split Layout)
- **Left**: Large serif headline "Your Resume. Reinvented.", gold gradient subheadline, two premium CTAs, trust badges row
- **Right**: `<HeroScene />` 3D canvas with floating resume + score ring
- Background: Animated gradient mesh (midnight blue + charcoal) with light streaks

### Section 2: Why ResumeCracker
- 4 feature cards wrapped in `<TiltCard>` for 3D hover tilt
- Features: ATS Cracker, AI Bullet Rewriter, Cover Letter AI, Job Match Intelligence
- Each card has a glowing icon, benefit headline, one-line description

### Section 3: How It Works
- 3-step horizontal timeline with scroll-triggered reveals
- Connected by an animated gold line
- Steps: Upload > AI Analyzes > Download & Win

### Section 4: Template Gallery
- Horizontal card stack with depth (front card large, back cards recede with `scale` + `blur`)
- Each template card uses `<TiltCard>` with name, category, ATS readiness badge
- Hover reveals more detail with a glow effect

### Section 5: Before / After
- Same concept as current but with `<TiltCard>` wrappers and animated ATS score counters

### Section 6: Stats (Animated Counters)
- Keep existing `Counter` component, add `<TiltCard>` wrappers

### Section 7: Testimonials
- Cards with `<TiltCard>` + subtle floating animation on scroll
- Premium avatar styling with gold ring border

### Section 8: Pricing (3D Perspective Cards)
- 3 tiers: Free / Pro / Premium
- Pro card uses `translateZ(40px)` to physically come forward
- All cards use `<TiltCard>` with hover depth

### Section 9: Email Capture + Final CTA
- Keep existing structure, enhance with glassmorphism depth and animated background glow

---

## Step 4: Update CSS (`src/index.css`)

Add new CSS variables and animations:
```css
--cyan-accent: 190 80% 55%;
--violet-accent: 270 70% 60%;
--silver-accent: 0 0% 75%;
```

New keyframes:
- `gradient-shift`: Animated background gradient for hero
- `light-streak`: Diagonal sweeping light line
- `float-gentle`: Subtle up/down floating for cards

---

## Step 5: Update Tailwind Config

Add new color tokens (`cyan-accent`, `violet-accent`, `silver-accent`) and new animation utilities (`animate-gradient-shift`, `animate-light-streak`, `animate-float-gentle`).

---

## Files Summary

| File | Action |
|------|--------|
| `src/components/3d/HeroScene.tsx` | Create |
| `src/components/3d/TiltCard.tsx` | Create |
| `src/pages/LandingPage.tsx` | Full rewrite |
| `src/index.css` | Add new vars + keyframes |
| `tailwind.config.ts` | Add new colors + animations |

No database changes. No edge functions. No new routes. Pure frontend visual upgrade.

