

# RAPS Engine & Career Intelligence Platform Upgrade

This is a large-scope enhancement. I'll prioritize the highest-impact, technically feasible features given your React + Supabase Edge Functions stack, broken into 6 implementation phases.

---

## What Already Exists vs What's New

**Already built**: Resume wizard (6 steps), AI optimization via Gemini, ATS scoring, skill gap analysis, project reframing, interview prep (23 questions + AI rater + interviewer research), cover letter generation, keyword density, psychology insights, recruiter eye simulation, streak tracking.

**Key gaps to fill**: Real JD keyword extraction (currently hardcoded), Results page using real AI data (currently all mock), LinkedIn/portfolio input, ATS simulator (Greenhouse/Workday/Lever), resume version generator, gamification scoring, job match finder, live AI suggestions in editor.

---

## Phase 1: Real RAPS Pipeline -- Connect AI Data End-to-End

**Problem**: The Results page shows hardcoded mock data. The Dashboard wizard extracts hardcoded keywords. The AI generates real data but it's not passed through to Results or ResumeBuilder.

**Fix**:
- Store AI optimization results in `resumes.resume_data.optimized` (already happening) and pass them to Results page via URL state or by loading from DB
- Update `Results.tsx` to load the user's latest resume from DB and display real `optimized_bullets`, `keyword_suggestions`, `ats_score`, `psychology_tips`, and `cover_letter_draft`
- Update Dashboard Step 3 (JD paste) to call a lightweight AI extraction for real keyword preview instead of hardcoded tags

**Files**: `src/pages/Results.tsx`, `src/pages/Dashboard.tsx`

---

## Phase 2: Enhanced Dashboard Wizard -- LinkedIn & Portfolio Input

**Add to Step 0 (Upload)**:
- LinkedIn profile URL input field
- Portfolio/GitHub link input field
- Store these in resume_data for AI context

**Add to Step 3 (Job Description)**:
- "Paste LinkedIn Job URL" option that uses Firecrawl to scrape the JD automatically
- Real-time keyword extraction using a new lightweight edge function `ai-extract-keywords`

**Files**: `src/pages/Dashboard.tsx`, new edge function `supabase/functions/ai-extract-keywords/index.ts`

---

## Phase 3: ATS Simulator & Resume Versions

**ATS Simulator** (new section in Results page):
- Simulate how 3 major ATS systems (Greenhouse, Workday, Lever) would parse the resume
- Show pass/fail for each with specific reasons (formatting, keyword placement, section headers)
- Use AI to generate ATS-specific feedback via the existing `ai-optimize-resume` function with an extended prompt

**Resume Version Generator** (new feature in ResumeBuilder):
- Add a "Generate Versions" button that creates 4 variants: ATS-Optimized, Creative, Startup-Focused, Corporate
- Each version adjusts tone, keyword density, and formatting emphasis
- New edge function `ai-resume-versions` that takes base resume data and generates 4 variants

**Files**: `src/pages/Results.tsx`, `src/pages/ResumeBuilder.tsx`, new edge function `supabase/functions/ai-resume-versions/index.ts`

---

## Phase 4: Gamification & Progress System

**Point system** (client-side calculation from existing DB data):
- +10 points for adding metrics to bullets
- +15 points for matching a JD keyword
- +5 points for each completed wizard step
- +20 points for solving an interview question
- +50 points for generating a resume

**Resume Strength Meter** (real-time in Dashboard wizard):
- Progress bar showing resume strength as user fills in data (45% → 72% → 91%)
- Urgency message: "Your resume is weaker than X% of applicants"

**Visual badges on Dashboard hub**:
- "First Resume", "Interview Starter", "ATS Master", "Streak Champion"

**Files**: `src/pages/Dashboard.tsx`, `src/pages/Results.tsx`

---

## Phase 5: Job Match Finder

**New page**: `src/pages/JobMatch.tsx`
- User's resume skills are extracted from their saved resume
- Use Firecrawl search to find matching jobs from the web
- AI ranks results by skill match percentage
- Show: Job title, company, match score, missing skills, link to apply

**Implementation**:
- New route `/job-match` (protected)
- Uses existing `firecrawlApi.search()` to find jobs
- New edge function `ai-job-match` to analyze and rank results
- Add "Find Matching Jobs" CTA to Dashboard hub and Results page

**Files**: new `src/pages/JobMatch.tsx`, `src/App.tsx`, new `supabase/functions/ai-job-match/index.ts`

---

## Phase 6: Live AI Suggestions in Resume Editor

**Enhance ResumeBuilder** with a right-side AI assistant panel:
- "Improve Bullet" button on each bullet point
- "Add Missing Keywords" suggestions
- "Rewrite Summary" one-click action
- Real-time ATS score update as user edits

**Implementation**: The ResumeBuilder currently uses hardcoded `resumeData`. Connect it to load from DB (the user's saved resume with AI-optimized data) and add an AI suggestions sidebar.

**Files**: `src/pages/ResumeBuilder.tsx`

---

## Database Changes

**Migration needed**: Add `points` column to `profiles` table for gamification:
```sql
ALTER TABLE public.profiles ADD COLUMN points integer NOT NULL DEFAULT 0;
```

---

## New Edge Functions (3)

1. `ai-extract-keywords` -- Lightweight JD keyword extraction for real-time preview
2. `ai-resume-versions` -- Generate 4 resume variants (ATS/Creative/Startup/Corporate)
3. `ai-job-match` -- Analyze and rank job search results by skill match

All use the existing Lovable AI gateway with Gemini models. No new API keys needed.

---

## Implementation Order

1. Phase 1 (Real data pipeline) -- most critical, everything else depends on it
2. Phase 2 (LinkedIn/portfolio + real keyword extraction)
3. Phase 4 (Gamification -- quick wins, high engagement)
4. Phase 3 (ATS Simulator + Resume Versions)
5. Phase 5 (Job Match Finder)
6. Phase 6 (Live AI suggestions in editor)

Total files to create/modify: ~10 files across 6 phases. This is a multi-message implementation due to scope.

