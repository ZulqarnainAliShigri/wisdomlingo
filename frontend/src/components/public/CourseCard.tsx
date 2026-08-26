import React from "react";
import { ChevronRight, Clock } from "lucide-react";
import { COMPANY } from "../../config/site";
import { Course } from "../../types";
import { MediaImage } from "../ui/MediaImage";

export const CourseCard: React.FC<{ course: Course }> = ({ course }) => (
  <article className="card flex flex-col overflow-hidden">
    <MediaImage src={course.image_url} alt={course.title} className="h-44 w-full" />
    <div className="flex flex-1 flex-col p-6">
      <div className="flex flex-wrap items-center gap-2">
        {course.level && <span className="badge bg-primary-50 text-primary">{course.level}</span>}
        {course.duration && (
          <span className="badge bg-slate-100 text-slate-600">
            <Clock className="mr-1 h-3 w-3" /> {course.duration}
          </span>
        )}
      </div>
      <h3 className="mt-3 text-lg font-bold text-slate-900">{course.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{course.description}</p>
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-base font-extrabold text-accent">{course.fee || "Contact us"}</span>
        <a
          href={COMPANY.whatsapp}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-primary transition hover:gap-2.5"
        >
          Enroll <ChevronRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  </article>
);
