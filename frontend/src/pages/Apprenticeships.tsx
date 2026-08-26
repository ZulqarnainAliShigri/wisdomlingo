import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Coins, ShieldCheck } from "lucide-react";
import { SEED_APPRENTICESHIPS } from "../data/seed";
import { useRemoteList } from "../hooks/useRemoteList";
import { mapApprenticeship } from "../lib/mappers";
import { Apprenticeship } from "../types";
import { ApprenticeshipCard } from "../components/public/ApprenticeshipCard";
import { FullPageLoader } from "../components/ui/Loader";
import { HERO_IMAGES } from "../config/media";
import { PageHero } from "../components/ui/PageHero";
import { SectionHeading } from "../components/ui/SectionHeading";
import { Seo } from "../components/Seo";
import { StructuredData } from "../components/StructuredData";
import { apprenticeshipListSchema } from "../lib/structuredData";
import { useSeoSettings } from "../hooks/useSeo";

export const ApprenticeshipsPage: React.FC = () => {
  const { items, loading } = useRemoteList<Apprenticeship>(
    "apprenticeships",
    SEED_APPRENTICESHIPS,
    mapApprenticeship
  );

  const { settings } = useSeoSettings();
  const apprenticeshipSchemaData = useMemo(
    () => apprenticeshipListSchema(items, settings.site_url),
    [items, settings.site_url]
  );

  return (
    <>
      <Seo page="apprenticeships" />
      <StructuredData id="apprenticeships" data={apprenticeshipSchemaData} />

      <PageHero
        image={HERO_IMAGES.apprenticeships}
        eyebrow="Apprenticeships"
        title="Get paid while you train in Germany"
        subtitle="A three-year paid contract with a German employer - salary, vocational school, then a job offer."
      />

      <section className="border-b border-slate-200 bg-white py-10">
        <div className="container-page grid gap-6 sm:grid-cols-3">
          {[
            { icon: Coins, title: "Paid from day one", text: "EUR 800 - 1,500 monthly training salary" },
            { icon: Award, title: "Recognised qualification", text: "Valid across the EU after three years" },
            { icon: ShieldCheck, title: "Employer-sponsored visa", text: "Contract first, then the embassy file" },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
                <item.icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-bold text-slate-900">{item.title}</span>
                <span className="block text-sm text-slate-600">{item.text}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="section bg-slate-50">
        <div className="container-page">
          <SectionHeading
            eyebrow="Fields"
            title="Five fields we place candidates in"
            subtitle="Salary, contract length, entry requirements and benefits for each field."
          />

          <div className="mt-10">
            {loading ? (
              <FullPageLoader label="Loading apprenticeships..." />
            ) : (
              <div className="grid gap-6 lg:grid-cols-2">
                {items.map((item) => (
                  <ApprenticeshipCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>

          <div className="mt-14 rounded-2xl bg-primary px-6 py-10 text-center sm:px-12">
            <h3 className="text-2xl font-extrabold text-white">Language first, contract second</h3>
            <p className="mx-auto mt-3 max-w-2xl text-blue-100">
              Almost every Ausbildung needs German B1 or B2. Start now and we approach employers
              as soon as you reach it.
            </p>
            <Link to="/courses" className="btn mt-6 bg-white text-primary hover:bg-blue-50">
              See German courses <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

/* =========================================================================
   13. ABOUT PAGE + CONTACT FORM
   ========================================================================= */
