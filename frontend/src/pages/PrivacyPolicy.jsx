import { Link } from "react-router-dom";
import { Shield, Mail, MapPin, Clock, FileText, Phone } from "lucide-react";
import { SITE } from "@/lib/data";
import { FadeIn, SectionLabel, Blob } from "@/components/Bits";
import { Button } from "@/components/ui/button";

const SECTIONS = [
  {
    id: "data-collected",
    title: "1. What personal data we collect",
    body: (
      <>
        <p>To deliver our online classes and respond to your enquiries, we collect only the data you choose to share with us:</p>
        <ul>
          <li><b>Parent / guardian details</b>: full name, email address, phone number.</li>
          <li><b>Child details</b>: first name, age and/or grade, program of interest.</li>
          <li><b>Optional messages</b>: anything you write in the contact or enquiry form.</li>
          <li><b>Technical data</b>: IP address (transient), browser type and basic device info — only as required by our hosting provider for security and abuse prevention.</li>
          <li><b>Class participation data</b>: attendance, work samples and progress notes — only after you enroll.</li>
        </ul>
        <p>We do <b>not</b> knowingly collect Aadhaar, PAN, biometric, financial-account, health or location data. We do not sell, rent or trade your data, ever.</p>
      </>
    ),
  },
  {
    id: "purpose",
    title: "2. Purpose & legal basis",
    body: (
      <>
        <p>Under the Digital Personal Data Protection Act, 2023 (DPDP Act), we process your personal data on the basis of your <b>free, specific, informed, unconditional and unambiguous consent</b>, taken at the point of submission.</p>
        <p>We use your data strictly to:</p>
        <ul>
          <li>Reply to your enquiries and schedule a free tour or demo class.</li>
          <li>Enroll your child and deliver the program you've chosen.</li>
          <li>Send service emails (class reminders, progress notes, invoices).</li>
          <li>Improve teaching quality based on aggregated, anonymised feedback.</li>
          <li>Comply with legal, tax and regulatory obligations in India.</li>
        </ul>
      </>
    ),
  },
  {
    id: "children",
    title: "3. How we treat children's data",
    body: (
      <>
        <p>Our learners are minors. We never collect a child's data directly. <b>A parent or legal guardian provides verifiable consent</b> on the child's behalf at enrolment.</p>
        <p>We do not engage in tracking, behavioural monitoring or targeted advertising directed at children, in line with Section 9 of the DPDP Act, 2023.</p>
      </>
    ),
  },
  {
    id: "retention",
    title: "4. How long we keep your data (retention)",
    body: (
      <>
        <ul>
          <li><b>Enquiries that don't lead to enrolment</b>: retained for up to <b>12 months</b>, then permanently deleted.</li>
          <li><b>Enrolled student records</b>: retained for the duration of active enrolment plus <b>3 years</b> for academic continuity and statutory record-keeping, then permanently deleted.</li>
          <li><b>Financial / tax records</b>: retained for <b>8 years</b> as required under Indian tax law.</li>
          <li><b>Marketing email subscribers</b>: retained until you unsubscribe.</li>
        </ul>
        <p>You can ask for earlier erasure at any time — see your rights below.</p>
      </>
    ),
  },
  {
    id: "rights",
    title: "5. Your rights under the DPDP Act, 2023",
    body: (
      <>
        <p>As a Data Principal, you have the following rights and we will honour them within statutory timelines:</p>
        <ul>
          <li><b>Right to access</b> — get a summary of personal data we hold about you and how we use it.</li>
          <li><b>Right to correction & completion</b> — fix anything that's wrong or out of date.</li>
          <li><b>Right to erasure</b> — ask us to delete your data when the purpose is met or you withdraw consent.</li>
          <li><b>Right to withdraw consent</b> — at any time, as easily as giving it.</li>
          <li><b>Right to nominate</b> — name another person who may exercise your rights in case of death or incapacity.</li>
          <li><b>Right of grievance redressal</b> — see Section 8 below.</li>
        </ul>
        <p>To exercise any right, email us at <a href={`mailto:${SITE.email}`}><b>{SITE.email}</b></a> with the subject line <i>"DPDP Request"</i>.</p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "6. Who we share data with",
    body: (
      <>
        <p>We share the minimum data needed with the following processors, all under strict contractual safeguards:</p>
        <ul>
          <li><b>Cloud hosting</b> — to operate the website and store enrolment records.</li>
          <li><b>Transactional email</b> (Resend) — to send tour confirmations and class updates.</li>
          <li><b>Payment gateway</b> — to process fees (only if you choose to enrol).</li>
        </ul>
        <p>We do not transfer personal data to any country notified as restricted by the Government of India. We do not sell or share data with advertisers.</p>
      </>
    ),
  },
  {
    id: "security",
    title: "7. How we protect your data",
    body: (
      <>
        <ul>
          <li>All data is transmitted only over <b>HTTPS / TLS</b>.</li>
          <li>Sensitive data is <b>never</b> stored in browser localStorage; we only store a one-line consent preference there.</li>
          <li>Access to enrolment data is limited to specific authorised gurus, on a need-to-know basis.</li>
          <li>Regular backups, password-protected class links, and breach response procedures are in place.</li>
        </ul>
        <p>If a personal data breach affecting your information occurs, we will notify you and the Data Protection Board of India without undue delay, as required by the DPDP Act.</p>
      </>
    ),
  },
  {
    id: "grievance",
    title: "8. Grievance redressal",
    body: (
      <>
        <p>If you have a question, complaint or request about your personal data, we want to know — and fix it fast.</p>
        <div className="not-prose mt-3 rounded-2xl bg-amber-50 border-2 border-amber-200 p-5">
          <p className="font-bold text-slate-800">Grievance Officer / DPO contact</p>
          <p className="mt-1 text-slate-700"><b>Little Gurus Academy</b><br/>{SITE.address}<br/>Email: <a href={`mailto:${SITE.grievanceEmail}`} className="text-orange-600 font-semibold">{SITE.grievanceEmail}</a></p>
          <p className="mt-3 text-slate-700"><b>We commit to acknowledging your grievance within 48 hours</b> and providing a final resolution <b>within 30 calendar days</b>, as required by the DPDP Act, 2023.</p>
        </div>
        <p className="mt-3">If you are not satisfied with our response, you may approach the <b>Data Protection Board of India</b> established under Section 18 of the DPDP Act, 2023.</p>
      </>
    ),
  },
  {
    id: "updates",
    title: "9. Updates to this policy",
    body: (
      <>
        <p>We may update this Privacy Policy from time to time. When we do, we'll update the "Last updated" date at the top and, for material changes, notify you by email or via a banner on this site.</p>
      </>
    ),
  },
];

export default function PrivacyPolicy() {
  return (
    <div data-testid="privacy-policy-page">
      <section className="relative overflow-hidden">
        <Blob className="bg-orange-200/40 h-72 w-72 -top-10 -right-10" />
        <Blob className="bg-sky-200/40 h-72 w-72 top-32 -left-20" />
        <div className="relative max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 pt-16 pb-10 sm:pt-24 sm:pb-12">
          <SectionLabel>Legal</SectionLabel>
          <h1 className="mt-3 font-display text-5xl sm:text-6xl font-semibold text-slate-800 leading-[1.05] tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-slate-500">
            Last updated: 1 December 2025 · Effective for all visitors of {SITE.name}
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-100 text-emerald-700 px-4 py-2 text-sm font-bold" data-testid="dpdp-badge">
            <Shield className="h-4 w-4" strokeWidth={2.5} />
            Compliant with India's DPDP Act, 2023
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 grid lg:grid-cols-12 gap-10">
          {/* Sidebar */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28 self-start">
            <div className="rounded-[2rem] bg-white border-2 border-slate-100 p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-orange-500">Data Fiduciary</p>
              <p className="mt-2 font-display text-xl font-semibold text-slate-800">{SITE.dataFiduciary}</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-orange-500" /><span>{SITE.address}</span></li>
                <li className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5 text-orange-500" /><a href={`mailto:${SITE.email}`} className="break-all hover:text-orange-600">{SITE.email}</a></li>
                <li className="flex items-start gap-2"><Clock className="h-4 w-4 mt-0.5 text-orange-500" /><span>{SITE.hours}</span></li>
              </ul>
              <Link to="/contact" data-testid="privacy-contact-link">
                <Button className="mt-5 w-full h-12 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold">Contact us</Button>
              </Link>
            </div>
            <div className="hidden lg:block mt-5 rounded-[2rem] bg-amber-50 border-2 border-amber-100 p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-orange-500">On this page</p>
              <ul className="mt-3 space-y-2 text-sm">
                {SECTIONS.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="text-slate-700 hover:text-orange-600 font-semibold">{s.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-8">
            <FadeIn>
              <p className="text-lg text-slate-700 leading-relaxed">
                {SITE.name} ("we", "us", "our") is committed to protecting your personal data and respecting your privacy. This policy explains what we collect, why we collect it, how we use it, and the rights you have under the <b>Digital Personal Data Protection Act, 2023</b> ("DPDP Act") of India.
              </p>
            </FadeIn>

            <div className="mt-10 space-y-10">
              {SECTIONS.map((s, i) => (
                <FadeIn key={s.id} delay={i * 0.03}>
                  <article id={s.id} className="scroll-mt-28">
                    <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-800">{s.title}</h2>
                    <div className="mt-3 prose prose-slate prose-li:my-1 prose-p:my-2 max-w-none text-slate-700 [&_ul]:list-disc [&_ul]:pl-5 [&_a]:text-orange-600 [&_a:hover]:text-orange-700">
                      {s.body}
                    </div>
                  </article>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grievance redressal CTA */}
      <section id="grievance-redressal" className="pb-20" data-testid="grievance-section">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="rounded-[2rem] bg-slate-900 text-white p-8 sm:p-12 relative overflow-hidden">
            <Blob className="h-72 w-72 -top-20 -right-10 bg-orange-500/30" />
            <div className="relative">
              <SectionLabel>Grievance redressal</SectionLabel>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl font-semibold leading-tight">
                Something doesn't feel right? Tell us. We promise to listen.
              </h2>
              <p className="mt-4 text-slate-300 max-w-2xl">
                Under the DPDP Act, 2023, you have the right to a fast and effective grievance redressal. Write to our Data Protection Officer and we will respond within statutory timelines.
              </p>
              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-orange-300">Acknowledgement</p>
                  <p className="mt-1 font-display text-2xl font-semibold">Within 48 hours</p>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-orange-300">Final resolution</p>
                  <p className="mt-1 font-display text-2xl font-semibold">Within 30 days</p>
                </div>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <a href={`mailto:${SITE.grievanceEmail}?subject=DPDP%20Grievance`} data-testid="grievance-email-btn">
                  <Button className="h-12 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold w-full sm:w-auto">
                    <Mail className="mr-2 h-4 w-4" /> Email the DPO
                  </Button>
                </a>
                <Link to="/terms" data-testid="privacy-terms-link">
                  <Button variant="outline" className="h-12 rounded-full border-2 border-white/30 bg-transparent text-white hover:bg-white/10 font-bold w-full sm:w-auto">
                    <FileText className="mr-2 h-4 w-4" /> Terms of Use
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
