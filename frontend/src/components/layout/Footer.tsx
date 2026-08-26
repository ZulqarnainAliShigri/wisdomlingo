import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { COMPANY } from "../../config/site";
import { FOOTER_GROUPS } from "../../config/navigation";
import { Logo } from "./Logo";

export const Footer: React.FC = () => (
  <footer className="mt-auto bg-slate-900 text-slate-400">
    <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
      <div className="max-w-sm">
        <Logo tone="light" showTagline={false} />
        <p className="mt-5 text-sm leading-relaxed">
          Your trusted partner for educational and professional pathways in Europe.
        </p>
        <div className="mt-6 flex gap-3">
          {[
            { icon: Facebook, label: "Facebook" },
            { icon: Instagram, label: "Instagram" },
            { icon: Linkedin, label: "LinkedIn" },
          ].map(({ icon: Icon, label }) => (
            <a
              key={label}
              href={COMPANY.whatsapp}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-300 transition hover:bg-primary hover:text-white"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>

      {FOOTER_GROUPS.map((group) => (
        <div key={group.title}>
          <h4 className="mb-4 text-sm font-bold text-white">{group.title}</h4>
          <ul className="space-y-2.5 text-sm">
            {group.links.map((link) => (
              <li key={link.label}>
                <Link to={link.to} className="transition hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    <div className="border-t border-slate-800">
      <div className="container-page py-5 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} {COMPANY.name} Education Consultancy. All rights reserved.
      </div>
    </div>
  </footer>
);
