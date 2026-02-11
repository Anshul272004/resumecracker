import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

const activities = [
  "Priya from Bangalore just scored 94% ATS 🎯",
  "Rahul's resume got 3 interview calls in 48 hours 🔥",
  "Ananya upgraded to Pro — 5x more callbacks 📈",
  "127 people are building resumes right now 👥",
  "Vikram landed a Google interview using ProfileX 🏆",
  "Sneha's cover letter impressed Microsoft recruiters ✨",
  "2,400+ users rated us 4.9/5 ⭐",
  "Arjun got shortlisted at Swiggy in 3 days 🚀",
];

const LiveActivityTicker = () => {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % activities.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-primary/5 border-y border-primary/10 py-2.5 overflow-hidden">
      <div className="container mx-auto px-6 flex items-center justify-center gap-2">
        <Zap className="w-3.5 h-3.5 text-primary shrink-0" />
        <AnimatePresence mode="wait">
          <motion.span
            key={currentIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="font-body text-xs text-primary font-medium"
          >
            {activities[currentIdx]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LiveActivityTicker;
