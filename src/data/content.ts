import React from "react";
import { Award, BadgeCheck, BookOpen, Briefcase, Building2, Compass, Croissant, FileCheck, FileText, Globe, GraduationCap, Landmark, Languages, Laptop, MapPin, MessageSquare, MessagesSquare, Mountain, Paintbrush, Plane, PlaneLanding, ShieldCheck, Sparkles, Star, Stethoscope, Sun, Users } from "lucide-react";
import { ARTICLE_IMAGES, TESTIMONIAL_AVATARS, VIDEOS } from "../config/media";
import { CourseCategory } from "../types";

export const APPLICATION_STEPS = [
  {
    step: "01",
    title: "Free Consultation",
    description:
      "Meet our counsellors in person or online. We review your academic record, budget and goals, then shortlist the destinations and programmes that genuinely fit.",
    icon: MessageSquare,
  },
  {
    step: "02",
    title: "Language & Documents",
    description:
      "Start the required German or English level with us while we prepare transcripts, translations, attestation, APS and your motivation letter.",
    icon: Languages,
  },
  {
    step: "03",
    title: "Admission & Finances",
    description:
      "We submit applications to partner universities or employers, track offers, and guide you through the blocked account, insurance and accommodation.",
    icon: FileCheck,
  },
  {
    step: "04",
    title: "Visa & Departure",
    description:
      "Embassy file compilation, interview coaching, appointment booking, then a pre-departure briefing and arrival support once you land.",
    icon: Plane,
  },
];

export const FIELD_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  IT: Laptop,
  Nursing: Stethoscope,
  Hospitality: Building2,
  Painting: Paintbrush,
  Bakery: Croissant,
};

export const CATEGORY_TABS: {
  key: CourseCategory;
  label: string;
  blurb: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: "german", label: "German", blurb: "A1 to C2, Goethe and OSD exam preparation", icon: Languages },
  { key: "english", label: "English", blurb: "IELTS bands and everyday spoken fluency", icon: BookOpen },
  { key: "religious", label: "Religious", blurb: "Quran, Arabic and Persian with qualified teachers", icon: Star },
];

export const HOME_STATS = [
  { value: "2000+", label: "Students Guided", icon: Users },
  { value: "5+", label: "Years of Experience", icon: Award },
  { value: "6", label: "Study Destinations", icon: Globe },
];

/** The three figures printed under the home page hero copy. */
export const HERO_STATS = [
  { value: "5+", label: "Years Experience" },
  { value: "500+", label: "Students Placed" },
  { value: "98%", label: "Visa Success" },
];

/** The "Popular right now" card floating beside the hero. */
export const HERO_HIGHLIGHTS = [
  {
    title: "Intensive German",
    meta: "Next intake: Sept 2026",
    to: "/courses",
    icon: Languages,
  },
  {
    title: "Master in Engineering",
    meta: "Germany & Austria",
    to: "/study-abroad",
    icon: GraduationCap,
  },
];

export const HOME_PROGRAMS = [
  {
    title: "German Courses",
    to: "/courses",
    cta: "View Language Programs",
    icon: Languages,
    tint: "bg-primary-50 text-primary",
    featured: false,
    description:
      "From beginner levels to specialized professional terminology, our partner schools offer immersive language training.",
    points: ["A1 to C2 certification prep", "Medical & Engineering German", "Accommodation assistance"],
  },
  {
    title: "Study Abroad",
    to: "/study-abroad",
    cta: "Explore Universities",
    icon: GraduationCap,
    tint: "bg-primary-50 text-primary",
    featured: true,
    description:
      "Gain a competitive edge with a degree from a top-tier European university. We guide you from application to enrollment.",
    points: ["Bachelor's & Master's degrees", "University matching & admissions", "Student visa processing"],
  },
  {
    title: "Apprenticeships",
    to: "/apprenticeships",
    cta: "Discover Apprenticeships",
    icon: Briefcase,
    tint: "bg-primary-50 text-primary",
    featured: false,
    description:
      "Earn while you learn. The dual vocational training system offers hands-on experience and immediate career prospects.",
    points: ["Ausbildung program matching", "Employer interview prep", "Contract negotiation support"],
  },
];

/** Small icon shown in the corner of each destination card, keyed by country name. */
export const COUNTRY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Germany: GraduationCap,
  Sweden: MapPin,
  Cyprus: Sun,
  Turkey: Compass,
  Austria: Mountain,
  Switzerland: Landmark,
};

export const WHY_US = [
  {
    icon: ShieldCheck,
    title: "Honest counselling",
    text: "What your profile actually qualifies for - no inflated promises, no hidden charges.",
  },
  {
    icon: Sparkles,
    title: "Language taught in-house",
    text: "Your language training and your visa file, handled by the same team.",
  },
  {
    icon: FileCheck,
    title: "Documentation done right",
    text: "Attestation, translation, APS and blocked accounts, right the first time.",
  },
  {
    icon: Users,
    title: "Support after arrival",
    text: "Registration, insurance and accommodation help in your first weeks.",
  },
];

/** The four-step timeline in the "Our process" section. */
export const PROCESS_STEPS = [
  {
    title: "Consultation",
    description: "In-depth profile analysis to match you with the best programs and destinations.",
    icon: MessagesSquare,
  },
  {
    title: "Application",
    description:
      "Flawless documentation, translation, and direct university or employer submissions.",
    icon: FileText,
  },
  {
    title: "Visa Processing",
    description:
      "Expert guidance through blocked accounts, APS certificates, and embassy interviews.",
    icon: BadgeCheck,
  },
  {
    title: "Arrival Support",
    description:
      "Pre-departure briefing and on-ground support for a smooth transition to your new life.",
    icon: PlaneLanding,
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "The team at WisdomLingo made the notoriously complex German visa process feel straightforward. Their in-house language prep was exactly what I needed to pass my B2 exams.",
    name: "Sarah Jenkins",
    role: "MSc Engineering, Germany",
    avatar: TESTIMONIAL_AVATARS.sarah,
  },
  {
    quote:
      "I wanted to pursue an Ausbildung but did not know where to start. They matched me with an excellent employer and prepped me perfectly for the interviews.",
    name: "Ahmed Al-Farsi",
    role: "IT Apprenticeship, Austria",
    avatar: TESTIMONIAL_AVATARS.ahmed,
  },
  {
    quote:
      "From selecting the right university in Sweden to helping with accommodation, their support was comprehensive. Truly a premium consultancy service.",
    name: "Elena Rodriguez",
    role: "BA Business, Sweden",
    avatar: TESTIMONIAL_AVATARS.elena,
  },
];

/**
 * "Latest from WisdomLingo". There is no blog route yet, so each card links to
 * the programme page it belongs to - swap `to` for a real article URL later.
 */
/** The clip that heads the blog page. Lives in `public/videos/`. */
export const FEATURED_VIDEO = {
  src: VIDEOS.germanAcademy,
  category: "Campus tour",
  date: "Aug 28, 2026",
  duration: "1 min watch",
  title: "Inside the WisdomLingo German academy",
  excerpt:
    "A short walk through our classrooms, the Goethe exam preparation sessions and the counselling desk where every study abroad file starts.",
  points: [
    "Live A1 to C2 classes taught by certified trainers",
    "Goethe and OSD exam practice in the same building",
    "Admission and visa counselling under one roof",
  ],
};

/**
 * Blog posts. The first three also feed the "Latest from WisdomLingo" section on
 * the home page, so both lists stay in step.
 */
export const BLOG_POSTS = [
  {
    category: "Study Guide",
    date: "Aug 12, 2026",
    readTime: "5 min read",
    title: "Top 5 Public Universities in Germany for Engineering in 2026",
    excerpt:
      "A comprehensive look at the best tuition-free engineering programs available for international students.",
    image: ARTICLE_IMAGES.universities,
    to: "/study-abroad",
  },
  {
    category: "Language",
    date: "Jul 28, 2026",
    readTime: "4 min read",
    title: "How to Ace the Goethe-Zertifikat B2 Exam: Insider Tips",
    excerpt:
      "Our in-house language experts share their top strategies for passing the critical B2 assessment.",
    image: ARTICLE_IMAGES.language,
    to: "/courses",
  },
  {
    category: "Career Focus",
    date: "Jul 15, 2026",
    readTime: "6 min read",
    title: "The Ultimate Guide to German Ausbildung Programs",
    excerpt:
      "Everything you need to know about the dual vocational training system and how to secure a contract.",
    image: ARTICLE_IMAGES.ausbildung,
    to: "/apprenticeships",
  },
  {
    category: "Visa & Documents",
    date: "Jun 30, 2026",
    readTime: "7 min read",
    title: "Blocked Account, Insurance and APS: The Paperwork Checklist",
    excerpt:
      "Most refusals happen on documents, not merit. Here is the exact file an embassy expects from a Pakistani applicant.",
    image: ARTICLE_IMAGES.visa,
    to: "/study-abroad",
  },
  {
    category: "Study Guide",
    date: "Jun 18, 2026",
    readTime: "5 min read",
    title: "Cyprus, Hungary or Germany: Choosing Your First Destination",
    excerpt:
      "Tuition, language requirements and intake dates compared, so you apply where your profile actually stands a chance.",
    image: ARTICLE_IMAGES.campus,
    to: "/study-abroad",
  },
  {
    category: "Student Life",
    date: "Jun 02, 2026",
    readTime: "4 min read",
    title: "Your First Month Abroad: Registration, Bank and SIM",
    excerpt:
      "Anmeldung, a local bank account and health insurance - the three errands that decide how smoothly your semester starts.",
    image: ARTICLE_IMAGES.life,
    to: "/about",
  },
];

/** Filter chips on the blog page, built from whatever categories exist above. */
export const BLOG_CATEGORIES = [
  "All",
  ...Array.from(new Set(BLOG_POSTS.map((post) => post.category))),
];

/** The three cards shown on the home page. */
export const ARTICLES = BLOG_POSTS.slice(0, 3);
