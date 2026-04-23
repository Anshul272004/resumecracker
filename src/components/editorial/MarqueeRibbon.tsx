interface Props {
  items: string[];
  className?: string;
  speed?: number;
  variant?: "default" | "bone" | "outline";
}

const MarqueeRibbon = ({ items, className = "", speed = 40, variant = "default" }: Props) => {
  const repeated = [...items, ...items, ...items, ...items];
  const surface =
    variant === "bone"
      ? "surface-bone border-y border-bone-ink/15"
      : variant === "outline"
      ? "border-y border-champagne/20 bg-transparent"
      : "surface-obsidian border-y border-champagne/20";
  return (
    <div className={`relative w-full overflow-hidden py-4 ${surface} ${className}`}>
      <div
        className="flex whitespace-nowrap gap-12"
        style={{ animation: `marquee-x ${speed}s linear infinite` }}
      >
        {repeated.map((it, i) => (
          <span
            key={i}
            className="font-eyebrow text-[0.78rem] tracking-[0.4em] uppercase text-champagne/85 flex items-center gap-12"
          >
            {it}
            <span className="text-champagne/40">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default MarqueeRibbon;