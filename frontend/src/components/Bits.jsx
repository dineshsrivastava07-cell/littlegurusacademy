// Small shared bits: animated section title, decorative blob, etc.
import { motion } from "framer-motion";

export function SectionLabel({ children }) {
  return (
    <span className="inline-block text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
      {children}
    </span>
  );
}

export function FadeIn({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.6, 0.35, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Blob({ className = "" }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute rounded-full blur-3xl ${className}`} />
  );
}
