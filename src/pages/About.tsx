import { motion } from "framer-motion";
import { FileText, Target, Zap, Sparkles, Brain, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const timeline = [
  { icon: FileText, title: "Upload & Input", desc: "Your resume, projects, and target job description are ingested by the AI engine." },
  { icon: Brain, title: "AI Analysis", desc: "NLP extracts keywords, identifies skill gaps, and scores ATS compatibility." },
  { icon: Target, title: "Project Reframing", desc: "Every project is transformed using Problem → Action → Result framework with impact metrics." },
  { icon: Sparkles, title: "Resume Generation", desc: "ATS-optimized resume with role-specific keywords, quantified achievements, and professional formatting." },
  { icon: Zap, title: "Delivery", desc: "Download your enhanced resume, cover letter, and detailed intelligence report." },
];

const faqs = [
  { q: "How does ProfileX improve my resume?", a: "Our AI analyzes job descriptions to extract key requirements, then reframes your projects and experience using impact-driven language with quantifiable metrics. The result is an ATS-optimized resume that speaks directly to what hiring managers look for." },
  { q: "What is ATS and why does it matter?", a: "ATS (Applicant Tracking System) is software used by 90%+ companies to filter resumes before a human ever reads them. If your resume isn't optimized for ATS keywords and formatting, it gets automatically rejected — even if you're the perfect candidate." },
  { q: "Can ProfileX help with \"faltu\" (generic) projects?", a: "Absolutely! That's our specialty. We take projects like 'built a weather app' and reframe them into impact-driven narratives: 'Engineered a real-time weather intelligence dashboard reducing data fetch latency by 40%.' Same project, completely different perception." },
  { q: "Is my data safe?", a: "Yes. We use enterprise-grade encryption for all uploaded data. Your resume and personal information are never shared with third parties or used for training purposes." },
  { q: "Can I customize the resume for different jobs?", a: "Yes! With our Pro and Elite plans, you can generate multiple versions of your resume, each optimized for different job descriptions. The AI adjusts keywords, skill emphasis, and project framing for each target role." },
  { q: "What formats can I download?", a: "You can download your enhanced resume as a professionally formatted PDF, ready to submit to any job portal or email directly to recruiters." },
];

const About = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container mx-auto px-6 pt-28 pb-16">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
        <span className="font-body text-xs font-semibold uppercase tracking-widest text-primary mb-4 block">How It Works</span>
        <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
          The AI <span className="text-gradient-gold">Pipeline</span>
        </h1>
        <p className="font-body text-muted-foreground max-w-lg mx-auto">
          From upload to offer letter — here's how ProfileX transforms your career.
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="max-w-2xl mx-auto mb-24">
        {timeline.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex gap-6 relative"
          >
            {/* Line */}
            {i < timeline.length - 1 && (
              <div className="absolute left-5 top-14 w-px h-full bg-gradient-to-b from-primary/40 to-transparent" />
            )}
            {/* Icon */}
            <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center z-10 border border-primary/20">
              <step.icon className="w-5 h-5 text-primary" />
            </div>
            {/* Content */}
            <div className="pb-12">
              <div className="font-body text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Step {i + 1}</div>
              <h3 className="font-display text-lg font-bold text-foreground mb-1">{step.title}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Truth Bomb Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-gold rounded-2xl p-8 md:p-12 max-w-3xl mx-auto mb-24 glow-gold"
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
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
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
          <Button size="lg" className="bg-gradient-gold text-primary-foreground font-body font-semibold px-10 py-6 animate-gold-pulse">
            Transform Your Resume Now <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </motion.div>
    </div>
    <Footer />
  </div>
);

export default About;
