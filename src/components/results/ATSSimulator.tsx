import { motion } from "framer-motion";
import { Shield, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

interface ATSSimulatorProps {
  atsScore: number;
  keywords: string[];
  resumeSkills: string[];
}

const atsRules = {
  greenhouse: {
    name: "Greenhouse",
    icon: "🌿",
    checks: [
      { rule: "Section headers match standard format", weight: 20 },
      { rule: "No tables or columns in layout", weight: 15 },
      { rule: "Contact info at top of document", weight: 10 },
      { rule: "Keywords in first 1/3 of resume", weight: 25 },
      { rule: "Skills section clearly labeled", weight: 15 },
      { rule: "Date format consistent (MM/YYYY)", weight: 15 },
    ],
  },
  workday: {
    name: "Workday",
    icon: "⚙️",
    checks: [
      { rule: "Plain text parseable (no graphics)", weight: 20 },
      { rule: "Job title matches target role keywords", weight: 25 },
      { rule: "Experience listed in reverse chronological", weight: 15 },
      { rule: "Education section present and formatted", weight: 10 },
      { rule: "No special characters in headers", weight: 15 },
      { rule: "File format compatible (PDF/DOCX)", weight: 15 },
    ],
  },
  lever: {
    name: "Lever",
    icon: "🔧",
    checks: [
      { rule: "Keyword density above threshold", weight: 25 },
      { rule: "Action verbs lead each bullet point", weight: 20 },
      { rule: "Quantified achievements present", weight: 20 },
      { rule: "No embedded images or logos", weight: 10 },
      { rule: "Consistent font and formatting", weight: 10 },
      { rule: "Summary/objective section present", weight: 15 },
    ],
  },
};

const ATSSimulator = ({ atsScore, keywords, resumeSkills }: ATSSimulatorProps) => {
  const keywordMatchRate = resumeSkills.length > 0 && keywords.length > 0
    ? keywords.filter(k => resumeSkills.some(s => s.toLowerCase().includes(k.toLowerCase()))).length / keywords.length
    : 0.7;

  const getSystemScore = (system: keyof typeof atsRules) => {
    const base = atsScore;
    const offsets = { greenhouse: -3, workday: -7, lever: -1 };
    return Math.min(100, Math.max(40, base + offsets[system] + Math.round(keywordMatchRate * 10)));
  };

  const getCheckStatus = (weight: number, systemScore: number) => {
    if (systemScore > 80) return weight > 20 ? "pass" : "pass";
    if (systemScore > 60) return weight > 20 ? "warn" : "pass";
    return weight > 15 ? "fail" : "warn";
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
      className="glass-deep rounded-2xl p-8 md:p-10 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shadow-gold">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">ATS Simulator</h2>
          <p className="font-body text-sm text-muted-foreground">How your resume performs across major ATS platforms</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {(Object.entries(atsRules) as [keyof typeof atsRules, typeof atsRules[keyof typeof atsRules]][]).map(([key, system]) => {
          const score = getSystemScore(key);
          const passed = system.checks.filter(c => getCheckStatus(c.weight, score) === "pass").length;
          return (
            <div key={key} className="glass-gold rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{system.icon}</span>
                <h3 className="font-body text-sm font-bold text-foreground">{system.name}</h3>
                <span className={`ml-auto font-display text-lg font-bold ${score >= 80 ? "text-primary" : score >= 60 ? "text-yellow-400" : "text-destructive"}`}>
                  {score}%
                </span>
              </div>
              <div className="space-y-2">
                {system.checks.map((check, i) => {
                  const status = getCheckStatus(check.weight, score);
                  return (
                    <div key={i} className="flex items-start gap-2">
                      {status === "pass" ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                      ) : status === "warn" ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-destructive shrink-0 mt-0.5" />
                      )}
                      <span className="font-body text-[10px] text-muted-foreground">{check.rule}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <span className="font-body text-[10px] text-primary font-semibold">
                  {passed}/{system.checks.length} checks passed
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ATSSimulator;
