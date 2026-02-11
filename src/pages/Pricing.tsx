import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle2, ChevronRight, Shield, Zap, Star, Crown, Heart, Lock, Timer, Gift, Award, Calculator, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CountdownTimer from "@/components/CountdownTimer";

const plans = [
  {
    name: "Free", price: "₹0", period: "forever",
    description: "Try before you buy — build your resume free",
    userCount: "8,200+",
    features: ["Build & edit full resume", "2 basic ATS templates", "Live preview", "Basic ATS score check", "Skill gap analysis"],
    excluded: ["PDF/DOCX Download", "Cover Letter", "Project Reframing", "Premium Templates", "Interview Prep", "Unlimited Edits"],
    popular: false, cta: "Start Free", icon: Gift,
  },
  {
    name: "Starter", price: "₹299", period: "one-time",
    description: "Perfect for your first job application",
    userCount: "3,450+",
    features: ["Everything in Free", "ATS-Optimized Resume Rewrite", "Clean PDF Download", "Keyword Analysis & Matching", "1 Target Job Description", "Full ATS Score Report"],
    excluded: ["Cover Letter", "Project Reframing", "Premium Templates", "Interview Prep", "Unlimited Edits"],
    popular: false, cta: "Get Starter", icon: Zap,
  },
  {
    name: "Pro", price: "₹499", period: "one-time",
    description: "Most popular — complete career package",
    userCount: "2,340+",
    recommended: true,
    features: ["Everything in Starter", "AI Cover Letter Generation", "Project Reframing Engine", "4 Elite Premium Templates", "Interview Prep (25+ Questions)", "Psychology & Neuro Insights", "3 Target Job Descriptions", "PDF + DOCX Export", "Priority Email Support"],
    excluded: ["Unlimited Edits", "LinkedIn Optimization"],
    popular: true, cta: "Get Pro — Best Value", icon: Crown,
  },
  {
    name: "Elite", price: "₹199", period: "/month",
    annualPrice: "₹149",
    description: "For serious job seekers — unlimited power",
    userCount: "890+",
    features: ["Everything in Pro", "Unlimited Job-Specific Edits", "Real-time AI Suggestions", "LinkedIn Profile Optimization", "Unlimited Interview Prep", "Dedicated Support Channel", "Early Access to New Features", "Custom Resume Branding"],
    excluded: [], popular: false, cta: "Go Elite", icon: Award,
  },
];

const lifetimeDeal = {
  price: "₹1,499", originalPrice: "₹5,988", savings: "75%",
  features: ["Everything in Elite — forever", "No monthly payments", "Lifetime updates", "Priority support forever"],
};

const faqs = [
  { q: "Can I try ProfileX for free?", a: "Yes! Our Free plan lets you build and edit your full resume, preview it live, and get a basic ATS score — no credit card required." },
  { q: "What happens after I pay?", a: "You get instant access to all features in your plan. Downloads are immediate. For Pro, you get 3 job-specific resumes, cover letter, and interview prep." },
  { q: "Is there a money-back guarantee?", a: "Absolutely. 30-day money-back guarantee on all paid plans. If you don't get more interview calls, we'll refund you — no questions asked." },
  { q: "Can I upgrade later?", a: "Yes. Start Free and upgrade anytime. Your work is saved." },
  { q: "What payment methods do you accept?", a: "All major credit/debit cards, UPI, net banking, and wallets. SSL-encrypted and secure." },
  { q: "How is the Lifetime deal different?", a: "Everything in Elite but one-time payment. Best value if you're actively job hunting." },
  { q: "Do you offer student discounts?", a: "Yes! Students with a valid .edu email get 30% off any paid plan. Use code STUDENT30 at checkout." },
  { q: "Can I use ProfileX for multiple job applications?", a: "Starter supports 1 JD, Pro supports 3, and Elite offers unlimited. Each generates a unique optimized resume." },
];

const Pricing = () => {
  const [showSavings, setShowSavings] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 pt-28 pb-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <span className="font-body text-xs font-semibold uppercase tracking-widest text-primary mb-4 block">Pricing</span>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-4 text-shadow-gold">
            Invest in Your <span className="text-gradient-gold">Future</span>
          </h1>
          <p className="font-body text-base md:text-lg text-muted-foreground max-w-lg mx-auto">
            One shortlist can change your life. Start free — upgrade when you see value.
          </p>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          className="flex justify-center mb-4">
          <CountdownTimer />
        </motion.div>

        {/* Student Discount Banner */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-2 mb-6">
          <div className="inline-flex items-center gap-2 glass-gold rounded-full px-5 py-2">
            <GraduationCap className="w-4 h-4 text-primary" />
            <span className="font-body text-xs text-primary font-semibold">🎓 Students get 30% off — Use code STUDENT30</span>
          </div>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.22 }}
          className="flex items-center justify-center gap-3 mb-10">
          <span className={`font-body text-sm ${!isAnnual ? "text-primary font-semibold" : "text-muted-foreground"}`}>Monthly</span>
          <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
          <span className={`font-body text-sm ${isAnnual ? "text-primary font-semibold" : "text-muted-foreground"}`}>Annual</span>
          {isAnnual && <span className="font-body text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">Save 25%</span>}
        </motion.div>

        {/* Savings Calculator */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="glass-gold-deep rounded-2xl p-6 max-w-2xl mx-auto mb-12 text-center border-shine">
          <button onClick={() => setShowSavings(!showSavings)} className="flex items-center gap-2 mx-auto font-body text-sm text-primary font-semibold">
            <Calculator className="w-4 h-4" /> Compare with Professional Resume Writers
          </button>
          {showSavings && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 space-y-3">
              {[
                { service: "Professional Resume Writer", cost: "₹5,000 - ₹15,000" },
                { service: "Career Coaching Session", cost: "₹3,000 - ₹8,000" },
                { service: "Interview Prep Course", cost: "₹2,000 - ₹5,000" },
                { service: "LinkedIn Optimization", cost: "₹1,500 - ₹4,000" },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center glass rounded-lg p-3">
                  <span className="font-body text-xs text-muted-foreground">{item.service}</span>
                  <span className="font-body text-xs text-destructive font-semibold line-through">{item.cost}</span>
                </div>
              ))}
              <div className="glass-gold rounded-lg p-4">
                <p className="font-body text-sm text-primary font-bold">ProfileX Pro gives you ALL of this for just ₹499</p>
                <p className="font-body text-xs text-muted-foreground mt-1">That's saving ₹10,000+ on average</p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl p-6 flex flex-col transition-all duration-500 lift-hover ${
                plan.popular ? "glass-gold-deep glow-gold-xl lg:scale-105 border-shine" : "glass hover:glass-gold"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-gold text-primary-foreground font-body text-xs font-bold px-4 py-1 rounded-full shadow-gold animate-pulse-gold">
                    MOST POPULAR
                  </span>
                </div>
              )}
              {plan.recommended && (
                <div className="absolute -top-3 right-3">
                  <span className="bg-primary/20 text-primary font-body text-[10px] font-bold px-3 py-1 rounded-full">
                    RECOMMENDED
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 mb-3">
                <plan.icon className="w-5 h-5 text-primary" />
                <h3 className="font-display text-xl font-bold text-foreground">{plan.name}</h3>
              </div>
              <p className="font-body text-[10px] text-muted-foreground mb-2">{plan.description}</p>
              <p className="font-body text-[10px] text-primary/70 mb-4">👥 {plan.userCount} users chose this plan</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="font-display text-5xl font-bold text-primary text-shadow-gold">
                  {isAnnual && plan.annualPrice ? plan.annualPrice : plan.price}
                </span>
                <span className="font-body text-sm text-muted-foreground">
                  {isAnnual && plan.annualPrice ? "/month (billed annually)" : plan.period}
                </span>
              </div>
              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    <span className="font-body text-xs text-foreground">{f}</span>
                  </li>
                ))}
                {plan.excluded.map((f, j) => (
                  <li key={`x-${j}`} className="flex items-start gap-2 opacity-30">
                    <span className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5 text-center text-xs">—</span>
                    <span className="font-body text-xs text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/dashboard">
                <Button
                  className={`w-full font-body font-semibold text-sm py-5 ${
                    plan.popular
                      ? "bg-gradient-gold text-primary-foreground animate-gold-pulse shadow-gold"
                      : "bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  {plan.cta} <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Lifetime Deal */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="glass-gold-deep rounded-2xl p-8 md:p-12 max-w-3xl mx-auto mb-16 glow-gold-xl relative overflow-hidden border-shine">
          <div className="absolute top-0 right-0 bg-gradient-gold text-primary-foreground font-body text-xs font-bold px-6 py-2 rounded-bl-xl">
            SAVE {lifetimeDeal.savings}
          </div>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">🏆 Lifetime Deal</h2>
              <p className="font-body text-sm text-muted-foreground mb-4">Pay once, use forever. Everything in Elite — no monthly fees.</p>
              <ul className="space-y-2 mb-4">
                {lifetimeDeal.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span className="font-body text-sm text-foreground">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-center">
              <p className="font-body text-sm text-muted-foreground line-through">{lifetimeDeal.originalPrice}</p>
              <p className="font-display text-6xl font-bold text-primary text-shadow-gold-lg">{lifetimeDeal.price}</p>
              <p className="font-body text-xs text-primary font-semibold mb-4">One-time payment</p>
              <Link to="/dashboard">
                <Button className="bg-gradient-gold text-primary-foreground font-body font-semibold px-8 py-5 animate-gold-pulse shadow-gold-lg">
                  Get Lifetime Access <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Guarantees */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 max-w-4xl mx-auto">
          {[
            { icon: Shield, title: "30-Day Money Back", desc: "No interviews? Full refund." },
            { icon: Lock, title: "SSL Encrypted", desc: "Payments 100% secure." },
            { icon: Heart, title: "Risk-Free", desc: "See results before paying." },
            { icon: Star, title: "4.9/5 Rating", desc: "2,400+ verified reviews." },
          ].map((g, i) => (
            <div key={i} className="glass rounded-xl p-5 text-center lift-hover">
              <g.icon className="w-7 h-7 text-primary mx-auto mb-2" />
              <p className="font-body text-sm font-semibold text-foreground">{g.title}</p>
              <p className="font-body text-xs text-muted-foreground">{g.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Comparison Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="glass-deep rounded-2xl p-8 max-w-5xl mx-auto overflow-x-auto mb-16">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">Feature Comparison</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="font-body text-sm text-left text-muted-foreground py-3 pr-4">Feature</th>
                {plans.map((p) => (
                  <th key={p.name} className={`font-body text-sm text-center py-3 px-3 ${p.popular ? "text-primary font-bold" : "text-foreground"}`}>{p.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Build & Edit Resume", free: true, starter: true, pro: true, elite: true },
                { name: "ATS Score Check", free: true, starter: true, pro: true, elite: true },
                { name: "PDF Download", free: false, starter: true, pro: true, elite: true },
                { name: "DOCX Export", free: false, starter: false, pro: true, elite: true },
                { name: "Keyword Analysis", free: false, starter: true, pro: true, elite: true },
                { name: "Cover Letter", free: false, starter: false, pro: true, elite: true },
                { name: "Project Reframing", free: false, starter: false, pro: true, elite: true },
                { name: "Premium Templates", free: false, starter: false, pro: true, elite: true },
                { name: "Interview Prep (25+)", free: false, starter: false, pro: true, elite: true },
                { name: "Psychology Insights", free: false, starter: false, pro: true, elite: true },
                { name: "Unlimited Edits", free: false, starter: false, pro: false, elite: true },
                { name: "LinkedIn Optimization", free: false, starter: false, pro: false, elite: true },
                { name: "Priority Support", free: false, starter: false, pro: false, elite: true },
              ].map((row) => (
                <tr key={row.name} className="border-b border-border/50">
                  <td className="font-body text-xs text-muted-foreground py-3 pr-4">{row.name}</td>
                  {[row.free, row.starter, row.pro, row.elite].map((val, ci) => (
                    <td key={ci} className="text-center py-3 px-3">
                      {val ? <CheckCircle2 className="w-4 h-4 text-primary mx-auto" /> : <span className="text-muted-foreground/30">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Testimonial */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="glass-gold-deep rounded-2xl p-8 max-w-2xl mx-auto text-center mb-16 glow-gold border-shine">
          <div className="flex justify-center gap-1 mb-4">
            {Array(5).fill(0).map((_, i) => <Star key={i} className="w-6 h-6 fill-primary text-primary" />)}
          </div>
          <p className="font-body text-base text-foreground leading-relaxed mb-4">
            "I was skeptical about paying ₹499 for a resume tool. Then I got 5 interview calls in my first week — including Google and Amazon. Best ₹499 I've ever spent."
          </p>
          <p className="font-body text-sm font-semibold text-foreground">— Sneha Reddy, ML Engineer at Microsoft</p>
        </motion.div>

        {/* FAQ */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
          className="max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-8">
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

        {/* Final CTA */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-center">
          <Link to="/dashboard">
            <Button size="lg" className="bg-gradient-gold text-primary-foreground font-body font-semibold px-10 py-7 animate-gold-pulse shadow-gold-lg text-lg">
              Start Free Resume Now <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </Link>
          <p className="font-body text-xs text-muted-foreground mt-4">No credit card required. Free forever plan available.</p>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Pricing;
