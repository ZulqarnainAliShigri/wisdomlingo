import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Calendar,
  CalendarDays,
  Check,
  Clock,
  Coins,
  Globe,
  GraduationCap,
  HeartHandshake,
  MessageSquare,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { useCompany } from "../hooks/useCompany";
import { HERO_IMAGES } from "../config/media";
import {
  ARTICLES,
  CATEGORY_TABS,
  COUNTRY_FLAGS,
  COUNTRY_PERKS,
  COUNTRY_PHOTOS,
  HERO_HIGHLIGHTS,
  HERO_STATS,
  HOME_PROGRAMS,
  PROCESS_STEPS,
  TESTIMONIALS,
  WHY_US,
} from "../data/content";
import { SEED_COUNTRIES, SEED_COURSES } from "../data/seed";
import { useRemoteList } from "../hooks/useRemoteList";
import { mapCountry, mapCourse } from "../lib/mappers";
import { Course, CourseCategory, StudyCountry } from "../types";
import { SectionHeading } from "../components/ui/SectionHeading";
import { EnquiryModal } from "../components/public/EnquiryModal";
import { CourseCard } from "../components/public/CourseCard";
import { DetailModal, DetailModalData } from "../components/public/DetailModal";
import { Seo } from "../components/Seo";

/** Shown above the article grid on desktop, below it on phones. */
const ViewAllArticles: React.FC<{ className?: string }> = ({ className = "" }) => (
  <Link to="/blog" className={`btn-ghost ${className}`}>
    View All Articles <ArrowRight className="h-4 w-4" />
  </Link>
);



const SHORT_SUBHEADINGS = [
  "starts here.",
  "begins today.",
  "made simple.",
  "starts now.",
  "with us.",
];

export const HomePage: React.FC = () => {
  const COMPANY = useCompany();
  const { items: countries } = useRemoteList<StudyCountry>("study_countries", SEED_COUNTRIES, mapCountry);
  const { items: allCourses } = useRemoteList<Course>("courses", SEED_COURSES, mapCourse);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enrollCourse, setEnrollCourse] = useState<Course | null>(null);
  const [detailData, setDetailData] = useState<DetailModalData | null>(null);
  const [activeCourseTab, setActiveCourseTab] = useState<CourseCategory>("german");

  // Animated Process Step State
  const [activeProcessStep, setActiveProcessStep] = useState(0);
  const [isProcessPaused, setIsProcessPaused] = useState(false);

  useEffect(() => {
    if (isProcessPaused) return;
    const interval = setInterval(() => {
      setActiveProcessStep((prev) => (prev + 1) % PROCESS_STEPS.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [isProcessPaused]);

  // Animated Programs Showcase State
  const [activeProgramIndex, setActiveProgramIndex] = useState(0);
  const [isProgramsPaused, setIsProgramsPaused] = useState(false);

  useEffect(() => {
    if (isProgramsPaused) return;
    const interval = setInterval(() => {
      setActiveProgramIndex((prev) => (prev + 1) % HOME_PROGRAMS.length);
    }, 3400);
    return () => clearInterval(interval);
  }, [isProgramsPaused]);

  // Animated Destinations State
  const [activeDestIndex, setActiveDestIndex] = useState(0);
  const [isDestPaused, setIsDestPaused] = useState(false);

  useEffect(() => {
    if (isDestPaused) return;
    const interval = setInterval(() => {
      setActiveDestIndex((prev) => (prev + 1) % 6);
    }, 3600);
    return () => clearInterval(interval);
  }, [isDestPaused]);

  // Animated Why Us State
  const [activeWhyIndex, setActiveWhyIndex] = useState(0);
  const [isWhyPaused, setIsWhyPaused] = useState(false);

  useEffect(() => {
    if (isWhyPaused) return;
    const interval = setInterval(() => {
      setActiveWhyIndex((prev) => (prev + 1) % WHY_US.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isWhyPaused]);

  // Animated Testimonials State
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);
  const [isTestimonialPaused, setIsTestimonialPaused] = useState(false);

  useEffect(() => {
    if (isTestimonialPaused) return;
    const interval = setInterval(() => {
      setActiveTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isTestimonialPaused]);

  // Animated Articles State
  const [activeArticleIndex, setActiveArticleIndex] = useState(0);
  const [isArticlePaused, setIsArticlePaused] = useState(false);

  useEffect(() => {
    if (isArticlePaused) return;
    const interval = setInterval(() => {
      setActiveArticleIndex((prev) => (prev + 1) % ARTICLES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isArticlePaused]);

  // Constant Line 1 + Ultra-Short Line 2 Typewriter state
  const [subIndex, setSubIndex] = useState(0);
  const [displayText, setDisplayText] = useState(SHORT_SUBHEADINGS[0]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullText = SHORT_SUBHEADINGS[subIndex];
    let timer: NodeJS.Timeout;

    if (!isDeleting && displayText.length < fullText.length) {
      // Type forward char-by-char
      timer = setTimeout(() => {
        setDisplayText(fullText.slice(0, displayText.length + 1));
      }, 55);
    } else if (!isDeleting && displayText.length === fullText.length) {
      // Pause at completed text
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 2200);
    } else if (isDeleting && displayText.length > 0) {
      // Erase backward char-by-char
      timer = setTimeout(() => {
        setDisplayText(fullText.slice(0, displayText.length - 1));
      }, 28);
    } else if (isDeleting && displayText.length === 0) {
      // Switch to next short subheading
      timer = setTimeout(() => {
        setIsDeleting(false);
        setSubIndex((prev) => (prev + 1) % SHORT_SUBHEADINGS.length);
      }, 250);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, subIndex]);

  const filteredCourses = useMemo(
    () => allCourses.filter((c) => c.category === activeCourseTab).slice(0, 3),
    [allCourses, activeCourseTab]
  );

  // Animated Courses Showcase State
  const [activeCourseIndex, setActiveCourseIndex] = useState(0);
  const [isCoursesPaused, setIsCoursesPaused] = useState(false);

  useEffect(() => {
    if (isCoursesPaused) return;
    const interval = setInterval(() => {
      setActiveCourseIndex((prev) => (prev + 1) % Math.max(1, filteredCourses.length));
    }, 3400);
    return () => clearInterval(interval);
  }, [isCoursesPaused, filteredCourses.length]);

  const [destFilter, setDestFilter] = useState<"all" | "tuition-free" | "english" | "schengen">("all");

  const filteredDestinations = useMemo(() => {
    const list = countries.slice(0, 6);
    if (destFilter === "all") return list;
    return list.filter((c) => {
      const perk = COUNTRY_PERKS[c.name];
      return perk?.category?.includes(destFilter);
    });
  }, [countries, destFilter]);

  return (
    <>
      <Seo page="home" />


      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <section className="relative isolate overflow-hidden">
        <img
          src={HERO_IMAGES.home}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
        />

        {/* Balanced overlay that keeps the campus hero photo clearly visible */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-white/45 sm:bg-white/35 lg:bg-transparent lg:bg-gradient-to-r lg:from-white/95 lg:via-white/85 lg:to-white/20"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-b from-white/80 via-white/25 to-white"
        />

        <div className="container-page grid items-center gap-6 pb-2 pt-6 sm:gap-10 sm:pb-10 sm:pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:pb-12 lg:pt-16">
          <div className="animate-fade-in-up text-center lg:text-left">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-200/80 bg-white/90 px-3 py-1 text-[11px] font-semibold text-primary shadow-xs backdrop-blur-sm sm:px-3.5 sm:py-1 sm:text-xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              <span>Premium Education Consultancy</span>
            </div>

            {/* Heading: Constant 1st line, strictly 2 lines, short rotating 2nd line */}
            <div className="mt-2.5 min-h-[85px] flex flex-col justify-center sm:mt-4 sm:min-h-[120px] lg:min-h-[145px]">
              <h1 className="text-[1.35rem] font-extrabold leading-[1.2] tracking-tight text-slate-900 drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)] sm:text-4xl lg:text-[2.85rem] sm:drop-shadow-none">
                <span>Your pathway to </span>
                <span className="text-primary">Europe</span>
                <span className="block mt-0.5 text-accent drop-shadow-[0_1px_2px_rgba(255,255,255,0.95)] sm:text-accent sm:drop-shadow-none min-h-[1.25em]">
                  {displayText}
                  <span
                    aria-hidden="true"
                    className="inline-flex items-center justify-center ml-2 align-middle text-accent drop-shadow-[0_0_8px_rgba(220,38,38,0.6)] animate-pulse"
                  >
                    <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 fill-accent/20" />
                  </span>
                </span>
              </h1>
            </div>

            {/* Static Subtitle / Tagline */}
            <p className="mx-auto mt-2 max-w-sm text-xs font-semibold text-slate-800 sm:mt-3 sm:max-w-xl sm:text-sm sm:font-normal sm:text-slate-600 lg:mx-0">
              Expert guidance for German language, university admissions, and paid Ausbildung.
            </p>

            {/* Trust feature pills */}
            <div className="mt-2.5 flex flex-wrap items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-700 sm:mt-4 sm:gap-2 sm:text-xs lg:justify-start">
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200/80 bg-white/90 px-2.5 py-0.5 shadow-2xs backdrop-blur-xs">
                <span className="font-bold text-emerald-600">✓</span> Free Assessment
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200/80 bg-white/90 px-2.5 py-0.5 shadow-2xs backdrop-blur-xs">
                <span className="font-bold text-emerald-600">✓</span> Goethe (A1–C2)
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200/80 bg-white/90 px-2.5 py-0.5 shadow-2xs backdrop-blur-xs">
                <span className="font-bold text-emerald-600">✓</span> 98% Visa Success
              </span>
            </div>

            {/* CTAs (hidden on mobile, visible on sm and up) */}
            <div className="hidden sm:flex sm:mt-8 sm:gap-3 sm:justify-center lg:justify-start">
              <button
                type="button"
                onClick={() => setEnquiryOpen(true)}
                className="btn-accent sm:flex-none sm:px-5 sm:py-3 sm:text-sm font-bold shadow-md shadow-accent/20"
              >
                Start Your Journey <ArrowRight className="h-4 w-4" />
              </button>
              <Link
                to="/courses"
                className="btn-ghost sm:flex-none sm:px-5 sm:py-3 sm:text-sm font-bold"
              >
                Explore Courses
              </Link>
            </div>

            {/* Stats Card on Mobile / Clean Row on Desktop */}
            <div className="mx-auto mt-4 max-w-sm rounded-2xl border border-slate-200/80 bg-white/90 p-3 shadow-xs backdrop-blur-sm sm:mx-0 sm:mt-8 sm:max-w-none sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none sm:backdrop-blur-none">
              <div className="grid grid-cols-3 divide-x divide-slate-100 sm:flex sm:gap-10 sm:divide-x-0">
                {HERO_STATS.map((stat) => (
                  <div key={stat.label} className="px-1 text-center sm:px-0 sm:text-left">
                    <p className="text-lg font-extrabold tracking-tight text-primary sm:text-3xl">
                      {stat.value}
                    </p>
                    <p className="mt-0.5 text-[10px] font-semibold text-slate-500 sm:mt-1 sm:text-xs">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop side card */}
          <div className="hidden lg:block lg:justify-self-end lg:pl-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/10 lg:w-[22rem]">
              <h2 className="text-sm font-bold text-slate-900">Popular right now</h2>
              <div className="mt-4 space-y-3">
                {HERO_HIGHLIGHTS.map((item) => (
                  <Link
                    key={item.title}
                    to={item.to}
                    className="group flex items-center gap-4 rounded-xl border border-slate-200 p-3.5 transition hover:border-primary-100 hover:bg-primary-50/60"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary">
                      <item.icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-slate-900">
                        {item.title}
                      </span>
                      <span className="block truncate text-xs text-slate-500">{item.meta}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-primary" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          COURSES SHOWCASE — right after hero on all screens
      ══════════════════════════════════════════════════════ */}
      <section
        className="bg-slate-50 pb-12 pt-3 sm:pb-16 sm:pt-8"
        onMouseEnter={() => setIsCoursesPaused(true)}
        onMouseLeave={() => setIsCoursesPaused(false)}
      >
        <div className="container-page">
          {/* Courses Section Header */}
          <div className="mb-4 sm:mb-8">
            <SectionHeading
              align="center"
              eyebrow="Our Courses"
              title="Language & Skill Training"
              titleClassName="hidden sm:block"
              subtitle="Certified courses from beginner to fluency."
              subtitleClassName="hidden sm:block"
            />
          </div>

          {/* Category Tabs */}
          <div
            role="tablist"
            aria-label="Course categories"
            className="mx-auto grid max-w-3xl grid-cols-3 gap-1 rounded-2xl bg-white p-1.5 shadow-sm sm:gap-2 sm:p-2"
          >
            {CATEGORY_TABS.map((tab) => {
              const isActive = tab.key === activeCourseTab;
              return (
                <button
                  key={tab.key}
                  role="tab"
                  aria-selected={isActive}
                  type="button"
                  onClick={() => {
                    setActiveCourseTab(tab.key);
                    setActiveCourseIndex(0);
                  }}
                  className={`flex items-center justify-center gap-1 rounded-xl px-1.5 py-2 text-[11px] font-bold transition sm:gap-2 sm:px-4 sm:py-3 sm:text-sm ${
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <tab.icon className="h-3 w-3 shrink-0 sm:h-4 sm:w-4" />
                  <span className="whitespace-nowrap">{tab.label}</span>
                  <span
                    className={`rounded-full px-1 py-0.5 text-[9px] font-semibold sm:px-2 sm:text-[11px] ${
                      isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {allCourses.filter((c) => c.category === tab.key).length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Animated Runner Beam Track */}
          <div className="relative mt-8 mb-2 hidden sm:block overflow-hidden h-0.5">
            <div className="h-full w-full border-t-2 border-dashed border-slate-300" />
            <div
              className="h-full bg-gradient-to-r from-primary via-primary-500 to-accent transition-all duration-700 ease-out"
              style={{
                width: `${((activeCourseIndex + 1) / Math.max(1, filteredCourses.length)) * 100}%`,
              }}
            />
            <div
              aria-hidden="true"
              className="animate-beam-runner absolute top-0 h-1.5 w-24 -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent blur-xs"
            />
          </div>

          {/* Course Cards with Details Trigger */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {filteredCourses.map((course, index) => (
              <div
                key={course.id}
                onClick={() => setActiveCourseIndex(index)}
                onMouseEnter={() => setActiveCourseIndex(index)}
              >
                <CourseCard
                  course={course}
                  isActive={activeCourseIndex === index}
                  onEnroll={setEnrollCourse}
                  onDetails={(c) =>
                    setDetailData({
                      title: c.title,
                      category: c.category.toUpperCase(),
                      badge: c.level,
                      image: c.image_url,
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
                      primaryCtaText: "Enroll in this Course",
                      onPrimaryCta: () => setEnrollCourse(c),
                      secondaryCtaText: "WhatsApp Us",
                      secondaryCtaLink: COMPANY.whatsapp,
                    })
                  }
                />
              </div>
            ))}
          </div>

          {/* Interactive Step Dots */}
          <div className="mt-6 flex items-center justify-center gap-2">
            {filteredCourses.map((c, idx) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCourseIndex(idx)}
                className={`h-2 rounded-full transition-all duration-500 ${
                  activeCourseIndex === idx
                    ? "w-8 bg-primary"
                    : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label={`Go to ${c.title}`}
              />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link to="/courses" className="btn-primary">
              View All Courses <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PROGRAMS SHOWCASE
      ══════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/80 to-white py-16 sm:py-24"
        onMouseEnter={() => setIsProgramsPaused(true)}
        onMouseLeave={() => setIsProgramsPaused(false)}
      >
        {/* Soft decorative background glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-96 w-full max-w-7xl overflow-hidden opacity-40 blur-3xl"
        >
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-blue-300/40" />
          <div className="absolute right-0 top-20 h-72 w-72 rounded-full bg-rose-200/40" />
        </div>

        <div className="container-page relative">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-accent" /> Accredited Pathways
            </span>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-[2.5rem]">
              Three Programs, <span className="text-primary">One Future</span>
            </h2>
            <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-600 max-w-xl mx-auto">
              Language mastery, tuition-free degrees, and paid Ausbildung contracts in Germany.
            </p>
          </div>

          {/* Animated Runner Beam Track */}
          <div className="relative mt-10 mb-4 hidden lg:block overflow-hidden h-0.5">
            <div className="h-full w-full border-t-2 border-dashed border-slate-300" />
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary via-primary-500 to-accent transition-all duration-700 ease-out"
              style={{
                width: `${((activeProgramIndex + 1) / HOME_PROGRAMS.length) * 100}%`,
              }}
            />
            <div
              aria-hidden="true"
              className="animate-beam-runner absolute top-0 h-1.5 w-24 -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent blur-xs"
            />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3 lg:gap-8 items-stretch">
            {HOME_PROGRAMS.map((program, index) => {
              const isActive = activeProgramIndex === index;

              return (
                <article
                  key={program.title}
                  onClick={() => setActiveProgramIndex(index)}
                  onMouseEnter={() => setActiveProgramIndex(index)}
                  className={`group relative flex flex-col rounded-3xl border transition-all duration-500 overflow-hidden bg-white cursor-pointer ${
                    isActive
                      ? "border-primary/60 shadow-2xl -translate-y-2 ring-2 ring-primary/30 scale-101"
                      : program.featured
                      ? "border-primary/30 shadow-md ring-1 ring-primary/20"
                      : "border-slate-200/90 shadow-sm hover:border-slate-300 hover:-translate-y-1"
                  }`}
                >
                  {/* Visual Image Header */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                    <img
                      src={program.image}
                      alt={program.title}
                      loading="lazy"
                      className={`h-full w-full object-cover transition-transform duration-700 ease-out ${
                        isActive ? "scale-108 opacity-95" : "opacity-85 group-hover:scale-105"
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                    {/* Top Floating Badges */}
                    <div className="absolute inset-x-4 top-3.5 flex items-center justify-between gap-2">
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-2xl shadow-lg backdrop-blur-md transition-all duration-300 ${
                          isActive
                            ? "bg-primary text-white scale-110 shadow-primary/30"
                            : "bg-white/95 text-primary group-hover:bg-primary group-hover:text-white"
                        }`}
                      >
                        <program.icon className={`h-5 w-5 ${isActive ? "animate-wiggle" : ""}`} />
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-bold tracking-wide shadow-md backdrop-blur-md ${program.badgeColor}`}
                      >
                        {program.badge}
                      </span>
                    </div>

                    {/* Bottom Stat Ribbon */}
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between rounded-xl border border-white/20 bg-slate-950/50 px-3 py-1.5 backdrop-blur-md text-white shadow-md">
                      <div>
                        <span className="block text-[10px] uppercase font-semibold tracking-wider text-slate-300">
                          {program.statLabel}
                        </span>
                        <span className="block text-xs sm:text-sm font-black text-white tracking-tight">
                          {program.stat}
                        </span>
                      </div>
                      <span className="rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                        Verified
                      </span>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <h3
                      className={`text-lg sm:text-xl font-bold tracking-tight transition-colors ${
                        isActive ? "text-primary font-black" : "text-slate-900 group-hover:text-primary"
                      }`}
                    >
                      {program.title}
                    </h3>
                    <p className="mt-1 text-xs font-bold uppercase tracking-wide text-accent">
                      {program.tagline}
                    </p>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 line-clamp-2">
                      {program.description}
                    </p>

                    {/* Micro Pills */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {program.pills.map((pill) => (
                        <span
                          key={pill}
                          className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700"
                        >
                          {pill}
                        </span>
                      ))}
                    </div>

                    {/* Card CTA Actions: Details Popup + Explore */}
                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailData({
                            title: program.title,
                            subtitle: program.tagline,
                            category: "Core Pathway",
                            badge: program.badge,
                            badgeColor: program.badgeColor,
                            image: program.image,
                            description: program.description,
                            metrics: [
                              { label: program.statLabel, value: program.stat },
                              { label: "Format", value: "Campus & Online" },
                              { label: "Visa Support", value: "Complete File" },
                            ],
                            points: program.points,
                            primaryCtaText: program.cta,
                            onPrimaryCta: () => {
                              window.location.href = program.to;
                            },
                            secondaryCtaText: "WhatsApp Us",
                            secondaryCtaLink: COMPANY.whatsapp,
                          });
                        }}
                        className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs sm:text-sm font-bold text-slate-700 transition-colors hover:border-primary hover:bg-primary-50 hover:text-primary"
                      >
                        Details
                      </button>
                      <Link
                        to={program.to}
                        onClick={(e) => e.stopPropagation()}
                        className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-bold transition-all ${
                          isActive || program.featured
                            ? "bg-primary text-white shadow-md shadow-primary/20 hover:bg-blue-800"
                            : "bg-slate-900 text-white hover:bg-primary"
                        }`}
                      >
                        <span>Explore</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Interactive Step Dots */}
          <div className="mt-8 flex items-center justify-center gap-2">
            {HOME_PROGRAMS.map((program, idx) => (
              <button
                key={program.title}
                type="button"
                onClick={() => setActiveProgramIndex(idx)}
                className={`h-2 rounded-full transition-all duration-500 ${
                  activeProgramIndex === idx
                    ? "w-8 bg-primary"
                    : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label={`Go to ${program.title}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          DESTINATIONS SHOWCASE
      ══════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden bg-white py-16 sm:py-24 border-t border-slate-200/80"
        onMouseEnter={() => setIsDestPaused(true)}
        onMouseLeave={() => setIsDestPaused(false)}
      >
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary shadow-2xs">
              <Globe className="h-3.5 w-3.5 text-primary" /> Destinations
            </span>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-[2.5rem]">
              Top European <span className="text-primary">Destinations</span>
            </h2>
            <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-600 max-w-xl mx-auto">
              Tuition-free admissions, Schengen work rights, and post-graduation settlement.
            </p>

            {/* Quick Interactive Filter Bar */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {[
                { id: "all", label: "All 6 Countries" },
                { id: "tuition-free", label: "Tuition-Free (DE & AT)" },
                { id: "english", label: "English-Taught" },
                { id: "schengen", label: "Schengen Zone" },
              ].map((filterTab) => (
                <button
                  key={filterTab.id}
                  type="button"
                  onClick={() => setDestFilter(filterTab.id as any)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                    destFilter === filterTab.id
                      ? "bg-primary text-white shadow-md shadow-primary/25 scale-105"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {filterTab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Animated Runner Beam Track */}
          <div className="relative mt-10 mb-2 hidden lg:block overflow-hidden h-0.5">
            <div className="h-full w-full border-t-2 border-dashed border-slate-300" />
            <div
              className="h-full bg-gradient-to-r from-primary via-primary-500 to-accent transition-all duration-700 ease-out"
              style={{
                width: `${((activeDestIndex + 1) / Math.max(1, filteredDestinations.length)) * 100}%`,
              }}
            />
            <div
              aria-hidden="true"
              className="animate-beam-runner absolute top-0 h-1.5 w-24 -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent blur-xs"
            />
          </div>

          {/* Destination Cards Grid */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDestinations.map((country, index) => {
              const isActive = activeDestIndex === index;
              const photo = COUNTRY_PHOTOS[country.name] || HERO_IMAGES.studyAbroad;
              const flag = COUNTRY_FLAGS[country.name] || country.flag;
              const perk = COUNTRY_PERKS[country.name] || {
                tag: "Study Abroad",
                tone: "bg-primary text-white",
                visaRate: "98% Visa Rate",
                category: ["schengen"],
              };

              return (
                <article
                  key={country.id}
                  onClick={() => setActiveDestIndex(index)}
                  onMouseEnter={() => setActiveDestIndex(index)}
                  className={`group relative flex flex-col rounded-3xl border transition-all duration-500 overflow-hidden bg-white cursor-pointer ${
                    isActive
                      ? "border-primary/60 ring-2 ring-primary/30 shadow-2xl -translate-y-2 scale-101"
                      : "border-slate-200/90 shadow-sm hover:border-slate-300 hover:-translate-y-1"
                  }`}
                >
                  {/* Photo Header */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                    <img
                      src={photo}
                      alt={country.name}
                      loading="lazy"
                      className={`h-full w-full object-cover transition-transform duration-700 ease-out ${
                        isActive ? "scale-108 opacity-100" : "opacity-90 group-hover:scale-105"
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                    {/* Top Floating Flag & Perk Badge */}
                    <div className="absolute inset-x-3.5 top-3 flex items-center justify-between gap-2">
                      <span
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black shadow-md backdrop-blur-md transition-all duration-300 ${
                          isActive
                            ? "bg-white text-primary ring-2 ring-primary-100 scale-105"
                            : "bg-white/95 text-slate-900"
                        }`}
                      >
                        <span className="text-base leading-none">{flag}</span>
                        <span>{country.name}</span>
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md ${perk.tone}`}
                      >
                        {perk.tag}
                      </span>
                    </div>

                    {/* Bottom overlay text on image */}
                    <div className="absolute bottom-3 left-4 right-4">
                      <p className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                        <Sparkles className={`h-3 w-3 ${isActive ? "animate-wiggle" : ""}`} /> {perk.visaRate}
                      </p>
                      <h3 className="mt-0.5 text-sm sm:text-base font-extrabold text-white leading-tight truncate">
                        {country.tagline}
                      </h3>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                      {country.description}
                    </p>

                    {/* Metrics Grid */}
                    <div className="mt-3.5 grid grid-cols-2 gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-2.5">
                      <div className="min-w-0">
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          <Coins className="h-3 w-3 text-accent" /> Tuition
                        </span>
                        <span
                          className="mt-0.5 block truncate text-xs font-bold text-slate-900"
                          title={country.tuition || "Varies"}
                        >
                          {country.tuition || "Varies"}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          <Calendar className="h-3 w-3 text-primary" /> Intakes
                        </span>
                        <span
                          className="mt-0.5 block truncate text-xs font-bold text-slate-900"
                          title={country.intake || "Varies"}
                        >
                          {country.intake || "Varies"}
                        </span>
                      </div>
                    </div>

                    {/* Card Actions: Details Modal + Explore */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailData({
                            title: `${country.name} Study Pathway`,
                            subtitle: country.tagline,
                            category: "European Destination",
                            badge: perk.tag,
                            badgeColor: perk.tone,
                            image: photo,
                            description: country.description,
                            metrics: [
                              { label: "Tuition", value: country.tuition || "Free / Low" },
                              { label: "Intakes", value: country.intake || "Fall / Spring" },
                              { label: "Visa Success", value: perk.visaRate },
                            ],
                            points: [
                              ...country.benefits,
                              ...country.requirements.map((r) => `Requirement: ${r}`),
                            ],
                            primaryCtaText: `Apply for ${country.name}`,
                            onPrimaryCta: () => {
                              window.location.href = "/study-abroad";
                            },
                            secondaryCtaText: "WhatsApp Us",
                            secondaryCtaLink: COMPANY.whatsapp,
                          });
                        }}
                        className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs sm:text-sm font-bold text-slate-700 transition-colors hover:border-primary hover:bg-primary-50 hover:text-primary"
                      >
                        Details
                      </button>
                      <Link
                        to="/study-abroad"
                        onClick={(e) => e.stopPropagation()}
                        className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs sm:text-sm font-bold text-white transition-colors ${
                          isActive ? "bg-primary hover:bg-blue-800" : "bg-slate-900 hover:bg-primary"
                        }`}
                      >
                        <span>Explore</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Interactive Step Dots */}
          <div className="mt-8 flex items-center justify-center gap-2">
            {filteredDestinations.map((country, idx) => (
              <button
                key={country.id}
                type="button"
                onClick={() => setActiveDestIndex(idx)}
                className={`h-2 rounded-full transition-all duration-500 ${
                  activeDestIndex === idx
                    ? "w-8 bg-primary"
                    : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label={`Go to ${country.name}`}
              />
            ))}
          </div>

          {/* Interactive Profile Matcher Banner */}
          <div className="relative mt-12 sm:mt-16 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-primary to-indigo-900 p-7 sm:p-10 text-white shadow-xl">
            <div
              aria-hidden="true"
              className="absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-white/10 blur-2xl"
            />
            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-xl">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-100 backdrop-blur-xs">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" /> Free Profile Evaluation
                </span>
                <h3 className="mt-3 text-xl sm:text-2xl font-black text-white">
                  Not sure which European country matches your CGPA & budget?
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-blue-100 leading-relaxed">
                  Our senior education counsellors review your degree, transcripts, and financial plan for free. Get an honest shortlist of universities where your admission and visa are assured.
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap sm:flex-nowrap gap-3">
                <a
                  href={COMPANY.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="btn bg-white text-primary hover:bg-blue-50 font-bold px-6 shadow-md"
                >
                  <MessageSquare className="h-4 w-4" /> Free Assessment
                </a>
                <Link
                  to="/study-abroad"
                  className="btn border border-white/30 text-white hover:bg-white/10 font-bold px-5"
                >
                  Compare All 6 Countries <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          WHY US
      ══════════════════════════════════════════════════════ */}
      <section
        className="section bg-primary-50"
        onMouseEnter={() => setIsWhyPaused(true)}
        onMouseLeave={() => setIsWhyPaused(false)}
      >
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Why WisdomLingo"
              title="15 Years of Proven Excellence"
              subtitle="Zero-error visa filings, Goethe-certified faculty, and direct university ties."
              subtitleClassName="hidden sm:block"
            />
            <a
              href={COMPANY.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="btn-primary mt-6 w-full sm:mt-8 sm:w-auto"
            >
              <MessageSquare className="h-4 w-4" /> Talk to a counsellor
            </a>
          </div>
          <div>
            {/* Animated Runner Beam Track */}
            <div className="relative mb-5 hidden sm:block overflow-hidden h-0.5">
              <div className="h-full w-full border-t-2 border-dashed border-slate-300" />
              <div
                className="h-full bg-gradient-to-r from-primary via-primary-500 to-accent transition-all duration-700 ease-out"
                style={{
                  width: `${((activeWhyIndex + 1) / WHY_US.length) * 100}%`,
                }}
              />
              <div
                aria-hidden="true"
                className="animate-beam-runner absolute top-0 h-1.5 w-24 -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent blur-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-5">
              {WHY_US.map((item, index) => {
                const isActive = activeWhyIndex === index;

                return (
                  <div
                    key={item.title}
                    onClick={() => setActiveWhyIndex(index)}
                    onMouseEnter={() => setActiveWhyIndex(index)}
                    className={`flex gap-3 rounded-2xl p-4 transition-all duration-500 cursor-pointer sm:block sm:gap-4 sm:p-6 ${
                      isActive
                        ? "bg-white shadow-xl ring-2 ring-primary/30 scale-102 border border-primary/20 -translate-y-1"
                        : "bg-white/90 shadow-xs hover:bg-white hover:shadow-md"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-300 sm:h-10 sm:w-10 ${
                        isActive
                          ? "bg-primary text-white scale-110 shadow-md shadow-primary/25"
                          : "bg-primary-50 text-primary"
                      }`}
                    >
                      <item.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${isActive ? "animate-wiggle" : ""}`} />
                    </span>
                    <div className="sm:mt-4">
                      <h3
                        className={`text-sm font-bold sm:text-base transition-colors ${
                          isActive ? "text-primary font-black" : "text-slate-900"
                        }`}
                      >
                        {item.title}
                      </h3>
                      <p className="mt-1 hidden text-xs sm:text-sm leading-relaxed text-slate-600 sm:mt-2 sm:block line-clamp-2">
                        {item.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Interactive Step Dots */}
            <div className="mt-5 flex items-center justify-center gap-2">
              {WHY_US.map((item, idx) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setActiveWhyIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    activeWhyIndex === idx
                      ? "w-8 bg-primary"
                      : "w-2 bg-slate-300 hover:bg-slate-400"
                  }`}
                  aria-label={`Go to ${item.title}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PROCESS — SIMPLE & ANIMATED (FIRST DESIGN)
      ══════════════════════════════════════════════════════ */}
      <section
        className="section bg-white"
        onMouseEnter={() => setIsProcessPaused(true)}
        onMouseLeave={() => setIsProcessPaused(false)}
      >
        <div className="container-page">
          <SectionHeading
            eyebrow="Our Process"
            title="Your 4-Stage Pathway"
            subtitle="From Islamabad consultation to landing in your European campus."
            subtitleClassName="hidden sm:block"
          />

          <div className="relative mt-10 lg:mt-16">
            {/* Desktop timeline track base */}
            <div
              aria-hidden="true"
              className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-0.5 lg:block overflow-hidden"
            >
              <div className="h-full w-full border-t-2 border-dashed border-slate-300" />
            </div>

            {/* Desktop active progress line advancing with active step */}
            <div
              aria-hidden="true"
              className="absolute left-[12.5%] top-8 hidden h-0.5 bg-gradient-to-r from-primary via-primary-500 to-accent transition-all duration-700 ease-out lg:block"
              style={{
                width: `${(activeProcessStep / (PROCESS_STEPS.length - 1)) * 75}%`,
              }}
            />

            {/* Subtle animated beam gliding along the path */}
            <div
              aria-hidden="true"
              className="animate-beam-runner absolute top-[30px] hidden h-1.5 w-16 -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent blur-xs lg:block"
            />

            <ol className="relative grid gap-6 sm:gap-8 lg:grid-cols-4 lg:gap-10">
              {PROCESS_STEPS.map((step, index) => {
                const isActive = activeProcessStep === index;
                const isCompleted = activeProcessStep > index;

                return (
                  <li
                    key={step.title}
                    onClick={() => setActiveProcessStep(index)}
                    onMouseEnter={() => setActiveProcessStep(index)}
                    className="group relative flex cursor-pointer gap-4 text-left transition-all duration-300 lg:flex-col lg:items-center lg:gap-0 lg:text-center"
                  >
                    {/* Mobile vertical connecting line */}
                    {index < PROCESS_STEPS.length - 1 && (
                      <span
                        aria-hidden="true"
                        className={`absolute -bottom-6 left-5 top-12 w-0 border-l-2 transition-colors duration-500 lg:hidden ${
                          isCompleted
                            ? "border-primary"
                            : "border-dashed border-slate-300"
                        }`}
                      />
                    )}

                    {/* Step Node Circle */}
                    <span
                      className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500 lg:h-16 lg:w-16 ${
                        isActive
                          ? "scale-110 border-primary bg-primary text-white shadow-lg shadow-primary/25 ring-4 ring-primary-100"
                          : isCompleted
                          ? "border-primary-400 bg-primary-50 text-primary shadow-xs"
                          : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700"
                      }`}
                    >
                      <step.icon
                        className={`h-5 w-5 transition-transform duration-300 lg:h-6 lg:w-6 ${
                          isActive ? "animate-wiggle text-white" : ""
                        }`}
                      />

                      {/* Number badge */}
                      <span
                        className={`text-xs font-extrabold transition-all duration-300 lg:absolute lg:-right-1 lg:-top-1 lg:flex lg:h-6 lg:w-6 lg:items-center lg:justify-center lg:rounded-full lg:text-[11px] lg:font-bold ${
                          isActive
                            ? "scale-110 bg-accent text-white shadow-sm ring-2 ring-white"
                            : isCompleted
                            ? "bg-primary text-white"
                            : "bg-slate-200 text-slate-700 lg:bg-slate-100 lg:text-slate-600"
                        }`}
                      >
                        {index + 1}
                      </span>
                    </span>

                    {/* Step Title & Description */}
                    <div className="lg:mt-5">
                      <h3
                        className={`text-sm font-bold transition-colors duration-300 sm:text-base ${
                          isActive
                            ? "font-extrabold text-primary"
                            : "text-slate-900 group-hover:text-primary"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p className="mt-1 hidden text-sm leading-relaxed text-slate-600 transition-colors duration-300 sm:mt-2 sm:block">
                        {step.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>

            {/* Interactive Step Dots */}
            <div className="mt-8 flex items-center justify-center gap-2 lg:mt-10">
              {PROCESS_STEPS.map((step, idx) => (
                <button
                  key={step.title}
                  type="button"
                  onClick={() => setActiveProcessStep(idx)}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    activeProcessStep === idx
                      ? "w-8 bg-primary"
                      : "w-2 bg-slate-300 hover:bg-slate-400"
                  }`}
                  aria-label={`Go to Step ${idx + 1}: ${step.title}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          TESTIMONIALS / SUCCESS STORIES — SOCIAL PROOF
      ══════════════════════════════════════════════════════ */}
      <section
        className="section relative overflow-hidden bg-slate-50"
        onMouseEnter={() => setIsTestimonialPaused(true)}
        onMouseLeave={() => setIsTestimonialPaused(false)}
      >
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-800 shadow-2xs">
              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              Verified Outcomes
            </span>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-[2.5rem]">
              Real Journeys, <span className="text-primary">Real Results</span>
            </h2>
            <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-600 max-w-xl mx-auto">
              Verified admissions, Goethe exam certificates, and European visa success stories.
            </p>

            {/* Credibility highlights */}
            <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs sm:gap-6">
              <span className="flex items-center gap-1.5">
                <span className="flex text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </span>
                <strong className="text-slate-900">4.9 / 5</strong> Rating (350+ reviews)
              </span>
              <span className="hidden h-4 w-px bg-slate-200 sm:block" />
              <span className="flex items-center gap-1.5 text-slate-700">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <strong className="text-slate-900">98.4%</strong> Visa Rate
              </span>
              <span className="hidden h-4 w-px bg-slate-200 sm:block" />
              <span className="flex items-center gap-1.5 text-slate-700">
                <GraduationCap className="h-4 w-4 text-primary" />
                <strong className="text-slate-900">500+</strong> Placed in Europe
              </span>
            </div>
          </div>

          {/* Animated Runner Beam Track */}
          <div className="relative mt-10 mb-2 hidden lg:block overflow-hidden h-0.5">
            <div className="h-full w-full border-t-2 border-dashed border-slate-300" />
            <div
              className="h-full bg-gradient-to-r from-primary via-primary-500 to-accent transition-all duration-700 ease-out"
              style={{
                width: `${((activeTestimonialIndex + 1) / TESTIMONIALS.length) * 100}%`,
              }}
            />
            <div
              aria-hidden="true"
              className="animate-beam-runner absolute top-0 h-1.5 w-24 -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent blur-xs"
            />
          </div>

          <div className="mt-8 grid gap-6 sm:gap-8 lg:grid-cols-3">
            {TESTIMONIALS.map((testimonial, index) => {
              const isActive = activeTestimonialIndex === index;

              return (
                <figure
                  key={testimonial.name}
                  onClick={() => setActiveTestimonialIndex(index)}
                  onMouseEnter={() => setActiveTestimonialIndex(index)}
                  className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border bg-white p-5 transition-all duration-500 cursor-pointer sm:p-6 ${
                    isActive
                      ? "border-primary/50 shadow-2xl -translate-y-2 ring-2 ring-primary/30 scale-101"
                      : "border-slate-200/90 shadow-sm hover:border-slate-300 hover:-translate-y-1"
                  }`}
                >
                  {/* Background quote watermark */}
                  <Quote
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-3 -top-3 h-20 w-20 fill-slate-50 text-slate-100 transition-transform duration-300 group-hover:scale-110"
                  />

                  <div className="relative">
                    {/* Top Bar: Country Flag + Verified Pill */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-800">
                        <span className="text-base leading-none">{testimonial.flag}</span>
                        {testimonial.destinationCountry}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold transition-all duration-300 ${
                          isActive
                            ? "border border-emerald-300 bg-emerald-100 text-emerald-800 scale-105"
                            : "border border-emerald-200 bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        <BadgeCheck className={`h-3.5 w-3.5 ${isActive ? "animate-wiggle" : ""}`} />
                        {testimonial.statusBadge}
                      </span>
                    </div>

                    {/* Rating Stars & Intake */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex gap-1 text-amber-500">
                        {Array.from({ length: testimonial.rating }).map((_, rIdx) => (
                          <Star key={rIdx} className="h-3.5 w-3.5 fill-current" />
                        ))}
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {testimonial.intake}
                      </span>
                    </div>

                    {/* Quote - clamped to 2 lines */}
                    <blockquote className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-700 line-clamp-2">
                      &ldquo;{testimonial.quote}&rdquo;
                    </blockquote>

                    {/* Highlight pill */}
                    <div className="mt-3.5 rounded-xl border border-primary-100 bg-primary-50/60 px-3 py-1.5 text-xs font-semibold text-primary truncate">
                      <span className="font-extrabold">Highlight:</span> {testimonial.highlight}
                    </div>
                  </div>

                  {/* Figcaption + Read Story Details Button */}
                  <div className="relative mt-5 border-t border-slate-100 pt-4">
                    <figcaption className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative shrink-0">
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            loading="lazy"
                            className={`h-10 w-10 rounded-full border-2 border-white object-cover shadow-sm transition-all duration-300 ${
                              isActive ? "ring-2 ring-primary scale-105" : "ring-1 ring-primary-100"
                            }`}
                          />
                          <span
                            aria-label="Verified Alumnus"
                            className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-600 text-white ring-1 ring-white"
                          >
                            <Check className="h-2 w-2 stroke-[3]" />
                          </span>
                        </div>
                        <div className="min-w-0">
                          <span
                            className={`block truncate text-xs sm:text-sm font-bold transition-colors ${
                              isActive ? "text-primary font-black" : "text-slate-900"
                            }`}
                          >
                            {testimonial.name}
                          </span>
                          <span className="block truncate text-[11px] text-slate-500">
                            {testimonial.role} • {testimonial.institution}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailData({
                            title: testimonial.name,
                            subtitle: `${testimonial.role} • ${testimonial.destinationCountry}`,
                            category: "Success Story",
                            badge: testimonial.statusBadge,
                            badgeColor: "bg-emerald-50 text-emerald-700",
                            image: testimonial.avatar,
                            description: `"${testimonial.quote}"`,
                            metrics: [
                              { label: "Intake", value: testimonial.intake },
                              { label: "Destination", value: testimonial.destinationCountry },
                              { label: "Outcome", value: testimonial.metric },
                            ],
                            points: [
                              `Institution: ${testimonial.institution}`,
                              `Key Achievement: ${testimonial.highlight}`,
                              `Verified Alumnus placed through WisdomLingo`,
                            ],
                            primaryCtaText: "Start Similar Journey",
                            onPrimaryCta: () => setEnquiryOpen(true),
                            secondaryCtaText: "WhatsApp Counsellor",
                            secondaryCtaLink: COMPANY.whatsapp,
                          });
                        }}
                        className="shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-primary hover:bg-primary-50 transition"
                      >
                        Story
                      </button>
                    </figcaption>
                  </div>
                </figure>
              );
            })}
          </div>

          {/* Interactive Step Dots */}
          <div className="mt-8 flex items-center justify-center gap-2">
            {TESTIMONIALS.map((testimonial, idx) => (
              <button
                key={testimonial.name}
                type="button"
                onClick={() => setActiveTestimonialIndex(idx)}
                className={`h-2 rounded-full transition-all duration-500 ${
                  activeTestimonialIndex === idx
                    ? "w-8 bg-primary"
                    : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label={`Go to ${testimonial.name}`}
              />
            ))}
          </div>

          {/* Social Proof sub-banner */}
          <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:px-8 sm:py-6">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary sm:flex">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 sm:text-base">
                  Want to connect with successful alumni in your field?
                </h4>
                <p className="text-xs text-slate-500 sm:text-sm">
                  Our counsellors can arrange peer-mentorship briefings with students currently studying in Germany and Europe.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setEnquiryOpen(true)}
              className="btn-outline shrink-0 text-xs sm:text-sm"
            >
              Ask an Alumnus <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          MOBILE CTA BANNER — between testimonials & articles
      ══════════════════════════════════════════════════════ */}
      <div className="bg-primary px-4 py-8 sm:hidden">
        <div className="text-center">
          <BookOpen className="mx-auto h-8 w-8 text-white/60" />
          <h2 className="mt-3 text-xl font-extrabold text-white">Ready to start?</h2>
          <p className="mt-1 text-sm text-white/70">Get a free counselling session today.</p>
          <div className="mt-4 flex gap-3">
            <a
              href={COMPANY.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="flex-1 rounded-xl bg-white py-3 text-center text-sm font-bold text-primary shadow transition hover:bg-white/90"
            >
              WhatsApp Us
            </a>
            <a
              href={COMPANY.phoneHref}
              className="flex-1 rounded-xl border border-white/30 py-3 text-center text-sm font-bold text-white transition hover:bg-white/10"
            >
              Call Now
            </a>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          INSIGHTS & NEWS — LUXURY EDITORIAL KNOWLEDGE HUB
      ══════════════════════════════════════════════════════ */}
      {/* ══════════════════════════════════════════════════════
          INSIGHTS & NEWS — LUXURY EDITORIAL KNOWLEDGE HUB
      ══════════════════════════════════════════════════════ */}
      <section
        className="section bg-white"
        onMouseEnter={() => setIsArticlePaused(true)}
        onMouseLeave={() => setIsArticlePaused(false)}
      >
        <div className="container-page">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-sky-800 shadow-2xs">
                <BookOpen className="h-3.5 w-3.5 text-sky-600" />
                Knowledge Hub
              </span>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-[2.5rem]">
                Guides & <span className="text-primary">Field Intel</span>
              </h2>
              <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-600 max-w-xl">
                Visa policy announcements and European university application guides.
              </p>
            </div>
            <ViewAllArticles className="hidden shrink-0 sm:inline-flex" />
          </div>

          {/* Animated Runner Beam Track */}
          <div className="relative mt-8 mb-2 hidden lg:block overflow-hidden h-0.5">
            <div className="h-full w-full border-t-2 border-dashed border-slate-300" />
            <div
              className="h-full bg-gradient-to-r from-primary via-primary-500 to-accent transition-all duration-700 ease-out"
              style={{
                width: `${((activeArticleIndex + 1) / ARTICLES.length) * 100}%`,
              }}
            />
            <div
              aria-hidden="true"
              className="animate-beam-runner absolute top-0 h-1.5 w-24 -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent blur-xs"
            />
          </div>

          {/* Cards */}
          <div className="mt-8 grid gap-6 sm:gap-8 md:grid-cols-3">
            {ARTICLES.map((article, index) => {
              const isActive = activeArticleIndex === index;

              return (
                <article
                  key={article.title}
                  onClick={() => setActiveArticleIndex(index)}
                  onMouseEnter={() => setActiveArticleIndex(index)}
                  className={`group flex flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-500 cursor-pointer ${
                    isActive
                      ? "border-primary/60 shadow-2xl -translate-y-2 ring-2 ring-primary/30 scale-101"
                      : "border-slate-200/90 shadow-sm hover:border-slate-300 hover:-translate-y-1"
                  }`}
                >
                  {/* Image & Floating Category Badges */}
                  <div className="relative overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      loading="lazy"
                      className={`h-48 w-full object-cover transition duration-700 ease-out ${
                        isActive ? "scale-108" : "group-hover:scale-105"
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60" />

                    {/* Category Pill Floating */}
                    <span
                      className={`absolute left-3.5 top-3.5 rounded-lg px-2.5 py-0.5 text-xs font-extrabold shadow-md backdrop-blur-xs transition-colors ${
                        isActive
                          ? "bg-primary text-white"
                          : "bg-white/95 text-slate-800"
                      }`}
                    >
                      {article.category}
                    </span>

                    {/* Read Time Pill Floating */}
                    <span className="absolute right-3.5 top-3.5 flex items-center gap-1 rounded-lg bg-slate-900/80 px-2 py-0.5 text-[11px] font-semibold text-white shadow-md backdrop-blur-xs">
                      <Clock className={`h-3 w-3 text-white/80 ${isActive ? "animate-wiggle" : ""}`} /> {article.readTime}
                    </span>

                    {/* Author at bottom of image */}
                    {article.author && (
                      <span className="absolute bottom-2.5 left-3.5 text-xs font-semibold text-white drop-shadow-sm">
                        By {article.author}
                      </span>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="flex flex-1 flex-col p-5">
                    {/* Meta date */}
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <CalendarDays className="h-3.5 w-3.5" />
                      <span>{article.date}</span>
                    </div>

                    <h3
                      className={`mt-2.5 text-base font-bold leading-snug transition-colors ${
                        isActive ? "text-primary font-black" : "text-slate-900 group-hover:text-primary"
                      }`}
                    >
                      <Link to={article.to} className="hover:underline">
                        {article.title}
                      </Link>
                    </h3>

                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 line-clamp-2">
                      {article.excerpt}
                    </p>

                    {/* Actions: Details Modal + Read Guide */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailData({
                            title: article.title,
                            subtitle: `${article.category} • ${article.date}`,
                            category: "Field Intel & Guide",
                            badge: article.readTime,
                            badgeColor: "bg-sky-50 text-sky-800",
                            image: article.image,
                            description: article.excerpt,
                            metrics: [
                              { label: "Category", value: article.category },
                              { label: "Published", value: article.date },
                              { label: "Read Time", value: article.readTime },
                            ],
                            points: article.tags?.map((t) => `Topic: ${t}`) || [
                              "Comprehensive embassy visa dossier",
                              "Authored by European admissions counsellors",
                            ],
                            primaryCtaText: "Read Complete Guide",
                            onPrimaryCta: () => {
                              window.location.href = article.to;
                            },
                            secondaryCtaText: "WhatsApp Counsellor",
                            secondaryCtaLink: COMPANY.whatsapp,
                          });
                        }}
                        className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs sm:text-sm font-bold text-slate-700 transition-colors hover:border-primary hover:bg-primary-50 hover:text-primary"
                      >
                        Quick View
                      </button>
                      <Link
                        to={article.to}
                        onClick={(e) => e.stopPropagation()}
                        className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs sm:text-sm font-bold text-white transition-colors ${
                          isActive ? "bg-primary hover:bg-blue-800" : "bg-slate-900 hover:bg-primary"
                        }`}
                      >
                        <span>Read</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Interactive Step Dots */}
          <div className="mt-8 flex items-center justify-center gap-2">
            {ARTICLES.map((article, idx) => (
              <button
                key={article.title}
                type="button"
                onClick={() => setActiveArticleIndex(idx)}
                className={`h-2 rounded-full transition-all duration-500 ${
                  activeArticleIndex === idx
                    ? "w-8 bg-primary"
                    : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label={`Go to ${article.title}`}
              />
            ))}
          </div>

          <ViewAllArticles className="mt-8 w-full sm:hidden" />

          {/* Handbook Download / Free Checklist Callout */}
          <div className="mt-12 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-primary-50/40 p-6 sm:p-8">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-md shadow-primary/25">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 sm:text-lg">
                    Need the 2026 European Visa & Study Dossier?
                  </h4>
                  <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                    Checklist for APS certificates, blocked accounts, and university deadlines.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEnquiryOpen(true)}
                className="btn-primary shrink-0 px-6 py-3 text-xs sm:text-sm"
              >
                Request Free Checklist <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <DetailModal
        open={Boolean(detailData)}
        onClose={() => setDetailData(null)}
        data={detailData}
      />
      <EnquiryModal open={enquiryOpen} onClose={() => setEnquiryOpen(false)} />
      <EnquiryModal
        open={Boolean(enrollCourse)}
        onClose={() => setEnrollCourse(null)}
        title={enrollCourse ? `Enroll: ${enrollCourse.title}` : "Enroll"}
        intro="Send us your details and a counsellor will confirm the next batch, timings and seat availability."
        defaultSubject={enrollCourse ? enrollCourse.title : ""}
        defaultMessage={
          enrollCourse
            ? `I would like to enroll in ${enrollCourse.title}. Please share the next batch dates and timings.`
            : ""
        }
      />
    </>
  );
};
