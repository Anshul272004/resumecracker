import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";

const keywordData = [
  { keyword: "Python", count: 8, optimal: true },
  { keyword: "React", count: 6, optimal: true },
  { keyword: "SQL", count: 5, optimal: true },
  { keyword: "APIs", count: 7, optimal: true },
  { keyword: "ML", count: 4, optimal: true },
  { keyword: "Leadership", count: 3, optimal: false },
  { keyword: "Docker", count: 2, optimal: false },
  { keyword: "AWS", count: 3, optimal: false },
];

const KeywordDensity = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 }}
    className="glass-deep rounded-2xl p-8 md:p-10 mb-8"
  >
    <div className="flex items-center gap-3 mb-6">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shadow-gold">
        <BarChart3 className="w-6 h-6 text-primary" />
      </div>
      <div>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Keyword Density Map</h2>
        <p className="font-body text-sm text-muted-foreground">How keywords are distributed across your resume</p>
      </div>
    </div>

    <div className="h-64 mb-6">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={keywordData} layout="vertical" margin={{ left: 60 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="keyword" tick={{ fill: "hsl(0 0% 55%)", fontSize: 12, fontFamily: "Inter" }} axisLine={false} tickLine={false} />
          <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={20}>
            {keywordData.map((entry, index) => (
              <Cell key={index} fill={entry.optimal ? "hsl(43 75% 52%)" : "hsl(43 75% 52% / 0.3)"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="glass-gold rounded-xl p-4 text-center">
        <p className="font-display text-3xl font-bold text-primary">96%</p>
        <p className="font-body text-xs text-muted-foreground mt-1">Keyword Match Rate</p>
      </div>
      <div className="glass rounded-xl p-4 text-center">
        <p className="font-display text-3xl font-bold text-foreground">Grade 8</p>
        <p className="font-body text-xs text-muted-foreground mt-1">Readability Score (Flesch-Kincaid)</p>
        <p className="font-body text-[10px] text-primary mt-1">✓ Optimal for professional resumes</p>
      </div>
    </div>
  </motion.div>
);

export default KeywordDensity;
