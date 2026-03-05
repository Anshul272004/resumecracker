import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, CheckCircle2, XCircle, ChevronDown, ChevronUp, Star, Target, Zap,
  Code, BookOpen, MessageSquare, TrendingUp, Shield, Lightbulb, Award, ThumbsUp, AlertTriangle,
  Timer, Play, Pause, RotateCcw, Users, Crown, Briefcase, Layout,
  Search, Filter, Bookmark, BookmarkCheck, ChevronLeft, ChevronRight, Flame, ArrowUpDown, CircleDot,
  UserSearch, Globe, Linkedin, Instagram, Facebook, ExternalLink, Loader2,
  Shirt, MessageCircle, Sparkles, Eye, Volume2, Hand, Quote, Building2,
  CheckSquare, Square, Coffee, Phone, FileText, Clock, Droplets, HeartPulse,
  Mic, BarChart3, Palette, Glasses
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { aiApi } from "@/lib/api/ai";
import { firecrawlApi } from "@/lib/api/firecrawl";
import { toast } from "@/hooks/use-toast";

/* ─── Types ─── */
type Difficulty = "Easy" | "Medium" | "Hard";
type QuestionStatus = "unsolved" | "attempted" | "solved";

interface Question {
  id: number;
  question: string;
  type: string;
  frequency: string;
  difficulty: Difficulty;
  idealAnswer: string;
  biasTag: string;
  psychTip: string;
  commonMistake: string;
  roundId: number;
  roundName: string;
  category: string;
}

/* ─── Strategy Cards Data ─── */
const strategyCards: Record<string, {
  title: string;
  icon: string;
  bodyLanguage: string[];
  voiceTone: string[];
  keyPhrases: string[];
  avoid: string[];
}> = {
  HR: {
    title: "HR & Behavioral Strategy",
    icon: "👥",
    bodyLanguage: [
      "Maintain eye contact 60-70% of the time",
      "Lean forward slightly when listening — shows engagement",
      "Use the interviewer's name once naturally",
      "Mirror their energy level and posture",
      "Nod while they speak — active listening signal",
    ],
    voiceTone: [
      "Warm and conversational — not robotic",
      "Vary your pitch when telling stories",
      "Pause 2 seconds before answering — shows thoughtfulness",
      "Match their speaking pace",
    ],
    keyPhrases: [
      "What excites me about this role is...",
      "In my experience, I've found that...",
      "The impact was measurable — specifically...",
      "I believe in collaborative problem-solving...",
      "That's a great question — let me share a specific example...",
    ],
    avoid: [
      "Never badmouth previous employers",
      "Don't say 'I'm a perfectionist' as a weakness",
      "Avoid one-word answers — always elaborate",
      "Don't ask about salary in Round 1",
    ],
  },
  Theory: {
    title: "Technical Theory Strategy",
    icon: "📚",
    bodyLanguage: [
      "Use hand gestures when explaining architectures",
      "Draw diagrams in the air — visual thinkers appreciate this",
      "Sit up straight — confidence posture",
      "Keep hands visible on the table",
    ],
    voiceTone: [
      "Clear and structured — use numbered points",
      "Slow down at key technical terms",
      "Confident but open to discussion",
      "Say 'That's a nuanced topic...' before complex answers",
    ],
    keyPhrases: [
      "The key trade-off here is...",
      "In production, I'd consider...",
      "The time complexity is O(n) because...",
      "There are multiple approaches — let me walk through the optimal one...",
      "From a scalability perspective...",
    ],
    avoid: [
      "Don't say 'I think' — say 'Based on my experience'",
      "Avoid vague answers like 'it depends' without elaborating",
      "Don't pretend to know something you don't",
      "Never skip mentioning trade-offs",
    ],
  },
  DSA: {
    title: "Coding & DSA Strategy",
    icon: "💻",
    bodyLanguage: [
      "Think aloud — narrate your thought process",
      "Use whiteboard/paper to sketch solutions",
      "Take a breath before starting — don't rush",
      "Point to specific parts of your code when explaining",
    ],
    voiceTone: [
      "Methodical and calm — even when stuck",
      "Say 'Let me think about edge cases...' to buy time",
      "Narrate trade-offs between approaches",
      "Ask clarifying questions before coding",
    ],
    keyPhrases: [
      "Let me first clarify the constraints...",
      "The brute force is O(n²), but we can optimize...",
      "Let me handle the edge cases: empty input, single element...",
      "The space-time trade-off here is...",
      "I'd write tests for: normal case, edge case, large input...",
    ],
    avoid: [
      "Don't start coding immediately — plan first",
      "Never skip edge case discussion",
      "Don't use built-in functions without explaining what they do",
      "Avoid silent coding — always narrate",
    ],
  },
  "System Design": {
    title: "System Design Strategy",
    icon: "🏗️",
    bodyLanguage: [
      "Stand up and use the whiteboard if available",
      "Draw boxes and arrows while speaking",
      "Gesture to show data flow direction",
      "Face the interviewer, not the board, when explaining",
    ],
    voiceTone: [
      "Start with 'Let me clarify the requirements first...'",
      "Use a top-down approach — high level first",
      "Pause after each component — invite feedback",
      "Say 'Let me think about the trade-offs here...' to buy time",
    ],
    keyPhrases: [
      "Let's start with the requirements and constraints...",
      "The bottleneck here would be...",
      "For horizontal scaling, we could...",
      "The CAP theorem trade-off in this case...",
      "In terms of data consistency vs availability...",
      "We need to handle roughly X QPS...",
    ],
    avoid: [
      "Don't jump to implementation without requirements",
      "Never design without considering scale",
      "Don't forget to discuss monitoring and alerting",
      "Avoid over-engineering — start simple, then optimize",
    ],
  },
  Behavioral: {
    title: "Managerial & Culture Strategy",
    icon: "🎯",
    bodyLanguage: [
      "Show genuine enthusiasm — smile naturally",
      "Use open palm gestures — signals honesty",
      "Maintain relaxed but attentive posture",
      "Mirror the interviewer's formality level",
    ],
    voiceTone: [
      "Storytelling mode — use STAR structure naturally",
      "Lower your voice slightly at impact moments",
      "Pause after stating results — let numbers sink in",
      "Show emotion when describing team wins",
    ],
    keyPhrases: [
      "I took ownership of...",
      "The measurable impact was...",
      "I learned that leadership means...",
      "What I'd do differently next time is...",
      "The team's success was a result of...",
    ],
    avoid: [
      "Don't take all the credit — use 'we' alongside 'I'",
      "Never describe a conflict where you were clearly wrong",
      "Don't give hypothetical answers — always use real examples",
      "Avoid generic leadership buzzwords without substance",
    ],
  },
};

/* ─── Dress Code Data ─── */
const dressCodeTiers = [
  {
    tier: "Formal",
    icon: "👔",
    color: "from-slate-600 to-slate-800",
    borderColor: "border-slate-500/30",
    men: "Dark suit (navy/charcoal), white dress shirt, silk tie, leather oxford shoes, minimal watch",
    women: "Tailored blazer + pencil skirt/trousers, silk blouse, closed-toe heels/flats, minimal jewelry",
    colors: "Navy blue (trust), Charcoal (authority), White (clarity)",
    avoid: "Bright colors, casual fabrics, visible tattoos, strong cologne",
    psychology: "Navy blue conveys trust and competence. Black conveys authority. These colors activate the brain's 'leadership association' circuits.",
    companies: "Banking, Law, Consulting, Fortune 500",
  },
  {
    tier: "Business Casual",
    icon: "👕",
    color: "from-blue-600 to-blue-800",
    borderColor: "border-blue-500/30",
    men: "Chinos/dress pants, button-down shirt (no tie needed), leather belt, clean sneakers or loafers",
    women: "Smart trousers/skirt, blouse or structured top, cardigan, low heels or clean flats",
    colors: "Blue (reliable), Burgundy (confident), Earth tones (approachable)",
    avoid: "Jeans, sneakers, graphic tees, casual sandals",
    psychology: "Blue tones signal reliability and teamwork. Burgundy adds a touch of confidence without intimidation.",
    companies: "Mid-size tech, SaaS, Enterprise companies",
  },
  {
    tier: "Smart Casual",
    icon: "🧥",
    color: "from-emerald-600 to-emerald-800",
    borderColor: "border-emerald-500/30",
    men: "Dark jeans/chinos, polo or clean button-down, clean sneakers, optional blazer for senior roles",
    women: "Dark jeans/trousers, nice top/sweater, clean sneakers or ankle boots, statement accessory",
    colors: "Teal (innovative), Olive (grounded), Navy (professional base)",
    avoid: "Ripped jeans, flip-flops, overly casual t-shirts, heavy logos",
    psychology: "Slightly casual signals 'I'm one of the team' while still showing effort. The sweet spot for most tech interviews.",
    companies: "Startups, Scale-ups, Modern tech companies",
  },
  {
    tier: "Startup Casual",
    icon: "👟",
    color: "from-violet-600 to-violet-800",
    borderColor: "border-violet-500/30",
    men: "Clean jeans, solid-color t-shirt or henley, clean sneakers, optional hoodie (but keep it clean)",
    women: "Comfortable jeans/leggings, casual top, sneakers, keep it authentic and 'you'",
    colors: "Any clean, solid colors work. Show personality but stay neat.",
    avoid: "Looking like you're trying too hard, suits (you'll look out of place), wrinkled clothes",
    psychology: "Over-dressing at a casual startup signals 'I don't understand the culture.' Authenticity wins here.",
    companies: "Early-stage startups, Remote-first companies, Creative agencies",
  },
];

/* ─── Impress Factor Data (by category) ─── */
const impressFactors: Record<string, {
  tone: string;
  pacing: string;
  bodyLanguage: string;
  powerPhrases: string[];
}> = {
  HR: {
    tone: "Confident but warm — use collaborative language like 'we achieved' alongside 'I led'",
    pacing: "Slow down when delivering key metrics and impact numbers. Pause 2 seconds after impact statements to let them sink in.",
    bodyLanguage: "Lean forward during storytelling. Use open palm gestures. Make eye contact when delivering results. Smile when talking about team wins.",
    powerPhrases: ["The measurable impact was...", "What sets me apart is...", "I'm passionate about..."],
  },
  Theory: {
    tone: "Authoritative but curious — show depth with 'In my experience with production systems...'",
    pacing: "Steady pace. Slow down for complex concepts. Speed up slightly for basics to show fluency.",
    bodyLanguage: "Use hand gestures to illustrate architectures. Point to imaginary diagrams. Sit upright with squared shoulders.",
    powerPhrases: ["The key trade-off is...", "At scale, this becomes critical because...", "Let me walk through the internals..."],
  },
  DSA: {
    tone: "Methodical and calm — narrate your thought process even when stuck",
    pacing: "Think aloud steadily. Pause before optimizations. Say 'Let me reconsider...' when pivoting approaches.",
    bodyLanguage: "Write while speaking. Point to specific lines when explaining. Keep composure if stuck — take a breath.",
    powerPhrases: ["The brute force is O(n²), but here's the insight...", "Let me verify with an edge case...", "The optimal approach uses..."],
  },
  "System Design": {
    tone: "Structured and visionary — lead with requirements, show big-picture thinking",
    pacing: "Start slow with requirements. Build momentum as you add components. Pause after each major decision.",
    bodyLanguage: "Stand and draw. Face the interviewer when explaining 'why'. Use sweeping gestures for scale concepts.",
    powerPhrases: ["Let's define the constraints first...", "The bottleneck shifts to...", "For 99.99% availability, we need..."],
  },
  Behavioral: {
    tone: "Authentic and reflective — show genuine growth from failures, enthusiasm for wins",
    pacing: "Storytelling rhythm: setup (fast) → challenge (medium) → action (detailed) → result (slow, let it land).",
    bodyLanguage: "Show emotion naturally. Lower voice for serious moments. Lean in when discussing team dynamics.",
    powerPhrases: ["I took full ownership of...", "The lesson I carry from that is...", "What excites me most is..."],
  },
};

/* ─── Interview Day Checklist ─── */
const interviewDayChecklist = [
  { id: "resume", label: "5 printed copies of your resume", icon: FileText },
  { id: "id", label: "Government-issued photo ID", icon: FileText },
  { id: "portfolio", label: "Portfolio / code samples ready on laptop", icon: Code },
  { id: "research", label: "Company research notes reviewed", icon: BookOpen },
  { id: "arrive", label: "Arrive 15 minutes early", icon: Clock },
  { id: "phone", label: "Phone on silent mode", icon: Phone },
  { id: "water", label: "Water bottle (stay hydrated)", icon: Droplets },
  { id: "breath", label: "5 deep breaths before walking in", icon: HeartPulse },
  { id: "questions", label: "3 thoughtful questions prepared for interviewer", icon: MessageSquare },
  { id: "backup", label: "Backup outfit ready (just in case)", icon: Shirt },
  { id: "power", label: "Laptop/phone fully charged", icon: Zap },
  { id: "notes", label: "Pen and notepad for notes", icon: FileText },
];

/* ─── Round Data ─── */
const rounds = [
  {
    id: 1, name: "HR Screening", icon: Users, difficulty: "Easy" as Difficulty, duration: "15 min",
    color: "text-emerald-400", bgColor: "bg-emerald-500/10", category: "HR",
    questions: [
      { id: 1, question: "Tell me about yourself.", type: "Behavioral", frequency: "100%", difficulty: "Easy" as Difficulty, idealAnswer: "I'm a results-driven software developer with 2+ years of experience specializing in building scalable web applications. At TechCorp Solutions, I've engineered APIs serving 10,000+ daily requests and led a microservices migration that improved deployment speed by 3x. I'm passionate about writing clean, performant code and I'm now looking to bring my full-stack expertise to a team where I can solve complex technical challenges at scale.", biasTag: "Halo Effect — A strong opening creates a positive lens for everything that follows.", psychTip: "30 seconds max. Present-Past-Future structure. End with what you want next.", commonMistake: "Starting with 'I graduated from XYZ college in 2022...' — chronological answers lose attention." },
      { id: 2, question: "Why should we hire you?", type: "Behavioral", frequency: "96%", difficulty: "Medium" as Difficulty, idealAnswer: "Three reasons: First, I have proven experience building production-grade systems — my APIs handle 10,000+ requests daily with 99.9% uptime. Second, I bring a data-driven approach — every optimization I've done has measurable impact, like the 45% query optimization. Third, I'm not just a coder — I led the microservices migration, showing I can own technical decisions.", biasTag: "Rule of Three — The brain retains exactly 3 points.", psychTip: "Structure: 'Three reasons.' Then deliver exactly three.", commonMistake: "Rambling about personality traits without evidence." },
      { id: 3, question: "What are your salary expectations?", type: "Negotiation", frequency: "94%", difficulty: "Medium" as Difficulty, idealAnswer: "Based on my research of the market rate for this role, and considering my experience building production systems at scale, I'd expect a range of [X-Y]. However, I'm flexible and more interested in the overall opportunity, growth path, and the team I'd be working with. What's the budget you've allocated for this role?", biasTag: "Anchoring Bias — Whoever states a number first anchors the negotiation.", psychTip: "Always give a range, never a single number. The bottom of your range should be your target.", commonMistake: "Saying 'I'll take whatever you offer' — signals low confidence and low value." },
      { id: 4, question: "Where do you see yourself in 5 years?", type: "Behavioral", frequency: "91%", difficulty: "Easy" as Difficulty, idealAnswer: "In 5 years, I see myself as a senior engineer or tech lead who has deep expertise in system design and has mentored junior developers. I want to be the person the team relies on for critical architectural decisions.", biasTag: "Future Pacing — Describing a future with the company makes the interviewer visualize you there.", psychTip: "Never say 'I want your job' or 'start my own company.'", commonMistake: "Being too vague ('I just want to grow') or too ambitious ('I want to be CTO')." },
      { id: 5, question: "Why do you want to leave your current role?", type: "Behavioral", frequency: "89%", difficulty: "Medium" as Difficulty, idealAnswer: "I've learned immensely at my current role — I built APIs at scale, led a migration, and grew technically. Now I'm looking for new challenges at a larger scale where I can work on problems impacting millions of users, and this role aligns perfectly with that growth trajectory.", biasTag: "Positivity Bias — Frame departure as growth, never as escape.", psychTip: "Never criticize your current employer. Focus on what you're moving toward, not away from.", commonMistake: "Badmouthing your current company or manager — instant red flag." },
    ],
  },
  {
    id: 2, name: "Technical Theory", icon: BookOpen, difficulty: "Medium" as Difficulty, duration: "30 min",
    color: "text-blue-400", bgColor: "bg-blue-500/10", category: "Theory",
    questions: [
      { id: 6, question: "Explain the difference between a list and a tuple in Python.", type: "Theory", frequency: "99%", difficulty: "Easy" as Difficulty, idealAnswer: "Lists are mutable (can be modified after creation) while tuples are immutable. Use lists when you need to modify data frequently. Use tuples for fixed collections like coordinates, database records, or when you need hashable types as dictionary keys. Tuples are also slightly faster and consume less memory.", biasTag: "Anchoring Effect — Start with a clear distinction to frame expertise.", psychTip: "Lead with the core distinction immediately. Recruiters form impressions in first 3 seconds.", commonMistake: "Saying 'tuples are just like lists but immutable' — shows surface-level understanding." },
      { id: 7, question: "What is the Virtual DOM in React and why is it important?", type: "Theory", frequency: "97%", difficulty: "Medium" as Difficulty, idealAnswer: "The Virtual DOM is a lightweight JavaScript representation of the actual DOM. When state changes, React creates a new Virtual DOM tree, diffs it with the previous one (reconciliation), and only updates the changed parts of the real DOM. This batch-update approach is significantly faster than direct DOM manipulation.", biasTag: "Authority Bias — Use technical terminology to establish expertise.", psychTip: "Mention 'reconciliation algorithm' — it signals deep knowledge and triggers the Halo Effect.", commonMistake: "Vague answers like 'it makes React fast' without explaining the diffing mechanism." },
      { id: 8, question: "Explain overfitting in Machine Learning. How do you prevent it?", type: "Theory", frequency: "93%", difficulty: "Medium" as Difficulty, idealAnswer: "Overfitting occurs when a model learns noise in training data too well. Prevention: 1) Cross-validation, 2) Regularization (L1/L2), 3) Reducing model complexity, 4) Dropout for neural networks, 5) Early stopping, 6) More training data, 7) Data augmentation.", biasTag: "Serial Position Effect — List 7 techniques; first and last are remembered most.", psychTip: "Put your strongest technique first and last. The middle ones are forgotten.", commonMistake: "Only mentioning 'use more data' as the solution." },
      { id: 9, question: "What are React hooks? Explain useState and useEffect.", type: "Theory + Code", frequency: "98%", difficulty: "Easy" as Difficulty, idealAnswer: "Hooks let you use React features in functional components. useState manages local state: const [count, setCount] = useState(0). useEffect handles side effects: useEffect(() => { fetchData(); }, [dependency]). The dependency array controls when the effect runs.", biasTag: "Primacy Effect — The first concept explained sets the perception of your knowledge depth.", psychTip: "Start with a crisp one-line definition before diving into details.", commonMistake: "Not explaining the dependency array — a critical concept interviewers test." },
      { id: 10, question: "What is the difference between SQL and NoSQL databases?", type: "Theory", frequency: "92%", difficulty: "Medium" as Difficulty, idealAnswer: "SQL databases (PostgreSQL, MySQL) are relational with fixed schemas, ACID compliance, and use structured query language — ideal for complex queries and transactions. NoSQL databases (MongoDB, Redis) are non-relational with flexible schemas, horizontal scaling, and eventual consistency — ideal for unstructured data, real-time apps, and massive scale.", biasTag: "Contrast Effect — Presenting both options side-by-side shows balanced expertise.", psychTip: "Always mention when you'd use each. Decision-making ability is what interviewers test.", commonMistake: "Saying one is 'better' than the other without context." },
      { id: 11, question: "Explain REST API design principles.", type: "Theory", frequency: "95%", difficulty: "Medium" as Difficulty, idealAnswer: "REST (Representational State Transfer): 1) Stateless — each request contains all info needed, 2) Resource-based URLs (/users/123), 3) HTTP methods map to CRUD (GET=Read, POST=Create, PUT=Update, DELETE=Delete), 4) JSON responses with proper status codes (200, 201, 404, 500), 5) Versioning (/api/v1/) for backward compatibility.", biasTag: "Structured Thinking Bias — Numbered steps show systematic thinking.", psychTip: "Always mention status codes and versioning — these separate juniors from seniors.", commonMistake: "Only saying 'it uses HTTP methods' without explaining resource-based design." },
    ],
  },
  {
    id: 3, name: "Coding / DSA", icon: Code, difficulty: "Hard" as Difficulty, duration: "45 min",
    color: "text-red-400", bgColor: "bg-red-500/10", category: "DSA",
    questions: [
      { id: 12, question: "Write a SQL query to find the second highest salary.", type: "Programming", frequency: "95%", difficulty: "Medium" as Difficulty, idealAnswer: "SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee); — Or using DENSE_RANK(): SELECT salary FROM (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rank FROM Employee) ranked WHERE rank = 2;", biasTag: "Competence Bias — Showing multiple approaches signals mastery.", psychTip: "Always offer 2 solutions. The recruiter's brain registers you as 'advanced'.", commonMistake: "Only knowing one approach or not handling duplicate salaries." },
      { id: 13, question: "Reverse a linked list. Explain your approach.", type: "DSA", frequency: "94%", difficulty: "Medium" as Difficulty, idealAnswer: "Iterative approach: Use three pointers (prev, current, next). Traverse the list, reversing each node's pointer. Time: O(n), Space: O(1). Recursive: Base case when node is null/last, then reverse pointer direction. Time: O(n), Space: O(n) due to call stack.", biasTag: "Completeness Bias — Covering both iterative and recursive shows thoroughness.", psychTip: "Mention time and space complexity unprompted — it shows you think about performance.", commonMistake: "Only doing iterative or recursive. Doing both shows you understand tradeoffs." },
      { id: 14, question: "Find two numbers in an array that sum to a target.", type: "DSA", frequency: "97%", difficulty: "Easy" as Difficulty, idealAnswer: "Two-pointer approach (sorted): Sort array O(n log n), use left/right pointers. Hash map approach: Iterate once, for each num check if (target - num) exists in map. Time: O(n), Space: O(n). This is optimal.", biasTag: "Efficiency Bias — Jumping to optimal solution shows problem-solving instinct.", psychTip: "Start with 'The brute force is O(n²), but we can optimize to O(n) using a hash map.'", commonMistake: "Only providing the O(n²) nested loop solution." },
      { id: 15, question: "Detect a cycle in a linked list.", type: "DSA", frequency: "88%", difficulty: "Medium" as Difficulty, idealAnswer: "Floyd's Cycle Detection (Tortoise and Hare): Use two pointers — slow moves 1 step, fast moves 2 steps. If they meet, there's a cycle. Time: O(n), Space: O(1). To find the cycle start: reset one pointer to head, move both 1 step at a time — they meet at cycle start.", biasTag: "Named Algorithm Bias — Knowing 'Floyd's' by name signals deep CS knowledge.", psychTip: "Naming the algorithm (Floyd's Tortoise & Hare) immediately establishes authority.", commonMistake: "Using a HashSet — works but isn't O(1) space. Show you know the optimal approach." },
      { id: 16, question: "Check if a string is a valid palindrome.", type: "Programming", frequency: "90%", difficulty: "Easy" as Difficulty, idealAnswer: "Two-pointer approach: Left pointer at start, right at end. Compare characters (ignore non-alphanumeric, case-insensitive). If mismatch found, return false. Time: O(n), Space: O(1). Handle edge cases: empty string (true), single char (true).", biasTag: "Edge Case Awareness — Mentioning edge cases unprompted shows production-ready thinking.", psychTip: "Always mention edge cases before the interviewer asks. It shows defensive programming mindset.", commonMistake: "Reversing the string and comparing — works but is O(n) space. Two-pointer is optimal." },
    ],
  },
  {
    id: 4, name: "System Design", icon: Layout, difficulty: "Hard" as Difficulty, duration: "45 min",
    color: "text-purple-400", bgColor: "bg-purple-500/10", category: "System Design",
    questions: [
      { id: 17, question: "Design a URL shortener like Bit.ly.", type: "System Design", frequency: "92%", difficulty: "Hard" as Difficulty, idealAnswer: "Requirements: Shorten URLs, redirect quickly, analytics. Architecture: Load balancer → API servers → Database. URL generation: Base62 encoding of auto-increment ID or hash. Storage: NoSQL (DynamoDB) for fast reads. Caching: Redis for hot URLs. Scale: Read-heavy (100:1 ratio), so add read replicas and CDN.", biasTag: "Systems Thinking — Breaking down into components shows architectural maturity.", psychTip: "Start with 'Let me clarify requirements first...' — it shows you don't jump to solutions.", commonMistake: "Jumping straight to database design without discussing scale and requirements." },
      { id: 18, question: "How would you design a rate limiter?", type: "System Design", frequency: "87%", difficulty: "Hard" as Difficulty, idealAnswer: "Algorithms: 1) Token Bucket — tokens refill at fixed rate, each request consumes a token. 2) Sliding Window — count requests in time window. 3) Leaky Bucket — requests processed at fixed rate. Implementation: Redis with INCR + EXPIRE for distributed rate limiting. Return 429 when limit exceeded with Retry-After header.", biasTag: "Algorithm Knowledge — Naming 3 approaches shows you've studied the problem deeply.", psychTip: "Mention Redis specifically — it shows practical implementation knowledge, not just theory.", commonMistake: "Only knowing one approach. Multiple options show you can evaluate trade-offs." },
      { id: 19, question: "Design a notification system for a social media app.", type: "System Design", frequency: "85%", difficulty: "Hard" as Difficulty, idealAnswer: "Components: Event producer (user actions) → Message queue (Kafka/RabbitMQ) → Notification service → Delivery channels (push, email, SMS, in-app). Storage: Notification DB for history. Priorities: Real-time for mentions, batched for likes. Scale: Fan-out on write for celebrity users, fan-out on read for regular users.", biasTag: "Trade-off Analysis — Discussing fan-out strategies shows senior-level thinking.", psychTip: "Mention the celebrity problem (fan-out) — it's the key insight interviewers look for.", commonMistake: "Not considering delivery failures, retries, and dead letter queues." },
    ],
  },
  {
    id: 5, name: "Managerial & Culture", icon: Briefcase, difficulty: "Medium" as Difficulty, duration: "20 min",
    color: "text-amber-400", bgColor: "bg-amber-500/10", category: "Behavioral",
    questions: [
      { id: 20, question: "Tell me about a time you had a conflict with a teammate.", type: "Behavioral", frequency: "93%", difficulty: "Medium" as Difficulty, idealAnswer: "Situation: During the microservices migration, a senior dev disagreed with my API design. Task: We needed alignment to meet our sprint deadline. Action: I scheduled a 1:1, actively listened to his concerns (valid scalability issues), and proposed a hybrid approach incorporating his caching strategy with my modular design. Result: We delivered on time, and the combined approach reduced latency by an additional 15%.", biasTag: "Collaboration Bias — Showing you can integrate others' ideas signals team-player mentality.", psychTip: "Never make the other person the villain. Show mutual respect and a win-win outcome.", commonMistake: "Saying 'I was right and eventually proved it' — makes you look uncooperative." },
      { id: 21, question: "How do you handle tight deadlines with multiple priorities?", type: "Behavioral", frequency: "90%", difficulty: "Medium" as Difficulty, idealAnswer: "I use a priority matrix: 1) Impact vs Effort to identify quick wins, 2) Communicate proactively with stakeholders about realistic timelines, 3) Break large tasks into smaller milestones for daily progress. Example: During a product launch, I had 3 concurrent features. I prioritized the payment flow (highest revenue impact), delegated UI polish, and negotiated a 2-day extension for the analytics dashboard.", biasTag: "Decision Framework Bias — Showing a structured approach to chaos signals leadership.", psychTip: "Use a specific example. Abstract answers like 'I prioritize well' are forgettable.", commonMistake: "Saying 'I work long hours' — signals poor time management, not dedication." },
      { id: 22, question: "Describe a situation where you failed. What did you learn?", type: "Behavioral", frequency: "88%", difficulty: "Medium" as Difficulty, idealAnswer: "I once deployed a database migration without proper rollback scripts. The migration had a subtle bug that corrupted 200 user records. I immediately took ownership, rolled back manually (6 hours of work), restored data from backups, and then built an automated migration testing pipeline. Result: Zero deployment failures in the next 8 months.", biasTag: "Vulnerability Bias — Admitting real failures (with growth) builds deep trust.", psychTip: "Pick a real failure, not a disguised strength. Authenticity is what interviewers remember.", commonMistake: "Saying 'I'm a perfectionist' or picking a trivial failure. It feels rehearsed and fake." },
      { id: 23, question: "How would you mentor a junior developer who is struggling?", type: "Leadership", frequency: "82%", difficulty: "Medium" as Difficulty, idealAnswer: "First, I'd identify the root cause — is it technical gap, confidence, or process confusion? Then: 1) Pair program on a real task (not hypotheticals), 2) Set small, achievable goals with daily check-ins, 3) Create a safe space for questions (no judgement). Example: I mentored an intern who struggled with Git. After 3 pair sessions and a cheat sheet I created, they became the team's go-to for merge conflict resolution.", biasTag: "Empathy Bias — Showing you diagnose before prescribing signals emotional intelligence.", psychTip: "Mention specific techniques (pair programming, cheat sheets) — not just 'I'd help them.'", commonMistake: "Saying 'I'd tell them to read the docs' — shows no mentorship instinct." },
    ],
  },
];

/* ─── Flatten all questions ─── */
const allQuestions: Question[] = rounds.flatMap((r) =>
  r.questions.map((q) => ({ ...q, roundId: r.id, roundName: r.name, category: r.category }))
);

/* ─── Confidence Meter ─── */
const ConfidenceMeter = ({ answer }: { answer: string }) => {
  const words = answer.trim().split(/\s+/).filter(Boolean).length;
  const hasNumbers = /\d/.test(answer);
  const hasStructure = (answer.match(/\./g) || []).length >= 2;
  const hasImpact = /improve|reduc|increas|achiev|built|engineer|design|implement|develop|led|optimiz|migrat|deliver/i.test(answer);
  
  let confidence = 0;
  if (words >= 10) confidence += 20;
  if (words >= 30) confidence += 15;
  if (words >= 50) confidence += 10;
  if (hasNumbers) confidence += 20;
  if (hasStructure) confidence += 15;
  if (hasImpact) confidence += 20;

  const level = confidence >= 70 ? "High" : confidence >= 40 ? "Medium" : "Low";
  const color = confidence >= 70 ? "text-emerald-400" : confidence >= 40 ? "text-yellow-400" : "text-red-400";
  const bgColor = confidence >= 70 ? "bg-emerald-500" : confidence >= 40 ? "bg-yellow-500" : "bg-red-500";

  if (words < 3) return null;

  return (
    <div className="flex items-center gap-3 glass rounded-lg p-3">
      <HeartPulse className={`w-4 h-4 ${color}`} />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="font-body text-[10px] font-semibold text-muted-foreground uppercase">Confidence Level</span>
          <span className={`font-body text-xs font-bold ${color}`}>{level} ({confidence}%)</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${confidence}%` }} transition={{ duration: 0.5 }}
            className={`h-full rounded-full ${bgColor}`} />
        </div>
      </div>
    </div>
  );
};

/* ─── Answer Rater (AI-powered with regex fallback) ─── */
const AnswerRater = ({ question, interviewerInsights }: { question: Question; interviewerInsights: any }) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [showIdeal, setShowIdeal] = useState(false);
  const [isRating, setIsRating] = useState(false);
  const [rating, setRating] = useState<null | {
    score: number;
    feedback: string[];
    categories: { name: string; score: number }[];
    improvedAnswer?: string;
  }>(null);

  const regexFallback = () => {
    const words = userAnswer.trim().split(/\s+/).length;
    const hasNumbers = /\d/.test(userAnswer);
    const hasTechTerms = /api|database|react|sql|python|algorithm|optimiz|performance|architecture|deploy|cache|scale|latency|throughput/i.test(userAnswer);
    const hasStructure = userAnswer.includes(".") && words > 15;
    const hasImpact = /improve|reduc|increas|achiev|built|engineer|design|implement|develop|led|optimiz|migrat|deliver/i.test(userAnswer);
    const hasPsych = /first|reason|three|result|impact|because|specific|measur/i.test(userAnswer);

    let structureScore = 30, impactScore = 20, specificityScore = 20, psychScore = 15;
    if (words >= 30) structureScore += 30; else if (words >= 20) structureScore += 15;
    if (words >= 50) structureScore += 10;
    if (hasStructure) structureScore += 20;
    if (hasNumbers) specificityScore += 40;
    if (hasTechTerms) impactScore += 30;
    if (hasImpact) impactScore += 30;
    if (hasPsych) psychScore += 40;

    const categories = [
      { name: "Structure", score: Math.min(structureScore, 100) },
      { name: "Impact Language", score: Math.min(impactScore, 100) },
      { name: "Specificity", score: Math.min(specificityScore, 100) },
      { name: "Psychology", score: Math.min(psychScore, 100) },
    ];
    const totalScore = Math.min(Math.round(categories.reduce((a, c) => a + c.score, 0) / categories.length), 100);
    const feedback: string[] = [];
    if (structureScore < 60) feedback.push("Add more structure — use clear sentences and break into points.");
    if (!hasNumbers) feedback.push("Add quantifiable metrics (numbers, %, users) — 22x more memorable.");
    if (!hasTechTerms) feedback.push("Include relevant technical keywords for domain expertise.");
    if (!hasImpact) feedback.push("Use impact verbs: 'engineered', 'optimized', 'reduced', 'achieved'.");
    if (!hasPsych) feedback.push("Apply psychology: lead with results, use 'three reasons', be specific.");
    if (feedback.length === 0) feedback.push("Excellent! Compare with the ideal answer for final refinement.");
    return { score: totalScore, feedback, categories };
  };

  const rateAnswer = async () => {
    if (userAnswer.trim().length < 10) return;
    setIsRating(true);

    try {
      const aiResult = await aiApi.rateAnswer(question.question, userAnswer, question.idealAnswer);
      setRating({
        score: aiResult.score,
        categories: [
          { name: "Structure", score: aiResult.categories.structure },
          { name: "Impact Language", score: aiResult.categories.impact_language },
          { name: "Specificity", score: aiResult.categories.specificity },
          { name: "Psychology", score: aiResult.categories.psychology },
        ],
        feedback: [aiResult.feedback],
        improvedAnswer: aiResult.improved_answer,
      });
    } catch (err) {
      console.error("AI rating failed, using fallback:", err);
      const fallback = regexFallback();
      setRating(fallback);
      toast({ title: "Using instant analysis", description: "AI unavailable, used pattern-matching instead.", variant: "default" });
    } finally {
      setIsRating(false);
    }
  };

  const impressFactor = impressFactors[question.category];
  const [hintVisible, setHintVisible] = useState(false);

  const generateHint = () => {
    setHintVisible(true);
  };

  const getHintContent = () => {
    const firstSentence = question.idealAnswer.split(/[.!?]/)[0]?.trim();
    const hintDirection = firstSentence ? firstSentence.slice(0, Math.min(firstSentence.length, 80)) + (firstSentence.length > 80 ? "..." : "") : "";
    return {
      direction: hintDirection,
      psychTip: question.psychTip,
      biasTag: question.biasTag,
    };
  };

  return (
    <div className="space-y-4">
      <Textarea value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)}
        placeholder="Type your answer here... AI will rate it using psychology & recruiter patterns"
        className="bg-secondary border-border font-body text-sm min-h-[120px]" />
      
      {/* Confidence Meter */}
      <ConfidenceMeter answer={userAnswer} />

      <div className="flex gap-3 flex-wrap">
        <Button onClick={rateAnswer} disabled={userAnswer.trim().length < 10 || isRating} className="bg-gradient-gold text-primary-foreground font-body font-semibold text-xs">
          {isRating ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> AI Analyzing...</> : <><Brain className="w-4 h-4 mr-1" /> Rate My Answer</>}
        </Button>
        <Button variant="outline" onClick={() => setShowIdeal(!showIdeal)} className="border-primary/30 text-primary hover:bg-primary/10 font-body text-xs">
          <BookOpen className="w-4 h-4 mr-1" /> {showIdeal ? "Hide" : "Show"} Ideal Answer
        </Button>
        {!hintVisible && (
          <Button variant="outline" onClick={generateHint} className="border-accent/30 text-accent-foreground hover:bg-accent/10 font-body text-xs">
            <Lightbulb className="w-4 h-4 mr-1" /> Get Hint
          </Button>
        )}
      </div>

      {/* Hint Card */}
      <AnimatePresence>
        {hintVisible && (() => {
          const hint = getHintContent();
          return (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass rounded-xl p-4 border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-primary" />
                  <span className="font-body text-[10px] font-bold text-primary uppercase tracking-wider">AI Hint</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setHintVisible(false)} className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
                  <XCircle className="w-3.5 h-3.5" />
                </Button>
              </div>
              <p className="font-body text-xs text-foreground leading-relaxed mb-2">
                <span className="text-muted-foreground">Start with: </span>"{hint.direction}"
              </p>
              {hint.psychTip && (
                <p className="font-body text-xs text-muted-foreground leading-relaxed">
                  <span className="text-primary font-semibold">🧠 Psych Tip:</span> {hint.psychTip}
                </p>
              )}
              {hint.biasTag && (
                <Badge variant="outline" className="mt-2 text-[10px] border-primary/30 text-primary">{hint.biasTag}</Badge>
              )}
            </motion.div>
          );
        })()}
      </AnimatePresence>

      <AnimatePresence>
        {rating && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="glass-gold-deep rounded-xl p-6">
              <div className="flex items-center gap-4 mb-5">
                <div className="relative w-16 h-16">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15" fill="none" strokeWidth="3" className="stroke-secondary" />
                    <circle cx="18" cy="18" r="15" fill="none" strokeWidth="3" strokeLinecap="round"
                      className={rating.score >= 70 ? "stroke-primary" : rating.score >= 40 ? "stroke-yellow-500" : "stroke-destructive"}
                      strokeDasharray={`${(rating.score / 100) * 94.2} 94.2`} />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center font-display text-sm font-bold text-foreground">{rating.score}</span>
                </div>
                <div>
                  <p className="font-body text-sm font-semibold text-foreground">
                    {rating.score >= 80 ? "🔥 Excellent!" : rating.score >= 60 ? "👍 Good, Needs Polish" : rating.score >= 40 ? "⚠️ Average" : "🚨 Needs Work"}
                  </p>
                  <p className="font-body text-xs text-muted-foreground">AI-powered analysis using recruiter psychology</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {rating.categories.map((cat) => (
                  <div key={cat.name} className="glass rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-body text-[10px] font-semibold text-muted-foreground uppercase">{cat.name}</span>
                      <span className={`font-body text-xs font-bold ${cat.score >= 70 ? "text-primary" : cat.score >= 40 ? "text-yellow-500" : "text-destructive"}`}>{cat.score}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${cat.score}%` }} transition={{ duration: 0.8 }}
                        className={`h-full rounded-full ${cat.score >= 70 ? "bg-primary" : cat.score >= 40 ? "bg-yellow-500" : "bg-destructive"}`} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {rating.feedback.map((f, i) => (
                  <div key={i} className="flex items-start gap-2">
                    {rating.score >= 80 ? <ThumbsUp className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" /> : <AlertTriangle className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />}
                    <p className="font-body text-xs text-muted-foreground">{f}</p>
                  </div>
                ))}
              </div>
              {rating.improvedAnswer && (
                <div className="mt-4 glass rounded-xl p-4">
                  <p className="font-body text-[10px] font-bold text-primary uppercase tracking-wider mb-2">✨ AI-Improved Answer</p>
                  <p className="font-body text-xs text-foreground leading-relaxed">{rating.improvedAnswer}</p>
                </div>
              )}
            </div>

            {/* ═══ IMPRESS FACTOR ═══ */}
            {impressFactor && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="glass rounded-2xl p-6 border border-primary/20">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="font-display text-base font-bold text-foreground">Impress Factor</h3>
                  <span className="font-body text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">HOW to deliver</span>
                </div>
                
                {interviewerInsights?.personalityType && (
                  <div className="glass-gold rounded-lg p-3 mb-4">
                    <p className="font-body text-[10px] font-bold text-primary uppercase tracking-wider mb-1">🎯 Tailored for: {interviewerInsights.personalityType}</p>
                    <p className="font-body text-xs text-muted-foreground">{interviewerInsights.personalityStrategy}</p>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="glass rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Volume2 className="w-3.5 h-3.5 text-primary" />
                      <span className="font-body text-[10px] font-bold text-primary uppercase">Tone</span>
                    </div>
                    <p className="font-body text-xs text-muted-foreground">{impressFactor.tone}</p>
                  </div>
                  <div className="glass rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Timer className="w-3.5 h-3.5 text-primary" />
                      <span className="font-body text-[10px] font-bold text-primary uppercase">Pacing</span>
                    </div>
                    <p className="font-body text-xs text-muted-foreground">{impressFactor.pacing}</p>
                  </div>
                  <div className="glass rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Hand className="w-3.5 h-3.5 text-primary" />
                      <span className="font-body text-[10px] font-bold text-primary uppercase">Body Language</span>
                    </div>
                    <p className="font-body text-xs text-muted-foreground">{impressFactor.bodyLanguage}</p>
                  </div>
                  <div className="glass rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Quote className="w-3.5 h-3.5 text-primary" />
                      <span className="font-body text-[10px] font-bold text-primary uppercase">Power Phrases</span>
                    </div>
                    <div className="space-y-1">
                      {impressFactor.powerPhrases.map((p, i) => (
                        <p key={i} className="font-body text-xs text-primary italic">"{p}"</p>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showIdeal && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="glass-deep rounded-xl p-5 space-y-3">
            <div>
              <p className="font-body text-[10px] font-bold text-primary uppercase tracking-wider mb-1">✨ Ideal Answer</p>
              <p className="font-body text-sm text-foreground leading-relaxed">{question.idealAnswer}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-border">
              <div className="glass-gold rounded-lg p-3">
                <p className="font-body text-[10px] font-bold text-primary uppercase mb-1">🧠 Psychology Tip</p>
                <p className="font-body text-xs text-muted-foreground">{question.psychTip}</p>
              </div>
              <div className="glass-gold rounded-lg p-3">
                <p className="font-body text-[10px] font-bold text-primary uppercase mb-1">⚡ Bias Applied</p>
                <p className="font-body text-xs text-muted-foreground">{question.biasTag}</p>
              </div>
            </div>
            <div className="glass rounded-lg p-3">
              <p className="font-body text-[10px] font-bold text-destructive uppercase mb-1">❌ Common Mistake</p>
              <p className="font-body text-xs text-muted-foreground">{question.commonMistake}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── Practice Timer ─── */
const PracticeTimer = () => {
  const [timerDuration, setTimerDuration] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const resetTimer = useCallback((dur: number) => {
    setTimerDuration(dur);
    setTimeLeft(dur);
    setIsRunning(false);
  }, []);

  const progress = (timeLeft / timerDuration) * 100;

  return (
    <div className="glass-gold-deep rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Timer className="w-4 h-4 text-primary" />
        <span className="font-body text-xs font-bold text-primary uppercase tracking-wider">Practice Timer</span>
      </div>
      <div className="flex items-center justify-center mb-3">
        <div className="relative w-20 h-20">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle cx="18" cy="18" r="15" fill="none" strokeWidth="2.5" className="stroke-muted" />
            <circle cx="18" cy="18" r="15" fill="none" strokeWidth="2.5" strokeLinecap="round"
              className={timeLeft <= 10 ? "stroke-destructive" : "stroke-primary"}
              strokeDasharray={`${(progress / 100) * 94.2} 94.2`}
              style={{ transition: "stroke-dasharray 1s linear" }} />
          </svg>
          <span className={`absolute inset-0 flex items-center justify-center font-display text-lg font-bold ${timeLeft <= 10 ? "text-destructive" : "text-foreground"}`}>
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
          </span>
        </div>
      </div>
      <div className="flex justify-center gap-2 mb-3">
        <Button size="sm" variant={isRunning ? "destructive" : "default"} onClick={() => setIsRunning(!isRunning)} className="font-body text-xs">
          {isRunning ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
          {isRunning ? "Pause" : "Start"}
        </Button>
        <Button size="sm" variant="outline" onClick={() => resetTimer(timerDuration)} className="font-body text-xs border-primary/30 text-primary">
          <RotateCcw className="w-3 h-3 mr-1" /> Reset
        </Button>
      </div>
      <div className="flex justify-center gap-2">
        {[30, 60, 120].map((d) => (
          <button key={d} onClick={() => resetTimer(d)}
            className={`font-body text-[10px] px-3 py-1 rounded-full transition-all ${timerDuration === d ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
            {d}s
          </button>
        ))}
      </div>
    </div>
  );
};

/* ─── Difficulty Badge Component ─── */
const DifficultyBadge = ({ difficulty }: { difficulty: Difficulty }) => {
  const colors = {
    Easy: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    Hard: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return <span className={`font-body text-[10px] font-semibold px-2.5 py-1 rounded-full border ${colors[difficulty]}`}>{difficulty}</span>;
};

/* ─── Dress Code Guide ─── */
const DressCodeGuide = ({ recommendedTier }: { recommendedTier?: string }) => {
  const [expandedTier, setExpandedTier] = useState<string | null>(recommendedTier || null);

  return (
    <div className="space-y-3">
      {dressCodeTiers.map((tier) => {
        const isRecommended = recommendedTier === tier.tier;
        const isExpanded = expandedTier === tier.tier;
        return (
          <motion.div key={tier.tier}
            className={`glass rounded-xl overflow-hidden transition-all ${isRecommended ? "ring-2 ring-primary/50 shadow-gold" : ""}`}>
            <button onClick={() => setExpandedTier(isExpanded ? null : tier.tier)}
              className="w-full p-4 flex items-center gap-3 text-left">
              <span className="text-2xl">{tier.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-body text-sm font-bold text-foreground">{tier.tier}</h4>
                  {isRecommended && (
                    <span className="font-body text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-semibold animate-pulse">
                      ✨ Recommended
                    </span>
                  )}
                </div>
                <p className="font-body text-[10px] text-muted-foreground">{tier.companies}</p>
              </div>
              {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </button>
            <AnimatePresence>
              {isExpanded && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="px-4 pb-4">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="glass rounded-lg p-3">
                      <p className="font-body text-[10px] font-bold text-primary uppercase mb-1">👔 Men</p>
                      <p className="font-body text-xs text-muted-foreground">{tier.men}</p>
                    </div>
                    <div className="glass rounded-lg p-3">
                      <p className="font-body text-[10px] font-bold text-primary uppercase mb-1">👗 Women</p>
                      <p className="font-body text-xs text-muted-foreground">{tier.women}</p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3 mt-3">
                    <div className="glass rounded-lg p-3">
                      <p className="font-body text-[10px] font-bold text-primary uppercase mb-1">🎨 Colors</p>
                      <p className="font-body text-xs text-muted-foreground">{tier.colors}</p>
                    </div>
                    <div className="glass rounded-lg p-3">
                      <p className="font-body text-[10px] font-bold text-destructive uppercase mb-1">🚫 Avoid</p>
                      <p className="font-body text-xs text-muted-foreground">{tier.avoid}</p>
                    </div>
                  </div>
                  <div className="glass-gold rounded-lg p-3 mt-3">
                    <p className="font-body text-[10px] font-bold text-primary uppercase mb-1">🧠 Psychology</p>
                    <p className="font-body text-xs text-muted-foreground italic">{tier.psychology}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};

/* ─── Main Page ─── */
const InterviewPrep = () => {
  const { user } = useAuth();
  const [view, setView] = useState<"list" | "detail">("list");
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | "All">("All");
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<"All" | "Solved" | "Unsolved" | "Bookmarked">("All");
  const [sortBy, setSortBy] = useState<"difficulty" | "frequency" | "round">("round");
  const [questionStatus, setQuestionStatus] = useState<Record<number, QuestionStatus>>({});
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());
  const [knowsInterviewer, setKnowsInterviewer] = useState<null | boolean>(null);
  const [interviewerName, setInterviewerName] = useState("");
  const [interviewerLinkedIn, setInterviewerLinkedIn] = useState("");
  const [isResearching, setIsResearching] = useState(false);
  const [interviewerInsights, setInterviewerInsights] = useState<any>(null);
  const [companyName, setCompanyName] = useState("");
  const [isResearchingCompany, setIsResearchingCompany] = useState(false);
  const [companyInsights, setCompanyInsights] = useState<any>(null);
  const [checklist, setChecklist] = useState<Set<string>>(new Set());
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);

  // Load progress from database
  useEffect(() => {
    if (!user) return;
    const loadProgress = async () => {
      const { data } = await supabase
        .from("interview_progress")
        .select("question_id, status, bookmarked, score, user_answer")
        .eq("user_id", user.id);

      if (data) {
        const statusMap: Record<number, QuestionStatus> = {};
        const bookmarkSet = new Set<number>();
        data.forEach((row) => {
          statusMap[row.question_id] = row.status as QuestionStatus;
          if (row.bookmarked) bookmarkSet.add(row.question_id);
        });
        setQuestionStatus(statusMap);
        setBookmarks(bookmarkSet);
      }
    };
    loadProgress();
  }, [user]);

  // Save progress to DB
  const saveProgress = useCallback(async (questionId: number, status: QuestionStatus, bookmarked: boolean) => {
    if (!user) return;
    await supabase.from("interview_progress").upsert({
      user_id: user.id,
      question_id: questionId,
      status,
      bookmarked,
    }, { onConflict: "user_id,question_id" });
  }, [user]);

  // Real Firecrawl interviewer research
  const handleResearchInterviewer = async () => {
    if (!interviewerName.trim()) return;
    setIsResearching(true);

    try {
      const searchResult = await firecrawlApi.search(
        `${interviewerName} LinkedIn profile OR software engineer OR interviewer`,
        { limit: 5, scrapeOptions: { formats: ['markdown'] } }
      );

      let scrapedData = searchResult.data || [];

      if (interviewerLinkedIn.trim()) {
        try {
          const scrapeResult = await firecrawlApi.scrape(interviewerLinkedIn, { formats: ['markdown'] });
          if (scrapeResult.success) {
            scrapedData = [{ url: interviewerLinkedIn, markdown: scrapeResult.data?.markdown || scrapeResult.data?.data?.markdown || '' }, ...scrapedData];
          }
        } catch (e) {
          console.warn("LinkedIn scrape failed, using search results:", e);
        }
      }

      const insights = await firecrawlApi.researchInterviewer(interviewerName, scrapedData);
      setInterviewerInsights({ name: interviewerName, ...insights });
    } catch (err) {
      console.error("Interviewer research failed:", err);
      setInterviewerInsights({
        name: interviewerName,
        summary: `We couldn't find detailed profile data for ${interviewerName}. Here are general tips based on common interviewer patterns.`,
        interests: ["System Design", "Clean Code", "Team Collaboration", "Problem Solving", "Technical Leadership"],
        tips: ["Research the company's tech blog for their engineering values", "Prepare specific examples with quantified metrics", "Show collaborative problem-solving, not solo heroics", "Ask thoughtful questions about team culture", "Mention relevant open-source or side projects"],
        commonTopics: ["System Design Trade-offs", "Code Quality", "Team Dynamics", "Scaling Challenges"],
        communicationStyleType: "Analytical",
        communicationStyle: "Likely prefers structured, data-driven responses.",
        personalityType: "The Engineer",
        personalityStrategy: "Focus on technical depth, code quality, and system design fundamentals.",
        dressCode: "Smart Casual",
        dressDetails: "Clean jeans or chinos, button-down or polo, clean sneakers.",
        iceBreakers: ["Ask about their tech stack and recent technical challenges", "Mention a relevant blog post or talk from their company"],
      });
      toast({ title: "Using general insights", description: "Couldn't research this specific person. Showing general tips.", variant: "default" });
    } finally {
      setIsResearching(false);
    }
  };

  // Company research
  const handleResearchCompany = async () => {
    if (!companyName.trim()) return;
    setIsResearchingCompany(true);

    try {
      const searchResult = await firecrawlApi.search(
        `${companyName} company culture interview process engineering blog careers`,
        { limit: 5, scrapeOptions: { formats: ['markdown'] } }
      );

      const scrapedData = searchResult.data || [];
      const insights = await firecrawlApi.researchCompany(companyName, scrapedData);
      setCompanyInsights({ name: companyName, ...insights });
    } catch (err) {
      console.error("Company research failed:", err);
      setCompanyInsights({
        name: companyName,
        companySummary: `We couldn't find detailed data for ${companyName}. Here are general interview preparation tips.`,
        cultureTraits: ["Innovation", "Collaboration", "Customer Focus", "Continuous Learning", "Integrity"],
        interviewStyle: "Typically involves HR screening, technical rounds, and culture fit assessment.",
        dressCode: "Business Casual",
        dressDetails: "Chinos/dress pants, button-down shirt, clean shoes.",
        valuesToMirror: ["Team collaboration", "Data-driven decisions", "Customer impact", "Continuous improvement", "Ownership mentality"],
        commonQuestionThemes: ["Problem-solving approach", "Team collaboration", "Technical depth", "Leadership potential"],
        tipsForSuccess: ["Research the company's recent news and products", "Prepare STAR-format behavioral examples", "Show genuine interest in their mission", "Ask thoughtful questions about growth", "Demonstrate cultural alignment"],
      });
      toast({ title: "Using general insights", description: "Couldn't research this company. Showing general tips.", variant: "default" });
    } finally {
      setIsResearchingCompany(false);
    }
  };

  const totalQuestions = allQuestions.length;
  const solvedCount = Object.values(questionStatus).filter(s => s === "solved").length;
  const attemptedCount = Object.values(questionStatus).filter(s => s === "attempted").length;
  const easySolved = allQuestions.filter(q => q.difficulty === "Easy" && questionStatus[q.id] === "solved").length;
  const medSolved = allQuestions.filter(q => q.difficulty === "Medium" && questionStatus[q.id] === "solved").length;
  const hardSolved = allQuestions.filter(q => q.difficulty === "Hard" && questionStatus[q.id] === "solved").length;
  const easyTotal = allQuestions.filter(q => q.difficulty === "Easy").length;
  const medTotal = allQuestions.filter(q => q.difficulty === "Medium").length;
  const hardTotal = allQuestions.filter(q => q.difficulty === "Hard").length;

  const dailyChallenge = useMemo(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return allQuestions[dayOfYear % allQuestions.length];
  }, []);

  const toggleBookmark = (id: number) => {
    setBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      saveProgress(id, questionStatus[id] || "unsolved", next.has(id));
      return next;
    });
  };

  const markSolved = (id: number) => {
    setQuestionStatus(prev => {
      const next = { ...prev, [id]: "solved" as QuestionStatus };
      saveProgress(id, "solved", bookmarks.has(id));
      return next;
    });
  };

  const markAttempted = (id: number) => {
    if (questionStatus[id] !== "solved") {
      setQuestionStatus(prev => {
        const next = { ...prev, [id]: "attempted" as QuestionStatus };
        saveProgress(id, "attempted", bookmarks.has(id));
        return next;
      });
    }
  };

  const categories = ["All", ...new Set(rounds.map(r => r.category))];

  const filteredQuestions = useMemo(() => {
    let qs = [...allQuestions];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      qs = qs.filter(x => x.question.toLowerCase().includes(q) || x.type.toLowerCase().includes(q));
    }
    if (filterDifficulty !== "All") qs = qs.filter(x => x.difficulty === filterDifficulty);
    if (filterCategory !== "All") qs = qs.filter(x => x.category === filterCategory);
    if (filterStatus === "Solved") qs = qs.filter(x => questionStatus[x.id] === "solved");
    if (filterStatus === "Unsolved") qs = qs.filter(x => questionStatus[x.id] !== "solved");
    if (filterStatus === "Bookmarked") qs = qs.filter(x => bookmarks.has(x.id));

    if (sortBy === "difficulty") {
      const order = { Easy: 0, Medium: 1, Hard: 2 };
      qs.sort((a, b) => order[a.difficulty] - order[b.difficulty]);
    } else if (sortBy === "frequency") {
      qs.sort((a, b) => parseInt(b.frequency) - parseInt(a.frequency));
    }
    return qs;
  }, [searchQuery, filterDifficulty, filterCategory, filterStatus, sortBy, questionStatus, bookmarks]);

  const openQuestion = (q: Question) => {
    setSelectedQuestion(q);
    setView("detail");
    markAttempted(q.id);
  };

  const navigateQuestion = (dir: -1 | 1) => {
    if (!selectedQuestion) return;
    const idx = filteredQuestions.findIndex(q => q.id === selectedQuestion.id);
    const next = filteredQuestions[idx + dir];
    if (next) {
      setSelectedQuestion(next);
      markAttempted(next.id);
    }
  };

  const getStatusIcon = (id: number) => {
    const status = questionStatus[id];
    if (status === "solved") return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    if (status === "attempted") return <CircleDot className="w-4 h-4 text-yellow-400" />;
    return <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />;
  };

  const recommendedDressCode = interviewerInsights?.dressCode || companyInsights?.dressCode;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 pt-28 pb-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 glass-gold rounded-full px-5 py-2 mb-4">
            <Brain className="w-4 h-4 text-primary" />
            <span className="font-body text-xs font-medium text-primary">AI Interview Intelligence — LeetCode-Style</span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-3 text-shadow-gold">
            Interview <span className="text-gradient-gold">Prep Engine</span>
          </h1>
          <p className="font-body text-base text-muted-foreground max-w-2xl mx-auto">
            {totalQuestions} questions across 5 rounds — 99% probability these will be asked.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 glass rounded-full px-4 py-1.5">
            <Award className="w-4 h-4 text-primary" />
            <span className="font-body text-xs text-muted-foreground"><span className="text-primary font-semibold">4,200+</span> interviews cracked using this engine</span>
          </div>
        </motion.div>

        {/* Progress Dashboard */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-gold-deep rounded-2xl p-6 mb-8 border-shine">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            <div className="text-center">
              <p className="font-display text-3xl font-bold text-primary">{solvedCount}/{totalQuestions}</p>
              <p className="font-body text-[10px] text-muted-foreground">Solved</p>
            </div>
            <div className="text-center">
              <p className="font-display text-3xl font-bold text-emerald-400">{easySolved}/{easyTotal}</p>
              <p className="font-body text-[10px] text-emerald-400">Easy</p>
            </div>
            <div className="text-center">
              <p className="font-display text-3xl font-bold text-yellow-400">{medSolved}/{medTotal}</p>
              <p className="font-body text-[10px] text-yellow-400">Medium</p>
            </div>
            <div className="text-center">
              <p className="font-display text-3xl font-bold text-red-400">{hardSolved}/{hardTotal}</p>
              <p className="font-body text-[10px] text-red-400">Hard</p>
            </div>
            <div className="text-center">
              <p className="font-display text-3xl font-bold text-primary">{attemptedCount}</p>
              <p className="font-body text-[10px] text-muted-foreground">Attempted</p>
            </div>
          </div>
          <Progress value={(solvedCount / totalQuestions) * 100} className="h-2" />

          {/* Daily Challenge */}
          <div className="mt-4 glass rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:glass-gold transition-all"
            onClick={() => openQuestion(dailyChallenge)}>
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-body text-[10px] font-bold text-primary uppercase tracking-wider">Daily Challenge</p>
              <p className="font-body text-sm text-foreground truncate">{dailyChallenge.question}</p>
            </div>
            <DifficultyBadge difficulty={dailyChallenge.difficulty} />
          </div>
        </motion.div>

        {/* ═══ INTERVIEWER RESEARCH ═══ */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-gold-deep rounded-2xl p-6 mb-8 border-shine">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <UserSearch className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-foreground">Interviewer Intelligence</h2>
              <p className="font-body text-xs text-muted-foreground">Know your interviewer? We'll research their profile for personalized prep.</p>
            </div>
          </div>

          {knowsInterviewer === null && (
            <div className="flex flex-col sm:flex-row gap-3">
              <p className="font-body text-sm text-foreground self-center">Do you know who will interview you?</p>
              <div className="flex gap-2">
                <Button onClick={() => setKnowsInterviewer(true)} className="bg-gradient-gold text-primary-foreground font-body text-xs">
                  <CheckCircle2 className="w-4 h-4 mr-1" /> Yes, I know
                </Button>
                <Button variant="outline" onClick={() => setKnowsInterviewer(false)} className="border-primary/30 text-primary hover:bg-primary/10 font-body text-xs">
                  <XCircle className="w-4 h-4 mr-1" /> No idea
                </Button>
              </div>
            </div>
          )}

          {knowsInterviewer === true && !interviewerInsights && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-body text-xs text-muted-foreground mb-1.5 block">Interviewer's Name</label>
                  <Input value={interviewerName} onChange={(e) => setInterviewerName(e.target.value)}
                    placeholder="e.g., Rajesh Kumar" className="bg-secondary border-border font-body text-sm" />
                </div>
                <div>
                  <label className="font-body text-xs text-muted-foreground mb-1.5 block">LinkedIn / Social Profile URL (optional)</label>
                  <Input value={interviewerLinkedIn} onChange={(e) => setInterviewerLinkedIn(e.target.value)}
                    placeholder="https://linkedin.com/in/..." className="bg-secondary border-border font-body text-sm" />
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <Button onClick={handleResearchInterviewer} disabled={!interviewerName.trim() || isResearching}
                  className="bg-gradient-gold text-primary-foreground font-body text-xs font-semibold shadow-gold">
                  {isResearching ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Researching Social Media...</> : <><Globe className="w-4 h-4 mr-1" /> Research Profile</>}
                </Button>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="font-body text-[10px]">We'll search:</span>
                  <Linkedin className="w-3.5 h-3.5" />
                  <Facebook className="w-3.5 h-3.5" />
                  <Instagram className="w-3.5 h-3.5" />
                  <Globe className="w-3.5 h-3.5" />
                </div>
                <button onClick={() => { setKnowsInterviewer(null); setInterviewerName(""); setInterviewerLinkedIn(""); }}
                  className="font-body text-[10px] text-muted-foreground hover:text-foreground ml-auto">← Go back</button>
              </div>
            </div>
          )}

          {knowsInterviewer === true && interviewerInsights && (
            <div className="space-y-4">
              {/* Profile Summary */}
              <div className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-body text-sm font-bold text-foreground flex items-center gap-2">
                    <UserSearch className="w-4 h-4 text-primary" />
                    Profile Analysis: {interviewerInsights.name}
                  </h3>
                  <button onClick={() => { setInterviewerInsights(null); setInterviewerName(""); setInterviewerLinkedIn(""); }}
                    className="font-body text-[10px] text-muted-foreground hover:text-foreground">Research another</button>
                </div>
                <p className="font-body text-xs text-muted-foreground leading-relaxed mb-3">{interviewerInsights.summary}</p>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <p className="font-body text-[10px] font-bold text-primary uppercase tracking-wider mb-2">Their Interests</p>
                    <div className="flex flex-wrap gap-1.5">
                      {interviewerInsights.interests?.map((interest: string) => (
                        <span key={interest} className="font-body text-[10px] bg-primary/10 text-primary px-2.5 py-1 rounded-full">{interest}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="font-body text-[10px] font-bold text-primary uppercase tracking-wider mb-2">Likely Topics</p>
                    <div className="flex flex-wrap gap-1.5">
                      {interviewerInsights.commonTopics?.map((topic: string) => (
                        <span key={topic} className="font-body text-[10px] bg-secondary text-foreground px-2.5 py-1 rounded-full">{topic}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Communication Style + Personality Type */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-4 h-4 text-primary" />
                    <p className="font-body text-[10px] font-bold text-primary uppercase tracking-wider">Communication Style</p>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-body text-sm font-bold text-foreground">{interviewerInsights.communicationStyleType || "Analytical"}</span>
                  </div>
                  <p className="font-body text-xs text-muted-foreground">{interviewerInsights.communicationStyle}</p>
                </div>
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-primary" />
                    <p className="font-body text-[10px] font-bold text-primary uppercase tracking-wider">Personality Archetype</p>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-body text-sm font-bold text-foreground">{interviewerInsights.personalityType || "The Engineer"}</span>
                  </div>
                  <p className="font-body text-xs text-muted-foreground">{interviewerInsights.personalityStrategy}</p>
                </div>
              </div>

              {/* Dress Code + Ice Breakers */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shirt className="w-4 h-4 text-primary" />
                    <p className="font-body text-[10px] font-bold text-primary uppercase tracking-wider">What to Wear</p>
                  </div>
                  <span className="font-body text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full">{interviewerInsights.dressCode || "Smart Casual"}</span>
                  <p className="font-body text-xs text-muted-foreground mt-2">{interviewerInsights.dressDetails}</p>
                </div>
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Coffee className="w-4 h-4 text-primary" />
                    <p className="font-body text-[10px] font-bold text-primary uppercase tracking-wider">Ice Breakers</p>
                  </div>
                  <div className="space-y-1.5">
                    {interviewerInsights.iceBreakers?.map((ib: string, i: number) => (
                      <div key={i} className="flex items-start gap-2">
                        <MessageSquare className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                        <p className="font-body text-xs text-muted-foreground italic">"{ib}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="glass-gold rounded-xl p-4">
                <p className="font-body text-[10px] font-bold text-primary uppercase tracking-wider mb-3">🎯 Personalized Tips for {interviewerInsights.name}'s Interview</p>
                <div className="space-y-2">
                  {interviewerInsights.tips?.map((tip: string, i: number) => (
                    <div key={i} className="flex items-start gap-2">
                      <Star className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                      <p className="font-body text-xs text-muted-foreground">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ═══ DON'T KNOW INTERVIEWER — COMPANY RESEARCH ═══ */}
          {knowsInterviewer === false && (
            <div className="space-y-4">
              {!companyInsights ? (
                <>
                  <div className="glass rounded-xl p-4">
                    <p className="font-body text-[10px] font-bold text-primary uppercase tracking-wider mb-3">🏢 Company Intelligence — Let's Research Your Target Company</p>
                    <div className="space-y-3">
                      <div>
                        <label className="font-body text-xs text-muted-foreground mb-1.5 block">Company Name</label>
                        <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="e.g., Google, Stripe, Infosys..." className="bg-secondary border-border font-body text-sm" />
                      </div>
                      <Button onClick={handleResearchCompany} disabled={!companyName.trim() || isResearchingCompany}
                        className="bg-gradient-gold text-primary-foreground font-body text-xs font-semibold">
                        {isResearchingCompany ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Analyzing Company...</> : <><Building2 className="w-4 h-4 mr-1" /> Research Company</>}
                      </Button>
                    </div>
                  </div>
                  <div className="glass rounded-xl p-4">
                    <p className="font-body text-[10px] font-bold text-primary uppercase tracking-wider mb-3">🧠 General Tips (while we research)</p>
                    <div className="space-y-2">
                      {[
                        "Research the company's engineering blog and recent tech talks on YouTube",
                        "Check Glassdoor for common interview questions at this company",
                        "Study the job description keywords — mirror them in your answers",
                        "Prepare for all 5 rounds equally — you can't predict what they'll focus on",
                        "Follow the company's LinkedIn page for recent posts and culture signals",
                        "Look up the hiring manager on LinkedIn for team structure insights",
                      ].map((tip, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Lightbulb className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                          <p className="font-body text-xs text-muted-foreground">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Company Insights Display */}
                  <div className="glass rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-body text-sm font-bold text-foreground flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-primary" />
                        Company Intelligence: {companyInsights.name}
                      </h3>
                      <button onClick={() => { setCompanyInsights(null); setCompanyName(""); }}
                        className="font-body text-[10px] text-muted-foreground hover:text-foreground">Research another</button>
                    </div>
                    <p className="font-body text-xs text-muted-foreground leading-relaxed mb-3">{companyInsights.companySummary}</p>
                    
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <p className="font-body text-[10px] font-bold text-primary uppercase tracking-wider mb-2">Culture Traits</p>
                        <div className="flex flex-wrap gap-1.5">
                          {companyInsights.cultureTraits?.map((trait: string) => (
                            <span key={trait} className="font-body text-[10px] bg-primary/10 text-primary px-2.5 py-1 rounded-full">{trait}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="font-body text-[10px] font-bold text-primary uppercase tracking-wider mb-2">Common Question Themes</p>
                        <div className="flex flex-wrap gap-1.5">
                          {companyInsights.commonQuestionThemes?.map((theme: string) => (
                            <span key={theme} className="font-body text-[10px] bg-secondary text-foreground px-2.5 py-1 rounded-full">{theme}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="glass rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Eye className="w-4 h-4 text-primary" />
                        <p className="font-body text-[10px] font-bold text-primary uppercase tracking-wider">Interview Style</p>
                      </div>
                      <p className="font-body text-xs text-muted-foreground">{companyInsights.interviewStyle}</p>
                    </div>
                    <div className="glass rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Shirt className="w-4 h-4 text-primary" />
                        <p className="font-body text-[10px] font-bold text-primary uppercase tracking-wider">Dress Code</p>
                      </div>
                      <span className="font-body text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full">{companyInsights.dressCode}</span>
                      <p className="font-body text-xs text-muted-foreground mt-2">{companyInsights.dressDetails}</p>
                    </div>
                  </div>

                  <div className="glass-gold rounded-xl p-4">
                    <p className="font-body text-[10px] font-bold text-primary uppercase tracking-wider mb-2">🪞 Values to Mirror in Your Answers</p>
                    <div className="flex flex-wrap gap-2">
                      {companyInsights.valuesToMirror?.map((v: string) => (
                        <span key={v} className="font-body text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full border border-primary/20">{v}</span>
                      ))}
                    </div>
                  </div>

                  <div className="glass-gold rounded-xl p-4">
                    <p className="font-body text-[10px] font-bold text-primary uppercase tracking-wider mb-3">🎯 Tips for Success at {companyInsights.name}</p>
                    <div className="space-y-2">
                      {companyInsights.tipsForSuccess?.map((tip: string, i: number) => (
                        <div key={i} className="flex items-start gap-2">
                          <Star className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                          <p className="font-body text-xs text-muted-foreground">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              <button onClick={() => { setKnowsInterviewer(null); setCompanyInsights(null); setCompanyName(""); }}
                className="font-body text-[10px] text-muted-foreground hover:text-foreground">← Go back</button>
            </div>
          )}
        </motion.div>

        {/* ═══ DRESS CODE INTELLIGENCE ═══ */}
        {(interviewerInsights || companyInsights) && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="glass-gold-deep rounded-2xl p-6 mb-8 border-shine">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Shirt className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-foreground">Dress Code Intelligence</h2>
                <p className="font-body text-xs text-muted-foreground">What to wear based on company culture analysis. Colors affect perception.</p>
              </div>
            </div>
            <DressCodeGuide recommendedTier={recommendedDressCode} />
          </motion.div>
        )}

        {/* ═══ INTERVIEW DAY CHECKLIST ═══ */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass rounded-2xl mb-8 overflow-hidden">
          <Collapsible open={isChecklistOpen} onOpenChange={setIsChecklistOpen}>
            <CollapsibleTrigger className="w-full p-6 flex items-center gap-3 text-left hover:bg-primary/5 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                <CheckSquare className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="font-display text-lg font-bold text-foreground">Interview Day Checklist</h2>
                <p className="font-body text-xs text-muted-foreground">{checklist.size}/{interviewDayChecklist.length} completed — Don't forget anything!</p>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={(checklist.size / interviewDayChecklist.length) * 100} className="w-20 h-2" />
                {isChecklistOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-6 pb-6 grid sm:grid-cols-2 gap-2">
                {interviewDayChecklist.map((item) => (
                  <button key={item.id}
                    onClick={() => setChecklist(prev => {
                      const next = new Set(prev);
                      if (next.has(item.id)) next.delete(item.id); else next.add(item.id);
                      return next;
                    })}
                    className={`flex items-center gap-3 p-3 rounded-lg text-left transition-all ${checklist.has(item.id) ? "glass-gold" : "glass hover:bg-primary/5"}`}>
                    {checklist.has(item.id) ? 
                      <CheckSquare className="w-4 h-4 text-primary shrink-0" /> :
                      <Square className="w-4 h-4 text-muted-foreground shrink-0" />
                    }
                    <span className={`font-body text-xs ${checklist.has(item.id) ? "text-primary line-through" : "text-foreground"}`}>{item.label}</span>
                  </button>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </motion.div>

        {/* View Toggle */}
        {view === "detail" && selectedQuestion ? (
          /* ═══ DETAIL VIEW ═══ */
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            {/* Back + Navigation */}
            <div className="flex items-center justify-between mb-6">
              <Button variant="outline" onClick={() => setView("list")} className="border-primary/30 text-primary hover:bg-primary/10 font-body text-xs">
                <ChevronLeft className="w-4 h-4 mr-1" /> All Problems
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateQuestion(-1)}
                  disabled={filteredQuestions.findIndex(q => q.id === selectedQuestion.id) === 0}
                  className="border-primary/30 text-primary hover:bg-primary/10 font-body text-xs">
                  <ChevronLeft className="w-3 h-3" /> Prev
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateQuestion(1)}
                  disabled={filteredQuestions.findIndex(q => q.id === selectedQuestion.id) === filteredQuestions.length - 1}
                  className="border-primary/30 text-primary hover:bg-primary/10 font-body text-xs">
                  Next <ChevronRight className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_300px] gap-6">
              {/* Question + Practice */}
              <div className="space-y-6">
                {/* Question Header */}
                <div className="glass-gold-deep rounded-2xl p-6 border-shine">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(selectedQuestion.id)}
                        <span className="font-body text-[10px] text-muted-foreground">Q{selectedQuestion.id}</span>
                        <DifficultyBadge difficulty={selectedQuestion.difficulty} />
                        <span className="font-body text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{selectedQuestion.type}</span>
                        <span className="font-body text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">🔥 {selectedQuestion.frequency}</span>
                      </div>
                      <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">{selectedQuestion.question}</h2>
                      <p className="font-body text-xs text-muted-foreground mt-1">Round {selectedQuestion.roundId}: {selectedQuestion.roundName}</p>
                    </div>
                    <button onClick={() => toggleBookmark(selectedQuestion.id)} className="p-2 rounded-lg hover:bg-primary/10 transition-colors">
                      {bookmarks.has(selectedQuestion.id) ?
                        <BookmarkCheck className="w-5 h-5 text-primary" /> :
                        <Bookmark className="w-5 h-5 text-muted-foreground" />
                      }
                    </button>
                  </div>
                </div>

                {/* Answer Area */}
                <div className="glass rounded-2xl p-6">
                  <h3 className="font-body text-xs font-bold text-primary uppercase tracking-wider mb-4">Your Answer</h3>
                  <AnswerRater question={selectedQuestion} interviewerInsights={interviewerInsights} />
                </div>

                {/* Mark Solved */}
                <div className="text-center">
                  <Button onClick={() => markSolved(selectedQuestion.id)}
                    className={`font-body font-semibold text-sm ${questionStatus[selectedQuestion.id] === "solved" ? "bg-secondary text-muted-foreground" : "bg-gradient-gold text-primary-foreground shadow-gold"}`}
                    disabled={questionStatus[selectedQuestion.id] === "solved"}>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    {questionStatus[selectedQuestion.id] === "solved" ? "Solved ✓" : "Mark as Solved"}
                  </Button>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                <PracticeTimer />

                {/* Strategy Card */}
                {strategyCards[selectedQuestion.category] && (
                  <div className="glass rounded-xl p-5 border border-primary/10">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">{strategyCards[selectedQuestion.category].icon}</span>
                      <span className="font-body text-xs font-bold text-primary uppercase tracking-wider">{strategyCards[selectedQuestion.category].title}</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Hand className="w-3 h-3 text-primary" />
                          <span className="font-body text-[10px] font-bold text-muted-foreground uppercase">Body Language</span>
                        </div>
                        <div className="space-y-1">
                          {strategyCards[selectedQuestion.category].bodyLanguage.slice(0, 3).map((tip, i) => (
                            <p key={i} className="font-body text-[10px] text-muted-foreground">• {tip}</p>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Volume2 className="w-3 h-3 text-primary" />
                          <span className="font-body text-[10px] font-bold text-muted-foreground uppercase">Voice & Tone</span>
                        </div>
                        <div className="space-y-1">
                          {strategyCards[selectedQuestion.category].voiceTone.slice(0, 2).map((tip, i) => (
                            <p key={i} className="font-body text-[10px] text-muted-foreground">• {tip}</p>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Sparkles className="w-3 h-3 text-primary" />
                          <span className="font-body text-[10px] font-bold text-muted-foreground uppercase">Key Phrases</span>
                        </div>
                        <div className="space-y-1">
                          {strategyCards[selectedQuestion.category].keyPhrases.slice(0, 3).map((p, i) => (
                            <p key={i} className="font-body text-[10px] text-primary italic">"{p}"</p>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <XCircle className="w-3 h-3 text-destructive" />
                          <span className="font-body text-[10px] font-bold text-muted-foreground uppercase">Avoid</span>
                        </div>
                        <div className="space-y-1">
                          {strategyCards[selectedQuestion.category].avoid.slice(0, 2).map((tip, i) => (
                            <p key={i} className="font-body text-[10px] text-muted-foreground">• {tip}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Round Pro Tips */}
                <div className="glass-gold rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-4 h-4 text-primary" />
                    <span className="font-body text-xs font-bold text-primary uppercase tracking-wider">Pro Tips</span>
                  </div>
                  <div className="space-y-3">
                    {rounds.find(r => r.id === selectedQuestion.roundId)?.questions.length && (
                      <>
                        <div className="flex items-start gap-2">
                          <Star className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                          <p className="font-body text-xs text-muted-foreground">{selectedQuestion.psychTip}</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <Zap className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                          <p className="font-body text-xs text-muted-foreground">{selectedQuestion.biasTag}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ═══ LIST VIEW ═══ */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Filter Bar */}
            <div className="glass rounded-xl p-4 mb-6 space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions..." className="pl-10 bg-secondary border-border font-body text-sm" />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                  {(["All", "Easy", "Medium", "Hard"] as const).map((d) => (
                    <button key={d} onClick={() => setFilterDifficulty(d)}
                      className={`font-body text-[10px] px-3 py-1.5 rounded-full transition-all ${
                        filterDifficulty === d
                          ? d === "Easy" ? "bg-emerald-500/20 text-emerald-400"
                            : d === "Medium" ? "bg-yellow-500/20 text-yellow-400"
                            : d === "Hard" ? "bg-red-500/20 text-red-400"
                            : "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}>
                      {d}
                    </button>
                  ))}
                </div>
                <div className="h-4 w-px bg-border" />
                <div className="flex flex-wrap items-center gap-1">
                  {categories.map((c) => (
                    <button key={c} onClick={() => setFilterCategory(c)}
                      className={`font-body text-[10px] px-3 py-1.5 rounded-full transition-all ${
                        filterCategory === c ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}>
                      {c}
                    </button>
                  ))}
                </div>
                <div className="h-4 w-px bg-border" />
                <div className="flex items-center gap-1">
                  {(["All", "Solved", "Unsolved", "Bookmarked"] as const).map((s) => (
                    <button key={s} onClick={() => setFilterStatus(s)}
                      className={`font-body text-[10px] px-3 py-1.5 rounded-full transition-all ${
                        filterStatus === s ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
                <div className="h-4 w-px bg-border" />
                <div className="flex items-center gap-1">
                  <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
                  {(["round", "difficulty", "frequency"] as const).map((s) => (
                    <button key={s} onClick={() => setSortBy(s)}
                      className={`font-body text-[10px] px-3 py-1.5 rounded-full transition-all capitalize ${
                        sortBy === s ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <p className="font-body text-xs text-muted-foreground">{filteredQuestions.length} questions</p>
            </div>

            {/* Question Cards */}
            <div className="space-y-2">
              {filteredQuestions.map((q, i) => (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => openQuestion(q)}
                  className={`glass rounded-xl p-4 cursor-pointer hover:glass-gold transition-all duration-300 group border-l-4 ${
                    questionStatus[q.id] === "solved"
                      ? "border-l-emerald-500 bg-emerald-500/[0.02]"
                      : questionStatus[q.id] === "attempted"
                      ? "border-l-yellow-500"
                      : q.difficulty === "Easy" ? "border-l-emerald-500/30"
                      : q.difficulty === "Medium" ? "border-l-yellow-500/30"
                      : "border-l-red-500/30"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="shrink-0">{getStatusIcon(q.id)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-body text-[10px] text-muted-foreground">Q{q.id}</span>
                        <p className="font-body text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">{q.question}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="font-body text-[10px] text-muted-foreground">R{q.roundId}: {q.roundName}</span>
                        <span className="font-body text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{q.type}</span>
                        <span className="font-body text-[10px] text-primary">🔥 {q.frequency}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <DifficultyBadge difficulty={q.difficulty} />
                      <button onClick={(e) => { e.stopPropagation(); toggleBookmark(q.id); }}
                        className="p-1 rounded hover:bg-primary/10 transition-colors">
                        {bookmarks.has(q.id) ?
                          <BookmarkCheck className="w-4 h-4 text-primary" /> :
                          <Bookmark className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        }
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredQuestions.length === 0 && (
              <div className="text-center py-16">
                <Search className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-body text-sm text-muted-foreground">No questions match your filters</p>
              </div>
            )}
          </motion.div>
        )}

        {/* ═══ ENHANCED BENEFITS ═══ */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="glass-gold-deep rounded-2xl p-8 glow-gold mt-12 mb-8 border-shine">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2 text-center">
            Why This <span className="text-gradient-gold">Works</span>
          </h2>
          <p className="font-body text-sm text-muted-foreground text-center mb-8">9 AI-powered dimensions working together to make you unforgettable</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Brain, title: "Neuroscience-Backed", desc: "Every ideal answer applies cognitive biases that make you memorable — Halo Effect, Anchoring, Serial Position." },
              { icon: TrendingUp, title: "Data-Driven", desc: "Questions sourced from 1M+ interview patterns. 99% probability these exact questions appear." },
              { icon: Shield, title: "Common Mistakes Exposed", desc: "Know what NOT to say. Most candidates fail because of predictable mistakes — we show you every trap." },
              { icon: UserSearch, title: "Interviewer Psychology Decoder", desc: "AI analyzes your interviewer's personality, communication style, and preferences from their social media." },
              { icon: Shirt, title: "Dress Code Intelligence", desc: "What to wear based on company culture analysis. Colors affect perception — navy = trust, black = authority." },
              { icon: Hand, title: "Body Language Coach", desc: "Subject-specific body language tips: when to lean in, how to gesture, where to look. Nonverbal is 55% of communication." },
              { icon: Sparkles, title: "AI Answer Improver", desc: "Get your answer rewritten by AI using the exact psychology patterns that impress interviewers." },
              { icon: Target, title: "Personalized Strategy", desc: "Company research, interviewer archetypes, and personality-matched response styles — no generic advice." },
              { icon: BarChart3, title: "Real-Time Confidence Score", desc: "Live confidence meter as you type — see your answer strength grow with each specific detail you add." },
            ].map((b, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.05 }}
                className="glass rounded-xl p-6 text-center lift-hover">
                <b.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-body text-sm font-bold text-foreground mb-2">{b.title}</h3>
                <p className="font-body text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ═══ TESTIMONIALS ═══ */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="glass rounded-2xl p-8 mb-8">
          <h2 className="font-display text-xl font-bold text-foreground mb-6 text-center">
            What Users Say
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: "Priya S.", role: "SDE-2 at Amazon", quote: "The interviewer research feature is insane. It told me my interviewer loves system design trade-offs — I emphasized that and got the offer.", rating: 5 },
              { name: "Alex M.", role: "Frontend Dev at Stripe", quote: "The AI answer rater caught weaknesses I never noticed. My 'tell me about yourself' went from a 45 to a 92. Game changer.", rating: 5 },
              { name: "Rahul K.", role: "SDE at Google", quote: "The dress code guide + body language tips gave me so much confidence. I walked in knowing exactly how to present myself. Got the offer.", rating: 5 },
            ].map((t, i) => (
              <div key={i} className="glass-gold rounded-xl p-5">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 text-primary fill-primary" />
                  ))}
                </div>
                <p className="font-body text-xs text-muted-foreground italic mb-3">"{t.quote}"</p>
                <div>
                  <p className="font-body text-xs font-bold text-foreground">{t.name}</p>
                  <p className="font-body text-[10px] text-primary">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-center">
          <p className="font-body text-sm text-muted-foreground mb-4">
            💡 <span className="text-primary font-semibold">Pro Tip:</span> Practice each answer out loud 3 times. Your brain retains spoken words 40% better than read words.
          </p>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default InterviewPrep;
