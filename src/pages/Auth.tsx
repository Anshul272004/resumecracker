import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Shield, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import TiltCard from "@/components/3d/TiltCard";
const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (showForgot) {
      const { error } = await resetPassword(email);
      setLoading(false);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Check your email", description: "Password reset link sent to your inbox." });
        setShowForgot(false);
      }
      return;
    }

    if (isLogin) {
      const { error } = await signIn(email, password);
      setLoading(false);
      if (error) {
        toast({ title: "Login failed", description: error.message, variant: "destructive" });
      } else {
        navigate("/dashboard");
      }
    } else {
      if (!fullName.trim()) {
        setLoading(false);
        toast({ title: "Name required", description: "Please enter your full name.", variant: "destructive" });
        return;
      }
      const { error } = await signUp(email, password, fullName);
      setLoading(false);
      if (error) {
        toast({ title: "Signup failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Check your email", description: "We sent you a verification link. Please verify to continue." });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden px-4">
      {/* Background particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/30 animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${8 + Math.random() * 12}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-gold">
            <span className="font-display text-xl font-bold text-primary-foreground">RC</span>
          </div>
          <span className="font-display text-2xl font-bold text-foreground">
            Resume<span className="text-primary">Cracker</span>
          </span>
        </Link>

        <TiltCard tiltMax={5} glowColor="hsl(43 75% 52% / 0.2)">
        <div className="glass-gold-deep rounded-2xl p-8 border-shine glow-gold">
          <h1 className="font-display text-3xl font-bold text-foreground text-center mb-2">
            {showForgot ? "Reset Password" : isLogin ? "Welcome Back" : "Join ResumeCracker"}
          </h1>
          <p className="font-body text-sm text-muted-foreground text-center mb-8">
            {showForgot
              ? "Enter your email to receive a reset link"
              : isLogin
              ? "Sign in to your career command center"
              : "15,000+ professionals trust ResumeCracker"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && !showForgot && (
              <div className="space-y-2">
                <Label className="font-body text-sm text-foreground">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Priya Sharma"
                    className="pl-10 bg-secondary/50 border-border/50 font-body"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label className="font-body text-sm text-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-10 bg-secondary/50 border-border/50 font-body"
                  required
                />
              </div>
            </div>

            {!showForgot && (
              <div className="space-y-2">
                <Label className="font-body text-sm text-foreground">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 pr-10 bg-secondary/50 border-border/50 font-body"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {isLogin && !showForgot && (
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                className="font-body text-xs text-primary hover:underline block ml-auto"
              >
                Forgot password?
              </button>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-gold text-primary-foreground font-body font-semibold py-5 shadow-gold hover:opacity-90"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {showForgot ? "Send Reset Link" : isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            {showForgot ? (
              <button
                onClick={() => setShowForgot(false)}
                className="font-body text-sm text-muted-foreground hover:text-primary"
              >
                Back to sign in
              </button>
            ) : (
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="font-body text-sm text-muted-foreground hover:text-primary"
              >
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <span className="text-primary font-semibold">{isLogin ? "Sign Up" : "Sign In"}</span>
              </button>
            )}
          </div>
        </div>
        </TiltCard>

        {/* Social proof */}
        <div className="mt-6 flex items-center justify-center gap-6">
          {[
            { icon: Shield, text: "SSL Secured" },
            { icon: Star, text: "4.9/5 Rating" },
            { icon: Zap, text: "Free to Start" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <item.icon className="w-3.5 h-3.5 text-primary" />
              <span className="font-body text-[10px] text-muted-foreground">{item.text}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
