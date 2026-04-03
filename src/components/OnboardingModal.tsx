import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Briefcase, Globe, DollarSign, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

const careerGoals = [
  { value: "get_job", label: "Get My First Job", icon: "🎯", desc: "Fresher / Student" },
  { value: "switch_career", label: "Switch Career", icon: "🔄", desc: "Changing industries" },
  { value: "promotion", label: "Get Promoted", icon: "📈", desc: "Level up in current field" },
  { value: "better_offer", label: "Better Offer", icon: "💰", desc: "Higher salary / role" },
];

const countries = [
  "India", "United States", "United Kingdom", "Canada", "Australia",
  "Germany", "Singapore", "UAE", "Netherlands", "Remote / Anywhere",
];

interface OnboardingModalProps {
  userId: string;
  userName: string;
  onComplete: () => void;
}

const OnboardingModal = ({ userId, userName, onComplete }: OnboardingModalProps) => {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState("");
  const [role, setRole] = useState("");
  const [salaryMin, setSalaryMin] = useState(30000);
  const [salaryMax, setSalaryMax] = useState(80000);
  const [country, setCountry] = useState("");

  const handleFinish = async () => {
    await supabase.from("profiles").update({
      career_goal: goal,
      target_role: role,
      target_salary_min: salaryMin,
      target_salary_max: salaryMax,
      target_country: country,
      onboarding_complete: true,
    } as any).eq("id", userId);
    onComplete();
  };

  const steps = [
    // Step 0: Career Goal
    <div key="goal" className="space-y-4">
      <div className="text-center mb-6">
        <span className="text-4xl mb-3 block">🎯</span>
        <h2 className="font-display text-2xl font-bold text-foreground">Hey {userName}! What's your goal?</h2>
        <p className="font-body text-sm text-muted-foreground mt-1">We'll personalize everything for you</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {careerGoals.map((g) => (
          <button
            key={g.value}
            onClick={() => { setGoal(g.value); setStep(1); }}
            className={`p-4 rounded-xl border-2 text-left transition-all hover:scale-[1.02] ${
              goal === g.value ? "border-primary bg-primary/10 shadow-gold" : "border-border glass hover:border-primary/30"
            }`}
          >
            <span className="text-2xl block mb-2">{g.icon}</span>
            <span className="font-body text-sm font-bold text-foreground block">{g.label}</span>
            <span className="font-body text-[10px] text-muted-foreground">{g.desc}</span>
          </button>
        ))}
      </div>
    </div>,

    // Step 1: Target Role
    <div key="role" className="space-y-4">
      <div className="text-center mb-6">
        <Briefcase className="w-10 h-10 text-primary mx-auto mb-3" />
        <h2 className="font-display text-2xl font-bold text-foreground">What role are you targeting?</h2>
        <p className="font-body text-sm text-muted-foreground mt-1">We'll match keywords and skills for this role</p>
      </div>
      <Input
        value={role}
        onChange={(e) => setRole(e.target.value)}
        placeholder="e.g. Software Engineer, Data Analyst, Product Manager"
        className="bg-secondary border-border text-center font-body text-base h-12"
        autoFocus
      />
      <Button onClick={() => setStep(2)} disabled={!role.trim()} className="w-full bg-gradient-gold text-primary-foreground font-body font-semibold h-11">
        Continue <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>,

    // Step 2: Salary + Country
    <div key="salary" className="space-y-5">
      <div className="text-center mb-4">
        <Globe className="w-10 h-10 text-primary mx-auto mb-3" />
        <h2 className="font-display text-2xl font-bold text-foreground">Almost done!</h2>
        <p className="font-body text-sm text-muted-foreground mt-1">Help us personalize your career insights</p>
      </div>
      <div>
        <Label className="font-body text-xs text-muted-foreground mb-2 block">Salary Range (USD/year)</Label>
        <div className="flex items-center gap-3">
          <Input type="number" value={salaryMin} onChange={(e) => setSalaryMin(Number(e.target.value))} className="bg-secondary border-border font-body text-sm h-10" placeholder="Min" />
          <span className="text-muted-foreground font-body text-sm">to</span>
          <Input type="number" value={salaryMax} onChange={(e) => setSalaryMax(Number(e.target.value))} className="bg-secondary border-border font-body text-sm h-10" placeholder="Max" />
        </div>
      </div>
      <div>
        <Label className="font-body text-xs text-muted-foreground mb-2 block">Target Country</Label>
        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
          {countries.map((c) => (
            <button
              key={c}
              onClick={() => setCountry(c)}
              className={`px-3 py-2 rounded-lg border text-left font-body text-xs transition-all ${
                country === c ? "border-primary bg-primary/10 text-primary font-semibold" : "border-border glass text-muted-foreground hover:border-primary/30"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <Button onClick={handleFinish} disabled={!country} className="w-full bg-gradient-gold text-primary-foreground font-body font-semibold h-11 shadow-gold">
        <Sparkles className="w-4 h-4 mr-2" /> Launch My Career Dashboard
      </Button>
    </div>,
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-xl flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-gold-deep rounded-2xl p-8 max-w-lg w-full border-shine shadow-gold relative"
      >
        {/* Progress dots */}
        <div className="flex gap-2 justify-center mb-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-all ${i <= step ? "bg-primary w-6" : "bg-muted"}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            {steps[step]}
          </motion.div>
        </AnimatePresence>

        {step > 0 && (
          <button onClick={() => setStep(step - 1)} className="absolute top-4 left-4 font-body text-xs text-muted-foreground hover:text-foreground">
            ← Back
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default OnboardingModal;
