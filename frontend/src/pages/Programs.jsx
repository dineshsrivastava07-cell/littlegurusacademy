import { Link } from "react-router-dom";
import { Clock, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PROGRAMS } from "@/lib/data";
import { getAccent } from "@/lib/accent";
import { FadeIn, SectionLabel, Blob } from "@/components/Bits";

export default function Programs() {
  return (
    <div data-testid="programs-page">
      <section className="relative overflow-hidden">
        <Blob className="bg-orange-200/40 h-72 w-72 -top-10 -right-10" />
        <Blob className="bg-emerald-200/40 h-72 w-72 top-20 -left-20" />
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-16 pb-12 sm:pt-24 sm:pb-16">
          <div className="max-w-3xl">
            <SectionLabel>Programs</SectionLabel>
            <h1 className="mt-3 font-display text-5xl sm:text-6xl font-semibold text-slate-800 leading-[1.05] tracking-tight">
              Made for every age.
              <span className="block text-orange-500">Loved by every kid.</span>
            </h1>
            <p className="mt-5 text-lg sm:text-xl text-slate-600">
              Pick the program that fits your child today. Switch any time — your subscription, your rules.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-10">
          {PROGRAMS.map((p, idx) => {
            const a = getAccent(p.accent);
            const reverse = idx % 2 === 1;
            return (
              <FadeIn key={p.id}>
                <article
                  data-testid={`program-section-${p.id}`}
                  className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center rounded-[2.5rem] bg-white border-2 border-slate-100 shadow-sm p-6 sm:p-10"
                >
                  <div className={`lg:col-span-5 ${reverse ? "lg:order-2" : ""}`}>
                    <div className="relative rounded-[2rem] overflow-hidden">
                      <img src={p.image} alt={p.name} className="w-full h-72 sm:h-80 object-cover" loading="lazy" />
                      <Badge className={`absolute top-4 left-4 ${a.chip} border-0 rounded-full px-3 py-1 text-xs font-bold`}>
                        {p.age}
                      </Badge>
                    </div>
                  </div>
                  <div className={`lg:col-span-7 ${reverse ? "lg:order-1" : ""}`}>
                    <SectionLabel>{p.age}</SectionLabel>
                    <h2 className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-slate-800 leading-tight">{p.name}</h2>
                    <p className="mt-3 text-slate-600 text-lg">{p.blurb}</p>
                    <ul className="mt-5 space-y-3">
                      {p.learn.map((line, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className={`mt-0.5 h-6 w-6 shrink-0 rounded-full ${a.bg} ${a.text} flex items-center justify-center`}>
                            <Check className="h-3.5 w-3.5" strokeWidth={3} />
                          </span>
                          <span className="text-slate-700">{line}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 flex items-center gap-2 text-sm text-slate-600">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <span className="font-semibold">{p.schedule}</span>
                    </div>
                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                      <Link to={`/admissions?program=${encodeURIComponent(p.name)}#enquiry`} data-testid={`program-detail-enquire-${p.id}`}>
                        <Button className="h-12 px-7 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-md shadow-orange-500/20 w-full sm:w-auto">
                          Enquire <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                      <Link to="/admissions" data-testid={`program-detail-tour-${p.id}`}>
                        <Button variant="outline" className="h-12 px-7 rounded-full border-2 border-slate-200 hover:border-orange-300 hover:bg-orange-50 font-bold w-full sm:w-auto">
                          Book a Free Tour
                        </Button>
                      </Link>
                    </div>
                  </div>
                </article>
              </FadeIn>
            );
          })}
        </div>
      </section>
    </div>
  );
}
