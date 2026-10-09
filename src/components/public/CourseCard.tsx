import React from "react";
import { ChevronRight, Clock } from "lucide-react";
import { Course } from "../../types";
import { MediaImage } from "../ui/MediaImage";

export const CourseCard: React.FC<{
  course: Course;
  /** Opens the enquiry form for this course - the page owns the dialog. */
  onEnroll: (course: Course) => void;
  /** Opens the details popup with full course breakdown. */
  onDetails?: (course: Course) => void;
  isActive?: boolean;
}> = ({ course, onEnroll, onDetails, isActive = false }) => (
  <article
    className={`card group flex flex-col overflow-hidden transition-all duration-500 ${
      isActive
        ? "border-primary/50 ring-2 ring-primary/30 shadow-xl -translate-y-1.5 scale-101"
        : "hover:-translate-y-1 hover:shadow-lg"
    }`}
  >
    <div className="relative overflow-hidden">
      <MediaImage
        src={course.image_url}
        alt={course.title}
        className={`h-40 w-full object-cover transition-transform duration-500 ${
          isActive ? "scale-108" : "group-hover:scale-105"
        }`}
      />
      {course.level && (
        <span
          className={`absolute left-3 top-3 rounded-md px-2.5 py-0.5 text-[11px] font-bold shadow-xs backdrop-blur-xs transition-colors ${
            isActive
              ? "bg-primary text-white"
              : "bg-white/95 text-primary"
          }`}
        >
          {course.level}
        </span>
      )}
    </div>
    <div className="flex flex-1 flex-col p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        {course.duration && (
          <span className="badge bg-slate-100 text-slate-600 text-[11px]">
            <Clock className="mr-1 h-3 w-3" /> {course.duration}
          </span>
        )}
        <span className="ml-auto text-sm font-extrabold text-accent">
          {course.fee || "Contact us"}
        </span>
      </div>
      <h3 className="mt-2 text-base font-bold text-slate-900 transition-colors group-hover:text-primary sm:text-lg">
        {course.title}
      </h3>
      {/* Short concise text in card */}
      <p className="mt-1.5 flex-1 text-xs leading-relaxed text-slate-600 line-clamp-2 sm:text-sm">
        {course.description}
      </p>
      {/* Action buttons */}
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
        {onDetails ? (
          <button
            type="button"
            onClick={() => onDetails(course)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-primary hover:bg-primary-50 hover:text-primary"
          >
            Details
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={() => onEnroll(course)}
          className="inline-flex items-center gap-1 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-primary-900"
        >
          Enroll <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  </article>
);
