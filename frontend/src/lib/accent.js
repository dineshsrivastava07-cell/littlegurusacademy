// Pre-mapped color classes to keep Tailwind purge happy.
export const ACCENT = {
  orange: {
    bg: "bg-orange-100",
    text: "text-orange-600",
    border: "border-orange-200",
    soft: "bg-orange-50",
    chip: "bg-orange-500 text-white",
  },
  sky: {
    bg: "bg-sky-100",
    text: "text-sky-600",
    border: "border-sky-200",
    soft: "bg-sky-50",
    chip: "bg-sky-500 text-white",
  },
  emerald: {
    bg: "bg-emerald-100",
    text: "text-emerald-600",
    border: "border-emerald-200",
    soft: "bg-emerald-50",
    chip: "bg-emerald-500 text-white",
  },
  rose: {
    bg: "bg-rose-100",
    text: "text-rose-600",
    border: "border-rose-200",
    soft: "bg-rose-50",
    chip: "bg-rose-500 text-white",
  },
  amber: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
    soft: "bg-amber-50",
    chip: "bg-amber-500 text-white",
  },
};

export function getAccent(name) {
  return ACCENT[name] || ACCENT.orange;
}
