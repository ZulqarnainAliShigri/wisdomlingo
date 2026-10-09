import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Check, Clock, MessageSquare, PlayCircle } from "lucide-react";
import { TEAM_PHOTOS } from "../config/media";
import { BLOG_CATEGORIES, BLOG_POSTS, FEATURED_VIDEO } from "../data/content";
import { EnquiryModal } from "../components/public/EnquiryModal";
import { PageHero } from "../components/ui/PageHero";
import { SectionHeading } from "../components/ui/SectionHeading";
import { Seo } from "../components/Seo";

import { DetailModal, DetailModalData } from "../components/public/DetailModal";

/**
 * The four portrait shots. The fifth photo is landscape, so it carries the page
 * hero above instead of sitting in this band.
 */
const PHOTO_BAND = [
  { src: TEAM_PHOTOS.officePortrait, alt: "A WisdomLingo counsellor at the desk where study abroad files are prepared" },
  { src: TEAM_PHOTOS.formal, alt: "A WisdomLingo counsellor at a student send-off event" },
  { src: TEAM_PHOTOS.outdoor, alt: "A WisdomLingo counsellor photographed in Islamabad" },
  { src: TEAM_PHOTOS.evening, alt: "A WisdomLingo counsellor at an evening reception" },
];

export const BlogPage: React.FC = () => {
  const [category, setCategory] = useState("All");
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [detailData, setDetailData] = useState<DetailModalData | null>(null);

  const posts = useMemo(
    () =>
      category === "All" ? BLOG_POSTS : BLOG_POSTS.filter((post) => post.category === category),
    [category]
  );

  const [activePostIdx, setActivePostIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActivePostIdx((prev) => (prev + 1) % Math.max(1, posts.length));
    }, 3500);
    return () => clearInterval(interval);
  }, [isPaused, posts.length]);

  return (
    <>
      <Seo page="blog" />
      <PageHero
        image={TEAM_PHOTOS.officeWide}
        eyebrow="Blog"
        title="Guides & Field Intel"
        subtitle="Practical European admissions guides and Goethe language exam strategies."
      />

      {/* Featured video - the clip sits above the written posts */}
      <section className="section bg-white">
        <div className="container-page">
          <SectionHeading
            align="left"
            eyebrowTone="label"
            eyebrow="Featured Video"
            title={FEATURED_VIDEO.title}
            subtitle={FEATURED_VIDEO.excerpt}
          />

          <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-[1.6fr_1fr] lg:items-start">
            {/* Controls only, never autoplay */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-lg">
              <video
                controls
                playsInline
                preload="metadata"
                className="aspect-video h-full w-full bg-slate-900"
              >
                <source src={FEATURED_VIDEO.src} type="video/mp4" />
                Your browser cannot play this video.{" "}
                <a href={FEATURED_VIDEO.src}>Download the clip</a> instead.
              </video>
            </div>

            <div className="card p-6 sm:p-7">
              <span className="badge bg-accent-50 text-accent">
                <PlayCircle aria-hidden="true" className="mr-1.5 h-3.5 w-3.5" />
                {FEATURED_VIDEO.category}
              </span>
              <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" /> {FEATURED_VIDEO.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> {FEATURED_VIDEO.duration}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-bold leading-snug text-slate-900">
                What you will see
              </h3>
              <ul className="mt-4 space-y-2.5">
                {FEATURED_VIDEO.points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {point}
                  </li>
                ))}
              </ul>
              <Link
                to="/courses"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-primary transition hover:gap-2.5"
              >
                See Course Schedule <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our own photography */}
      <section className="section bg-white pt-0">
        <div className="container-page">
          <SectionHeading
            align="left"
            eyebrowTone="label"
            eyebrow="Inside WisdomLingo"
            title="Behind the Guides"
            subtitle="Written by the counsellors who prepare and file European student applications."
          />

          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {PHOTO_BAND.map((photo) => (
              <div
                key={photo.src}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm"
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  className="aspect-[3/4] w-full object-cover transition duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Written posts */}
      <section
        className="section bg-slate-50"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="container-page">
          <SectionHeading
            eyebrowTone="label"
            eyebrow="Articles"
            title="All Insights & Field Updates"
            subtitle="University updates, visa checklists, and exam strategies."
          />

          {/* Chips scroll sideways on phones */}
          <div className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0 sm:pb-0">
            {BLOG_CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setCategory(item);
                  setActivePostIdx(0);
                }}
                aria-pressed={category === item}
                className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-bold transition ${
                  category === item
                    ? "border-primary bg-primary text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:border-primary-100 hover:text-primary"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Animated Runner Beam Track */}
          <div className="relative mt-8 mb-2 hidden sm:block overflow-hidden h-0.5">
            <div className="h-full w-full border-t-2 border-dashed border-slate-300" />
            <div
              className="h-full bg-gradient-to-r from-primary via-primary-500 to-accent transition-all duration-700 ease-out"
              style={{
                width: `${((activePostIdx + 1) / Math.max(1, posts.length)) * 100}%`,
              }}
            />
            <div
              aria-hidden="true"
              className="animate-beam-runner absolute top-0 h-1.5 w-24 -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent blur-xs"
            />
          </div>

          <div className="mt-8 grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => {
              const isActive = activePostIdx === index;

              return (
                <article
                  key={post.title}
                  onClick={() => setActivePostIdx(index)}
                  onMouseEnter={() => setActivePostIdx(index)}
                  className={`group flex flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-500 cursor-pointer ${
                    isActive
                      ? "border-primary/60 ring-2 ring-primary/30 shadow-2xl -translate-y-1.5 scale-101"
                      : "border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1"
                  }`}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      loading="lazy"
                      className={`h-44 w-full object-cover transition duration-700 ease-out ${
                        isActive ? "scale-108" : "group-hover:scale-105"
                      }`}
                    />
                    <span
                      className={`absolute left-3 top-3 rounded-md px-2.5 py-0.5 text-[11px] font-bold shadow-sm transition-colors ${
                        isActive
                          ? "bg-primary text-white"
                          : "bg-white/95 text-slate-700"
                      }`}
                    >
                      {post.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" /> {post.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className={`h-3.5 w-3.5 ${isActive ? "animate-wiggle text-primary" : ""}`} /> {post.readTime}
                      </span>
                    </div>
                    <h3
                      className={`mt-2.5 text-base font-bold leading-snug transition-colors ${
                        isActive ? "text-primary font-black" : "text-slate-900 group-hover:text-primary"
                      }`}
                    >
                      {post.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 line-clamp-2">
                      {post.excerpt}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailData({
                            title: post.title,
                            subtitle: `${post.category} • ${post.date}`,
                            category: "Article Preview",
                            badge: post.readTime,
                            badgeColor: "bg-primary-50 text-primary",
                            image: post.image,
                            description: post.excerpt,
                            metrics: [
                              { label: "Category", value: post.category },
                              { label: "Date", value: post.date },
                              { label: "Read Time", value: post.readTime },
                            ],
                            points: [
                              "Comprehensive dossier prepared by European counsellors",
                              "Contains official embassy & university guidelines",
                            ],
                            primaryCtaText: "Read Complete Guide",
                            onPrimaryCta: () => {
                              window.location.href = post.to;
                            },
                            secondaryCtaText: "Ask Question",
                            secondaryCtaLink: `/about`,
                          });
                        }}
                        className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs sm:text-sm font-bold text-slate-700 transition hover:border-primary hover:bg-primary-50 hover:text-primary"
                      >
                        Quick View
                      </button>
                      <Link
                        to={post.to}
                        onClick={(e) => e.stopPropagation()}
                        className={`flex-1 flex items-center justify-center gap-1 rounded-xl py-2 px-3 text-xs sm:text-sm font-bold text-white transition ${
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
            {posts.map((post, idx) => (
              <button
                key={post.title}
                type="button"
                onClick={() => setActivePostIdx(idx)}
                className={`h-2 rounded-full transition-all duration-500 ${
                  activePostIdx === idx
                    ? "w-8 bg-primary"
                    : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label={`Go to ${post.title}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-primary-50">
        <div className="container-page text-center">
          <SectionHeading
            eyebrowTone="label"
            eyebrow="Consultation"
            title="Have Questions About Your Profile?"
            subtitle="Get free profile evaluation for German language, university admission, and visa options."
          />
          <button
            type="button"
            onClick={() => setEnquiryOpen(true)}
            className="btn-primary mx-auto mt-6 w-full sm:w-auto"
          >
            <MessageSquare className="h-4 w-4" /> Talk to a Counsellor
          </button>
        </div>
      </section>

      {/* Modals */}
      <DetailModal
        open={Boolean(detailData)}
        onClose={() => setDetailData(null)}
        data={detailData}
      />
      <EnquiryModal
        open={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        title="Talk to a counsellor"
        intro="Tell us where you are now and where you want to go. A counsellor replies within one working day."
        defaultSubject="Study Abroad Counselling"
      />
    </>
  );
};
