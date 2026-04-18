import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import NotificationCenter from "@/components/NotificationCenter";
import StreakCounter from "@/components/StreakCounter";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Analysis", href: "/analysis" },
  { label: "Interview Prep", href: "/interview-prep" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => location.pathname === href;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const displayName = profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-gold">
            <span className="font-display text-lg font-bold text-primary-foreground">RC</span>
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            Resume<span className="text-primary">Cracker</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) =>
            item.href.startsWith("#") ? (
              <a
                key={item.label}
                href={item.href}
                className="font-body text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                to={item.href}
                className={`font-body text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.href) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            )
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
                className="hidden xl:flex items-center gap-1.5 glass rounded-md px-2.5 py-1.5 text-[10px] text-muted-foreground hover:text-primary transition-colors"
                title="Open command palette (⌘K)"
              >
                <Command className="w-3 h-3" /> K
              </button>
              <StreakCounter />
              <NotificationCenter />
              <span className="font-body text-sm text-foreground">
                Hey, <span className="text-primary font-semibold">{displayName}</span>
              </span>
              <Link to="/dashboard">
                <Button size="sm" className="bg-gradient-gold font-body font-semibold text-primary-foreground hover:opacity-90">
                  Dashboard
                </Button>
              </Link>
              <button onClick={handleSignOut} className="text-muted-foreground hover:text-primary transition-colors" title="Sign out">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/auth">
                <Button variant="ghost" className="font-body text-sm text-muted-foreground hover:text-primary">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-gradient-gold font-body font-semibold text-primary-foreground hover:opacity-90">
                  Start Free
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="glass mt-2 mx-4 rounded-xl p-6 lg:hidden animate-fade-in">
          <div className="flex flex-col gap-4">
            {navItems.map((item) =>
              item.href.startsWith("#") ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="font-body text-sm text-muted-foreground hover:text-primary"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`font-body text-sm hover:text-primary ${isActive(item.href) ? "text-primary" : "text-muted-foreground"}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              )
            )}
            {user ? (
              <>
                <div className="font-body text-sm text-foreground pt-2 border-t border-border/50">
                  Hey, <span className="text-primary font-semibold">{displayName}</span>
                </div>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full bg-gradient-gold font-body font-semibold text-primary-foreground">Dashboard</Button>
                </Link>
                <Button variant="ghost" onClick={() => { handleSignOut(); setMobileOpen(false); }} className="w-full font-body text-muted-foreground">
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full bg-gradient-gold font-body font-semibold text-primary-foreground">
                    Sign In / Start Free
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
