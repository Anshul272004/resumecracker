import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const scanLines = [
  { text: "Initializing Career Intelligence Engine...", icon: "⚡" },
  { text: "Analyzing global job market trends...", icon: "🌍" },
  { text: "Scanning 1,000,000+ resume patterns...", icon: "📊" },
  { text: "Comparing with top 1% candidates...", icon: "🏆" },
  { text: "Your career transformation begins now.", icon: "🚀" },
];

const CinematicIntro = ({ onComplete }: { onComplete: () => void }) => {
  const [currentLine, setCurrentLine] = useState(0);
  const [showBurst, setShowBurst] = useState(false);

  useEffect(() => {
    if (currentLine < scanLines.length) {
      const timer = setTimeout(() => setCurrentLine((c) => c + 1), 1200);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setShowBurst(true);
        setTimeout(() => {
          localStorage.setItem("rc_intro_seen", "1");
          onComplete();
        }, 800);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [currentLine, onComplete]);

  const handleSkip = () => {
    localStorage.setItem("rc_intro_seen", "1");
    onComplete();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center overflow-hidden"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Gold particle burst */}
        {showBurst && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {Array.from({ length: 40 }).map((_, i) => {
              const angle = (i / 40) * Math.PI * 2;
              const distance = 200 + Math.random() * 300;
              return (
                <motion.div
                  key={i}
                  className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-primary"
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance,
                    opacity: 0,
                    scale: 0,
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              );
            })}
          </motion.div>
        )}

        {/* Ambient glow */}
        <div className="absolute w-96 h-96 rounded-full bg-primary/5 blur-[120px]" />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center shadow-gold">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-display text-3xl font-bold text-gradient-gold">ResumeCracker</span>
          </div>
        </motion.div>

        {/* Scan lines */}
        <div className="space-y-3 w-full max-w-md px-6">
          {scanLines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              animate={i < currentLine ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-3"
            >
              <span className="text-lg">{line.icon}</span>
              <span className={`font-body text-sm ${i === currentLine - 1 ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                {line.text}
              </span>
              {i < currentLine - 1 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-primary ml-auto">✓</motion.span>
              )}
              {i === currentLine - 1 && (
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  className="w-2 h-2 rounded-full bg-primary ml-auto"
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-8 w-64 h-1 rounded-full bg-secondary overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-amber-400"
            animate={{ width: `${(currentLine / scanLines.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Skip */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSkip}
          className="absolute bottom-8 right-8 font-body text-xs text-muted-foreground hover:text-foreground"
        >
          Skip →
        </Button>
      </motion.div>
    </AnimatePresence>
  );
};

export default CinematicIntro;
