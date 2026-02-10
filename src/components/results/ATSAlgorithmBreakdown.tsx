import { motion } from "framer-motion";
import { Shield, CheckCircle2, XCircle } from "lucide-react";

const atsChecks = [
  { check: "Header Parsing", status: "pass", before: "Complex multi-column header", after: "Clean single-column with all contact info", weight: "High" },
  { check: "Keyword Density", status: "pass", before: "3% match (6/200 keywords)", after: "78% match (156/200 keywords)", weight: "Critical" },
  { check: "Section Headers", status: "pass", before: "Creative headers ('My Journey')", after: "Standard ATS headers ('Experience', 'Skills')", weight: "High" },
  { check: "File Formatting", status: "pass", before: "Tables, images, graphics", after: "Clean text-based layout", weight: "Critical" },
  { check: "Date Format", status: "pass", before: "Inconsistent (Jan 2024, 2024-01)", after: "Uniform format (Jan 2024 – Present)", weight: "Medium" },
  { check: "Skill Taxonomy", status: "pass", before: "Skills buried in paragraphs", after: "Extracted to dedicated Skills section + inline", weight: "High" },
  { check: "Action Verbs", status: "pass", before: "Passive voice (Was responsible for...)", after: "Active power verbs (Engineered, Optimized, Led)", weight: "Medium" },
  { check: "Quantified Impact", status: "pass", before: "0 metrics in 8 bullet points", after: "Metrics in 100% of bullet points", weight: "Critical" },
  { check: "Page Length", status: "pass", before: "3 pages (too long for entry-level)", after: "1 page, dense with relevant info", weight: "Medium" },
  { check: "Applicant Ranking", status: "pass", before: "Bottom 20% of applicant pool", after: "Top 5% of applicant pool", weight: "Critical" },
];

const ATSAlgorithmBreakdown = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
    className="glass-deep rounded-2xl p-8 md:p-10 mb-8"
  >
    <div className="flex items-center gap-3 mb-6">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shadow-gold">
        <Shield className="w-6 h-6 text-primary" />
      </div>
      <div>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">ATS Algorithm Breakdown</h2>
        <p className="font-body text-sm text-muted-foreground">10 critical checks your resume must pass — all cleared ✓</p>
      </div>
    </div>

    <div className="space-y-3">
      {atsChecks.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + i * 0.05 }}
          className="glass-gold rounded-xl p-4 grid grid-cols-12 gap-3 items-center lift-hover"
        >
          <div className="col-span-1">
            <CheckCircle2 className="w-5 h-5 text-primary" />
          </div>
          <div className="col-span-2">
            <p className="font-body text-sm font-semibold text-foreground">{item.check}</p>
            <span className={`font-body text-[10px] px-2 py-0.5 rounded-full ${
              item.weight === "Critical" ? "bg-destructive/10 text-destructive" :
              item.weight === "High" ? "bg-primary/10 text-primary" :
              "bg-muted text-muted-foreground"
            }`}>{item.weight}</span>
          </div>
          <div className="col-span-4">
            <div className="flex items-start gap-1.5">
              <XCircle className="w-3.5 h-3.5 text-destructive shrink-0 mt-0.5" />
              <p className="font-body text-xs text-muted-foreground line-through decoration-destructive/30">{item.before}</p>
            </div>
          </div>
          <div className="col-span-1 flex justify-center">
            <span className="text-primary font-body text-sm">→</span>
          </div>
          <div className="col-span-4">
            <div className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <p className="font-body text-xs text-foreground">{item.after}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>

    <div className="mt-6 glass-gold-deep rounded-xl p-5 text-center glow-gold">
      <p className="font-body text-base text-primary font-semibold">
        🏆 All 10/10 ATS checks passed — Your resume is in the top 1% of applicants
      </p>
    </div>
  </motion.div>
);

export default ATSAlgorithmBreakdown;
