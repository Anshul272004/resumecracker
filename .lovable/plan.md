

# Ultra-Premium UI + Interviewer Intelligence + Missing Features Upgrade

## What We're Building

A massive upgrade across 3 pillars: (1) Interviewer Social Intelligence System, (2) Cinematic "WOW" first experience, and (3) Missing critical features that make users come back daily.

---

## Pillar 1: Interviewer Social Media Intelligence (InterviewPrep.tsx)

Enhance the existing "Know Your Interviewer" section with a deep social scan system.

**New Section: "Interviewer Profiler"** -- when user knows their interviewer:
- Input field for interviewer name + company
- AI scans LinkedIn, Twitter/X, Instagram, Facebook via Firecrawl search
- Generates a **Personality Decoder Card** with:
  - Communication style (formal/casual/technical)
  - Topics they post about (AI, startups, leadership, etc.)
  - Likes/dislikes inferred from posts
  - Weak points to avoid triggering
  - "Instant Like" strategies (shared interests, compliments that work)
  - Dress code recommendation based on company culture
  - Recommended opening lines personalized to interviewer

**When user doesn't know interviewer:**
- AI researches the company culture via Firecrawl
- Generates generic personality archetypes for that company
- Dress code, tone, and strategy based on company DNA

**Edge function update:** Expand `ai-interviewer-research` prompt to return structured personality analysis with likes, dislikes, communication style, and strategic recommendations.

---

## Pillar 2: Cinematic "WOW" First Experience

### A. Entry Sequence (LandingPage.tsx)
Add a one-time cinematic intro overlay (stored in localStorage):
- Dark screen with animated text sequence:
  - "Analyzing your career potential..."
  - "Scanning global job market..."
  - "Comparing with top 1% candidates..."
- Gold particle burst transition into the hero
- Skip button available

### B. Personal Identity System (Dashboard.tsx)
Add an onboarding modal on first visit (before wizard):
- "What is your career goal?" (dropdown: Get job, Switch career, Promotion, Fresher)
- "Target role?" (text input)
- "Target salary?" (range slider)
- "Target country?" (dropdown)
- Save to profiles table, personalize all subsequent content

### C. Emotional Impact Messaging
Add throughout the platform:
- "You are closer than 82% of candidates" (Analysis page)
- "Your resume ranks in the top X%" (Dashboard)
- Progress celebrations with subtle gold glow animations

---

## Pillar 3: Missing Critical Features

### A. Career Intelligence Dashboard (Analysis.tsx enhancement)
- **Career Score**: Composite of ATS + skills + experience = Career Score /100
- **Market Demand Indicator**: "High/Medium/Low" for target role
- **Growth Potential**: Based on skills trajectory
- **Competitive Position**: "Top X% of applicants"

### B. Daily/Weekly Return Triggers (Analysis.tsx)
- "New jobs matched for you this week" counter
- "Your field demand increased by X%"
- "Your resume improved by X% since last visit"
- Fresh AI insight generated each visit

### C. Career Path Predictor (new section in Analysis.tsx)
- "If you learn Python + AI: Salary up 2.5x in 2 years"
- Visual timeline showing career progression predictions

### D. Skill Gap Analyzer Enhancement (Analysis.tsx)
- "To reach top 10%, learn: System Design, Cloud, DSA"
- Visual progress bars for each skill gap

---

## Database Changes

Add columns to `profiles` table:
```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS career_goal text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS target_role text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS target_salary_min integer;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS target_salary_max integer;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS target_country text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_complete boolean DEFAULT false;
```

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/pages/InterviewPrep.tsx` | Add Interviewer Profiler section with social scan UI |
| `src/pages/LandingPage.tsx` | Add cinematic entry overlay sequence |
| `src/pages/Dashboard.tsx` | Add onboarding modal with career goals |
| `src/pages/Analysis.tsx` | Add Career Score, Market Demand, Career Path Predictor, return triggers |
| `supabase/functions/ai-interviewer-research/index.ts` | Expand prompt for personality analysis + strategy |
| `src/components/CinematicIntro.tsx` | New -- animated intro overlay component |
| `src/components/OnboardingModal.tsx` | New -- career goal collection modal |

### 1 database migration (profiles columns)
### 1 edge function update (ai-interviewer-research)
### No new dependencies needed

---

## Implementation Order
1. Database migration (add profile columns)
2. Cinematic intro component + landing page integration
3. Onboarding modal + dashboard integration
4. Interviewer Social Intelligence system
5. Analysis page enhancements (Career Score, return triggers, career path)
6. Edge function prompt expansion

