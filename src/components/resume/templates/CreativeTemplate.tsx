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

/* Bold & distinctive — asymmetric layout, strong accent, memorable */
const CreativeTemplate = ({ data, accentColor, fontSize, showSummary }: TemplateProps) => (
  <div className="bg-foreground rounded-2xl max-w-3xl mx-auto shadow-2xl overflow-hidden" style={{ fontSize: `${fontSize}px` }}>
    <div className="grid md:grid-cols-[220px_1fr]">
      {/* Sidebar */}
      <div className="p-6 md:p-8" style={{ backgroundColor: `${accentColor}` }}>
        <div className="w-16 h-16 rounded-full bg-background/20 flex items-center justify-center mb-4">
          <span className="font-display text-2xl font-bold text-background">{data.name[0]}</span>
        </div>
        <h1 className="font-display text-xl font-bold text-background">{data.name}</h1>
        <p className="font-body text-xs text-background/70 mt-0.5 mb-6">{data.title}</p>

        <div className="space-y-3 font-body text-[11px] text-background/70">
          <p>{data.email}</p>
          <p>{data.phone}</p>
          <p>{data.location}</p>
        </div>

        {/* Skills in sidebar */}
        <div className="mt-8">
          <h2 className="font-body text-[10px] font-bold uppercase tracking-wider text-background/90 mb-3">Skills</h2>
          <div className="space-y-2">
            {data.skills.map((s) => (
              <div key={s}>
                <span className="font-body text-[11px] text-background/80">{s}</span>
                <div className="h-1.5 bg-background/20 rounded-full mt-1">
                  <div className="h-full bg-background/60 rounded-full" style={{ width: `${70 + Math.random() * 30}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education in sidebar */}
        <div className="mt-8">
          <h2 className="font-body text-[10px] font-bold uppercase tracking-wider text-background/90 mb-2">Education</h2>
          <p className="font-body text-[11px] text-background/70">{data.education}</p>
        </div>
      </div>

      {/* Main content */}
      <div className="p-6 md:p-8">
        {showSummary && (
          <div className="mb-6">
            <h2 className="font-body text-[10px] font-bold uppercase tracking-wider text-background/40 mb-2">About</h2>
            <p className="font-body text-xs text-background/70 leading-relaxed">{data.summary}</p>
          </div>
        )}

        {/* Experience */}
        <div className="mb-6">
          <h2 className="font-body text-[10px] font-bold uppercase tracking-wider text-background/40 mb-4">Experience</h2>
          {data.experience.map((exp, i) => (
            <div key={i} className="mb-5 relative pl-4" style={{ borderLeft: `2px solid ${accentColor}` }}>
              <h3 className="font-body text-sm font-bold text-background">{exp.role}</h3>
              <p className="font-body text-[11px] text-background/40">{exp.company} • {exp.period}</p>
              <ul className="mt-2 space-y-1">
                {exp.bullets.map((b, j) => (
                  <li key={j} className="font-body text-[11px] text-background/65">{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Projects */}
        <div>
          <h2 className="font-body text-[10px] font-bold uppercase tracking-wider text-background/40 mb-4">Projects</h2>
          {data.projects.map((proj, i) => (
            <div key={i} className="mb-4 pl-4" style={{ borderLeft: `2px solid ${accentColor}` }}>
              <h3 className="font-body text-sm font-bold text-background">{proj.name}</h3>
              <ul className="mt-1 space-y-1">
                {proj.bullets.map((b, j) => (
                  <li key={j} className="font-body text-[11px] text-background/65">{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default CreativeTemplate;
