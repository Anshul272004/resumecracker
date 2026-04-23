import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import NotificationCenter from "@/components/NotificationCenter";
import StreakCounter from "@/components/StreakCounter";

const navItems = [
  { label: "Atelier", href: "/resume-builder" },
  { label: "Intelligence", href: "/analysis" },
  { label: "Theatre", href: "/interview-prep" },
  { label: "Editions", href: "/pricing" },
  { label: "Maison", href: "/about" },
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
        scrolled ? "bg-obsidian/80 backdrop-blur-xl border-b border-champagne/15 py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6 gap-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative flex h-9 w-9 items-center justify-center border border-champagne/60">
            <span className="font-editorial text-base text-champagne italic">R</span>
            <span className="absolute -top-0.5 -right-0.5 h-1 w-1 bg-champagne" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-editorial text-[1.05rem] tracking-tight text-foreground">
              Resume<span className="italic text-champagne">Cracker</span>
            </span>
            <span className="text-spec text-[0.55rem] text-champagne/60 mt-0.5">MAISON · EST. 2025</span>
          </div>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) =>
            item.href.startsWith("#") ? (
              <a
                key={item.label}
                href={item.href}
                className="font-eyebrow text-[0.7rem] tracking-[0.28em] uppercase text-muted-foreground transition-colors hover:text-champagne"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                to={item.href}
                className={`font-eyebrow text-[0.7rem] tracking-[0.28em] uppercase transition-colors hover:text-champagne ${
                  isActive(item.href) ? "text-champagne" : "text-muted-foreground"
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
                <Button size="sm" className="bg-champagne text-bone-ink hover:bg-champagne-light font-eyebrow tracking-[0.25em] uppercase text-[0.7rem] rounded-none border border-champagne">
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
                <Button variant="ghost" className="font-eyebrow tracking-[0.25em] uppercase text-[0.7rem] text-muted-foreground hover:text-champagne hover:bg-transparent">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-champagne text-bone-ink hover:bg-champagne-light font-eyebrow tracking-[0.25em] uppercase text-[0.7rem] rounded-none border border-champagne">
                  Enter Maison
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
