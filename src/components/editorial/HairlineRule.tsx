import { motion } from "framer-motion";

interface Props {
  className?: string;
  draw?: boolean;
  align?: "left" | "center" | "right";
}

const HairlineRule = ({ className = "", draw = true, align = "center" }: Props) => {
  const origin = align === "left" ? "origin-left" : align === "right" ? "origin-right" : "origin-center";
  return (
    <motion.div
      initial={draw ? { scaleX: 0 } : false}
      whileInView={draw ? { scaleX: 1 } : undefined}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      className={`hairline ${origin} ${className}`}
    />
  );
};

export default HairlineRule;