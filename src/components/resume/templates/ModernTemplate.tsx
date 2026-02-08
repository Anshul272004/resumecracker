interface ResumeData {
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
}

interface TemplateProps {
  data: ResumeData;
  accentColor: string;
  fontSize: number;
  showSummary: boolean;
}

/* Sundar Pichai inspired — structured, tech-forward, two-column feel */
const ModernTemplate = ({ data, accentColor, fontSize, showSummary }: TemplateProps) => (
  <div className="bg-foreground rounded-2xl max-w-3xl mx-auto shadow-2xl overflow-hidden" style={{ fontSize: `${fontSize}px` }}>
    {/* Top bar */}
    <div className="p-8 md:p-10" style={{ background: `linear-gradient(135deg, hsl(0 0% 8%), hsl(0 0% 12%))` }}>
      <h1 className="font-display text-3xl font-bold" style={{ color: accentColor }}>{data.name}</h1>
      <p className="font-body text-sm text-background/70 mt-0.5">{data.title}</p>
      <div className="flex flex-wrap gap-4 mt-3">
        {[data.email, data.phone, data.location].map((info) => (
          <span key={info} className="font-body text-xs px-3 py-1 rounded-full bg-background/10 text-background/60">{info}</span>
        ))}
      </div>
    </div>

    <div className="p-8 md:p-10">
      {showSummary && (
        <div className="mb-6 pl-4" style={{ borderLeft: `3px solid ${accentColor}` }}>
          <p className="font-body text-sm text-background/75 leading-relaxed">{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      <div className="mb-6">
        <h2 className="font-body text-xs font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: accentColor }} />
          <span className="text-background/80">Experience</span>
        </h2>
        {data.experience.map((exp, i) => (
          <div key={i} className="mb-4 p-4 rounded-lg bg-background/5">
            <div className="flex justify-between items-baseline">
              <h3 className="font-body text-sm font-bold text-background">{exp.role}</h3>
              <span className="font-body text-[10px] px-2 py-0.5 rounded-full text-background/50" style={{ backgroundColor: `${accentColor}15` }}>{exp.period}</span>
            </div>
            <p className="font-body text-xs text-background/40 mb-2">{exp.company}</p>
            <ul className="space-y-1.5">
              {exp.bullets.map((b, j) => (
                <li key={j} className="font-body text-xs text-background/70 flex gap-2">
                  <span style={{ color: accentColor }}>▹</span> {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Projects */}
      <div className="mb-6">
        <h2 className="font-body text-xs font-bold uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: accentColor }} />
          <span className="text-background/80">Projects</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-3">
          {data.projects.map((proj, i) => (
            <div key={i} className="p-4 rounded-lg bg-background/5">
              <h3 className="font-body text-sm font-bold text-background mb-2">{proj.name}</h3>
              {proj.bullets.map((b, j) => (
                <p key={j} className="font-body text-[11px] text-background/65 mb-1 flex gap-1.5">
                  <span style={{ color: accentColor }}>▹</span> {b}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="mb-6">
        <h2 className="font-body text-xs font-bold uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: accentColor }} />
          <span className="text-background/80">Skills</span>
        </h2>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((s) => (
            <span key={s} className="font-body text-xs px-3 py-1.5 rounded-lg text-background/80 font-medium" style={{ backgroundColor: `${accentColor}15`, border: `1px solid ${accentColor}30` }}>{s}</span>
          ))}
        </div>
      </div>

      {/* Education */}
      <div>
        <h2 className="font-body text-xs font-bold uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: accentColor }} />
          <span className="text-background/80">Education</span>
        </h2>
        <p className="font-body text-sm text-background/70">{data.education}</p>
      </div>
    </div>
  </div>
);

export default ModernTemplate;
