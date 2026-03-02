

# ProfileX Full-Stack Viral Upgrade -- Complete Implementation Plan

## Vision
Transform ProfileX from a static frontend into a full-stack, AI-powered, personalized career platform that users come back to daily -- like their personal career command center. Apply proven viral patterns from Apple (simplicity + premium feel), Duolingo (streaks + gamification), LinkedIn (personalization + FOMO), and Product Hunt (social proof + urgency).

---

## Phase 1: Database Foundation

Create all tables via a single database migration:

**Tables:**
- `profiles` -- id (uuid, FK auth.users), full_name, avatar_url, plan (free/starter/pro/elite), streak_count, last_active, created_at, updated_at
- `resumes` -- id, user_id, title, template_name, accent_color, font_size, font_family, resume_data (jsonb), job_description, target_role, target_company, ats_score, created_at, updated_at
- `interview_progress` -- id, user_id, question_id (int), status (text), bookmarked (bool), user_answer (text), score (int), created_at
- `payments` -- id, user_id, plan, amount, currency, stripe_session_id, status, created_at

**Auto-create profile trigger** on auth.users insert.
**RLS policies** on all tables: users can only CRUD their own data.

---

## Phase 2: Authentication System

**New files:**
- `src/pages/Auth.tsx` -- Premium login/signup page (email + password) with gold-themed glassmorphism design, animated background particles, social proof ("15,000+ professionals trust ProfileX")
- `src/pages/ResetPassword.tsx` -- Password reset page with new password form, handles `type=recovery` URL hash
- `src/contexts/AuthContext.tsx` -- Auth state provider using `onAuthStateChange` + `getSession`, exposes user/session/loading/signIn/signUp/signOut
- `src/components/ProtectedRoute.tsx` -- Redirects to `/auth` if not logged in

**Modifications:**
- `src/App.tsx` -- Wrap with AuthProvider, add `/auth`, `/reset-password`, `/checkout`, `/payment-success`, `/payment-failed` routes. Protected routes for `/dashboard`, `/resume-builder`, `/results`
- `src/components/layout/Navbar.tsx` -- Show user avatar + logout when logged in, "Sign In" button when logged out. Personalized greeting: "Hey, Priya" with gold accent

---

## Phase 3: AI Edge Functions (Lovable AI -- No External Keys)

Three backend functions using `LOVABLE_API_KEY` (already configured) with `google/gemini-3-flash-preview`:

**1. `supabase/functions/ai-optimize-resume/index.ts`**
- Input: resume data, target role, job description
- AI prompt: "You are an elite career consultant. Optimize these resume bullet points for ATS compatibility, add quantified metrics, apply cognitive biases (Halo Effect, Anchoring, Von Restorff). Return JSON with: optimized_bullets, keyword_suggestions, ats_score, psychology_tips, cover_letter_draft"
- Uses tool calling for structured JSON output
- Replaces the fake timer in Dashboard step 5

**2. `supabase/functions/ai-rate-answer/index.ts`**
- Input: question, user's answer, ideal answer
- AI rates on 4 categories: Structure, Impact Language, Specificity, Psychology
- Returns score, category breakdown, specific actionable feedback
- Replaces regex-based scoring in InterviewPrep

**3. `supabase/functions/ai-cover-letter/index.ts`**
- Input: resume data, job description, target company
- Generates personalized cover letter with company-specific hooks
- Used in Resume Builder cover letter tab

**Frontend wrapper: `src/lib/api/ai.ts`** -- Helper functions to invoke each edge function via supabase.functions.invoke()

---

## Phase 4: Firecrawl Connector for Interviewer Research

Connect Firecrawl for real social media research (replaces mock data in InterviewPrep):

**Steps:**
1. Use `connect` tool to link Firecrawl connector (provides `FIRECRAWL_API_KEY`)
2. Create edge functions:
   - `supabase/functions/firecrawl-search/index.ts` -- Search web for interviewer profiles
   - `supabase/functions/firecrawl-scrape/index.ts` -- Scrape LinkedIn/social profiles for insights
3. Create `src/lib/api/firecrawl.ts` -- Frontend API wrapper
4. Create `supabase/functions/ai-interviewer-research/index.ts` -- Takes scraped data, uses Lovable AI to generate: personality insights, likely question patterns, communication style tips, topics they care about

**InterviewPrep update:** Replace `handleResearchInterviewer` mock function with real Firecrawl search + AI analysis pipeline

---

## Phase 5: Payment & Checkout Pages (UI Ready)

**New files:**
- `src/pages/Checkout.tsx` -- Plan summary, coupon code input (STUDENT30 = 30% off), order total, "Pay Now" button (shows "Coming Soon -- Stripe integration pending" modal until Stripe key is added). Premium glassmorphism design with plan comparison
- `src/pages/PaymentSuccess.tsx` -- Confetti animation, "Welcome to [Plan]!" message, next steps, auto-upgrade profile plan in database
- `src/pages/PaymentFailed.tsx` -- Retry button, support contact, troubleshooting tips

**Pricing page update:** CTA buttons link to `/checkout?plan=starter` etc. Show "Login to continue" if not authenticated.

---

## Phase 6: Dashboard Upgrade -- Personalized Hub

Transform Dashboard from a simple form wizard into a personal career command center:

**After login, show:**
- Personalized greeting with streak counter: "Hey Priya -- Day 7 streak"
- Saved resumes list (from database) with quick actions (edit, duplicate, delete)
- Interview prep stats card (X/23 solved, difficulty breakdown)
- Quick action cards: New Resume, Continue Editing, Interview Prep, View Results
- Recent activity timeline

**Resume persistence:**
- Save resume data to `resumes` table on each Dashboard step change
- Load existing resume when returning
- "New Resume" creates a fresh entry

---

## Phase 7: Interview Progress Persistence

- On marking solved/attempted, save to `interview_progress` table
- On bookmark toggle, save to database
- Load progress from database on page load (if logged in)
- Fallback to localStorage if not logged in
- Streak calculation from consecutive days with interview_progress entries

---

## Phase 8: Viral Patterns & Personalization Hooks

These are the proven patterns from viral websites applied throughout:

**1. Personalization (Netflix/Spotify pattern):**
- Greeting with user's name everywhere
- "Resume optimized for [target role] at [target company]" -- makes it feel custom
- Daily Challenge in Interview Prep changes based on user's weak areas

**2. Streak & Gamification (Duolingo pattern):**
- Practice streak counter on Dashboard and Interview Prep
- "Don't break your streak!" notification-style banner
- Progress badges: "5 Questions Solved", "First Resume Created", "7-Day Streak"

**3. Social Proof & FOMO (Product Hunt pattern):**
- Live activity ticker (already exists, enhanced)
- "127 people are building resumes right now" -- real-time feel
- "Priya from Bangalore just scored 94% ATS" -- creates urgency

**4. Before/After Transformation (Apple pattern):**
- Already exists in Results page -- enhanced with smoother animations
- Side-by-side resume preview (before vs after) with swipe gesture

**5. Exit Intent & Re-engagement:**
- Email capture section (already exists on landing page)
- "Your resume is 80% complete -- finish it now" banner for returning users

**6. Premium Micro-interactions:**
- Gold shimmer effect on CTA buttons
- Smooth page transitions using framer-motion layout animations
- Confetti on achievements (question solved, resume downloaded)
- Haptic-feel hover states on all interactive elements

---

## Technical Implementation Order

### Files to Create (11 new files):
1. `src/pages/Auth.tsx`
2. `src/pages/ResetPassword.tsx`
3. `src/pages/Checkout.tsx`
4. `src/pages/PaymentSuccess.tsx`
5. `src/pages/PaymentFailed.tsx`
6. `src/contexts/AuthContext.tsx`
7. `src/components/ProtectedRoute.tsx`
8. `src/lib/api/ai.ts`
9. `supabase/functions/ai-optimize-resume/index.ts`
10. `supabase/functions/ai-rate-answer/index.ts`
11. `supabase/functions/ai-cover-letter/index.ts`

### Files to Create (Firecrawl -- after connector):
12. `supabase/functions/firecrawl-search/index.ts`
13. `supabase/functions/firecrawl-scrape/index.ts`
14. `supabase/functions/ai-interviewer-research/index.ts`
15. `src/lib/api/firecrawl.ts`

### Files to Modify (6 existing files):
1. `src/App.tsx` -- AuthProvider wrapper, new routes, protected routes
2. `src/components/layout/Navbar.tsx` -- Auth-aware (login/logout/avatar)
3. `src/pages/Dashboard.tsx` -- Database persistence, personalized hub
4. `src/pages/InterviewPrep.tsx` -- AI rating, Firecrawl research, DB persistence
5. `src/pages/Pricing.tsx` -- Link CTAs to checkout, auth check
6. `src/pages/ResumeBuilder.tsx` -- Load/save resume from database

### Database: 1 migration with all tables + RLS + trigger
### Edge Functions: 6 total (3 AI + 2 Firecrawl + 1 AI research)
### Connector: Firecrawl (will prompt for connection)

---

## What's Deferred (needs external API keys):
- Stripe payment processing (needs Stripe key via connector)
- Perplexity AI search (needs Perplexity connector)
- Google OAuth login (needs configuration)

