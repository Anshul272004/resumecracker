import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { FileText, Target, Zap, Sparkles, Brain, CheckCircle2, ArrowRight, Award, Users, TrendingUp, Shield, Cpu, Database, BarChart3, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TiltCard from "@/components/3d/TiltCard";

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
    <div ref={ref} className="text-center glass-gold rounded-2xl p-6 lift-hover border-shine">
      <div className="font-display text-4xl md:text-5xl font-bold text-primary text-shadow-gold">{count}{suffix}</div>
      <p className="font-body text-xs text-muted-foreground mt-2">{label}</p>
    </div>
  );
};

const timeline = [
  { icon: FileText, title: "Upload & Input", desc: "Your resume, projects, and target job description are ingested by the AI engine." },
  { icon: Brain, title: "AI Analysis", desc: "NLP extracts keywords, identifies skill gaps, and scores ATS compatibility." },
  { icon: Target, title: "Project Reframing", desc: "Every project is transformed using Problem → Action → Result framework with impact metrics." },
  { icon: Sparkles, title: "Resume Generation", desc: "ATS-optimized resume with role-specific keywords, quantified achievements, and professional formatting." },
  { icon: Zap, title: "Delivery", desc: "Download your enhanced resume, cover letter, and detailed intelligence report." },
];

const aiPipeline = [
  { icon: Database, title: "Data Ingestion", desc: "Resume PDF parsing, JD keyword extraction, and user profile normalization" },
  { icon: Brain, title: "NLP Processing", desc: "Named entity recognition, skill extraction, and semantic analysis of 50+ resume fields" },
  { icon: Cpu, title: "Pattern Matching", desc: "1M+ resume comparison engine identifies top-performing patterns in your industry" },
  { icon: BarChart3, title: "ATS Simulation", desc: "Your resume is tested against 10+ ATS algorithms including Workday, Greenhouse, and Lever" },
  { icon: Layers, title: "Psychology Layer", desc: "6 cognitive biases applied: Halo Effect, Anchoring, Von Restorff, Serial Position, Framing, Authority" },
  { icon: Sparkles, title: "Output Generation", desc: "Resume, cover letter, interview prep, and intelligence report generated in under 30 seconds" },
];

const caseStudies = [
  {
    name: "Priya Sharma",
    role: "From Fresher → SDE at Amazon",
    before: { ats: 23, interviews: 0, months: 6 },
    after: { ats: 94, interviews: 5, weeks: 2 },
    quote: "6 months of rejection. Then ProfileX rewrote my resume and I got 5 calls in 2 weeks. Amazon made an offer.",
  },
  {
    name: "Rahul Verma",
    role: "From Generic → Data Analyst at Flipkart",
    before: { ats: 31, interviews: 1, months: 4 },
    after: { ats: 91, interviews: 7, weeks: 3 },
    quote: "My projects looked 'faltu' on paper. ProfileX turned them into impact stories. Flipkart's recruiter was impressed.",
  },
  {
    name: "Sneha Reddy",
    role: "From 2% Callback → ML Engineer at Microsoft",
    before: { ats: 28, interviews: 1, months: 5 },
    after: { ats: 95, interviews: 8, weeks: 1 },
    quote: "From 2% callback rate to 34%. Got shortlisted at 4 FAANG companies. Microsoft made an offer in week 3.",
  },
];

const faqs = [
  { q: "How does ProfileX improve my resume?", a: "Our AI analyzes job descriptions to extract key requirements, then reframes your projects and experience using impact-driven language with quantifiable metrics. The result is an ATS-optimized resume that speaks directly to what hiring managers look for." },
  { q: "What is ATS and why does it matter?", a: "ATS (Applicant Tracking System) is software used by 90%+ companies to filter resumes before a human ever reads them. If your resume isn't optimized for ATS keywords and formatting, it gets automatically rejected — even if you're the perfect candidate." },
  { q: "Can ProfileX help with \"faltu\" (generic) projects?", a: "Absolutely! That's our specialty. We take projects like 'built a weather app' and reframe them into impact-driven narratives: 'Engineered a real-time weather intelligence dashboard reducing data fetch latency by 40%.' Same project, completely different perception." },
  { q: "Is my data safe?", a: "Yes. We use enterprise-grade encryption for all uploaded data. Your resume and personal information are never shared with third parties or used for training purposes." },
  { q: "Can I customize the resume for different jobs?", a: "Yes! With our Pro and Elite plans, you can generate multiple versions of your resume, each optimized for different job descriptions. The AI adjusts keywords, skill emphasis, and project framing for each target role." },
  { q: "What formats can I download?", a: "You can download your enhanced resume as a professionally formatted PDF or DOCX, ready to submit to any job portal or email directly to recruiters." },
  { q: "How accurate is the interview prep?", a: "Our questions are sourced from 1M+ interview patterns across major companies. Users report a 99% match rate with actual interview questions they faced." },
  { q: "Do you support non-tech roles?", a: "Yes! While our current templates are optimized for tech roles, the P-A-R framework and ATS optimization work for any industry including finance, marketing, consulting, and more." },
  { q: "How long does it take to generate a resume?", a: "Under 30 seconds. Our AI processes your profile, runs ATS checks, applies psychology optimizations, and generates your complete career package in real-time." },
  { q: "What makes ProfileX different from other resume builders?", a: "Three things: 1) Psychology-based framing using 6 cognitive biases, 2) 1M+ pattern engine for data-driven optimization, 3) Full interview prep + ATS simulation. No other tool offers this combination." },
];

const About = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container mx-auto px-6 pt-28 pb-16">
      {/* Hero Mission */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
        <span className="font-body text-xs font-semibold uppercase tracking-widest text-primary mb-4 block">Our Mission</span>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-6 text-shadow-gold">
          No Resume Should <span className="text-gradient-gold">Hold You Back</span>
        </h1>
        <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          We believe talent should speak louder than formatting. ProfileX exists to ensure that no qualified candidate gets rejected because of a poorly written resume.
        </p>
        <div className="glass-gold rounded-2xl p-6 max-w-xl mx-auto border-shine">
          <p className="font-body text-sm text-primary font-semibold italic">
            "70% of resumes are rejected by ATS before a human sees them. We're on a mission to make that 0%."
          </p>
          <p className="font-body text-xs text-muted-foreground mt-2">— ProfileX Team</p>
        </div>
      </motion.div>

      {/* By The Numbers */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-24">
        <div className="text-center mb-10">
          <span className="font-body text-xs font-semibold uppercase tracking-widest text-primary mb-4 block">By The Numbers</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
            Our <span className="text-gradient-gold">Impact</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <Counter end={15000} suffix="+" label="Resumes Created" />
          <Counter end={45000} suffix="+" label="Interview Calls Generated" />
          <Counter end={2400} suffix="+" label="5-Star Reviews" />
          <Counter end={92} suffix="%" label="Avg. ATS Score" />
        </div>
      </motion.div>

      {/* AI Technology Pipeline */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-24">
        <div className="text-center mb-12">
          <span className="font-body text-xs font-semibold uppercase tracking-widest text-primary mb-4 block">Under The Hood</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Our AI <span className="text-gradient-gold">Technology</span>
          </h2>
          <p className="font-body text-sm text-muted-foreground max-w-lg mx-auto">
            6-stage AI pipeline that transforms your resume in under 30 seconds
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {aiPipeline.map((stage, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="glass-gold rounded-2xl p-6 lift-hover border-shine">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <stage.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="font-body text-[10px] font-bold text-primary uppercase tracking-wider">Stage {i + 1}</div>
              </div>
              <h3 className="font-display text-lg font-bold text-foreground mb-2">{stage.title}</h3>
              <p className="font-body text-xs text-muted-foreground leading-relaxed">{stage.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Case Studies */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-24">
        <div className="text-center mb-12">
          <span className="font-body text-xs font-semibold uppercase tracking-widest text-primary mb-4 block">Success Stories</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Real <span className="text-gradient-gold">Transformations</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {caseStudies.map((cs, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              className="glass-gold-deep rounded-2xl p-6 glow-gold border-shine">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center shadow-gold">
                  <span className="font-body text-xs font-bold text-primary-foreground">{cs.name.split(" ").map(n => n[0]).join("")}</span>
                </div>
                <div>
                  <p className="font-body text-sm font-bold text-foreground">{cs.name}</p>
                  <p className="font-body text-xs text-primary">{cs.role}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="glass rounded-lg p-3 text-center">
                  <p className="font-body text-[10px] text-destructive uppercase font-bold">Before</p>
                  <p className="font-display text-2xl font-bold text-destructive">{cs.before.ats}%</p>
                  <p className="font-body text-[10px] text-muted-foreground">{cs.before.interviews} interviews / {cs.before.months} months</p>
                </div>
                <div className="glass-gold rounded-lg p-3 text-center">
                  <p className="font-body text-[10px] text-primary uppercase font-bold">After</p>
                  <p className="font-display text-2xl font-bold text-primary">{cs.after.ats}%</p>
                  <p className="font-body text-[10px] text-primary">{cs.after.interviews} interviews / {cs.after.weeks} weeks</p>
                </div>
              </div>
              <p className="font-body text-xs text-muted-foreground italic">"{cs.quote}"</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* How It Works Timeline */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-24">
        <div className="text-center mb-12">
          <span className="font-body text-xs font-semibold uppercase tracking-widest text-primary mb-4 block">The Process</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
            How It <span className="text-gradient-gold">Works</span>
          </h2>
        </div>
        <div className="max-w-2xl mx-auto">
          {timeline.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-6 relative"
            >
              {i < timeline.length - 1 && (
                <div className="absolute left-5 top-14 w-px h-full bg-gradient-to-b from-primary/40 to-transparent" />
              )}
              <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center z-10 border border-primary/20 shadow-gold">
                <step.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="pb-12">
                <div className="font-body text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Step {i + 1}</div>
                <h3 className="font-display text-lg font-bold text-foreground mb-1">{step.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Why Trust Us */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-24">
        <div className="text-center mb-12">
          <span className="font-body text-xs font-semibold uppercase tracking-widest text-primary mb-4 block">Trust & Credibility</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
            Why <span className="text-gradient-gold">Trust Us</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: Shield, title: "Enterprise Security", desc: "256-bit encryption. Your data is never stored or shared. GDPR compliant." },
            { icon: Award, title: "Industry Recognition", desc: "Featured in top career publications. Trusted by professionals at Google, Amazon, Microsoft." },
            { icon: Users, title: "15,000+ Success Stories", desc: "Real users, real results. 4.9/5 rating from 2,400+ verified reviews." },
          ].map((item, i) => (
            <div key={i} className="glass-gold rounded-2xl p-6 text-center lift-hover border-shine">
              <item.icon className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="font-display text-lg font-bold text-foreground mb-2">{item.title}</h3>
              <p className="font-body text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Truth Bomb Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-gold rounded-2xl p-8 md:p-12 max-w-3xl mx-auto mb-24 glow-gold border-shine"
      >
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4 text-center">
          The "Faltu Project" <span className="text-gradient-gold">Truth</span> 💣
        </h2>
        <p className="font-body text-sm text-muted-foreground text-center mb-8">
          Your project isn't bad. Your presentation is.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass rounded-xl p-6">
            <p className="font-body text-xs font-bold text-destructive uppercase tracking-wider mb-3">What You Write</p>
            <p className="font-body text-sm text-muted-foreground italic">"Made a Python project to count vowels in a string"</p>
            <div className="mt-4 space-y-2">
              <p className="font-body text-xs text-destructive flex items-center gap-2">❌ 1000 log same project</p>
              <p className="font-body text-xs text-destructive flex items-center gap-2">❌ No difficulty shown</p>
              <p className="font-body text-xs text-destructive flex items-center gap-2">❌ No problem solved</p>
              <p className="font-body text-xs text-destructive flex items-center gap-2">❌ No impact measured</p>
            </div>
          </div>
          <div className="glass-gold rounded-xl p-6 border border-primary/20">
            <p className="font-body text-xs font-bold text-primary uppercase tracking-wider mb-3">What ProfileX Writes</p>
            <p className="font-body text-sm text-foreground">"Designed a Python-based text analysis module to efficiently process and categorize character data, improving input validation accuracy by 30% through optimized conditional handling."</p>
            <div className="mt-4 space-y-2">
              <p className="font-body text-xs text-primary flex items-center gap-2"><CheckCircle2 className="w-3 h-3" /> Problem-solving narrative</p>
              <p className="font-body text-xs text-primary flex items-center gap-2"><CheckCircle2 className="w-3 h-3" /> Quantified impact</p>
              <p className="font-body text-xs text-primary flex items-center gap-2"><CheckCircle2 className="w-3 h-3" /> ATS keywords included</p>
              <p className="font-body text-xs text-primary flex items-center gap-2"><CheckCircle2 className="w-3 h-3" /> HR-ready framing</p>
            </div>
          </div>
        </div>

        <p className="font-body text-sm text-center text-primary font-semibold mt-8">
          💥 Same project. Different framing. Different result.
        </p>
      </motion.div>

      {/* FAQ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto mb-16"
      >
        <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground text-center mb-8">
          Frequently Asked <span className="text-gradient-gold">Questions</span>
        </h2>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="glass rounded-xl px-6 border-none">
              <AccordionTrigger className="font-body text-sm font-medium text-foreground hover:no-underline hover:text-primary">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="font-body text-sm text-muted-foreground leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <Link to="/dashboard">
          <Button size="lg" className="bg-gradient-gold text-primary-foreground font-body font-semibold px-10 py-7 animate-gold-pulse shadow-gold-lg text-lg">
            Transform Your Resume Now <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </motion.div>
    </div>
    <Footer />
  </div>
);

export default About;
