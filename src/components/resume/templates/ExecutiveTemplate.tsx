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

const ExecutiveTemplate = ({ data, accentColor, fontSize, showSummary }: TemplateProps) => (
  <div className="bg-foreground rounded-2xl p-8 md:p-12 max-w-3xl mx-auto shadow-2xl" style={{ fontSize: `${fontSize}px` }}>
    {/* Header - Satya Nadella inspired: bold name, minimal details */}
    <div className="text-center pb-6 mb-6" style={{ borderBottom: `3px solid ${accentColor}` }}>
      <h1 className="font-display text-4xl font-bold text-background tracking-tight">{data.name}</h1>
      <p className="font-body text-sm text-background/60 mt-1 uppercase tracking-[0.3em]">{data.title}</p>
      <div className="flex justify-center gap-6 mt-3 font-body text-xs text-background/50">
        <span>{data.email}</span>
        <span>•</span>
        <span>{data.phone}</span>
        <span>•</span>
        <span>{data.location}</span>
      </div>
    </div>

    {/* Summary */}
    {showSummary && (
      <div className="mb-6">
        <p className="font-body text-sm text-background/75 leading-relaxed text-center italic">{data.summary}</p>
      </div>
    )}

    {/* Experience */}
    <div className="mb-6">
      <h2 className="font-body text-[10px] font-bold uppercase tracking-[0.25em] mb-4" style={{ color: accentColor }}>
        Professional Experience
      </h2>
      {data.experience.map((exp, i) => (
        <div key={i} className="mb-4">
          <div className="flex justify-between items-baseline">
            <h3 className="font-body font-bold text-background">{exp.role}</h3>
            <span className="font-body text-xs text-background/40">{exp.period}</span>
          </div>
          <p className="font-body text-xs text-background/50 mb-2">{exp.company}</p>
          <ul className="space-y-1.5">
            {exp.bullets.map((b, j) => (
              <li key={j} className="font-body text-xs text-background/70 flex gap-2">
                <span style={{ color: accentColor }} className="mt-0.5">■</span> {b}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    {/* Projects */}
    <div className="mb-6">
      <h2 className="font-body text-[10px] font-bold uppercase tracking-[0.25em] mb-3" style={{ color: accentColor }}>
        Key Projects
      </h2>
      <div className="space-y-4">
        {data.projects.map((proj, i) => (
          <div key={i}>
            <h3 className="font-body font-bold text-background">{proj.name}</h3>
            <ul className="space-y-1 mt-1">
              {proj.bullets.map((b, j) => (
                <li key={j} className="font-body text-xs text-background/70 flex gap-2">
                  <span style={{ color: accentColor }} className="mt-0.5">■</span> {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>

    {/* Skills */}
    <div className="mb-6">
      <h2 className="font-body text-[10px] font-bold uppercase tracking-[0.25em] mb-2" style={{ color: accentColor }}>
        Core Competencies
      </h2>
      <div className="flex flex-wrap gap-2">
        {data.skills.map((s) => (
          <span key={s} className="font-body text-xs px-3 py-1 rounded-sm text-background/70" style={{ border: `1px solid ${accentColor}40` }}>{s}</span>
        ))}
      </div>
    </div>

    {/* Education */}
    <div>
      <h2 className="font-body text-[10px] font-bold uppercase tracking-[0.25em] mb-2" style={{ color: accentColor }}>Education</h2>
      <p className="font-body text-sm text-background/75">{data.education}</p>
    </div>
  </div>
);

export default ExecutiveTemplate;
