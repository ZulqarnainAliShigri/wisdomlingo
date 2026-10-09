import React, { useMemo, useState, useEffect } from "react";
import {
  Award,
  BookOpen,
  ChevronDown,
  Clock,
  Compass,
  FileCheck,
  HelpCircle,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
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

/** Educational CEFR roadmap for German learners */
const GERMAN_LEVEL_ROADMAP = [
  {
    level: "A1",
    title: "Beginner",
    duration: "8 Weeks",
    useCases: "Spouse Visa, Au-Pair, Initial Foundation",
    color: "from-emerald-500 to-teal-600",
    badge: "Visa Requirement",
  },
  {
    level: "A2",
    title: "Elementary",
    duration: "8 Weeks",
    useCases: "Everyday Fluency, Appointments, Job Basics",
    color: "from-teal-500 to-cyan-600",
    badge: "Conversational",
  },
  {
    level: "B1",
    title: "Intermediate",
    duration: "10 Weeks",
    useCases: "Paid Ausbildung (Vocational), FSJ, Work Visa",
    color: "from-blue-600 to-indigo-600",
    badge: "Ausbildung Gateway",
  },
  {
    level: "B2",
    title: "Upper Intermediate",
    duration: "12 Weeks",
    useCases: "Nursing Licensure, Public Universities, IT Jobs",
    color: "from-indigo-600 to-purple-600",
    badge: "Career Ready",
  },
  {
    level: "C1",
    title: "Advanced",
    duration: "14 Weeks",
    useCases: "Medical Doctors (Approbation), Master's, DSH",
    color: "from-purple-600 to-pink-600",
    badge: "Academic Fluency",
  },
  {
    level: "C2",
    title: "Mastery",
    duration: "16 Weeks",
    useCases: "Near-Native Fluency, Literary & Official Register",
    color: "from-pink-600 to-rose-600",
    badge: "Highest CEFR",
  },
];

/** Frequently Asked Questions for Language Learners */
const COURSE_FAQS = [
  {
    q: "How long does it take to reach German B1 from complete beginner?",
    a: "On average, reaching certified B1 takes 6 to 7 months through our structured A1 → A2 → B1 sequence. We offer regular batches (1.5 hours daily) and intensive fast-track batches (3 hours daily) to accelerate your timeline for upcoming embassy appointments.",
  },
  {
    q: "Are your certificates accepted by the German Embassy in Islamabad?",
    a: "Our courses are strictly structured on the official Goethe-Institut and ÖSD examination frameworks. We prepare you directly for the official Goethe-Zertifikat or ÖSD exam, which are the only certificates legally accepted by the German Embassy.",
  },
  {
    q: "Can I attend classes online if I live outside Skardu or Lahore?",
    a: "Yes! Over 60% of our students join via our live, interactive Zoom virtual classrooms with native and Goethe-trained teachers. Online students receive full digital study packs, recorded lectures, weekly speaking clubs, and mock exam assessments.",
  },
  {
    q: "Do you provide course books and Goethe exam preparation materials?",
    a: "Yes. All enrolled students receive official curated curriculum books (Netzwerk Neu / Aspekte Neu), vocabulary glossaries, listening audios, and 5+ full-length Goethe mock exams with personalized teacher feedback.",
  },
  {
    q: "What is your average first-attempt pass rate in Goethe exams?",
    a: "Our students maintain a 98.4% first-attempt pass rate in Goethe and ÖSD exams, thanks to our dedicated speaking simulations and individual module drills.",
  },
];

export const CoursesPage: React.FC = () => {
  const COMPANY = useCompany();
  const [activeTab, setActiveTab] = useState<CourseCategory>("german");
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [enrollCourse, setEnrollCourse] = useState<Course | null>(null);
  const [detailData, setDetailData] = useState<DetailModalData | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const { items, loading } = useRemoteList<Course>("courses", SEED_COURSES, mapCourse);

  // Filter items by category, level, and search term
  const filtered = useMemo(() => {
    return items.filter((course) => {
      if (course.category !== activeTab) return false;

      if (selectedLevelFilter !== "all") {
        if (!course.level?.toLowerCase().includes(selectedLevelFilter.toLowerCase())) {
          return false;
        }
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = course.title.toLowerCase().includes(query);
        const matchesDesc = course.description?.toLowerCase().includes(query);
        const matchesLevel = course.level?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesLevel) return false;
      }

      return true;
    });
  }, [items, activeTab, selectedLevelFilter, searchQuery]);

  const activeMeta = CATEGORY_TABS.find((tab) => tab.key === activeTab);

  const [activeCourseIdx, setActiveCourseIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || filtered.length === 0) return;
    const interval = setInterval(() => {
      setActiveCourseIdx((prev) => (prev + 1) % Math.max(1, filtered.length));
    }, 2000);
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

      {/* Hero Section */}
      <PageHero
        image={HERO_IMAGES.courses}
        eyebrow="Accredited Language Academy"
        title="Certified German & Language Training"
        subtitle="Official Goethe-Zertifikat & ÖSD exam preparation, intensive IELTS coaching, and religious studies. Small interactive batches with certified faculty in Skardu, Lahore, and live online."
      >
        {/* Trust Badges Bar */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-white/90">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 backdrop-blur-md">
            <ShieldCheck className="h-4 w-4 text-emerald-400" /> Goethe & ÖSD Exam Aligned
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-amber-300" /> 98.4% Pass Rate
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 backdrop-blur-md">
            <Users className="h-4 w-4 text-blue-300" /> Small Batches (Max 12-15)
          </span>
        </div>
      </PageHero>

      {/* Main Section */}
      <section
        className="section bg-slate-50/60"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="container-page">
          {/* CEFR German Pathway Guide (Shown when German tab or at top) */}
          {activeTab === "german" && (
            <div className="mb-12 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                    <Compass className="h-4 w-4" /> CEFR Level Roadmap
                  </span>
                  <h2 className="mt-1 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                    Which German Level Do You Need?
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-2xl">
                    Every visa and academic programme in Germany has a specific CEFR requirement. Click any level to filter our matching courses.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedLevelFilter("all")}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                      selectedLevelFilter === "all"
                        ? "bg-slate-900 text-white shadow-xs"
                        : "border border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    Show All
                  </button>
                </div>
              </div>

              {/* Interactive Roadmap Cards */}
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
                {GERMAN_LEVEL_ROADMAP.map((item) => {
                  const isSelected = selectedLevelFilter.toUpperCase() === item.level;
                  return (
                    <button
                      key={item.level}
                      type="button"
                      onClick={() => {
                        setSelectedLevelFilter(isSelected ? "all" : item.level);
                        setActiveCourseIdx(0);
                      }}
                      className={`group relative flex flex-col rounded-2xl border p-4 text-left transition-all ${
                        isSelected
                          ? "border-primary bg-primary-50/40 ring-2 ring-primary/40 shadow-md -translate-y-1"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 hover:-translate-y-0.5"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-black text-slate-900 group-hover:text-primary">
                          {item.level}
                        </span>
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                          {item.duration}
                        </span>
                      </div>
                      <span className="mt-1 text-xs font-bold text-primary">
                        {item.title}
                      </span>
                      <p className="mt-2 text-[11px] leading-relaxed text-slate-600 line-clamp-2">
                        {item.useCases}
                      </p>
                      <span className="mt-3 inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                        {item.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Category Tabs & Search Bar */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Category Buttons */}
              <div
                role="tablist"
                aria-label="Course categories"
                className="grid grid-cols-3 gap-1.5 rounded-2xl bg-slate-100 p-1.5 sm:gap-2 sm:p-2"
              >
                {CATEGORY_TABS.map((tab) => {
                  const isActive = tab.key === activeTab;
                  const count = items.filter((course) => course.category === tab.key).length;
                  return (
                    <button
                      key={tab.key}
                      role="tab"
                      aria-selected={isActive}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab.key);
                        setSelectedLevelFilter("all");
                        setSearchQuery("");
                        setActiveCourseIdx(0);
                      }}
                      className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold transition sm:gap-2 sm:px-5 sm:py-3 sm:text-sm ${
                        isActive
                          ? "bg-primary text-white shadow-md shadow-primary/20"
                          : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                      }`}
                    >
                      <tab.icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{tab.label}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] sm:text-[11px] font-bold ${
                          isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search Bar */}
              <div className="relative w-full lg:max-w-xs">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search courses, e.g. B1, IELTS..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setActiveCourseIdx(0);
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 placeholder-slate-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Active Meta Blurb & German Level Filter Chips */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <p className="text-xs sm:text-sm font-medium text-slate-500">
                {activeMeta ? activeMeta.blurb : "Certified language programs"}
              </p>

              {activeTab === "german" && (
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
                  <span className="text-[11px] font-semibold text-slate-400 mr-1">Filter Level:</span>
                  {["all", "A1", "A2", "B1", "B2", "C1", "C2"].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => {
                        setSelectedLevelFilter(lvl);
                        setActiveCourseIdx(0);
                      }}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                        selectedLevelFilter.toLowerCase() === lvl.toLowerCase()
                          ? "bg-primary text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                      }`}
                    >
                      {lvl === "all" ? "All" : lvl}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

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

          {/* Courses Grid */}
          <div className="mt-8">
            {loading ? (
              <FullPageLoader label="Loading courses..." />
            ) : filtered.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <EmptyState
                  title="No courses matched your filter"
                  hint="Try clearing your search query or selecting a different level to view available batches."
                  icon={<BookOpen className="h-6 w-6 text-slate-400" />}
                />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLevelFilter("all");
                    setSearchQuery("");
                  }}
                  className="btn-outline mt-4"
                >
                  Reset Filters
                </button>
              </div>
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
                          subtitle: `${c.level || "Language"} • ${c.category.toUpperCase()}`,
                          category: "Certified Language Program",
                          badge: c.level,
                          badgeColor: "bg-primary-50 text-primary",
                          image: c.image_url || HERO_IMAGES.courses,
                          description: c.description,
                          metrics: [
                            { label: "Duration", value: c.duration || "Varies" },
                            { label: "Fee", value: c.fee || "Contact us" },
                            { label: "Certificate", value: "Goethe / TestDaF / IELTS" },
                          ],
                          points: [
                            "Taught by certified native & Goethe-trained teachers",
                            "Official exam simulation & mock tests included",
                            "Small batch sizes (max 12) with personalized attention",
                            "Flexible schedules: morning, evening, or live online",
                            "Official exam registration and embassy paperwork support",
                          ],
                          primaryCtaText: "Enroll in this Course",
                          onPrimaryCta: () => setEnrollCourse(c),
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

          {/* Why Learn with WisdomLingo Academy Feature Grid */}
          <div className="mt-16 rounded-3xl border border-slate-200/90 bg-white p-8 shadow-sm sm:p-12">
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3.5 py-1 text-xs font-bold text-primary">
                <Award className="h-3.5 w-3.5 text-accent" /> Academic Standard
              </span>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                Why Learn German at WisdomLingo?
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-slate-600">
                We combine rigorous Goethe exam preparation with active speaking immersion to ensure your visa success.
              </p>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 transition hover:border-primary-100 hover:bg-white hover:shadow-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-base font-bold text-slate-900">Goethe & ÖSD Standard</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                  Full alignment with official CEFR exam formats with periodic mock simulations.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 transition hover:border-primary-100 hover:bg-white hover:shadow-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-base font-bold text-slate-900">Small Interactive Batches</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                  Limited to 12-15 students per batch ensuring individual speaking practice every single day.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 transition hover:border-primary-100 hover:bg-white hover:shadow-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 text-accent">
                  <FileCheck className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-base font-bold text-slate-900">Visa & Exam Booking</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                  Assistance with Goethe exam registration, motivation letters, and embassy interview preparation.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 transition hover:border-primary-100 hover:bg-white hover:shadow-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <Clock className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-base font-bold text-slate-900">Flexible Hybrid Batches</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                  Morning, evening, and weekend slots available on-campus in Skardu and live online via Zoom.
                </p>
              </div>
            </div>
          </div>

          {/* Student FAQs Accordion */}
          <div className="mt-16 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-10">
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                <HelpCircle className="h-4 w-4" /> Have Questions?
              </span>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                Frequently Asked Questions
              </h2>
              <p className="mx-auto mt-1 max-w-xl text-xs sm:text-sm text-slate-600">
                Everything you need to know about course durations, examinations, and visa acceptance.
              </p>
            </div>

            <div className="mx-auto mt-8 max-w-3xl space-y-3">
              {COURSE_FAQS.map((faq, idx) => {
                const isOpen = expandedFaq === idx;
                return (
                  <div
                    key={faq.q}
                    className="overflow-hidden rounded-2xl border border-slate-200/80 transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedFaq(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between bg-slate-50/70 px-5 py-4 text-left text-sm font-bold text-slate-900 transition hover:bg-slate-100"
                    >
                      <span className="pr-4">{faq.q}</span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-300 ${
                          isOpen ? "rotate-180 text-primary" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="border-t border-slate-100 bg-white px-5 py-4 text-xs sm:text-sm leading-relaxed text-slate-600">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Executive Free Placement Test & Counselling Callout */}
          <div className="mt-16 relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-950 via-primary-900 to-slate-900 px-6 py-10 text-center text-white shadow-xl sm:px-12 sm:py-14">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(40rem_20rem_at_50%_0%,rgba(37,99,235,0.3),transparent)]"
            />
            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-bold text-blue-200 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" /> Complimentary Assessment
              </span>
              <h3 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
                Not Sure Which Level You Need?
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-blue-100 leading-relaxed">
                Take our free 20-minute diagnostic placement assessment or speak with an experienced Goethe-trained counsellor today.
              </p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href={COMPANY.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-accent inline-flex items-center justify-center gap-2 shadow-lg shadow-accent/25"
                >
                  <MessageCircle className="h-4 w-4" /> Book Free Placement Test
                </a>
                <a
                  href={COMPANY.phoneHref}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-xs sm:text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20"
                >
                  <Phone className="h-4 w-4" /> Call: {COMPANY.phone}
                </a>
              </div>
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
