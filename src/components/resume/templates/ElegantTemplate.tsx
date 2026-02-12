import { Separator } from "@/components/ui/separator";

interface TemplateProps {
  data: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    experience: { role: string; company: string; period: string; bullets: string[] }[];
    projects: { name: string; bullets: string[] }[];
    skills: string[];
    education: string;
  };
  accentColor: string;
  fontSize: number;
  showSummary: boolean;
}

const ElegantTemplate = ({ data, accentColor, fontSize, showSummary }: TemplateProps) => (
  <div className="bg-foreground rounded-2xl p-10 md:p-14 shadow-2xl" style={{ fontSize: `${fontSize}px`, fontFamily: "'Playfair Display', serif" }}>
    {/* Header */}
    <div className="text-center mb-8">
      <h1 className="text-3xl md:text-4xl font-bold tracking-[0.2em] uppercase" style={{ color: accentColor }}>
        {data.name}
      </h1>
      <div className="w-24 h-[1px] mx-auto my-4" style={{ backgroundColor: accentColor }} />
      <p className="text-sm tracking-[0.15em] uppercase text-background/60" style={{ fontFamily: "'Inter', sans-serif" }}>{data.title}</p>
      <div className="flex items-center justify-center gap-4 mt-3 text-xs text-background/50" style={{ fontFamily: "'Inter', sans-serif" }}>
        <span>{data.email}</span>
        <span className="w-1 h-1 rounded-full" style={{ backgroundColor: accentColor }} />
        <span>{data.phone}</span>
        <span className="w-1 h-1 rounded-full" style={{ backgroundColor: accentColor }} />
        <span>{data.location}</span>
      </div>
    </div>

    {/* Summary */}
    {showSummary && (
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-3">
          <div className="flex-1 h-[0.5px]" style={{ backgroundColor: accentColor, opacity: 0.3 }} />
          <span className="text-[10px] tracking-[0.2em] uppercase font-semibold" style={{ color: accentColor }}>Profile</span>
          <div className="flex-1 h-[0.5px]" style={{ backgroundColor: accentColor, opacity: 0.3 }} />
        </div>
        <p className="text-sm text-background/70 leading-relaxed text-center italic" style={{ fontFamily: "'Playfair Display', serif" }}>{data.summary}</p>
      </div>
    )}

    {/* Experience */}
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 h-[0.5px]" style={{ backgroundColor: accentColor, opacity: 0.3 }} />
        <span className="text-[10px] tracking-[0.2em] uppercase font-semibold" style={{ color: accentColor }}>Experience</span>
        <div className="flex-1 h-[0.5px]" style={{ backgroundColor: accentColor, opacity: 0.3 }} />
      </div>
      {data.experience.map((exp, i) => (
        <div key={i} className="mb-5">
          <div className="flex items-baseline justify-between mb-1">
            <h3 className="text-sm font-bold text-background">{exp.role}</h3>
            <span className="text-[10px] text-background/50 italic" style={{ fontFamily: "'Inter', sans-serif" }}>{exp.period}</span>
          </div>
          <p className="text-xs mb-2 italic" style={{ color: accentColor }}>{exp.company}</p>
          <ul className="space-y-1.5">
            {exp.bullets.map((b, j) => (
              <li key={j} className="text-xs text-background/70 flex items-start gap-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: accentColor, opacity: 0.5 }} />
                {b}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    {/* Projects */}
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 h-[0.5px]" style={{ backgroundColor: accentColor, opacity: 0.3 }} />
        <span className="text-[10px] tracking-[0.2em] uppercase font-semibold" style={{ color: accentColor }}>Projects</span>
        <div className="flex-1 h-[0.5px]" style={{ backgroundColor: accentColor, opacity: 0.3 }} />
      </div>
      {data.projects.map((p, i) => (
        <div key={i} className="mb-4">
          <h3 className="text-sm font-bold text-background mb-1.5">{p.name}</h3>
          <ul className="space-y-1.5">
            {p.bullets.map((b, j) => (
              <li key={j} className="text-xs text-background/70 flex items-start gap-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: accentColor, opacity: 0.5 }} />
                {b}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    {/* Skills & Education */}
    <div className="grid grid-cols-2 gap-8">
      <div>
        <div className="flex items-center gap-4 mb-3">
          <div className="flex-1 h-[0.5px]" style={{ backgroundColor: accentColor, opacity: 0.3 }} />
          <span className="text-[10px] tracking-[0.2em] uppercase font-semibold" style={{ color: accentColor }}>Skills</span>
          <div className="flex-1 h-[0.5px]" style={{ backgroundColor: accentColor, opacity: 0.3 }} />
        </div>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((s) => (
            <span key={s} className="text-[10px] px-3 py-1 border rounded-full text-background/70" style={{ borderColor: `${accentColor}40`, fontFamily: "'Inter', sans-serif" }}>{s}</span>
          ))}
        </div>
      </div>
      <div>
        <div className="flex items-center gap-4 mb-3">
          <div className="flex-1 h-[0.5px]" style={{ backgroundColor: accentColor, opacity: 0.3 }} />
          <span className="text-[10px] tracking-[0.2em] uppercase font-semibold" style={{ color: accentColor }}>Education</span>
          <div className="flex-1 h-[0.5px]" style={{ backgroundColor: accentColor, opacity: 0.3 }} />
        </div>
        <p className="text-xs text-background/70" style={{ fontFamily: "'Inter', sans-serif" }}>{data.education}</p>
      </div>
    </div>
  </div>
);

export default ElegantTemplate;
