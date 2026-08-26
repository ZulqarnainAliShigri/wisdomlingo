import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowRight, Menu, Phone, ShieldCheck, X } from "lucide-react";
import { COMPANY } from "../../config/site";
import { NAV_LINKS, PRIMARY_NAV } from "../../config/navigation";
import { useAuth } from "../../hooks/useAuth";
import { Logo } from "./Logo";

export const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { session } = useAuth();
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `whitespace-nowrap text-sm font-semibold transition ${
      isActive ? "text-primary" : "text-slate-600 hover:text-slate-900"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      {/* Three equal-outer columns from lg up, so the links sit centred in the header. */}
      <nav
        className="container-page flex h-16 items-center justify-between gap-6 lg:grid lg:grid-cols-[1fr_auto_1fr]"
        aria-label="Main"
      >
        <Link to="/" className="shrink-0 lg:justify-self-start" aria-label="WisdomLingo home">
          <Logo showTagline={false} />
        </Link>

        <div className="hidden items-center gap-5 lg:flex lg:justify-self-center xl:gap-8">
          {PRIMARY_NAV.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex lg:justify-self-end xl:gap-3">
          {session ? (
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
            >
              <ShieldCheck className="h-4 w-4" /> Dashboard
            </Link>
          ) : null}
          <a
            href={COMPANY.phoneHref}
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-accent/40 px-3 py-2 text-sm font-semibold text-accent transition hover:bg-accent-50 xl:px-4"
          >
            <Phone className="h-4 w-4" /> Call Us
          </a>
          <a
            href={COMPANY.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-700 xl:px-4"
          >
            Free Consultation
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 lg:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-slate-200 bg-white lg:hidden">
          <div className="container-page space-y-1 py-4">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `block rounded-lg px-4 py-3 text-base font-semibold transition ${
                    isActive ? "bg-primary-50 text-primary" : "text-slate-700 hover:bg-slate-50"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to={session ? "/admin/dashboard" : "/admin"}
              className="block rounded-lg px-4 py-3 text-base font-semibold text-slate-700 hover:bg-slate-50"
            >
              {session ? "Admin Dashboard" : "Admin Login"}
            </Link>
            <div className="grid gap-2 pt-3">
              <a href={COMPANY.whatsapp} target="_blank" rel="noreferrer" className="btn-accent w-full">
                Free Consultation <ArrowRight className="h-4 w-4" />
              </a>
              <a href={COMPANY.phoneHref} className="btn-outline w-full">
                <Phone className="h-4 w-4" /> {COMPANY.phone}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
