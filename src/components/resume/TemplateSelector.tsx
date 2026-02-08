import { motion } from "framer-motion";
import { Crown, Sparkles, Briefcase, Palette } from "lucide-react";

export type TemplateName = "executive" | "minimal" | "modern" | "creative";

interface TemplateSelectorProps {
  selected: TemplateName;
  onChange: (t: TemplateName) => void;
}

const templates: { id: TemplateName; name: string; subtitle: string; icon: React.ElementType; inspiration: string }[] = [
  { id: "executive", name: "The Executive", subtitle: "Satya Nadella Style", icon: Crown, inspiration: "C-suite authority, clean structure, impactful" },
  { id: "minimal", name: "The Minimalist", subtitle: "Steve Jobs Style", icon: Sparkles, inspiration: "Less is more, whitespace mastery, elegant" },
  { id: "modern", name: "The Modern Pro", subtitle: "Sundar Pichai Style", icon: Briefcase, inspiration: "Tech-forward, structured, data-driven" },
  { id: "creative", name: "The Standout", subtitle: "Bold & Distinctive", icon: Palette, inspiration: "Eye-catching, unique layout, memorable" },
];

const TemplateSelector = ({ selected, onChange }: TemplateSelectorProps) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
    {templates.map((t) => (
      <motion.button
        key={t.id}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onChange(t.id)}
        className={`rounded-xl p-4 text-left transition-all duration-300 ${
          selected === t.id
            ? "glass-gold glow-gold border-primary/40"
            : "glass hover:glass-gold border-transparent"
        }`}
      >
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${
          selected === t.id ? "bg-primary/20" : "bg-secondary"
        }`}>
          <t.icon className={`w-4 h-4 ${selected === t.id ? "text-primary" : "text-muted-foreground"}`} />
        </div>
        <h3 className="font-body text-xs font-bold text-foreground">{t.name}</h3>
        <p className="font-body text-[10px] text-primary font-medium">{t.subtitle}</p>
        <p className="font-body text-[10px] text-muted-foreground mt-1">{t.inspiration}</p>
      </motion.button>
    ))}
  </div>
);

export default TemplateSelector;
