

# Remaining RAPS Phases Implementation Plan

## Status Check
- Phase 1 (Real Data Pipeline): Done
- Phase 2 (LinkedIn/Portfolio + AI Keywords): Done
- **Phase 3 (ATS Simulator + Resume Versions): TODO**
- **Phase 4 (Gamification + Progress): TODO**
- **Phase 5 (Job Match Finder): TODO**
- **Phase 6 (Live AI Suggestions in Editor): TODO**

---

## Phase 3: ATS Simulator + Resume Versions

### ATS Simulator (add to Results.tsx)
New section after `ATSAlgorithmBreakdown` simulating 3 ATS platforms:
- **Greenhouse, Workday, Lever** -- each gets a pass/fail card with specific feedback
- Data derived from existing `atsScore` + `keywordSuggestions` + static rules per platform (section header naming, keyword placement, formatting)
- No new edge function needed -- pure client-side logic using existing AI data

### Resume Version Generator (add to ResumeBuilder.tsx)
- New edge function `ai-resume-versions` that takes resume data and generates 4 tonal variants (ATS, Creative, Startup, Corporate)
- "Generate Versions" button in ResumeBuilder toolbar
- Each version stored in state, selectable via tabs
- Add to `supabase/config.toml`

**Files**: `src/pages/Results.tsx`, `src/pages/ResumeBuilder.tsx`, new `supabase/functions/ai-resume-versions/index.ts`, `supabase/config.toml`

---

## Phase 4: Gamification & Progress

All client-side calculation (no DB migration needed -- simpler than planned):
- **Points** calculated from: wizard steps completed, resume generated, interview questions solved, ATS score achieved
- **Resume Strength Meter** in Dashboard wizard -- real-time progress bar based on filled fields
- **Badges** on Dashboard hub: "First Resume", "Interview Starter", "ATS Master", "Streak Champion" -- derived from existing DB data
- **Urgency message**: "Your resume is stronger than X% of applicants" based on ATS score

**Files**: `src/pages/Dashboard.tsx`

---

## Phase 5: Job Match Finder

- New page `src/pages/JobMatch.tsx` (protected route)
- User's skills extracted from their latest resume in DB
- Uses `firecrawlApi.search()` to find matching jobs
- New edge function `ai-job-match` ranks results by skill match %
- Shows: job title, company, match score, missing skills, apply link
- Add route to `src/App.tsx`, add CTA to Dashboard hub

**Files**: new `src/pages/JobMatch.tsx`, `src/App.tsx`, new `supabase/functions/ai-job-match/index.ts`, `supabase/config.toml`

---

## Phase 6: Live AI Suggestions in Resume Editor

- Load real resume data from DB instead of hardcoded `resumeData` in ResumeBuilder
- Add AI suggestions sidebar: "Improve Bullet" per bullet, "Add Missing Keywords", "Rewrite Summary"
- Uses existing `ai-optimize-resume` function for bullet improvements
- Real-time ATS score recalculation as user edits

**Files**: `src/pages/ResumeBuilder.tsx`

---

## Implementation Order (this message)
1. Phase 3: ATS Simulator in Results + Resume Versions edge function + UI
2. Phase 4: Gamification badges/points/strength meter in Dashboard
3. Phase 5: Job Match Finder page + edge function + route
4. Phase 6: Live AI suggestions in ResumeBuilder

This is a multi-message implementation. I'll start with Phases 3 and 4 in this message, then continue with 5 and 6.

