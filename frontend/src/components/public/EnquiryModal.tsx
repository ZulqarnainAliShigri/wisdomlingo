import React from "react";
import { Modal } from "../ui/Modal";
import { ContactForm } from "./ContactForm";

/**
 * The enquiry form in a dialog, for call-to-action buttons that should not send
 * the visitor off to another page. Submissions land in `contact_submissions`,
 * the same table the admin Messages inbox reads.
 */
export const EnquiryModal: React.FC<{
  open: boolean;
  onClose: () => void;
  title?: string;
  intro?: string;
  defaultSubject?: string;
}> = ({
  open,
  onClose,
  title = "Start your journey",
  intro = "Tell us where you are now and where you want to go. A counsellor replies within one working day.",
  defaultSubject,
}) => (
  <Modal open={open} title={title} onClose={onClose} width="max-w-xl">
    <p className="mb-5 text-sm leading-relaxed text-slate-600">{intro}</p>
    <ContactForm variant="bare" defaultSubject={defaultSubject} onSent={onClose} />
  </Modal>
);
