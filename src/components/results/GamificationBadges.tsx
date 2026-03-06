import { motion } from "framer-motion";
import { Trophy, Flame, Brain, Target, FileText, Star } from "lucide-react";

interface GamificationBadgesProps {
  resumeCount: number;
  interviewSolved: number;
  atsScore: number;
  streakCount: number;
}

const GamificationBadges = ({ resumeCount, interviewSolved, atsScore, streakCount }: GamificationBadgesProps) => {
  const badges = [
    { name: "First Resume", icon: FileText, earned: resumeCount >= 1, desc: "Created your first resume", points: 50 },
    { name: "Interview Starter", icon: Brain, earned: interviewSolved >= 1, desc: "Solved first interview question", points: 20 },
    { name: "ATS Master", icon: Target, earned: atsScore >= 85, desc: "Achieved 85%+ ATS score", points: 100 },
    { name: "Streak Champion", icon: Flame, earned: streakCount >= 3, desc: "3+ day streak", points: 30 },
    { name: "Resume Pro", icon: Star, earned: resumeCount >= 3, desc: "Created 3+ resumes", points: 75 },
    { name: "Interview Ace", icon: Trophy, earned: interviewSolved >= 10, desc: "Solved 10+ questions", points: 150 },
  ];

  const totalPoints = badges.filter(b => b.earned).reduce((sum, b) => sum + b.points, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
      className="glass-gold-deep rounded-2xl p-6 mb-8 border-shine">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          <h2 className="font-display text-lg font-bold text-foreground">Achievements</h2>
        </div>
        <div className="flex items-center gap-1.5 glass-gold rounded-full px-3 py-1.5">
          <Star className="w-4 h-4 text-primary" />
          <span className="font-display text-sm font-bold text-primary">{totalPoints}</span>
          <span className="font-body text-[10px] text-primary">pts</span>
        </div>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {badges.map((badge, i) => (
          <motion.div
            key={badge.name}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${
              badge.earned ? "glass-gold" : "glass opacity-40"
            }`}
          >
            <badge.icon className={`w-6 h-6 ${badge.earned ? "text-primary" : "text-muted-foreground"}`} />
            <span className="font-body text-[9px] font-bold text-center leading-tight text-foreground">{badge.name}</span>
            {badge.earned && <span className="font-body text-[8px] text-primary">+{badge.points}</span>}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default GamificationBadges;
