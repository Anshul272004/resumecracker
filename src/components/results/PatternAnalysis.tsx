import { motion } from "framer-motion";
import { BarChart3, Users, TrendingDown, Award } from "lucide-react";

const commonMistakes = [
  { mistake: "No quantifiable metrics", percent: 83, yourStatus: "fixed", detail: "83% of resumes lack numbers. Yours now has metrics in every bullet point." },
  { mistake: "Generic objective/summary", percent: 76, yourStatus: "fixed", detail: "76% use copy-pasted summaries. Yours is role-specific with unique value proposition." },
  { mistake: "Irrelevant skills listed", percent: 71, yourStatus: "fixed", detail: "71% list skills not in the JD. Your skills are now prioritized by job relevance." },
  { mistake: "No problem-solving narrative", percent: 89, yourStatus: "fixed", detail: "89% describe tasks, not impact. Every bullet now follows Problem → Action → Result." },
  { mistake: "Poor ATS formatting", percent: 68, yourStatus: "fixed", detail: "68% use tables/graphics that ATS can't parse. Your format is 100% ATS-compatible." },
  { mistake: "One resume for all jobs", percent: 92, yourStatus: "fixed", detail: "92% never customize per role. Your resume is dynamically tuned for this specific JD." },
  { mistake: "Weak action verbs", percent: 74, yourStatus: "fixed", detail: "74% use passive language. We replaced with power verbs: Engineered, Optimized, Led." },
  { mistake: "Missing industry keywords", percent: 81, yourStatus: "fixed", detail: "81% miss critical keywords. We extracted and embedded 156 matching keywords." },
];

const PatternAnalysis = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6 }}
    className="glass rounded-2xl p-8 mb-8"
  >
    <div className="flex items-center gap-3 mb-2">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
        <BarChart3 className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">1,000,000+ Pattern Analysis</h2>
        <p className="font-body text-xs text-muted-foreground">What 83% of rejected resumes have in common — and how yours avoids it all</p>
      </div>
    </div>

    <div className="grid grid-cols-1 gap-3 mt-6">
      {commonMistakes.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 + i * 0.06 }}
          className="glass-gold rounded-xl p-4 flex items-center gap-4"
        >
          <div className="shrink-0 w-14 h-14 rounded-xl bg-destructive/10 flex flex-col items-center justify-center">
            <span className="font-display text-lg font-bold text-destructive">{item.percent}%</span>
            <span className="font-body text-[8px] text-destructive/70 uppercase">fail</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-body text-sm font-semibold text-foreground">{item.mistake}</h3>
              <span className="font-body text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold uppercase">Fixed ✓</span>
            </div>
            <p className="font-body text-xs text-muted-foreground mt-0.5">{item.detail}</p>
          </div>
          {/* Mini bar */}
          <div className="shrink-0 w-24 hidden md:block">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.percent}%` }}
                transition={{ delay: 1 + i * 0.1, duration: 0.8 }}
                className="h-full bg-destructive/60 rounded-full"
              />
            </div>
            <p className="font-body text-[9px] text-muted-foreground text-right mt-0.5">{item.percent}% of applicants</p>
          </div>
        </motion.div>
      ))}
    </div>

    <div className="mt-6 grid grid-cols-3 gap-4">
      <div className="glass rounded-xl p-4 text-center">
        <Users className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
        <p className="font-display text-2xl font-bold text-foreground">1M+</p>
        <p className="font-body text-[10px] text-muted-foreground">Resumes Analyzed</p>
      </div>
      <div className="glass rounded-xl p-4 text-center">
        <TrendingDown className="w-5 h-5 text-destructive mx-auto mb-1" />
        <p className="font-display text-2xl font-bold text-foreground">78%</p>
        <p className="font-body text-[10px] text-muted-foreground">Avg. Rejection Rate</p>
      </div>
      <div className="glass rounded-xl p-4 text-center">
        <Award className="w-5 h-5 text-primary mx-auto mb-1" />
        <p className="font-display text-2xl font-bold text-primary">Top 1%</p>
        <p className="font-body text-[10px] text-muted-foreground">Your Ranking Now</p>
      </div>
    </div>
  </motion.div>
);

export default PatternAnalysis;
