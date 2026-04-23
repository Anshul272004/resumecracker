import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  size?: number;
  color?: string;
}

const CornerBrackets = ({ children, className = "", size = 14, color = "hsl(var(--champagne) / 0.7)" }: Props) => {
  const s = `${size}px`;
  const stroke = "1px";
  const corner = (pos: string): React.CSSProperties => {
    const base: React.CSSProperties = { position: "absolute", width: s, height: s };
    const borders: React.CSSProperties = {};
    if (pos.includes("t")) borders.borderTop = `${stroke} solid ${color}`;
    if (pos.includes("b")) borders.borderBottom = `${stroke} solid ${color}`;
    if (pos.includes("l")) borders.borderLeft = `${stroke} solid ${color}`;
    if (pos.includes("r")) borders.borderRight = `${stroke} solid ${color}`;
    if (pos === "tl") return { ...base, top: 0, left: 0, ...borders };
    if (pos === "tr") return { ...base, top: 0, right: 0, ...borders };
    if (pos === "bl") return { ...base, bottom: 0, left: 0, ...borders };
    return { ...base, bottom: 0, right: 0, ...borders };
  };
  return (
    <div className={`relative group ${className}`}>
      <span style={corner("tl")} className="transition-all duration-500 group-hover:scale-110" />
      <span style={corner("tr")} className="transition-all duration-500 group-hover:scale-110" />
      <span style={corner("bl")} className="transition-all duration-500 group-hover:scale-110" />
      <span style={corner("br")} className="transition-all duration-500 group-hover:scale-110" />
      {children}
    </div>
  );
};

export default CornerBrackets;