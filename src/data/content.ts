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
    title: "German Language Courses",
    shortTitle: "German Courses",
    tagline: "A1 to C2 Goethe & ÖSD Certified Training",
    to: "/courses",
    cta: "Explore Language Courses",
    icon: Languages,
    badge: "Language Academy",
    badgeColor: "bg-blue-600 text-white",
    cardGradient: "from-blue-600 via-indigo-600 to-blue-800",
    image: ARTICLE_IMAGES.language,
    featured: false,
    stat: "A1 — C2",
    statLabel: "All CEFR Levels Prep",
    tint: "bg-blue-50 text-blue-600",
    description:
      "Master the German language with certified native and expert instructors. Small interactive batches, comprehensive mock exams, and specialized modules for doctors, nurses, and engineers.",
    points: [
      "Official Goethe-Zertifikat & ÖSD exam preparation",
      "Specialized Medical & Technical German terminology",
      "Physical academy in Islamabad + live online sessions",
      "Free learning materials and speaking simulation clubs",
    ],
    pills: ["Goethe & ÖSD Prep", "Small Batches", "Flexible Timings"],
  },
  {
    title: "Study in Europe",
    shortTitle: "Study Abroad",
    tagline: "Tuition-Free Degrees at Top Public Universities",
    to: "/study-abroad",
    cta: "Explore Universities & Visas",
    icon: GraduationCap,
    badge: "Most Popular Pathway",
    badgeColor: "bg-accent text-white shadow-sm",
    cardGradient: "from-sky-600 via-blue-700 to-indigo-900",
    image: ARTICLE_IMAGES.universities,
    featured: true,
    stat: "€0 Tuition",
    statLabel: "Public Universities in Germany",
    tint: "bg-primary-50 text-primary",
    description:
      "Unlock world-class European education with tuition-free bachelor's and master's degrees. We provide complete guidance for university shortlisting, APS, blocked account, and visa filing.",
    points: [
      "Guaranteed admission matching in Germany, Sweden, Austria & more",
      "Full APS verification and blocked account assistance",
      "18-month post-study stay-back job search visa",
      "English-medium Bachelor's and Master's degree options",
    ],
    pills: ["Zero Tuition Options", "APS File Guidance", "98% Visa Success"],
  },
  {
    title: "Ausbildung in Germany",
    shortTitle: "Ausbildung",
    tagline: "Paid Dual Vocational Training & Work Contract",
    to: "/ausbildung",
    cta: "Discover Ausbildung Fields",
    icon: Briefcase,
    badge: "Earn While You Learn",
    badgeColor: "bg-emerald-600 text-white",
    cardGradient: "from-emerald-600 via-teal-700 to-cyan-900",
    image: ARTICLE_IMAGES.ausbildung,
    featured: false,
    stat: "€900 – €1,500",
    statLabel: "Monthly Paid Salary",
    tint: "bg-emerald-50 text-emerald-700",
    description:
      "A 3-year government-backed dual vocational contract with a German employer. Get paid every month during your training, attend vocational school, and step into a guaranteed career.",
    points: [
      "Monthly salary from day one with zero tuition expenses",
      "Direct employer interviews in Nursing, IT, Mechatronics & more",
      "Employer-sponsored visa with fast-track permanent residency",
      "Recognised German qualification valid across all 27 EU nations",
    ],
    pills: ["Paid Training", "Visa Sponsored", "Permanent Job Offer"],
  },
];

/** Photography for each destination card. */
export const COUNTRY_PHOTOS: Record<string, string> = {
  Germany: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=80",
  Sweden: "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?auto=format&fit=crop&w=800&q=80",
  Cyprus: "https://images.unsplash.com/photo-1580837119756-563d608dd119?auto=format&fit=crop&w=800&q=80",
  Turkey: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80",
  Austria: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=800&q=80",
  Switzerland: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80",
};

/** Country emoji flags. */
export const COUNTRY_FLAGS: Record<string, string> = {
  Germany: "🇩🇪",
  Sweden: "🇸🇪",
  Cyprus: "🇨🇾",
  Turkey: "🇹🇷",
  Austria: "🇦🇹",
  Switzerland: "🇨🇭",
};

/** Country category filters & metadata. */
export const COUNTRY_PERKS: Record<string, { tag: string; tone: string; visaRate: string; category: ("tuition-free" | "english" | "schengen")[] }> = {
  Germany: {
    tag: "Tuition-Free",
    tone: "bg-emerald-600 text-white",
    visaRate: "98% Visa Rate",
    category: ["tuition-free", "schengen"],
  },
  Austria: {
    tag: "€726 / Sem",
    tone: "bg-blue-600 text-white",
    visaRate: "97% Visa Rate",
    category: ["tuition-free", "schengen"],
  },
  Sweden: {
    tag: "English-Taught",
    tone: "bg-indigo-600 text-white",
    visaRate: "95% Visa Rate",
    category: ["english", "schengen"],
  },
  Switzerland: {
    tag: "Paid Internships",
    tone: "bg-rose-600 text-white",
    visaRate: "94% Visa Rate",
    category: ["schengen"],
  },
  Turkey: {
    tag: "No IELTS",
    tone: "bg-amber-600 text-white",
    visaRate: "99% Visa Rate",
    category: ["english"],
  },
  Cyprus: {
    tag: "Fast Track",
    tone: "bg-teal-600 text-white",
    visaRate: "99% Visa Rate",
    category: ["english"],
  },
};

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
    step: "01",
    title: "Consultation",
    description: "In-depth profile analysis to match you with the best programs and destinations.",
    icon: MessagesSquare,
  },
  {
    step: "02",
    title: "Application",
    description:
      "Flawless documentation, translation, and direct university or employer submissions.",
    icon: FileText,
  },
  {
    step: "03",
    title: "Visa Processing",
    description:
      "Expert guidance through blocked accounts, APS certificates, and embassy interviews.",
    icon: BadgeCheck,
  },
  {
    step: "04",
    title: "Arrival Support",
    description:
      "Pre-departure briefing and on-ground support for a smooth transition to your new life.",
    icon: PlaneLanding,
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "The team at WisdomLingo made the notoriously complex German visa process feel straightforward. Their in-house language prep was exactly what I needed to pass my B2 exams on the first attempt.",
    name: "Sarah Jenkins",
    role: "MSc Automotive Engineering",
    institution: "TU Munich, Germany",
    destinationCountry: "Germany",
    flag: "🇩🇪",
    intake: "Winter 2025 Intake",
    statusBadge: "Visa Approved & Enrolled",
    highlight: "B2 Passed in 4 Months",
    metric: "Tuition-Free Public University",
    rating: 5,
    avatar: TESTIMONIAL_AVATARS.sarah,
  },
  {
    quote:
      "I wanted to pursue an Ausbildung but had zero leads. WisdomLingo matched me with a leading healthcare employer in Frankfurt, negotiated my stipend, and prepared me for embassy questions.",
    name: "Ahmed Al-Farsi",
    role: "Nursing Specialist Ausbildung",
    institution: "Klinikum Frankfurt, Germany",
    destinationCountry: "Germany",
    flag: "🇩🇪",
    intake: "Autumn 2025 Intake",
    statusBadge: "Contract Secured & Visa Issued",
    highlight: "€1,240/month Monthly Stipend",
    metric: "100% Employer Sponsored",
    rating: 5,
    avatar: TESTIMONIAL_AVATARS.ahmed,
  },
  {
    quote:
      "From choosing Lund University in Sweden to arranging student housing and visa formalities, their support was relentless. The team was transparent, reachable, and deeply professional throughout.",
    name: "Elena Rodriguez",
    role: "BSc International Business",
    institution: "Lund University, Sweden",
    destinationCountry: "Sweden",
    flag: "🇸🇪",
    intake: "Spring 2026 Intake",
    statusBadge: "Residence Permit Granted",
    highlight: "Schengen Residence Permit",
    metric: "Top 100 Global University",
    rating: 5,
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
    author: "Academic Advisory Desk",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    tags: ["Tuition-Free", "TU9 Universities", "Winter 2026"],
  },
  {
    category: "Language",
    date: "Jul 28, 2026",
    readTime: "4 min read",
    title: "How to Ace the Goethe-Zertifikat B2 Exam: Insider Tips",
    excerpt:
      "Our in-house language experts share their top strategies for passing the critical B2 assessment on your first try.",
    image: ARTICLE_IMAGES.language,
    to: "/courses",
    author: "German Language Dept.",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    tags: ["Goethe Exam", "B2 Certificate", "Exam Prep"],
  },
  {
    category: "Ausbildung",
    date: "Jul 15, 2026",
    readTime: "6 min read",
    title: "The Ultimate Guide to German Ausbildung Programs",
    excerpt:
      "Everything you need to know about the dual vocational training system, monthly stipends, and securing an employer contract.",
    image: ARTICLE_IMAGES.ausbildung,
    to: "/ausbildung",
    author: "Vocational Pathways",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    tags: ["Paid Training", "No Tuition", "PR Pathway"],
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
    author: "Visa Compliance Cell",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    tags: ["APS Certificate", "Blocked Account", "Embassy Tips"],
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
