import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const PaymentSuccess = () => {
  const [confetti, setConfetti] = useState<{ x: number; y: number; delay: number; color: string }[]>([]);

  useEffect(() => {
    const pieces = Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      color: ["hsl(43 75% 52%)", "hsl(43 80% 65%)", "hsl(0 0% 95%)", "hsl(43 70% 35%)"][Math.floor(Math.random() * 4)],
    }));
    setConfetti(pieces);
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden px-4">
      {confetti.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{ backgroundColor: p.color, left: `${p.x}%`, top: "-5%" }}
          animate={{ y: "110vh", rotate: 720, opacity: [1, 1, 0] }}
          transition={{ duration: 3 + Math.random() * 2, delay: p.delay, ease: "easeIn" }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="glass-gold-deep rounded-2xl p-12 max-w-md w-full text-center border-shine glow-gold-xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
        >
          <CheckCircle2 className="w-20 h-20 text-primary mx-auto mb-6" />
        </motion.div>

        <h1 className="font-display text-4xl font-bold text-foreground mb-3">
          Welcome to <span className="text-gradient-gold">Pro</span>! <Sparkles className="inline w-6 h-6 text-primary" />
        </h1>
        <p className="font-body text-sm text-muted-foreground mb-8">
          Your account has been upgraded. All premium features are now unlocked.
        </p>

        <div className="space-y-3">
          <Link to="/dashboard">
            <Button className="w-full bg-gradient-gold text-primary-foreground font-body font-semibold py-5 shadow-gold">
              Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/resume-builder">
            <Button variant="outline" className="w-full font-body">Build Your Resume</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
