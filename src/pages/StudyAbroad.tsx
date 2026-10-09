import React, { useState, useMemo, useEffect } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useCompany } from "../hooks/useCompany";
import { APPLICATION_STEPS, COUNTRY_PHOTOS } from "../data/content";
import { SEED_COUNTRIES } from "../data/seed";
import { useRemoteList } from "../hooks/useRemoteList";
import { mapCountry } from "../lib/mappers";
import { StudyCountry } from "../types";
import { CountryCard } from "../components/public/CountryCard";
import { DetailModal, DetailModalData } from "../components/public/DetailModal";
import { FullPageLoader } from "../components/ui/Loader";
import { HERO_IMAGES } from "../config/media";
import { PageHero } from "../components/ui/PageHero";
import { SectionHeading } from "../components/ui/SectionHeading";
import { Seo } from "../components/Seo";
import { StructuredData } from "../components/StructuredData";
import { destinationListSchema } from "../lib/structuredData";
import { useSeoSettings } from "../hooks/useSeo";

export const StudyAbroadPage: React.FC = () => {
  const COMPANY = useCompany();
  const { items, loading } = useRemoteList<StudyCountry>("study_countries", SEED_COUNTRIES, mapCountry);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [detailData, setDetailData] = useState<DetailModalData | null>(null);

  // Animated Application Steps
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % APPLICATION_STEPS.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Animated Destinations State
  const [activeDestIdx, setActiveDestIdx] = useState(0);
  const [isDestPaused, setIsDestPaused] = useState(false);

  useEffect(() => {
    if (isDestPaused) return;
    const interval = setInterval(() => {
      setActiveDestIdx((prev) => (prev + 1) % Math.max(1, items.length));
    }, 3600);
    return () => clearInterval(interval);
  }, [isDestPaused, items.length]);

  const { settings } = useSeoSettings();
  const destinationSchemaData = useMemo(
    () => destinationListSchema(items, settings.site_url, COMPANY.legalName),
    [items, settings.site_url, COMPANY.legalName]
  );

  return (
    <>
      <Seo page="studyAbroad" />
      <StructuredData id="destinations" data={destinationSchemaData} />

      <PageHero
        image={HERO_IMAGES.studyAbroad}
        eyebrow="Study Abroad"
        title="European University Admissions"
        subtitle="Tuition-free degrees, merit scholarships, and end-to-end embassy filing."
      />

      <section
        className="section bg-white"
        onMouseEnter={() => setIsDestPaused(true)}
        onMouseLeave={() => setIsDestPaused(false)}
      >
        <div className="container-page">
          <SectionHeading
            eyebrow="Destinations"
            title="Where Our Students Go"
            subtitle="Explore admission rules, tuition structures, and post-study work permits."
          />

          {/* Animated Runner Beam Track */}
          <div className="relative mt-8 mb-2 hidden sm:block overflow-hidden h-0.5">
            <div className="h-full w-full border-t-2 border-dashed border-slate-300" />
            <div
              className="h-full bg-gradient-to-r from-primary via-primary-500 to-accent transition-all duration-700 ease-out"
              style={{
                width: `${((activeDestIdx + 1) / Math.max(1, items.length)) * 100}%`,
              }}
            />
            <div
              aria-hidden="true"
              className="animate-beam-runner absolute top-0 h-1.5 w-24 -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent blur-xs"
            />
          </div>

          <div className="mt-8">
            {loading ? (
              <FullPageLoader label="Loading destinations..." />
            ) : (
              <div className="grid gap-6 lg:grid-cols-2">
                {items.map((country, index) => (
                  <div
                    key={country.id}
                    onClick={() => setActiveDestIdx(index)}
                    onMouseEnter={() => setActiveDestIdx(index)}
                  >
                    <CountryCard
                      country={country}
                      isActive={activeDestIdx === index}
                      expanded={expandedId === country.id}
                      onToggle={() =>
                        setExpandedId((current) => (current === country.id ? null : country.id))
                      }
                      onDetails={(c) =>
                        setDetailData({
                          title: `${c.name} Study Pathway`,
                          subtitle: c.tagline,
                          category: "European Destination",
                          badge: c.tuition || "Low Tuition",
                          badgeColor: "bg-primary-50 text-primary",
                          image: COUNTRY_PHOTOS[c.name] || HERO_IMAGES.studyAbroad,
                          description: c.description,
                          metrics: [
                            { label: "Tuition", value: c.tuition || "Varies" },
                            { label: "Intakes", value: c.intake || "Fall / Spring" },
                            { label: "Language", value: "English / German" },
                          ],
                          points: [
                            ...c.benefits,
                            ...c.requirements.map((r) => `Requirement: ${r}`),
                          ],
                          primaryCtaText: `Apply for ${c.name}`,
                          onPrimaryCta: () => {
                            window.open(COMPANY.whatsapp, "_blank");
                          },
                          secondaryCtaText: "WhatsApp Counsellor",
                          secondaryCtaLink: COMPANY.whatsapp,
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interactive Step Dots */}
          <div className="mt-8 flex items-center justify-center gap-2">
            {items.map((country, idx) => (
              <button
                key={country.id}
                type="button"
                onClick={() => setActiveDestIdx(idx)}
                className={`h-2 rounded-full transition-all duration-500 ${
                  activeDestIdx === idx
                    ? "w-8 bg-primary"
                    : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label={`Go to ${country.name}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Application process — Animated like the Process Section */}
      <section
        className="section bg-slate-50"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="container-page">
          <SectionHeading
            eyebrow="How It Works"
            title="The 4-Step Application Pathway"
            subtitle="Clear milestones from initial assessment to your embassy appointment."
          />

          <div className="relative mt-12">
            {/* Desktop timeline track base */}
            <div
              aria-hidden="true"
              className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-0.5 lg:block overflow-hidden"
            >
              <div className="h-full w-full border-t-2 border-dashed border-slate-300" />
            </div>

            {/* Desktop active progress line */}
            <div
              aria-hidden="true"
              className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-0.5 lg:block overflow-hidden"
            >
              <div
                className="h-full bg-gradient-to-r from-primary via-blue-500 to-accent transition-all duration-700 ease-out"
                style={{
                  width: `${(activeStep / (APPLICATION_STEPS.length - 1)) * 100}%`,
                }}
              />
            </div>

            {/* Glowing runner beam */}
            <div
              aria-hidden="true"
              className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-0.5 lg:block overflow-hidden pointer-events-none"
            >
              <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-accent to-transparent animate-beam-runner opacity-90" />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {APPLICATION_STEPS.map((step, index) => {
                const isActive = activeStep === index;
                const isPassed = activeStep > index;

                return (
                  <div
                    key={step.step}
                    onClick={() => setActiveStep(index)}
                    className={`card relative h-full p-6 text-center cursor-pointer transition-all duration-300 ${
                      isActive
                        ? "border-primary/50 shadow-xl shadow-primary/10 ring-2 ring-primary/25 scale-102 bg-white"
                        : isPassed
                        ? "border-slate-200 bg-white"
                        : "border-slate-200/70 bg-white/70 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <span
                      className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 ${
                        isActive
                          ? "bg-primary text-white shadow-lg shadow-primary/30 scale-110"
                          : isPassed
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <step.icon className={`h-6 w-6 ${isActive ? "animate-wiggle" : ""}`} />
                    </span>

                    <span
                      className={`mt-4 block text-xs font-extrabold tracking-[0.2em] uppercase ${
                        isActive ? "text-accent" : "text-slate-400"
                      }`}
                    >
                      STEP {step.step}
                    </span>

                    <h3
                      className={`mt-1 text-base font-bold transition-colors ${
                        isActive ? "text-primary" : "text-slate-900"
                      }`}
                    >
                      {step.title}
                    </h3>

                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 line-clamp-2">
                      {step.description}
                    </p>

                    {isActive && (
                      <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                        <Sparkles className="h-3 w-3 text-accent" /> Active Stage
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Interactive Step Dots */}
            <div className="mt-8 flex items-center justify-center gap-2">
              {APPLICATION_STEPS.map((step, idx) => (
                <button
                  key={step.step}
                  type="button"
                  onClick={() => setActiveStep(idx)}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    activeStep === idx
                      ? "w-8 bg-primary"
                      : "w-2 bg-slate-300 hover:bg-slate-400"
                  }`}
                  aria-label={`Go to Step ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-10 text-center">
            <a href={COMPANY.whatsapp} target="_blank" rel="noreferrer" className="btn-accent">
              Start My Application <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Details Popup Modal */}
      <DetailModal
        open={Boolean(detailData)}
        onClose={() => setDetailData(null)}
        data={detailData}
      />
    </>
  );
};

/* =========================================================================
   12. AUSBILDUNG PAGE
   ========================================================================= */
