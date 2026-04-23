import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Shield, Star, Zap, Sparkles, TrendingUp, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import TiltCard from "@/components/3d/TiltCard";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import HairlineRule from "@/components/editorial/HairlineRule";
import CornerBrackets from "@/components/editorial/CornerBrackets";
import ChapterNumber from "@/components/editorial/ChapterNumber";

const successQuotes = [
  { quote: "From 0 callbacks to 5 FAANG offers in 6 weeks.", name: "Priya S.", role: "Software Engineer · Google", icon: TrendingUp },
  { quote: "ATS score went from 42 to 94. Game changer.", name: "Arjun M.", role: "Product Manager · Microsoft", icon: Award },
  { quote: "I finally understood what recruiters actually want.", name: "Kavya R.", role: "Data Scientist · Meta", icon: Sparkles },
  { quote: "Doubled my salary in one negotiation cycle.", name: "Rohan K.", role: "Senior Designer · Stripe", icon: Star },
];

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const { signIn, signUp, resetPassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const t = setInterval(() => setQuoteIdx((i) => (i + 1) % successQuotes.length), 5000);
    return () => clearInterval(t);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (showForgot) {
      const { error } = await resetPassword(email);
      setLoading(false);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else { toast({ title: "Check your email", description: "Password reset link sent." }); setShowForgot(false); }
      return;
    }

    if (isLogin) {
      const { error } = await signIn(email, password);
      setLoading(false);
      if (error) toast({ title: "Login failed", description: error.message, variant: "destructive" });
      else navigate("/dashboard");
    } else {
      if (!fullName.trim()) { setLoading(false); toast({ title: "Name required", description: "Please enter your full name.", variant: "destructive" }); return; }
      const { error } = await signUp(email, password, fullName);
      setLoading(false);
      if (error) toast({ title: "Signup failed", description: error.message, variant: "destructive" });
      else toast({ title: "Check your email", description: "We sent you a verification link." });
    }
  };

  const current = successQuotes[quoteIdx];
  const QIcon = current.icon;

  return (
    <div className="min-h-screen surface-obsidian grain-overlay grid lg:grid-cols-2 relative overflow-hidden">
      {/* Background particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-champagne/30 animate-float pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${8 + Math.random() * 12}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}

      {/* LEFT: cinematic story panel (hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative z-10 border-r border-champagne/15 overflow-hidden">
        <div className="absolute -left-10 top-1/4 pointer-events-none">
          <ChapterNumber numeral="✦" />
        </div>
        <Link to="/" className="flex items-center gap-3 relative z-10">
          <div className="relative flex h-10 w-10 items-center justify-center border border-champagne/60">
            <span className="font-editorial text-base text-champagne italic">R</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-editorial text-lg text-foreground">
              Resume<span className="italic text-champagne">Cracker</span>
            </span>
            <span className="text-spec text-[0.55rem] text-champagne/60 mt-0.5">MAISON · EST. 2025</span>
          </div>
        </Link>

        <div className="space-y-10 relative z-10 max-w-lg">
          <div className="flex items-center gap-3">
            <span className="text-spec text-champagne/80">PROLOGUE</span>
            <span className="hairline-solid w-12" />
            <span className="text-eyebrow">A Private Invitation</span>
          </div>
          <h2 className="text-editorial-md text-foreground">
            The next chapter of your career
            <em className="italic text-champagne"> begins </em>
            with a single page.
          </h2>
          <HairlineRule className="w-32" align="left" />
          <p className="font-body text-base text-muted-foreground leading-relaxed">
            Quietly assembled by craftsmen of intelligence and design. Trusted by fifteen thousand professionals already wearing the result.
          </p>

          <AnimatePresence mode="wait">
            <motion.figure
              key={quoteIdx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.6 }}
              className="border-l border-champagne/40 pl-6"
            >
              <blockquote className="font-editorial text-2xl text-foreground italic leading-snug">
                “{current.quote}”
              </blockquote>
              <figcaption className="text-spec text-champagne/70 mt-4">
                — {current.name} · {current.role}
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-3 gap-6 relative z-10">
          {[
            { v: <><AnimatedCounter to={15847} />+</>, l: "Joined" },
            { v: <><AnimatedCounter to={94} />%</>, l: "ATS Pass" },
            { v: <><AnimatedCounter to={3.2} decimals={1} />×</>, l: "Callbacks" },
          ].map((s, i) => (
            <div key={i} className="border-t border-champagne/30 pt-3">
              <div className="font-editorial text-2xl text-foreground">{s.v}</div>
              <div className="text-spec text-champagne/60 mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: form panel */}
      <div className="flex items-center justify-center px-4 py-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center border border-champagne/60">
              <span className="font-editorial text-base text-champagne italic">R</span>
            </div>
            <span className="font-editorial text-xl text-foreground">
              Resume<span className="italic text-champagne">Cracker</span>
            </span>
          </Link>

          <CornerBrackets size={18} className="p-10 bg-smoke/40 backdrop-blur-xl">
            <div className="text-center mb-8">
              <div className="text-eyebrow mb-3">{showForgot ? "Recover" : isLogin ? "Return" : "Enter"}</div>
              <h1 className="font-editorial text-3xl text-foreground">
                {showForgot ? "Reset password" : isLogin ? <>Welcome <em className="italic text-champagne">back.</em></> : <>Join the <em className="italic text-champagne">maison.</em></>}
              </h1>
              <HairlineRule className="mt-5 mx-auto w-20" align="center" />
            </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && !showForgot && (
                  <div className="space-y-2">
                    <Label className="text-spec text-champagne/80">Full Name</Label>
                    <div className="relative input-luxury">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Priya Sharma" className="pl-10 bg-transparent border-x-0 border-t-0 border-b border-champagne/30 rounded-none focus-visible:ring-0 font-body" />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-spec text-champagne/80">Email</Label>
                  <div className="relative input-luxury">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="pl-10 bg-transparent border-x-0 border-t-0 border-b border-champagne/30 rounded-none focus-visible:ring-0 font-body" required />
                  </div>
                </div>

                {!showForgot && (
                  <div className="space-y-2">
                    <Label className="text-spec text-champagne/80">Password</Label>
                    <div className="relative input-luxury">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pl-10 pr-10 bg-transparent border-x-0 border-t-0 border-b border-champagne/30 rounded-none focus-visible:ring-0 font-body" required minLength={6} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {isLogin && !showForgot && (
                  <button type="button" onClick={() => setShowForgot(true)} className="text-spec text-champagne hover:text-champagne-light block ml-auto">
                    Forgot password?
                  </button>
                )}

                <Button type="submit" disabled={loading} className="w-full bg-champagne text-bone-ink font-eyebrow tracking-[0.3em] uppercase text-[0.72rem] py-6 rounded-none hover:bg-champagne-light">
                  {loading ? (
                    <div className="w-5 h-5 border border-bone-ink border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>{showForgot ? "Send Reset Link" : isLogin ? "Sign In" : "Create Account"}<ArrowRight className="w-3.5 h-3.5 ml-3" /></>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                {showForgot ? (
                  <button onClick={() => setShowForgot(false)} className="text-spec text-muted-foreground hover:text-champagne">Back to sign in</button>
                ) : (
                  <button onClick={() => setIsLogin(!isLogin)} className="text-spec text-muted-foreground hover:text-champagne">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <span className="text-champagne">{isLogin ? "Sign Up" : "Sign In"}</span>
                  </button>
                )}
              </div>
          </CornerBrackets>

          <div className="mt-8 flex items-center justify-center gap-4 text-spec text-champagne/60">
            <span>SSL · ENCRYPTED</span>
            <span>·</span>
            <span>4.9 / 5</span>
            <span>·</span>
            <span>FREE START</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
