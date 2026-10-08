import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  Clock,
  Globe,
  MessageSquare,
  Quote,
  Star,
} from "lucide-react";
import { useCompany } from "../hooks/useCompany";
import { HERO_IMAGES } from "../config/media";
import {
  ARTICLES,
  CATEGORY_TABS,
  COUNTRY_ICONS,
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
import { Seo } from "../components/Seo";

/** Shown above the article grid on desktop, below it on phones. */
const ViewAllArticles: React.FC<{ className?: string }> = ({ className = "" }) => (
  <Link to="/blog" className={`btn-ghost ${className}`}>
    View All Articles <ArrowRight className="h-4 w-4" />
  </Link>
);



export const HomePage: React.FC = () => {
  const COMPANY = useCompany();
  const { items: countries } = useRemoteList<StudyCountry>("study_countries", SEED_COUNTRIES, mapCountry);
  const { items: allCourses } = useRemoteList<Course>("courses", SEED_COURSES, mapCourse);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enrollCourse, setEnrollCourse] = useState<Course | null>(null);
  const [activeCourseTab, setActiveCourseTab] = useState<CourseCategory>("german");

  const filteredCourses = useMemo(
    () => allCourses.filter((c) => c.category === activeCourseTab).slice(0, 3),
    [allCourses, activeCourseTab]
  );

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

        {/* Crisp light overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-white/92 backdrop-blur-[1px] lg:bg-transparent lg:bg-gradient-to-r lg:from-white lg:via-white/96 lg:to-white/40"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-t from-white via-transparent to-white/40"
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

            <h1 className="mt-3 text-[1.55rem] font-extrabold leading-[1.2] tracking-tight text-slate-900 sm:mt-4 sm:text-5xl lg:text-[3.4rem]">
              Your pathway to <span className="text-primary">Europe</span>
              <span className="block mt-0.5 text-slate-800">starts here.</span>
            </h1>

            <p className="mx-auto mt-2 max-w-sm text-xs font-medium leading-relaxed text-slate-600 sm:mt-4 sm:max-w-xl sm:text-base sm:font-normal lg:mx-0">
              <span className="sm:hidden">German Language • Study Abroad • Paid Apprenticeships</span>
              <span className="hidden sm:inline">
                Navigate the complexities of studying, working, or learning a language abroad with our
                expert team. We handle the details so you can focus on your future.
              </span>
            </p>

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
      <section className="bg-slate-50 pb-12 pt-3 sm:pb-16 sm:pt-8">
        <div className="container-page">
          {/* Courses Section Header */}
          <div className="mb-4 sm:mb-8">
            <SectionHeading
              align="center"
              eyebrow="Our Courses"
              title="Language & Skill Programs"
              titleClassName="hidden sm:block"
              subtitle="Certified training designed to take you from beginner to advanced fluency."
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
                  onClick={() => setActiveCourseTab(tab.key)}
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

          {/* Course Cards */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} onEnroll={setEnrollCourse} />
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
          PROGRAMS
      ══════════════════════════════════════════════════════ */}
      <section className="section bg-white">
        <div className="container-page">
          <SectionHeading
            eyebrow="Our Programs"
            title="Three programs, one destination"
            subtitle="We specialize in creating tailored pathways for international students and professionals aiming for excellence in Europe."
            subtitleClassName="hidden sm:block"
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-3 sm:gap-6 lg:mt-12">
            {HOME_PROGRAMS.map((program) => (
              <article
                key={program.title}
                className={`relative flex flex-col rounded-2xl border bg-white p-5 transition hover:shadow-lg sm:p-7 ${
                  program.featured ? "border-accent/30 shadow-lg" : "border-slate-200 shadow-sm"
                }`}
              >
                {program.featured && (
                  <span className="absolute -top-3 right-6 rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                    Most popular
                  </span>
                )}
                <div className="flex items-center gap-3 sm:block">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12 ${program.tint}`}>
                    <program.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </span>
                  <h3 className="text-base font-bold text-slate-900 sm:mt-5 sm:text-lg">{program.title}</h3>
                </div>
                <p className="mt-2 hidden text-sm leading-relaxed text-slate-600 sm:block">{program.description}</p>
                <ul className="mt-3 flex-1 space-y-2 sm:mt-5 sm:space-y-2.5">
                  {program.points.slice(0, 3).map((point) => (
                    <li key={point} className="flex items-start gap-2 text-xs text-slate-700 sm:gap-2.5 sm:text-sm">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent sm:h-4 sm:w-4" />
                      <span className="line-clamp-2 sm:line-clamp-none">{point}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={program.to}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary transition hover:gap-2.5 sm:mt-7"
                >
                  {program.cta} <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>



      {/* ══════════════════════════════════════════════════════
          DESTINATIONS
      ══════════════════════════════════════════════════════ */}
      <section className="section bg-white">
        <div className="container-page">
          <SectionHeading
            eyebrow="Destinations"
            title="Six countries we know inside out"
            subtitle="Every country has its own rules and intakes. We match you to the one that fits."
            subtitleClassName="hidden sm:block"
          />
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:mt-12 lg:grid-cols-3">
            {countries.slice(0, 6).map((country) => {
              const Icon = COUNTRY_ICONS[country.name] ?? Globe;
              return (
                <Link
                  key={country.id}
                  to="/study-abroad"
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-primary/30 hover:shadow-xl sm:p-6"
                >
                  {/* Subtle gradient accent on hover */}
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary-50/0 to-primary-50/0 transition-all duration-300 group-hover:from-primary-50/60 group-hover:to-transparent" />
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-base sm:text-lg">
                      {country.flag}
                    </span>
                    <Icon className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-primary sm:h-5 sm:w-5" />
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-slate-900 sm:mt-4 sm:text-base">
                    {country.name}
                  </h3>
                  <p className="mt-1 hidden text-xs leading-snug text-slate-500 sm:block sm:text-sm">
                    {country.tagline}
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-xs font-bold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Learn more <ArrowRight className="h-3 w-3" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          WHY US
      ══════════════════════════════════════════════════════ */}
      <section className="section bg-primary-50">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Why WisdomLingo"
              title="Fifteen years of getting the details right"
              subtitle="Most applications are rejected on paperwork, not merit. That is where we focus."
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
          <div className="grid grid-cols-2 gap-3 sm:gap-5">
            {WHY_US.map((item) => (
              <div key={item.title} className="flex gap-3 rounded-2xl bg-white p-4 shadow-sm sm:block sm:gap-4 sm:p-6">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary sm:h-10 sm:w-10">
                  <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </span>
                <div className="sm:mt-4">
                  <h3 className="text-sm font-bold text-slate-900 sm:text-base">{item.title}</h3>
                  <p className="mt-1 hidden text-sm leading-relaxed text-slate-600 sm:mt-2 sm:block">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PROCESS
      ══════════════════════════════════════════════════════ */}
      <section className="section bg-white">
        <div className="container-page">
          <SectionHeading
            eyebrow="Our Process"
            title="Your pathway to success"
            subtitle="A transparent, step-by-step approach to securing your future abroad. We are with you at every milestone."
            subtitleClassName="hidden sm:block"
          />
          <div className="relative mt-10 lg:mt-14">
            <span
              aria-hidden="true"
              className="absolute left-[12.5%] right-[12.5%] top-8 hidden border-t border-dashed border-slate-300 lg:block"
            />
            <ol className="relative grid gap-6 sm:gap-8 lg:grid-cols-4 lg:gap-10">
              {PROCESS_STEPS.map((step, index) => (
                <li
                  key={step.title}
                  className="relative flex gap-4 text-left lg:flex-col lg:items-center lg:gap-0 lg:text-center"
                >
                  {index < PROCESS_STEPS.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-6 left-5 top-12 w-0 border-l border-dashed border-slate-300 lg:hidden"
                    />
                  )}
                  <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary-100 bg-primary-50 text-primary shadow-sm lg:h-16 lg:w-16 lg:border-slate-200 lg:bg-white">
                    <step.icon className="hidden h-6 w-6 lg:block" />
                    <span className="text-sm font-extrabold lg:absolute lg:-right-1 lg:-top-1 lg:flex lg:h-6 lg:w-6 lg:items-center lg:justify-center lg:rounded-full lg:bg-primary lg:text-[11px] lg:font-bold lg:text-white">
                      {index + 1}
                    </span>
                  </span>
                  <div className="lg:mt-5">
                    <h3 className="text-sm font-bold text-slate-900 sm:text-base">{step.title}</h3>
                    <p className="mt-1 hidden text-sm leading-relaxed text-slate-600 sm:mt-2 sm:block">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════════ */}
      <section className="section bg-slate-50">
        <div className="container-page">
          <SectionHeading
            eyebrow="Success Stories"
            title="Real journeys, real results"
            subtitle="Do not just take our word for it. Hear from the students and professionals who have built their futures with us."
            subtitleClassName="hidden sm:block"
          />
          <div className="mt-8 grid gap-4 sm:gap-6 lg:mt-12 lg:grid-cols-3">
            {TESTIMONIALS.map((testimonial, i) => (
              <figure
                key={testimonial.name}
                className={`relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 ${
                  i > 0 ? "hidden sm:block" : ""
                }`}
              >
                <Quote
                  aria-hidden="true"
                  className="absolute right-5 top-5 h-10 w-10 fill-slate-100 text-slate-100 sm:h-12 sm:w-12"
                />
                <div className="flex gap-0.5 text-accent">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-3.5 w-3.5 fill-current sm:h-4 sm:w-4" />
                  ))}
                </div>
                <blockquote className="relative mt-4 text-sm leading-relaxed text-slate-700 sm:mt-5">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4 sm:mt-6 sm:pt-5">
                  <img
                    src={testimonial.avatar}
                    alt=""
                    loading="lazy"
                    className="h-9 w-9 rounded-full object-cover sm:h-10 sm:w-10"
                  />
                  <span>
                    <span className="block text-sm font-bold text-slate-900">{testimonial.name}</span>
                    <span className="block text-xs text-slate-500">{testimonial.role}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
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
          INSIGHTS / ARTICLES
      ══════════════════════════════════════════════════════ */}
      <section className="section bg-white">
        <div className="container-page">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              align="left"
              eyebrow="Insights & News"
              title="Latest from WisdomLingo"
              subtitle="Expert advice, university updates, and essential tips for your international education journey."
              subtitleClassName="hidden sm:block"
            />
            <ViewAllArticles className="hidden shrink-0 sm:inline-flex" />
          </div>

          <div className="mt-8 grid gap-4 sm:gap-6 md:grid-cols-3 lg:mt-12">
            {ARTICLES.map((article) => (
              <article
                key={article.title}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
              >
                <div className="relative hidden overflow-hidden sm:block">
                  <img
                    src={article.image}
                    alt=""
                    loading="lazy"
                    className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-md bg-white/95 px-2.5 py-1 text-[11px] font-bold text-slate-700 shadow-sm">
                    {article.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-4 sm:p-6">
                  <span className="mb-2 w-fit rounded-md bg-primary-50 px-2.5 py-1 text-[11px] font-bold text-primary sm:hidden">
                    {article.category}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-3 w-3" /> {article.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3" /> {article.readTime}
                    </span>
                  </div>
                  <h3 className="mt-2 text-sm font-bold leading-snug text-slate-900 sm:mt-3 sm:text-base">
                    {article.title}
                  </h3>
                  <p className="mt-2 hidden flex-1 text-sm leading-relaxed text-slate-600 sm:block">
                    {article.excerpt}
                  </p>
                  <Link
                    to={article.to}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-primary transition hover:gap-2.5 sm:mt-5 sm:text-sm"
                  >
                    Read Article <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <ViewAllArticles className="mt-8 w-full sm:hidden" />
        </div>
      </section>

      {/* Modals */}
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
