import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Check, Clock, MessageSquare, PlayCircle } from "lucide-react";
import { TEAM_PHOTOS } from "../config/media";
import { BLOG_CATEGORIES, BLOG_POSTS, FEATURED_VIDEO } from "../data/content";
import { EnquiryModal } from "../components/public/EnquiryModal";
import { PageHero } from "../components/ui/PageHero";
import { SectionHeading } from "../components/ui/SectionHeading";
import { Seo } from "../components/Seo";

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

  const posts = useMemo(
    () =>
      category === "All" ? BLOG_POSTS : BLOG_POSTS.filter((post) => post.category === category),
    [category]
  );

  return (
    <>
      <Seo page="blog" />
      <PageHero
        image={TEAM_PHOTOS.officeWide}
        eyebrow="Blog"
        title="Guides, updates and a look inside the academy"
        subtitle="Practical advice from the counsellors and teachers who file these applications every week - plus video from our own classrooms."
      />

      {/* Featured video - the clip sits above the written posts */}
      <section className="section bg-white">
        <div className="container-page">
          <SectionHeading
            align="left"
            eyebrowTone="label"
            eyebrow="Featured video"
            title={FEATURED_VIDEO.title}
            subtitle={FEATURED_VIDEO.excerpt}
          />

          <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-[1.6fr_1fr] lg:items-start">
            {/* Controls only, never autoplay - nobody gets sound they did not ask for */}
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
                See the course schedule <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our own photography - the academy as it actually looks, not stock */}
      <section className="section bg-white pt-0">
        <div className="container-page">
          <SectionHeading
            align="left"
            eyebrowTone="label"
            eyebrow="Inside WisdomLingo"
            title="The people behind the guides"
            subtitle="Every article here is written by the counsellors who sit at this desk and file these applications week after week."
          />

          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
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
      <section className="section bg-slate-50">
        <div className="container-page">
          <SectionHeading
            eyebrowTone="label"
            eyebrow="Insights &amp; news"
            title="All articles"
            subtitle="University updates, exam strategy and the paperwork detail that decides most applications."
          />

          {/* Chips scroll sideways on phones rather than wrapping into four rows */}
          <div className="-mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0 sm:pb-0">
            {BLOG_CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  category === item
                    ? "border-primary bg-primary text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:border-primary-100 hover:text-primary"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-5 sm:gap-6 md:grid-cols-2 lg:mt-10 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.title}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
              >
                <div className="relative hidden overflow-hidden sm:block">
                  <img
                    src={post.image}
                    alt=""
                    loading="lazy"
                    className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-md bg-white/95 px-2.5 py-1 text-[11px] font-bold text-slate-700 shadow-sm">
                    {post.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <span className="mb-3 w-fit rounded-md bg-primary-50 px-2.5 py-1 text-[11px] font-bold text-primary sm:hidden">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5" /> {post.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" /> {post.readTime}
                    </span>
                  </div>
                  <h3 className="mt-3 text-base font-bold leading-snug text-slate-900">
                    {post.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                    {post.excerpt}
                  </p>
                  <Link
                    to={post.to}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-primary transition hover:gap-2.5"
                  >
                    Read Article <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-primary-50">
        <div className="container-page text-center">
          <SectionHeading
            eyebrowTone="label"
            eyebrow="Still deciding?"
            title="Ask a counsellor instead of reading another guide"
            subtitle="Send us your details and a counsellor tells you which country, which German level and which intake fit your profile."
          />
          <button
            type="button"
            onClick={() => setEnquiryOpen(true)}
            className="btn-primary mx-auto mt-8 w-full sm:w-auto"
          >
            <MessageSquare className="h-4 w-4" /> Talk to a counsellor
          </button>
        </div>
      </section>

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
