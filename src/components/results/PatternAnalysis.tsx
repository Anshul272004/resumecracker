import { motion } from "framer-motion";
import { BarChart3, Users, TrendingDown, Award } from "lucide-react";

const commonMistakes = [
  { mistake: "No quantifiable metrics", percent: 83, detail: "83% of resumes lack numbers. Yours now has metrics in every bullet point." },
  { mistake: "Generic objective/summary", percent: 76, detail: "76% use copy-pasted summaries. Yours is role-specific with unique value proposition." },
  { mistake: "Irrelevant skills listed", percent: 71, detail: "71% list skills not in the JD. Your skills are now prioritized by job relevance." },
  { mistake: "No problem-solving narrative", percent: 89, detail: "89% describe tasks, not impact. Every bullet follows Problem → Action → Result." },
  { mistake: "Poor ATS formatting", percent: 68, detail: "68% use tables/graphics that ATS can't parse. Your format is 100% ATS-compatible." },
  { mistake: "One resume for all jobs", percent: 92, detail: "92% never customize per role. Your resume is dynamically tuned for this specific JD." },
  { mistake: "Weak action verbs", percent: 74, detail: "74% use passive language. We replaced with power verbs: Engineered, Optimized, Led." },
  { mistake: "Missing industry keywords", percent: 81, detail: "81% miss critical keywords. We extracted and embedded 156 matching keywords." },
];

const PatternAnalysis = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6 }}
    className="glass-deep rounded-2xl p-8 md:p-10 mb-8"
  >
    <div className="flex items-center gap-3 mb-2">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shadow-gold">
        <BarChart3 className="w-6 h-6 text-primary" />
      </div>
      <div>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">1,000,000+ Pattern Analysis</h2>
        <p className="font-body text-sm text-muted-foreground">What 83% of rejected resumes have in common — and how yours avoids it all</p>
      </div>
    </div>

    <div className="grid grid-cols-1 gap-3 mt-8">
      {commonMistakes.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 + i * 0.06 }}
          className="glass-gold rounded-xl p-5 flex items-center gap-4 lift-hover"
        >
          <div className="shrink-0 w-16 h-16 rounded-xl bg-destructive/10 flex flex-col items-center justify-center">
            <span className="font-display text-xl font-bold text-destructive">{item.percent}%</span>
            <span className="font-body text-[8px] text-destructive/70 uppercase">fail</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-body text-sm font-semibold text-foreground">{item.mistake}</h3>
              <span className="font-body text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold uppercase">Fixed ✓</span>
            </div>
            <p className="font-body text-xs text-muted-foreground mt-1">{item.detail}</p>
          </div>
          <div className="shrink-0 w-28 hidden md:block">
            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.percent}%` }}
                transition={{ delay: 1 + i * 0.1, duration: 0.8 }}
                className="h-full bg-destructive/60 rounded-full"
              />
            </div>
            <p className="font-body text-[9px] text-muted-foreground text-right mt-1">{item.percent}% of applicants</p>
          </div>
        </motion.div>
      ))}
    </div>

    <div className="mt-8 grid grid-cols-3 gap-4">
      {[
        { icon: Users, value: "1M+", label: "Resumes Analyzed", color: "text-foreground" },
        { icon: TrendingDown, value: "78%", label: "Avg. Rejection Rate", color: "text-destructive" },
        { icon: Award, value: "Top 1%", label: "Your Ranking Now", color: "text-primary" },
      ].map((stat, i) => (
        <div key={i} className="glass rounded-xl p-5 text-center lift-hover">
          <stat.icon className={`w-6 h-6 mx-auto mb-2 ${i === 1 ? "text-destructive" : "text-primary"}`} />
          <p className={`font-display text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          <p className="font-body text-xs text-muted-foreground mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  </motion.div>
);

export default PatternAnalysis;
