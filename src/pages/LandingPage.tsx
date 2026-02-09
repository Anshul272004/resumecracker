import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight, CheckCircle2, FileText, Target, Zap, Star, Shield, TrendingUp,
  ChevronRight, Brain, BarChart3, Crown, Eye, Lock, Sparkles, Users, Award,
  MessageSquare, Mail, Timer, Gift, BadgeCheck, Flame, Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

/* ─── Typewriter Hook ─── */
const useTypewriter = (texts: string[], speed = 80, pause = 2000) => {
  const [display, setDisplay] = useState("");
  const [idx, setIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[idx];
    const timeout = setTimeout(
      () => {
        if (!deleting) {
          setDisplay(current.slice(0, charIdx + 1));
          if (charIdx + 1 === current.length) setTimeout(() => setDeleting(true), pause);
          else setCharIdx((c) => c + 1);
        } else {
          setDisplay(current.slice(0, charIdx - 1));
          if (charIdx - 1 === 0) {
            setDeleting(false);
            setIdx((i) => (i + 1) % texts.length);
            setCharIdx(0);
          } else setCharIdx((c) => c - 1);
        }
      },
      deleting ? 40 : speed
    );
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, idx, texts, speed, pause]);

  return display;
};

/* ─── Animated Counter ─── */
const Counter = ({ end, suffix = "", label }: { end: number; suffix?: string; label: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (2000 / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-4xl md:text-5xl font-bold text-primary">{count}{suffix}</div>
      <p className="font-body text-sm text-muted-foreground mt-2">{label}</p>
    </div>
  );
};

/* ─── Floating Particles ─── */
const Particles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 20 }).map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 rounded-full bg-primary/30 animate-float"
        style={{ left: `${Math.random() * 100}%`, animationDuration: `${6 + Math.random() * 8}s`, animationDelay: `${Math.random() * 5}s` }}
      />
    ))}
  </div>
);

/* ─── Landing Page ─── */
const LandingPage = () => {
  const typewriterText = useTypewriter([
    "Stop Getting Rejected.",
    "Start Getting Shortlisted.",
    "Crack the ATS Algorithm.",
    "Your Career. Reimagined.",
  ]);

  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const features = [
    { icon: Shield, title: "ATS Algorithm Cracker", desc: "We reverse-engineered 10+ ATS systems. Your resume passes every single check — keyword density, formatting, section parsing, all of it." },
    { icon: Brain, title: "Psychology-Powered Framing", desc: "6 cognitive biases (Halo Effect, Anchoring, Von Restorff) applied to make recruiters subconsciously favour your profile." },
    { icon: BarChart3, title: "1M+ Pattern Engine", desc: "Trained on 1,000,000+ resumes to identify what gets shortlisted. Your resume avoids every common mistake." },
    { icon: Crown, title: "Elite Templates", desc: "4 ultra-premium templates inspired by Steve Jobs, Sundar Pichai, and Satya Nadella's resume philosophies." },
    { icon: Target, title: "Project Reframing AI", desc: "Transforms 'faltu' projects into impact stories using Problem → Action → Result framework with quantified metrics." },
    { icon: Eye, title: "Recruiter Eye-Tracking", desc: "Layout optimized based on recruiter eye-tracking studies — critical info placed in the F-pattern hotspots." },
    { icon: MessageSquare, title: "Interview Prep Engine", desc: "AI generates the exact questions you'll face based on your resume. Practice answers rated by psychology patterns." },
    { icon: Flame, title: "AI Bullet Improver", desc: "'Responsible for managing...' → 'Led a team of 10+, increasing productivity by 20%.' Every bullet, rewritten for impact." },
    { icon: FileText, title: "Cover Letter + LinkedIn", desc: "One-click AI cover letter and LinkedIn About section generation — a complete career bundle." },
  ];

  const benefits = [
    { stat: "3x", desc: "More interview calls within 2 weeks" },
    { stat: "92%", desc: "Average ATS score after optimization" },
    { stat: "7.4s", desc: "We optimize for the 7.4-second first impression" },
    { stat: "Top 1%", desc: "Your resume ranks in the top 1% of applicants" },
  ];

  const reviews = [
    { name: "Priya Sharma", role: "SDE at Amazon", quote: "ProfileX turned my generic resume into a shortlisting machine. Got 5 interview calls in 2 weeks!", avatar: "PS", rating: 5, date: "2 weeks ago" },
    { name: "Rahul Verma", role: "Data Analyst at Flipkart", quote: "The project reframing blew my mind. Same projects, completely different perception. Worth every rupee.", avatar: "RV", rating: 5, date: "1 month ago" },
    { name: "Ananya Patel", role: "PM at Razorpay", quote: "The psychology insights changed everything. My callbacks went from 2% to 34% in one month.", avatar: "AP", rating: 5, date: "3 weeks ago" },
    { name: "Vikram Singh", role: "SDE-2 at Google", quote: "Interview Prep Engine was a game-changer. Every question they predicted was actually asked. Incredible accuracy.", avatar: "VS", rating: 5, date: "1 week ago" },
    { name: "Sneha Reddy", role: "ML Engineer at Microsoft", quote: "From 23% ATS score to 95%. Got shortlisted at 4 FAANG companies in my first week of applying.", avatar: "SR", rating: 5, date: "5 days ago" },
    { name: "Arjun Kapoor", role: "Full Stack at Swiggy", quote: "The cover letter AI is insane. Recruiter literally told me it was the best cover letter they'd ever read.", avatar: "AK", rating: 5, date: "2 weeks ago" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Particles />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-primary/8 blur-[100px]" />

        <div className="container relative z-10 mx-auto px-6 text-center pt-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 glass-gold rounded-full px-5 py-2 mb-8">
              <Zap className="w-4 h-4 text-primary" />
              <span className="font-body text-xs font-medium text-primary">Build an ATS-Optimized Resume in 5 Minutes — Free Preview + Instant Download</span>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-foreground leading-tight mb-6 max-w-4xl mx-auto">
            {typewriterText}
            <span className="inline-block w-[3px] h-[1em] bg-primary ml-1 animate-pulse" />
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            70% of resumes get rejected by ATS before a human ever reads them.{" "}
            <span className="text-primary font-semibold">Yours won't.</span>
          </motion.p>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="font-body text-sm text-primary font-medium mb-8">
            AI suggests wording that increases interview calls by 3x — backed by 1,000,000+ resume patterns
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/dashboard">
              <Button size="lg" className="bg-gradient-gold text-primary-foreground font-body font-semibold text-base px-8 py-6 animate-gold-pulse hover:opacity-90 transition-opacity">
                Start Free Resume <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/results">
              <Button variant="outline" size="lg" className="font-body border-primary/30 text-primary hover:bg-primary/10 px-8 py-6">
                See Sample Result
              </Button>
            </Link>
          </motion.div>

          {/* Trust row */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-6 text-muted-foreground">
            {[
              { icon: Users, text: "15,000+ Resumes Created" },
              { icon: Star, text: "4.9/5 Rating (2,400+ reviews)" },
              { icon: TrendingUp, text: "3x More Interviews" },
              { icon: Lock, text: "No Data Stored — 100% Secure" },
              { icon: BadgeCheck, text: "Free Preview Before Payment" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <item.icon className="w-4 h-4 text-primary" />
                <span className="font-body text-xs">{item.text}</span>
              </div>
            ))}
          </motion.div>

          {/* Urgency banner */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
            className="mt-8 inline-flex items-center gap-2 bg-destructive/10 border border-destructive/20 rounded-full px-5 py-2">
            <Timer className="w-4 h-4 text-destructive" />
            <span className="font-body text-xs text-destructive font-semibold">Limited: First 100 users get 50% off Pro Plan</span>
          </motion.div>
        </div>
      </section>

      {/* ═══ VALUE PROPOSITION ═══ */}
      <section className="py-16 border-y border-border bg-secondary/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              What <span className="text-gradient-gold">ProfileX</span> Does For You
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: FileText, title: "Builds Your Resume", desc: "ATS-optimized resume with elite templates in under 5 minutes. No design skills needed." },
              { icon: Brain, title: "AI Suggests Wording", desc: "Every bullet point rewritten for maximum impact using psychology & recruiter patterns." },
              { icon: Sparkles, title: "Gets You Interviews", desc: "Our users report 3x more interview calls within 2 weeks of using ProfileX." },
            ].map((v, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
                  <v.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{v.title}</h3>
                <p className="font-body text-sm text-muted-foreground">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="py-20 border-b border-border">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Counter end={70} suffix="%" label="Resumes Fail ATS" />
            <Counter end={15} suffix="K+" label="Resumes Created" />
            <Counter end={3} suffix="x" label="More Interviews" />
            <Counter end={2400} suffix="+" label="5-Star Reviews" />
          </div>
        </div>
      </section>

      {/* ═══ BENEFITS ═══ */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-primary mb-4 block">Why ProfileX</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
              Results That <span className="text-gradient-gold">Speak</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {benefits.map((b, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass-gold rounded-2xl p-6 text-center hover:glow-gold transition-all duration-500">
                <p className="font-display text-3xl font-bold text-primary">{b.stat}</p>
                <p className="font-body text-xs text-muted-foreground mt-2">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" className="py-24 bg-secondary/30">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-primary mb-4 block">Features</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
              Built for the <span className="text-gradient-gold">Top 1%</span>
            </h2>
            <p className="font-body text-muted-foreground max-w-xl mx-auto">Every feature is designed using psychology, neuroscience, and ATS reverse-engineering.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="glass-gold rounded-2xl p-8 group hover:glow-gold transition-all duration-500">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-5 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{f.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" className="py-24">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-primary mb-4 block">The Process</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
              3 Steps to <span className="text-gradient-gold">Interview Calls</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: FileText, title: "Upload & Enter Info", desc: "Drop your PDF, tell us your skills & target role. Takes under 2 minutes." },
              { icon: Target, title: "AI Analyzes & Rewrites", desc: "Our engine reframes projects, adds keywords, applies psychology, and optimizes for ATS." },
              { icon: Zap, title: "Download & Get Interviews", desc: "Preview for free, then download your premium resume, cover letter, and prep for interviews." },
            ].map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }}
                className="glass-gold rounded-2xl p-8 text-center group hover:glow-gold transition-all duration-500">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="font-body text-xs font-bold text-primary mb-2">STEP {i + 1}</div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FREEMIUM PREVIEW ═══ */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-primary mb-4 block">Free vs Premium</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Start Free. <span className="text-gradient-gold">Upgrade When You See Value.</span>
            </h2>
            <p className="font-body text-sm text-muted-foreground max-w-lg mx-auto">
              We don't ask you to pay before you see results. Build your resume for free. Pay only when you're ready to download.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass rounded-2xl p-8">
              <div className="flex items-center gap-2 mb-4">
                <Gift className="w-5 h-5 text-primary" />
                <h3 className="font-display text-xl font-bold text-foreground">Free Forever</h3>
              </div>
              <ul className="space-y-3">
                {["Build & edit full resume", "2 basic ATS templates", "Live preview", "Basic ATS score", "Skill gap analysis"].map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span className="font-body text-sm text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/dashboard">
                <Button className="w-full mt-6 bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground font-body font-semibold">
                  Start Free <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass-gold rounded-2xl p-8 glow-gold relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-gold text-primary-foreground font-body text-xs font-bold px-4 py-1 rounded-full">UNLOCK FULL POWER</span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-5 h-5 text-primary" />
                <h3 className="font-display text-xl font-bold text-foreground">Premium</h3>
              </div>
              <ul className="space-y-3">
                {["Clean PDF & DOCX download", "4 elite premium templates", "AI content suggestions & rewriting", "Full ATS optimization report", "Cover letter + LinkedIn builder", "Interview Prep Engine", "Unlimited exports"].map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span className="font-body text-sm text-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/pricing">
                <Button className="w-full mt-6 bg-gradient-gold text-primary-foreground font-body font-semibold animate-gold-pulse">
                  Upgrade for ₹299 <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ BEFORE / AFTER ═══ */}
      <section id="before-after" className="py-24">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-primary mb-4 block">The Transformation</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
              Same Project. <span className="text-gradient-gold">Different Impact.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="glass rounded-2xl p-8 border-destructive/20">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-2 w-2 rounded-full bg-destructive" />
                <span className="font-body text-xs font-bold text-destructive uppercase tracking-wider">Before</span>
              </div>
              <div className="space-y-4">
                {["\"Built a weather app using API\"", "\"Made a Python project to count vowels\"", "\"Created a to-do list app using React\""].map((t, i) => (
                  <div key={i} className="glass rounded-lg p-4">
                    <p className="font-body text-sm text-muted-foreground">{t}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-2 text-destructive">
                <span className="font-body text-xs font-semibold">ATS Score: 23%</span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="glass-gold rounded-2xl p-8 glow-gold">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="font-body text-xs font-bold text-primary uppercase tracking-wider">After ProfileX</span>
              </div>
              <div className="space-y-4">
                {[
                  "\"Engineered a real-time weather dashboard integrating RESTful APIs, reducing latency by 40%\"",
                  "\"Designed a text analysis module with optimized handling, improving accuracy by 30%\"",
                  "\"Developed full-stack task platform with persistence, boosting productivity by 2x\"",
                ].map((t, i) => (
                  <div key={i} className="glass-gold rounded-lg p-4">
                    <p className="font-body text-sm text-foreground">{t}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-2 text-primary">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-body text-xs font-semibold">ATS Score: 92%</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ REVIEWS & SOCIAL PROOF ═══ */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-4">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-primary mb-4 block">Success Stories</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-2">
              What Our Users <span className="text-gradient-gold">Say</span>
            </h2>
            <div className="flex items-center justify-center gap-2 mb-2">
              {Array(5).fill(0).map((_, i) => <Star key={i} className="w-5 h-5 fill-primary text-primary" />)}
              <span className="font-body text-sm text-foreground font-semibold ml-2">4.9/5</span>
              <span className="font-body text-xs text-muted-foreground">(2,400+ reviews)</span>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {reviews.map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 hover:glass-gold transition-all duration-500 group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center">
                    <span className="font-body text-xs font-bold text-primary-foreground">{r.avatar}</span>
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold text-foreground">{r.name}</p>
                    <p className="font-body text-xs text-primary">{r.role}</p>
                  </div>
                  <BadgeCheck className="w-5 h-5 text-primary ml-auto" />
                </div>
                <div className="flex gap-1 mb-3">
                  {Array(r.rating).fill(0).map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-primary text-primary" />)}
                </div>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-3">"{r.quote}"</p>
                <p className="font-body text-[10px] text-muted-foreground/60">{r.date}</p>
              </motion.div>
            ))}
          </div>

          {/* As seen on */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-8 mt-16 pt-8 border-t border-border">
            <span className="font-body text-xs text-muted-foreground uppercase tracking-wider">Trusted by professionals at</span>
            {["Google", "Amazon", "Microsoft", "Flipkart", "Razorpay", "Swiggy"].map((co) => (
              <span key={co} className="font-display text-lg font-bold text-muted-foreground/40">{co}</span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ PRICING PREVIEW ═══ */}
      <section id="pricing" className="py-24">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-primary mb-4 block">Pricing</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
              Invest in Your <span className="text-gradient-gold">Career</span>
            </h2>
            <p className="font-body text-sm text-muted-foreground">Less than a cup of coffee. More valuable than a career counselor.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: "Starter", price: "₹299", period: "one-time", features: ["ATS-Optimized Resume", "Keyword Analysis", "1 Job Target", "PDF Download"], popular: false },
              { name: "Pro", price: "₹499", period: "one-time", features: ["Everything in Starter", "Cover Letter", "Project Reframing", "Psychology Insights", "Interview Prep", "3 Job Targets"], popular: true },
              { name: "Elite", price: "₹199", period: "/month", features: ["Everything in Pro", "Unlimited Edits", "4 Premium Templates", "LinkedIn Optimization", "Priority Support"], popular: false },
            ].map((plan, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className={`relative rounded-2xl p-8 transition-all duration-500 ${plan.popular ? "glass-gold glow-gold scale-105" : "glass hover:glass-gold"}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-gold text-primary-foreground font-body text-xs font-bold px-4 py-1 rounded-full">MOST POPULAR</span>
                  </div>
                )}
                <h3 className="font-display text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="font-display text-4xl font-bold text-primary">{plan.price}</span>
                  <span className="font-body text-sm text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      <span className="font-body text-sm text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/pricing">
                  <Button className={`w-full font-body font-semibold ${plan.popular ? "bg-gradient-gold text-primary-foreground" : "bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground"}`}>
                    Choose {plan.name} <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Trust badges below pricing */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-6 mt-10 text-muted-foreground">
            {[
              { icon: Shield, text: "30-Day Money-Back Guarantee" },
              { icon: Lock, text: "Secure Payment — SSL Encrypted" },
              { icon: Heart, text: "Risk-Free: Don't get interviews? Full refund." },
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-2">
                <t.icon className="w-4 h-4 text-primary" />
                <span className="font-body text-xs">{t.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ EMAIL CAPTURE ═══ */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="glass-gold rounded-2xl p-8 md:p-12 max-w-2xl mx-auto text-center glow-gold">
            <Mail className="w-8 h-8 text-primary mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">
              Get Free Resume Tips & Career Hacks
            </h2>
            <p className="font-body text-sm text-muted-foreground mb-6">
              Join 5,000+ professionals. Weekly tips on ATS optimization, interview prep, and career growth.
            </p>
            {!emailSubmitted ? (
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-secondary border-border font-body flex-1"
                />
                <Button onClick={() => { if (email.includes("@")) setEmailSubmitted(true); }} className="bg-gradient-gold text-primary-foreground font-body font-semibold">
                  Subscribe Free
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-primary">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-body text-sm font-semibold">You're in! Check your inbox for career hacks.</span>
              </div>
            )}
            <p className="font-body text-[10px] text-muted-foreground mt-3">No spam. Unsubscribe anytime. We respect your privacy.</p>
          </motion.div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-24">
        <div className="container mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="glass-gold rounded-3xl p-12 md:p-20 glow-gold-lg max-w-3xl mx-auto">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">
              Ready to <span className="text-gradient-gold">Win</span>?
            </h2>
            <p className="font-body text-muted-foreground mb-4 max-w-lg mx-auto">
              Join 15,000+ professionals who stopped getting rejected and started getting shortlisted.
            </p>
            <p className="font-body text-sm text-primary font-semibold mb-8">
              ⏰ Start free — no credit card required. See results before you pay.
            </p>
            <Link to="/dashboard">
              <Button size="lg" className="bg-gradient-gold text-primary-foreground font-body font-semibold text-base px-10 py-6 animate-gold-pulse">
                Start Free Resume Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
