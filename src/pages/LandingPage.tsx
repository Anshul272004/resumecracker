import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight, CheckCircle2, FileText, Target, Zap, Star, Shield, TrendingUp,
  ChevronRight, Brain, BarChart3, Crown, Eye, Lock, Sparkles, Users, Award,
  MessageSquare, Mail, Timer, Gift, BadgeCheck, Flame, Heart, XCircle, Briefcase, Palette
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LiveActivityTicker from "@/components/LiveActivityTicker";
import TiltCard from "@/components/3d/TiltCard";

const HeroScene = lazy(() => import("@/components/3d/HeroScene"));

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
    <TiltCard className="h-full">
      <div ref={ref} className="text-center glass-gold rounded-2xl p-8 h-full">
        <div className="font-display text-5xl md:text-6xl font-bold text-primary text-shadow-gold">{count}{suffix}</div>
        <p className="font-body text-sm text-muted-foreground mt-2">{label}</p>
      </div>
    </TiltCard>
  );
};

/* ─── Cinematic Particles ─── */
const Particles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 30 }).map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full animate-float"
        style={{
          left: `${Math.random() * 100}%`,
          width: `${2 + Math.random() * 4}px`,
          height: `${2 + Math.random() * 4}px`,
          background: i % 3 === 0
            ? "hsl(var(--primary) / 0.4)"
            : i % 3 === 1
            ? "hsl(var(--cyan-accent) / 0.3)"
            : "hsl(var(--violet-accent) / 0.3)",
          animationDuration: `${6 + Math.random() * 10}s`,
          animationDelay: `${Math.random() * 5}s`,
        }}
      />
    ))}
    {/* Light streaks */}
    <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary/10 to-transparent animate-light-streak" />
    <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-cyan-accent/10 to-transparent animate-light-streak" style={{ animationDelay: "2s" }} />
  </div>
);

/* ─── Template Showcase Data ─── */
const templateShowcaseRow1 = [
  { name: "The Executive", subtitle: "Satya Nadella Style", color: "hsl(43 75% 52%)", skills: ["Python", "React", "AWS"] },
  { name: "The Minimalist", subtitle: "Steve Jobs Style", color: "hsl(0 0% 70%)", skills: ["Design", "UX", "Swift"] },
  { name: "The Modern Pro", subtitle: "Sundar Pichai Style", color: "hsl(215 80% 55%)", skills: ["ML", "Java", "Cloud"] },
  { name: "The Standout", subtitle: "Bold & Distinctive", color: "hsl(350 70% 55%)", skills: ["Node", "Go", "K8s"] },
];

const templateShowcaseRow2 = [
  { name: "The Elegant", subtitle: "Hermès Aesthetic", color: "hsl(43 60% 40%)", skills: ["SQL", "Docker", "CI/CD"] },
  { name: "The Bold", subtitle: "Elon Musk Style", color: "hsl(155 70% 45%)", skills: ["Rust", "C++", "Linux"] },
  { name: "The Executive", subtitle: "Premium Gold", color: "hsl(43 75% 52%)", skills: ["TypeScript", "Next.js", "GCP"] },
  { name: "The Modern Pro", subtitle: "Tech-Forward", color: "hsl(270 70% 55%)", skills: ["FastAPI", "Redis", "Kafka"] },
];

/* ─── Landing Page ─── */
const LandingPage = () => {
  const typewriterText = useTypewriter([
    "Stop Getting Rejected.",
    "Start Getting Shortlisted.",
    "Crack the ATS Algorithm.",
    "Your Career. Reinvented.",
  ]);

  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  const features = [
    { icon: Shield, title: "ATS Algorithm Cracker", desc: "We reverse-engineered 10+ ATS systems. Your resume passes every single check.", accent: "primary" },
    { icon: Brain, title: "Psychology-Powered Framing", desc: "6 cognitive biases applied to make recruiters subconsciously favour your profile.", accent: "cyan-accent" },
    { icon: BarChart3, title: "1M+ Pattern Engine", desc: "Trained on 1,000,000+ resumes to identify what gets shortlisted.", accent: "violet-accent" },
    { icon: Crown, title: "Elite Templates", desc: "4 ultra-premium templates inspired by Fortune 500 leaders.", accent: "primary" },
    { icon: Target, title: "Project Reframing AI", desc: "Transforms basic projects into impact stories with quantified metrics.", accent: "cyan-accent" },
    { icon: Eye, title: "Recruiter Eye-Tracking", desc: "Layout optimized based on recruiter eye-tracking studies.", accent: "violet-accent" },
    { icon: MessageSquare, title: "Interview Prep Engine", desc: "AI generates exact questions you'll face. Practice with psychology ratings.", accent: "primary" },
    { icon: Flame, title: "AI Bullet Improver", desc: "Every bullet rewritten for maximum impact using action-result framework.", accent: "cyan-accent" },
    { icon: FileText, title: "Cover Letter + LinkedIn", desc: "One-click AI cover letter and LinkedIn About section generation.", accent: "violet-accent" },
  ];

  const benefits = [
    { stat: "3x", desc: "More interview calls within 2 weeks" },
    { stat: "92%", desc: "Average ATS score after optimization" },
    { stat: "7.4s", desc: "We optimize for the 7.4-second first impression" },
    { stat: "Top 1%", desc: "Your resume ranks in the top 1% of applicants" },
  ];

  const reviews = [
    { name: "Priya Sharma", role: "SDE at Amazon", quote: "ResumeCracker turned my generic resume into a shortlisting machine. Got 5 interview calls in 2 weeks!", avatar: "PS", rating: 5, date: "2 weeks ago" },
    { name: "Rahul Verma", role: "Data Analyst at Flipkart", quote: "The project reframing blew my mind. Same projects, completely different perception.", avatar: "RV", rating: 5, date: "1 month ago" },
    { name: "Ananya Patel", role: "PM at Razorpay", quote: "The psychology insights changed everything. My callbacks went from 2% to 34%.", avatar: "AP", rating: 5, date: "3 weeks ago" },
    { name: "Vikram Singh", role: "SDE-2 at Google", quote: "Interview Prep Engine was a game-changer. Every question they predicted was actually asked.", avatar: "VS", rating: 5, date: "1 week ago" },
    { name: "Sneha Reddy", role: "ML Engineer at Microsoft", quote: "From 23% ATS score to 95%. Got shortlisted at 4 FAANG companies.", avatar: "SR", rating: 5, date: "5 days ago" },
    { name: "Arjun Kapoor", role: "Full Stack at Swiggy", quote: "The cover letter AI is insane. Recruiter literally told me it was the best they'd ever read.", avatar: "AK", rating: 5, date: "2 weeks ago" },
  ];

  const competitors = [
    { feature: "ATS Optimization", rc: true, zety: false, novoresume: false, canva: false },
    { feature: "Psychology-Based Framing", rc: true, zety: false, novoresume: false, canva: false },
    { feature: "Project Reframing AI", rc: true, zety: false, novoresume: false, canva: false },
    { feature: "Interview Prep Engine", rc: true, zety: false, novoresume: false, canva: false },
    { feature: "Cover Letter Generator", rc: true, zety: true, novoresume: true, canva: false },
    { feature: "Free Preview", rc: true, zety: false, novoresume: false, canva: true },
    { feature: "Cognitive Bias Application", rc: true, zety: false, novoresume: false, canva: false },
    { feature: "1M+ Pattern Analysis", rc: true, zety: false, novoresume: false, canva: false },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* Live Activity Ticker */}
      <div className="pt-16">
        <LiveActivityTicker />
      </div>

      {/* ═══ CINEMATIC HERO ═══ */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex items-center overflow-hidden"
      >
        <Particles />

        {/* Gradient mesh background */}
        <div className="absolute inset-0 animate-gradient-shift" style={{
          background: "radial-gradient(ellipse at 20% 50%, hsl(var(--primary) / 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, hsl(var(--cyan-accent) / 0.06) 0%, transparent 50%), radial-gradient(ellipse at 60% 80%, hsl(var(--violet-accent) / 0.05) 0%, transparent 50%)"
        }} />

        <div className="container relative z-10 mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <div className="text-left">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <div className="inline-flex items-center gap-2 glass-gold rounded-full px-5 py-2 mb-8">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="font-body text-xs font-medium text-primary">AI-Powered ATS Resume Builder — Free Preview</span>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-foreground leading-[1.1] mb-6"
              >
                Your Resume.{" "}
                <span className="text-gradient-gold">Reinvented.</span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="h-[1.6em] mb-4 overflow-hidden"
              >
                <span className="font-display text-2xl md:text-3xl text-primary/80">
                  {typewriterText}
                  <span className="inline-block w-[2px] h-[0.8em] bg-primary ml-1 animate-pulse" />
                </span>
              </motion.div>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
                className="font-body text-lg text-muted-foreground max-w-lg mb-8">
                70% of resumes get rejected by ATS before a human reads them.{" "}
                <span className="text-primary font-semibold">Yours won't.</span> AI suggests wording that increases interview calls by 3x.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row items-start gap-4 mb-8">
                <Link to="/dashboard">
                  <Button size="lg" className="bg-gradient-gold text-primary-foreground font-body font-semibold text-lg px-10 py-7 animate-gold-pulse hover:opacity-90 transition-opacity shadow-gold-lg group">
                    Build My Resume <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/results">
                  <Button variant="outline" size="lg" className="font-body border-primary/30 text-primary hover:bg-primary/10 px-8 py-7 text-base">
                    See Template Preview
                  </Button>
                </Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}
                className="flex flex-wrap items-center gap-4 text-muted-foreground">
                {[
                  { icon: Users, text: "15,000+ Resumes" },
                  { icon: Star, text: "4.9/5 Rating" },
                  { icon: Lock, text: "100% Secure" },
                  { icon: BadgeCheck, text: "Free Preview" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 glass rounded-full px-3 py-1.5">
                    <item.icon className="w-3.5 h-3.5 text-primary" />
                    <span className="font-body text-[10px] font-medium">{item.text}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: 3D Hero Scene */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.5 }}
              className="relative h-[500px] lg:h-[600px] hidden md:block"
            >
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                  </div>
                }
              >
                <HeroScene />
              </Suspense>

              {/* Floating badge overlays */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-16 right-8 glass-gold rounded-xl px-4 py-3 flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-body text-[10px] text-muted-foreground">ATS Score</p>
                  <p className="font-display text-lg font-bold text-primary">95%</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-20 left-4 glass rounded-xl px-4 py-3 flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-cyan-accent/20 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-cyan-accent" />
                </div>
                <div>
                  <p className="font-body text-[10px] text-muted-foreground">Job Match</p>
                  <p className="font-display text-lg font-bold text-cyan-accent">87%</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ═══ DYNAMIC TEMPLATE SHOWCASE ═══ */}
      <section className="py-20 border-y border-border/50 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-primary mb-4 block">Premium Templates</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
              6 Elite <span className="text-gradient-gold">Resume Templates</span>
            </h2>
            <p className="font-body text-sm text-muted-foreground">Inspired by Fortune 500 leaders. Auto-scrolling showcase.</p>
          </motion.div>
        </div>

        {/* Row 1 - scrolls left */}
        <div className="relative mb-4">
          <div className="flex gap-4 animate-ticker-left">
            {[...templateShowcaseRow1, ...templateShowcaseRow1].map((t, i) => (
              <div key={i} className="shrink-0 w-[220px] glass-gold rounded-xl p-4 hover:scale-105 hover:glow-gold transition-all duration-300 cursor-pointer group">
                <div className="h-2 rounded-full mb-3" style={{ backgroundColor: t.color }} />
                <div className="h-3 w-3/4 rounded bg-foreground/10 mb-2" />
                <div className="space-y-1.5 mb-3">
                  {[1,2,3].map(j => <div key={j} className="h-1.5 rounded bg-foreground/5" style={{ width: `${70 + Math.random() * 30}%` }} />)}
                </div>
                <div className="flex gap-1 mb-3">
                  {t.skills.map((s,j) => <span key={j} className="text-[7px] px-1.5 py-0.5 rounded-full border border-foreground/10 text-muted-foreground">{s}</span>)}
                </div>
                <p className="font-body text-[10px] font-bold text-primary mt-2 group-hover:text-foreground transition-colors">{t.name}</p>
                <p className="font-body text-[8px] text-muted-foreground">{t.subtitle}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 - scrolls right */}
        <div className="relative">
          <div className="flex gap-4 animate-ticker-right">
            {[...templateShowcaseRow2, ...templateShowcaseRow2].map((t, i) => (
              <div key={i} className="shrink-0 w-[220px] glass-gold rounded-xl p-4 hover:scale-105 hover:glow-gold transition-all duration-300 cursor-pointer group">
                <div className="h-2 rounded-full mb-3" style={{ backgroundColor: t.color }} />
                <div className="h-3 w-3/4 rounded bg-foreground/10 mb-2" />
                <div className="space-y-1.5 mb-3">
                  {[1,2,3].map(j => <div key={j} className="h-1.5 rounded bg-foreground/5" style={{ width: `${70 + Math.random() * 30}%` }} />)}
                </div>
                <div className="flex gap-1 mb-3">
                  {t.skills.map((s,j) => <span key={j} className="text-[7px] px-1.5 py-0.5 rounded-full border border-foreground/10 text-muted-foreground">{s}</span>)}
                </div>
                <p className="font-body text-[10px] font-bold text-primary mt-2 group-hover:text-foreground transition-colors">{t.name}</p>
                <p className="font-body text-[8px] text-muted-foreground">{t.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ VALUE PROPOSITION ═══ */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
              What <span className="text-gradient-gold">ResumeCracker</span> Does For You
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: FileText, title: "Builds Your Resume", desc: "ATS-optimized resume with elite templates in under 5 minutes.", glow: "primary" },
              { icon: Brain, title: "AI Suggests Wording", desc: "Every bullet rewritten for maximum impact using psychology patterns.", glow: "cyan-accent" },
              { icon: Sparkles, title: "Gets You Interviews", desc: "Our users report 3x more interview calls within 2 weeks.", glow: "violet-accent" },
            ].map((v, i) => (
              <TiltCard key={i} glowColor={`hsl(var(--${v.glow}) / 0.2)`}>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                  className="text-center glass-gold rounded-2xl p-8 h-full border-shine">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                    <v.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">{v.title}</h3>
                  <p className="font-body text-sm text-muted-foreground">{v.desc}</p>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="py-24 border-y border-border/50 relative">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at center, hsl(var(--primary) / 0.03) 0%, transparent 70%)"
        }} />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-primary mb-4 block">Why ResumeCracker</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
              Results That <span className="text-gradient-gold">Speak</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {benefits.map((b, i) => (
              <TiltCard key={i}>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="glass-gold rounded-2xl p-8 text-center h-full border-shine">
                  <p className="font-display text-4xl md:text-5xl font-bold text-primary text-shadow-gold">{b.stat}</p>
                  <p className="font-body text-xs text-muted-foreground mt-3">{b.desc}</p>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-secondary/10 to-secondary/30" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-primary mb-4 block">Features</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
              Built for the <span className="text-gradient-gold">Top 1%</span>
            </h2>
            <p className="font-body text-muted-foreground max-w-xl mx-auto">Every feature designed using psychology, neuroscience, and ATS reverse-engineering.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <TiltCard key={i} glowColor={`hsl(var(--${f.accent}) / 0.15)`}>
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="glass-gold rounded-2xl p-8 group h-full border-shine">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-5 group-hover:bg-primary/20 transition-colors shadow-gold">
                    <f.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">{f.title}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" className="py-24 relative">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-primary mb-4 block">The Process</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
              3 Steps to <span className="text-gradient-gold">Interview Calls</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-1/2 left-[16.5%] right-[16.5%] h-px bg-gradient-to-r from-primary/50 via-cyan-accent/30 to-violet-accent/50" />

            {[
              { icon: FileText, title: "Upload & Enter Info", desc: "Drop your PDF, tell us your skills & target role. Takes under 2 minutes.", accent: "primary" },
              { icon: Target, title: "AI Analyzes & Rewrites", desc: "Our engine reframes projects, adds keywords, applies psychology, and optimizes for ATS.", accent: "cyan-accent" },
              { icon: Zap, title: "Download & Get Interviews", desc: "Preview for free, then download your premium resume and cover letter.", accent: "violet-accent" },
            ].map((step, i) => (
              <TiltCard key={i}>
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }}
                  className="glass-gold rounded-2xl p-8 text-center group h-full border-shine relative">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center shadow-gold z-10">
                    <span className="font-body text-xs font-bold text-primary-foreground">{i + 1}</span>
                  </div>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6 mt-4 group-hover:bg-primary/20 transition-colors">
                    <step.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-3">{step.title}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COMPARISON TABLE ═══ */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-secondary/30" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-primary mb-4 block">Comparison</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
              ResumeCracker vs <span className="text-gradient-gold">Others</span>
            </h2>
          </motion.div>

          <TiltCard tiltMax={3} className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="glass-deep rounded-2xl p-8 overflow-x-auto border-shine">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="font-body text-sm text-left text-muted-foreground py-3 pr-4">Feature</th>
                    <th className="font-body text-sm text-center py-3 px-3 text-primary font-bold">ResumeCracker</th>
                    <th className="font-body text-sm text-center py-3 px-3 text-muted-foreground">Zety</th>
                    <th className="font-body text-sm text-center py-3 px-3 text-muted-foreground">NovoResume</th>
                    <th className="font-body text-sm text-center py-3 px-3 text-muted-foreground">Canva</th>
                  </tr>
                </thead>
                <tbody>
                  {competitors.map((row) => (
                    <tr key={row.feature} className="border-b border-border/50">
                      <td className="font-body text-xs text-muted-foreground py-3 pr-4">{row.feature}</td>
                      {[row.rc, row.zety, row.novoresume, row.canva].map((val, ci) => (
                        <td key={ci} className="text-center py-3 px-3">
                          {val ? <CheckCircle2 className="w-4 h-4 text-primary mx-auto" /> : <XCircle className="w-4 h-4 text-muted-foreground/30 mx-auto" />}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </TiltCard>
        </div>
      </section>

      {/* ═══ FREEMIUM PREVIEW ═══ */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-primary mb-4 block">Free vs Premium</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
              Start Free. <span className="text-gradient-gold">Upgrade When You See Value.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto" style={{ perspective: "1200px" }}>
            <TiltCard>
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass rounded-2xl p-8 h-full">
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
            </TiltCard>

            <TiltCard glowColor="hsl(var(--primary) / 0.25)">
              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass-gold rounded-2xl p-8 h-full relative border-shine">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-gold text-primary-foreground font-body text-xs font-bold px-4 py-1 rounded-full">UNLOCK FULL POWER</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <Crown className="w-5 h-5 text-primary" />
                  <h3 className="font-display text-xl font-bold text-foreground">Premium</h3>
                </div>
                <ul className="space-y-3">
                  {["Clean PDF & DOCX download", "4 elite premium templates", "AI content suggestions", "Full ATS optimization", "Cover letter + LinkedIn", "Interview Prep Engine", "Unlimited exports"].map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      <span className="font-body text-sm text-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/pricing">
                  <Button className="w-full mt-6 bg-gradient-gold text-primary-foreground font-body font-semibold animate-gold-pulse shadow-gold">
                    Upgrade for ₹299 <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </motion.div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* ═══ BEFORE / AFTER ═══ */}
      <section id="before-after" className="py-24 relative">
        <div className="absolute inset-0 bg-secondary/30" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-primary mb-4 block">The Transformation</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
              Same Project. <span className="text-gradient-gold">Different Impact.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <TiltCard glowColor="hsl(var(--destructive) / 0.15)">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="glass rounded-2xl p-8 h-full border border-destructive/10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-2 w-2 rounded-full bg-destructive" />
                  <span className="font-body text-xs font-bold text-destructive uppercase tracking-wider">Before</span>
                </div>
                <div className="space-y-4">
                  {["\"Built a weather app using API\"", "\"Made a Python project to count vowels\"", "\"Created a to-do list app using React\""].map((t, i) => (
                    <div key={i} className="glass rounded-lg p-4"><p className="font-body text-sm text-muted-foreground">{t}</p></div>
                  ))}
                </div>
                <div className="mt-6 flex items-center gap-2 text-destructive">
                  <span className="font-body text-xs font-semibold">ATS Score: 23%</span>
                </div>
              </motion.div>
            </TiltCard>

            <TiltCard>
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="glass-gold rounded-2xl p-8 h-full glow-gold border-shine">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="font-body text-xs font-bold text-primary uppercase tracking-wider">After ResumeCracker</span>
                </div>
                <div className="space-y-4">
                  {[
                    "\"Engineered a real-time weather dashboard integrating RESTful APIs, reducing latency by 40%\"",
                    "\"Designed a text analysis module with optimized handling, improving accuracy by 30%\"",
                    "\"Developed full-stack task platform with persistence, boosting productivity by 2x\"",
                  ].map((t, i) => (
                    <div key={i} className="glass-gold rounded-lg p-4"><p className="font-body text-sm text-foreground">{t}</p></div>
                  ))}
                </div>
                <div className="mt-6 flex items-center gap-2 text-primary">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="font-body text-xs font-semibold">ATS Score: 92%</span>
                </div>
              </motion.div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* ═══ REVIEWS ═══ */}
      <section className="py-24">
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
              <TiltCard key={i} glowColor={`hsl(var(--${i % 3 === 0 ? 'primary' : i % 3 === 1 ? 'cyan-accent' : 'violet-accent'}) / 0.12)`}>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="glass rounded-2xl p-6 hover:glass-gold transition-all duration-500 group h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center shadow-gold ring-2 ring-primary/20">
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
              </TiltCard>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-6 mt-16 pt-8 border-t border-border">
            <span className="font-body text-xs text-muted-foreground uppercase tracking-wider">Trusted by professionals at</span>
            {["Google", "Amazon", "Microsoft", "Flipkart", "Razorpay", "Swiggy"].map((co) => (
              <span key={co} className="glass-gold rounded-lg px-4 py-2 font-display text-sm font-bold text-primary/60 border border-primary/10">{co}</span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="pricing" className="py-24 relative">
        <div className="absolute inset-0 bg-secondary/30" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-primary mb-4 block">Pricing</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
              Invest in Your <span className="text-gradient-gold">Career</span>
            </h2>
            <p className="font-body text-sm text-muted-foreground">Less than a cup of coffee. More valuable than a career counselor.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto" style={{ perspective: "1200px" }}>
            {[
              { name: "Starter", price: "₹299", period: "one-time", features: ["ATS-Optimized Resume", "Keyword Analysis", "1 Job Target", "PDF Download"], popular: false },
              { name: "Pro", price: "₹499", period: "one-time", features: ["Everything in Starter", "Cover Letter", "Project Reframing", "Psychology Insights", "Interview Prep", "3 Job Targets"], popular: true },
              { name: "Elite", price: "₹199", period: "/month", features: ["Everything in Pro", "Unlimited Edits", "4 Premium Templates", "LinkedIn Optimization", "Priority Support"], popular: false },
            ].map((plan, i) => (
              <TiltCard key={i} glowColor={plan.popular ? "hsl(var(--primary) / 0.3)" : undefined}>
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                  className={`relative rounded-2xl p-8 h-full ${plan.popular ? "glass-gold glow-gold border-shine" : "glass hover:glass-gold transition-all duration-500"}`}
                  style={plan.popular ? { transform: "translateZ(20px)" } : undefined}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-gold text-primary-foreground font-body text-xs font-bold px-4 py-1 rounded-full animate-pulse-gold">MOST POPULAR</span>
                    </div>
                  )}
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="font-display text-5xl font-bold text-primary text-shadow-gold">{plan.price}</span>
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
                    <Button className={`w-full font-body font-semibold ${plan.popular ? "bg-gradient-gold text-primary-foreground shadow-gold" : "bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground"}`}>
                      Choose {plan.name} <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </motion.div>
              </TiltCard>
            ))}
          </div>

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
      <section className="py-16">
        <div className="container mx-auto px-6">
          <TiltCard tiltMax={4} className="max-w-2xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="glass-gold rounded-2xl p-8 md:p-12 text-center glow-gold border-shine">
              <Mail className="w-8 h-8 text-primary mx-auto mb-4" />
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                Get Free Resume Tips & Career Hacks
              </h2>
              <p className="font-body text-sm text-muted-foreground mb-6">
                Join 5,000+ professionals. Weekly tips on ATS optimization, interview prep, and career growth.
              </p>
              {!emailSubmitted ? (
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <Input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
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
              <p className="font-body text-[10px] text-muted-foreground mt-3">No spam. Unsubscribe anytime.</p>
            </motion.div>
          </TiltCard>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-24">
        <div className="container mx-auto px-6 text-center">
          <TiltCard tiltMax={3} className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              className="glass-gold rounded-3xl p-12 md:p-20 glow-gold-lg border-shine">
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
                <Button size="lg" className="bg-gradient-gold text-primary-foreground font-body font-semibold text-lg px-10 py-7 animate-gold-pulse shadow-gold-lg group">
                  Start Free Resume Now <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </TiltCard>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
