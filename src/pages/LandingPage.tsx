import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { ArrowRight, CheckCircle2, FileText, Target, Zap, Star, Shield, TrendingUp, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    const duration = 2000;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-4xl md:text-5xl font-bold text-primary">
        {count}{suffix}
      </div>
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
        style={{
          left: `${Math.random() * 100}%`,
          animationDuration: `${6 + Math.random() * 8}s`,
          animationDelay: `${Math.random() * 5}s`,
        }}
      />
    ))}
  </div>
);

/* ─── Landing Page ─── */
const LandingPage = () => {
  const typewriterText = useTypewriter([
    "Stop Getting Rejected.",
    "Start Getting Shortlisted.",
    "Your Career. Reimagined.",
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Particles />
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-primary/8 blur-[100px]" />

        <div className="container relative z-10 mx-auto px-6 text-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 glass-gold rounded-full px-5 py-2 mb-8">
              <Zap className="w-4 h-4 text-primary" />
              <span className="font-body text-xs font-medium text-primary">AI-Powered Career Intelligence</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-foreground leading-tight mb-6 max-w-4xl mx-auto"
          >
            {typewriterText}
            <span className="inline-block w-[3px] h-[1em] bg-primary ml-1 animate-pulse" />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            70% of resumes get rejected by ATS before a human ever reads them.{" "}
            <span className="text-primary font-semibold">Yours won't.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/dashboard">
              <Button
                size="lg"
                className="bg-gradient-gold text-primary-foreground font-body font-semibold text-base px-8 py-6 animate-gold-pulse hover:opacity-90 transition-opacity"
              >
                Transform Your Resume
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button
                variant="outline"
                size="lg"
                className="font-body border-primary/30 text-primary hover:bg-primary/10 px-8 py-6"
              >
                See How It Works
              </Button>
            </a>
          </motion.div>

          {/* Trust row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span className="font-body text-xs">10,000+ Professionals</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-primary" />
              <span className="font-body text-xs">4.9/5 Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="font-body text-xs">3x More Interviews</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="py-20 border-y border-border">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Counter end={70} suffix="%" label="Resumes Fail ATS" />
            <Counter end={10} suffix="K+" label="Resumes Enhanced" />
            <Counter end={3} suffix="x" label="More Interviews" />
            <Counter end={95} suffix="%" label="User Satisfaction" />
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-primary mb-4 block">
              The Process
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
              How ProfileX <span className="text-gradient-gold">Works</span>
            </h2>
            <p className="font-body text-muted-foreground max-w-xl mx-auto">
              From upload to offer letter — our AI handles the heavy lifting.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: FileText, title: "Upload Your Resume", desc: "Drop your PDF and tell us about your background, skills, and target role." },
              { icon: Target, title: "AI Analyzes & Reframes", desc: "Our engine extracts keywords, reframes projects, and optimizes for ATS." },
              { icon: Zap, title: "Download & Apply", desc: "Get your enhanced resume, cover letter, and confidence to land interviews." },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="glass-gold rounded-2xl p-8 text-center group hover:glow-gold transition-all duration-500"
              >
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

      {/* ═══ BEFORE / AFTER ═══ */}
      <section id="before-after" className="py-24 bg-secondary/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-primary mb-4 block">
              The Transformation
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
              Same Project. <span className="text-gradient-gold">Different Impact.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Before */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-8 border-destructive/20"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="h-2 w-2 rounded-full bg-destructive" />
                <span className="font-body text-xs font-bold text-destructive uppercase tracking-wider">Before</span>
              </div>
              <div className="space-y-4">
                <div className="glass rounded-lg p-4">
                  <p className="font-body text-sm text-muted-foreground">"Built a weather app using API"</p>
                </div>
                <div className="glass rounded-lg p-4">
                  <p className="font-body text-sm text-muted-foreground">"Made a Python project to count vowels in a string"</p>
                </div>
                <div className="glass rounded-lg p-4">
                  <p className="font-body text-sm text-muted-foreground">"Created a to-do list app using React"</p>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2 text-destructive">
                <span className="font-body text-xs font-semibold">ATS Score: 23%</span>
              </div>
            </motion.div>

            {/* After */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-gold rounded-2xl p-8 glow-gold"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="font-body text-xs font-bold text-primary uppercase tracking-wider">After ProfileX</span>
              </div>
              <div className="space-y-4">
                <div className="glass-gold rounded-lg p-4">
                  <p className="font-body text-sm text-foreground">"Engineered a real-time weather intelligence dashboard integrating RESTful APIs, reducing data fetch latency by 40%"</p>
                </div>
                <div className="glass-gold rounded-lg p-4">
                  <p className="font-body text-sm text-foreground">"Designed a text analysis module with optimized conditional handling, improving input validation accuracy by 30%"</p>
                </div>
                <div className="glass-gold rounded-lg p-4">
                  <p className="font-body text-sm text-foreground">"Developed a full-stack task management platform with state persistence, boosting user productivity tracking by 2x"</p>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2 text-primary">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-body text-xs font-semibold">ATS Score: 92%</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-primary mb-4 block">
              Success Stories
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
              What Our Users <span className="text-gradient-gold">Say</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Priya Sharma", role: "SDE at Amazon", quote: "ProfileX turned my generic resume into a shortlisting machine. Got 5 interview calls in 2 weeks!" },
              { name: "Rahul Verma", role: "Data Analyst at Flipkart", quote: "The project reframing blew my mind. Same projects, completely different perception. Worth every rupee." },
              { name: "Ananya Patel", role: "Product Manager at Razorpay", quote: "I was skeptical, but the ATS score jumped from 31% to 94%. The AI actually understands what HRs look for." },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass rounded-2xl p-8 hover:glass-gold transition-all duration-500 group"
              >
                <div className="flex gap-1 mb-4">
                  {Array(5).fill(0).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">"{t.quote}"</p>
                <div>
                  <p className="font-body text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="font-body text-xs text-primary">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICING PREVIEW ═══ */}
      <section id="pricing" className="py-24 bg-secondary/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-primary mb-4 block">
              Pricing
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
              Invest in Your <span className="text-gradient-gold">Career</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: "Starter", price: "₹299", period: "one-time", features: ["ATS-Optimized Resume", "Keyword Analysis", "1 Job Target", "PDF Download"], popular: false },
              { name: "Pro", price: "₹499", period: "one-time", features: ["Everything in Starter", "Cover Letter", "Project Reframing", "3 Job Targets", "Priority Support"], popular: true },
              { name: "Elite", price: "₹199", period: "/month", features: ["Everything in Pro", "Unlimited Job Edits", "Real-time Suggestions", "LinkedIn Optimization", "Dedicated Support"], popular: false },
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`relative rounded-2xl p-8 transition-all duration-500 ${
                  plan.popular
                    ? "glass-gold glow-gold scale-105"
                    : "glass hover:glass-gold"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-gold text-primary-foreground font-body text-xs font-bold px-4 py-1 rounded-full">
                      MOST POPULAR
                    </span>
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
                  <Button
                    className={`w-full font-body font-semibold ${
                      plan.popular
                        ? "bg-gradient-gold text-primary-foreground"
                        : "bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground"
                    }`}
                  >
                    Choose {plan.name}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-24">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-gold rounded-3xl p-12 md:p-20 glow-gold-lg max-w-3xl mx-auto"
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">
              Ready to <span className="text-gradient-gold">Win</span>?
            </h2>
            <p className="font-body text-muted-foreground mb-8 max-w-lg mx-auto">
              Join 10,000+ professionals who stopped getting rejected and started getting shortlisted.
            </p>
            <Link to="/dashboard">
              <Button
                size="lg"
                className="bg-gradient-gold text-primary-foreground font-body font-semibold text-base px-10 py-6 animate-gold-pulse"
              >
                Transform Your Resume Now
                <ArrowRight className="ml-2 w-5 h-5" />
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
