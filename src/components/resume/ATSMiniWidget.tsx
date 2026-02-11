import { motion } from "framer-motion";
import { Shield } from "lucide-react";

interface ATSMiniWidgetProps {
  score?: number;
}

const ATSMiniWidget = ({ score = 92 }: ATSMiniWidgetProps) => {
  const circumference = 2 * Math.PI * 28;
  const strokeDasharray = `${(score / 100) * circumference} ${circumference}`;

  return (
    <div className="glass-gold-deep rounded-xl p-5 border-shine">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="w-4 h-4 text-primary" />
        <span className="font-body text-xs font-bold text-primary uppercase tracking-wider">Live ATS Score</span>
      </div>
      <div className="flex items-center justify-center mb-3">
        <div className="relative w-20 h-20">
          <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
            <circle cx="32" cy="32" r="28" fill="none" strokeWidth="4" className="stroke-muted" />
            <motion.circle
              cx="32" cy="32" r="28" fill="none" strokeWidth="4" strokeLinecap="round"
              className="stroke-primary"
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-display text-xl font-bold text-primary">
            {score}%
          </span>
        </div>
      </div>
      <p className="font-body text-[10px] text-muted-foreground text-center">
        {score >= 90 ? "🔥 Excellent — Top 1% ATS compatibility" :
         score >= 70 ? "👍 Good — Passes most ATS filters" :
         "⚠️ Needs improvement"}
      </p>
      <div className="mt-3 space-y-1.5">
        {[
          { label: "Keyword Match", val: "96%" },
          { label: "Format Score", val: "100%" },
          { label: "Section Parse", val: "98%" },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <span className="font-body text-[10px] text-muted-foreground">{item.label}</span>
            <span className="font-body text-[10px] text-primary font-semibold">{item.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ATSMiniWidget;
