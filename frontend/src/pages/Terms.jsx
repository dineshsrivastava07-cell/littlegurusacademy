import { Link } from "react-router-dom";
import { SITE } from "@/lib/data";
import { FadeIn, SectionLabel, Blob } from "@/components/Bits";

const SECTIONS = [
  {
    title: "1. Who we are",
    body: (
      <p>
        These Terms govern your use of the website and services of <b>{SITE.dataFiduciary}</b>, located at {SITE.address} ("Little Gurus", "we", "us"). By using our website or enrolling your child, you agree to these Terms. If you do not agree, please do not use our services.
      </p>
    ),
  },
  {
    title: "2. Who can use Little Gurus",
    body: (
      <>
        <p>Our services are intended for <b>parents and legal guardians residing in India</b> seeking online learning for children aged 2–10.</p>
        <ul>
          <li>You must be 18 years or older to enrol a child.</li>
          <li>You confirm that you are the parent or legal guardian of the child being enrolled.</li>
          <li>Children may use the platform only under parental supervision.</li>
        </ul>
      </>
    ),
  },
  {
    title: "3. Bookings, enrolments and free trial",
    body: (
      <>
        <ul>
          <li>Booking a tour or submitting an enquiry does not by itself create an enrolment contract.</li>
          <li>An enrolment is confirmed only after we accept your application and receive the applicable fee.</li>
          <li>Free trial classes are offered once per family and at our discretion.</li>
        </ul>
      </>
    ),
  },
  {
    title: "4. Fees, payments and refunds",
    body: (
      <>
        <ul>
          <li>All fees are listed in Indian Rupees (₹) and are payable in advance for the chosen billing cycle (monthly or quarterly).</li>
          <li>We may revise fees with at least 30 days' notice; existing paid cycles are honoured at the original price.</li>
          <li><b>Refund policy:</b> If your child attends 2 or fewer sessions in a billing cycle and you request cancellation in writing, we will refund the unused portion on a pro-rata basis within 14 working days. After 2 attended sessions in a cycle, refunds are not available.</li>
          <li>Sibling discounts, scholarships and promotional offers cannot be combined.</li>
        </ul>
      </>
    ),
  },
  {
    title: "5. Code of conduct",
    body: (
      <>
        <p>To keep classes safe and joyful for every child, we expect parents, children and our gurus to:</p>
        <ul>
          <li>Be kind, respectful and inclusive at all times.</li>
          <li>Avoid recording, screenshotting or distributing class content without written permission.</li>
          <li>Refrain from sharing class links with anyone outside the enrolled family.</li>
          <li>Report any safety concern immediately to <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.</li>
        </ul>
        <p>We reserve the right to suspend or terminate access for violations of this code, with refund where appropriate.</p>
      </>
    ),
  },
  {
    title: "6. Intellectual property",
    body: (
      <p>
        All curriculum, lesson plans, worksheets, recordings, videos, brand assets and content available through Little Gurus are owned by us or our licensors and are protected under Indian copyright and trademark law. You may use them only for your enrolled child's personal, non-commercial learning.
      </p>
    ),
  },
  {
    title: "7. Privacy and data protection",
    body: (
      <p>
        Your personal data is handled per our <Link to="/privacy-policy"><b>Privacy Policy</b></Link>, which is compliant with India's Digital Personal Data Protection Act, 2023. By using our services you acknowledge and consent to the data practices described there.
      </p>
    ),
  },
  {
    title: "8. Service availability",
    body: (
      <p>
        We work hard to keep classes running on schedule, but we are not liable for interruptions caused by your internet connectivity, device issues, force majeure events, or scheduled maintenance. Missed live sessions can be made up via recordings within the same billing cycle.
      </p>
    ),
  },
  {
    title: "9. Limitation of liability",
    body: (
      <p>
        To the maximum extent permitted by Indian law, our total liability to you for any claim arising from your use of Little Gurus shall not exceed the fees you paid us in the three (3) months preceding the claim.
      </p>
    ),
  },
  {
    title: "10. Governing law & jurisdiction",
    body: (
      <p>
        These Terms are governed by the laws of India. Any dispute shall be subject to the exclusive jurisdiction of the courts at <b>Gurugram, Haryana</b>.
      </p>
    ),
  },
  {
    title: "11. Changes to these Terms",
    body: (
      <p>
        We may update these Terms from time to time. We'll post the updated version here with a new "Last updated" date and, for material changes, notify enrolled families by email at least 14 days before they take effect.
      </p>
    ),
  },
  {
    title: "12. Contact",
    body: (
      <p>
        Questions about these Terms? Email us at <a href={`mailto:${SITE.email}`}><b>{SITE.email}</b></a> or write to {SITE.dataFiduciary}, {SITE.address}.
      </p>
    ),
  },
];

export default function Terms() {
  return (
    <div data-testid="terms-page">
      <section className="relative overflow-hidden">
        <Blob className="bg-sky-200/40 h-72 w-72 -top-10 -right-10" />
        <Blob className="bg-amber-200/40 h-72 w-72 top-32 -left-20" />
        <div className="relative max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 pt-16 pb-10 sm:pt-24 sm:pb-12">
          <SectionLabel>Legal</SectionLabel>
          <h1 className="mt-3 font-display text-5xl sm:text-6xl font-semibold text-slate-800 leading-[1.05] tracking-tight">
            Terms of Use
          </h1>
          <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-slate-500">
            Last updated: 1 December 2025
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12 space-y-10">
          {SECTIONS.map((s, i) => (
            <FadeIn key={i} delay={i * 0.02}>
              <article>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-800">{s.title}</h2>
                <div className="mt-3 prose prose-slate prose-li:my-1 prose-p:my-2 max-w-none text-slate-700 [&_ul]:list-disc [&_ul]:pl-5 [&_a]:text-orange-600 [&_a:hover]:text-orange-700">
                  {s.body}
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </section>
    </div>
  );
}
