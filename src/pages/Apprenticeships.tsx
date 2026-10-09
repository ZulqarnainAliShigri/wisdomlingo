import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Coins, ShieldCheck } from "lucide-react";
import { SEED_APPRENTICESHIPS } from "../data/seed";
import { useRemoteList } from "../hooks/useRemoteList";
import { mapApprenticeship } from "../lib/mappers";
import { Apprenticeship } from "../types";
import { ApprenticeshipCard } from "../components/public/ApprenticeshipCard";
import { DetailModal, DetailModalData } from "../components/public/DetailModal";
import { FullPageLoader } from "../components/ui/Loader";
import { HERO_IMAGES } from "../config/media";
import { PageHero } from "../components/ui/PageHero";
import { SectionHeading } from "../components/ui/SectionHeading";
import { Seo } from "../components/Seo";
import { StructuredData } from "../components/StructuredData";
import { apprenticeshipListSchema } from "../lib/structuredData";
import { useSeoSettings } from "../hooks/useSeo";
import { useCompany } from "../hooks/useCompany";

export const AusbildungPage: React.FC = () => {
  const COMPANY = useCompany();
  const [detailData, setDetailData] = useState<DetailModalData | null>(null);
  const { items, loading } = useRemoteList<Apprenticeship>(
    "apprenticeships",
    SEED_APPRENTICESHIPS,
    mapApprenticeship
  );

  const [activeFieldIdx, setActiveFieldIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveFieldIdx((prev) => (prev + 1) % Math.max(1, items.length));
    }, 3400);
    return () => clearInterval(interval);
  }, [isPaused, items.length]);

  const { settings } = useSeoSettings();
  const apprenticeshipSchemaData = useMemo(
    () => apprenticeshipListSchema(items, settings.site_url, COMPANY.legalName),
    [items, settings.site_url, COMPANY.legalName]
  );

  return (
    <>
      <Seo page="apprenticeships" />
      <StructuredData id="apprenticeships" data={apprenticeshipSchemaData} />

      <PageHero
        image={HERO_IMAGES.apprenticeships}
        eyebrow="Ausbildung"
        title="German Paid Ausbildung"
        subtitle="Monthly training salary, dual vocational education, and guaranteed job contracts."
      />

      <section className="border-b border-slate-200 bg-white py-8 sm:py-10">
        <div className="container-page grid gap-6 sm:grid-cols-3">
          {[
            { icon: Coins, title: "Paid from day one", text: "EUR 800 - 1,500 monthly stipend" },
            { icon: Award, title: "Recognised qualification", text: "EU-accredited 3-year vocational degree" },
            { icon: ShieldCheck, title: "Employer-sponsored visa", text: "Signed work contract before visa filing" },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
                <item.icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-bold text-slate-900">{item.title}</span>
                <span className="block text-xs sm:text-sm text-slate-600">{item.text}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section
        className="section bg-slate-50"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="container-page">
          <SectionHeading
            eyebrow="Vocations"
            title="Featured Placement Fields"
            subtitle="Entry requirements, monthly salaries, and 3-year contract terms."
          />

          {/* Animated Runner Beam Track */}
          <div className="relative mt-8 mb-2 hidden sm:block overflow-hidden h-0.5">
            <div className="h-full w-full border-t-2 border-dashed border-slate-300" />
            <div
              className="h-full bg-gradient-to-r from-primary via-primary-500 to-accent transition-all duration-700 ease-out"
              style={{
                width: `${((activeFieldIdx + 1) / Math.max(1, items.length)) * 100}%`,
              }}
            />
            <div
              aria-hidden="true"
              className="animate-beam-runner absolute top-0 h-1.5 w-24 -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent blur-xs"
            />
          </div>

          <div className="mt-8">
            {loading ? (
              <FullPageLoader label="Loading Ausbildung programs..." />
            ) : (
              <div className="grid gap-6 lg:grid-cols-2">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    onClick={() => setActiveFieldIdx(index)}
                    onMouseEnter={() => setActiveFieldIdx(index)}
                  >
                    <ApprenticeshipCard
                      item={item}
                      isActive={activeFieldIdx === index}
                      onDetails={(app) =>
                        setDetailData({
                          title: app.title,
                          subtitle: `${app.field} • ${app.duration}`,
                          category: "German Dual Ausbildung",
                          badge: app.field,
                          badgeColor: "bg-emerald-50 text-emerald-700",
                          image: HERO_IMAGES.apprenticeships,
                          description: app.description,
                          metrics: [
                            { label: "Salary", value: app.salary || "EUR 900 - 1,400" },
                            { label: "Duration", value: app.duration || "3 Years" },
                            { label: "Language Level", value: "B1 or B2 German" },
                          ],
                          points: [
                            ...app.requirements.map((r) => `Requirement: ${r}`),
                            ...app.benefits.map((b) => `Benefit: ${b}`),
                          ],
                          primaryCtaText: `Apply for ${app.title}`,
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
            {items.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveFieldIdx(idx)}
                className={`h-2 rounded-full transition-all duration-500 ${
                  activeFieldIdx === idx
                    ? "w-8 bg-primary"
                    : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label={`Go to ${item.title}`}
              />
            ))}
          </div>

          <div className="mt-12 rounded-2xl bg-primary px-6 py-8 text-center sm:px-12 sm:py-10">
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">Language First, Contract Second</h3>
            <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-blue-100">
              Almost every Ausbildung requires German B1 or B2. Start your classes with WisdomLingo today.
            </p>
            <Link to="/courses" className="btn mt-5 bg-white text-primary hover:bg-blue-50 font-bold">
              Explore German Courses <ArrowRight className="h-4 w-4" />
            </Link>
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

export const ApprenticeshipsPage = AusbildungPage;

/* =========================================================================
   13. ABOUT PAGE + CONTACT FORM
   ========================================================================= */
