import { Sparkles, Heart, Target, ShieldCheck, Wifi, Smile, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FadeIn, SectionLabel, Blob } from "@/components/Bits";

export default function About() {
  return (
    <div data-testid="about-page">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <Blob className="bg-orange-200/40 h-72 w-72 -top-10 -right-10" />
        <Blob className="bg-sky-200/40 h-72 w-72 top-32 -left-20" />
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-16 pb-16 sm:pt-24 sm:pb-20">
          <div className="max-w-3xl">
            <SectionLabel>About us</SectionLabel>
            <h1 className="mt-3 font-display text-5xl sm:text-6xl font-semibold text-slate-800 leading-[1.05] tracking-tight text-balance">
              A little school built on
              <span className="block text-orange-500">lots of love.</span>
            </h1>
            <p className="mt-5 text-lg sm:text-xl text-slate-600 leading-relaxed">
              Little Gurus Academy was born from a simple wish: that every child — anywhere in the world — could have a teacher who really, truly knows them.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="relative py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid lg:grid-cols-12 gap-12 items-center">
          <FadeIn className="lg:col-span-6">
            <div className="rounded-[2rem] overflow-hidden border-4 border-white shadow-xl">
              <img src="https://images.pexels.com/photos/8430234/pexels-photo-8430234.jpeg?auto=compress&w=1100"
                   alt="Parent and child sharing a learning moment" className="w-full h-96 object-cover" loading="lazy" />
            </div>
          </FadeIn>
          <FadeIn className="lg:col-span-6" delay={0.1}>
            <SectionLabel>Our story</SectionLabel>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl font-semibold text-slate-800 leading-tight">
              Built by parents, for parents.
            </h2>
            <p className="mt-4 text-slate-600 text-lg leading-relaxed">
              We were founded by parents, for parents — building a calm, caring online classroom where every child is truly seen. Our promise is simple: small classes, kind gurus, and lessons that feel like play.
            </p>
            <p className="mt-3 text-slate-600 text-lg leading-relaxed">
              Small classes. Caring gurus. Lessons that feel like play. Always.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Mission, Vision, Philosophy */}
      <section className="relative py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Target, label: "Mission", title: "Make great learning feel close again.", text: "Even at a distance, every child deserves a teacher who knows their name, their pace and their dreams." },
              { icon: Sparkles, label: "Vision", title: "A guru in every child's corner.", text: "We're building a world where parents never have to choose between quality, safety and affordability." },
              { icon: Heart, label: "Philosophy", title: "Play first. Praise often.", text: "Children learn most when they feel seen. So we lead with curiosity, laughter, and a lot of high-fives." },
            ].map((c, i) => {
              const I = c.icon;
              return (
                <FadeIn key={i} delay={i * 0.06}>
                  <Card className="h-full p-8 rounded-[2rem] bg-white border-2 border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300" data-testid={`mvp-card-${i}`}>
                    <span className="h-14 w-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                      <I className="h-6 w-6" strokeWidth={2.5} />
                    </span>
                    <p className="mt-5 text-xs font-bold uppercase tracking-widest text-orange-500">{c.label}</p>
                    <h3 className="mt-1 font-display text-2xl font-semibold text-slate-800">{c.title}</h3>
                    <p className="mt-2 text-slate-600 leading-relaxed">{c.text}</p>
                  </Card>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      {/* Safety & facilities */}
      <section className="relative py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <SectionLabel>Safety first</SectionLabel>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl font-semibold text-slate-800 leading-tight max-w-3xl">
            Built like a tiny school — protected like a fortress.
          </h2>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, title: "Background-checked", text: "Every guru clears identity, education and police verification." },
              { icon: Wifi, title: "Private classrooms", text: "Each session runs on a private, password-protected link — no random visitors." },
              { icon: Smile, title: "Parents welcome", text: "Drop in any time. Audit any class. We have nothing to hide." },
              { icon: BookOpen, title: "Recorded for you", text: "Miss a class? Watch the full lesson the same evening — encrypted and family-only." },
            ].map((c, i) => {
              const I = c.icon;
              return (
                <FadeIn key={i} delay={i * 0.05}>
                  <Card className="h-full p-6 rounded-[2rem] bg-white border-2 border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300" data-testid={`safety-card-${i}`}>
                    <span className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <I className="h-5 w-5" strokeWidth={2.5} />
                    </span>
                    <h3 className="mt-4 font-display text-lg font-semibold text-slate-800">{c.title}</h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">{c.text}</p>
                  </Card>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="rounded-[2rem] bg-amber-100 border-2 border-amber-200 p-10 sm:p-14 text-center">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-slate-800">Meet a guru in real life — well, on screen.</h2>
            <p className="mt-3 text-slate-700 text-lg max-w-xl mx-auto">Book a free tour and we'll match you with a teacher your child will adore.</p>
            <Link to="/admissions" className="inline-block mt-6" data-testid="about-cta-tour">
              <Button className="h-14 px-8 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-base shadow-lg">Book a Free Tour</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
