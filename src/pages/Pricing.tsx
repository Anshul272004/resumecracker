import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle2, ChevronRight, Shield, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const plans = [
  {
    name: "Starter",
    price: "₹299",
    period: "one-time",
    description: "Perfect for your first job application",
    features: [
      "ATS-Optimized Resume Rewrite",
      "Keyword Analysis & Matching",
      "1 Target Job Description",
      "PDF Download",
      "ATS Score Report",
    ],
    excluded: ["Cover Letter", "Project Reframing", "Unlimited Edits", "LinkedIn Optimization", "Priority Support"],
    popular: false,
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
      "3 Target Job Descriptions",
      "Skill Gap Analysis",
      "Reality Check Report",
      "Priority Email Support",
    ],
    excluded: ["Unlimited Edits", "LinkedIn Optimization"],
    popular: true,
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
      "Interview Prep Questions",
      "Dedicated Support",
      "Early Access to New Features",
    ],
    excluded: [],
    popular: false,
  },
];

const Pricing = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container mx-auto px-6 pt-28 pb-16">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <span className="font-body text-xs font-semibold uppercase tracking-widest text-primary mb-4 block">Pricing</span>
        <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
          Invest in Your <span className="text-gradient-gold">Future</span>
        </h1>
        <p className="font-body text-muted-foreground max-w-lg mx-auto">
          One shortlist can change your life. Choose the plan that matches your ambition.
        </p>
      </motion.div>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            className={`relative rounded-2xl p-8 flex flex-col transition-all duration-500 ${
              plan.popular ? "glass-gold glow-gold md:scale-105" : "glass hover:glass-gold"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-gold text-primary-foreground font-body text-xs font-bold px-4 py-1 rounded-full">
                  MOST POPULAR
                </span>
              </div>
            )}
            <h3 className="font-display text-2xl font-bold text-foreground">{plan.name}</h3>
            <p className="font-body text-xs text-muted-foreground mt-1 mb-4">{plan.description}</p>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="font-display text-5xl font-bold text-primary">{plan.price}</span>
              <span className="font-body text-sm text-muted-foreground">{plan.period}</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((f, j) => (
                <li key={j} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="font-body text-sm text-foreground">{f}</span>
                </li>
              ))}
            </ul>
            <Link to="/dashboard">
              <Button
                className={`w-full font-body font-semibold py-5 ${
                  plan.popular
                    ? "bg-gradient-gold text-primary-foreground animate-gold-pulse"
                    : "bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground"
                }`}
              >
                Get {plan.name} <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Guarantees */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-wrap items-center justify-center gap-8 mb-16">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Shield className="w-5 h-5 text-primary" />
          <span className="font-body text-sm">Money-Back Guarantee</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Zap className="w-5 h-5 text-primary" />
          <span className="font-body text-sm">Instant Results</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Star className="w-5 h-5 text-primary" />
          <span className="font-body text-sm">4.9/5 Rating</span>
        </div>
      </motion.div>

      {/* Comparison Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass rounded-2xl p-8 max-w-4xl mx-auto overflow-x-auto">
        <h2 className="font-display text-xl font-bold text-foreground mb-6 text-center">Feature Comparison</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="font-body text-sm text-left text-muted-foreground py-3 pr-4">Feature</th>
              {plans.map((p) => (
                <th key={p.name} className="font-body text-sm text-center text-foreground py-3 px-4">{p.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              "ATS Resume Optimization",
              "Keyword Analysis",
              "ATS Score Report",
              "Cover Letter",
              "Project Reframing",
              "Skill Gap Analysis",
              "Unlimited Job Edits",
              "LinkedIn Optimization",
              "Priority Support",
            ].map((feature) => (
              <tr key={feature} className="border-b border-border/50">
                <td className="font-body text-sm text-muted-foreground py-3 pr-4">{feature}</td>
                {plans.map((plan) => (
                  <td key={plan.name} className="text-center py-3 px-4">
                    {plan.features.some((f) => f.toLowerCase().includes(feature.toLowerCase().split(" ")[0])) || plan.features.includes("Everything in Starter") || plan.features.includes("Everything in Pro") ? (
                      <CheckCircle2 className="w-4 h-4 text-primary mx-auto" />
                    ) : (
                      <span className="text-muted-foreground/30">—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
    <Footer />
  </div>
);

export default Pricing;
