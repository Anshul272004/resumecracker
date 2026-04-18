
The user wants me to enhance every aspect of ResumeCracker. Looking at current state: LandingPage got the cinematic treatment, but Dashboard, Analysis, InterviewPrep, ResumeBuilder, Results, JobMatch, Pricing, About, Auth all need the same ultra-premium polish. Plus add new high-value features. User is on 360px viewport so mobile-first matters.

Let me propose a comprehensive enhancement across UI + features + interactions.

# Total Platform Enhancement — Every Page, Every Aspect

## Pillar 1: Universal Cinematic Polish (Apply to ALL pages)

Bring the landing page's luxury treatment to every internal page so the whole product feels like one cinematic experience.

**Apply across Dashboard, Analysis, InterviewPrep, ResumeBuilder, Results, JobMatch, Pricing, About, Auth, Checkout:**
- Page entrance animation (fade + reveal-up on mount)
- Blueprint grid background on hero sections
- Luxury dividers between major sections
- Glass-gold-deep cards replacing plain cards
- Border-shine effect on key CTAs
- Animated number counters wherever stats appear
- Gold pulse on primary action buttons
- Floating gentle motion on hero icons
- Scroll-triggered reveals on cards (staggered)
- Premium loading skeletons with gold shimmer

## Pillar 2: Page-Specific Enhancements

**Dashboard.tsx** — Add a "Career Command Center" hero with: animated greeting based on time of day, current Career Score gauge, 3 quick-stat cards (resumes built, interview practice hours, jobs matched), recent activity timeline, "Daily Mission" card with a single actionable task.

**Analysis.tsx** — Add live "Market Pulse" ticker (trending skills, hot roles), "Resume Evolution" before/after slider, "Peer Comparison" radar overlay, "Action Plan" prioritized checklist with estimated score impact per task.

**InterviewPrep.tsx** — Add "Confidence Meter" tracking practice sessions, "Power Poses" tip cards, real-time speech analysis indicators (filler words, pace), "Mock Interview Replay" with AI scoring breakdown.

**ResumeBuilder.tsx** — Add live ATS preview side panel that updates per keystroke, "Inspiration Drawer" with phrases from top resumes, "Tone Selector" (executive/creative/technical), keyboard shortcut palette.

**Results.tsx** — Add cinematic score reveal animation, share-to-social preview cards, downloadable "Career Report" PDF teaser, comparison vs last version.

**JobMatch.tsx** — Add "Match Heatmap" visualizing skill overlap, "Apply Strategy" personalized cover letter angles, "Salary Range" estimator per match.

**Pricing.tsx** — Add "Value Calculator" (estimated salary boost vs price), animated feature comparison, testimonial carousel per tier, FAQ accordion with luxury styling.

**About.tsx** — Add cinematic mission video placeholder, founder story timeline, press logos marquee, "Our Promise" manifesto section.

**Auth.tsx** — Add split-screen with cinematic right panel (rotating success quotes), social proof counter ("Joined by 12,847 professionals"), micro-illustrations.

## Pillar 3: New Cross-Cutting Features

**Global Command Palette (Cmd+K)** — Quick navigation, jump to any page, run AI actions (optimize, score, generate cover letter), search resumes — accessible from anywhere.

**Notification Center** — Bell icon in navbar opens slide-over panel with: new job matches, score improvements, weekly insights, achievement unlocks.

**Achievement & Streak System** — Daily login streak counter, milestone badges (first resume, 10 interview practices, 90+ ATS), confetti on unlocks.

**AI Career Coach Chat Widget** — Floating bottom-right chat bubble, opens premium glass chat panel, contextual to current page, uses existing Lovable AI.

**Theme Refinements** — Add subtle ambient gold particle layer to all authenticated pages, premium cursor trail on desktop, smoother route transitions.

## Pillar 4: Micro-Interactions & Polish

- Button hover: gold ripple effect
- Card hover: tilt + glow lift
- Input focus: gold underline grows from center
- Tab switch: gold indicator slides
- Toast notifications: glass-gold styling with slide-in-right-bounce
- Form success: gold checkmark draw animation
- Page transitions: subtle gold light streak

## Files to Modify/Create

| File | Action |
|------|--------|
| `src/pages/Dashboard.tsx` | Add Command Center hero, daily mission, activity timeline |
| `src/pages/Analysis.tsx` | Add Market Pulse, Resume Evolution, Peer Comparison, Action Plan |
| `src/pages/InterviewPrep.tsx` | Add Confidence Meter, Mock Replay, Power Poses |
| `src/pages/ResumeBuilder.tsx` | Add live ATS panel, Inspiration Drawer, Tone Selector |
| `src/pages/Results.tsx` | Cinematic score reveal, share cards, comparison |
| `src/pages/JobMatch.tsx` | Match Heatmap, Apply Strategy, Salary estimator |
| `src/pages/Pricing.tsx` | Value Calculator, animated comparison, FAQ |
| `src/pages/About.tsx` | Mission section, timeline, press marquee |
| `src/pages/Auth.tsx` | Split-screen with rotating quotes |
| `src/components/CommandPalette.tsx` | New — global Cmd+K palette |
| `src/components/NotificationCenter.tsx` | New — slide-over notifications |
| `src/components/AICoachWidget.tsx` | New — floating chat coach |
| `src/components/StreakCounter.tsx` | New — daily streak badge |
| `src/components/layout/Navbar.tsx` | Add bell + streak + Cmd+K hint |
| `src/components/ui/AnimatedCounter.tsx` | New — reusable counter |
| `src/components/ui/PageTransition.tsx` | New — route transition wrapper |
| `src/index.css` | Add ripple, cursor trail, success draw, gold underline |
| `src/App.tsx` | Mount CommandPalette + AICoachWidget globally |

## Database Changes
Add `streaks` table (user_id, current_streak, longest_streak, last_active_date) and `notifications` table (user_id, type, title, body, read, created_at) with RLS policies.

## Edge Functions
New `ai-career-coach` for the floating chat widget, contextual to current page.

## No new dependencies — all using existing stack (framer-motion, three, recharts, shadcn).

## Implementation Order
1. Database migration (streaks + notifications tables)
2. Reusable components (AnimatedCounter, PageTransition, CSS micro-interactions)
3. Global features (CommandPalette, NotificationCenter, AICoachWidget, StreakCounter, Navbar updates)
4. Dashboard cinematic upgrade
5. Analysis page enhancements
6. InterviewPrep + ResumeBuilder + Results upgrades
7. JobMatch + Pricing + About + Auth upgrades
8. AI career coach edge function
