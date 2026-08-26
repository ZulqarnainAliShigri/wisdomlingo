import React, { useMemo, useState } from "react";
import { BookOpen, Phone } from "lucide-react";
import { COMPANY } from "../config/site";
import { CATEGORY_TABS } from "../data/content";
import { SEED_COURSES } from "../data/seed";
import { useRemoteList } from "../hooks/useRemoteList";
import { mapCourse } from "../lib/mappers";
import { Course, CourseCategory } from "../types";
import { CourseCard } from "../components/public/CourseCard";
import { EmptyState } from "../components/ui/EmptyState";
import { FullPageLoader } from "../components/ui/Loader";
import { HERO_IMAGES } from "../config/media";
import { PageHero } from "../components/ui/PageHero";
import { Seo } from "../components/Seo";
import { StructuredData } from "../components/StructuredData";
import { courseListSchema } from "../lib/structuredData";
import { useSeoSettings } from "../hooks/useSeo";

export const CoursesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CourseCategory>("german");
  const { items, loading } = useRemoteList<Course>("courses", SEED_COURSES, mapCourse);

  const filtered = useMemo(
    () => items.filter((course) => course.category === activeTab),
    [items, activeTab]
  );
  const activeMeta = CATEGORY_TABS.find((tab) => tab.key === activeTab);

  const { settings } = useSeoSettings();
  const courseSchemaData = useMemo(
    () => courseListSchema(items, settings.site_url),
    [items, settings.site_url]
  );

  return (
    <>
      <Seo page="courses" />
      <StructuredData id="courses" data={courseSchemaData} />

      <PageHero
        image={HERO_IMAGES.courses}
        eyebrow="Courses"
        title="Language and religious courses taught by certified teachers"
        subtitle="Small batches and exam-focused practice, on campus or online."
      />

      <section className="section bg-white">
        <div className="container-page">
          {/* Tabs */}
          <div
            role="tablist"
            aria-label="Course categories"
            className="mx-auto grid max-w-3xl grid-cols-1 gap-2 rounded-2xl bg-slate-100 p-2 sm:grid-cols-3"
          >
            {CATEGORY_TABS.map((tab) => {
              const isActive = tab.key === activeTab;
              return (
                <button
                  key={tab.key}
                  role="tab"
                  aria-selected={isActive}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
                    isActive
                      ? "bg-white text-primary shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                  <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] text-slate-600">
                    {items.filter((course) => course.category === tab.key).length}
                  </span>
                </button>
              );
            })}
          </div>

          {activeMeta && (
            <p className="mt-6 text-center text-sm font-medium text-slate-500">{activeMeta.blurb}</p>
          )}

          {/* Grid */}
          <div className="mt-10">
            {loading ? (
              <FullPageLoader label="Loading courses..." />
            ) : filtered.length === 0 ? (
              <EmptyState
                title="No courses published in this category yet"
                hint="Please check back soon or contact us for the upcoming schedule."
                icon={<BookOpen className="h-5 w-5" />}
              />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </div>

          <div className="mt-14 rounded-2xl bg-primary-50 px-6 py-10 text-center sm:px-12">
            <h3 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
              Not sure which level to start at?
            </h3>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600">
              Take our free 20-minute placement test and join the right batch.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <a href={COMPANY.whatsapp} target="_blank" rel="noreferrer" className="btn-primary">
                Book placement test
              </a>
              <a href={COMPANY.phoneHref} className="btn-outline">
                <Phone className="h-4 w-4" /> {COMPANY.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

/* =========================================================================
   11. STUDY ABROAD PAGE
   ========================================================================= */
