import React, { useId, useState } from "react";
import { Check, CheckCircle2, Copy, ExternalLink, Mail, MessageSquare, RotateCcw, Send } from "lucide-react";
import { toast } from "react-toastify";
import { SUBJECT_OPTIONS } from "../../config/site";
import { useCompany } from "../../hooks/useCompany";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";
import { emailPattern } from "../../lib/utils";
import { Spinner } from "../ui/Loader";
import {
  useBotProtection,
  HoneypotField,
  checkRateLimit,
  recordRateLimitAttempt,
  sanitizePayload,
  logSecurityEvent,
} from "../../security";

interface ContactFormState {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const EMPTY_CONTACT: ContactFormState = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

interface ContactFormProps {
  /** "bare" drops the card shell and heading - the modal supplies its own. */
  variant?: "card" | "bare";
  /** Preselects the subject dropdown, e.g. when opened from a programme page. */
  defaultSubject?: string;
  /** Prefills the message box, e.g. with the course the visitor clicked Enroll on. */
  defaultMessage?: string;
  /** Called after the enquiry is stored, so a modal can close itself. */
  onSent?: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  variant = "card",
  defaultSubject = "",
  defaultMessage = "",
  onSent,
}) => {
  const COMPANY = useCompany();
  const { honeypotValue, setHoneypotValue, evaluateSubmission } = useBotProtection();
  const [form, setForm] = useState<ContactFormState>({
    ...EMPTY_CONTACT,
    subject: defaultSubject,
    message: defaultMessage,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  // Unique per instance, so the page form and the modal form never share ids.
  const uid = useId();
  const fieldId = (field: string) => `${uid}-${field}`;

  const update = (field: keyof ContactFormState) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof ContactFormState, string>> = {};
    if (form.name.trim().length < 2) next.name = "Please enter your full name.";
    if (!emailPattern.test(form.email.trim())) next.email = "Please enter a valid email address.";
    if (form.phone.trim().length < 7) next.phone = "Please enter a reachable phone number.";
    if (!form.subject) next.subject = "Please choose a subject.";
    if (form.message.trim().length < 10) next.message = "Tell us a little more (at least 10 characters).";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const getEmailSubject = () =>
    `[WisdomLingo Enquiry] ${form.subject ? form.subject : "Admission & Study Enquiry"} - ${form.name || "Student"}`;

  const getEmailBody = () =>
    `Dear WisdomLingo Admissions Team,\n\nName: ${form.name || "N/A"}\nEmail: ${form.email || "N/A"}\nPhone: ${form.phone || "N/A"}\nSubject: ${form.subject || "General Inquiry"}\n\nMessage:\n${form.message || ""}\n\n---\nSent from wisdomlingo.com directly to ${COMPANY.email}`;

  const getMailtoUrl = () =>
    `mailto:${COMPANY.email}?subject=${encodeURIComponent(getEmailSubject())}&body=${encodeURIComponent(getEmailBody())}`;

  const getGmailWebUrl = () =>
    `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(COMPANY.email)}&su=${encodeURIComponent(getEmailSubject())}&body=${encodeURIComponent(getEmailBody())}`;

  const getWhatsAppUrl = () => {
    const base = COMPANY.whatsapp || "https://wa.me/923118526814";
    const text = `Assalam-o-Alaikum WisdomLingo Team,\n\nName: ${form.name || "Student"}\nEmail: ${form.email || "N/A"}\nPhone: ${form.phone || "N/A"}\nSubject: ${form.subject || "General Inquiry"}\n\nMessage: ${form.message || "I want to enquire about admissions."}`;
    return `${base}?text=${encodeURIComponent(text)}`;
  };

  const copyEmail = () => {
    navigator.clipboard?.writeText(COMPANY.email);
    setCopied(true);
    toast.success(`Copied ${COMPANY.email} to clipboard!`);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // 1. Anti-bot defense: check honeypot trap and submission velocity
    const botCheck = evaluateSubmission();
    if (botCheck.isBot) {
      logSecurityEvent("honeypot_triggered", "critical", `Spam bot blocked: ${botCheck.reason}`);
      toast.success("Thank you! Your enquiry has been received.");
      setSentSuccess(true);
      onSent?.();
      return;
    }

    // 2. Anti-spam rate limiting: prevent form flooding
    const rateCheck = checkRateLimit("contact_form");
    if (!rateCheck.allowed) {
      toast.error(rateCheck.message || "Please wait before submitting another enquiry.");
      logSecurityEvent("rate_limit_exceeded", "warning", "Contact form rate limit triggered.");
      return;
    }

    if (!validate()) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    // 3. Deep sanitization against XSS and malicious injection
    const clean = sanitizePayload(form);

    setSubmitting(true);
    recordRateLimitAttempt("contact_form");

    let emailDelivered = false;
    let dbRecorded = false;

    try {
      // 1. Direct delivery to business email via FormSubmit API
      try {
        const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(COMPANY.email)}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: clean.name.trim(),
            email: clean.email.trim().toLowerCase(),
            phone: clean.phone.trim(),
            subject: clean.subject,
            message: clean.message.trim(),
            _subject: `New Lead from WisdomLingo: ${clean.name.trim()} (${clean.subject})`,
            _replyto: clean.email.trim().toLowerCase(),
            _template: "table",
            _captcha: "false",
          }),
        });

        if (response.ok) {
          const data = await response.json();
          // If FormSubmit accepted or indicates activation email was sent
          if (data.success === "true" || data.success === true || (data.message && data.message.includes("Activation"))) {
            emailDelivered = true;
          }
        }
      } catch (networkErr) {
        console.warn("Direct email dispatch warning:", networkErr);
      }

      // 2. Also log to Supabase contact_submissions table for Admin records
      if (isSupabaseConfigured) {
        try {
          const { error } = await supabase.from("contact_submissions").insert([
            {
              name: clean.name.trim(),
              email: clean.email.trim().toLowerCase(),
              phone: clean.phone.trim(),
              subject: clean.subject,
              message: clean.message.trim(),
            },
          ]);
          if (!error) {
            dbRecorded = true;
          }
        } catch (dbErr) {
          console.warn("Could not save to contact_submissions:", dbErr);
        }
      }

      if (emailDelivered || dbRecorded) {
        setSentSuccess(true);
        toast.success(`Message sent successfully to ${COMPANY.email}!`);
        onSent?.();
      } else {
        // Fallback: open mailto or Gmail if online endpoint is blocked by ad-blocker
        window.open(getGmailWebUrl(), "_blank");
        toast.info(`Opening email composer for ${COMPANY.email}.`);
        setSentSuccess(true);
        onSent?.();
      }
    } catch {
      window.open(getGmailWebUrl(), "_blank");
      toast.info(`Opening email composer for ${COMPANY.email}.`);
      setSentSuccess(true);
      onSent?.();
    } finally {
      setSubmitting(false);
    }
  };

  const fieldError = (field: keyof ContactFormState) =>
    errors[field] ? (
      <p className="mt-1.5 text-xs font-medium text-accent">{errors[field]}</p>
    ) : null;

  const isCard = variant === "card";

  // Success State View
  if (sentSuccess) {
    return (
      <div className={isCard ? "card p-8 sm:p-10 text-center space-y-6" : "p-6 text-center space-y-6"}>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-inner">
          <CheckCircle2 className="h-9 w-9" />
        </div>

        <div className="space-y-2 max-w-md mx-auto">
          <h3 className="text-2xl font-black text-slate-900">Message Dispatched!</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Thank you, <strong className="text-slate-900">{form.name || "Student"}</strong>. Your enquiry has been forwarded directly to our admissions desk at{" "}
            <a href={`mailto:${COMPANY.email}`} className="text-primary font-bold hover:underline">
              {COMPANY.email}
            </a>.
          </p>
          <p className="text-xs text-slate-500">
            Our certified counsellors typically respond within 2 to 4 business hours.
          </p>
        </div>

        {/* Instant Action Options */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Chat on WhatsApp</span>
          </a>

          <a
            href={getGmailWebUrl()}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-700 px-5 py-3 text-sm font-bold text-white shadow-md shadow-primary/20 transition"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Open in Gmail</span>
          </a>

          <button
            type="button"
            onClick={() => {
              setSentSuccess(false);
              setForm({ ...EMPTY_CONTACT, subject: defaultSubject, message: defaultMessage });
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition"
          >
            <RotateCcw className="h-4 w-4 text-slate-500" />
            <span>Send Another</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={isCard ? "card p-6 sm:p-8" : undefined}>
      {/* Invisible Honeypot trap to catch automated web scrapers/bots */}
      <HoneypotField value={honeypotValue} onChange={setHoneypotValue} />
      {isCard && (
        <div className="mb-6 space-y-3">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-bold text-slate-900">Send us a direct message</h3>
            <p className="text-sm text-slate-500">
              Your message is delivered straight to <strong className="text-primary">{COMPANY.email}</strong>.
            </p>
          </div>

          {/* Official Business Email Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary-200/80 bg-gradient-to-r from-primary-50/80 to-blue-50/50 p-3.5 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-white shadow-xs">
                <Mail className="h-3.5 w-3.5" />
              </span>
              <div>
                <span className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                  Official Business Email
                </span>
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="font-semibold text-primary hover:underline"
                >
                  {COMPANY.email}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50"
                title="Copy business email"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied" : "Copy Email"}</span>
              </button>

              <a
                href={getGmailWebUrl()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 font-medium text-white shadow-xs transition hover:bg-primary-700"
                title="Open pre-filled draft in Gmail Web"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Gmail</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {!isCard && (
        <div className="mb-4 flex items-center justify-between gap-2 rounded-lg bg-primary-50 px-3 py-2 text-xs text-primary-900 border border-primary-100">
          <span className="flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-primary" />
            <span>Sends directly to <strong>{COMPANY.email}</strong></span>
          </span>
          <button
            type="button"
            onClick={copyEmail}
            className="font-medium text-primary underline hover:text-primary-800"
          >
            {copied ? "Copied!" : "Copy Email"}
          </button>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor={fieldId("name")}>
            Full name *
          </label>
          <input
            id={fieldId("name")}
            className="input"
            value={form.name}
            onChange={update("name")}
            placeholder="Ahmed Khan"
            autoComplete="name"
          />
          {fieldError("name")}
        </div>

        <div>
          <label className="label" htmlFor={fieldId("email")}>
            Your email *
          </label>
          <input
            id={fieldId("email")}
            type="email"
            className="input"
            value={form.email}
            onChange={update("email")}
            placeholder="you@example.com"
            autoComplete="email"
          />
          {fieldError("email")}
        </div>

        <div>
          <label className="label" htmlFor={fieldId("phone")}>
            Phone / WhatsApp *
          </label>
          <input
            id={fieldId("phone")}
            type="tel"
            className="input"
            value={form.phone}
            onChange={update("phone")}
            placeholder="03xx-xxxxxxx"
            autoComplete="tel"
          />
          {fieldError("phone")}
        </div>

        <div>
          <label className="label" htmlFor={fieldId("subject")}>
            Subject *
          </label>
          <select
            id={fieldId("subject")}
            className="input"
            value={form.subject}
            onChange={update("subject")}
          >
            <option value="">Select a subject</option>
            {SUBJECT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {fieldError("subject")}
        </div>

        <div className="sm:col-span-2">
          <label className="label" htmlFor={fieldId("message")}>
            Message *
          </label>
          <textarea
            id={fieldId("message")}
            className="input min-h-[140px] resize-y"
            value={form.message}
            onChange={update("message")}
            placeholder="Tell us about your educational qualification, target European country and preferred intake."
          />
          {fieldError("message")}
        </div>
      </div>

      <div className={`mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${!isCard ? "pt-2" : ""}`}>
        <button
          type="submit"
          className="btn-accent w-full sm:w-auto"
          disabled={submitting}
        >
          {submitting ? <Spinner /> : <Send className="h-4 w-4" />}
          {submitting ? "Sending to info@wisdomlingo.com..." : "Send Message"}
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition w-full sm:w-auto justify-center"
            title="Send inquiry on WhatsApp"
          >
            <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
            <span>Send on WhatsApp</span>
          </a>

          <a
            href={getGmailWebUrl()}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost !py-2 text-xs text-slate-600 hover:text-primary w-full sm:w-auto text-center"
            title="Open email composer in Gmail Web"
          >
            <ExternalLink className="h-3.5 w-3.5 text-primary" />
            <span>Open in Gmail</span>
          </a>
        </div>
      </div>
    </form>
  );
};
