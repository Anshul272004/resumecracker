import { useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { CheckCircle2, Tag, CreditCard, Shield, ArrowLeft, Crown, Zap, Gift, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";

const planDetails: Record<string, { name: string; price: number; icon: any; features: string[] }> = {
  starter: { name: "Starter", price: 299, icon: Zap, features: ["ATS-Optimized Resume", "Clean PDF Download", "Keyword Analysis", "Full ATS Report"] },
  pro: { name: "Pro", price: 499, icon: Crown, features: ["Everything in Starter", "AI Cover Letter", "Interview Prep (25+ Qs)", "Psychology Insights", "PDF + DOCX"] },
  elite: { name: "Elite", price: 199, icon: Award, features: ["Everything in Pro", "Unlimited Edits", "LinkedIn Optimization", "Priority Support"] },
  lifetime: { name: "Lifetime", price: 1499, icon: Gift, features: ["Everything in Elite — Forever", "No monthly payments", "Lifetime updates", "Priority support forever"] },
};

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const planKey = searchParams.get("plan") || "pro";
  const plan = planDetails[planKey] || planDetails.pro;
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "STUDENT30") {
      setDiscount(0.3);
      setCouponApplied(true);
      toast({ title: "🎓 Student discount applied!", description: "30% off your order." });
    } else {
      toast({ title: "Invalid coupon", variant: "destructive" });
    }
  };

  const finalPrice = Math.round(plan.price * (1 - discount));

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-6 pt-28 flex items-center justify-center">
          <div className="glass-gold-deep rounded-2xl p-8 max-w-md w-full text-center border-shine">
            <Crown className="w-12 h-12 text-primary mx-auto mb-4" />
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">Login Required</h1>
            <p className="font-body text-sm text-muted-foreground mb-6">Please sign in to complete your purchase.</p>
            <Link to="/auth">
              <Button className="bg-gradient-gold text-primary-foreground font-body font-semibold">Sign In to Continue</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 pt-28 pb-16 max-w-4xl">
        <Link to="/pricing" className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-primary mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Pricing
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="glass-gold-deep rounded-2xl p-8 border-shine">
            <div className="flex items-center gap-3 mb-6">
              <plan.icon className="w-8 h-8 text-primary" />
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground">{plan.name} Plan</h2>
                <p className="font-body text-xs text-muted-foreground">One-time payment</p>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span className="font-body text-sm text-foreground">{f}</span>
                </li>
              ))}
            </ul>

            <div className="border-t border-border/50 pt-4 space-y-2">
              <div className="flex justify-between font-body text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">₹{plan.price}</span>
              </div>
              {couponApplied && (
                <div className="flex justify-between font-body text-sm">
                  <span className="text-primary">Student Discount (30%)</span>
                  <span className="text-primary">-₹{Math.round(plan.price * discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-body text-lg font-bold pt-2 border-t border-border/50">
                <span className="text-foreground">Total</span>
                <span className="text-primary text-shadow-gold">₹{finalPrice}</span>
              </div>
            </div>
          </motion.div>

          {/* Payment Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl p-8">
            <h3 className="font-display text-xl font-bold text-foreground mb-6">Complete Purchase</h3>

            {/* Coupon */}
            <div className="mb-6">
              <label className="font-body text-sm text-muted-foreground mb-2 block">Coupon Code</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="STUDENT30"
                    className="pl-10 bg-secondary/50 border-border/50 font-body"
                    disabled={couponApplied}
                  />
                </div>
                <Button onClick={applyCoupon} variant="outline" disabled={couponApplied} className="font-body">
                  {couponApplied ? "Applied ✓" : "Apply"}
                </Button>
              </div>
            </div>

            {/* Pay Button */}
            <Button
              onClick={() => toast({ title: "Coming Soon", description: "Payment processing will be available shortly. We're integrating Stripe for secure payments." })}
              className="w-full bg-gradient-gold text-primary-foreground font-body font-semibold py-6 text-base shadow-gold animate-pulse-gold"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Pay ₹{finalPrice}
            </Button>

            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-primary" />
                <span className="font-body text-[10px] text-muted-foreground">SSL Secured</span>
              </div>
              <span className="font-body text-[10px] text-muted-foreground">•</span>
              <span className="font-body text-[10px] text-muted-foreground">30-day money back</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
