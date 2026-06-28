import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const KEY = "lga_consent_v1";

export default function ConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY);
      if (!v) setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  const decide = (value) => {
    try {
      localStorage.setItem(
        KEY,
        JSON.stringify({ status: value, at: new Date().toISOString(), v: 1 })
      );
    } catch {
      /* ignore */
    }
    setShow(false);
    // Broadcast for any future analytics gating
    window.dispatchEvent(new CustomEvent("lga:consent", { detail: value }));
  };

  if (!show) return null;

  return (
    <div
      role="region"
      aria-label="Data and cookie consent"
      data-testid="consent-banner"
      className="fixed inset-x-0 bottom-0 z-[55] px-3 sm:px-6 pb-3 sm:pb-6"
    >
      <div className="mx-auto max-w-5xl rounded-[1.5rem] sm:rounded-[2rem] bg-white border-2 border-slate-200 shadow-2xl shadow-slate-900/10 p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex items-start gap-3 flex-1">
            <span className="h-11 w-11 shrink-0 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Cookie className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <div className="text-sm sm:text-[15px] text-slate-700 leading-relaxed">
              <p className="font-bold text-slate-800">We respect your privacy.</p>
              <p className="mt-1">
                We use essential cookies to make Little Gurus work. With your consent, we may also use cookies to remember preferences. We follow India's DPDP Act 2023.{" "}
                <Link to="/privacy-policy" className="font-semibold text-orange-600 hover:text-orange-700 underline underline-offset-2">
                  Read our Privacy Policy
                </Link>.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch gap-2 sm:gap-3 lg:shrink-0">
            <Button
              variant="outline"
              onClick={() => decide("declined")}
              data-testid="consent-decline-btn"
              className="h-11 rounded-full border-2 border-slate-200 hover:border-slate-300 font-bold px-5"
            >
              Decline non-essential
            </Button>
            <Button
              onClick={() => decide("accepted")}
              data-testid="consent-accept-btn"
              className="h-11 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 shadow-md shadow-orange-500/20"
            >
              Accept all
            </Button>
            <button
              onClick={() => decide("declined")}
              aria-label="Close and decline non-essential"
              data-testid="consent-close-btn"
              className="hidden lg:inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
