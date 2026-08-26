import React, { useState, useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { COMPANY } from "../config/site";
import { APPLICATION_STEPS } from "../data/content";
import { SEED_COUNTRIES } from "../data/seed";
import { useRemoteList } from "../hooks/useRemoteList";
import { mapCountry } from "../lib/mappers";
import { StudyCountry } from "../types";
import { CountryCard } from "../components/public/CountryCard";
import { FullPageLoader } from "../components/ui/Loader";
import { HERO_IMAGES } from "../config/media";
import { PageHero } from "../components/ui/PageHero";
import { SectionHeading } from "../components/ui/SectionHeading";
import { Seo } from "../components/Seo";
import { StructuredData } from "../components/StructuredData";
import { destinationListSchema } from "../lib/structuredData";
import { useSeoSettings } from "../hooks/useSeo";

export const StudyAbroadPage: React.FC = () => {
  const { items, loading } = useRemoteList<StudyCountry>("study_countries", SEED_COUNTRIES, mapCountry);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { settings } = useSeoSettings();
  const destinationSchemaData = useMemo(
    () => destinationListSchema(items, settings.site_url),
    [items, settings.site_url]
  );

  return (
    <>
      <Seo page="studyAbroad" />
      <StructuredData id="destinations" data={destinationSchemaData} />

      <PageHero
        image={HERO_IMAGES.studyAbroad}
        eyebrow="Study Abroad"
        title="Six European destinations, one honest assessment"
        subtitle="We shortlist by what your grades, budget and language level actually support."
      />

      <section className="section bg-white">
        <div className="container-page">
          <SectionHeading
            eyebrow="Destinations"
            title="Where our students go"
            subtitle="Open any country for its benefits and required documents."
          />

          <div className="mt-10">
            {loading ? (
              <FullPageLoader label="Loading destinations..." />
            ) : (
              <div className="grid gap-6 lg:grid-cols-2">
                {items.map((country) => (
                  <CountryCard
                    key={country.id}
                    country={country}
                    expanded={expandedId === country.id}
                    onToggle={() =>
                      setExpandedId((current) => (current === country.id ? null : country.id))
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Application process */}
      <section className="section bg-slate-50">
        <div className="container-page">
          <SectionHeading
            eyebrow="How it works"
            title="The application process in four steps"
            subtitle="A typical file takes three to six months from consultation to visa."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {APPLICATION_STEPS.map((step, index) => (
              <div key={step.step} className="relative">
                {index < APPLICATION_STEPS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute left-[calc(50%+2.5rem)] right-[-1.5rem] top-7 hidden h-px bg-slate-300 lg:block"
                  />
                )}
                <div className="card relative h-full p-6 text-center">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white">
                    <step.icon className="h-6 w-6" />
                  </span>
                  <span className="mt-4 block text-xs font-extrabold tracking-[0.2em] text-accent">
                    STEP {step.step}
                  </span>
                  <h3 className="mt-1 text-base font-bold text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a href={COMPANY.whatsapp} target="_blank" rel="noreferrer" className="btn-accent">
              Start my application <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

/* =========================================================================
   12. APPRENTICESHIPS PAGE
   ========================================================================= */
