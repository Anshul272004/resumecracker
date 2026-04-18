import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  LayoutDashboard, FileText, Brain, Briefcase, BarChart3, Sparkles, CreditCard, Info, LogIn, Target,
} from "lucide-react";

const items = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", group: "Navigate" },
  { icon: FileText, label: "Resume Builder", path: "/resume-builder", group: "Navigate" },
  { icon: Brain, label: "Interview Prep", path: "/interview-prep", group: "Navigate" },
  { icon: Briefcase, label: "Job Match", path: "/job-match", group: "Navigate" },
  { icon: BarChart3, label: "Career Analysis", path: "/analysis", group: "Navigate" },
  { icon: BarChart3, label: "Latest Results", path: "/results", group: "Navigate" },
  { icon: CreditCard, label: "Pricing", path: "/pricing", group: "Navigate" },
  { icon: Info, label: "About", path: "/about", group: "Navigate" },
  { icon: LogIn, label: "Sign In / Sign Up", path: "/auth", group: "Account" },
  { icon: Sparkles, label: "Optimize My Resume with AI", path: "/dashboard", group: "AI Actions" },
  { icon: Target, label: "Find Matching Jobs", path: "/job-match", group: "AI Actions" },
];

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const groups = Array.from(new Set(items.map((i) => i.group)));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 max-w-xl glass-gold-deep border-shine overflow-hidden">
        <Command className="bg-transparent">
          <CommandInput placeholder="Search pages, AI actions, or jump to..." className="font-body" />
          <CommandList className="max-h-[60vh]">
            <CommandEmpty className="py-6 text-center font-body text-sm text-muted-foreground">
              No matches. Try "resume" or "interview".
            </CommandEmpty>
            {groups.map((g) => (
              <CommandGroup key={g} heading={g}>
                {items.filter((i) => i.group === g).map((i) => (
                  <CommandItem
                    key={i.label}
                    onSelect={() => {
                      navigate(i.path);
                      setOpen(false);
                    }}
                    className="font-body cursor-pointer"
                  >
                    <i.icon className="w-4 h-4 mr-2 text-primary" />
                    {i.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default CommandPalette;
