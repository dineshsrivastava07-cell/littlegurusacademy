import { Link } from "react-router-dom";
import { useState } from "react";
import { Instagram, Youtube, Mail, Clock, ArrowRight, ShieldCheck, MapPin, Sparkles } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { subscribeNewsletter } from "@/lib/api";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubscribe = async (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email.");
      return;
    }
    setLoading(true);
    try {
      await subscribeNewsletter(email);
      toast.success("You're in! Watch for warm updates from the Gurus.");
      setEmail("");
    } catch {
      toast.error("Hmm, that didn't go through. Try again in a moment?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-200 mt-16" data-testid="site-footer">
      {/* Top CTA band */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-14 sm:py-20">
          <div className="relative rounded-[2rem] bg-gradient-to-br from-orange-400 to-orange-500 px-8 sm:px-12 py-12 sm:py-16 overflow-hidden">
            <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-amber-300/30 blur-2xl" />
            <div className="absolute -left-8 -bottom-12 h-44 w-44 rounded-full bg-rose-300/30 blur-2xl" />
            <div className="relative grid lg:grid-cols-2 gap-6 items-center">
              <div>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight text-balance">
                  Give your child a head start —<br/>book a free tour today.
                </h2>
                <p className="mt-4 text-white/90 text-lg max-w-xl">
                  Meet a guru, watch a real class, and ask us anything. No pressure, just warm conversation.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
                <Link to="/admissions" data-testid="footer-book-tour">
                  <Button className="h-14 px-8 rounded-full bg-white text-orange-600 hover:bg-amber-50 font-bold text-base shadow-lg w-full sm:w-auto">
                    Book a Free Tour
                  </Button>
                </Link>
                <Link to="/admissions#enquiry" data-testid="footer-enroll">
                  <Button className="h-14 px-8 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-base w-full sm:w-auto">
                    Enroll Now <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Little Gurus Academy"
                className="h-12 w-auto object-contain"
                width="48"
                height="48"
              />
              <span className="font-display text-2xl font-semibold text-white">
                Little <span className="text-orange-400">Gurus</span>
              </span>
            </Link>
            <p className="mt-4 text-slate-400 text-sm leading-relaxed">
              {SITE.tagline}. Live online preschool & after-school tutoring for ages 2–10.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a href={SITE.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" data-testid="footer-instagram"
                 className="h-10 w-10 inline-flex items-center justify-center rounded-full bg-slate-800 hover:bg-orange-500 transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href={SITE.youtube} target="_blank" rel="noreferrer" aria-label="YouTube" data-testid="footer-youtube"
                 className="h-10 w-10 inline-flex items-center justify-center rounded-full bg-slate-800 hover:bg-orange-500 transition-colors">
                <Youtube className="h-4 w-4" />
              </a>
              <a href={`mailto:${SITE.email}`} aria-label="Email" data-testid="footer-email-link"
                 className="h-10 w-10 inline-flex items-center justify-center rounded-full bg-slate-800 hover:bg-orange-500 transition-colors">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display text-base font-semibold text-white">Explore</h4>
            <ul className="mt-4 space-y-2">
              {NAV_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-slate-400 hover:text-orange-300 transition-colors" data-testid={`footer-link-${l.label.toLowerCase()}`}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-base font-semibold text-white">Reach Us</h4>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-orange-400" />
                <a href={`mailto:${SITE.email}`} className="hover:text-orange-300 break-all">{SITE.email}</a>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 text-orange-400" />
                <span>{SITE.hours}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-orange-400" />
                <span>{SITE.address}</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 mt-0.5 text-orange-400" />
                <span>{SITE.mode}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-base font-semibold text-white">Stay in the loop</h4>
            <p className="mt-3 text-sm text-slate-400">Tiny tips, free worksheets and class updates — once a month, never spammy.</p>
            <form onSubmit={onSubscribe} className="mt-4 flex flex-col gap-2" data-testid="newsletter-form">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-full bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 px-5"
                data-testid="newsletter-email-input"
                aria-label="Email for newsletter"
              />
              <Button
                type="submit"
                disabled={loading}
                className="h-12 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold"
                data-testid="newsletter-submit-btn"
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {SITE.name}. Made with love for little learners in India.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link to="/privacy-policy" className="hover:text-orange-300 font-semibold" data-testid="footer-privacy-link">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-orange-300 font-semibold" data-testid="footer-terms-link">Terms of Use</Link>
            <Link to="/privacy-policy#grievance" className="hover:text-orange-300 font-semibold" data-testid="footer-grievance-link">Grievance</Link>
            <Link to="/learn" className="hover:text-orange-300 font-semibold" data-testid="footer-learn-link">Free Lessons</Link>
            <Link to="/admin" className="hover:text-orange-300 font-semibold opacity-50 hover:opacity-100" data-testid="footer-admin-link">Admin</Link>
            <span
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-3 py-1 font-bold tracking-wide"
              data-testid="footer-dpdp-badge"
              title="Compliant with India's DPDP Act, 2023"
            >
              <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.5} />
              DPDP Compliant
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
