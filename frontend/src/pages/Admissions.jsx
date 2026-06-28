import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CalendarCheck, ClipboardList, PartyPopper, Check } from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { FEES, FAQS } from "@/lib/data";
import { FadeIn, SectionLabel, Blob } from "@/components/Bits";
import EnquiryForm from "@/components/EnquiryForm";

const STEPS = [
  { icon: CalendarCheck, title: "Book a free tour", text: "Pick a slot that works for your family. Meet a guru, see a real class, ask anything." },
  { icon: ClipboardList, title: "Submit application", text: "A 2-minute online form — name, age, program of interest. That's it." },
  { icon: PartyPopper, title: "Confirm your spot", text: "We hold a seat for 48 hours. Once confirmed, your child is officially a Little Guru!" },
];

export default function Admissions() {
  const { search, hash } = useLocation();
  const [defaultProgram, setDefaultProgram] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(search);
    const p = params.get("program");
    if (p) setDefaultProgram(p);
  }, [search]);

  useEffect(() => {
    if (hash === "#enquiry") {
      const el = document.getElementById("enquiry");
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }, [hash]);

  return (
    <div data-testid="admissions-page">
      <section className="relative overflow-hidden">
        <Blob className="bg-orange-200/40 h-72 w-72 -top-10 -right-10" />
        <Blob className="bg-sky-200/40 h-72 w-72 top-32 -left-20" />
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-16 pb-12 sm:pt-24 sm:pb-16">
          <div className="max-w-3xl">
            <SectionLabel>Admissions</SectionLabel>
            <h1 className="mt-3 font-display text-5xl sm:text-6xl font-semibold text-slate-800 leading-[1.05] tracking-tight">
              Three tiny steps.
              <span className="block text-orange-500">One giant smile.</span>
            </h1>
            <p className="mt-5 text-lg sm:text-xl text-slate-600">
              No paperwork mountains. No long waitlists. Just a friendly path from "hello" to your child's very first class.
            </p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-12 sm:py-16" data-testid="admissions-steps">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((s, i) => {
              const I = s.icon;
              return (
                <FadeIn key={i} delay={i * 0.06}>
                  <div className="relative h-full p-7 rounded-[2rem] bg-white border-2 border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300" data-testid={`admissions-step-${i}`}>
                    <span className="absolute -top-4 -left-4 h-12 w-12 rounded-2xl bg-orange-500 text-white font-display text-xl font-bold flex items-center justify-center border-4 border-amber-50">
                      {i + 1}
                    </span>
                    <span className="h-14 w-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                      <I className="h-6 w-6" strokeWidth={2.5} />
                    </span>
                    <h3 className="mt-5 font-display text-2xl font-semibold text-slate-800">{s.title}</h3>
                    <p className="mt-2 text-slate-600 leading-relaxed">{s.text}</p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Fees */}
      <section className="py-16 sm:py-20" data-testid="fees-section">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-3xl">
            <SectionLabel>Honest pricing</SectionLabel>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl font-semibold text-slate-800 leading-tight">
              Tiny prices. Tinier surprises.
            </h2>
            <p className="mt-4 text-slate-600 text-lg">No registration fees. No hidden costs. Cancel anytime — really.</p>
          </div>
          <div className="mt-10 overflow-hidden rounded-[2rem] border-2 border-slate-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-amber-50">
                  <tr>
                    {["Program", "Sessions", "Monthly", "Quarterly"].map((h) => (
                      <th key={h} className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-slate-700">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {FEES.map((f, i) => (
                    <tr key={i} className="border-t border-slate-100 hover:bg-amber-50/50" data-testid={`fee-row-${i}`}>
                      <td className="px-6 py-5 font-bold text-slate-800">{f.program}</td>
                      <td className="px-6 py-5 text-slate-600">{f.sessions}</td>
                      <td className="px-6 py-5 font-bold text-slate-800">{f.monthly}</td>
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-sm font-bold">
                          {f.quarterly} <span className="text-xs font-semibold">save 8%</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Free trial class", "No registration fee", "Sibling discount 10%", "Cancel anytime"].map((p, i) => (
              <span key={i} className="inline-flex items-center gap-2 rounded-full bg-white border-2 border-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                <Check className="h-4 w-4 text-emerald-600" strokeWidth={3} /> {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-white" data-testid="faq-section">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center">
            <SectionLabel>FAQ</SectionLabel>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl font-semibold text-slate-800 leading-tight">
              Quick answers to parent questions.
            </h2>
          </div>
          <Accordion type="single" collapsible className="mt-10 space-y-3" defaultValue="item-0">
            {FAQS.map((f, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="rounded-2xl border-2 border-slate-100 bg-amber-50/40 px-5 data-[state=open]:bg-white data-[state=open]:border-orange-200"
                data-testid={`faq-item-${i}`}
              >
                <AccordionTrigger className="text-left font-display text-lg sm:text-xl font-semibold text-slate-800 hover:no-underline py-5">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-slate-600 text-base leading-relaxed">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Enquiry form */}
      <section id="enquiry" className="py-16 sm:py-24" data-testid="enquiry-section">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5">
            <SectionLabel>Get in touch</SectionLabel>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl font-semibold text-slate-800 leading-tight">
              Let's say hello.
            </h2>
            <p className="mt-4 text-slate-600 text-lg">
              Fill the form and a real, friendly guru will text you back within 24 hours. We promise no chatbots.
            </p>
            <ul className="mt-6 space-y-3 text-slate-700">
              {["Free 1-on-1 tour & demo class", "Match with the right program & teacher", "No-pressure conversation, ever"].map((l, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  {l}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-7">
            <EnquiryForm defaultProgram={defaultProgram} />
          </div>
        </div>
      </section>
    </div>
  );
}
