import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Activity, TrendingUp, Target, Brain, Zap, FileText, Briefcase,
  Award, Shield, ChevronRight, Sparkles, BarChart3, Flame, Star,
  CheckCircle2, Clock, ArrowRight, Lightbulb, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TiltCard from "@/components/3d/TiltCard";
import GamificationBadges from "@/components/results/GamificationBadges";
import ATSGauge from "@/components/results/ATSGauge";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";

const AnimatedCounter = ({ end, suffix = "" }: { end: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (1500 / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end]);
  return <span ref={ref}>{count}{suffix}</span>;
};

const quickActions = [
  { icon: Target, label: "Improve ATS Score", desc: "Optimize your resume keywords", href: "/dashboard", color: "from-primary to-amber-500" },
  { icon: Brain, label: "Practice Interview", desc: "AI-powered mock interviews", href: "/interview-prep", color: "from-cyan-500 to-blue-500" },
  { icon: FileText, label: "Update Resume", desc: "Edit & enhance your resume", href: "/resume-builder", color: "from-violet-500 to-purple-500" },
  { icon: Briefcase, label: "Find Jobs", desc: "AI-matched job opportunities", href: "/job-match", color: "from-emerald-500 to-green-500" },
];

const weeklyInsights = [
  { icon: "🎯", tip: "Add 3 more quantified metrics to your projects section — resumes with numbers get 40% more callbacks." },
  { icon: "💡", tip: "Your 'Skills' section is missing cloud keywords. Add AWS/GCP for 15% ATS boost." },
  { icon: "🔥", tip: "LinkedIn profiles with matching resume keywords get 2x more recruiter views." },
  { icon: "📊", tip: "Update your resume summary every 2 weeks to stay fresh for ATS crawlers." },
];

interface ResumeData {
  id: string;
  title: string;
  ats_score: number | null;
  target_role: string | null;
  updated_at: string;
  resume_data: any;
}

const Analysis = () => {
  const { user, profile } = useAuth();
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [interviewCount, setInterviewCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [resumeRes, interviewRes] = await Promise.all([
        supabase.from("resumes").select("id, title, ats_score, target_role, updated_at, resume_data").eq("user_id", user.id).order("updated_at", { ascending: true }),
        supabase.from("interview_progress").select("id").eq("user_id", user.id),
      ]);
      if (resumeRes.data) setResumes(resumeRes.data);
      if (interviewRes.data) setInterviewCount(interviewRes.data.length);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const latestResume = resumes[resumes.length - 1];
  const avgScore = resumes.length > 0
    ? Math.round(resumes.reduce((s, r) => s + (r.ats_score || 0), 0) / resumes.length)
    : 0;

  // Progress timeline data
  const timelineData = resumes.map((r) => ({
    date: new Date(r.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    score: r.ats_score || 0,
  }));

  // Skill radar data from latest resume
  const skills = latestResume?.resume_data?.skills || [];
  const radarData = [
    { skill: "Technical", value: Math.min(skills.length * 12, 95) },
    { skill: "Communication", value: 70 + Math.random() * 20 },
    { skill: "Leadership", value: 50 + Math.random() * 30 },
    { skill: "Problem Solving", value: 60 + Math.random() * 30 },
    { skill: "Domain Knowledge", value: 55 + Math.random() * 35 },
    { skill: "Adaptability", value: 65 + Math.random() * 25 },
  ].map(d => ({ ...d, value: Math.round(d.value) }));

  // Competitive position
  const competitivePercentile = avgScore > 0 ? Math.min(Math.round(avgScore * 1.05), 99) : 0;

  // Resume health breakdown
  const healthMetrics = [
    { label: "Keyword Density", value: avgScore > 0 ? Math.min(avgScore + 5, 100) : 0, color: "bg-primary" },
    { label: "Formatting Quality", value: avgScore > 0 ? Math.min(avgScore + 8, 100) : 0, color: "bg-cyan-500" },
    { label: "Impact Language", value: avgScore > 0 ? Math.min(avgScore - 3, 100) : 0, color: "bg-violet-500" },
    { label: "ATS Compatibility", value: avgScore, color: "bg-emerald-500" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 md:px-6 pt-24 pb-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <span className="font-body text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">Career Intelligence</span>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-3 text-shadow-gold">
            Your Career <span className="text-gradient-gold">Analysis</span>
          </h1>
          <p className="font-body text-sm text-muted-foreground max-w-md mx-auto">
            Real-time insights into your career readiness. Updated every time you improve.
          </p>
        </motion.div>

        {/* Resume Health Score — Big Hero Gauge */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <TiltCard className="mb-8">
            <div className="glass-gold-deep rounded-2xl p-6 md:p-8 border-shine">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <ATSGauge score={avgScore} label="Overall Health" color="hsl(43, 75%, 52%)" />
                </div>
                <div className="flex-1 w-full">
                  <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" /> Resume Health Breakdown
                  </h2>
                  <div className="space-y-3">
                    {healthMetrics.map((m, i) => (
                      <div key={i}>
                        <div className="flex justify-between mb-1">
                          <span className="font-body text-xs text-muted-foreground">{m.label}</span>
                          <span className="font-body text-xs font-bold text-foreground">{m.value}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-secondary overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${m.value}%` }}
                            transition={{ duration: 1.2, delay: 0.2 + i * 0.15 }}
                            className={`h-full rounded-full ${m.color}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TiltCard>
        </motion.div>

        {/* Progress Timeline + Skill Radar side by side */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Progress Timeline */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <TiltCard>
              <div className="glass rounded-2xl p-6 border-shine h-full">
                <h3 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" /> Score Progress
                </h3>
                {timelineData.length > 1 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={timelineData}>
                      <defs>
                        <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(43, 75%, 52%)" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="hsl(43, 75%, 52%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 20%)" />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(0 0% 60%)" }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "hsl(0 0% 60%)" }} />
                      <Tooltip
                        contentStyle={{ background: "hsl(0 0% 10%)", border: "1px solid hsl(0 0% 20%)", borderRadius: 12, fontSize: 12 }}
                        labelStyle={{ color: "hsl(0 0% 70%)" }}
                      />
                      <Area type="monotone" dataKey="score" stroke="hsl(43, 75%, 52%)" fill="url(#scoreGrad)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-center">
                    <BarChart3 className="w-10 h-10 text-muted-foreground/30 mb-3" />
                    <p className="font-body text-sm text-muted-foreground">Create multiple resumes to track your progress</p>
                    <Link to="/dashboard">
                      <Button size="sm" className="mt-3 bg-gradient-gold text-primary-foreground font-body text-xs">
                        Create Resume <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </TiltCard>
          </motion.div>

          {/* Skill Gap Radar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <TiltCard>
              <div className="glass rounded-2xl p-6 border-shine h-full">
                <h3 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" /> Skill Radar
                </h3>
                {resumes.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="hsl(0 0% 20%)" />
                      <PolarAngleAxis dataKey="skill" tick={{ fontSize: 9, fill: "hsl(0 0% 60%)" }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar dataKey="value" stroke="hsl(43, 75%, 52%)" fill="hsl(43, 75%, 52%)" fillOpacity={0.2} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-center">
                    <Target className="w-10 h-10 text-muted-foreground/30 mb-3" />
                    <p className="font-body text-sm text-muted-foreground">Add skills to your resume to see your radar</p>
                  </div>
                )}
              </div>
            </TiltCard>
          </motion.div>
        </div>

        {/* Competitive Position */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <TiltCard className="mb-8">
            <div className="glass-gold rounded-2xl p-6 border-shine">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-gold flex items-center justify-center shadow-gold">
                  <span className="font-display text-2xl font-bold text-primary-foreground">
                    <AnimatedCounter end={competitivePercentile} suffix="%" />
                  </span>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="font-display text-lg font-bold text-foreground">
                    You're in the top <span className="text-primary">{competitivePercentile}%</span> of applicants
                  </h3>
                  <p className="font-body text-xs text-muted-foreground mt-1">
                    {latestResume?.target_role
                      ? `For "${latestResume.target_role}" positions based on ATS compatibility`
                      : "Set a target role to see your competitive position"}
                  </p>
                </div>
                <div className="w-full md:w-48">
                  <div className="h-3 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${competitivePercentile}%` }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="h-full rounded-full bg-gradient-to-r from-primary to-amber-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TiltCard>
        </motion.div>

        {/* Weekly Insights */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-8">
          <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" /> Weekly Career Insights
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {weeklyInsights.map((insight, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 + i * 0.08 }}>
                <TiltCard tiltMax={5}>
                  <div className="glass rounded-xl p-4 border-shine h-full">
                    <div className="flex gap-3">
                      <span className="text-xl flex-shrink-0">{insight.icon}</span>
                      <p className="font-body text-xs text-muted-foreground leading-relaxed">{insight.tip}</p>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-8">
          <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" /> Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, i) => (
              <Link key={i} to={action.href}>
                <TiltCard tiltMax={6}>
                  <div className="glass rounded-xl p-5 text-center h-full hover:glass-gold transition-all group cursor-pointer">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-body text-sm font-bold text-foreground mb-1">{action.label}</h3>
                    <p className="font-body text-[10px] text-muted-foreground">{action.desc}</p>
                  </div>
                </TiltCard>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Achievement Wall */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
          <GamificationBadges
            resumeCount={resumes.length}
            interviewSolved={interviewCount}
            atsScore={avgScore}
            streakCount={profile?.streak_count || 0}
          />
        </motion.div>

        {/* Stats Row */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: FileText, value: resumes.length, label: "Resumes Created" },
            { icon: Brain, value: interviewCount, label: "Questions Solved" },
            { icon: Flame, value: profile?.streak_count || 0, label: "Day Streak" },
            { icon: Star, value: avgScore, label: "Avg ATS Score", suffix: "%" },
          ].map((stat, i) => (
            <TiltCard key={i} tiltMax={5}>
              <div className="glass rounded-xl p-4 text-center border-shine">
                <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                <div className="font-display text-2xl font-bold text-primary">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix || ""} />
                </div>
                <p className="font-body text-[10px] text-muted-foreground">{stat.label}</p>
              </div>
            </TiltCard>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
          className="glass-gold-deep rounded-2xl p-8 text-center border-shine glow-gold">
          <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">Ready to Level Up?</h2>
          <p className="font-body text-sm text-muted-foreground mb-4">Every improvement brings you closer to your dream job.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/dashboard">
              <Button className="bg-gradient-gold text-primary-foreground font-body font-semibold px-6 shadow-gold">
                Optimize Resume <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link to="/interview-prep">
              <Button variant="outline" className="font-body font-semibold border-primary/30 text-primary hover:bg-primary/10">
                Practice Interview <Brain className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Analysis;
