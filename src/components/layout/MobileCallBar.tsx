import React, { useState } from "react";
import { Phone } from "lucide-react";
import { useCompany } from "../../hooks/useCompany";
import { EnquiryModal } from "../public/EnquiryModal";

/**
 * Fixed conversion bar, phones and tablets only. The desktop navbar already
 * carries the same two actions, so it is hidden from `lg` up.
 */
export const MobileCallBar: React.FC = () => {
  const COMPANY = useCompany();
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-md gap-3">
          <a
            href={COMPANY.phoneHref}
            className="btn flex-1 border border-accent/40 text-accent hover:bg-accent-50"
          >
            <Phone className="h-4 w-4" /> Call Us
          </a>
          <button
            type="button"
            onClick={() => setEnquiryOpen(true)}
            className="btn-accent flex-1 font-bold"
          >
            Book Free
          </button>
        </div>
      </div>

      <EnquiryModal
        open={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        title="Book a Free Consultation"
        intro="Send us your details and a counsellor will reach out within one working day."
      />
    </>
  );
};
