

# ResumeCracker Enhancement + Analysis Hub

## What We're Building

Two major upgrades:

1. **New "Career Analysis" page** (`/analysis`) -- A dedicated, always-accessible page where users can repeatedly analyze their resume, track progress over time, and get fresh insights. This is the "sticky" page that brings users back daily.

2. **UI enhancements across existing pages** -- Apply the same cinematic 3D depth, glassmorphism, and motion to pages that currently look flat (Pricing, About, Auth, Checkout, InterviewPrep, JobMatch).

---

## Part 1: Career Analysis Page (`/analysis`)

A new protected page that serves as the user's personal career intelligence dashboard. Unlike Results (which shows one-time optimization output), Analysis is a living, evolving page.

### Sections on the Analysis page:

1. **Resume Health Score** -- Large animated gauge showing overall resume strength (ATS score + keyword density + formatting + impact metrics). Updates every time user edits their resume.

2. **Progress Timeline** -- Visual chart showing how the user's ATS score has improved over time (pulled from `resumes` table `updated_at` + `ats_score` history).

3. **Skill Gap Radar** -- A radar/spider chart comparing user's skills vs market demand for their target role. Uses existing resume_data skills.

4. **Weekly Career Insights** -- AI-generated tips based on user's profile (target role, skills, score). Fresh content each visit using existing AI edge functions.

5. **Competitive Position** -- "Your resume ranks in the top X% of applicants for [target role]" with animated progress bar.

6. **Quick Actions Grid** -- "Improve ATS Score", "Practice Interview", "Update Resume", "Find Jobs" -- links to other pages.

7. **Achievement Wall** -- Expanded badges/gamification showing career milestones.

### Technical approach:
- New file: `src/pages/Analysis.tsx`
- New route: `/analysis` (protected)
- Data source: User's resumes from DB + client-side calculations
- Reuses existing components: `ATSGauge`, `GamificationBadges`, `TiltCard`
- No new edge functions or DB changes needed

---

## Part 2: UI Enhancements Across Pages

### Pages to upgrade:

**Pricing.tsx** -- Add TiltCard wrappers to plan cards, glassmorphism backgrounds, 3D perspective on popular plan, particles background, animated section reveals.

**About.tsx** -- Add TiltCard to timeline items, glassmorphism cards, floating particles, cinematic section transitions.

**Auth.tsx** -- Premium dark glass card, animated background, subtle glow effects, gold accent on form focus states.

**Navbar.tsx** -- Update brand from "ProfileX" to "ResumeCracker", add Analysis link to nav items.

### Technical approach:
- Import `TiltCard` into each page
- Add glass/glass-gold classes to existing cards
- Add `motion.div` wrappers with `whileInView` animations
- Add particle backgrounds to key sections
- Consistent border-shine effects

---

## Files Summary

| File | Action |
|------|--------|
| `src/pages/Analysis.tsx` | Create -- Career Analysis hub page |
| `src/App.tsx` | Add `/analysis` route |
| `src/components/layout/Navbar.tsx` | Add Analysis link, update brand to ResumeCracker |
| `src/pages/Pricing.tsx` | Add TiltCard, glassmorphism, 3D depth |
| `src/pages/About.tsx` | Add TiltCard, cinematic motion |
| `src/pages/Auth.tsx` | Premium dark glass styling |

### No database changes. No new edge functions. No new dependencies.

---

## Implementation Order
1. Create Analysis page with all sections
2. Add route + nav link
3. Enhance Pricing, About, Auth pages with 3D effects
4. Update brand name in Navbar

