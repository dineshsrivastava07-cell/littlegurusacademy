import { Link } from "react-router-dom";
import {
  Sparkles, ShieldCheck, Lock, Users, Puzzle, GraduationCap, Heart, Sprout,
  ArrowRight, Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TRUST_BADGES, WHY_US, PROGRAMS, DAY_TIMELINE, SITE,
} from "@/lib/data";
import { getAccent } from "@/lib/accent";
import { FadeIn, SectionLabel, Blob } from "@/components/Bits";

const ICONS = { ShieldCheck, Lock, Users, Sparkles, Puzzle, GraduationCap, Heart, Sprout };

export default function Home() {
  return (
    <div data-testid="home-page">
      <Hero />
      <TrustStrip />
      <WhyUs />
      <ProgramsPreview />
      <DayAtAcademy />
      <FinalCta />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <Blob className="bg-orange-200/50 h-72 w-72 -top-10 -right-10" />
      <Blob className="bg-sky-200/40 h-80 w-80 top-40 -left-20" />
      <Blob className="bg-emerald-200/40 h-56 w-56 bottom-0 right-1/3" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-14 pb-20 sm:pt-20 sm:pb-28 lg:pt-24 lg:pb-32">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <FadeIn>
              <div className="inline-flex items-center gap-2 rounded-full bg-white border-2 border-orange-100 px-4 py-2 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-700 tracking-wide">Live online · Now enrolling for the new term</span>
              </div>
            </FadeIn>
            <FadeIn delay={0.05}>
              <h1 className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl font-semibold text-slate-800 leading-[1.05] tracking-tight text-balance">
                Where little minds
                <span className="block">
                  <span className="relative inline-block">
                    <span className="relative z-10 text-orange-500">grow big.</span>
                    <span className="absolute inset-x-0 bottom-2 h-3 sm:h-4 bg-amber-300/70 -z-0 rounded-full" />
                  </span>
                </span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-xl leading-relaxed">
                Live, online preschool and after-school tutoring for ages 2–10. Tiny classes. Big hearted teachers. The kind of learning kids actually look forward to.
              </p>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link to="/admissions" data-testid="hero-book-tour-btn">
                  <Button className="h-14 px-8 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-base shadow-lg shadow-orange-500/25 hover:shadow-xl hover:scale-105 transition-all w-full sm:w-auto">
                    Book a Free Tour <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/programs" data-testid="hero-programs-btn">
                  <Button variant="outline" className="h-14 px-8 rounded-full border-2 border-slate-200 hover:border-orange-300 hover:bg-orange-50 font-bold text-base w-full sm:w-auto">
                    View Programs
                  </Button>
                </Link>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="mt-8 flex flex-wrap items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-2 rounded-full bg-white border-2 border-slate-100 px-4 py-2 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-slate-700">100% Online</span>
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white border-2 border-slate-100 px-4 py-2 shadow-sm">
                  <Users className="h-4 w-4 text-orange-500" />
                  <span className="font-semibold text-slate-700">Small live classes (max 8)</span>
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white border-2 border-slate-100 px-4 py-2 shadow-sm">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span className="font-semibold text-slate-700">Vetted teachers</span>
                </span>
              </div>
            </FadeIn>
          </div>

          <div className="lg:col-span-6 relative">
            <FadeIn delay={0.15}>
              <div className="relative">
                <div className="absolute -inset-2 rounded-[2.5rem] bg-gradient-to-tr from-orange-300/40 via-amber-200/40 to-sky-300/40 blur-2xl" />
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-orange-500/10 border-4 border-white">
                  <img
                    src="https://images.pexels.com/photos/7548729/pexels-photo-7548729.jpeg?auto=compress&w=1100"
                    alt="A happy young girl learning online with a tablet"
                    className="w-full h-[440px] sm:h-[520px] object-cover"
                    loading="eager"
                  />
                </div>

                {/* Floating credibility cards (factual claims only) */}
                <div className="hidden sm:flex absolute -left-6 top-10 items-center gap-3 rounded-2xl bg-white border-2 border-slate-100 shadow-lg px-4 py-3 animate-float-slow">
                  <span className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5" strokeWidth={2.5} />
                  </span>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold">Safe & secure</p>
                    <p className="text-sm font-bold text-slate-800">Vetted teachers</p>
                  </div>
                </div>

                <div className="hidden sm:flex absolute -right-4 bottom-10 items-center gap-3 rounded-2xl bg-white border-2 border-slate-100 shadow-lg px-4 py-3 animate-float-medium">
                  <span className="h-10 w-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                    <Users className="h-5 w-5" strokeWidth={2.5} />
                  </span>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold">Class size</p>
                    <p className="text-sm font-bold text-slate-800">Max 8 kids</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  return (
    <section className="bg-white border-y border-slate-100" data-testid="trust-strip">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {TRUST_BADGES.map((b, i) => {
            const I = ICONS[b.icon] || Sparkles;
            return (
              <div key={i} className="flex items-center gap-3" data-testid={`trust-badge-${i}`}>
                <span className="h-12 w-12 rounded-2xl bg-amber-100 text-orange-600 flex items-center justify-center shrink-0">
                  <I className="h-5 w-5" strokeWidth={2.5} />
                </span>
                <span className="text-sm sm:text-base font-bold text-slate-800">{b.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  return (
    <section className="relative py-20 sm:py-28" data-testid="why-us">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="max-w-3xl">
          <SectionLabel>Why Little Gurus</SectionLabel>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl font-semibold text-slate-800 leading-tight text-balance">
            Big school energy.<br className="hidden sm:block" /> Tiny-class warmth.
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl">
            Everything online classes promise, finally delivered the way parents actually wanted it.
          </p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_US.map((w, i) => {
            const I = ICONS[w.icon] || Sparkles;
            const a = getAccent(w.color);
            return (
              <FadeIn key={i} delay={i * 0.06}>
                <Card className="group h-full p-7 rounded-[2rem] bg-white border-2 border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300" data-testid={`why-card-${i}`}>
                  <span className={`h-14 w-14 rounded-2xl ${a.bg} ${a.text} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <I className="h-6 w-6" strokeWidth={2.5} />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-semibold text-slate-800">{w.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{w.text}</p>
                </Card>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProgramsPreview() {
  return (
    <section className="relative py-20 sm:py-28 bg-white" data-testid="programs-preview">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="max-w-2xl">
            <SectionLabel>Programs by age</SectionLabel>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl font-semibold text-slate-800 leading-tight">
              A loving home for every age.
            </h2>
          </div>
          <Link to="/programs" className="inline-flex items-center gap-1 font-semibold text-orange-600 hover:text-orange-700" data-testid="programs-see-all">
            See all programs <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROGRAMS.map((p, i) => {
            const a = getAccent(p.accent);
            return (
              <FadeIn key={p.id} delay={i * 0.06}>
                <Card className="group overflow-hidden h-full rounded-[2rem] bg-white border-2 border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300" data-testid={`program-card-${p.id}`}>
                  <div className="relative overflow-hidden">
                    <img src={p.image} alt={p.name} className="h-44 w-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    <Badge className={`absolute top-4 left-4 ${a.chip} border-0 rounded-full px-3 py-1 text-xs font-bold`}>{p.age}</Badge>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-semibold text-slate-800">{p.name}</h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">{p.blurb}</p>
                    <Link to={`/admissions?program=${encodeURIComponent(p.name)}#enquiry`}>
                      <Button variant="outline" className={`mt-5 w-full rounded-full border-2 ${a.border} ${a.text} hover:${a.bg} font-bold`} data-testid={`program-enquire-${p.id}`}>
                        Enquire
                      </Button>
                    </Link>
                  </div>
                </Card>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function DayAtAcademy() {
  return (
    <section className="relative py-20 sm:py-28" data-testid="day-at-academy">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <SectionLabel>A day at Little Gurus</SectionLabel>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl font-semibold text-slate-800 leading-tight text-balance">
              Every class. Built to make kids beam.
            </h2>
            <p className="mt-5 text-lg text-slate-600">
              Sessions follow a gentle rhythm — never too fast, never too still. Just the right mix of focus, play and praise.
            </p>
            <div className="mt-7 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl">
              <img src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1000&q=80"
                   alt="Child smiling during an online class"
                   className="w-full h-72 object-cover" loading="lazy" />
            </div>
          </div>

          <div className="lg:col-span-7">
            <ol className="relative border-l-2 border-dashed border-orange-200 ml-3 space-y-8">
              {DAY_TIMELINE.map((d, i) => (
                <FadeIn key={i} delay={i * 0.05}>
                  <li className="relative pl-8" data-testid={`timeline-item-${i}`}>
                    <span className="absolute -left-[14px] top-1 h-7 w-7 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center border-4 border-amber-50">
                      {i + 1}
                    </span>
                    <p className="text-xs font-bold uppercase tracking-widest text-orange-500">{d.time}</p>
                    <h3 className="mt-1 font-display text-2xl font-semibold text-slate-800">{d.title}</h3>
                    <p className="mt-1 text-slate-600 leading-relaxed">{d.text}</p>
                  </li>
                </FadeIn>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsDynamic() {
  const [rows, setRows] = useState([]);
  useEffect(() => { getPublicTestimonials().then(setRows).catch(() => setRows([])); }, []);
  if (!rows.length) return null;
  return (
    <section className="relative py-20 sm:py-28 bg-white" data-testid="testimonials">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center max-w-2xl mx-auto">
          <SectionLabel>What parents say</SectionLabel>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl font-semibold text-slate-800 leading-tight">Real words. Real grins.</h2>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rows.slice(0, 6).map((t) => (
            <FadeIn key={t.id}>
              <div className="h-full rounded-[2rem] bg-amber-50 border-2 border-amber-100 p-7" data-testid={`testimonial-card-${t.id}`}>
                <Quote className="h-8 w-8 text-orange-400" strokeWidth={2.5} />
                <p className="mt-3 text-slate-800 leading-relaxed">"{t.text}"</p>
                <div className="mt-5 flex items-center gap-3">
                  {t.photo_url ? (
                    <img src={t.photo_url} alt={t.parent_name} className="h-11 w-11 rounded-full object-cover" />
                  ) : (
                    <span className="h-11 w-11 rounded-full bg-orange-500/20 text-orange-700 flex items-center justify-center font-bold">{(t.parent_name||"?").slice(0,1)}</span>
                  )}
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 truncate">{t.parent_name}</p>
                    {t.child_info && <p className="text-xs text-slate-500 truncate">{t.child_info}</p>}
                    <div className="flex items-center gap-0.5 mt-0.5 text-amber-500">
                      {[...Array(t.rating || 5)].map((_,i)=><Star key={i} className="h-3.5 w-3.5 fill-current" />)}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="relative pt-4 pb-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 px-8 sm:px-12 py-14 sm:py-20">
          <Blob className="h-80 w-80 -top-20 -right-10 bg-orange-500/30" />
          <Blob className="h-72 w-72 -bottom-20 -left-10 bg-sky-500/20" />
          <div className="relative grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <SectionLabel>Free, no-pressure tour</SectionLabel>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight text-balance">
                Give your child a head start — book a free tour today.
              </h2>
              <p className="mt-4 text-slate-300 text-lg max-w-2xl">
                See a real class, meet a guru, ask your questions. We'll help you pick the perfect program even if it's not ours.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <Link to="/admissions" data-testid="final-cta-tour">
                <Button className="w-full h-14 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-base shadow-lg">
                  Book a Free Tour <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <a href={SITE.youtube} target="_blank" rel="noreferrer" data-testid="final-cta-watch">
                <Button variant="outline" className="w-full h-14 rounded-full bg-transparent border-2 border-white/20 text-white hover:bg-white/10 font-bold text-base">
                  <Play className="mr-1 h-4 w-4" /> Watch a sample
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
