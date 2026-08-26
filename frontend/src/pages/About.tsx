import React from "react";
import { Award, Clock, Globe, Mail, MapPin, Phone } from "lucide-react";
import { COMPANY } from "../config/site";
import { HOME_STATS } from "../data/content";
import { ContactForm } from "../components/public/ContactForm";
import { LocationMap } from "../components/public/LocationMap";
import { HERO_IMAGES } from "../config/media";
import { PageHero } from "../components/ui/PageHero";
import { SectionHeading } from "../components/ui/SectionHeading";
import { Seo } from "../components/Seo";

export const AboutPage: React.FC = () => (
  <>
    <Seo page="about" />
    <PageHero
      image={HERO_IMAGES.about}
      eyebrow="About us"
      title="Fifteen years of sending students abroad the right way"
      subtitle="From a single German classroom to a full consultancy - training, admissions and placement under one roof."
    />

    <section className="section bg-white">
      <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-start">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Who we are"
            title="A consultancy built by teachers, not agents"
            subtitle="When our students asked what came after the certificate, we learned the admission and visa process ourselves."
          />
          <p className="mt-6 text-sm leading-relaxed text-slate-600">
            Today the same team teaches the language, prepares the documents and files the embassy
            application. That is why our advice is specific: we know which German level a Cyprus
            application does not need, and which one a nursing Ausbildung absolutely does. More than
            2,000 students have gone through this process with us across six European destinations.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-6">
              <Award className="h-6 w-6 text-primary" />
              <h3 className="mt-3 font-bold text-slate-900">Our mission</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                To make European education and paid training reachable for ordinary Pakistani
                families, with clear costs and no false promises.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-6">
              <Globe className="h-6 w-6 text-accent" />
              <h3 className="mt-3 font-bold text-slate-900">Our vision</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                A generation of graduates who return with skills, qualifications and language ability
                that raise the standard of work back home.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {HOME_STATS.map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-primary-50 px-5 py-6 text-center">
                <span className="block text-3xl font-extrabold text-primary">{stat.value}</span>
                <span className="mt-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6 sm:p-8">
            <h3 className="text-lg font-bold text-slate-900">Contact details</h3>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent">
                  <Phone className="h-4 w-4" />
                </span>
                <span>
                  <span className="block font-semibold text-slate-900">Phone / WhatsApp</span>
                  <a href={COMPANY.phoneHref} className="text-slate-600 hover:text-primary">
                    {COMPANY.phone}
                  </a>
                </span>
              </li>
              <li className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
                  <Mail className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-slate-900">Email</span>
                  <a
                    href={`mailto:${COMPANY.email}`}
                    className="break-all text-slate-600 hover:text-primary"
                  >
                    {COMPANY.email}
                  </a>
                </span>
              </li>
              <li className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <MapPin className="h-4 w-4" />
                </span>
                <span>
                  <span className="block font-semibold text-slate-900">Office</span>
                  <a
                    href={COMPANY.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-600 transition hover:text-primary"
                  >
                    {COMPANY.address || "View on Google Maps"}
                  </a>
                </span>
              </li>
              <li className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <Clock className="h-4 w-4" />
                </span>
                <span>
                  <span className="block font-semibold text-slate-900">Office hours</span>
                  <span className="text-slate-600">{COMPANY.hours}</span>
                </span>
              </li>
            </ul>
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
    <section className="section bg-slate-50">
      <div className="container-page">
        <SectionHeading
          eyebrow="Visit us"
          title="Find our campus on the map"
          subtitle="Walk-ins welcome during office hours."
        />
        <div className="mt-10">
          <LocationMap />
        </div>
      </div>
    </section>
  </>
);
