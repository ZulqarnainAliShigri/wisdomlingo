import React, { useId, useState } from "react";
import { Check, Copy, ExternalLink, Mail, Send } from "lucide-react";
import { toast } from "react-toastify";
import { SUBJECT_OPTIONS } from "../../config/site";
import { useCompany } from "../../hooks/useCompany";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";
import { emailPattern } from "../../lib/utils";
import { Spinner } from "../ui/Loader";

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
  const [form, setForm] = useState<ContactFormState>({
    ...EMPTY_CONTACT,
    subject: defaultSubject,
    message: defaultMessage,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const copyEmail = () => {
    navigator.clipboard?.writeText(COMPANY.email);
    setCopied(true);
    toast.success(`Copied ${COMPANY.email} to clipboard!`);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setSubmitting(true);
    try {
      if (isSupabaseConfigured) {
        await supabase.from("contact_submissions").insert([
          {
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            phone: form.phone.trim(),
            subject: form.subject,
            message: form.message.trim(),
          },
        ]);
      }

      // Trigger direct email sending via mailto link
      const mailtoUrl = getMailtoUrl();
      window.location.href = mailtoUrl;

      toast.success(
        `Thank you! Opening your email app to send directly to ${COMPANY.email}.`
      );
      setForm({ ...EMPTY_CONTACT, subject: defaultSubject, message: defaultMessage });
      onSent?.();
    } catch {
      // In case of any database error, still provide the direct email link
      window.location.href = getMailtoUrl();
      toast.info(`Opening email draft directly to ${COMPANY.email}.`);
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

  return (
    <form onSubmit={handleSubmit} noValidate className={isCard ? "card p-6 sm:p-8" : undefined}>
      {isCard && (
        <div className="mb-6 space-y-3">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-bold text-slate-900">Send us a message</h3>
            <p className="text-sm text-slate-500">
              Fill in the form to send an email directly to our admissions counsellors.
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
                <span>Gmail Web</span>
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
          {submitting ? "Preparing Email..." : "Send Email Directly"}
        </button>

        <div className="flex flex-wrap items-center gap-2">
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

          <a
            href={`mailto:${COMPANY.email}`}
            className="btn-ghost !py-2 text-xs text-slate-600 hover:text-primary w-full sm:w-auto text-center"
            title="Open default email application"
          >
            <Mail className="h-3.5 w-3.5 text-slate-500" />
            <span>Open Mail App</span>
          </a>
        </div>
      </div>
    </form>
  );
};
