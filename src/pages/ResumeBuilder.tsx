import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Mail, Eye, Pencil, FileText, Sparkles, Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TemplateSelector, { type TemplateName } from "@/components/resume/TemplateSelector";
import ResumeCustomizer from "@/components/resume/ResumeCustomizer";
import ExecutiveTemplate from "@/components/resume/templates/ExecutiveTemplate";
import MinimalTemplate from "@/components/resume/templates/MinimalTemplate";
import ModernTemplate from "@/components/resume/templates/ModernTemplate";
import CreativeTemplate from "@/components/resume/templates/CreativeTemplate";
import ElegantTemplate from "@/components/resume/templates/ElegantTemplate";
import BoldTemplate from "@/components/resume/templates/BoldTemplate";
import ATSMiniWidget from "@/components/resume/ATSMiniWidget";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const defaultResumeData = {
  name: "Priya Sharma",
  title: "Software Developer",
  email: "priya.sharma@email.com",
  phone: "+91 98765 43210",
  location: "Bangalore, India",
  summary: "Results-driven software developer with 2+ years of experience building scalable web applications.",
  experience: [{ role: "Junior Software Developer", company: "TechCorp Solutions", period: "2024 – Present", bullets: ["Engineered RESTful APIs serving 10,000+ daily requests with 99.9% uptime"] }],
  projects: [{ name: "Weather Intelligence Dashboard", bullets: ["Engineered a real-time weather analytics platform integrating 5 RESTful APIs"] }],
  skills: ["Python", "React", "TypeScript", "SQL", "Machine Learning", "REST APIs", "Git", "Docker", "AWS"],
  education: "B.Tech Computer Science — XYZ University (2022)",
};

interface ResumeVersion {
  type: string;
  summary: string;
  bullets: string[];
  tone_note: string;
}

const ResumeBuilder = () => {
  const { user } = useAuth();
  const [resumeData, setResumeData] = useState(defaultResumeData);
  const [atsScore, setAtsScore] = useState(92);
  const [loadedFromDb, setLoadedFromDb] = useState(false);

  // Customizer state
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [activeTab, setActiveTab] = useState<"resume" | "cover">("resume");
  const [template, setTemplate] = useState<TemplateName>("executive");
  const [fontSize, setFontSize] = useState(13);
  const [showPhoto, setShowPhoto] = useState(false);
  const [showSummary, setShowSummary] = useState(true);
  const [accentColor, setAccentColor] = useState("hsl(43 75% 52%)");
  const [lineSpacing, setLineSpacing] = useState([1.5]);
  const [marginSize, setMarginSize] = useState<"narrow" | "normal" | "wide">("normal");
  const [fontFamily, setFontFamily] = useState("'Inter', sans-serif");
  const [fontColor, setFontColor] = useState("hsl(0 0% 100%)");
  const [headerStyle, setHeaderStyle] = useState("left");

  // AI features
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [generatingVersions, setGeneratingVersions] = useState(false);
  const [improvingBullet, setImprovingBullet] = useState<number | null>(null);

  // Load resume from DB
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase.from("resumes").select("*")
        .eq("user_id", user.id).order("updated_at", { ascending: false }).limit(1).single();
      if (data) {
        const rd = data.resume_data as any;
        if (rd?.optimized) {
          setResumeData(prev => ({
            ...prev,
            summary: rd.optimized.cover_letter_draft ? prev.summary : prev.summary,
            experience: prev.experience.map((exp: any, i: number) => ({
              ...exp,
              bullets: rd.optimized.optimized_bullets?.slice(i * 3, (i + 1) * 3) || exp.bullets,
            })),
          }));
        }
        if (rd?.profile) {
          setResumeData(prev => ({
            ...prev,
            name: rd.profile.full_name || prev.name,
            skills: rd.profile.skills?.split(",").map((s: string) => s.trim()).filter(Boolean) || prev.skills,
            education: rd.profile.education || prev.education,
          }));
        }
        if (data.ats_score) setAtsScore(data.ats_score);
        if (data.template_name) setTemplate(data.template_name as TemplateName);
        if (data.accent_color) setAccentColor(data.accent_color);
        if (data.font_size) setFontSize(data.font_size);
        if (data.font_family) setFontFamily(data.font_family);
        setLoadedFromDb(true);
      }
    };
    load();
  }, [user]);

  const handleGenerateVersions = async () => {
    setGeneratingVersions(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-resume-versions", {
        body: { resumeData, targetRole: resumeData.title },
      });
      if (error) throw error;
      if (data?.versions) setVersions(data.versions);
      toast({ title: "Versions generated!", description: "4 resume variants ready to view." });
    } catch {
      toast({ title: "Failed", description: "Could not generate versions.", variant: "destructive" });
    }
    setGeneratingVersions(false);
  };

  const handleImproveBullet = async (bulletIndex: number) => {
    setImprovingBullet(bulletIndex);
    try {
      const { data, error } = await supabase.functions.invoke("ai-optimize-resume", {
        body: {
          resumeData: { bullet: resumeData.experience[0]?.bullets[bulletIndex] },
          targetRole: resumeData.title,
          jobDescription: "Improve this single bullet point with quantified metrics and strong action verbs.",
        },
      });
      if (error) throw error;
      if (data?.optimized_bullets?.[0]) {
        setResumeData(prev => {
          const newExp = [...prev.experience];
          if (newExp[0]) {
            const newBullets = [...newExp[0].bullets];
            newBullets[bulletIndex] = data.optimized_bullets[0];
            newExp[0] = { ...newExp[0], bullets: newBullets };
          }
          return { ...prev, experience: newExp };
        });
        toast({ title: "Bullet improved!", description: "AI enhanced your bullet point." });
      }
    } catch {
      toast({ title: "Failed", description: "Could not improve bullet.", variant: "destructive" });
    }
    setImprovingBullet(null);
  };

  const templateProps = { data: resumeData, accentColor, fontSize, showSummary };

  const renderTemplate = () => {
    switch (template) {
      case "executive": return <ExecutiveTemplate {...templateProps} />;
      case "minimal": return <MinimalTemplate {...templateProps} />;
      case "modern": return <ModernTemplate {...templateProps} />;
      case "creative": return <CreativeTemplate {...templateProps} />;
      case "elegant": return <ElegantTemplate {...templateProps} />;
      case "bold": return <BoldTemplate {...templateProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 pt-28 pb-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground">
              Your Enhanced <span className="text-gradient-gold">Resume</span>
            </h1>
            <p className="font-body text-sm text-muted-foreground mt-1">AI-optimized, ATS-ready, psychology-tuned</p>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Switch checked={showCoverLetter} onCheckedChange={setShowCoverLetter} />
              <Label className="font-body text-sm text-muted-foreground">Cover Letter</Label>
            </div>
            <Button onClick={handleGenerateVersions} disabled={generatingVersions} variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 font-body">
              {generatingVersions ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
              {generatingVersions ? "Generating..." : "Generate Versions"}
            </Button>
            <Button className="bg-gradient-gold text-primary-foreground font-body font-semibold shadow-gold">
              <Download className="w-4 h-4 mr-2" /> Download PDF
            </Button>
          </div>
        </motion.div>

        {/* Resume Versions Tabs */}
        {versions.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-gold rounded-xl p-4 mb-6">
            <p className="font-body text-xs font-bold text-primary uppercase tracking-wider mb-3">AI-Generated Versions</p>
            <Tabs defaultValue={versions[0]?.type}>
              <TabsList className="bg-secondary">
                {versions.map(v => (
                  <TabsTrigger key={v.type} value={v.type} className="font-body text-xs capitalize">{v.type}</TabsTrigger>
                ))}
              </TabsList>
              {versions.map(v => (
                <TabsContent key={v.type} value={v.type}>
                  <div className="glass rounded-xl p-4 mt-2">
                    <p className="font-body text-xs text-primary font-semibold mb-2">{v.tone_note}</p>
                    <p className="font-body text-sm text-foreground mb-3">{v.summary}</p>
                    <ul className="space-y-1">
                      {v.bullets.map((b, i) => (
                        <li key={i} className="font-body text-xs text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span> {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </motion.div>
        )}

        {/* Template Selector */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
          <h2 className="font-body text-xs font-bold text-primary uppercase tracking-wider mb-3">Choose Template</h2>
          <TemplateSelector selected={template} onChange={setTemplate} />
        </motion.div>

        {/* Tabs */}
        {showCoverLetter && (
          <div className="flex gap-2 mb-6">
            {[
              { key: "resume" as const, label: "Resume", icon: Pencil },
              { key: "cover" as const, label: "Cover Letter", icon: Mail },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-body text-sm font-medium transition-all ${
                  activeTab === tab.key ? "glass-gold text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Main Layout */}
        <div className="grid md:grid-cols-[1fr_280px] gap-6">
          {/* Resume Preview */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative">
            {activeTab === "resume" ? (
              <div style={{ lineHeight: lineSpacing[0] }}>
                <div className={`${marginSize === "narrow" ? "px-4" : marginSize === "wide" ? "px-16" : "px-8"}`}>
                  {renderTemplate()}
                </div>
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.08] rotate-[-30deg]">
                  <span className="font-display text-6xl md:text-8xl font-bold text-primary whitespace-nowrap">PROFILEX PREVIEW</span>
                </div>
              </div>
            ) : (
              <div className="bg-foreground rounded-2xl p-8 md:p-12 max-w-3xl mx-auto shadow-2xl">
                <div className="font-body text-sm text-background/80 leading-relaxed space-y-4">
                  <p>Dear Hiring Manager,</p>
                  <p>I am writing to express my strong interest in the {resumeData.title} position. With experience building scalable web applications and a solid foundation in {resumeData.skills.slice(0, 3).join(", ")}, I am confident in my ability to contribute meaningfully to your team.</p>
                  <p>Sincerely,<br /><span className="font-semibold text-background">{resumeData.name}</span></p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Customizer Sidebar */}
          {activeTab === "resume" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="space-y-4">
              <ATSMiniWidget score={atsScore} />

              {/* AI Suggestions */}
              <div className="glass-gold rounded-xl p-4">
                <Label className="font-body text-xs font-bold text-primary uppercase tracking-wider mb-3 block">AI Suggestions</Label>
                <div className="space-y-2">
                  {resumeData.experience[0]?.bullets.map((bullet, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="font-body text-[10px] text-muted-foreground flex-1 line-clamp-2">{bullet}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="shrink-0 h-6 w-6 p-0 text-primary hover:bg-primary/10"
                        disabled={improvingBullet === i}
                        onClick={() => handleImproveBullet(i)}
                      >
                        {improvingBullet === i ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Line Spacing */}
              <div className="glass rounded-xl p-4">
                <Label className="font-body text-xs font-bold text-primary uppercase tracking-wider mb-3 block">Line Spacing</Label>
                <Slider value={lineSpacing} onValueChange={setLineSpacing} min={1} max={2} step={0.1} className="mb-2" />
                <span className="font-body text-[10px] text-muted-foreground">{lineSpacing[0].toFixed(1)}x</span>
              </div>

              {/* Margin Control */}
              <div className="glass rounded-xl p-4">
                <Label className="font-body text-xs font-bold text-primary uppercase tracking-wider mb-3 block">Margins</Label>
                <div className="flex gap-2">
                  {(["narrow", "normal", "wide"] as const).map((m) => (
                    <button key={m} onClick={() => setMarginSize(m)}
                      className={`flex-1 font-body text-xs py-2 rounded-lg transition-all capitalize ${
                        marginSize === m ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <ResumeCustomizer
                fontSize={fontSize} setFontSize={setFontSize}
                showPhoto={showPhoto} setShowPhoto={setShowPhoto}
                showSummary={showSummary} setShowSummary={setShowSummary}
                accentColor={accentColor} setAccentColor={setAccentColor}
                fontFamily={fontFamily} setFontFamily={setFontFamily}
                fontColor={fontColor} setFontColor={setFontColor}
                headerStyle={headerStyle} setHeaderStyle={setHeaderStyle}
              />
            </motion.div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4 mt-8">
          <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 font-body">
            <Pencil className="w-4 h-4 mr-2" /> Edit Resume
          </Button>
          <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 font-body">
            <Eye className="w-4 h-4 mr-2" /> Preview Print
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResumeBuilder;
