

# ProfileX Full-Stack Upgrade -- No API Key Required

Everything that does NOT need an external API key, built using Lovable Cloud + Lovable AI models.

---

## Phase 1: Database Schema

Create these tables with proper RLS policies:

**profiles** -- User profile data linked to auth
- id (uuid, FK to auth.users), full_name, avatar_url, plan (free/starter/pro/elite), created_at, updated_at

**resumes** -- Saved resumes per user  
- id, user_id (FK profiles), title, template_name, accent_color, font_size, font_family, resume_data (jsonb), job_description, target_role, target_company, ats_score, created_at, updated_at

**interview_progress** -- Track solved/attempted/bookmarked questions
- id, user_id, question_id (int), status (solved/attempted/unsolved), bookmarked (bool), user_answer (text), score (int), created_at

**payments** -- Payment records
- id, user_id, plan, amount, currency, stripe_session_id, status (pending/completed/failed), created_at

**Auto-create profile trigger** -- On auth.users insert, auto-create a profiles row

All tables get RLS policies: users can only read/update their own data.

---

## Phase 2: Authentication System

**New pages:**
- `/auth` -- Login/Signup page with email + password (Google OAuth later)
- `/reset-password` -- Password reset page

**Auth features:**
- Email + password signup (email verification required)
- Login with email + password
- Forgot password flow
- Protected routes -- redirect to /auth if not logged in for /dashboard, /resume-builder, /results
- Auth context provider wrapping the app
- Logout button in Navbar (when logged in)

---

## Phase 3: AI Resume Optimizer (Lovable AI -- No API Key)

**New edge function: `ai-optimize-resume`**
- Uses Lovable AI (google/gemini-2.5-flash) via LOVABLE_API_KEY (already configured)
- Input: user's resume data, target role, job description
- Output: optimized bullet points, keyword suggestions, ATS score, psychology tips
- Called from Dashboard step 5 "Generate" instead of fake timer

**New edge function: `ai-rate-answer`**
- Uses Lovable AI to rate interview answers properly (instead of regex-based scoring)
- Input: question, user's answer, ideal answer
- Output: score, category breakdown, specific feedback

**New edge function: `ai-cover-letter`**
- Generates personalized cover letter using Lovable AI
- Input: resume data, job description, target company

---

## Phase 4: Dashboard Upgrade

**After login, Dashboard shows:**
- User's saved resumes list (from database)
- Interview prep stats (from interview_progress table)
- Quick actions: New Resume, Continue Editing, Interview Prep
- Practice streak counter (calculated from interview_progress dates)

**Resume data persistence:**
- Save resume data to database on each step
- Load existing resume when returning to dashboard
- Multiple resumes support (create new / edit existing)

---

## Phase 5: Payment & Checkout Pages

**New page: `/checkout`**
- Plan selection summary
- Payment form UI (ready for Stripe -- shows "Coming Soon" until Stripe key is added)
- Coupon code input (STUDENT30)
- Order summary with pricing

**Pricing page update:**
- CTA buttons link to /checkout?plan=starter etc.
- Show "Login required" if not authenticated

**Payment success/failure pages:**
- `/payment-success` -- Thank you page with confetti
- `/payment-failed` -- Retry page

---

## Phase 6: Save Interview Progress to Database

- When user marks question as solved/attempted, save to interview_progress table
- When user bookmarks a question, save to database
- Load progress from database on page load (if logged in)
- Fallback to localStorage if not logged in

---

## Technical Details

### Files to Create:
1. `src/pages/Auth.tsx` -- Login/Signup page
2. `src/pages/ResetPassword.tsx` -- Password reset page
3. `src/pages/Checkout.tsx` -- Payment checkout page
4. `src/pages/PaymentSuccess.tsx` -- Success page
5. `src/pages/PaymentFailed.tsx` -- Failure page
6. `src/contexts/AuthContext.tsx` -- Auth state management
7. `src/components/ProtectedRoute.tsx` -- Route guard
8. `src/lib/api/ai.ts` -- Lovable AI API wrapper
9. `supabase/functions/ai-optimize-resume/index.ts` -- Resume AI
10. `supabase/functions/ai-rate-answer/index.ts` -- Answer rating AI
11. `supabase/functions/ai-cover-letter/index.ts` -- Cover letter AI

### Files to Modify:
1. `src/App.tsx` -- Add new routes, wrap with AuthProvider
2. `src/components/layout/Navbar.tsx` -- Add login/logout, user avatar
3. `src/pages/Dashboard.tsx` -- Load/save resume data from database
4. `src/pages/InterviewPrep.tsx` -- Load/save progress from database
5. `src/pages/Pricing.tsx` -- Link CTAs to checkout
6. `src/pages/ResumeBuilder.tsx` -- Load saved resume from database

### Database Migration:
- 1 migration with all tables, RLS policies, and trigger

### Edge Functions:
- 3 edge functions using Lovable AI (no external API key needed)
- All use `LOVABLE_API_KEY` which is already configured

### What's Skipped (needs API keys -- will do next):
- Stripe actual payment processing (needs Stripe key)
- Firecrawl social media scraping (needs connector)
- Perplexity AI search (needs connector)
- Google OAuth login (needs configuration)

