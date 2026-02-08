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

/* Steve Jobs inspired — extreme whitespace, no clutter, typography-driven */
const MinimalTemplate = ({ data, accentColor, fontSize, showSummary }: TemplateProps) => (
  <div className="bg-foreground rounded-2xl p-10 md:p-16 max-w-3xl mx-auto shadow-2xl" style={{ fontSize: `${fontSize}px` }}>
    {/* Header — ultra minimal */}
    <div className="mb-10">
      <h1 className="font-display text-5xl font-bold text-background">{data.name}</h1>
      <div className="flex items-center gap-4 mt-2 font-body text-xs text-background/40">
        <span>{data.email}</span>
        <span>{data.phone}</span>
        <span>{data.location}</span>
      </div>
    </div>

    {showSummary && (
      <p className="font-body text-sm text-background/60 leading-relaxed mb-10 max-w-lg">{data.summary}</p>
    )}

    {/* Experience */}
    <div className="mb-10">
      <h2 className="font-body text-xs text-background/30 uppercase tracking-[0.3em] mb-6">Experience</h2>
      {data.experience.map((exp, i) => (
        <div key={i} className="mb-6">
          <h3 className="font-body text-base font-semibold text-background">{exp.role} <span className="font-normal text-background/40">— {exp.company}</span></h3>
          <p className="font-body text-xs text-background/30 mb-3">{exp.period}</p>
          {exp.bullets.map((b, j) => (
            <p key={j} className="font-body text-xs text-background/65 mb-1.5 pl-4 relative">
              <span className="absolute left-0" style={{ color: accentColor }}>·</span>
              {b}
            </p>
          ))}
        </div>
      ))}
    </div>

    {/* Projects */}
    <div className="mb-10">
      <h2 className="font-body text-xs text-background/30 uppercase tracking-[0.3em] mb-6">Projects</h2>
      {data.projects.map((proj, i) => (
        <div key={i} className="mb-5">
          <h3 className="font-body text-sm font-semibold text-background">{proj.name}</h3>
          {proj.bullets.map((b, j) => (
            <p key={j} className="font-body text-xs text-background/65 mb-1 pl-4 relative">
              <span className="absolute left-0" style={{ color: accentColor }}>·</span>
              {b}
            </p>
          ))}
        </div>
      ))}
    </div>

    {/* Skills — just a line */}
    <div className="mb-10">
      <h2 className="font-body text-xs text-background/30 uppercase tracking-[0.3em] mb-3">Skills</h2>
      <p className="font-body text-xs text-background/60">{data.skills.join(" · ")}</p>
    </div>

    {/* Education */}
    <div>
      <h2 className="font-body text-xs text-background/30 uppercase tracking-[0.3em] mb-3">Education</h2>
      <p className="font-body text-sm text-background/65">{data.education}</p>
    </div>
  </div>
);

export default MinimalTemplate;
