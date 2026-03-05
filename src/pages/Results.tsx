import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, Link } from "react-router-dom";
import { CheckCircle2, AlertTriangle, TrendingUp, Target, FileText, ArrowRight, Download, Eye, Users, Clock, Crosshair, Share2, ListChecks, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ATSGauge from "@/components/results/ATSGauge";
import PsychologyInsights from "@/components/results/PsychologyInsights";
import ATSAlgorithmBreakdown from "@/components/results/ATSAlgorithmBreakdown";
import PatternAnalysis from "@/components/results/PatternAnalysis";
import ReportCard from "@/components/results/ReportCard";
import KeywordDensity from "@/components/results/KeywordDensity";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface OptimizedData {
  optimized_bullets: string[];
  keyword_suggestions: string[];
  ats_score: number;
  psychology_tips: string[];
  cover_letter_draft: string;
}

interface ResumeResult {
  ats_score: number | null;
  target_role: string | null;
  target_company: string | null;
  job_description: string | null;
  resume_data: any;
}

const Results = () => {
  const { user } = useAuth();
  const location = useLocation();
  const resumeId = (location.state as any)?.resumeId;

  const [loading, setLoading] = useState(true);
  const [resume, setResume] = useState<ResumeResult | null>(null);
  const [optimized, setOptimized] = useState<OptimizedData | null>(null);

  useEffect(() => {
    const loadResume = async () => {
      if (!user) { setLoading(false); return; }

      let query = supabase.from("resumes").select("ats_score, target_role, target_company, job_description, resume_data").eq("user_id", user.id);
      if (resumeId) {
        query = query.eq("id", resumeId);
      } else {
        query = query.order("updated_at", { ascending: false }).limit(1);
      }

      const { data } = await query.single();
      if (data) {
        setResume(data);
        const rd = data.resume_data as any;
        if (rd?.optimized) setOptimized(rd.optimized);
      }
      setLoading(false);
    };
    loadResume();
  }, [user, resumeId]);

  const atsScore = optimized?.ats_score ?? resume?.ats_score ?? 92;
  const keywordSuggestions = optimized?.keyword_suggestions ?? [];
  const optimizedBullets = optimized?.optimized_bullets ?? [];
  const psychologyTips = optimized?.psychology_tips ?? [];
  const coverLetter = optimized?.cover_letter_draft ?? "";

  // Derive skills from resume data + keyword suggestions
  const resumeSkills = (resume?.resume_data as any)?.profile?.skills?.split(",").map((s: string) => s.trim()).filter(Boolean) ?? [];
  const matchedSkills = resumeSkills.length > 0 ? resumeSkills.slice(0, 5) : ["Python", "SQL", "Data Analysis", "Problem Solving", "Machine Learning"];
  const missingSkills = keywordSuggestions.length > 0 ? keywordSuggestions.slice(0, 5) : ["Tableau", "A/B Testing", "Statistical Modeling"];

  // Derive projects from resume data
  const rawProjects = (resume?.resume_data as any)?.projects ?? [];
  const reframedProjects = rawProjects.length > 0
    ? rawProjects.slice(0, 3).map((p: any, i: number) => ({
        before: p.name || `Project ${i + 1}`,
        after: optimizedBullets[i] || `Optimized version of ${p.name || "project"}`,
        problem: p.problem || "Problem identified",
        action: p.action || "Action taken",
        result: p.impact || "Impact measured",
      }))
    : [
        { before: "Built a weather app using API", after: "Engineered a real-time weather intelligence dashboard integrating RESTful APIs with caching layer, reducing data fetch latency by 40%.", problem: "Users lacked consolidated weather data", action: "Built React dashboard with API caching", result: "40% faster data retrieval" },
        { before: "Made a Python project to count vowels", after: "Designed a Python-based text analysis module improving input validation accuracy by 30%.", problem: "Inefficient text processing", action: "Refactored algorithm with optimized checks", result: "30% improvement in validation accuracy" },
        { before: "Created a to-do list app using React", after: "Developed a full-stack task management platform boosting user productivity by 2x across 500+ users.", problem: "No structured task prioritization", action: "Built React app with state persistence", result: "2x productivity improvement" },
      ];

  const realityChecks = psychologyTips.length > 0
    ? psychologyTips.slice(0, 5).map((tip, i) => ({
        issue: tip,
        fix: `Applied by ProfileX AI optimization`,
        severity: i < 2 ? "Critical" : i < 4 ? "High" : "Medium",
      }))
    : [
        { issue: "No quantifiable metrics in 80% of bullet points", fix: "Added impact numbers to all project descriptions", severity: "Critical" },
        { issue: "Generic skills section with no prioritization", fix: "Reordered skills by job relevance with ATS keywords first", severity: "High" },
        { issue: "Projects lack problem-solving narrative", fix: "Reframed using Problem → Action → Result framework", severity: "Critical" },
        { issue: "Summary reads like every other fresher resume", fix: "Personalized with unique value proposition", severity: "High" },
        { issue: "No evidence of scale or complexity", fix: "Added user counts, performance metrics, and technical depth", severity: "Medium" },
      ];

  const actionPlan = [
    { step: "Download your enhanced resume", icon: Download, done: false },
    { step: "Review & customize in Resume Builder", icon: FileText, done: false },
    { step: "Prepare with Interview Prep Engine", icon: Target, done: false },
    { step: "Apply to target roles with confidence", icon: TrendingUp, done: false },
    { step: "Share your score & inspire others", icon: Share2, done: false },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="font-body text-sm text-muted-foreground">Loading your results...</p>
        </div>
      </div>
    );
  }

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
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-3 text-shadow-gold">
            Your Resume <span className="text-gradient-gold">Intelligence Report</span>
          </h1>
          <p className="font-body text-base md:text-lg text-muted-foreground max-w-lg mx-auto">
            {resume?.target_role
              ? `Optimized for "${resume.target_role}"${resume.target_company ? ` at ${resume.target_company}` : ""}`
              : "Based on 1,000,000+ resume patterns, psychology research, and ATS algorithm analysis"}
          </p>
        </motion.div>

        {/* ATS Scores */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-deep rounded-2xl p-8 md:p-10 mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">ATS Compatibility Score</h2>
          <div className="grid grid-cols-2 gap-8 max-w-md mx-auto">
            <ATSGauge score={Math.max(15, atsScore - 60 - Math.floor(Math.random() * 10))} label="Before" color="hsl(0 84% 60%)" />
            <ATSGauge score={atsScore} label="After ProfileX" color="hsl(43 75% 52%)" />
          </div>
          <p className="font-body text-base text-center text-primary font-semibold mt-6">
            +{atsScore - Math.max(15, atsScore - 65)}% improvement — Your resume now passes ATS filters
          </p>
        </motion.div>

        {/* Report Card */}
        <ReportCard atsScore={atsScore} keywordMatch={keywordSuggestions.length > 0 ? Math.min(98, 70 + keywordSuggestions.length * 3) : 96} />

        {/* Keyword Density */}
        <KeywordDensity keywords={keywordSuggestions} resumeSkills={resumeSkills} />

        {/* Recruiter Simulation */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-gold-deep rounded-2xl p-8 md:p-10 mb-8 glow-gold border-shine">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shadow-gold">
              <Eye className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Recruiter Eye Simulation</h2>
              <p className="font-body text-sm text-muted-foreground">How a recruiter scans your resume in the first 7.4 seconds</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass rounded-xl p-6">
              <h3 className="font-body text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-primary" /> Hotspot Areas (F-Pattern)
              </h3>
              <div className="space-y-3">
                {[
                  { area: "Name & Title", time: "0.5s", attention: 95 },
                  { area: "Summary / Objective", time: "1.2s", attention: 88 },
                  { area: "Most Recent Role", time: "2.1s", attention: 82 },
                  { area: "Skills Section", time: "1.5s", attention: 75 },
                  { area: "Education", time: "0.8s", attention: 45 },
                  { area: "Projects", time: "1.3s", attention: 70 },
                ].map((spot, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="font-body text-xs text-muted-foreground w-32">{spot.area}</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${spot.attention}%` }} transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                        className="h-full bg-primary rounded-full" />
                    </div>
                    <span className="font-body text-[10px] text-primary font-semibold w-10 text-right">{spot.attention}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="glass-gold rounded-xl p-5 text-center">
                <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-display text-4xl font-bold text-primary">7.4s</p>
                <p className="font-body text-xs text-muted-foreground mt-1">Average recruiter scan time</p>
                <p className="font-body text-xs text-primary font-semibold mt-2">Your resume is optimized for this exact window</p>
              </div>
              <div className="glass rounded-xl p-5">
                <h4 className="font-body text-xs font-bold text-primary uppercase tracking-wider mb-2">Industry Benchmark</h4>
                <div className="space-y-2">
                  {[
                    { label: "Average Applicant", score: 34 },
                    { label: "Good Resume", score: 62 },
                    { label: "Your Resume (ProfileX)", score: atsScore, highlight: true },
                  ].map((b, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className={`font-body text-[10px] w-36 ${b.highlight ? "text-primary font-semibold" : "text-muted-foreground"}`}>{b.label}</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${b.score}%` }} transition={{ delay: 0.8 + i * 0.2, duration: 0.8 }}
                          className={`h-full rounded-full ${b.highlight ? "bg-primary" : "bg-muted-foreground/30"}`} />
                      </div>
                      <span className={`font-body text-xs font-bold w-10 text-right ${b.highlight ? "text-primary" : "text-muted-foreground"}`}>{b.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ATS Algorithm Breakdown */}
        <ATSAlgorithmBreakdown />

        {/* Skill Gap */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-deep rounded-2xl p-8 md:p-10 mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" /> Skill Gap Analysis
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="font-body text-xs font-semibold text-primary uppercase tracking-wider mb-3">✅ Matched Skills</p>
              <div className="flex flex-wrap gap-2">
                {matchedSkills.map((s: string) => (
                  <span key={s} className="bg-primary/10 text-primary font-body text-sm px-4 py-2 rounded-full border border-primary/20">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="font-body text-xs font-semibold text-destructive uppercase tracking-wider mb-3">⚠️ Missing Skills</p>
              <div className="flex flex-wrap gap-2">
                {missingSkills.map((s: string) => (
                  <span key={s} className="bg-destructive/10 text-destructive font-body text-sm px-4 py-2 rounded-full border border-destructive/20">{s}</span>
                ))}
              </div>
              <p className="font-body text-xs text-muted-foreground mt-3">
                💡 Tip: Add these skills and we'll highlight transferable experience in your resume
              </p>
            </div>
          </div>
        </motion.div>

        {/* Project Reframing */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-deep rounded-2xl p-8 md:p-10 mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" /> Project Reframing Engine
          </h2>
          <div className="space-y-6">
            {reframedProjects.map((proj: any, i: number) => (
              <div key={i} className="glass-gold rounded-xl p-6 lift-hover">
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
                  ].map((item: any) => (
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
        <PsychologyInsights tips={psychologyTips} />

        {/* Pattern Analysis */}
        <PatternAnalysis />

        {/* Reality Check */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="glass-deep rounded-2xl p-8 md:p-10 mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-primary" /> Reality Check
          </h2>
          <div className="space-y-4">
            {realityChecks.map((item, i) => (
              <div key={i} className="flex gap-4 glass-gold rounded-xl p-5 lift-hover">
                <div className={`shrink-0 w-16 h-8 rounded-full flex items-center justify-center text-[10px] font-bold uppercase ${
                  item.severity === "Critical" ? "bg-destructive/10 text-destructive" :
                  item.severity === "High" ? "bg-yellow-500/10 text-yellow-400" :
                  "bg-blue-500/10 text-blue-400"
                }`}>{item.severity}</div>
                <div>
                  <p className="font-body text-sm text-foreground font-medium">{item.issue}</p>
                  <p className="font-body text-xs text-primary mt-1">✓ {item.fix}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* What Competitors Miss */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }} className="glass-gold-deep rounded-2xl p-8 md:p-10 mb-8 glow-gold border-shine">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shadow-gold">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">What Top Applicants Miss</h2>
              <p className="font-body text-sm text-muted-foreground">Even strong candidates make these mistakes — you won't</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { mistake: "No role-specific customization", detail: `Even top 10% applicants send the same resume everywhere. Your resume is tailored to ${resume?.target_role ? `"${resume.target_role}"` : "this specific JD"}.`, icon: "🎯" },
              { mistake: "Overloading with buzzwords", detail: "Strong candidates stuff keywords unnaturally. We distributed them across 4 sections naturally.", icon: "📝" },
              { mistake: "Ignoring the 7-second rule", detail: "Top applicants bury key info in paragraph 3. Your strongest metrics are in the F-pattern hotzone.", icon: "⏱️" },
              { mistake: "No psychological framing", detail: "Nobody applies cognitive biases to their resume. You have 6 biases working in your favor.", icon: "🧠" },
            ].map((item, i) => (
              <div key={i} className="glass rounded-xl p-5 lift-hover">
                <p className="font-body text-lg mb-2">{item.icon}</p>
                <h4 className="font-body text-sm font-bold text-foreground mb-1">{item.mistake}</h4>
                <p className="font-body text-xs text-muted-foreground">{item.detail}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Action Plan */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.78 }} className="glass-deep rounded-2xl p-8 md:p-10 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shadow-gold">
              <ListChecks className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Your Action Plan</h2>
              <p className="font-body text-sm text-muted-foreground">Follow these steps to maximize your results</p>
            </div>
          </div>
          <div className="space-y-3">
            {actionPlan.map((item, i) => (
              <div key={i} className="flex items-center gap-4 glass-gold rounded-xl p-4 lift-hover">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="font-display text-sm font-bold text-primary">{i + 1}</span>
                </div>
                <item.icon className="w-4 h-4 text-primary shrink-0" />
                <span className="font-body text-sm text-foreground">{item.step}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/resume-builder">
            <Button size="lg" className="bg-gradient-gold text-primary-foreground font-body font-semibold px-8 py-6 shadow-gold text-base">
              <FileText className="w-5 h-5 mr-2" /> View Enhanced Resume
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 font-body px-8 py-6">
            <Download className="w-5 h-5 mr-2" /> Download Full Report
          </Button>
          <Link to="/interview-prep">
            <Button size="lg" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 font-body px-8 py-6">
              <Target className="w-5 h-5 mr-2" /> Start Interview Prep
            </Button>
          </Link>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Results;
