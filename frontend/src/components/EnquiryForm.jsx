import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitEnquiry } from "@/lib/api";
import { PROGRAMS } from "@/lib/data";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(5, "Enter a valid phone").max(25),
  child_age: z.string().min(1, "Choose an age"),
  program: z.string().min(1, "Pick a program"),
  message: z.string().max(2000).optional().or(z.literal("")),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Please give consent to continue (DPDP Act, 2023)" }),
  }),
});

const AGES = ["2", "3", "4", "5", "6", "7", "8", "9", "10"];

export default function EnquiryForm({ defaultProgram = "", compact = false }) {
  const [done, setDone] = useState(false);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "", email: "", phone: "", child_age: "", program: defaultProgram, message: "", consent: false,
    },
    mode: "onTouched",
  });

  const programValue = form.watch("program") || "";
  const ageValue = form.watch("child_age") || "";
  const consentValue = form.watch("consent") || false;

  useEffect(() => {
    if (defaultProgram) {
      form.setValue("program", defaultProgram, { shouldValidate: false, shouldDirty: true });
    }
  }, [defaultProgram, form]);

  const onSubmit = async (data) => {
    try {
      // Strip consent flag from payload — we don't store it as content;
      // submission itself is the recorded act of consent (DPDP Act 2023).
      const { consent: _consent, ...payload } = data;
      await submitEnquiry({ ...payload, source: "enquiry-form" });
      setDone(true);
      toast.success("Got it! A guru will reach out within 24 hours.");
      form.reset({ name: "", email: "", phone: "", child_age: "", program: defaultProgram, message: "", consent: false });
    } catch (e) {
      toast.error("Couldn't send right now. Please try again or email us.");
    }
  };

  if (done) {
    return (
      <div data-testid="enquiry-success" className="rounded-[2rem] bg-emerald-50 border-2 border-emerald-200 p-8 sm:p-10 text-center">
        <div className="mx-auto h-14 w-14 rounded-full bg-emerald-500 text-white flex items-center justify-center">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="mt-5 font-display text-2xl sm:text-3xl font-semibold text-slate-800">Yay — message received!</h3>
        <p className="mt-2 text-slate-600 max-w-md mx-auto">
          One of our gurus will reach out within 24 hours to set up your free tour. Hugs on the way!
        </p>
        <Button
          variant="outline"
          className="mt-6 rounded-full border-2"
          onClick={() => setDone(false)}
          data-testid="enquiry-send-another"
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      data-testid="enquiry-form"
      className={`rounded-[2rem] bg-white border-2 border-slate-100 shadow-sm ${compact ? "p-6 sm:p-8" : "p-7 sm:p-10"}`}
    >
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Parent's name" error={form.formState.errors.name?.message}>
          <Input
            {...form.register("name")}
            placeholder="e.g. Priya Sharma"
            className="h-12 rounded-2xl border-2 border-slate-200 focus:border-orange-400 px-4"
            data-testid="enquiry-name-input"
          />
        </Field>
        <Field label="Email" error={form.formState.errors.email?.message}>
          <Input
            type="email"
            {...form.register("email")}
            placeholder="parent@email.com"
            className="h-12 rounded-2xl border-2 border-slate-200 focus:border-orange-400 px-4"
            data-testid="enquiry-email-input"
          />
        </Field>
        <Field label="Phone" error={form.formState.errors.phone?.message}>
          <Input
            {...form.register("phone")}
            placeholder="+91 ..."
            className="h-12 rounded-2xl border-2 border-slate-200 focus:border-orange-400 px-4"
            data-testid="enquiry-phone-input"
          />
        </Field>
        <Field label="Child's age" error={form.formState.errors.child_age?.message}>
          <Select
            value={ageValue}
            onValueChange={(v) => form.setValue("child_age", v, { shouldValidate: true })}
          >
            <SelectTrigger className="h-12 rounded-2xl border-2 border-slate-200 px-4" data-testid="enquiry-age-select">
              <SelectValue placeholder="Choose age" />
            </SelectTrigger>
            <SelectContent>
              {AGES.map((a) => (
                <SelectItem key={a} value={a}>{a} years</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <div className="sm:col-span-2">
          <Field label="Program of interest" error={form.formState.errors.program?.message}>
            <Select
              value={programValue}
              onValueChange={(v) => form.setValue("program", v, { shouldValidate: true })}
            >
              <SelectTrigger className="h-12 rounded-2xl border-2 border-slate-200 px-4" data-testid="enquiry-program-select">
                <SelectValue placeholder="Pick a program" />
              </SelectTrigger>
              <SelectContent>
                {PROGRAMS.map((p) => (
                  <SelectItem key={p.id} value={p.name}>{p.name} · {p.age}</SelectItem>
                ))}
                <SelectItem value="Not sure yet">Not sure yet</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Anything we should know? (optional)" error={form.formState.errors.message?.message}>
            <Textarea
              {...form.register("message")}
              rows={4}
              placeholder="Tell us about your child — their interests, anything they need extra love with..."
              className="rounded-2xl border-2 border-slate-200 focus:border-orange-400 px-4 py-3"
              data-testid="enquiry-message-input"
            />
          </Field>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-amber-50/70 border-2 border-amber-100 p-4 flex items-start gap-3" data-testid="enquiry-consent-wrap">
        <Checkbox
          id="enquiry-consent"
          checked={consentValue}
          onCheckedChange={(v) => form.setValue("consent", v === true, { shouldValidate: true })}
          className="mt-0.5 h-5 w-5 border-2 border-slate-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
          data-testid="enquiry-consent-checkbox"
        />
        <label htmlFor="enquiry-consent" className="text-sm text-slate-700 leading-relaxed cursor-pointer select-none">
          I consent to {`Little Gurus Academy`} processing my and my child's personal data for the purposes described in the{" "}
          <Link to="/privacy-policy" className="font-semibold text-orange-600 hover:text-orange-700 underline underline-offset-2">Privacy Policy</Link>, in accordance with India's <b>DPDP Act, 2023</b>. I can withdraw consent any time.
        </label>
      </div>
      {form.formState.errors.consent?.message && (
        <p className="mt-2 text-xs font-semibold text-rose-600" data-testid="enquiry-consent-error">{form.formState.errors.consent.message}</p>
      )}

      <Button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="mt-7 w-full h-14 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-base shadow-md shadow-orange-500/20 hover:scale-[1.01] transition-all"
        data-testid="enquiry-submit-btn"
      >
        {form.formState.isSubmitting ? "Sending..." : "Book my free tour"}
      </Button>
      <p className="mt-3 text-center text-xs text-slate-500">
        We respect your inbox. Zero spam, ever.
      </p>
    </form>
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
