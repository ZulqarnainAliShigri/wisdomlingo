import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Check, Clock, Globe, MessageSquare, Quote, Star } from "lucide-react";
import { COMPANY } from "../config/site";
import { HERO_IMAGES } from "../config/media";
import {
  ARTICLES,
  COUNTRY_ICONS,
  HERO_HIGHLIGHTS,
  HERO_STATS,
  HOME_PROGRAMS,
  PROCESS_STEPS,
  TESTIMONIALS,
  WHY_US,
} from "../data/content";
import { SEED_COUNTRIES } from "../data/seed";
import { useRemoteList } from "../hooks/useRemoteList";
import { mapCountry } from "../lib/mappers";
import { StudyCountry } from "../types";
import { SectionHeading } from "../components/ui/SectionHeading";
import { EnquiryModal } from "../components/public/EnquiryModal";
import { Seo } from "../components/Seo";

/** Shown above the article grid on desktop, below it on phones. */
const ViewAllArticles: React.FC<{ className?: string }> = ({ className = "" }) => (
  <Link to="/about" className={`btn-ghost ${className}`}>
    View All Articles <ArrowRight className="h-4 w-4" />
  </Link>
);

export const HomePage: React.FC = () => {
  const { items: countries } = useRemoteList<StudyCountry>("study_countries", SEED_COUNTRIES, mapCountry);
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  return (
    <>
      <Seo page="home" />

      {/* Hero - centred and single column on phones, split on desktop */}
      <section className="relative isolate overflow-hidden bg-slate-50">
        {/* Largest Contentful Paint element - fetched at high priority so the
            hero paints early. Core Web Vitals feed into ranking. */}
        <img
          src={HERO_IMAGES.home}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-white/85 lg:bg-transparent lg:bg-gradient-to-r lg:from-white lg:via-white/96 lg:to-white/45"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-t from-white via-transparent to-white/30"
        />

        <div className="container-page grid items-center gap-12 pb-12 pt-8 sm:pb-20 sm:pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:pb-24 lg:pt-16">
          <div className="animate-fade-in-up text-center lg:text-left">
            <span className="badge border border-primary-100 bg-primary-50 text-primary">
              <span aria-hidden="true" className="mr-2 h-1.5 w-1.5 rounded-full bg-accent" />
              Premium Education Consultancy
            </span>

            <h1 className="mt-5 text-[2rem] font-extrabold leading-[1.12] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.4rem]">
              Your pathway to <span className="text-primary">Europe</span> starts with the right
              guidance.
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-600 lg:mx-0">
              Navigate the complexities of studying, working, or learning a language abroad with our
              expert team. We handle the details so you can focus on your future.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <button
                type="button"
                onClick={() => setEnquiryOpen(true)}
                className="btn-accent shadow-lg shadow-accent/20"
              >
                Start Your Journey <ArrowRight className="h-4 w-4" />
              </button>
              <Link to="/courses" className="btn-ghost">
                Explore Programs
              </Link>
            </div>

            {/* Stacked with hairline rules on phones, a single row from sm up */}
            <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200 sm:mt-10 sm:flex sm:flex-wrap sm:justify-center sm:gap-x-12 sm:gap-y-5 sm:divide-y-0 sm:border-0 lg:justify-start">
              {HERO_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-baseline justify-center gap-2.5 py-3 sm:block sm:py-0"
                >
                  <p className="text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="text-xs font-medium text-slate-500 sm:mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Not part of the phone layout - the call bar carries the mobile CTA instead */}
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

      {/* Programs */}
      <section className="section bg-white">
        <div className="container-page">
          <SectionHeading
            title="Three programs, one destination"
            subtitle="We specialize in creating tailored pathways for international students and professionals aiming for excellence in Europe."
          />
          <div className="mt-10 grid gap-5 sm:gap-6 md:grid-cols-3 lg:mt-12">
            {HOME_PROGRAMS.map((program) => (
              <article
                key={program.title}
                className={`relative flex flex-col rounded-2xl border bg-white p-6 transition hover:shadow-lg sm:p-7 ${
                  program.featured ? "border-accent/30 shadow-lg" : "border-slate-200 shadow-sm"
                }`}
              >
                {program.featured && (
                  <span className="absolute -top-3 right-6 rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                    Most popular
                  </span>
                )}
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${program.tint}`}
                >
                  <program.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-slate-900">{program.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{program.description}</p>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {program.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      {point}
                    </li>
                  ))}
                </ul>
                <Link
                  to={program.to}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-primary transition hover:gap-2.5 sm:mt-7"
                >
                  {program.cta} <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations - two up on phones */}
      <section className="section bg-slate-50">
        <div className="container-page">
          <SectionHeading
            title="Six countries we know inside out"
            subtitle="Every country has its own rules and intakes. We match you to the one that fits."
          />
          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:mt-12 lg:grid-cols-3">
            {countries.slice(0, 6).map((country) => {
              const Icon = COUNTRY_ICONS[country.name] ?? Globe;
              return (
                <Link
                  key={country.id}
                  to="/study-abroad"
                  className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-primary-100 hover:shadow-lg sm:p-6"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-bold tracking-widest text-slate-600">
                      {country.flag}
                    </span>
                    <Icon className="h-5 w-5 shrink-0 text-slate-400 transition group-hover:text-primary" />
                  </div>
                  <h3 className="mt-4 text-sm font-bold text-slate-900 sm:mt-5 sm:text-base">
                    {country.name}
                  </h3>
                  <p className="mt-1 text-xs leading-snug text-slate-500 sm:text-sm">
                    {country.tagline}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why us - icon beside the copy on phones, above it from sm up */}
      <section className="section bg-primary-50">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div>
            <SectionHeading
              align="left"
              eyebrowTone="label"
              eyebrow="Why WisdomLingo"
              title="Fifteen years of getting the details right"
              subtitle="Most applications are rejected on paperwork, not merit. That is where we focus."
            />
            <a
              href={COMPANY.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="btn-primary mt-8 w-full sm:w-auto"
            >
              <MessageSquare className="h-4 w-4" /> Talk to a counsellor
            </a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            {WHY_US.map((item) => (
              <div key={item.title} className="flex gap-4 rounded-2xl bg-white p-5 shadow-sm sm:block sm:p-6">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary">
                  <item.icon className="h-5 w-5" />
                </span>
                <div className="sm:mt-4">
                  <h3 className="font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process - vertical timeline on phones, horizontal from lg up */}
      <section className="section bg-white">
        <div className="container-page">
          <SectionHeading
            eyebrowTone="label"
            eyebrow="Our process"
            title="Your pathway to success"
            subtitle="A transparent, step-by-step approach to securing your future abroad. We are with you at every milestone."
          />
          <div className="relative mt-10 lg:mt-14">
            <span
              aria-hidden="true"
              className="absolute left-[12.5%] right-[12.5%] top-8 hidden border-t border-dashed border-slate-300 lg:block"
            />
            <ol className="relative grid gap-8 lg:grid-cols-4 lg:gap-10">
              {PROCESS_STEPS.map((step, index) => (
                <li
                  key={step.title}
                  className="relative flex gap-5 text-left lg:flex-col lg:items-center lg:gap-0 lg:text-center"
                >
                  {index < PROCESS_STEPS.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-8 left-6 top-14 w-0 border-l border-dashed border-slate-300 lg:hidden"
                    />
                  )}
                  {/* Phones show the step number in the circle, desktop the icon with a number badge */}
                  <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-primary-100 bg-primary-50 text-primary shadow-sm lg:h-16 lg:w-16 lg:border-slate-200 lg:bg-white">
                    <step.icon className="hidden h-6 w-6 lg:block" />
                    <span className="text-base font-extrabold lg:absolute lg:-right-1 lg:-top-1 lg:flex lg:h-6 lg:w-6 lg:items-center lg:justify-center lg:rounded-full lg:bg-primary lg:text-[11px] lg:font-bold lg:text-white">
                      {index + 1}
                    </span>
                  </span>
                  <div className="lg:mt-5">
                    <h3 className="font-bold text-slate-900">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section bg-slate-50">
        <div className="container-page">
          <SectionHeading
            eyebrowTone="label"
            eyebrow="Success stories"
            title="Real journeys, real results"
            subtitle="Do not just take our word for it. Hear from the students and professionals who have built their futures with us."
          />
          <div className="mt-10 grid gap-5 sm:gap-6 lg:mt-12 lg:grid-cols-3">
            {TESTIMONIALS.map((testimonial) => (
              <figure
                key={testimonial.name}
                className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7"
              >
                <Quote
                  aria-hidden="true"
                  className="absolute right-5 top-5 h-12 w-12 fill-slate-100 text-slate-100"
                />
                <div className="flex gap-0.5 text-accent">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="relative mt-5 text-sm leading-relaxed text-slate-700">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                  <img
                    src={testimonial.avatar}
                    alt=""
                    loading="lazy"
                    className="h-10 w-10 rounded-full object-cover"
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

      {/* Insights - text-only list on phones, image cards from sm up */}
      <section className="section bg-white">
        <div className="container-page">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              align="left"
              eyebrowTone="label"
              eyebrow="Insights & news"
              title="Latest from WisdomLingo"
              subtitle="Expert advice, university updates, and essential tips for your international education journey."
            />
            <ViewAllArticles className="hidden shrink-0 sm:inline-flex" />
          </div>

          <div className="mt-10 grid gap-5 sm:gap-6 md:grid-cols-3 lg:mt-12">
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
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <span className="mb-3 w-fit rounded-md bg-primary-50 px-2.5 py-1 text-[11px] font-bold text-primary sm:hidden">
                    {article.category}
                  </span>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5" /> {article.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" /> {article.readTime}
                    </span>
                  </div>
                  <h3 className="mt-3 text-base font-bold leading-snug text-slate-900">
                    {article.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                    {article.excerpt}
                  </p>
                  <Link
                    to={article.to}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-primary transition hover:gap-2.5"
                  >
                    Read Article <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <ViewAllArticles className="mt-8 w-full sm:hidden" />
        </div>
      </section>

      <EnquiryModal open={enquiryOpen} onClose={() => setEnquiryOpen(false)} />
    </>
  );
};
