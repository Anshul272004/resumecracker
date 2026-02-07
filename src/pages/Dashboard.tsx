import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, User, FileText, Lightbulb, Sparkles, ChevronLeft, ChevronRight, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/layout/Navbar";
import { useNavigate } from "react-router-dom";

const steps = [
  { icon: Upload, label: "Upload Resume" },
  { icon: User, label: "About You" },
  { icon: FileText, label: "Job Description" },
  { icon: Lightbulb, label: "Your Projects" },
  { icon: Sparkles, label: "Generate" },
];

const Dashboard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState("");
  const [profile, setProfile] = useState({ type: "", experience: "", education: "", skills: "", certifications: "" });
  const [jobDesc, setJobDesc] = useState("");
  const [projects, setProjects] = useState([{ name: "", problem: "", action: "", impact: "" }]);
  const [generating, setGenerating] = useState(false);
  const navigate = useNavigate();

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => navigate("/results"), 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 pt-28 pb-16 max-w-3xl">
        {/* Progress */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    i <= currentStep ? "bg-gradient-gold text-primary-foreground" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  <s.icon className="w-4 h-4" />
                </div>
                <span className="font-body text-[10px] text-muted-foreground hidden sm:block">{s.label}</span>
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-1 bg-secondary [&>div]:bg-gradient-gold" />
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="glass rounded-2xl p-8 md:p-12"
          >
            {/* Step 0: Upload */}
            {currentStep === 0 && (
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">Upload Your Resume</h2>
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
                    dragOver ? "border-primary bg-primary/5" : fileName ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/30"
                  }`}
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file"; input.accept = ".pdf";
                    input.onchange = (e: any) => { if (e.target.files[0]) setFileName(e.target.files[0].name); };
                    input.click();
                  }}
                >
                  <Upload className={`w-12 h-12 mx-auto mb-4 ${fileName ? "text-primary" : "text-muted-foreground"}`} />
                  {fileName ? (
                    <p className="font-body text-sm text-primary font-semibold">{fileName}</p>
                  ) : (
                    <>
                      <p className="font-body text-sm text-foreground font-medium mb-1">Drag & drop your PDF here</p>
                      <p className="font-body text-xs text-muted-foreground">or click to browse</p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Step 1: About You */}
            {currentStep === 1 && (
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">Tell Us About You</h2>
                <p className="font-body text-sm text-muted-foreground mb-8">Help us personalize your resume perfectly.</p>
                <div className="space-y-5">
                  <div>
                    <Label className="font-body text-sm text-foreground">I am a...</Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {["College Student", "Professional"].map((t) => (
                        <button
                          key={t}
                          onClick={() => setProfile({ ...profile, type: t })}
                          className={`rounded-xl p-4 font-body text-sm font-medium transition-all ${
                            profile.type === t ? "glass-gold border border-primary text-primary" : "glass text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="font-body text-sm text-foreground">Years of Experience</Label>
                    <Input value={profile.experience} onChange={(e) => setProfile({ ...profile, experience: e.target.value })} placeholder="e.g. 2 years" className="mt-2 bg-secondary border-border" />
                  </div>
                  <div>
                    <Label className="font-body text-sm text-foreground">Education</Label>
                    <Input value={profile.education} onChange={(e) => setProfile({ ...profile, education: e.target.value })} placeholder="e.g. B.Tech Computer Science, XYZ University" className="mt-2 bg-secondary border-border" />
                  </div>
                  <div>
                    <Label className="font-body text-sm text-foreground">Key Skills (comma separated)</Label>
                    <Input value={profile.skills} onChange={(e) => setProfile({ ...profile, skills: e.target.value })} placeholder="e.g. Python, React, SQL, Machine Learning" className="mt-2 bg-secondary border-border" />
                  </div>
                  <div>
                    <Label className="font-body text-sm text-foreground">Certifications (optional)</Label>
                    <Input value={profile.certifications} onChange={(e) => setProfile({ ...profile, certifications: e.target.value })} placeholder="e.g. AWS Certified, Google Analytics" className="mt-2 bg-secondary border-border" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Job Description */}
            {currentStep === 2 && (
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">Target Job Description</h2>
                <p className="font-body text-sm text-muted-foreground mb-8">Paste the job description — we'll extract keywords and optimize accordingly.</p>
                <Textarea
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  placeholder="Paste the complete job description here..."
                  className="min-h-[250px] bg-secondary border-border font-body text-sm"
                />
                {jobDesc.length > 50 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 glass-gold rounded-xl p-4">
                    <p className="font-body text-xs text-primary font-semibold mb-2">🔍 AI Keyword Preview</p>
                    <div className="flex flex-wrap gap-2">
                      {["Python", "Machine Learning", "SQL", "Data Analysis", "Communication", "Problem Solving"].map((kw) => (
                        <span key={kw} className="bg-primary/10 text-primary font-body text-xs px-3 py-1 rounded-full">{kw}</span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Step 3: Projects */}
            {currentStep === 3 && (
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">Your Projects</h2>
                <p className="font-body text-sm text-muted-foreground mb-8">Tell us about your projects — even "faltu" ones. We'll reframe them into impact stories.</p>
                <div className="space-y-6">
                  {projects.map((p, i) => (
                    <div key={i} className="glass-gold rounded-xl p-6 relative">
                      {projects.length > 1 && (
                        <button onClick={() => setProjects(projects.filter((_, j) => j !== i))} className="absolute top-3 right-3 text-muted-foreground hover:text-destructive">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                      <div className="space-y-3">
                        <Input value={p.name} onChange={(e) => { const np = [...projects]; np[i].name = e.target.value; setProjects(np); }} placeholder="Project name" className="bg-secondary border-border" />
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

            {/* Step 4: Generate */}
            {currentStep === 4 && (
              <div className="text-center py-8">
                {!generating ? (
                  <>
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                      <Sparkles className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">Ready to Transform</h2>
                    <p className="font-body text-sm text-muted-foreground mb-8 max-w-md mx-auto">
                      Our AI will analyze your profile, reframe your projects, and generate an ATS-optimized resume.
                    </p>
                    <Button onClick={handleGenerate} size="lg" className="bg-gradient-gold text-primary-foreground font-body font-semibold px-10 py-6 animate-gold-pulse">
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
                    <h2 className="font-display text-xl font-bold text-foreground mb-2">AI is Working Its Magic...</h2>
                    <div className="space-y-2 mt-6 max-w-sm mx-auto">
                      {["Analyzing resume structure...", "Extracting job keywords...", "Reframing projects...", "Optimizing for ATS..."].map((t, i) => (
                        <motion.div
                          key={t}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.6 }}
                          className="flex items-center gap-2"
                        >
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                          <span className="font-body text-xs text-muted-foreground">{t}</span>
                        </motion.div>
                      ))}
                    </div>
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
          {currentStep < 4 && (
            <Button
              onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
              className="bg-gradient-gold text-primary-foreground font-body font-semibold"
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
