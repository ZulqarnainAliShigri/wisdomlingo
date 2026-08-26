import { Apprenticeship, ContactSubmission, Course, CourseCategory, Row, StudyCountry } from "../types";
import { asStringArray } from "./utils";

export const mapCourse = (row: Row): Course => ({
  id: String(row.id),
  title: row.title ?? "Untitled course",
  category: (row.category as CourseCategory) ?? "german",
  level: row.level ?? null,
  duration: row.duration ?? null,
  fee: row.fee ?? null,
  description: row.description ?? null,
  image_url: row.image_url ?? null,
  is_active: row.is_active !== false,
  display_order: row.display_order ?? null,
  created_at: row.created_at ?? undefined,
});

export const mapCountry = (row: Row): StudyCountry => ({
  id: String(row.id),
  name: row.name ?? "",
  flag: row.flag ?? "",
  tagline: row.tagline ?? null,
  description: row.description ?? null,
  benefits: asStringArray(row.benefits),
  requirements: asStringArray(row.requirements),
  tuition: row.tuition ?? null,
  intake: row.intake ?? null,
  image_url: row.image_url ?? null,
  is_active: row.is_active !== false,
  display_order: row.display_order ?? null,
});

export const mapApprenticeship = (row: Row): Apprenticeship => ({
  id: String(row.id),
  title: row.title ?? "",
  field: row.field ?? "",
  salary: row.salary ?? null,
  duration: row.duration ?? null,
  description: row.description ?? null,
  requirements: asStringArray(row.requirements),
  benefits: asStringArray(row.benefits),
  image_url: row.image_url ?? null,
  is_active: row.is_active !== false,
  display_order: row.display_order ?? null,
});

export const mapSubmission = (row: Row): ContactSubmission => ({
  id: String(row.id),
  name: row.name ?? "",
  email: row.email ?? "",
  phone: row.phone ?? null,
  subject: row.subject ?? null,
  message: row.message ?? "",
  is_read: Boolean(row.is_read),
  created_at: row.created_at ?? new Date().toISOString(),
});
