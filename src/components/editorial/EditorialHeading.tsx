import { ReactNode } from "react";
import HairlineRule from "./HairlineRule";

interface Props {
  eyebrow?: string;
  chapter?: string;
  title: ReactNode;
  align?: "left" | "center";
  className?: string;
  size?: "md" | "lg" | "xl";
}

const EditorialHeading = ({ eyebrow, chapter, title, align = "left", className = "", size = "lg" }: Props) => {
  const titleClass =
    size === "xl" ? "text-editorial" : size === "lg" ? "text-editorial-md" : "font-editorial text-3xl md:text-4xl";
  const alignment = align === "center" ? "text-center items-center" : "text-left items-start";
  return (
    <div className={`relative flex flex-col ${alignment} ${className}`}>
      {(chapter || eyebrow) && (
        <div className={`flex items-center gap-3 mb-5 ${align === "center" ? "justify-center" : ""}`}>
          {chapter && (
            <span className="text-spec text-champagne/80">{chapter}</span>
          )}
          {chapter && eyebrow && <span className="hairline-solid w-10" />}
          {eyebrow && <span className="text-eyebrow">{eyebrow}</span>}
        </div>
      )}
      <h2 className={`${titleClass} text-foreground`}>{title}</h2>
      <HairlineRule
        className={`mt-6 ${align === "center" ? "w-32" : "w-24"}`}
        align={align === "center" ? "center" : "left"}
      />
    </div>
  );
};

export default EditorialHeading;