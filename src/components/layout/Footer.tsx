import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-background py-16">
    <div className="container mx-auto px-6">
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
          <p className="font-body text-sm text-muted-foreground leading-relaxed">
            Your Career. Reimagined by AI. Transform generic resumes into job-winning profiles.
          </p>
        </div>

        {/* Product */}
        <div>
          <h4 className="font-body text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Product</h4>
          <div className="flex flex-col gap-3">
            <Link to="/dashboard" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">Resume Builder</Link>
            <Link to="/pricing" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">Pricing</Link>
            <Link to="/about" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">How It Works</Link>
          </div>
        </div>

        {/* Resources */}
        <div>
          <h4 className="font-body text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Resources</h4>
          <div className="flex flex-col gap-3">
            <a href="#" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">Blog</a>
            <a href="#" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">ATS Guide</a>
            <a href="#" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">Resume Tips</a>
          </div>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-body text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Legal</h4>
          <div className="flex flex-col gap-3">
            <a href="#" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </div>

      <div className="mt-12 border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-body text-xs text-muted-foreground">
          © 2026 ProfileX. All rights reserved.
        </p>
        <p className="font-body text-xs text-muted-foreground">
          Made with <span className="text-primary">♦</span> for ambitious careers
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
