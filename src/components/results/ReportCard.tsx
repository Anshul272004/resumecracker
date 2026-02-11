import { motion } from "framer-motion";
import { Award, Download, Share2, TrendingUp, Target, Brain, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const ReportCard = () => {
  const metrics = [
    { icon: Target, label: "ATS Score", before: "23%", after: "92%", color: "text-primary" },
    { icon: Brain, label: "Psychology Biases", before: "0", after: "6 Applied", color: "text-primary" },
    { icon: TrendingUp, label: "Interview Probability", before: "12%", after: "78%", color: "text-primary" },
    { icon: Shield, label: "Keyword Match", before: "34%", after: "96%", color: "text-primary" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="glass-gold-deep rounded-2xl p-8 md:p-10 mb-8 glow-gold border-shine"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shadow-gold">
            <Award className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Your Report Card</h2>
            <p className="font-body text-sm text-muted-foreground">Share your transformation with the world</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10 font-body text-xs">
            <Share2 className="w-3.5 h-3.5 mr-1" /> Share
          </Button>
          <Button size="sm" className="bg-gradient-gold text-primary-foreground font-body text-xs">
            <Download className="w-3.5 h-3.5 mr-1" /> Save
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {metrics.map((m, i) => (
          <div key={i} className="glass rounded-xl p-4 text-center">
            <m.icon className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider mb-2">{m.label}</p>
            <div className="flex items-center justify-center gap-2">
              <span className="font-body text-xs text-destructive line-through">{m.before}</span>
              <span className="text-primary">→</span>
              <span className="font-display text-lg font-bold text-primary">{m.after}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-gold rounded-xl p-4 text-center">
        <p className="font-display text-lg font-bold text-primary">Overall Grade: A+</p>
        <p className="font-body text-xs text-muted-foreground mt-1">Your resume is in the top 1% of all applicants analyzed by ProfileX</p>
      </div>
    </motion.div>
  );
};

export default ReportCard;
