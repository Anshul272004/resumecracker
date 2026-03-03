
# ProfileX Viral Upgrade -- Remaining Tasks Implementation

## What We're Building

Three major changes to complete the remaining tasks from the approved plan:

1. **Fix the hero typewriter text to stay on one line** (prevents layout shift / uncertainty)
2. **Wire up real Firecrawl interviewer research** (connect Firecrawl, replace mock data)
3. **Wire up AI edge functions to Dashboard and InterviewPrep** (replace fake timer and regex scoring)
4. **Add data persistence** (save/load resumes and interview progress from database)
5. **Personalized Dashboard hub** (streak, saved resumes, stats)

---

## Task 1: Fix Hero Typewriter to Single Line

**Problem**: The typewriter text ("Stop Getting Rejected.", "Start Getting Shortlisted.", etc.) changes height as text length varies, causing layout shift -- which creates uncertainty.

**Fix in `src/pages/LandingPage.tsx`**:
- Set a fixed `min-height` on the h1 element so the container never shifts
- Alternatively, use CSS to constrain to `white-space: nowrap` with a fixed container height
- The h1 gets a fixed height matching the tallest text, so the layout stays rock-solid

---

## Task 2: Connect Firecrawl for Real Interviewer Research

**Step 1**: Use the Firecrawl connector to link it to the project (will prompt user to set up connection)

**Step 2**: Create two edge functions:
- `supabase/functions/firecrawl-search/index.ts` -- Web search for interviewer profiles (LinkedIn, social media)
- `supabase/functions/firecrawl-scrape/index.ts` -- Scrape profile pages for content

**Step 3**: Create `supabase/functions/ai-interviewer-research/index.ts`:
- Takes scraped data from Firecrawl
- Uses Lovable AI (gemini-3-flash-preview) to analyze and generate: personality insights, likely question patterns, communication style tips, topics they care about
- Returns structured JSON via tool calling

**Step 4**: Create `src/lib/api/firecrawl.ts` -- Frontend API wrapper

**Step 5**: Update `src/pages/InterviewPrep.tsx`:
- Replace `handleResearchInterviewer` mock setTimeout with real pipeline:
  1. Search interviewer name via firecrawl-search
  2. If LinkedIn URL provided, scrape it via firecrawl-scrape
  3. Pass results to ai-interviewer-research for AI analysis
  4. Display real insights instead of fake data

---

## Task 3: Wire AI to Dashboard Generate Step

**Update `src/pages/Dashboard.tsx`**:
- In `handleGenerate()`, replace the fake timer with a real call to `aiApi.optimizeResume()`
- Collect all form data (profile, projects, target role, job description) and send to the edge function
- Show real generation stages as the AI processes
- On completion, save the result to the `resumes` table and navigate to `/results` with the resume ID
- Handle errors (rate limit, payment required) with toast notifications

---

## Task 4: Wire AI Answer Rating to InterviewPrep

**Update `src/pages/InterviewPrep.tsx` -- AnswerRater component**:
- Replace the regex-based `rateAnswer()` function with a call to `aiApi.rateAnswer()`
- Show a loading spinner while AI processes
- Display the AI's structured feedback (score, categories, specific feedback, improved answer)
- Keep the current regex as an instant fallback if AI fails

---

## Task 5: Data Persistence -- Save/Load from Database

**Dashboard (`src/pages/Dashboard.tsx`)**:
- On component mount, check for existing resumes in the database
- Show a "resume picker" if user has saved resumes (edit existing or create new)
- Auto-save resume data to the `resumes` table on each step change
- After AI generation, save the optimized result with ATS score

**InterviewPrep (`src/pages/InterviewPrep.tsx`)**:
- On mount, load question status and bookmarks from `interview_progress` table
- On markSolved/markAttempted/toggleBookmark, save to database
- Fallback to local state if user is not logged in

---

## Task 6: Personalized Dashboard Hub

**Add a "home view" to Dashboard before the wizard**:
- If user has saved resumes, show a personalized greeting + resume cards
- Show interview prep stats (X/23 solved, difficulty breakdown)
- Streak counter from `profiles.streak_count` and `last_active`
- Quick action cards: "New Resume", "Continue Editing", "Interview Prep"
- "Start New Resume" button enters the wizard flow

---

## Technical Details

### Files to Create (5 new):
1. `supabase/functions/firecrawl-search/index.ts`
2. `supabase/functions/firecrawl-scrape/index.ts`
3. `supabase/functions/ai-interviewer-research/index.ts`
4. `src/lib/api/firecrawl.ts`

### Files to Modify (4 existing):
1. `src/pages/LandingPage.tsx` -- Fix typewriter single-line
2. `src/pages/Dashboard.tsx` -- AI generation + DB persistence + personalized hub
3. `src/pages/InterviewPrep.tsx` -- AI answer rating + Firecrawl research + DB persistence
4. `supabase/config.toml` -- Add new edge function entries

### Connector Required:
- **Firecrawl** -- Will prompt user to connect (provides `FIRECRAWL_API_KEY` for edge functions)

### Implementation Order:
1. Fix typewriter (quick win, instant visual improvement)
2. Connect Firecrawl connector
3. Create Firecrawl edge functions + AI interviewer research function
4. Wire AI to Dashboard and InterviewPrep
5. Add database persistence
6. Build personalized Dashboard hub
