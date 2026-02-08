import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle2, AlertTriangle, TrendingUp, Target, FileText, ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ATSGauge from "@/components/results/ATSGauge";
import PsychologyInsights from "@/components/results/PsychologyInsights";
import ATSAlgorithmBreakdown from "@/components/results/ATSAlgorithmBreakdown";
import PatternAnalysis from "@/components/results/PatternAnalysis";

const Results = () => {
  const skills = {
    matched: ["Python", "SQL", "Data Analysis", "Problem Solving", "Machine Learning"],
    missing: ["Tableau", "A/B Testing", "Statistical Modeling"],
  };

  const reframedProjects = [
    {
      before: "Built a weather app using API",
      after: "Engineered a real-time weather intelligence dashboard integrating RESTful APIs with caching layer, reducing data fetch latency by 40% and improving user engagement metrics.",
      problem: "Users lacked consolidated, fast-loading weather data",
      action: "Built React dashboard with API caching and error handling",
      result: "40% faster data retrieval, 2x user session duration",
    },
    {
      before: "Made a Python project to count vowels in a string",
      after: "Designed a Python-based text analysis module to efficiently process and categorize character data, improving input validation accuracy by 30% through optimized conditional handling.",
      problem: "Inefficient text processing with redundant operations",
      action: "Refactored algorithm with optimized conditional checks",
      result: "30% improvement in validation accuracy, cleaner codebase",
    },
    {
      before: "Created a to-do list app using React",
      after: "Developed a full-stack task management platform with persistent state management and priority-based sorting, boosting user productivity tracking by 2x across 500+ active users.",
      problem: "No structured task prioritization or persistence",
      action: "Built React app with state persistence and priority algorithms",
      result: "2x productivity improvement, 500+ active users",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 pt-28 pb-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 glass-gold rounded-full px-5 py-2 mb-4">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span className="font-body text-xs font-medium text-primary">Analysis Complete</span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-3">
            Your Resume <span className="text-gradient-gold">Intelligence Report</span>
          </h1>
          <p className="font-body text-sm text-muted-foreground max-w-lg mx-auto">
            Based on 1,000,000+ resume patterns, psychology research, and ATS algorithm analysis
          </p>
        </motion.div>

        {/* ATS Scores */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-8 mb-8">
          <h2 className="font-display text-xl font-bold text-foreground mb-6 text-center">ATS Compatibility Score</h2>
          <div className="grid grid-cols-2 gap-8 max-w-md mx-auto">
            <ATSGauge score={23} label="Before" color="hsl(0 84% 60%)" />
            <ATSGauge score={92} label="After ProfileX" color="hsl(43 75% 52%)" />
          </div>
          <p className="font-body text-sm text-center text-primary font-semibold mt-6">
            +69% improvement — Your resume now passes ATS filters and ranks in the top 1%
          </p>
        </motion.div>

        {/* ATS Algorithm Breakdown */}
        <ATSAlgorithmBreakdown />

        {/* Skill Gap */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-2xl p-8 mb-8">
          <h2 className="font-display text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" /> Skill Gap Analysis
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="font-body text-xs font-semibold text-primary uppercase tracking-wider mb-3">✅ Matched Skills</p>
              <div className="flex flex-wrap gap-2">
                {skills.matched.map((s) => (
                  <span key={s} className="bg-primary/10 text-primary font-body text-xs px-3 py-1.5 rounded-full border border-primary/20">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="font-body text-xs font-semibold text-destructive uppercase tracking-wider mb-3">⚠️ Missing Skills</p>
              <div className="flex flex-wrap gap-2">
                {skills.missing.map((s) => (
                  <span key={s} className="bg-destructive/10 text-destructive font-body text-xs px-3 py-1.5 rounded-full border border-destructive/20">{s}</span>
                ))}
              </div>
              <p className="font-body text-[10px] text-muted-foreground mt-3">
                💡 Tip: Add these skills to your profile and we'll highlight transferable experience in your resume
              </p>
            </div>
          </div>
        </motion.div>

        {/* Project Reframing */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass rounded-2xl p-8 mb-8">
          <h2 className="font-display text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" /> Project Reframing Engine
          </h2>
          <div className="space-y-6">
            {reframedProjects.map((proj, i) => (
              <div key={i} className="glass-gold rounded-xl p-6">
                <div className="grid md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <span className="font-body text-[10px] font-bold text-destructive uppercase tracking-wider">Before</span>
                    <p className="font-body text-sm text-muted-foreground mt-1 line-through decoration-destructive/30">"{proj.before}"</p>
                  </div>
                  <div>
                    <span className="font-body text-[10px] font-bold text-primary uppercase tracking-wider">After ProfileX</span>
                    <p className="font-body text-sm text-foreground mt-1">"{proj.after}"</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {[
                    { label: "Problem", text: proj.problem },
                    { label: "Action", text: proj.action },
                    { label: "Result", text: proj.result },
                  ].map((item) => (
                    <div key={item.label} className="glass rounded-lg p-3">
                      <p className="font-body text-[10px] font-bold text-primary uppercase mb-1">{item.label}</p>
                      <p className="font-body text-xs text-muted-foreground">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Psychology & Neuro Insights */}
        <PsychologyInsights />

        {/* Pattern Analysis */}
        <PatternAnalysis />

        {/* Reality Check */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="glass rounded-2xl p-8 mb-8">
          <h2 className="font-display text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-primary" /> Reality Check
          </h2>
          <div className="space-y-4">
            {[
              { issue: "No quantifiable metrics in 80% of bullet points", fix: "Added impact numbers to all project descriptions" },
              { issue: "Generic skills section with no prioritization", fix: "Reordered skills by job relevance with ATS keywords first" },
              { issue: "Projects lack problem-solving narrative", fix: "Reframed using Problem → Action → Result framework" },
              { issue: "Summary reads like every other fresher resume", fix: "Personalized with unique value proposition and role-specific language" },
              { issue: "No evidence of scale or complexity", fix: "Added user counts, performance metrics, and technical depth" },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 glass-gold rounded-xl p-4">
                <AlertTriangle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-body text-sm text-foreground font-medium">{item.issue}</p>
                  <p className="font-body text-xs text-primary mt-1">✓ {item.fix}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/resume-builder">
            <Button size="lg" className="bg-gradient-gold text-primary-foreground font-body font-semibold px-8">
              <FileText className="w-5 h-5 mr-2" /> View Enhanced Resume
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 font-body">
            <Download className="w-5 h-5 mr-2" /> Download Full Report
          </Button>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Results;
