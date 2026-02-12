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

const BoldTemplate = ({ data, accentColor, fontSize, showSummary }: TemplateProps) => (
  <div className="bg-foreground rounded-2xl overflow-hidden shadow-2xl" style={{ fontSize: `${fontSize}px`, fontFamily: "'Inter', sans-serif" }}>
    {/* Bold Header Block */}
    <div className="p-8 md:p-10" style={{ backgroundColor: accentColor }}>
      <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight" style={{ color: 'hsl(0 0% 4%)' }}>
        {data.name}
      </h1>
      <p className="text-lg font-bold mt-1 uppercase tracking-wider" style={{ color: 'hsl(0 0% 4% / 0.7)' }}>{data.title}</p>
      <div className="flex flex-wrap gap-4 mt-4 text-xs font-medium" style={{ color: 'hsl(0 0% 4% / 0.6)' }}>
        <span>{data.email}</span>
        <span>|</span>
        <span>{data.phone}</span>
        <span>|</span>
        <span>{data.location}</span>
      </div>
    </div>

    <div className="p-8 md:p-10">
      {/* Summary */}
      {showSummary && (
        <div className="mb-8">
          <p className="text-sm text-background/70 leading-relaxed border-l-4 pl-4" style={{ borderColor: accentColor }}>{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      <div className="mb-8">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-4 pb-2 border-b-2" style={{ color: accentColor, borderColor: accentColor }}>
          Experience
        </h2>
        {data.experience.map((exp, i) => (
          <div key={i} className="mb-5">
            <div className="flex items-baseline justify-between">
              <h3 className="text-base font-bold text-background">{exp.role}</h3>
              <span className="text-[10px] font-medium text-background/40">{exp.period}</span>
            </div>
            <p className="text-xs font-semibold mb-2" style={{ color: accentColor }}>{exp.company}</p>
            <ul className="space-y-1.5">
              {exp.bullets.map((b, j) => (
                <li key={j} className="text-xs text-background/70 flex items-start gap-2">
                  <span className="font-bold mt-0.5" style={{ color: accentColor }}>▸</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Projects */}
      <div className="mb-8">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-4 pb-2 border-b-2" style={{ color: accentColor, borderColor: accentColor }}>
          Key Projects
        </h2>
        {data.projects.map((p, i) => (
          <div key={i} className="mb-4">
            <h3 className="text-sm font-bold text-background mb-1">{p.name}</h3>
            <ul className="space-y-1">
              {p.bullets.map((b, j) => (
                <li key={j} className="text-xs text-background/70 flex items-start gap-2">
                  <span className="font-bold mt-0.5" style={{ color: accentColor }}>▸</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div className="mb-6">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-3 pb-2 border-b-2" style={{ color: accentColor, borderColor: accentColor }}>
          Technical Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((s) => (
            <span key={s} className="text-[10px] font-bold px-3 py-1.5 rounded" style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>{s}</span>
          ))}
        </div>
      </div>

      {/* Education */}
      <div>
        <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-2 pb-2 border-b-2" style={{ color: accentColor, borderColor: accentColor }}>
          Education
        </h2>
        <p className="text-xs text-background/70">{data.education}</p>
      </div>
    </div>
  </div>
);

export default BoldTemplate;
