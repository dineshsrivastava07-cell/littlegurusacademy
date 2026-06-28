import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CalendarCheck, ClipboardList, PartyPopper, Check, Clock, ChevronRight, Search, ShieldCheck } from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { FAQS } from "@/lib/data";
import { FadeIn, SectionLabel, Blob } from "@/components/Bits";
import { submitTourBooking, submitApplication, checkApplicationStatus, formatApiError } from "@/lib/api";
import useSiteSettings, { FALLBACK_PRICING } from "@/lib/useSiteSettings";

const PROGRAMS = [
  "Tiny Tots (2–4)",
  "Early Learners (4–6)",
  "Primary Prep (6–8)",
  "After-School (8–10)",
  "Not sure yet",
];

const SLOTS = ["7:00 PM IST", "7:30 PM IST", "8:00 PM IST", "8:30 PM IST", "9:00 PM IST"];

function nextWeekday() {
  const d = new Date(); d.setDate(d.getDate() + 1);
  while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export default function Admissions() {
  const [params] = useSearchParams();
  const [step, setStep] = useState(1);
  const [appRef, setAppRef] = useState(null);
  const [appProgram, setAppProgram] = useState("");

  useEffect(() => {
    const p = params.get("program");
    if (p) setAppProgram(p);
    if (window.location.hash === "#enquiry") {
      setTimeout(() => document.getElementById("step-1")?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [params]);

  return (
    <div data-testid="admissions-page">
      <section className="relative overflow-hidden">
        <Blob className="bg-orange-200/40 h-72 w-72 -top-10 -right-10" />
        <Blob className="bg-sky-200/40 h-72 w-72 top-32 -left-20" />
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-16 pb-10 sm:pt-24 sm:pb-12">
          <div className="max-w-3xl">
            <SectionLabel>Admissions</SectionLabel>
            <h1 className="mt-3 font-display text-5xl sm:text-6xl font-semibold text-slate-800 leading-[1.05] tracking-tight">
              Three tiny steps.
              <span className="block text-orange-500">One giant smile.</span>
            </h1>
            <p className="mt-5 text-lg sm:text-xl text-slate-600">
              Book a free tour, submit your application, and confirm your child's spot — all online, all in minutes.
            </p>
          </div>
        </div>
      </section>

      {/* Step indicator */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <ol className="grid sm:grid-cols-3 gap-3 sm:gap-4">
            {[
              { n: 1, icon: CalendarCheck, title: "Book a Free Tour" },
              { n: 2, icon: ClipboardList, title: "Submit Application" },
              { n: 3, icon: PartyPopper, title: "Confirm Your Spot" },
            ].map((s) => (
              <li key={s.n} className={`relative p-5 rounded-2xl border-2 ${step >= s.n ? "bg-orange-50 border-orange-200" : "bg-white border-slate-100"}`} data-testid={`step-indicator-${s.n}`}>
                <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl font-display font-bold ${step >= s.n ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-500"}`}>{s.n}</span>
                <p className="mt-3 font-display text-lg font-semibold text-slate-800 flex items-center gap-2"><s.icon className="h-4 w-4 text-orange-500" /> {s.title}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Step1Tour onDone={() => setStep(Math.max(step, 2))} />
      <Step2Application defaultProgram={appProgram} onDone={(ref, prog) => { setStep(3); setAppRef({ ref, program: prog }); setTimeout(() => document.getElementById("step-3")?.scrollIntoView({ behavior: "smooth" }), 100); }} />
      <Step3Confirm appRef={appRef} />
      <FeesSection />
      <FAQSection />
    </div>
  );
}

// ============================ STEP 1 ============================
const TourSchema = z.object({
  parent_name: z.string().min(2, "Please enter your name"),
  child_name: z.string().min(1, "Please enter your child's name"),
  child_age: z.string().min(1, "Choose an age"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().regex(/^(\+?91)?[ -]?\d{10}$/, "Enter a valid Indian mobile (+91…)"),
  preferred_date: z.string().min(1, "Pick a preferred date"),
  preferred_slot: z.string().min(1, "Pick a slot"),
  program: z.string().min(1, "Pick a program"),
  message: z.string().optional().or(z.literal("")),
  consent: z.literal(true, { errorMap: () => ({ message: "Please give consent (DPDP Act 2023)" }) }),
});

function Step1Tour({ onDone }) {
  const [done, setDone] = useState(false);
  const form = useForm({
    resolver: zodResolver(TourSchema),
    defaultValues: { parent_name:"", child_name:"", child_age:"", email:"", phone:"+91 ", preferred_date: nextWeekday(), preferred_slot: SLOTS[0], program: "", message: "", consent: false },
    mode: "onTouched",
  });
  const consent = form.watch("consent");
  const submit = async (data) => {
    try {
      const { consent: _c, ...payload } = data;
      await submitTourBooking(payload);
      setDone(true); onDone();
      toast.success("Tour booked! We'll confirm shortly.");
    } catch (e) { toast.error(formatApiError(e)); }
  };
  return (
    <section id="step-1" data-testid="step1-section" className="py-10 sm:py-14">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
        <SectionLabel>Step 1</SectionLabel>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-slate-800">Book a Free Tour</h2>
        <p className="mt-2 text-slate-600">Pick a slot, meet a guru, watch a real class. Zero pressure, zero cost.</p>
        {done ? (
          <div className="mt-6 rounded-[2rem] bg-emerald-50 border-2 border-emerald-200 p-8 text-center" data-testid="step1-success">
            <Check className="mx-auto h-10 w-10 text-emerald-600" />
            <h3 className="mt-3 font-display text-2xl font-semibold text-slate-800">Tour booked!</h3>
            <p className="mt-2 text-slate-600">We'll confirm your slot within 2 hours via WhatsApp/email.</p>
            <Button onClick={()=>setDone(false)} variant="outline" className="mt-4 rounded-full border-2">Book another tour</Button>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(submit)} noValidate className="mt-6 rounded-[2rem] bg-white border-2 border-slate-100 shadow-sm p-7 sm:p-10" data-testid="step1-form">
            <div className="grid sm:grid-cols-2 gap-5">
              <F label="Parent name" err={form.formState.errors.parent_name?.message}>
                <Input {...form.register("parent_name")} className={inputCls} data-testid="tour-parent-name" />
              </F>
              <F label="Child's name" err={form.formState.errors.child_name?.message}>
                <Input {...form.register("child_name")} className={inputCls} data-testid="tour-child-name" />
              </F>
              <F label="Child's age" err={form.formState.errors.child_age?.message}>
                <Select value={form.watch("child_age")||""} onValueChange={(v)=>form.setValue("child_age", v, {shouldValidate:true})}>
                  <SelectTrigger className={inputCls} data-testid="tour-child-age"><SelectValue placeholder="Choose age" /></SelectTrigger>
                  <SelectContent>{["2","3","4","5","6","7","8","9","10"].map((a)=><SelectItem key={a} value={a}>{a} years</SelectItem>)}</SelectContent>
                </Select>
              </F>
              <F label="Phone (+91)" err={form.formState.errors.phone?.message}>
                <Input {...form.register("phone")} placeholder="+91 98XXXXXXXX" className={inputCls} data-testid="tour-phone" />
              </F>
              <F label="Email" err={form.formState.errors.email?.message}>
                <Input type="email" {...form.register("email")} className={inputCls} data-testid="tour-email" />
              </F>
              <F label="Preferred date (weekdays)" err={form.formState.errors.preferred_date?.message}>
                <Input type="date" {...form.register("preferred_date")} min={nextWeekday()} className={inputCls} data-testid="tour-date" />
              </F>
              <F label="Preferred slot (IST)" err={form.formState.errors.preferred_slot?.message}>
                <Select value={form.watch("preferred_slot")||""} onValueChange={(v)=>form.setValue("preferred_slot", v, {shouldValidate:true})}>
                  <SelectTrigger className={inputCls} data-testid="tour-slot"><SelectValue /></SelectTrigger>
                  <SelectContent>{SLOTS.map((s)=><SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </F>
              <F label="Program of interest" err={form.formState.errors.program?.message}>
                <Select value={form.watch("program")||""} onValueChange={(v)=>form.setValue("program", v, {shouldValidate:true})}>
                  <SelectTrigger className={inputCls} data-testid="tour-program"><SelectValue placeholder="Pick a program" /></SelectTrigger>
                  <SelectContent>{PROGRAMS.map((p)=><SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
              </F>
              <div className="sm:col-span-2"><F label="Anything we should know? (optional)">
                <Textarea {...form.register("message")} rows={3} className="rounded-2xl border-2 border-slate-200 px-4 py-3" data-testid="tour-message" />
              </F></div>
            </div>
            <ConsentRow checked={consent} onChange={(v)=>form.setValue("consent", v===true, {shouldValidate:true})} error={form.formState.errors.consent?.message} testid="tour-consent" />
            <Button type="submit" disabled={form.formState.isSubmitting} className="mt-6 w-full h-14 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-base" data-testid="tour-submit">
              {form.formState.isSubmitting ? "Booking..." : "Book My Free Tour"}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}

// ============================ STEP 2 ============================
function ageFromDob(dob) {
  if (!dob) return "";
  const d = new Date(dob); if (isNaN(+d)) return "";
  const t = new Date();
  let age = t.getFullYear() - d.getFullYear();
  const m = t.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < d.getDate())) age--;
  return age >= 0 ? String(age) : "";
}

const AppSchema = z.object({
  parent_name: z.string().min(2),
  child_name: z.string().min(1),
  child_dob: z.string().min(1, "Please pick date of birth"),
  gender: z.string().min(1, "Choose gender"),
  email: z.string().email(),
  phone: z.string().regex(/^(\+?91)?[ -]?\d{10}$/, "Enter a valid Indian mobile"),
  city: z.string().min(2),
  program: z.string().min(1),
  source: z.string().min(1),
  notes: z.string().optional().or(z.literal("")),
  consent: z.literal(true, { errorMap: () => ({ message: "Please give consent (DPDP Act 2023)" }) }),
});

function Step2Application({ defaultProgram, onDone }) {
  const form = useForm({
    resolver: zodResolver(AppSchema),
    defaultValues: { parent_name:"", child_name:"", child_dob:"", gender:"", email:"", phone:"+91 ", city:"Gurgaon", program: defaultProgram || "", source: "Google", notes: "", consent: false },
    mode: "onTouched",
  });
  useEffect(() => { if (defaultProgram) form.setValue("program", defaultProgram); }, [defaultProgram, form]);
  const dob = form.watch("child_dob");
  const computedAge = ageFromDob(dob);
  const consent = form.watch("consent");
  const submit = async (data) => {
    try {
      const { consent: _c, ...payload } = data;
      payload.child_age = computedAge || "0";
      const res = await submitApplication(payload);
      toast.success(`Application received! Ref ${res.reference}`);
      onDone(res.reference, data.program);
      form.reset({ ...form.getValues(), notes: "", consent: false });
    } catch (e) { toast.error(formatApiError(e)); }
  };
  return (
    <section id="step-2" data-testid="step2-section" className="py-10 sm:py-14 bg-white">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
        <SectionLabel>Step 2</SectionLabel>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-slate-800">Submit Application</h2>
        <p className="mt-2 text-slate-600">Takes about 2 minutes. We'll review and reach out within 24 hours.</p>
        <form onSubmit={form.handleSubmit(submit)} noValidate className="mt-6 rounded-[2rem] border-2 border-slate-100 shadow-sm p-7 sm:p-10" data-testid="step2-form">
          <div className="grid sm:grid-cols-2 gap-5">
            <F label="Parent name" err={form.formState.errors.parent_name?.message}><Input {...form.register("parent_name")} className={inputCls} data-testid="app-parent-name" /></F>
            <F label="Child's name" err={form.formState.errors.child_name?.message}><Input {...form.register("child_name")} className={inputCls} data-testid="app-child-name" /></F>
            <F label="Child's date of birth" err={form.formState.errors.child_dob?.message}><Input type="date" {...form.register("child_dob")} className={inputCls} data-testid="app-child-dob" /></F>
            <F label="Child's age (auto)"><Input value={computedAge ? `${computedAge} years` : "—"} disabled className={inputCls + " bg-slate-50"} /></F>
            <F label="Gender" err={form.formState.errors.gender?.message}>
              <Select value={form.watch("gender")||""} onValueChange={(v)=>form.setValue("gender", v, {shouldValidate:true})}>
                <SelectTrigger className={inputCls} data-testid="app-gender"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{["Girl","Boy","Other","Prefer not to say"].map(x=><SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
              </Select>
            </F>
            <F label="Email" err={form.formState.errors.email?.message}><Input type="email" {...form.register("email")} className={inputCls} data-testid="app-email" /></F>
            <F label="Phone (+91)" err={form.formState.errors.phone?.message}><Input {...form.register("phone")} className={inputCls} data-testid="app-phone" /></F>
            <F label="City" err={form.formState.errors.city?.message}><Input {...form.register("city")} className={inputCls} data-testid="app-city" /></F>
            <F label="Program of interest" err={form.formState.errors.program?.message}>
              <Select value={form.watch("program")||""} onValueChange={(v)=>form.setValue("program", v, {shouldValidate:true})}>
                <SelectTrigger className={inputCls} data-testid="app-program"><SelectValue placeholder="Pick a program" /></SelectTrigger>
                <SelectContent>{PROGRAMS.map((p)=><SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </F>
            <F label="How did you hear about us?" err={form.formState.errors.source?.message}>
              <Select value={form.watch("source")||""} onValueChange={(v)=>form.setValue("source", v, {shouldValidate:true})}>
                <SelectTrigger className={inputCls} data-testid="app-source"><SelectValue /></SelectTrigger>
                <SelectContent>{["Google","YouTube","WhatsApp","Instagram","Friend/Family","Other"].map(x=><SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
              </Select>
            </F>
            <div className="sm:col-span-2"><F label="Special needs or notes (optional)">
              <Textarea {...form.register("notes")} rows={3} className="rounded-2xl border-2 border-slate-200 px-4 py-3" data-testid="app-notes" />
            </F></div>
          </div>
          <ConsentRow checked={consent} onChange={(v)=>form.setValue("consent", v===true, {shouldValidate:true})} error={form.formState.errors.consent?.message} testid="app-consent" />
          <Button type="submit" disabled={form.formState.isSubmitting} className="mt-6 w-full h-14 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-base" data-testid="app-submit">
            {form.formState.isSubmitting ? "Submitting..." : "Submit My Application"}
          </Button>
        </form>
      </div>
    </section>
  );
}

// ============================ STEP 3 ============================
function Step3Confirm({ appRef }) {
  const [seconds, setSeconds] = useState(48 * 3600);
  useEffect(() => {
    if (!appRef) return;
    setSeconds(48 * 3600);
    const t = setInterval(() => setSeconds((x)=>Math.max(0, x-1)), 1000);
    return () => clearInterval(t);
  }, [appRef]);
  const hh = String(Math.floor(seconds/3600)).padStart(2,"0");
  const mm = String(Math.floor((seconds%3600)/60)).padStart(2,"0");
  const ss = String(seconds%60).padStart(2,"0");

  // Status check
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [busy, setBusy] = useState(false);
  const check = async () => {
    if (!query.trim()) return;
    setBusy(true); setResults(null);
    try {
      const isRef = /^LGA-/i.test(query.trim());
      const r = await checkApplicationStatus(isRef ? { ref: query.trim().toUpperCase() } : { email: query.trim().toLowerCase() });
      setResults(r.applications);
    } catch (e) { toast.error(formatApiError(e)); }
    finally { setBusy(false); }
  };

  return (
    <section id="step-3" data-testid="step3-section" className="py-10 sm:py-14">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
        <SectionLabel>Step 3</SectionLabel>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-slate-800">Confirm Your Spot</h2>
        <p className="mt-2 text-slate-600">Once you've applied, your seat is held for 48 hours. Confirm via the payment link we send.</p>

        {appRef && (
          <div className="mt-6 rounded-[2rem] bg-orange-50 border-2 border-orange-200 p-7 sm:p-10" data-testid="step3-card">
            <p className="text-xs uppercase tracking-widest text-orange-600 font-bold">Application reference</p>
            <p className="mt-1 font-mono font-bold text-2xl text-slate-800">{appRef.ref}</p>
            <p className="mt-1 text-sm text-slate-600">Program: <b>{appRef.program}</b></p>
            <div className="mt-5 grid sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white border-2 border-orange-200 p-5">
                <p className="text-xs uppercase tracking-widest text-orange-500 font-bold">Seat held for</p>
                <p className="mt-2 font-display font-bold text-3xl tabular-nums text-slate-800">{hh}:{mm}:{ss}</p>
              </div>
              <div className="rounded-2xl bg-white border-2 border-orange-200 p-5">
                <p className="text-xs uppercase tracking-widest text-orange-500 font-bold">Next steps</p>
                <ul className="mt-2 text-sm text-slate-700 list-disc pl-4 space-y-1">
                  <li>We'll WhatsApp/email you a secure payment link.</li>
                  <li>Confirm payment to lock your child's spot.</li>
                  <li>Check the status below at any time.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 rounded-[2rem] bg-white border-2 border-slate-100 shadow-sm p-7 sm:p-10">
          <p className="text-xs uppercase tracking-widest text-orange-500 font-bold">Check application status</p>
          <h3 className="mt-1 font-display text-2xl font-semibold text-slate-800">Find your application</h3>
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <Input placeholder="LGA-YYYYMMDD-XXXX or your email" value={query} onChange={(e)=>setQuery(e.target.value)} className="h-12 rounded-2xl border-2 border-slate-200 px-4 flex-1" data-testid="status-input" />
            <Button onClick={check} disabled={busy} className="h-12 px-6 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold" data-testid="status-check-btn"><Search className="mr-1 h-4 w-4" /> {busy?"Checking…":"Check status"}</Button>
          </div>
          {results && results.length > 0 && (
            <div className="mt-4 space-y-3" data-testid="status-results">
              {results.map((a)=>(
                <div key={a.id} className="rounded-2xl border-2 border-slate-100 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-orange-600">{a.reference}</span>
                    <span className="text-sm text-slate-500">{a.child_name} · {a.program}</span>
                    <span className={`ml-auto inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${pillTone(a.status)}`}>{a.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function pillTone(s) {
  switch (s) {
    case "Confirmed": return "bg-emerald-100 text-emerald-700";
    case "Under Review": return "bg-amber-100 text-amber-800";
    case "Waitlisted": return "bg-sky-100 text-sky-700";
    case "Rejected": return "bg-rose-100 text-rose-700";
    default: return "bg-slate-100 text-slate-700";
  }
}

// ============================ Fees & FAQ ============================
function FeesSection() {
  const settings = useSiteSettings();
  const pricing = settings?.pricing?.length ? settings.pricing : FALLBACK_PRICING;
  return (
    <section className="py-16 sm:py-20" data-testid="fees-section">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <SectionLabel>Honest pricing</SectionLabel>
        <h2 className="mt-3 font-display text-4xl sm:text-5xl font-semibold text-slate-800 leading-tight">Tiny prices. Tinier surprises.</h2>
        <p className="mt-4 text-slate-600 text-lg">No registration fees. No hidden costs. Cancel anytime.</p>
        <div className="mt-10 overflow-hidden rounded-[2rem] border-2 border-slate-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-amber-50">
                <tr>{["Program","Sessions","Weekly","Monthly","Quarterly"].map((h)=><th key={h} className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-slate-700">{h}</th>)}</tr>
              </thead>
              <tbody>
                {pricing.map((f,i)=>(
                  <tr key={i} className="border-t border-slate-100 hover:bg-amber-50/50" data-testid={`fee-row-${i}`}>
                    <td className="px-6 py-5 font-bold text-slate-800">{f.program}</td>
                    <td className="px-6 py-5 text-slate-600">{f.sessions}</td>
                    <td className="px-6 py-5 font-bold text-slate-800">{f.weekly}</td>
                    <td className="px-6 py-5 font-bold text-slate-800">{f.monthly}</td>
                    <td className="px-6 py-5"><span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-sm font-bold">{f.quarterly} <span className="text-xs">save 10%</span></span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {["Free trial class","No registration fee","Sibling discount 10%","Cancel anytime"].map((p,i)=>(
            <span key={i} className="inline-flex items-center gap-2 rounded-full bg-white border-2 border-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"><Check className="h-4 w-4 text-emerald-600" strokeWidth={3} /> {p}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section className="py-16 sm:py-20 bg-white" data-testid="faq-section">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl font-semibold text-slate-800 leading-tight">Quick answers to parent questions.</h2>
        </div>
        <Accordion type="single" collapsible className="mt-10 space-y-3" defaultValue="item-0">
          {FAQS.map((f, i)=>(
            <AccordionItem key={i} value={`item-${i}`} className="rounded-2xl border-2 border-slate-100 bg-amber-50/40 px-5 data-[state=open]:bg-white data-[state=open]:border-orange-200" data-testid={`faq-item-${i}`}>
              <AccordionTrigger className="text-left font-display text-lg sm:text-xl font-semibold text-slate-800 hover:no-underline py-5">{f.q}</AccordionTrigger>
              <AccordionContent className="pb-5 text-slate-600 text-base leading-relaxed">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

// ============================ Helpers ============================
const inputCls = "h-12 rounded-2xl border-2 border-slate-200 focus:border-orange-400 px-4";
function F({ label, err, children }) {
  return <div className="flex flex-col gap-1.5">
    <Label className="text-sm font-semibold text-slate-700">{label}</Label>
    {children}
    {err && <p className="text-xs font-semibold text-rose-600">{err}</p>}
  </div>;
}
function ConsentRow({ checked, onChange, error, testid }) {
  return <>
    <div className="mt-6 rounded-2xl bg-amber-50/70 border-2 border-amber-100 p-4 flex items-start gap-3">
      <Checkbox checked={checked} onCheckedChange={onChange} className="mt-0.5 h-5 w-5 border-2 border-slate-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500" data-testid={testid} />
      <label className="text-sm text-slate-700 leading-relaxed cursor-pointer select-none">
        I consent to Little Gurus Academy processing my and my child's personal data per the{" "}
        <Link to="/privacy-policy" className="font-semibold text-orange-600 underline underline-offset-2">Privacy Policy</Link> and India's <b>DPDP Act, 2023</b>.
      </label>
    </div>
    {error && <p className="mt-2 text-xs font-semibold text-rose-600">{error}</p>}
  </>;
}
