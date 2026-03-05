

# Remaining Work: "Ask AI for Hint" Button

## What's Left

After reviewing all 1,745 lines of InterviewPrep.tsx and all supporting files, **6 out of 7 plan sections are fully implemented**. The single missing feature is:

**"Ask AI for Hint" button** -- A button on each question detail view that gives a directional hint without revealing the full ideal answer.

## Implementation

### How it works
- Add a "Get Hint" button next to the answer textarea in the detail view
- On click, call the existing `ai-rate-answer` edge function with a modified prompt (or use a simple local hint generator that extracts the first sentence of the ideal answer + the bias tag)
- Show the hint in a collapsible card below the button
- Simple approach: extract a partial hint from the existing `idealAnswer` and `psychTip` fields without revealing the full answer

### File to Modify
1. `src/pages/InterviewPrep.tsx` -- Add hint state + button + hint display card inside the `AnswerRater` component (around line 495, near the existing buttons)

### No new edge functions or database changes needed
The hint can be derived client-side from existing question data (first line of ideal answer + psych tip + bias tag) to avoid unnecessary API calls. This keeps it instant and free.

