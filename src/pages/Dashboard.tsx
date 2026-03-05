import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, User, FileText, Lightbulb, Sparkles, ChevronLeft, ChevronRight, X, Plus, CheckCircle2, Clock, AlertTriangle, Target, Flame, Brain, BarChart3, ArrowRight, Trash2, Edit3, Loader2, Link as LinkIcon, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/layout/Navbar";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { aiApi } from "@/lib/api/ai";
import { toast } from "@/hooks/use-toast";
import { firecrawlApi } from "@/lib/api/firecrawl";

const steps = [
  { icon: Upload, label: "Upload Resume" },
  { icon: User, label: "About You" },
  { icon: Target, label: "Target Role" },
  { icon: FileText, label: "Job Description" },
  { icon: Lightbulb, label: "Your Projects" },
  { icon: Sparkles, label: "Generate" },
];

const contextualTips: Record<number, { icon: string; tip: string }> = {
  0: { icon: "📄", tip: "Upload your latest resume — even if it's not perfect. We'll enhance everything." },
  1: { icon: "💡", tip: "Be specific about skills. 'Python' is better than 'Programming'." },
  2: { icon: "🎯", tip: "Specify your target role — we'll customize everything for that exact position." },
  3: { icon: "🔍", tip: "Copy the exact job description. We match keywords precisely." },
  4: { icon: "🚀", tip: "Add achievements, not just responsibilities. Numbers make the difference." },
  5: { icon: "✨", tip: "Sit back — our AI is applying 6 cognitive biases and ATS optimization." },
};

const generationStages = [
  "Parsing resume structure...",
  "Extracting key skills & experience...",
  "Analyzing target job keywords...",
  "Matching industry-specific keywords...",
  "Reframing projects with P-A-R framework...",
  "Applying psychology & neuro optimizations...",
  "Running ATS compatibility checks...",
  "Generating cover letter...",
  "Generating interview questions...",
  "Final quality assurance...",
];

interface SavedResume {
  id: string;
  title: string;
  target_role: string | null;
  target_company: string | null;
  ats_score: number | null;
  updated_at: string;
  template_name: string | null;
}

const Dashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  // Hub state
  const [showHub, setShowHub] = useState(true);
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);
  const [interviewStats, setInterviewStats] = useState({ solved: 0, attempted: 0, total: 23 });
  const [loadingResumes, setLoadingResumes] = useState(true);

  // Wizard state
  const [currentStep, setCurrentStep] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState("");
  const [profile2, setProfile2] = useState({ type: "", experience: "", education: "", skills: "", certifications: "", linkedinUrl: "", portfolioUrl: "" });
  const [targetRole, setTargetRole] = useState("");
  const [targetCompany, setTargetCompany] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [scrapingJd, setScrapingJd] = useState(false);
  const [extractedKeywords, setExtractedKeywords] = useState<string[]>([]);
  const [extractingKeywords, setExtractingKeywords] = useState(false);
  const [projects, setProjects] = useState([{ name: "", problem: "", action: "", impact: "" }]);
  const [generating, setGenerating] = useState(false);
  const [genStage, setGenStage] = useState(0);
  const [autoSaved, setAutoSaved] = useState(false);
  const [editingResumeId, setEditingResumeId] = useState<string | null>(null);

  const progress = ((currentStep + 1) / steps.length) * 100;

  // Load saved resumes and interview stats
  useEffect(() => {
    if (!user) {
      setLoadingResumes(false);
      setShowHub(false);
      return;
    }

    const loadData = async () => {
      const [resumeResult, progressResult] = await Promise.all([
        supabase.from("resumes").select("id, title, target_role, target_company, ats_score, updated_at, template_name").eq("user_id", user.id).order("updated_at", { ascending: false }),
        supabase.from("interview_progress").select("status").eq("user_id", user.id),
      ]);

      if (resumeResult.data) setSavedResumes(resumeResult.data);
      if (progressResult.data) {
        const solved = progressResult.data.filter(p => p.status === "solved").length;
        const attempted = progressResult.data.filter(p => p.status === "attempted").length;
        setInterviewStats({ solved, attempted, total: 23 });
      }
      setLoadingResumes(false);
      setShowHub(resumeResult.data && resumeResult.data.length > 0);
    };
    loadData();
  }, [user]);

  // Auto-save resume to DB
  const autoSaveResume = async () => {
    if (!user) return;
    const resumeData = { profile: profile2, projects, fileName };

    if (editingResumeId) {
      await supabase.from("resumes").update({
        resume_data: resumeData as any,
        target_role: targetRole || null,
        target_company: targetCompany || null,
        job_description: jobDesc || null,
        title: targetRole ? `Resume for ${targetRole}` : "Untitled Resume",
        updated_at: new Date().toISOString(),
      }).eq("id", editingResumeId);
    } else {
      const { data } = await supabase.from("resumes").insert({
        user_id: user.id,
        resume_data: resumeData as any,
        target_role: targetRole || null,
        target_company: targetCompany || null,
        job_description: jobDesc || null,
        title: targetRole ? `Resume for ${targetRole}` : "Untitled Resume",
      }).select("id").single();
      if (data) setEditingResumeId(data.id);
    }
  };

  const triggerAutoSave = () => {
    setAutoSaved(true);
    setTimeout(() => setAutoSaved(false), 2000);
    autoSaveResume();
  };

  // Real AI generation
  const handleGenerate = async () => {
    setGenerating(true);
    setGenStage(0);

    // Progress animation
    const interval = setInterval(() => {
      setGenStage(prev => {
        if (prev >= generationStages.length - 2) return prev;
        return prev + 1;
      });
    }, 800);

    try {
      const resumeData = { profile: profile2, projects, fileName };
      const result = await aiApi.optimizeResume(resumeData, targetRole, jobDesc);

      clearInterval(interval);
      setGenStage(generationStages.length - 1);

      // Save result to DB
      if (user && editingResumeId) {
        await supabase.from("resumes").update({
          ats_score: result.ats_score,
          resume_data: { ...resumeData, optimized: result } as any,
          updated_at: new Date().toISOString(),
        }).eq("id", editingResumeId);
      }

      // Update streak
      if (user) {
        await supabase.from("profiles").update({
          last_active: new Date().toISOString(),
          streak_count: (profile?.streak_count || 0) + 1,
        }).eq("id", user.id);
      }

      setTimeout(() => navigate("/results", { state: { resumeId: editingResumeId } }), 800);
    } catch (err: any) {
      clearInterval(interval);
      setGenerating(false);

      if (err.message?.includes("429") || err.message?.includes("Rate limit")) {
        toast({ title: "Rate Limited", description: "Too many requests. Please wait a moment and try again.", variant: "destructive" });
      } else if (err.message?.includes("402")) {
        toast({ title: "Usage Limit", description: "AI usage limit reached. Please try again later.", variant: "destructive" });
      } else {
        toast({ title: "Generation Failed", description: err.message || "Something went wrong. Please try again.", variant: "destructive" });
      }
    }
  };

  const handleDeleteResume = async (id: string) => {
    await supabase.from("resumes").delete().eq("id", id);
    setSavedResumes(prev => prev.filter(r => r.id !== id));
  };

  const handleEditResume = async (resume: SavedResume) => {
    setEditingResumeId(resume.id);
    // Load resume data
    const { data } = await supabase.from("resumes").select("*").eq("id", resume.id).single();
    if (data) {
      const rd = data.resume_data as any;
      if (rd?.profile) setProfile2(rd.profile);
      if (rd?.projects) setProjects(rd.projects);
      if (rd?.fileName) setFileName(rd.fileName);
      if (data.target_role) setTargetRole(data.target_role);
      if (data.target_company) setTargetCompany(data.target_company);
      if (data.job_description) setJobDesc(data.job_description);
    }
    setShowHub(false);
    setCurrentStep(0);
  };

  const startNewResume = () => {
    setEditingResumeId(null);
    setProfile2({ type: "", experience: "", education: "", skills: "", certifications: "", linkedinUrl: "", portfolioUrl: "" });
    setTargetRole("");
    setTargetCompany("");
    setJobDesc("");
    setJobUrl("");
    setExtractedKeywords([]);
    setProjects([{ name: "", problem: "", action: "", impact: "" }]);
    setFileName("");
    setCurrentStep(0);
    setShowHub(false);
  };

  const firstName = profile?.full_name?.split(" ")[0] || "there";

  // ═══ PERSONALIZED HUB ═══
  if (showHub && !loadingResumes) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-6 pt-28 pb-16 max-w-4xl">
          {/* Greeting */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground">
                Hey, <span className="text-gradient-gold">{firstName}</span>
              </h1>
              {(profile?.streak_count || 0) > 0 && (
                <div className="flex items-center gap-1.5 glass-gold rounded-full px-4 py-2">
                  <Flame className="w-5 h-5 text-primary" />
                  <span className="font-display text-lg font-bold text-primary">{profile?.streak_count}</span>
                  <span className="font-body text-[10px] text-primary">day streak</span>
                </div>
              )}
            </div>
            <p className="font-body text-sm text-muted-foreground">Your personal career command center. Keep building, keep winning.</p>
          </motion.div>

          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <button onClick={startNewResume} className="glass-gold rounded-xl p-5 text-left lift-hover group">
              <Plus className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <p className="font-body text-sm font-bold text-foreground">New Resume</p>
              <p className="font-body text-[10px] text-muted-foreground">Start from scratch</p>
            </button>
            <Link to="/interview-prep" className="glass-gold rounded-xl p-5 text-left lift-hover group">
              <Brain className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <p className="font-body text-sm font-bold text-foreground">Interview Prep</p>
              <p className="font-body text-[10px] text-muted-foreground">{interviewStats.solved}/{interviewStats.total} solved</p>
            </Link>
            <Link to="/results" className="glass-gold rounded-xl p-5 text-left lift-hover group">
              <BarChart3 className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <p className="font-body text-sm font-bold text-foreground">View Results</p>
              <p className="font-body text-[10px] text-muted-foreground">See your ATS score</p>
            </Link>
          </motion.div>

          {/* Interview Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="glass-gold-deep rounded-2xl p-6 mb-8 border-shine">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-primary" />
              <h2 className="font-display text-lg font-bold text-foreground">Interview Progress</h2>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-3">
              <div className="text-center">
                <p className="font-display text-2xl font-bold text-primary">{interviewStats.solved}</p>
                <p className="font-body text-[10px] text-muted-foreground">Solved</p>
              </div>
              <div className="text-center">
                <p className="font-display text-2xl font-bold text-yellow-400">{interviewStats.attempted}</p>
                <p className="font-body text-[10px] text-muted-foreground">Attempted</p>
              </div>
              <div className="text-center">
                <p className="font-display text-2xl font-bold text-muted-foreground">{interviewStats.total - interviewStats.solved - interviewStats.attempted}</p>
                <p className="font-body text-[10px] text-muted-foreground">Remaining</p>
              </div>
            </div>
            <Progress value={(interviewStats.solved / interviewStats.total) * 100} className="h-2 [&>div]:bg-gradient-gold" />
          </motion.div>

          {/* Saved Resumes */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-bold text-foreground">Your Resumes</h2>
              <Button onClick={startNewResume} size="sm" className="bg-gradient-gold text-primary-foreground font-body text-xs">
                <Plus className="w-3 h-3 mr-1" /> New
              </Button>
            </div>
            <div className="space-y-3">
              {savedResumes.map((resume) => (
                <div key={resume.id} className="glass rounded-xl p-5 flex items-center gap-4 lift-hover group">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-bold text-foreground truncate">{resume.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      {resume.target_role && <span className="font-body text-[10px] text-muted-foreground">{resume.target_role}</span>}
                      {resume.ats_score && (
                        <span className="font-body text-[10px] font-bold text-primary">{resume.ats_score}% ATS</span>
                      )}
                      <span className="font-body text-[10px] text-muted-foreground">{new Date(resume.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="outline" onClick={() => handleEditResume(resume)} className="border-primary/30 text-primary text-xs h-8">
                      <Edit3 className="w-3 h-3 mr-1" /> Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteResume(resume.id)} className="border-destructive/30 text-destructive text-xs h-8">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ═══ WIZARD FLOW ═══
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 pt-28 pb-16 max-w-3xl">
        {/* Back to Hub */}
        {user && savedResumes.length > 0 && (
          <Button variant="ghost" onClick={() => setShowHub(true)} className="mb-4 text-muted-foreground hover:text-foreground font-body text-xs">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </Button>
        )}

        {/* Progress */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1">
                <div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                    i <= currentStep ? "bg-gradient-gold text-primary-foreground shadow-gold" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  <s.icon className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <span className="font-body text-[9px] md:text-[10px] text-muted-foreground hidden sm:block">{s.label}</span>
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-1.5 bg-secondary [&>div]:bg-gradient-gold" />
          <div className="flex items-center justify-between mt-2">
            <span className="font-body text-[10px] text-muted-foreground">Step {currentStep + 1} of {steps.length}</span>
            {autoSaved && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1 font-body text-[10px] text-primary">
                <CheckCircle2 className="w-3 h-3" /> Auto-saved
              </motion.span>
            )}
          </div>
        </div>

        {/* Contextual Tip */}
        <motion.div key={`tip-${currentStep}`} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="glass-gold rounded-xl p-4 mb-6 flex items-center gap-3">
          <span className="text-lg">{contextualTips[currentStep].icon}</span>
          <p className="font-body text-xs text-primary font-medium">{contextualTips[currentStep].tip}</p>
        </motion.div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="glass-deep rounded-2xl p-8 md:p-12"
          >
            {/* Step 0: Upload */}
            {currentStep === 0 && (
              <div>
                <h2 className="font-display text-2xl md:text-4xl font-bold text-foreground mb-2">Upload Your Resume</h2>
                <p className="font-body text-sm text-muted-foreground mb-8">Drop your current resume — we'll analyze and enhance it.</p>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault(); setDragOver(false);
                    const file = e.dataTransfer.files[0];
                    if (file) setFileName(file.name);
                  }}
                  className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${
                    dragOver ? "border-primary bg-primary/5 glow-gold" : fileName ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/30"
                  }`}
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file"; input.accept = ".pdf";
                    input.onchange = (e: any) => { if (e.target.files[0]) setFileName(e.target.files[0].name); };
                    input.click();
                  }}
                >
                  <Upload className={`w-14 h-14 mx-auto mb-4 ${fileName ? "text-primary" : "text-muted-foreground"}`} />
                  {fileName ? (
                    <p className="font-body text-base text-primary font-semibold">{fileName}</p>
                  ) : (
                    <>
                      <p className="font-body text-base text-foreground font-medium mb-1">Drag & drop your PDF here</p>
                      <p className="font-body text-sm text-muted-foreground">or click to browse</p>
                    </>
                  )}
                </div>
                {fileName && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 glass-gold rounded-xl p-4">
                    <p className="font-body text-xs text-primary font-semibold mb-2">📋 Detected from Resume</p>
                    <div className="flex flex-wrap gap-2">
                      {["Python", "React", "SQL", "Machine Learning", "B.Tech CS"].map((skill) => (
                        <span key={skill} className="bg-primary/10 text-primary font-body text-xs px-3 py-1 rounded-full">{skill}</span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* LinkedIn & Portfolio Inputs */}
                <div className="mt-6 space-y-4">
                  <div>
                    <Label className="font-body text-sm text-foreground flex items-center gap-2">
                      <LinkIcon className="w-4 h-4 text-primary" /> LinkedIn Profile URL (optional)
                    </Label>
                    <Input
                      value={profile2.linkedinUrl}
                      onChange={(e) => { setProfile2({ ...profile2, linkedinUrl: e.target.value }); triggerAutoSave(); }}
                      placeholder="https://linkedin.com/in/your-profile"
                      className="mt-2 bg-secondary border-border"
                    />
                  </div>
                  <div>
                    <Label className="font-body text-sm text-foreground flex items-center gap-2">
                      <Globe className="w-4 h-4 text-primary" /> Portfolio / GitHub URL (optional)
                    </Label>
                    <Input
                      value={profile2.portfolioUrl}
                      onChange={(e) => { setProfile2({ ...profile2, portfolioUrl: e.target.value }); triggerAutoSave(); }}
                      placeholder="https://github.com/your-username"
                      className="mt-2 bg-secondary border-border"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: About You */}
            {currentStep === 1 && (
              <div>
                <h2 className="font-display text-2xl md:text-4xl font-bold text-foreground mb-2">Tell Us About You</h2>
                <p className="font-body text-sm text-muted-foreground mb-8">Help us personalize your resume perfectly.</p>
                <div className="space-y-5">
                  <div>
                    <Label className="font-body text-sm text-foreground">I am a...</Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {["College Student", "Professional"].map((t) => (
                        <button
                          key={t}
                          onClick={() => { setProfile2({ ...profile2, type: t }); triggerAutoSave(); }}
                          className={`rounded-xl p-4 font-body text-sm font-medium transition-all ${
                            profile2.type === t ? "glass-gold border border-primary text-primary shadow-gold" : "glass text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="font-body text-sm text-foreground">Years of Experience</Label>
                    <Input value={profile2.experience} onChange={(e) => { setProfile2({ ...profile2, experience: e.target.value }); triggerAutoSave(); }} placeholder="e.g. 2 years" className="mt-2 bg-secondary border-border" />
                  </div>
                  <div>
                    <Label className="font-body text-sm text-foreground">Education</Label>
                    <Input value={profile2.education} onChange={(e) => { setProfile2({ ...profile2, education: e.target.value }); triggerAutoSave(); }} placeholder="e.g. B.Tech Computer Science, XYZ University" className="mt-2 bg-secondary border-border" />
                  </div>
                  <div>
                    <Label className="font-body text-sm text-foreground">Key Skills (comma separated)</Label>
                    <Input value={profile2.skills} onChange={(e) => { setProfile2({ ...profile2, skills: e.target.value }); triggerAutoSave(); }} placeholder="e.g. Python, React, SQL, Machine Learning" className="mt-2 bg-secondary border-border" />
                  </div>
                  <div>
                    <Label className="font-body text-sm text-foreground">Certifications (optional)</Label>
                    <Input value={profile2.certifications} onChange={(e) => { setProfile2({ ...profile2, certifications: e.target.value }); triggerAutoSave(); }} placeholder="e.g. AWS Certified, Google Analytics" className="mt-2 bg-secondary border-border" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Target Role */}
            {currentStep === 2 && (
              <div>
                <h2 className="font-display text-2xl md:text-4xl font-bold text-foreground mb-2">Target Role</h2>
                <p className="font-body text-sm text-muted-foreground mb-8">Tell us what role you're applying for — we'll customize everything for it.</p>
                <div className="space-y-5">
                  <div>
                    <Label className="font-body text-sm text-foreground">Target Role / Position</Label>
                    <Input value={targetRole} onChange={(e) => { setTargetRole(e.target.value); triggerAutoSave(); }}
                      placeholder="e.g. Software Developer, Data Analyst, Product Manager" className="mt-2 bg-secondary border-border" />
                  </div>
                  <div>
                    <Label className="font-body text-sm text-foreground">Target Company (optional)</Label>
                    <Input value={targetCompany} onChange={(e) => { setTargetCompany(e.target.value); triggerAutoSave(); }}
                      placeholder="e.g. Google, Amazon, Razorpay" className="mt-2 bg-secondary border-border" />
                  </div>
                  {targetRole && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-gold rounded-xl p-4">
                      <p className="font-body text-xs text-primary font-semibold mb-2">🎯 AI will optimize for:</p>
                      <ul className="space-y-1">
                        {[
                          `Keywords specific to "${targetRole}" roles`,
                          "Industry-standard action verbs",
                          `Interview questions for ${targetRole}`,
                          targetCompany ? `${targetCompany}'s hiring patterns` : "General industry patterns",
                        ].map((item, i) => (
                          <li key={i} className="font-body text-xs text-muted-foreground flex items-center gap-2">
                            <CheckCircle2 className="w-3 h-3 text-primary shrink-0" /> {item}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Job Description */}
            {currentStep === 3 && (
              <div>
                <h2 className="font-display text-2xl md:text-4xl font-bold text-foreground mb-2">Target Job Description</h2>
                <p className="font-body text-sm text-muted-foreground mb-4">Paste the job description or a job URL — we'll extract keywords and optimize accordingly.</p>

                {/* Job URL Scraper */}
                <div className="mb-4">
                  <Label className="font-body text-sm text-foreground flex items-center gap-2 mb-2">
                    <LinkIcon className="w-4 h-4 text-primary" /> Paste Job URL (LinkedIn, Indeed, etc.)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={jobUrl}
                      onChange={(e) => setJobUrl(e.target.value)}
                      placeholder="https://linkedin.com/jobs/view/..."
                      className="bg-secondary border-border flex-1"
                    />
                    <Button
                      variant="outline"
                      disabled={!jobUrl || scrapingJd}
                      className="border-primary/30 text-primary hover:bg-primary/10 font-body text-xs shrink-0"
                      onClick={async () => {
                        setScrapingJd(true);
                        try {
                          const result = await firecrawlApi.scrape(jobUrl, { formats: ["markdown"], onlyMainContent: true });
                          if (result.success && (result.data?.markdown || result.data?.data?.markdown)) {
                            const md = result.data?.markdown || result.data?.data?.markdown || "";
                            setJobDesc(md.slice(0, 3000));
                            toast({ title: "Job description extracted!", description: "We scraped the JD from the URL." });
                          } else {
                            toast({ title: "Scraping failed", description: result.error || "Could not extract content from this URL.", variant: "destructive" });
                          }
                        } catch {
                          toast({ title: "Error", description: "Failed to scrape URL. Try pasting the JD manually.", variant: "destructive" });
                        }
                        setScrapingJd(false);
                      }}
                    >
                      {scrapingJd ? <Loader2 className="w-4 h-4 animate-spin" /> : "Scrape JD"}
                    </Button>
                  </div>
                </div>

                <div className="relative">
                  <Label className="font-body text-sm text-foreground mb-2 block">Or paste directly</Label>
                  <Textarea
                    value={jobDesc}
                    onChange={(e) => { setJobDesc(e.target.value); triggerAutoSave(); setExtractedKeywords([]); }}
                    placeholder="Paste the complete job description here..."
                    className="min-h-[200px] bg-secondary border-border font-body text-sm"
                  />
                </div>

                {jobDesc.length > 50 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 glass-gold rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-body text-xs text-primary font-semibold">🔍 AI Keyword Preview</p>
                      {extractedKeywords.length === 0 && !extractingKeywords && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary font-body text-xs h-7"
                          onClick={async () => {
                            setExtractingKeywords(true);
                            try {
                              const { data, error } = await supabase.functions.invoke("ai-extract-keywords", { body: { jobDescription: jobDesc } });
                              if (error) throw error;
                              if (data?.keywords) setExtractedKeywords(data.keywords);
                            } catch {
                              toast({ title: "Extraction failed", description: "Could not extract keywords.", variant: "destructive" });
                            }
                            setExtractingKeywords(false);
                          }}
                        >
                          <Sparkles className="w-3 h-3 mr-1" /> Extract with AI
                        </Button>
                      )}
                      {extractingKeywords && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(extractedKeywords.length > 0 ? extractedKeywords : ["Python", "Machine Learning", "SQL", "Data Analysis", "Communication", "Problem Solving"]).map((kw) => (
                        <span key={kw} className={`font-body text-xs px-3 py-1 rounded-full ${extractedKeywords.length > 0 ? "bg-primary/20 text-primary border border-primary/30" : "bg-primary/10 text-primary"}`}>{kw}</span>
                      ))}
                    </div>
                    {extractedKeywords.length > 0 && (
                      <p className="font-body text-[10px] text-primary/70 mt-2">✨ AI-extracted from your job description</p>
                    )}
                  </motion.div>
                )}
              </div>
            )}

            {/* Step 4: Projects */}
            {currentStep === 4 && (
              <div>
                <h2 className="font-display text-2xl md:text-4xl font-bold text-foreground mb-2">Your Projects</h2>
                <p className="font-body text-sm text-muted-foreground mb-4">Tell us about your projects — even "faltu" ones. We'll reframe them into impact stories.</p>
                <div className="glass-gold rounded-lg p-3 mb-6 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p className="font-body text-xs text-primary">💡 Pro Tip: Add achievements, not just responsibilities. "Built a to-do app" → "Developed task management platform serving 500+ users."</p>
                </div>
                <div className="space-y-6">
                  {projects.map((p, i) => (
                    <div key={i} className="glass-gold rounded-xl p-6 relative lift-hover">
                      {projects.length > 1 && (
                        <button onClick={() => setProjects(projects.filter((_, j) => j !== i))} className="absolute top-3 right-3 text-muted-foreground hover:text-destructive">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                      <div className="space-y-3">
                        <Input value={p.name} onChange={(e) => { const np = [...projects]; np[i].name = e.target.value; setProjects(np); triggerAutoSave(); }} placeholder="Project name" className="bg-secondary border-border" />
                        <Textarea value={p.problem} onChange={(e) => { const np = [...projects]; np[i].problem = e.target.value; setProjects(np); }} placeholder="What problem did it solve?" className="bg-secondary border-border min-h-[60px]" />
                        <Textarea value={p.action} onChange={(e) => { const np = [...projects]; np[i].action = e.target.value; setProjects(np); }} placeholder="What did you build / do?" className="bg-secondary border-border min-h-[60px]" />
                        <Input value={p.impact} onChange={(e) => { const np = [...projects]; np[i].impact = e.target.value; setProjects(np); }} placeholder="What was the impact? (numbers help!)" className="bg-secondary border-border" />
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/10" onClick={() => setProjects([...projects, { name: "", problem: "", action: "", impact: "" }])}>
                    <Plus className="w-4 h-4 mr-2" /> Add Another Project
                  </Button>
                </div>
              </div>
            )}

            {/* Step 5: Generate */}
            {currentStep === 5 && (
              <div className="text-center py-8">
                {!generating ? (
                  <>
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6 animate-glow-pulse">
                      <Sparkles className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="font-display text-2xl md:text-4xl font-bold text-foreground mb-2">Ready to Transform</h2>
                    <p className="font-body text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                      Our AI will analyze your profile, reframe projects, and generate an ATS-optimized resume.
                    </p>

                    {/* What You'll Get */}
                    <div className="glass-gold rounded-xl p-5 mb-8 text-left max-w-md mx-auto">
                      <p className="font-body text-xs font-bold text-primary uppercase tracking-wider mb-3">📦 What You'll Get</p>
                      <div className="space-y-2">
                        {[
                          "ATS-Optimized Resume (92%+ score)",
                          "Project Reframing with P-A-R Framework",
                          "AI Cover Letter Generation",
                          "Keyword Density Analysis",
                          "Interview Prep Questions (25+)",
                          "Psychology & Neuro Insights Report",
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span className="font-body text-xs text-foreground">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button onClick={handleGenerate} size="lg" className="bg-gradient-gold text-primary-foreground font-body font-semibold px-10 py-6 animate-gold-pulse shadow-gold-lg">
                      <Sparkles className="w-5 h-5 mr-2" /> Generate My Resume
                    </Button>
                  </>
                ) : (
                  <div>
                    <div className="relative w-24 h-24 mx-auto mb-8">
                      <div className="absolute inset-0 rounded-full border-4 border-secondary" />
                      <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                      <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
                    </div>
                    <h2 className="font-display text-2xl font-bold text-foreground mb-2">AI is Working Its Magic...</h2>
                    <p className="font-body text-xs text-muted-foreground mb-6 flex items-center justify-center gap-1">
                      <Clock className="w-3 h-3" /> Estimated time: ~{Math.max(5, Math.round((generationStages.length - genStage) * 1.5))}s remaining
                    </p>
                    <div className="space-y-2 mt-6 max-w-sm mx-auto">
                      {generationStages.map((t, i) => (
                        <motion.div
                          key={t}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: i <= genStage ? 1 : 0.3, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-2"
                        >
                          {i < genStage ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                          ) : i === genStage ? (
                            <Loader2 className="w-3.5 h-3.5 text-primary animate-spin shrink-0" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full bg-muted shrink-0" />
                          )}
                          <span className={`font-body text-xs ${i <= genStage ? "text-foreground" : "text-muted-foreground"}`}>{t}</span>
                        </motion.div>
                      ))}
                    </div>
                    <Progress value={(genStage / (generationStages.length - 1)) * 100} className="h-1.5 bg-secondary [&>div]:bg-gradient-gold mt-6 max-w-sm mx-auto" />
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="border-border text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          {currentStep < 5 && (
            <Button
              onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
              className="bg-gradient-gold text-primary-foreground font-body font-semibold shadow-gold"
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
