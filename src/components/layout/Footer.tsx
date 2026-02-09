import { Link } from "react-router-dom";
import { Shield, Lock, Star, Heart } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-background py-16">
    <div className="container mx-auto px-6">
      {/* Trust Badges */}
      <div className="flex flex-wrap items-center justify-center gap-6 mb-12 pb-8 border-b border-border">
        {[
          { icon: Shield, text: "30-Day Money-Back Guarantee" },
          { icon: Lock, text: "No Data Stored — 100% Secure" },
          { icon: Star, text: "4.9/5 from 2,400+ Reviews" },
          { icon: Heart, text: "Risk-Free — See Results First" },
        ].map((t, i) => (
          <div key={i} className="flex items-center gap-2 text-muted-foreground">
            <t.icon className="w-4 h-4 text-primary" />
            <span className="font-body text-xs">{t.text}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-12 md:grid-cols-4">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-gold">
              <span className="font-display text-sm font-bold text-primary-foreground">PX</span>
            </div>
            <span className="font-display text-lg font-bold text-foreground">
              Profile<span className="text-primary">X</span>
            </span>
          </div>
          <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
            Your Career. Reimagined by AI. Transform generic resumes into job-winning profiles.
          </p>
          <p className="font-body text-xs text-primary font-semibold">
            Trusted by 15,000+ professionals
          </p>
        </div>

        {/* Product */}
        <div>
          <h4 className="font-body text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Product</h4>
          <div className="flex flex-col gap-3">
            <Link to="/dashboard" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">Resume Builder</Link>
            <Link to="/results" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">ATS Scanner</Link>
            <Link to="/interview-prep" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">Interview Prep</Link>
            <Link to="/resume-builder" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">Templates</Link>
            <Link to="/pricing" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">Pricing</Link>
          </div>
        </div>

        {/* Resources */}
        <div>
          <h4 className="font-body text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Resources</h4>
          <div className="flex flex-col gap-3">
            <Link to="/about" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">How It Works</Link>
            <a href="#" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">ATS Guide</a>
            <a href="#" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">Resume Tips Blog</a>
            <a href="#" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">Interview Guides</a>
            <a href="#" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">Career Hacks Newsletter</a>
          </div>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-body text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Legal & Trust</h4>
          <div className="flex flex-col gap-3">
            <a href="#" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">Refund Policy</a>
            <a href="#" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">Contact Support</a>
            <a href="#" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">Data Security</a>
          </div>
        </div>
      </div>

      <div className="mt-12 border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-body text-xs text-muted-foreground">
          © 2026 ProfileX. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <p className="font-body text-xs text-muted-foreground">
            🔒 SSL Encrypted · 📜 GDPR Compliant · ⭐ 4.9/5 Rating
          </p>
        </div>
        <p className="font-body text-xs text-muted-foreground">
          Made with <span className="text-primary">♦</span> for ambitious careers
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
