import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { GALLERY_IMAGES } from "@/lib/data";
import { FadeIn, SectionLabel, Blob } from "@/components/Bits";

export default function Gallery() {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  const close = useCallback(() => setOpen(false), []);
  const next = useCallback(() => setIdx((i) => (i + 1) % GALLERY_IMAGES.length), []);
  const prev = useCallback(() => setIdx((i) => (i - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length), []);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, close, next, prev]);

  return (
    <div data-testid="gallery-page">
      <section className="relative overflow-hidden">
        <Blob className="bg-rose-200/40 h-72 w-72 -top-10 -right-10" />
        <Blob className="bg-amber-200/40 h-72 w-72 top-32 -left-20" />
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-16 pb-10 sm:pt-24 sm:pb-12">
          <div className="max-w-3xl">
            <SectionLabel>Gallery</SectionLabel>
            <h1 className="mt-3 font-display text-5xl sm:text-6xl font-semibold text-slate-800 leading-[1.05] tracking-tight">
              Tiny moments,
              <span className="block text-orange-500">big smiles.</span>
            </h1>
            <p className="mt-5 text-lg text-slate-600">
              A peek into our online classrooms, weekend art jams, science labs and very serious storytelling sessions.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {GALLERY_IMAGES.map((src, i) => (
              <FadeIn key={i} delay={(i % 6) * 0.04}>
                <button
                  onClick={() => { setIdx(i); setOpen(true); }}
                  className={`group block relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border-4 border-white shadow-sm hover:shadow-xl transition-all w-full ${
                    i % 5 === 0 ? "aspect-[4/5]" : "aspect-square"
                  }`}
                  data-testid={`gallery-thumb-${i}`}
                  aria-label={`Open image ${i + 1}`}
                >
                  <img src={src} alt={`Gallery image ${i + 1}`} loading="lazy"
                       className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <span className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors" />
                </button>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {open && (
        <div
          className="fixed inset-0 z-[60] bg-slate-900/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
          data-testid="lightbox"
        >
          <button
            onClick={(e) => { e.stopPropagation(); close(); }}
            className="absolute top-5 right-5 h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
            aria-label="Close gallery"
            data-testid="lightbox-close"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-3 sm:left-8 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
            aria-label="Previous"
            data-testid="lightbox-prev"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-3 sm:right-8 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
            aria-label="Next"
            data-testid="lightbox-next"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <img
            src={GALLERY_IMAGES[idx]}
            alt={`Gallery image ${idx + 1}`}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88vh] max-w-[92vw] rounded-2xl shadow-2xl object-contain"
          />
        </div>
      )}
    </div>
  );
}
