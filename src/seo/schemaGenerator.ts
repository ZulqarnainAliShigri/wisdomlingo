/**
 * Google Rich Snippet & Schema.org JSON-LD Generator
 * Drives Google #1 Ranking Rich Results (Course Snippets, FAQ Accordions,
 * Local Business Knowledge Panels, and Breadcrumb Trees).
 */

import { COMPANY } from "../config/site";

export interface FaqItem {
  question: string;
  answer: string;
}

export const TOP_RANKING_FAQS: FaqItem[] = [
  {
    question: "What German language levels are offered at WisdomLingo Islamabad?",
    answer:
      "WisdomLingo offers complete German language levels from A1 (Beginner) to C2 (Mastery) according to the Common European Framework of Reference for Languages (CEFR). We provide intensive preparation for Goethe-Zertifikat, ÖSD, TestDaF, and ECL exams with mock test series.",
  },
  {
    question: "How long does it take to complete German A1, A2, and B1 levels?",
    answer:
      "Each level (A1, A2, B1) typically takes 6 to 8 weeks in our regular batches, and 4 weeks in our intensive fast-track programs. A student can comfortably reach B1 level within 4 to 6 months.",
  },
  {
    question: "Are WisdomLingo course certificates accepted by the German Embassy in Islamabad?",
    answer:
      "Yes. Our courses are strictly aligned with Goethe-Institut and ÖSD examination standards. Our certificates, attendance records, and student profiles are recognized for German Embassy visa filings, including study visas, Ausbildung visas, and spouse reunion visas.",
  },
  {
    question: "What is German Ausbildung and how can Pakistani students apply?",
    answer:
      "Ausbildung is Germany's state-sponsored 3-year dual vocational training program. Students work with German companies and attend vocational school while receiving a monthly tax-free stipend of €800 to €1,500/month. Tuition is 100% free. WisdomLingo provides complete guidance from German B1/B2 training to employer contract placement and visa filing.",
  },
  {
    question: "Where is WisdomLingo located in Islamabad?",
    answer:
      "WisdomLingo is located at Office No 214, Arooj Arcade, F-10 Markaz, Islamabad, Pakistan. We offer both on-campus physical classes and interactive live online sessions for students across Pakistan and abroad.",
  },
  {
    question: "Can Pakistani students study tuition-free in Germany?",
    answer:
      "Yes! Public universities in Germany offer tuition-free higher education for Bachelor's and Master's degrees. WisdomLingo assists students with APS certificate verification, university admission, blocked account setup, and visa documentation.",
  },
];

/**
 * Builds FAQPage schema for Google Search results.
 * This directly triggers Google's rich FAQ accordions on search results pages.
 */
export function generateFaqSchema(faqs: FaqItem[] = TOP_RANKING_FAQS) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Builds Course schema for Google Course Search rich cards.
 */
export function generateFeaturedCoursesSchema(siteUrl: string = "https://wisdomlingo.com") {
  const courses = [
    {
      name: "German Language Course A1 (Beginner)",
      description:
        "Comprehensive German A1 course covering pronunciation, everyday vocabulary, grammar foundations, and Goethe-Zertifikat A1 exam preparation for students and spouse visa applicants.",
      level: "A1 (Beginner)",
      code: "GER-A1",
      duration: "P8W",
    },
    {
      name: "German Language Course A2 (Elementary)",
      description:
        "German A2 level focusing on complex sentence structures, past tense, conversational fluency, and official Goethe/ÖSD A2 examination prep.",
      level: "A2 (Elementary)",
      code: "GER-A2",
      duration: "P8W",
    },
    {
      name: "German Language Course B1 (Intermediate)",
      description:
        "German B1 course designed for German Ausbildung applicants and university students. Focuses on argumentative speaking, professional writing, and Goethe B1 exam drills.",
      level: "B1 (Intermediate)",
      code: "GER-B1",
      duration: "P8W",
    },
    {
      name: "German Language Course B2 (Advanced)",
      description:
        "Advanced German B2 training tailored for healthcare professionals (nurses, doctors), engineers, and direct university admission applicants.",
      level: "B2 (Upper Intermediate)",
      code: "GER-B2",
      duration: "P10W",
    },
    {
      name: "IELTS Preparation (Academic & General)",
      description:
        "Intensive Band 7+ targeted training across Listening, Reading, Writing, and Speaking modules with certified British Council & IDP trainers.",
      level: "All Levels",
      code: "ENG-IELTS",
      duration: "P6W",
    },
  ];

  return {
    "@context": "https://schema.org",
    "@graph": courses.map((course) => ({
      "@type": "Course",
      "@id": `${siteUrl}/courses#${course.code.toLowerCase()}`,
      name: course.name,
      description: course.description,
      educationalLevel: course.level,
      courseCode: course.code,
      timeRequired: course.duration,
      provider: {
        "@type": "EducationalOrganization",
        name: COMPANY.legalName,
        url: siteUrl,
        sameAs: COMPANY.googleMapsUrl,
      },
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: ["Blended", "Onsite", "Online"],
        courseWorkload: "PT5H",
        location: {
          "@type": "Place",
          name: COMPANY.legalName,
          address: {
            "@type": "PostalAddress",
            streetAddress: "Office No 214, Arooj Arcade, F-10",
            addressLocality: "Islamabad",
            addressCountry: "PK",
          },
        },
      },
      offers: {
        "@type": "Offer",
        category: "Paid",
        priceCurrency: "PKR",
        availability: "https://schema.org/InStock",
      },
    })),
  };
}

/**
 * Builds EducationalOrganization & LocalBusiness schema for Google Knowledge Panel.
 */
export function generateLocalBusinessSchema(siteUrl: string = "https://wisdomlingo.com") {
  return {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "LanguageSchool", "LocalBusiness"],
    "@id": `${siteUrl}/#organization`,
    name: COMPANY.legalName,
    alternateName: ["WisdomLingo", "Wisdom Lingo Islamabad"],
    url: siteUrl,
    logo: `${siteUrl}/images/logo.png`,
    image: `${siteUrl}/images/logo.png`,
    telephone: COMPANY.phoneHref.replace("tel:", ""),
    email: COMPANY.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Office No 214, Arooj Arcade, F-10",
      addressLocality: "Islamabad",
      addressRegion: "Islamabad Capital Territory",
      postalCode: "44000",
      addressCountry: "PK",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 33.6954,
      longitude: 73.0125,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "20:00",
      },
    ],
    hasMap: COMPANY.googleMapsUrl,
    sameAs: [
      COMPANY.googleMapsUrl,
      COMPANY.social.instagram,
      COMPANY.social.facebook,
      COMPANY.social.tiktok,
      COMPANY.social.linkedin,
    ],
  };
}
