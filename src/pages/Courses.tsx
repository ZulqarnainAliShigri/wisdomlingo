import React, { useMemo, useState, useEffect } from "react";
import { BookOpen, Phone } from "lucide-react";
import { useCompany } from "../hooks/useCompany";
import { CATEGORY_TABS } from "../data/content";
import { SEED_COURSES } from "../data/seed";
import { useRemoteList } from "../hooks/useRemoteList";
import { mapCourse } from "../lib/mappers";
import { Course, CourseCategory } from "../types";
import { CourseCard } from "../components/public/CourseCard";
import { EnquiryModal } from "../components/public/EnquiryModal";
import { EmptyState } from "../components/ui/EmptyState";
import { FullPageLoader } from "../components/ui/Loader";
import { HERO_IMAGES } from "../config/media";
import { PageHero } from "../components/ui/PageHero";
import { Seo } from "../components/Seo";
import { StructuredData } from "../components/StructuredData";
import { courseListSchema } from "../lib/structuredData";
import { useSeoSettings } from "../hooks/useSeo";

import { DetailModal, DetailModalData } from "../components/public/DetailModal";

/** Preselects the enquiry subject from the course the visitor clicked. */
const SUBJECT_BY_CATEGORY: Record<CourseCategory, string> = {
  german: "German Language Course",
  english: "IELTS / Spoken English",
  religious: "Quran, Arabic or Persian",
};

export const CoursesPage: React.FC = () => {
  const COMPANY = useCompany();
  const [activeTab, setActiveTab] = useState<CourseCategory>("german");
  const [enrollCourse, setEnrollCourse] = useState<Course | null>(null);
  const [detailData, setDetailData] = useState<DetailModalData | null>(null);
  const { items, loading } = useRemoteList<Course>("courses", SEED_COURSES, mapCourse);

  const filtered = useMemo(
    () => items.filter((course) => course.category === activeTab),
    [items, activeTab]
  );
  const activeMeta = CATEGORY_TABS.find((tab) => tab.key === activeTab);

  const [activeCourseIdx, setActiveCourseIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveCourseIdx((prev) => (prev + 1) % Math.max(1, filtered.length));
    }, 3400);
    return () => clearInterval(interval);
  }, [isPaused, filtered.length]);

  const { settings } = useSeoSettings();
  const courseSchemaData = useMemo(
    () => courseListSchema(items, settings.site_url, COMPANY.legalName),
    [items, settings.site_url, COMPANY.legalName]
  );

  return (
    <>
      <Seo page="courses" />
      <StructuredData id="courses" data={courseSchemaData} />

      <PageHero
        image={HERO_IMAGES.courses}
        eyebrow="Courses"
        title="Certified Language Courses"
        subtitle="Goethe exam preparation, IELTS coaching, and small interactive batches."
      />

      <section
        className="section bg-white"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
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
                  onClick={() => {
                    setActiveTab(tab.key);
                    setActiveCourseIdx(0);
                  }}
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
            <p className="mt-4 text-center text-xs sm:text-sm font-medium text-slate-500">{activeMeta.blurb}</p>
          )}

          {/* Animated Runner Beam Track */}
          <div className="relative mt-8 mb-2 hidden sm:block overflow-hidden h-0.5">
            <div className="h-full w-full border-t-2 border-dashed border-slate-300" />
            <div
              className="h-full bg-gradient-to-r from-primary via-primary-500 to-accent transition-all duration-700 ease-out"
              style={{
                width: `${((activeCourseIdx + 1) / Math.max(1, filtered.length)) * 100}%`,
              }}
            />
            <div
              aria-hidden="true"
              className="animate-beam-runner absolute top-0 h-1.5 w-24 -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent blur-xs"
            />
          </div>

          {/* Grid */}
          <div className="mt-8">
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
                {filtered.map((course, index) => (
                  <div
                    key={course.id}
                    onClick={() => setActiveCourseIdx(index)}
                    onMouseEnter={() => setActiveCourseIdx(index)}
                  >
                    <CourseCard
                      course={course}
                      isActive={activeCourseIdx === index}
                      onEnroll={setEnrollCourse}
                      onDetails={(c) =>
                        setDetailData({
                          title: c.title,
                          subtitle: `${c.level} • ${c.category.toUpperCase()}`,
                          category: "Language Program",
                          badge: c.level,
                          badgeColor: "bg-primary-50 text-primary",
                          image: c.image_url || HERO_IMAGES.courses,
                          description: c.description,
                          metrics: [
                            { label: "Duration", value: c.duration || "Varies" },
                            { label: "Fee", value: c.fee || "Contact us" },
                            { label: "Certificate", value: "Goethe / TestDaF" },
                          ],
                          points: [
                            "Taught by certified native & Goethe-trained teachers",
                            "Official exam simulation & mock tests included",
                            "Small batch sizes with personalized attention",
                            "Flexible schedules: morning, evening, or online",
                          ],
                          primaryCtaText: "Enroll in Course",
                          onPrimaryCta: () => setEnrollCourse(c),
                          secondaryCtaText: "WhatsApp Us",
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
          {filtered.length > 0 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              {filtered.map((c, idx) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveCourseIdx(idx)}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    activeCourseIdx === idx
                      ? "w-8 bg-primary"
                      : "w-2 bg-slate-300 hover:bg-slate-400"
                  }`}
                  aria-label={`Go to ${c.title}`}
                />
              ))}
            </div>
          )}

          <div className="mt-12 rounded-2xl bg-primary-50 px-6 py-8 text-center sm:px-12">
            <h3 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
              Free Placement Assessment
            </h3>
            <p className="mx-auto mt-1.5 max-w-xl text-xs sm:text-sm text-slate-600">
              Take our 20-minute test to find your exact level and batch timing.
            </p>
            <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
              <a href={COMPANY.whatsapp} target="_blank" rel="noreferrer" className="btn-primary">
                Book Placement Test
              </a>
              <a href={COMPANY.phoneHref} className="btn-outline">
                <Phone className="h-4 w-4" /> {COMPANY.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Details & Enrollment Modals */}
      <DetailModal
        open={Boolean(detailData)}
        onClose={() => setDetailData(null)}
        data={detailData}
      />
      <EnquiryModal
        open={Boolean(enrollCourse)}
        onClose={() => setEnrollCourse(null)}
        title={enrollCourse ? `Enroll: ${enrollCourse.title}` : "Enroll"}
        intro="Send us your details and a counsellor will confirm the next batch, timings and seat availability."
        defaultSubject={enrollCourse ? SUBJECT_BY_CATEGORY[enrollCourse.category] : ""}
        defaultMessage={
          enrollCourse
            ? `I would like to enroll in ${enrollCourse.title}. Please share the next batch dates and timings.`
            : ""
        }
      />
    </>
  );
};

/* =========================================================================
   11. STUDY ABROAD PAGE
   ========================================================================= */
