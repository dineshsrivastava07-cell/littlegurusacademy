import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Sparkles } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/data";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header
      data-testid="site-navbar"
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/85 backdrop-blur-xl border-b border-slate-200/70 shadow-sm"
          : "bg-amber-50/70 backdrop-blur-md border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group" data-testid="nav-logo">
          <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-sm group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <span className="font-display text-xl sm:text-2xl font-semibold text-slate-800 leading-none">
            Little <span className="text-orange-500">Gurus</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              data-testid={`nav-link-${l.label.toLowerCase()}`}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-[15px] font-semibold transition-colors ${
                  isActive
                    ? "bg-orange-100 text-orange-600"
                    : "text-slate-700 hover:bg-slate-100"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link to="/admissions" data-testid="nav-book-tour-btn">
            <Button
              variant="outline"
              className="rounded-full border-2 border-slate-200 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50 font-semibold px-5"
            >
              Book a Tour
            </Button>
          </Link>
          <Link to="/admissions#enquiry" data-testid="nav-enroll-btn">
            <Button className="rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 hover:scale-105 transition-all">
              Enroll Now
            </Button>
          </Link>
        </div>

        {/* Mobile button */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden inline-flex items-center justify-center h-11 w-11 rounded-2xl bg-white border-2 border-slate-100 text-slate-700"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          data-testid="nav-mobile-toggle"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          className="lg:hidden fixed inset-x-0 top-20 h-[calc(100vh-5rem)] bg-amber-50/98 backdrop-blur-xl overflow-y-auto"
          data-testid="nav-mobile-menu"
        >
          <div className="px-6 py-8 flex flex-col gap-2">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setOpen(false)}
                data-testid={`nav-mobile-link-${l.label.toLowerCase()}`}
                className={({ isActive }) =>
                  `px-5 py-4 rounded-2xl text-lg font-semibold transition-colors ${
                    isActive
                      ? "bg-orange-100 text-orange-600"
                      : "text-slate-700 bg-white border-2 border-slate-100"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="mt-4 flex flex-col gap-3">
              <Link to="/admissions" onClick={() => setOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full h-14 rounded-2xl border-2 border-slate-200 text-base font-bold"
                  data-testid="nav-mobile-book-tour"
                >
                  Book a Free Tour
                </Button>
              </Link>
              <Link to="/admissions#enquiry" onClick={() => setOpen(false)}>
                <Button
                  className="w-full h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-base font-bold shadow-md"
                  data-testid="nav-mobile-enroll"
                >
                  Enroll Now
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-slate-500 text-center">
              {SITE.hours}
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
