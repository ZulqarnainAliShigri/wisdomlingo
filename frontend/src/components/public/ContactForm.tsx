import React, { useId, useState } from "react";
import { Send } from "lucide-react";
import { toast } from "react-toastify";
import { COMPANY, SUBJECT_OPTIONS } from "../../config/site";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";
import { emailPattern, errorMessage } from "../../lib/utils";
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
  /** Called after the enquiry is stored, so a modal can close itself. */
  onSent?: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  variant = "card",
  defaultSubject = "",
  onSent,
}) => {
  const [form, setForm] = useState<ContactFormState>({
    ...EMPTY_CONTACT,
    subject: defaultSubject,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    if (!isSupabaseConfigured) {
      toast.info("Backend not connected yet - please call or WhatsApp us at " + COMPANY.phone + ".");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("contact_submissions").insert([
        {
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          subject: form.subject,
          message: form.message.trim(),
        },
      ]);
      if (error) throw error;
      toast.success("Thank you! Your message has been sent - we reply within one working day.");
      setForm({ ...EMPTY_CONTACT, subject: defaultSubject });
      onSent?.();
    } catch (error) {
      toast.error(errorMessage(error, "Could not send your message. Please try again."));
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
        <>
          <h3 className="text-xl font-bold text-slate-900">Send us a message</h3>
          <p className="mt-1 text-sm text-slate-500">
            Fill in the form and a counsellor will get back to you within one working day.
          </p>
        </>
      )}

      <div className={`grid gap-5 sm:grid-cols-2 ${isCard ? "mt-6" : ""}`}>
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
            Email *
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
            Phone *
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
            placeholder="Tell us about your qualification, target country and preferred intake."
          />
          {fieldError("message")}
        </div>
      </div>

      <button
        type="submit"
        className={`btn-accent mt-6 ${isCard ? "w-full sm:w-auto" : "w-full"}`}
        disabled={submitting}
      >
        {submitting ? <Spinner /> : <Send className="h-4 w-4" />}
        {submitting ? "Sending..." : "Send message"}
      </button>
    </form>
  );
};
