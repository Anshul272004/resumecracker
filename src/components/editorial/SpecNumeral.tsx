import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface Props {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  unit?: string;
  index?: string;
  decimals?: number;
  className?: string;
}

const SpecNumeral = ({ value, suffix = "", prefix = "", label, unit, index, decimals = 0, className = "" }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const dur = 1600;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(value * eased);
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {index && (
        <div className="text-spec text-champagne/60 mb-3">{index}</div>
      )}
      <div className="flex items-baseline gap-1">
        <span className="font-editorial text-[clamp(3.5rem,8vw,7rem)] leading-none tracking-[-0.05em] text-foreground">
          {prefix}
          {decimals ? n.toFixed(decimals) : Math.round(n)}
          {suffix}
        </span>
        {unit && <span className="text-spec text-champagne/70 mb-2">{unit}</span>}
      </div>
      <div className="hairline mt-4 mb-3" />
      <div className="font-eyebrow text-[0.7rem] tracking-[0.3em] uppercase text-muted-foreground">
        {label}
      </div>
    </div>
  );
};

export default SpecNumeral;