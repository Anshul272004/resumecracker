import { useState } from "react";
import { motion } from "framer-motion";
import { Download, FileText, Mail, Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const resumeData = {
  name: "Priya Sharma",
  title: "Software Developer",
  email: "priya.sharma@email.com",
  phone: "+91 98765 43210",
  location: "Bangalore, India",
  summary: "Results-driven software developer with 2+ years of experience building scalable web applications. Proficient in Python, React, SQL, and Machine Learning with a proven track record of improving system performance and user engagement.",
  experience: [
    {
      role: "Junior Software Developer",
      company: "TechCorp Solutions",
      period: "2024 – Present",
      bullets: [
        "Engineered RESTful APIs serving 10,000+ daily requests with 99.9% uptime",
        "Optimized database queries reducing response time by 45% across 3 microservices",
        "Led migration from monolithic to microservices architecture, improving deployment frequency by 3x",
      ],
    },
  ],
  projects: [
    {
      name: "Weather Intelligence Dashboard",
      bullets: [
        "Engineered a real-time weather analytics platform integrating 5 RESTful APIs with intelligent caching",
        "Reduced data fetch latency by 40% through optimized API call batching and error handling",
        "Achieved 2x user session duration through intuitive UI design and real-time data visualization",
      ],
    },
    {
      name: "Text Analysis Module",
      bullets: [
        "Designed a Python-based text processing engine for character data categorization and validation",
        "Improved input validation accuracy by 30% through optimized conditional handling algorithms",
        "Reduced code complexity by 25% with refactored modular architecture",
      ],
    },
    {
      name: "Task Management Platform",
      bullets: [
        "Developed full-stack productivity app with persistent state management and priority-based sorting",
        "Boosted user productivity tracking by 2x across 500+ active users",
        "Implemented real-time sync with offline-first architecture for seamless mobile experience",
      ],
    },
  ],
  skills: ["Python", "React", "TypeScript", "SQL", "Machine Learning", "REST APIs", "Git", "Docker", "AWS"],
  education: "B.Tech Computer Science — XYZ University (2022)",
};

const ResumeBuilder = () => {
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [activeTab, setActiveTab] = useState<"resume" | "cover">("resume");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 pt-28 pb-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-display text-2xl md:text-4xl font-bold text-foreground">
              Your Enhanced <span className="text-gradient-gold">Resume</span>
            </h1>
            <p className="font-body text-sm text-muted-foreground mt-1">AI-optimized and ATS-ready</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch checked={showCoverLetter} onCheckedChange={setShowCoverLetter} />
              <Label className="font-body text-sm text-muted-foreground">Cover Letter</Label>
            </div>
            <Button className="bg-gradient-gold text-primary-foreground font-body font-semibold">
              <Download className="w-4 h-4 mr-2" /> Download PDF
            </Button>
          </div>
        </motion.div>

        {/* Tabs */}
        {showCoverLetter && (
          <div className="flex gap-2 mb-6">
            {[
              { key: "resume" as const, label: "Resume", icon: FileText },
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

        {/* Resume Preview */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          {activeTab === "resume" ? (
            <div className="bg-foreground rounded-2xl p-8 md:p-12 max-w-3xl mx-auto shadow-2xl">
              {/* Name */}
              <div className="border-b-2 border-primary pb-4 mb-6">
                <h1 className="font-display text-3xl font-bold text-background">{resumeData.name}</h1>
                <p className="font-body text-sm text-background/70 mt-1">{resumeData.title}</p>
                <div className="flex flex-wrap gap-4 mt-2 font-body text-xs text-background/60">
                  <span>{resumeData.email}</span>
                  <span>{resumeData.phone}</span>
                  <span>{resumeData.location}</span>
                </div>
              </div>

              {/* Summary */}
              <div className="mb-6">
                <h2 className="font-body text-xs font-bold uppercase tracking-widest text-primary mb-2">Professional Summary</h2>
                <p className="font-body text-sm text-background/80 leading-relaxed">{resumeData.summary}</p>
              </div>

              {/* Experience */}
              <div className="mb-6">
                <h2 className="font-body text-xs font-bold uppercase tracking-widest text-primary mb-3">Experience</h2>
                {resumeData.experience.map((exp, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-body text-sm font-bold text-background">{exp.role}</h3>
                      <span className="font-body text-xs text-background/50">{exp.period}</span>
                    </div>
                    <p className="font-body text-xs text-background/60 mb-2">{exp.company}</p>
                    <ul className="space-y-1.5">
                      {exp.bullets.map((b, j) => (
                        <li key={j} className="font-body text-xs text-background/75 flex gap-2">
                          <span className="text-primary mt-0.5">▸</span> {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Projects */}
              <div className="mb-6">
                <h2 className="font-body text-xs font-bold uppercase tracking-widest text-primary mb-3">Projects</h2>
                <div className="space-y-4">
                  {resumeData.projects.map((proj, i) => (
                    <div key={i}>
                      <h3 className="font-body text-sm font-bold text-background">{proj.name}</h3>
                      <ul className="space-y-1.5 mt-1">
                        {proj.bullets.map((b, j) => (
                          <li key={j} className="font-body text-xs text-background/75 flex gap-2">
                            <span className="text-primary mt-0.5">▸</span> {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h2 className="font-body text-xs font-bold uppercase tracking-widest text-primary mb-2">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((s) => (
                    <span key={s} className="font-body text-xs px-2.5 py-1 rounded border border-background/20 text-background/70">{s}</span>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div>
                <h2 className="font-body text-xs font-bold uppercase tracking-widest text-primary mb-2">Education</h2>
                <p className="font-body text-sm text-background/80">{resumeData.education}</p>
              </div>
            </div>
          ) : (
            <div className="bg-foreground rounded-2xl p-8 md:p-12 max-w-3xl mx-auto shadow-2xl">
              <div className="font-body text-sm text-background/80 leading-relaxed space-y-4">
                <p>Dear Hiring Manager,</p>
                <p>
                  I am writing to express my strong interest in the Software Developer position at your organization. With 2+ years of hands-on experience in building scalable web applications and a solid foundation in Python, React, and Machine Learning, I am confident in my ability to contribute meaningfully to your team.
                </p>
                <p>
                  In my current role at TechCorp Solutions, I have engineered RESTful APIs handling 10,000+ daily requests, optimized database performance by 45%, and led a successful migration to microservices architecture. These experiences have honed my ability to solve complex technical challenges while delivering measurable business impact.
                </p>
                <p>
                  What excites me most about this opportunity is the chance to apply my problem-solving skills to real-world challenges at scale. I am particularly drawn to your team's focus on innovation and user-centric development.
                </p>
                <p>
                  I would welcome the opportunity to discuss how my skills and experience align with your team's needs. Thank you for considering my application.
                </p>
                <p>
                  Sincerely,<br />
                  <span className="font-semibold text-background">{resumeData.name}</span>
                </p>
              </div>
            </div>
          )}
        </motion.div>

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
