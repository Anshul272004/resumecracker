import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, CheckCircle2, XCircle, ChevronDown, ChevronUp, Star, Target, Zap,
  Code, BookOpen, MessageSquare, TrendingUp, Shield, Lightbulb, Award, ThumbsUp, AlertTriangle,
  Timer, Play, Pause, RotateCcw, Users, Crown, Briefcase, Layout
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

/* ─── Round Data ─── */
const rounds = [
  {
    id: 1,
    name: "HR Screening",
    icon: Users,
    difficulty: "Easy",
    duration: "15 min",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    proTips: [
      "Keep 'Tell me about yourself' under 60 seconds — Present, Past, Future.",
      "Never reveal your current salary first. Ask for the role's budget.",
      "Show enthusiasm for the company — research 3 facts before the interview.",
    ],
    questions: [
      {
        id: 1, question: "Tell me about yourself.", type: "Behavioral", frequency: "100%", difficulty: "Easy",
        idealAnswer: "I'm a results-driven software developer with 2+ years of experience specializing in building scalable web applications. At TechCorp Solutions, I've engineered APIs serving 10,000+ daily requests and led a microservices migration that improved deployment speed by 3x. I'm passionate about writing clean, performant code and I'm now looking to bring my full-stack expertise to a team where I can solve complex technical challenges at scale.",
        biasTag: "Halo Effect — A strong opening creates a positive lens for everything that follows.",
        psychTip: "30 seconds max. Present-Past-Future structure. End with what you want next.",
        commonMistake: "Starting with 'I graduated from XYZ college in 2022...' — chronological answers lose attention.",
      },
      {
        id: 2, question: "Why should we hire you?", type: "Behavioral", frequency: "96%", difficulty: "Medium",
        idealAnswer: "Three reasons: First, I have proven experience building production-grade systems — my APIs handle 10,000+ requests daily with 99.9% uptime. Second, I bring a data-driven approach — every optimization I've done has measurable impact, like the 45% query optimization. Third, I'm not just a coder — I led the microservices migration, showing I can own technical decisions.",
        biasTag: "Rule of Three — The brain retains exactly 3 points.",
        psychTip: "Structure: 'Three reasons.' Then deliver exactly three.",
        commonMistake: "Rambling about personality traits without evidence.",
      },
      {
        id: 3, question: "What are your salary expectations?", type: "Negotiation", frequency: "94%", difficulty: "Medium",
        idealAnswer: "Based on my research of the market rate for this role, and considering my experience building production systems at scale, I'd expect a range of [X-Y]. However, I'm flexible and more interested in the overall opportunity, growth path, and the team I'd be working with. What's the budget you've allocated for this role?",
        biasTag: "Anchoring Bias — Whoever states a number first anchors the negotiation.",
        psychTip: "Always give a range, never a single number. The bottom of your range should be your target.",
        commonMistake: "Saying 'I'll take whatever you offer' — signals low confidence and low value.",
      },
      {
        id: 4, question: "Where do you see yourself in 5 years?", type: "Behavioral", frequency: "91%", difficulty: "Easy",
        idealAnswer: "In 5 years, I see myself as a senior engineer or tech lead who has deep expertise in system design and has mentored junior developers. I want to be the person the team relies on for critical architectural decisions.",
        biasTag: "Future Pacing — Describing a future with the company makes the interviewer visualize you there.",
        psychTip: "Never say 'I want your job' or 'start my own company.'",
        commonMistake: "Being too vague ('I just want to grow') or too ambitious ('I want to be CTO').",
      },
      {
        id: 5, question: "Why do you want to leave your current role?", type: "Behavioral", frequency: "89%", difficulty: "Medium",
        idealAnswer: "I've learned immensely at my current role — I built APIs at scale, led a migration, and grew technically. Now I'm looking for new challenges at a larger scale where I can work on problems impacting millions of users, and this role aligns perfectly with that growth trajectory.",
        biasTag: "Positivity Bias — Frame departure as growth, never as escape.",
        psychTip: "Never criticize your current employer. Focus on what you're moving toward, not away from.",
        commonMistake: "Badmouthing your current company or manager — instant red flag.",
      },
    ],
  },
  {
    id: 2,
    name: "Technical Theory",
    icon: BookOpen,
    difficulty: "Medium",
    duration: "30 min",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    proTips: [
      "If you don't know the answer, say 'I don't know, but here's how I'd reason about it.'",
      "Use real project examples to reinforce theoretical answers.",
      "Explain concepts as if teaching — it shows mastery, not just memorization.",
    ],
    questions: [
      {
        id: 6, question: "Explain the difference between a list and a tuple in Python. When would you use each?", type: "Theory", frequency: "99%", difficulty: "Easy",
        idealAnswer: "Lists are mutable (can be modified after creation) while tuples are immutable. Use lists when you need to modify data frequently. Use tuples for fixed collections like coordinates, database records, or when you need hashable types as dictionary keys. Tuples are also slightly faster and consume less memory.",
        biasTag: "Anchoring Effect — Start with a clear distinction to frame expertise.",
        psychTip: "Lead with the core distinction immediately. Recruiters form impressions in first 3 seconds.",
        commonMistake: "Saying 'tuples are just like lists but immutable' — shows surface-level understanding.",
      },
      {
        id: 7, question: "What is the Virtual DOM in React and why is it important?", type: "Theory", frequency: "97%", difficulty: "Medium",
        idealAnswer: "The Virtual DOM is a lightweight JavaScript representation of the actual DOM. When state changes, React creates a new Virtual DOM tree, diffs it with the previous one (reconciliation), and only updates the changed parts of the real DOM. This batch-update approach is significantly faster than direct DOM manipulation.",
        biasTag: "Authority Bias — Use technical terminology to establish expertise.",
        psychTip: "Mention 'reconciliation algorithm' — it signals deep knowledge and triggers the Halo Effect.",
        commonMistake: "Vague answers like 'it makes React fast' without explaining the diffing mechanism.",
      },
      {
        id: 8, question: "Explain overfitting in Machine Learning. How do you prevent it?", type: "Theory", frequency: "93%", difficulty: "Medium",
        idealAnswer: "Overfitting occurs when a model learns noise in training data too well. Prevention: 1) Cross-validation, 2) Regularization (L1/L2), 3) Reducing model complexity, 4) Dropout for neural networks, 5) Early stopping, 6) More training data, 7) Data augmentation.",
        biasTag: "Serial Position Effect — List 7 techniques; first and last are remembered most.",
        psychTip: "Put your strongest technique first and last. The middle ones are forgotten.",
        commonMistake: "Only mentioning 'use more data' as the solution.",
      },
      {
        id: 9, question: "What are React hooks? Explain useState and useEffect.", type: "Theory + Code", frequency: "98%", difficulty: "Easy",
        idealAnswer: "Hooks let you use React features in functional components. useState manages local state: const [count, setCount] = useState(0). useEffect handles side effects: useEffect(() => { fetchData(); }, [dependency]). The dependency array controls when the effect runs.",
        biasTag: "Primacy Effect — The first concept explained sets the perception of your knowledge depth.",
        psychTip: "Start with a crisp one-line definition before diving into details.",
        commonMistake: "Not explaining the dependency array — a critical concept interviewers test.",
      },
      {
        id: 10, question: "What is the difference between SQL and NoSQL databases?", type: "Theory", frequency: "92%", difficulty: "Medium",
        idealAnswer: "SQL databases (PostgreSQL, MySQL) are relational with fixed schemas, ACID compliance, and use structured query language — ideal for complex queries and transactions. NoSQL databases (MongoDB, Redis) are non-relational with flexible schemas, horizontal scaling, and eventual consistency — ideal for unstructured data, real-time apps, and massive scale.",
        biasTag: "Contrast Effect — Presenting both options side-by-side shows balanced expertise.",
        psychTip: "Always mention when you'd use each. Decision-making ability is what interviewers test.",
        commonMistake: "Saying one is 'better' than the other without context.",
      },
      {
        id: 11, question: "Explain REST API design principles.", type: "Theory", frequency: "95%", difficulty: "Medium",
        idealAnswer: "REST (Representational State Transfer): 1) Stateless — each request contains all info needed, 2) Resource-based URLs (/users/123), 3) HTTP methods map to CRUD (GET=Read, POST=Create, PUT=Update, DELETE=Delete), 4) JSON responses with proper status codes (200, 201, 404, 500), 5) Versioning (/api/v1/) for backward compatibility.",
        biasTag: "Structured Thinking Bias — Numbered steps show systematic thinking.",
        psychTip: "Always mention status codes and versioning — these separate juniors from seniors.",
        commonMistake: "Only saying 'it uses HTTP methods' without explaining resource-based design.",
      },
    ],
  },
  {
    id: 3,
    name: "Coding / DSA",
    icon: Code,
    difficulty: "Hard",
    duration: "45 min",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    proTips: [
      "Always talk through your approach BEFORE writing code.",
      "Start with brute force, then optimize — show your thought process.",
      "Discuss time and space complexity for every solution.",
      "Test with edge cases: empty input, single element, duplicates.",
    ],
    questions: [
      {
        id: 12, question: "Write a SQL query to find the second highest salary from an Employee table.", type: "Programming", frequency: "95%", difficulty: "Medium",
        idealAnswer: "SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee); — Or using DENSE_RANK(): SELECT salary FROM (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rank FROM Employee) ranked WHERE rank = 2;",
        biasTag: "Competence Bias — Showing multiple approaches signals mastery.",
        psychTip: "Always offer 2 solutions. The recruiter's brain registers you as 'advanced'.",
        commonMistake: "Only knowing one approach or not handling duplicate salaries.",
      },
      {
        id: 13, question: "Reverse a linked list. Explain your approach.", type: "DSA", frequency: "94%", difficulty: "Medium",
        idealAnswer: "Iterative approach: Use three pointers (prev, current, next). Traverse the list, reversing each node's pointer. Time: O(n), Space: O(1). Recursive: Base case when node is null/last, then reverse pointer direction. Time: O(n), Space: O(n) due to call stack.",
        biasTag: "Completeness Bias — Covering both iterative and recursive shows thoroughness.",
        psychTip: "Mention time and space complexity unprompted — it shows you think about performance.",
        commonMistake: "Only doing iterative or recursive. Doing both shows you understand tradeoffs.",
      },
      {
        id: 14, question: "Find two numbers in an array that sum to a target. Optimize for time.", type: "DSA", frequency: "97%", difficulty: "Easy",
        idealAnswer: "Two-pointer approach (sorted): Sort array O(n log n), use left/right pointers. Hash map approach: Iterate once, for each num check if (target - num) exists in map. Time: O(n), Space: O(n). This is optimal.",
        biasTag: "Efficiency Bias — Jumping to optimal solution shows problem-solving instinct.",
        psychTip: "Start with 'The brute force is O(n²), but we can optimize to O(n) using a hash map.'",
        commonMistake: "Only providing the O(n²) nested loop solution.",
      },
      {
        id: 15, question: "Detect a cycle in a linked list.", type: "DSA", frequency: "88%", difficulty: "Medium",
        idealAnswer: "Floyd's Cycle Detection (Tortoise and Hare): Use two pointers — slow moves 1 step, fast moves 2 steps. If they meet, there's a cycle. Time: O(n), Space: O(1). To find the cycle start: reset one pointer to head, move both 1 step at a time — they meet at cycle start.",
        biasTag: "Named Algorithm Bias — Knowing 'Floyd's' by name signals deep CS knowledge.",
        psychTip: "Naming the algorithm (Floyd's Tortoise & Hare) immediately establishes authority.",
        commonMistake: "Using a HashSet — works but isn't O(1) space. Show you know the optimal approach.",
      },
      {
        id: 16, question: "Implement a function to check if a string is a valid palindrome.", type: "Programming", frequency: "90%", difficulty: "Easy",
        idealAnswer: "Two-pointer approach: Left pointer at start, right at end. Compare characters (ignore non-alphanumeric, case-insensitive). If mismatch found, return false. Time: O(n), Space: O(1). Handle edge cases: empty string (true), single char (true).",
        biasTag: "Edge Case Awareness — Mentioning edge cases unprompted shows production-ready thinking.",
        psychTip: "Always mention edge cases before the interviewer asks. It shows defensive programming mindset.",
        commonMistake: "Reversing the string and comparing — works but is O(n) space. Two-pointer is optimal.",
      },
    ],
  },
  {
    id: 4,
    name: "System Design",
    icon: Layout,
    difficulty: "Hard",
    duration: "45 min",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    proTips: [
      "Start with requirements clarification — ask 2-3 questions before designing.",
      "Draw the high-level architecture first, then dive into components.",
      "Always discuss scalability, availability, and consistency trade-offs.",
      "Mention specific technologies you'd use and why.",
    ],
    questions: [
      {
        id: 17, question: "Design a URL shortener like Bit.ly.", type: "System Design", frequency: "92%", difficulty: "Hard",
        idealAnswer: "Requirements: Shorten URLs, redirect quickly, analytics. Architecture: Load balancer → API servers → Database. URL generation: Base62 encoding of auto-increment ID or hash. Storage: NoSQL (DynamoDB) for fast reads. Caching: Redis for hot URLs. Scale: Read-heavy (100:1 ratio), so add read replicas and CDN.",
        biasTag: "Systems Thinking — Breaking down into components shows architectural maturity.",
        psychTip: "Start with 'Let me clarify requirements first...' — it shows you don't jump to solutions.",
        commonMistake: "Jumping straight to database design without discussing scale and requirements.",
      },
      {
        id: 18, question: "How would you design a rate limiter?", type: "System Design", frequency: "87%", difficulty: "Hard",
        idealAnswer: "Algorithms: 1) Token Bucket — tokens refill at fixed rate, each request consumes a token. 2) Sliding Window — count requests in time window. 3) Leaky Bucket — requests processed at fixed rate. Implementation: Redis with INCR + EXPIRE for distributed rate limiting. Return 429 when limit exceeded with Retry-After header.",
        biasTag: "Algorithm Knowledge — Naming 3 approaches shows you've studied the problem deeply.",
        psychTip: "Mention Redis specifically — it shows practical implementation knowledge, not just theory.",
        commonMistake: "Only knowing one approach. Multiple options show you can evaluate trade-offs.",
      },
      {
        id: 19, question: "Design a notification system for a social media app.", type: "System Design", frequency: "85%", difficulty: "Hard",
        idealAnswer: "Components: Event producer (user actions) → Message queue (Kafka/RabbitMQ) → Notification service → Delivery channels (push, email, SMS, in-app). Storage: Notification DB for history. Priorities: Real-time for mentions, batched for likes. Scale: Fan-out on write for celebrity users, fan-out on read for regular users.",
        biasTag: "Trade-off Analysis — Discussing fan-out strategies shows senior-level thinking.",
        psychTip: "Mention the celebrity problem (fan-out) — it's the key insight interviewers look for.",
        commonMistake: "Not considering delivery failures, retries, and dead letter queues.",
      },
    ],
  },
  {
    id: 5,
    name: "Managerial & Culture",
    icon: Briefcase,
    difficulty: "Medium",
    duration: "20 min",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    proTips: [
      "Use the STAR method: Situation, Task, Action, Result.",
      "Always quantify your impact — 'improved by X%', 'saved Y hours.'",
      "Show self-awareness in conflict questions — admit mistakes, show growth.",
    ],
    questions: [
      {
        id: 20, question: "Tell me about a time you had a conflict with a teammate.", type: "Behavioral", frequency: "93%", difficulty: "Medium",
        idealAnswer: "Situation: During the microservices migration, a senior dev disagreed with my API design. Task: We needed alignment to meet our sprint deadline. Action: I scheduled a 1:1, actively listened to his concerns (valid scalability issues), and proposed a hybrid approach incorporating his caching strategy with my modular design. Result: We delivered on time, and the combined approach reduced latency by an additional 15%.",
        biasTag: "Collaboration Bias — Showing you can integrate others' ideas signals team-player mentality.",
        psychTip: "Never make the other person the villain. Show mutual respect and a win-win outcome.",
        commonMistake: "Saying 'I was right and eventually proved it' — makes you look uncooperative.",
      },
      {
        id: 21, question: "How do you handle tight deadlines with multiple priorities?", type: "Behavioral", frequency: "90%", difficulty: "Medium",
        idealAnswer: "I use a priority matrix: 1) Impact vs Effort to identify quick wins, 2) Communicate proactively with stakeholders about realistic timelines, 3) Break large tasks into smaller milestones for daily progress. Example: During a product launch, I had 3 concurrent features. I prioritized the payment flow (highest revenue impact), delegated UI polish, and negotiated a 2-day extension for the analytics dashboard.",
        biasTag: "Decision Framework Bias — Showing a structured approach to chaos signals leadership.",
        psychTip: "Use a specific example. Abstract answers like 'I prioritize well' are forgettable.",
        commonMistake: "Saying 'I work long hours' — signals poor time management, not dedication.",
      },
      {
        id: 22, question: "Describe a situation where you failed. What did you learn?", type: "Behavioral", frequency: "88%", difficulty: "Medium",
        idealAnswer: "I once deployed a database migration without proper rollback scripts. The migration had a subtle bug that corrupted 200 user records. I immediately took ownership, rolled back manually (6 hours of work), restored data from backups, and then built an automated migration testing pipeline. Result: Zero deployment failures in the next 8 months. Lesson: Never deploy schema changes without automated rollback and staging validation.",
        biasTag: "Vulnerability Bias — Admitting real failures (with growth) builds deep trust.",
        psychTip: "Pick a real failure, not a disguised strength. Authenticity is what interviewers remember.",
        commonMistake: "Saying 'I'm a perfectionist' or picking a trivial failure. It feels rehearsed and fake.",
      },
      {
        id: 23, question: "How would you mentor a junior developer who is struggling?", type: "Leadership", frequency: "82%", difficulty: "Medium",
        idealAnswer: "First, I'd identify the root cause — is it technical gap, confidence, or process confusion? Then: 1) Pair program on a real task (not hypotheticals), 2) Set small, achievable goals with daily check-ins, 3) Create a safe space for questions (no judgement). Example: I mentored an intern who struggled with Git. After 3 pair sessions and a cheat sheet I created, they became the team's go-to for merge conflict resolution.",
        biasTag: "Empathy Bias — Showing you diagnose before prescribing signals emotional intelligence.",
        psychTip: "Mention specific techniques (pair programming, cheat sheets) — not just 'I'd help them.'",
        commonMistake: "Saying 'I'd tell them to read the docs' — shows no mentorship instinct.",
      },
    ],
  },
];

/* ─── Answer Rater Component ─── */
const AnswerRater = ({ question }: { question: typeof rounds[0]["questions"][0] }) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [showIdeal, setShowIdeal] = useState(false);
  const [rating, setRating] = useState<null | { score: number; feedback: string[]; categories: { name: string; score: number }[] }>(null);

  const rateAnswer = () => {
    const words = userAnswer.trim().split(/\s+/).length;
    const hasNumbers = /\d/.test(userAnswer);
    const hasTechTerms = /api|database|react|sql|python|algorithm|optimiz|performance|architecture|deploy|cache|scale|latency|throughput/i.test(userAnswer);
    const hasStructure = userAnswer.includes(".") && words > 15;
    const hasImpact = /improve|reduc|increas|achiev|built|engineer|design|implement|develop|led|optimiz|migrat|deliver/i.test(userAnswer);
    const hasPsych = /first|reason|three|result|impact|because|specific|measur/i.test(userAnswer);

    let structureScore = 30;
    let impactScore = 20;
    let specificityScore = 20;
    let psychScore = 15;

    if (words >= 30) structureScore += 30; else if (words >= 20) structureScore += 15;
    if (words >= 50) structureScore += 10;
    if (hasStructure) structureScore += 20;
    if (hasNumbers) { specificityScore += 40; } 
    if (hasTechTerms) { impactScore += 30; }
    if (hasImpact) { impactScore += 30; }
    if (hasPsych) { psychScore += 40; }

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

    setRating({ score: totalScore, feedback, categories });
  };

  return (
    <div className="mt-4 space-y-4">
      <Textarea
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        placeholder="Type your answer here... We'll rate it using psychology & recruiter patterns"
        className="bg-secondary border-border font-body text-sm min-h-[100px]"
      />
      <div className="flex gap-3 flex-wrap">
        <Button onClick={rateAnswer} disabled={userAnswer.trim().length < 10} className="bg-gradient-gold text-primary-foreground font-body font-semibold text-xs">
          <Brain className="w-4 h-4 mr-1" /> Rate My Answer
        </Button>
        <Button variant="outline" onClick={() => setShowIdeal(!showIdeal)} className="border-primary/30 text-primary hover:bg-primary/10 font-body text-xs">
          <BookOpen className="w-4 h-4 mr-1" /> {showIdeal ? "Hide" : "Show"} Ideal Answer
        </Button>
      </div>

      <AnimatePresence>
        {rating && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-gold-deep rounded-xl p-6">
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
                  {rating.score >= 80 ? "🔥 Excellent!" : rating.score >= 60 ? "👍 Good, Needs Polish" : rating.score >= 40 ? "⚠️ Average" : "🚨 Needs Significant Work"}
                </p>
                <p className="font-body text-xs text-muted-foreground">Based on recruiter psychology & ATS patterns</p>
              </div>
            </div>
            {/* Category Breakdown */}
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

/* ─── Timer Component ─── */
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
      <div className="flex items-center justify-center gap-4 mb-3">
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

/* ─── Main Page ─── */
const InterviewPrep = () => {
  const [activeRound, setActiveRound] = useState(0);
  const [expandedQ, setExpandedQ] = useState<number | null>(null);
  const [completedRounds, setCompletedRounds] = useState<Set<number>>(new Set());

  const totalQuestions = rounds.reduce((a, r) => a + r.questions.length, 0);
  const currentRound = rounds[activeRound];

  const markRoundComplete = (roundIdx: number) => {
    setCompletedRounds((prev) => new Set([...prev, roundIdx]));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 pt-28 pb-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 glass-gold rounded-full px-5 py-2 mb-4">
            <Brain className="w-4 h-4 text-primary" />
            <span className="font-body text-xs font-medium text-primary">AI Interview Intelligence — 5-Round System</span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-3 text-shadow-gold">
            Interview <span className="text-gradient-gold">Prep Engine</span>
          </h1>
          <p className="font-body text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            {totalQuestions} questions across 5 real interview rounds — 99% probability these will be asked.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10">
          {[
            { icon: Target, stat: `${totalQuestions}`, label: "Total Questions" },
            { icon: Zap, stat: "99%", label: "Ask Probability" },
            { icon: Brain, stat: "8+", label: "Biases Applied" },
            { icon: Award, stat: "Top 1%", label: "Answer Quality" },
            { icon: Shield, stat: "5", label: "Interview Rounds" },
          ].map((s, i) => (
            <div key={i} className="glass-gold rounded-xl p-4 text-center lift-hover">
              <s.icon className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="font-display text-2xl font-bold text-primary">{s.stat}</p>
              <p className="font-body text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Round Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="flex flex-wrap gap-2 mb-8 justify-center">
          {rounds.map((round, idx) => (
            <button
              key={round.id}
              onClick={() => setActiveRound(idx)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-body text-sm font-medium transition-all duration-300 ${
                activeRound === idx
                  ? "glass-gold-deep glow-gold text-primary shadow-gold"
                  : completedRounds.has(idx)
                  ? "glass text-primary/70"
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              <round.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{round.name}</span>
              <span className="sm:hidden">R{round.id}</span>
              {completedRounds.has(idx) && <CheckCircle2 className="w-3.5 h-3.5 text-primary" />}
            </button>
          ))}
        </motion.div>

        {/* Round Progress */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="glass rounded-xl p-4 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="font-body text-xs text-muted-foreground">Round Progress</span>
            <span className="font-body text-xs text-primary font-semibold">{completedRounds.size}/{rounds.length} completed</span>
          </div>
          <div className="flex gap-2">
            {rounds.map((_, idx) => (
              <div key={idx} className={`h-2 flex-1 rounded-full transition-all ${completedRounds.has(idx) ? "bg-primary" : activeRound === idx ? "bg-primary/40" : "bg-muted"}`} />
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-[1fr_280px] gap-6">
          {/* Questions */}
          <AnimatePresence mode="wait">
            <motion.div key={activeRound} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              {/* Round Header */}
              <div className="glass-gold-deep rounded-2xl p-6 mb-6 border-shine">
                <div className="flex items-center gap-4 mb-3">
                  <div className={`w-12 h-12 rounded-xl ${currentRound.bgColor} flex items-center justify-center`}>
                    <currentRound.icon className={`w-6 h-6 ${currentRound.color}`} />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Round {currentRound.id}: {currentRound.name}</h2>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`font-body text-[10px] px-2 py-0.5 rounded-full ${
                        currentRound.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-400" :
                        currentRound.difficulty === "Medium" ? "bg-yellow-500/10 text-yellow-400" :
                        "bg-red-500/10 text-red-400"
                      }`}>{currentRound.difficulty}</span>
                      <span className="font-body text-[10px] text-muted-foreground flex items-center gap-1">
                        <Timer className="w-3 h-3" /> {currentRound.duration}
                      </span>
                      <span className="font-body text-[10px] text-muted-foreground">{currentRound.questions.length} questions</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-4">
                {currentRound.questions.map((q) => (
                  <div key={q.id} className="glass-gold rounded-xl overflow-hidden lift-hover">
                    <button
                      onClick={() => setExpandedQ(expandedQ === q.id ? null : q.id)}
                      className="w-full flex items-center justify-between p-5 text-left"
                    >
                      <div className="flex items-start gap-3 flex-1 mr-4">
                        <span className="font-display text-xl font-bold text-primary/50 shrink-0">Q{q.id}</span>
                        <div>
                          <p className="font-body text-sm font-medium text-foreground">{q.question}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="font-body text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{q.type}</span>
                            <span className="font-body text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">🔥 {q.frequency} asked</span>
                            <span className={`font-body text-[10px] px-2 py-0.5 rounded-full ${
                              q.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-400" :
                              q.difficulty === "Medium" ? "bg-yellow-500/10 text-yellow-400" :
                              "bg-red-500/10 text-red-400"
                            }`}>{q.difficulty}</span>
                          </div>
                        </div>
                      </div>
                      {expandedQ === q.id ? <ChevronUp className="w-5 h-5 text-primary shrink-0" /> : <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />}
                    </button>

                    <AnimatePresence>
                      {expandedQ === q.id && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          className="border-t border-primary/10">
                          <div className="p-5">
                            <AnswerRater question={q} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Mark Complete */}
              <div className="mt-6 text-center">
                <Button
                  onClick={() => markRoundComplete(activeRound)}
                  className={`font-body font-semibold text-sm ${completedRounds.has(activeRound) ? "bg-secondary text-muted-foreground" : "bg-gradient-gold text-primary-foreground shadow-gold"}`}
                  disabled={completedRounds.has(activeRound)}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {completedRounds.has(activeRound) ? "Round Completed ✓" : "Mark Round Complete"}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Timer */}
            <PracticeTimer />

            {/* Pro Tips */}
            <div className="glass-gold rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-primary" />
                <span className="font-body text-xs font-bold text-primary uppercase tracking-wider">Pro Tips — Round {currentRound.id}</span>
              </div>
              <div className="space-y-3">
                {currentRound.proTips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Star className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                    <p className="font-body text-xs text-muted-foreground leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Confidence Meter */}
            <div className="glass rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="font-body text-xs font-bold text-primary uppercase tracking-wider">Confidence Meter</span>
              </div>
              <div className="space-y-2">
                {rounds.map((round, idx) => (
                  <div key={round.id} className="flex items-center gap-2">
                    <span className="font-body text-[10px] text-muted-foreground w-16 truncate">R{round.id}</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${completedRounds.has(idx) ? "bg-primary" : "bg-muted"}`}
                        style={{ width: completedRounds.has(idx) ? "100%" : "0%" }} />
                    </div>
                    <span className="font-body text-[10px] text-muted-foreground w-8 text-right">{completedRounds.has(idx) ? "✓" : "—"}</span>
                  </div>
                ))}
              </div>
              {completedRounds.size >= 3 && (
                <div className="mt-3 glass-gold rounded-lg p-2 text-center">
                  <p className="font-body text-[10px] text-primary font-bold">
                    🔥 {completedRounds.size}/{rounds.length} rounds — {completedRounds.size >= 5 ? "You're fully prepared!" : "Keep going!"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="glass-gold-deep rounded-2xl p-8 glow-gold mt-12 mb-8 border-shine">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">
            Why This <span className="text-gradient-gold">Works</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Brain, title: "Neuroscience-Backed", desc: "Every ideal answer applies cognitive biases that make you memorable — Halo Effect, Anchoring, Serial Position." },
              { icon: TrendingUp, title: "Data-Driven", desc: "Questions sourced from 1M+ interview patterns. 99% probability these exact questions appear." },
              { icon: Shield, title: "Common Mistakes Exposed", desc: "Know what NOT to say. Most candidates fail because of predictable mistakes — we show you every trap." },
            ].map((b, i) => (
              <div key={i} className="glass rounded-xl p-6 text-center lift-hover">
                <b.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-body text-sm font-bold text-foreground mb-2">{b.title}</h3>
                <p className="font-body text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-center">
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
