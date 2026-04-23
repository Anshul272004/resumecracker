import { Link } from "react-router-dom";

const cols = [
  {
    head: "Atelier",
    items: [
      { l: "Resume Builder", to: "/resume-builder" },
      { l: "Templates", to: "/resume-builder" },
      { l: "ATS Scanner", to: "/results" },
      { l: "Cover Letter", to: "/dashboard" },
    ],
  },
  {
    head: "Intelligence",
    items: [
      { l: "Career Analysis", to: "/analysis" },
      { l: "Interview Prep", to: "/interview-prep" },
      { l: "Job Match", to: "/job-match" },
      { l: "Dashboard", to: "/dashboard" },
    ],
  },
  {
    head: "Maison",
    items: [
      { l: "About", to: "/about" },
      { l: "Editions", to: "/pricing" },
      { l: "Contact", to: "/about" },
      { l: "Press", to: "/about" },
    ],
  },
  {
    head: "Legal",
    items: [
      { l: "Privacy", to: "/about" },
      { l: "Terms", to: "/about" },
      { l: "Refund", to: "/about" },
      { l: "Security", to: "/about" },
    ],
  },
];

const Footer = () => (
  <footer className="surface-obsidian border-t border-champagne/15 pt-20 pb-10 grain-overlay relative">
    <div className="container mx-auto px-6 relative">
      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <div className="flex items-baseline gap-3">
            <span className="font-editorial text-5xl text-foreground">Maison</span>
            <span className="font-editorial text-5xl italic text-champagne">Cracker</span>
          </div>
          <p className="text-spec text-champagne/60 mt-3">EST. MMXXV · ÉDITION I</p>
          <p className="font-body text-sm text-muted-foreground max-w-sm mt-6 leading-relaxed">
            An atelier of career intelligence. Crafting résumés the way couture houses craft their seasons — by hand, with patience, and an obsession for the next call.
          </p>
          <div className="hairline mt-8 mb-6 max-w-md" />
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-spec text-champagne/60">
            <span>30-DAY GUARANTEE</span>
            <span>·</span>
            <span>NO DATA STORED</span>
            <span>·</span>
            <span>4.9 / 5</span>
          </div>
        </div>

        <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-8">
          {cols.map((c) => (
            <div key={c.head}>
              <div className="text-eyebrow mb-5">{c.head}</div>
              <div className="hairline-solid w-8 mb-5" />
              <div className="flex flex-col gap-3">
                {c.items.map((it) => (
                  <Link
                    key={it.l}
                    to={it.to}
                    className="font-body text-sm text-muted-foreground hover:text-champagne transition-colors"
                  >
                    {it.l}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 hairline" />
      <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-spec text-champagne/55">© MMXXV · MAISON CRACKER · ALL RIGHTS RESERVED</p>
        <p className="text-spec text-champagne/55">CRAFTED WITH ◆ FOR AMBITIOUS CAREERS</p>
      </div>
    </div>
  </footer>
);

export default Footer;
