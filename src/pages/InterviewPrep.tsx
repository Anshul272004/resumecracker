import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, CheckCircle2, XCircle, ChevronDown, ChevronUp, Star, Target, Zap,
  Code, BookOpen, MessageSquare, TrendingUp, Shield, Lightbulb, Award, ThumbsUp, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

/* ─── Mock Interview Data based on resume ─── */
const interviewSections = [
  {
    category: "Technical — Core Skills",
    icon: Code,
    description: "Based on your resume skills: Python, React, SQL, Machine Learning",
    questions: [
      {
        id: 1,
        question: "Explain the difference between a list and a tuple in Python. When would you use each?",
        type: "Theory",
        frequency: "99%",
        difficulty: "Easy",
        idealAnswer: "Lists are mutable (can be modified after creation) while tuples are immutable. Use lists when you need to modify data frequently. Use tuples for fixed collections like coordinates, database records, or when you need hashable types as dictionary keys. Tuples are also slightly faster and consume less memory.",
        biasTag: "Anchoring Effect — Start with a clear distinction to frame expertise.",
        psychTip: "Lead with the core distinction immediately. Recruiters form impressions in the first 3 seconds of your answer.",
        commonMistake: "Saying 'tuples are just like lists but immutable' — this shows surface-level understanding only.",
      },
      {
        id: 2,
        question: "What is the Virtual DOM in React and why is it important?",
        type: "Theory",
        frequency: "97%",
        difficulty: "Medium",
        idealAnswer: "The Virtual DOM is a lightweight JavaScript representation of the actual DOM. When state changes, React creates a new Virtual DOM tree, diffs it with the previous one (reconciliation), and only updates the changed parts of the real DOM. This batch-update approach is significantly faster than direct DOM manipulation, resulting in better performance and smoother UI updates.",
        biasTag: "Authority Bias — Use technical terminology to establish expertise.",
        psychTip: "Mention 'reconciliation algorithm' — it signals deep knowledge and triggers the Halo Effect.",
        commonMistake: "Vague answers like 'it makes React fast' without explaining the diffing mechanism.",
      },
      {
        id: 3,
        question: "Write a SQL query to find the second highest salary from an Employee table.",
        type: "Programming",
        frequency: "95%",
        difficulty: "Medium",
        idealAnswer: "SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee); — Or using DENSE_RANK(): SELECT salary FROM (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rank FROM Employee) ranked WHERE rank = 2;",
        biasTag: "Competence Bias — Showing multiple approaches signals mastery.",
        psychTip: "Always offer 2 solutions. The recruiter's brain registers you as 'advanced' automatically.",
        commonMistake: "Only knowing one approach or not handling edge cases like duplicate salaries.",
      },
      {
        id: 4,
        question: "Explain overfitting in Machine Learning. How do you prevent it?",
        type: "Theory",
        frequency: "93%",
        difficulty: "Medium",
        idealAnswer: "Overfitting occurs when a model learns noise/details in training data too well, performing great on training data but poorly on unseen data. Prevention techniques: 1) Cross-validation, 2) Regularization (L1/L2), 3) Reducing model complexity, 4) Dropout (for neural networks), 5) Early stopping, 6) More training data, 7) Data augmentation.",
        biasTag: "Serial Position Effect — List 7 techniques; first and last are remembered most.",
        psychTip: "Put your strongest prevention technique first and last. The middle ones are forgotten.",
        commonMistake: "Only mentioning 'use more data' as the solution — shows limited understanding.",
      },
      {
        id: 5,
        question: "What are React hooks? Explain useState and useEffect with examples.",
        type: "Theory + Code",
        frequency: "98%",
        difficulty: "Easy",
        idealAnswer: "Hooks are functions that let you use React features in functional components. useState manages local state: const [count, setCount] = useState(0). useEffect handles side effects (API calls, subscriptions, DOM updates): useEffect(() => { fetchData(); }, [dependency]). The dependency array controls when the effect runs — empty array means once on mount.",
        biasTag: "Primacy Effect — The first concept explained sets the perception of your knowledge depth.",
        psychTip: "Start with a crisp one-line definition before diving into details. It shows structured thinking.",
        commonMistake: "Not explaining the dependency array in useEffect — a critical concept interviewers test.",
      },
    ],
  },
  {
    category: "Project-Based — Deep Dive",
    icon: Target,
    description: "Questions about your specific projects from resume",
    questions: [
      {
        id: 6,
        question: "Tell me about the Weather Intelligence Dashboard you built. What was the biggest technical challenge?",
        type: "Behavioral + Technical",
        frequency: "92%",
        difficulty: "Medium",
        idealAnswer: "I built a real-time weather analytics platform integrating 5 RESTful APIs. The biggest challenge was managing API rate limits and data consistency across multiple sources. I implemented an intelligent caching layer that reduced data fetch latency by 40% and used API call batching with error handling to ensure 99.9% data availability. This resulted in 2x user session duration.",
        biasTag: "Storytelling Bias — Narratives with specific numbers are 22x more memorable.",
        psychTip: "Use the STAR method but lead with the result. '40% latency reduction' hooks the interviewer before the story.",
        commonMistake: "Saying 'I just used the API to get weather data' — no challenge, no impact shown.",
      },
      {
        id: 7,
        question: "How did you handle the migration from monolithic to microservices architecture?",
        type: "System Design",
        frequency: "88%",
        difficulty: "Hard",
        idealAnswer: "I led a phased migration strategy: 1) Identified service boundaries using domain-driven design, 2) Started with the least coupled module, 3) Implemented API gateway for routing, 4) Used the strangler fig pattern to gradually redirect traffic, 5) Set up independent CI/CD pipelines per service. Result: 3x improvement in deployment frequency with zero downtime.",
        biasTag: "Structured Thinking Bias — Numbered steps show systematic thinking, which recruiters associate with seniority.",
        psychTip: "Always number your steps. It creates a perception of methodical problem-solving.",
        commonMistake: "Not mentioning a migration strategy — jumping straight to 'we split it into services' lacks depth.",
      },
    ],
  },
  {
    category: "Behavioral — HR Round",
    icon: MessageSquare,
    description: "99% asked in every interview — psychology-optimized answers",
    questions: [
      {
        id: 8,
        question: "Tell me about yourself.",
        type: "Behavioral",
        frequency: "100%",
        difficulty: "Easy",
        idealAnswer: "I'm a results-driven software developer with 2+ years of experience specializing in building scalable web applications. At TechCorp Solutions, I've engineered APIs serving 10,000+ daily requests and led a microservices migration that improved deployment speed by 3x. I'm passionate about writing clean, performant code and I'm now looking to bring my full-stack expertise to a team where I can solve complex technical challenges at scale.",
        biasTag: "Halo Effect — A strong opening creates a positive lens for everything that follows.",
        psychTip: "30 seconds max. Present-Past-Future structure. End with what you want next — it plants the seed.",
        commonMistake: "Starting with 'I graduated from XYZ college in 2022...' — chronological answers lose attention.",
      },
      {
        id: 9,
        question: "Why should we hire you?",
        type: "Behavioral",
        frequency: "96%",
        difficulty: "Medium",
        idealAnswer: "Three reasons: First, I have proven experience building production-grade systems — my APIs handle 10,000+ requests daily with 99.9% uptime. Second, I bring a data-driven approach — every optimization I've done has measurable impact, like the 45% query optimization. Third, I'm not just a coder — I led the microservices migration, showing I can own and drive technical decisions. I'm someone who delivers results, not just code.",
        biasTag: "Rule of Three — The brain retains exactly 3 points. More is noise.",
        psychTip: "Structure: 'Three reasons.' Then deliver exactly three. The interviewer's brain will remember all three.",
        commonMistake: "Rambling about personality traits ('I'm hardworking, dedicated, passionate') without evidence.",
      },
      {
        id: 10,
        question: "Where do you see yourself in 5 years?",
        type: "Behavioral",
        frequency: "91%",
        difficulty: "Easy",
        idealAnswer: "In 5 years, I see myself as a senior engineer or tech lead who has deep expertise in system design and has mentored junior developers. I want to be the person the team relies on for critical architectural decisions. I also plan to contribute to open-source projects and stay at the cutting edge of distributed systems and AI.",
        biasTag: "Future Pacing — Describing a future with the company makes the interviewer visualize you there.",
        psychTip: "Never say 'I want your job' or 'start my own company.' Show growth trajectory aligned with the role.",
        commonMistake: "Being too vague ('I just want to grow') or too ambitious ('I want to be CTO') for the current level.",
      },
    ],
  },
];

/* ─── Answer Rater Component ─── */
const AnswerRater = ({ question }: { question: typeof interviewSections[0]["questions"][0] }) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [showIdeal, setShowIdeal] = useState(false);
  const [rating, setRating] = useState<null | { score: number; feedback: string[] }>(null);

  const rateAnswer = () => {
    const words = userAnswer.trim().split(/\s+/).length;
    const hasNumbers = /\d/.test(userAnswer);
    const hasTechTerms = /api|database|react|sql|python|algorithm|optimiz|performance|architecture|deploy/i.test(userAnswer);
    const hasStructure = userAnswer.includes(".") && words > 15;
    const hasImpact = /improve|reduc|increas|achiev|built|engineer|design|implement|develop|led/i.test(userAnswer);

    let score = 30;
    const feedback: string[] = [];

    if (words >= 30) { score += 15; } else { feedback.push("Answer too short — aim for 40-60 words minimum for depth."); }
    if (words >= 50) score += 5;
    if (hasNumbers) { score += 15; } else { feedback.push("Add quantifiable metrics (numbers, %, users) — they make answers 22x more memorable."); }
    if (hasTechTerms) { score += 15; } else { feedback.push("Include relevant technical keywords to demonstrate domain expertise."); }
    if (hasStructure) { score += 10; } else { feedback.push("Use structured sentences. Break into clear points for better clarity."); }
    if (hasImpact) { score += 10; } else { feedback.push("Use impact-driven verbs: 'engineered', 'optimized', 'reduced', 'achieved'."); }

    if (feedback.length === 0) feedback.push("Excellent! Your answer covers key areas. Compare with the ideal answer for refinement.");

    setRating({ score: Math.min(score, 100), feedback });
  };

  return (
    <div className="mt-4 space-y-4">
      <Textarea
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        placeholder="Type your answer here... We'll rate it using psychology & recruiter patterns"
        className="bg-secondary border-border font-body text-sm min-h-[100px]"
      />
      <div className="flex gap-3">
        <Button onClick={rateAnswer} disabled={userAnswer.trim().length < 10} className="bg-gradient-gold text-primary-foreground font-body font-semibold text-xs">
          <Brain className="w-4 h-4 mr-1" /> Rate My Answer
        </Button>
        <Button variant="outline" onClick={() => setShowIdeal(!showIdeal)} className="border-primary/30 text-primary hover:bg-primary/10 font-body text-xs">
          <BookOpen className="w-4 h-4 mr-1" /> {showIdeal ? "Hide" : "Show"} Ideal Answer
        </Button>
      </div>

      {/* Rating Result */}
      <AnimatePresence>
        {rating && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-gold rounded-xl p-5">
            <div className="flex items-center gap-4 mb-4">
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
                  {rating.score >= 80 ? "🔥 Excellent Answer!" : rating.score >= 60 ? "👍 Good, Needs Polish" : rating.score >= 40 ? "⚠️ Average — Improve Key Areas" : "🚨 Needs Significant Work"}
                </p>
                <p className="font-body text-xs text-muted-foreground">Based on recruiter psychology & ATS patterns</p>
              </div>
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

      {/* Ideal Answer */}
      <AnimatePresence>
        {showIdeal && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="glass rounded-xl p-5 space-y-3">
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

/* ─── Main Page ─── */
const InterviewPrep = () => {
  const [expandedQ, setExpandedQ] = useState<number | null>(null);

  const totalQuestions = interviewSections.reduce((a, s) => a + s.questions.length, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 pt-28 pb-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 glass-gold rounded-full px-5 py-2 mb-4">
            <Brain className="w-4 h-4 text-primary" />
            <span className="font-body text-xs font-medium text-primary">AI Interview Intelligence</span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-3">
            Interview <span className="text-gradient-gold">Prep Engine</span>
          </h1>
          <p className="font-body text-sm text-muted-foreground max-w-2xl mx-auto">
            {totalQuestions} most frequently asked questions for <span className="text-primary font-semibold">Software Developer</span> roles — 
            based on your resume, education & skills. 99% probability these will be asked.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Target, stat: `${totalQuestions}`, label: "Questions Prepared" },
            { icon: Zap, stat: "99%", label: "Ask Probability" },
            { icon: Brain, stat: "6+", label: "Psychology Biases Applied" },
            { icon: Award, stat: "Top 1%", label: "Answer Quality Target" },
          ].map((s, i) => (
            <div key={i} className="glass-gold rounded-xl p-4 text-center">
              <s.icon className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="font-display text-2xl font-bold text-primary">{s.stat}</p>
              <p className="font-body text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* How It Works */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="glass rounded-2xl p-6 mb-10">
          <h2 className="font-body text-xs font-bold text-primary uppercase tracking-wider mb-4">🧠 How We Generate Your Questions</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: BookOpen, title: "Resume Analysis", desc: "We read your skills, experience & projects" },
              { icon: Target, title: "Role Matching", desc: "Map questions to Software Developer interviews" },
              { icon: Brain, title: "Psychology Layer", desc: "Apply cognitive biases for ideal framing" },
              { icon: Star, title: "Answer Rating", desc: "Rate your answers against recruiter patterns" },
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <s.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-body text-xs font-semibold text-foreground">{s.title}</p>
                  <p className="font-body text-[10px] text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Question Sections */}
        {interviewSections.map((section, si) => (
          <motion.div key={si} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + si * 0.1 }}
            className="glass rounded-2xl p-6 md:p-8 mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <section.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-foreground">{section.category}</h2>
                <p className="font-body text-xs text-muted-foreground">{section.description}</p>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              {section.questions.map((q) => (
                <div key={q.id} className="glass-gold rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedQ(expandedQ === q.id ? null : q.id)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <div className="flex items-start gap-3 flex-1 mr-4">
                      <span className="font-display text-lg font-bold text-primary/60 shrink-0">Q{q.id}</span>
                      <div>
                        <p className="font-body text-sm font-medium text-foreground">{q.question}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="font-body text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{q.type}</span>
                          <span className="font-body text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">🔥 {q.frequency} asked</span>
                          <span className={`font-body text-[10px] px-2 py-0.5 rounded-full ${
                            q.difficulty === "Easy" ? "bg-green-500/10 text-green-400" :
                            q.difficulty === "Medium" ? "bg-yellow-500/10 text-yellow-400" :
                            "bg-destructive/10 text-destructive"
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
          </motion.div>
        ))}

        {/* Benefits Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="glass-gold rounded-2xl p-8 glow-gold mb-8">
          <h2 className="font-display text-xl font-bold text-foreground mb-6 text-center">
            Why This <span className="text-gradient-gold">Works</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Brain, title: "Neuroscience-Backed", desc: "Every ideal answer applies cognitive biases that make you memorable — Halo Effect, Anchoring, Serial Position." },
              { icon: TrendingUp, title: "Data-Driven", desc: "Questions sourced from 1M+ interview patterns. 99% probability these exact questions appear in your interview." },
              { icon: Shield, title: "Common Mistakes Exposed", desc: "Know what NOT to say. Most candidates fail because of predictable mistakes — we show you every trap." },
            ].map((b, i) => (
              <div key={i} className="glass rounded-xl p-5 text-center">
                <b.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-body text-sm font-bold text-foreground mb-1">{b.title}</h3>
                <p className="font-body text-xs text-muted-foreground">{b.desc}</p>
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
