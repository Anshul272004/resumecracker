import HairlineRule from "./HairlineRule";

interface Props {
  title: string;
  edition?: string;
  date?: Date;
  tagline?: string;
  className?: string;
}

const Masthead = ({ title, edition = "Vol. I", date = new Date(), tagline, className = "" }: Props) => {
  const fmt = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <header className={`relative ${className}`}>
      <HairlineRule className="mb-4" />
      <div className="flex items-center justify-between gap-4 text-spec text-champagne/70">
        <span>{edition}</span>
        <span className="hidden md:inline tracking-[0.3em] uppercase">Maison Cracker · Daily Edition</span>
        <span>{fmt}</span>
      </div>
      <div className="mt-6 mb-3">
        <h1 className="text-editorial text-foreground text-center">{title}</h1>
      </div>
      {tagline && (
        <p className="text-eyebrow text-center">{tagline}</p>
      )}
      <HairlineRule className="mt-6" />
    </header>
  );
};

export default Masthead;