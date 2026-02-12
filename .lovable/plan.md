

# ProfileX Enhancement -- Dynamic Showcase, Premium Templates & LeetCode-Style Interview Prep

## Overview
Three major upgrades: (1) Replace the static video placeholder on the Landing Page with a dynamic, auto-scrolling resume template showcase, (2) Add more classy/attractive resume templates with enhanced customization, (3) Transform the Interview Prep into a LeetCode-inspired coding platform with problem cards, filters, and progress tracking.

---

## 1. Landing Page -- Replace Video Section with Dynamic Template Showcase

**Current state:** A static "Watch Demo" section with a play button icon and no actual content.

**New design:** A horizontally auto-scrolling carousel of live resume template previews (mini-rendered versions of actual templates). Each template card slowly scrolls left-to-right in an infinite loop, creating a dynamic, premium "showroom" feel.

**Implementation:**
- Remove the play button / video placeholder
- Render 6-8 mini resume template cards (scaled down to ~200px wide) in a horizontally scrolling row
- Use CSS `@keyframes` for infinite smooth left-to-right scrolling (ticker-style, like a conveyor belt)
- Two rows scrolling in opposite directions for visual depth
- Each card shows a tiny but real preview of a template style (name, colored header, bullet points, skills section)
- Hovering a card pauses the animation and scales it up slightly
- Label each card with the template name (e.g., "The Executive", "The Minimalist")

---

## 2. More Resume Templates + Enhanced Customization

**New templates to add (2 more):**
- **"The Elegant"** -- Inspired by classic luxury brands. Serif-heavy, thin gold lines, sophisticated spacing. Think Hermes/Chanel aesthetic.
- **"The Bold"** -- High contrast, large name, colored header block, modern sans-serif. Inspired by Elon Musk's one-page resume style.

**Template enhancements:**
- Update `TemplateName` type to include `"elegant"` and `"bold"`
- Add template cards to `TemplateSelector` with new icons (Gem for Elegant, Rocket for Bold)
- Create `ElegantTemplate.tsx` and `BoldTemplate.tsx` component files

**Customizer enhancements:**
- Add **Font Family selector** (3 options: Serif/Sans-Serif/Monospace)
- Add **Font Color control** (6 options: White, Light Gray, Cream, Silver, Warm White, Cool White)
- Add **Header Style** toggle (Centered / Left-aligned / Two-column)
- Expand accent color palette with 3 more options (Teal, Coral, Navy)

---

## 3. Interview Prep -- LeetCode-Style Transformation

**Current state:** Round-based tabs with expandable question cards. Functional but doesn't feel like a coding platform.

**LeetCode-inspired enhancements:**

### Problem List View (default):
- Table/card grid showing ALL questions across rounds with columns:
  - Status icon (solved/unsolved/attempted)
  - Question title
  - Difficulty badge (Easy=green, Medium=yellow, Hard=red)
  - Category/Topic tags (DSA, System Design, HR, etc.)
  - Acceptance/frequency rate (e.g., "99% asked")
  - Round number
- **Filter bar** at top: Filter by Difficulty (Easy/Medium/Hard), Topic (DSA, System Design, HR, Behavioral, Coding), Status (All/Solved/Unsolved)
- **Search bar** to find specific questions
- **Sort options**: By difficulty, by frequency, by round
- Click a question to open the detailed practice view (existing AnswerRater)

### Problem Detail View:
- Split-pane layout: Left side = question + ideal answer + tips, Right side = user's answer textarea + rating
- "Next Question" and "Previous Question" navigation
- Bookmark/star questions for later review
- Track solved/attempted status per question using local state

### Progress Dashboard (top of page):
- Total solved / total questions progress bar
- Difficulty breakdown: X Easy / Y Medium / Z Hard solved
- Streak counter (days practiced)
- "Daily Challenge" -- randomly highlighted question of the day

### Visual styling:
- Question cards with left border color-coded by difficulty
- Solved questions get a green checkmark and subtle green tint
- Attempted (but not solved) get yellow indicator
- Hovering shows question preview tooltip

---

## Technical Details

### Files to Create:
1. `src/components/resume/templates/ElegantTemplate.tsx` -- Luxury serif template
2. `src/components/resume/templates/BoldTemplate.tsx` -- High-contrast modern template

### Files to Modify:
1. **`src/pages/LandingPage.tsx`** -- Replace video section with dynamic template carousel (auto-scrolling mini template previews in two rows, opposite directions)
2. **`src/pages/InterviewPrep.tsx`** -- Major rewrite: LeetCode-style problem list with filters, search, sort, split-pane detail view, progress dashboard, daily challenge, bookmark/star system
3. **`src/pages/ResumeBuilder.tsx`** -- Register new templates ("elegant", "bold"), render them in switch statement
4. **`src/components/resume/TemplateSelector.tsx`** -- Add 2 new template entries (Elegant, Bold) with icons
5. **`src/components/resume/ResumeCustomizer.tsx`** -- Add font family selector (3 options), font color control (6 options), header style toggle, 3 more accent colors (Teal, Coral, Navy)
6. **`src/index.css`** -- Add `@keyframes ticker-scroll` for the auto-scrolling carousel animation

### No new dependencies required
All features built with existing packages (framer-motion, lucide-react, tailwind).

