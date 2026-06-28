import { useEffect, useState } from "react";
import { getSiteSettings } from "@/lib/api";

const FALLBACK_PRICING = [
  { program: "Tiny Tots (2–4)", sessions: "3 / week · 25 min", weekly: "₹250", monthly: "₹1,000", quarterly: "₹2,700" },
  { program: "Early Learners (4–6)", sessions: "5 / week · 35 min", weekly: "₹250", monthly: "₹1,000", quarterly: "₹2,700" },
  { program: "Primary Prep (6–8)", sessions: "5 / week · 45 min", weekly: "₹1,500", monthly: "₹6,000", quarterly: "₹16,200" },
  { program: "After-School (8–10)", sessions: "5 / week · 60 min", weekly: "₹2,000", monthly: "₹8,000", quarterly: "₹21,600" },
];

export default function useSiteSettings() {
  const [settings, setSettings] = useState(null);
  useEffect(() => {
    let mounted = true;
    getSiteSettings()
      .then((d) => { if (mounted) setSettings(d); })
      .catch(() => { if (mounted) setSettings({ pricing: FALLBACK_PRICING }); });
    return () => { mounted = false; };
  }, []);
  return settings;
}

export { FALLBACK_PRICING };
