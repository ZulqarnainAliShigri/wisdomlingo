import { Apprenticeship, Article, ContactSubmission, Course, CourseCategory, Row, Story, StudyCountry } from "../types";
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

export const mapStory = (row: Row): Story => ({
  id: String(row.id),
  name: row.name ?? "Anonymous Student",
  role: row.role ?? "Student",
  institution: row.institution ?? "European University",
  destination_country: row.destination_country ?? "Germany",
  flag: row.flag ?? "🇩🇪",
  intake: row.intake ?? null,
  status_badge: row.status_badge ?? "Visa Approved",
  highlight: row.highlight ?? "Successfully Enrolled",
  metric: row.metric ?? null,
  quote: row.quote ?? "",
  rating: Number(row.rating) || 5,
  avatar_url: row.avatar_url ?? row.image_url ?? null,
  is_active: row.is_active !== false,
  display_order: row.display_order ?? null,
  created_at: row.created_at ?? undefined,
});

export const mapArticle = (row: Row): Article => ({
  id: String(row.id),
  title: row.title ?? "Untitled Article",
  category: row.category ?? "Study Guide",
  excerpt: row.excerpt ?? "",
  content: row.content ?? null,
  author: row.author ?? "WisdomLingo Editorial Desk",
  read_time: row.read_time ?? "4 min read",
  image_url: row.image_url ?? null,
  tags: asStringArray(row.tags),
  link_url: row.link_url ?? null,
  is_active: row.is_active !== false,
  display_order: row.display_order ?? null,
  created_at: row.created_at ?? undefined,
});
