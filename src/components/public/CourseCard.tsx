import React from "react";
import { ArrowRight, BookOpen, CheckCircle2, ChevronRight, Clock, GraduationCap, Languages, Sparkles, Star, Users } from "lucide-react";
import { Course } from "../../types";

const FALLBACK_COURSE_IMAGES: Record<string, string> = {
  "seed-a1": "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=800&q=80",
  "seed-a2": "https://images.unsplash.com/photo-1599946347371-68eb71b16afc?auto=format&fit=crop&w=800&q=80",
  "seed-b1": "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=80",
  "seed-b2": "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
  "seed-c1": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80",
  "seed-c2": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
  "seed-ielts": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
  "seed-spoken": "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80",
  "seed-quran": "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80",
  "seed-arabic": "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80",
  "seed-persian": "https://images.unsplash.com/photo-1585007600263-71228e40c8d1?auto=format&fit=crop&w=800&q=80",
};

/** Category icons and level badges styling */
const getCategoryIcon = (category: string, level?: string | null) => {
  if (category === "german") return Languages;
  if (category === "english") return BookOpen;
  return Star;
};

const getLevelTheme = (level?: string | null, category?: string) => {
  const lvl = (level || "").toUpperCase();
  if (lvl.includes("A1") || lvl.includes("A2")) {
    return {
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200/80 ring-emerald-500/10",
      accent: "text-emerald-600",
      pill: "Beginner Track",
    };
  }
  if (lvl.includes("B1") || lvl.includes("B2")) {
    return {
      badge: "bg-blue-50 text-blue-700 border-blue-200/80 ring-blue-500/10",
      accent: "text-primary",
      pill: lvl.includes("B1") ? "Ausbildung Essential" : "University & Nursing",
    };
  }
  if (lvl.includes("C1") || lvl.includes("C2")) {
    return {
      badge: "bg-purple-50 text-purple-700 border-purple-200/80 ring-purple-500/10",
      accent: "text-purple-600",
      pill: "Academic Mastery",
    };
  }
  if (category === "english") {
    return {
      badge: "bg-amber-50 text-amber-700 border-amber-200/80 ring-amber-500/10",
      accent: "text-amber-600",
      pill: "Band 7+ Preparation",
    };
  }
  return {
    badge: "bg-teal-50 text-teal-700 border-teal-200/80 ring-teal-500/10",
    accent: "text-teal-600",
    pill: "Traditional Studies",
  };
};

export const CourseCard: React.FC<{
  course: Course;
  /** Opens the enquiry form for this course - the page owns the dialog. */
  onEnroll: (course: Course) => void;
  /** Opens the details popup with full course breakdown. */
  onDetails?: (course: Course) => void;
  isActive?: boolean;
}> = ({ course, onEnroll, onDetails, isActive = false }) => {
  const imageSrc =
    course.image_url ||
    FALLBACK_COURSE_IMAGES[course.id] ||
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80";

  const theme = getLevelTheme(course.level, course.category);
  const IconComponent = getCategoryIcon(course.category, course.level);

  return (
    <article
      className={`group relative flex flex-col rounded-3xl border transition-all duration-500 overflow-hidden bg-white ${
        isActive
          ? "border-primary/60 ring-2 ring-primary/30 shadow-2xl -translate-y-2 scale-101"
          : "border-slate-200/90 shadow-sm hover:border-slate-300 hover:shadow-xl hover:-translate-y-1.5"
      }`}
    >
      {/* Visual Header with Image & Center Icon */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-900">
        <img
          src={imageSrc}
          alt={course.title}
          loading="lazy"
          className={`h-full w-full object-cover transition-transform duration-700 ease-out ${
            isActive ? "scale-108 opacity-95" : "opacity-85 group-hover:scale-106"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Top Floating Badges */}
        <div className="absolute inset-x-3.5 top-3 flex items-center justify-between gap-2 z-10">
          {course.level ? (
            <span
              className={`rounded-full border px-3 py-1 text-xs font-black shadow-md backdrop-blur-md transition-all ${theme.badge}`}
            >
              {course.level}
            </span>
          ) : (
            <span className="rounded-full border border-white/20 bg-white/90 px-3 py-1 text-xs font-bold text-slate-800 shadow-md backdrop-blur-md">
              {course.category.toUpperCase()}
            </span>
          )}

          <span className="rounded-full border border-white/20 bg-slate-950/70 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-md">
            {theme.pill}
          </span>
        </div>

        {/* Beautiful Center Icon in Products Card */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-white/40 shadow-2xl backdrop-blur-md transition-all duration-500 ${
              isActive
                ? "bg-primary text-white scale-110 shadow-primary/50 ring-4 ring-primary/20"
                : "bg-white/90 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white"
            }`}
          >
            <IconComponent className="h-6 w-6 transition-transform duration-300 group-hover:rotate-6" />
          </div>
        </div>

        {/* Bottom Banner inside Image: Duration & Fee */}
        <div className="absolute bottom-2.5 inset-x-3.5 flex items-center justify-between text-white z-10">
          {course.duration ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-200">
              <Clock className="h-3.5 w-3.5 text-accent" /> {course.duration}
            </span>
          ) : (
            <span />
          )}
          <span className="rounded-md bg-accent px-2 py-0.5 text-xs font-black tracking-tight text-white shadow-sm">
            {course.fee || "Contact us"}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3
          className={`text-base sm:text-lg font-bold tracking-tight transition-colors line-clamp-1 ${
            isActive ? "text-primary font-black" : "text-slate-900 group-hover:text-primary"
          }`}
        >
          {course.title}
        </h3>

        {/* Short concise text in card */}
        <p className="mt-1.5 flex-1 text-xs leading-relaxed text-slate-600 line-clamp-2 sm:text-sm">
          {course.description}
        </p>

        {/* Micro Value Highlights */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-slate-600">
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Goethe Format
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5">
            <Users className="h-3 w-3 text-primary" /> Small Batches
          </span>
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
          {onDetails ? (
            <button
              type="button"
              onClick={() => onDetails(course)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-primary hover:bg-primary-50 hover:text-primary"
            >
              Course Details
            </button>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={() => onEnroll(course)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-primary-900 active:scale-95"
          >
            <span>Enroll Now</span>
            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
