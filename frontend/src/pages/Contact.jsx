import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, Clock, Instagram, Youtube, MapPin, Send, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { SITE } from "@/lib/data";
import { submitContact } from "@/lib/api";
import { FadeIn, SectionLabel, Blob } from "@/components/Bits";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  subject: z.string().max(120).optional().or(z.literal("")),
  message: z.string().min(5, "Tell us a little more"),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Please give consent to continue (DPDP Act, 2023)" }),
  }),
});

export default function Contact() {
  const [done, setDone] = useState(false);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", subject: "", message: "", consent: false },
    mode: "onTouched",
  });

  const consentValue = form.watch("consent") || false;

  const onSubmit = async (data) => {
    try {
      const { consent: _consent, ...payload } = data;
      await submitContact(payload);
      toast.success("Thanks for writing! We'll reply within 24 hours.");
      setDone(true);
      form.reset();
    } catch {
      toast.error("Couldn't send right now. Please try again.");
    }
  };

  return (
    <div data-testid="contact-page">
      <section className="relative overflow-hidden">
        <Blob className="bg-sky-200/40 h-72 w-72 -top-10 -right-10" />
        <Blob className="bg-orange-200/40 h-72 w-72 top-32 -left-20" />
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-16 pb-12 sm:pt-24 sm:pb-16">
          <div className="max-w-3xl">
            <SectionLabel>Contact</SectionLabel>
            <h1 className="mt-3 font-display text-5xl sm:text-6xl font-semibold text-slate-800 leading-[1.05] tracking-tight">
              Say hi. We'd love
              <span className="block text-orange-500">to chat.</span>
            </h1>
            <p className="mt-5 text-lg sm:text-xl text-slate-600">
              Questions, ideas, partnership pitches, or just want to swap kid-jokes — our inbox is always open.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid lg:grid-cols-12 gap-8">
          {/* Info cards */}
          <FadeIn className="lg:col-span-5 space-y-5">
            <InfoCard
              icon={Mail}
              label="Email"
              title={SITE.email}
              href={`mailto:${SITE.email}`}
              accent="orange"
              testid="contact-info-email"
            />
            <InfoCard
              icon={Clock}
              label="Class hours"
              title={SITE.hours}
              accent="sky"
              testid="contact-info-hours"
            />
            <InfoCard
              icon={MapPin}
              label="Where we are"
              title="100% Online · Serving families across India"
              accent="emerald"
              testid="contact-info-location"
            />
            <div className="rounded-[2rem] bg-white border-2 border-slate-100 p-7 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-orange-500">Follow the fun</p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-slate-800">Find us socially</h3>
              <div className="mt-5 flex items-center gap-3">
                <a href={SITE.instagram} target="_blank" rel="noreferrer" data-testid="contact-instagram"
                   className="flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-full bg-rose-50 text-rose-600 border-2 border-rose-100 hover:bg-rose-100 font-bold">
                  <Instagram className="h-4 w-4" /> Instagram
                </a>
                <a href={SITE.youtube} target="_blank" rel="noreferrer" data-testid="contact-youtube"
                   className="flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-full bg-red-50 text-red-600 border-2 border-red-100 hover:bg-red-100 font-bold">
                  <Youtube className="h-4 w-4" /> YouTube
                </a>
              </div>
            </div>

            {/* Map placeholder (online-only, so a stylized panel) */}
            <div className="rounded-[2rem] overflow-hidden border-2 border-slate-100 shadow-sm" data-testid="contact-map">
              <iframe
                title="Little Gurus Academy location"
                src="https://www.openstreetmap.org/export/embed.html?bbox=72.7%2C18.9%2C72.95%2C19.3&layer=mapnik"
                className="w-full h-64"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </FadeIn>

          {/* Form */}
          <FadeIn className="lg:col-span-7" delay={0.1}>
            {done ? (
              <div className="rounded-[2rem] bg-emerald-50 border-2 border-emerald-200 p-10 text-center" data-testid="contact-success">
                <div className="mx-auto h-14 w-14 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h3 className="mt-5 font-display text-3xl font-semibold text-slate-800">Message sent!</h3>
                <p className="mt-2 text-slate-600">A friendly guru will get back to you within 24 hours.</p>
                <Button variant="outline" className="mt-6 rounded-full border-2" onClick={() => setDone(false)} data-testid="contact-send-another">
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={form.handleSubmit(onSubmit)} noValidate
                    className="rounded-[2rem] bg-white border-2 border-slate-100 shadow-sm p-7 sm:p-10"
                    data-testid="contact-form">
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-800">Drop us a message</h2>
                <p className="mt-1 text-slate-600">We typically reply within a few hours during class days.</p>
                <div className="mt-6 grid sm:grid-cols-2 gap-5">
                  <Field label="Your name" error={form.formState.errors.name?.message}>
                    <Input {...form.register("name")} placeholder="e.g. Aman Verma"
                           className="h-12 rounded-2xl border-2 border-slate-200 focus:border-orange-400 px-4"
                           data-testid="contact-name-input" />
                  </Field>
                  <Field label="Email" error={form.formState.errors.email?.message}>
                    <Input type="email" {...form.register("email")} placeholder="you@email.com"
                           className="h-12 rounded-2xl border-2 border-slate-200 focus:border-orange-400 px-4"
                           data-testid="contact-email-input" />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Subject (optional)" error={form.formState.errors.subject?.message}>
                      <Input {...form.register("subject")} placeholder="e.g. Tour for my 5-year-old"
                             className="h-12 rounded-2xl border-2 border-slate-200 focus:border-orange-400 px-4"
                             data-testid="contact-subject-input" />
                    </Field>
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Message" error={form.formState.errors.message?.message}>
                      <Textarea {...form.register("message")} rows={6} placeholder="Tell us what's on your mind..."
                                className="rounded-2xl border-2 border-slate-200 focus:border-orange-400 px-4 py-3"
                                data-testid="contact-message-input" />
                    </Field>
                  </div>
                </div>
                <div className="mt-5 rounded-2xl bg-amber-50/70 border-2 border-amber-100 p-4 flex items-start gap-3" data-testid="contact-consent-wrap">
                  <Checkbox
                    id="contact-consent"
                    checked={consentValue}
                    onCheckedChange={(v) => form.setValue("consent", v === true, { shouldValidate: true })}
                    className="mt-0.5 h-5 w-5 border-2 border-slate-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                    data-testid="contact-consent-checkbox"
                  />
                  <label htmlFor="contact-consent" className="text-sm text-slate-700 leading-relaxed cursor-pointer select-none">
                    I consent to Little Gurus Academy processing my personal data per the{" "}
                    <Link to="/privacy-policy" className="font-semibold text-orange-600 hover:text-orange-700 underline underline-offset-2">Privacy Policy</Link>{" "}
                    and India's <b>DPDP Act, 2023</b>.
                  </label>
                </div>
                {form.formState.errors.consent?.message && (
                  <p className="mt-2 text-xs font-semibold text-rose-600" data-testid="contact-consent-error">{form.formState.errors.consent.message}</p>
                )}
                <Button type="submit" disabled={form.formState.isSubmitting}
                        className="mt-6 w-full h-14 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-base shadow-md shadow-orange-500/20"
                        data-testid="contact-submit-btn">
                  {form.formState.isSubmitting ? "Sending..." : <>Send message <Send className="ml-2 h-4 w-4" /></>}
                </Button>
              </form>
            )}
          </FadeIn>
        </div>
      </section>
    </div>
  );
}

function InfoCard({ icon: I, label, title, href, accent, testid }) {
  const styles = {
    orange: "bg-orange-100 text-orange-600",
    sky: "bg-sky-100 text-sky-600",
    emerald: "bg-emerald-100 text-emerald-600",
  }[accent] || "bg-orange-100 text-orange-600";
  const Wrap = href ? "a" : "div";
  const props = href ? { href } : {};
  return (
    <Wrap {...props}
          data-testid={testid}
          className="block rounded-[2rem] bg-white border-2 border-slate-100 p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <span className={`h-12 w-12 rounded-2xl ${styles} flex items-center justify-center`}>
        <I className="h-5 w-5" strokeWidth={2.5} />
      </span>
      <p className="mt-4 text-xs font-bold uppercase tracking-widest text-orange-500">{label}</p>
      <p className="mt-1 font-display text-xl font-semibold text-slate-800 break-words">{title}</p>
    </Wrap>
  );
}

function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm font-semibold text-slate-700">{label}</Label>
      {children}
      {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}
    </div>
  );
}
