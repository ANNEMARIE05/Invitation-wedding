import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const EASE_VIEW = [0.22, 1, 0.36, 1];

/** Cadre carte — double filet argent / framboise, forme asymétrique */
export default function LuxeCard({
  children,
  className = "",
  dark = false,
  lift = false,
  noInset = false,
  animate = true,
  as: Tag = "div",
  ...rest
}) {
  const shell = `luxe-card ${dark ? "luxe-card--dark" : "luxe-card--light"} ${lift ? "luxe-card--lift" : ""} ${noInset ? "luxe-card--no-inset" : ""} ${className}`;

  if (Tag === "div" && animate) {
    return (
      <motion.div
        className={shell}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.85, ease: EASE_VIEW }}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <Tag className={shell} {...rest}>
      {children}
    </Tag>
  );
}

export function BtnRejoindre({ href, onUnavailable, className = "", testId = "zoom-join-button", label = "Rejoindre" }) {
  const ready = Boolean(href);
  return (
    <motion.a
      href={href || "#lieux"}
      target={ready ? "_blank" : undefined}
      rel={ready ? "noopener noreferrer" : undefined}
      data-testid={testId}
      onClick={(e) => {
        if (!ready) {
          e.preventDefault();
          onUnavailable?.();
        }
      }}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`btn-rejoindre ${className}`}
    >
      <span className="relative z-[1]">{label}</span>
      <ArrowUpRight size={17} strokeWidth={2} className="btn-rejoindre-icon relative z-[1]" aria-hidden />
    </motion.a>
  );
}
