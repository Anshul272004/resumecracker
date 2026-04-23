interface Props {
  numeral: string;
  className?: string;
}

const ChapterNumber = ({ numeral, className = "" }: Props) => (
  <div
    aria-hidden
    className={`pointer-events-none select-none font-editorial leading-none text-champagne/[0.06] ${className}`}
    style={{ fontSize: "clamp(8rem, 22vw, 22rem)", letterSpacing: "-0.06em" }}
  >
    {numeral}
  </div>
);

export default ChapterNumber;