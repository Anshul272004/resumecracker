import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle2, ChevronRight, Shield, Zap, Star, Crown, Heart, Lock, Timer, Gift, Award, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Try before you buy — build your resume free",
    features: [
      "Build & edit full resume",
      "2 basic ATS templates",
      "Live preview",
      "Basic ATS score check",
      "Skill gap analysis",
    ],
    excluded: ["PDF/DOCX Download", "Cover Letter", "Project Reframing", "Premium Templates", "Interview Prep", "Unlimited Edits"],
    popular: false,
    cta: "Start Free",
    icon: Gift,
  },
  {
    name: "Starter",
    price: "₹299",
    period: "one-time",
    description: "Perfect for your first job application",
    features: [
      "Everything in Free",
      "ATS-Optimized Resume Rewrite",
      "Clean PDF Download",
      "Keyword Analysis & Matching",
      "1 Target Job Description",
      "Full ATS Score Report",
    ],
    excluded: ["Cover Letter", "Project Reframing", "Premium Templates", "Interview Prep", "Unlimited Edits"],
    popular: false,
    cta: "Get Starter",
    icon: Zap,
  },
  {
    name: "Pro",
    price: "₹499",
    period: "one-time",
    description: "Most popular — complete career package",
    features: [
      "Everything in Starter",
      "AI Cover Letter Generation",
      "Project Reframing Engine",
      "4 Elite Premium Templates",
      "Interview Prep (10+ Questions)",
      "Psychology & Neuro Insights",
      "3 Target Job Descriptions",
      "PDF + DOCX Export",
      "Priority Email Support",
    ],
    excluded: ["Unlimited Edits", "LinkedIn Optimization"],
    popular: true,
    cta: "Get Pro — Best Value",
    icon: Crown,
  },
  {
    name: "Elite",
    price: "₹199",
    period: "/month",
    description: "For serious job seekers — unlimited power",
    features: [
      "Everything in Pro",
      "Unlimited Job-Specific Edits",
      "Real-time AI Suggestions",
      "LinkedIn Profile Optimization",
      "Unlimited Interview Prep",
      "Dedicated Support Channel",
      "Early Access to New Features",
      "Custom Resume Branding",
    ],
    excluded: [],
    popular: false,
    cta: "Go Elite",
    icon: Award,
  },
];

const lifetimeDeal = {
  price: "₹1,499",
  originalPrice: "₹5,988",
  savings: "75%",
  features: ["Everything in Elite — forever", "No monthly payments", "Lifetime updates", "Priority support forever"],
};

const faqs = [
  { q: "Can I try ProfileX for free?", a: "Yes! Our Free plan lets you build and edit your full resume, preview it live, and get a basic ATS score — no credit card required. You only pay when you want to download or unlock premium features." },
  { q: "What happens after I pay?", a: "You get instant access to all features in your plan. Downloads are immediate. For the Pro plan, you get 3 job-specific resumes, cover letter, and interview prep — all available within seconds." },
  { q: "Is there a money-back guarantee?", a: "Absolutely. We offer a 30-day money-back guarantee on all paid plans. If you don't get more interview calls, we'll refund you — no questions asked." },
  { q: "Can I upgrade later?", a: "Yes. You can start with the Free plan and upgrade anytime. Your work is saved. The best conversion point is after you see your ATS score improvement." },
  { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards, UPI, net banking, and popular wallets. All payments are SSL-encrypted and secure." },
  { q: "How is the Lifetime deal different from Elite?", a: "The Lifetime deal gives you everything in the Elite plan (unlimited edits, interview prep, LinkedIn optimization) but with a one-time payment instead of monthly. It's the best value if you're actively job hunting." },
];

const Pricing = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container mx-auto px-6 pt-28 pb-16">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
        <span className="font-body text-xs font-semibold uppercase tracking-widest text-primary mb-4 block">Pricing</span>
        <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
          Invest in Your <span className="text-gradient-gold">Future</span>
        </h1>
        <p className="font-body text-muted-foreground max-w-lg mx-auto">
          One shortlist can change your life. Start free — upgrade when you see value.
        </p>
      </motion.div>

      {/* Urgency banner */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="flex items-center justify-center gap-2 mb-12">
        <div className="inline-flex items-center gap-2 bg-destructive/10 border border-destructive/20 rounded-full px-5 py-2">
          <Timer className="w-4 h-4 text-destructive" />
          <span className="font-body text-xs text-destructive font-semibold">🔥 Limited Offer: First 100 users get 50% off Pro — Only 23 spots left!</span>
        </div>
      </motion.div>

      {/* Plans */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative rounded-2xl p-6 flex flex-col transition-all duration-500 ${
              plan.popular ? "glass-gold glow-gold lg:scale-105" : "glass hover:glass-gold"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-gold text-primary-foreground font-body text-xs font-bold px-4 py-1 rounded-full">
                  MOST POPULAR
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 mb-3">
              <plan.icon className="w-5 h-5 text-primary" />
              <h3 className="font-display text-xl font-bold text-foreground">{plan.name}</h3>
            </div>
            <p className="font-body text-[10px] text-muted-foreground mb-4">{plan.description}</p>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="font-display text-4xl font-bold text-primary">{plan.price}</span>
              <span className="font-body text-sm text-muted-foreground">{plan.period}</span>
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
                    ? "bg-gradient-gold text-primary-foreground animate-gold-pulse"
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
        className="glass-gold rounded-2xl p-8 md:p-12 max-w-3xl mx-auto mb-16 glow-gold-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-gradient-gold text-primary-foreground font-body text-xs font-bold px-6 py-2 rounded-bl-xl">
          SAVE {lifetimeDeal.savings}
        </div>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
              🏆 Lifetime Deal
            </h2>
            <p className="font-body text-sm text-muted-foreground mb-4">
              Pay once, use forever. Everything in Elite — no monthly fees, ever.
            </p>
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
            <p className="font-display text-5xl font-bold text-primary">{lifetimeDeal.price}</p>
            <p className="font-body text-xs text-primary font-semibold mb-4">One-time payment</p>
            <Link to="/dashboard">
              <Button className="bg-gradient-gold text-primary-foreground font-body font-semibold px-8 py-5 animate-gold-pulse">
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
          <div key={i} className="glass rounded-xl p-4 text-center">
            <g.icon className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="font-body text-xs font-semibold text-foreground">{g.title}</p>
            <p className="font-body text-[10px] text-muted-foreground">{g.desc}</p>
          </div>
        ))}
      </motion.div>

      {/* Comparison Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="glass rounded-2xl p-8 max-w-5xl mx-auto overflow-x-auto mb-16">
        <h2 className="font-display text-xl font-bold text-foreground mb-6 text-center">Feature Comparison</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="font-body text-sm text-left text-muted-foreground py-3 pr-4">Feature</th>
              {plans.map((p) => (
                <th key={p.name} className={`font-body text-sm text-center py-3 px-3 ${p.popular ? "text-primary" : "text-foreground"}`}>{p.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { name: "Build & Edit Resume", free: true, starter: true, pro: true, elite: true },
              { name: "ATS Score Check", free: true, starter: true, pro: true, elite: true },
              { name: "PDF Download", free: false, starter: true, pro: true, elite: true },
              { name: "Keyword Analysis", free: false, starter: true, pro: true, elite: true },
              { name: "Cover Letter", free: false, starter: false, pro: true, elite: true },
              { name: "Project Reframing", free: false, starter: false, pro: true, elite: true },
              { name: "Premium Templates", free: false, starter: false, pro: true, elite: true },
              { name: "Interview Prep", free: false, starter: false, pro: true, elite: true },
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
        className="glass-gold rounded-2xl p-8 max-w-2xl mx-auto text-center mb-16">
        <div className="flex justify-center gap-1 mb-4">
          {Array(5).fill(0).map((_, i) => <Star key={i} className="w-5 h-5 fill-primary text-primary" />)}
        </div>
        <p className="font-body text-sm text-foreground leading-relaxed mb-4">
          "I was skeptical about paying ₹499 for a resume tool. Then I got 5 interview calls in my first week — including Google and Amazon. Best ₹499 I've ever spent."
        </p>
        <p className="font-body text-sm font-semibold text-foreground">— Sneha Reddy, ML Engineer at Microsoft</p>
      </motion.div>

      {/* FAQ */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
        className="max-w-2xl mx-auto mb-16">
        <h2 className="font-display text-2xl font-bold text-foreground text-center mb-8">
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
          <Button size="lg" className="bg-gradient-gold text-primary-foreground font-body font-semibold px-10 py-6 animate-gold-pulse">
            Start Free Resume Now <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        </Link>
        <p className="font-body text-xs text-muted-foreground mt-3">No credit card required. Start free, upgrade anytime.</p>
      </motion.div>
    </div>
    <Footer />
  </div>
);

export default Pricing;
