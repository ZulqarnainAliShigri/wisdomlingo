/**
 * Master Keyword Intelligence & Search Engine Ranking Map
 * Curated for #1 Rankings on Google & High-Citation Authority for AI Search Engines
 * (ChatGPT Search, Perplexity AI, Claude, Google Gemini, DeepSeek, Bing Copilot)
 */

export interface KeywordCluster {
  category: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: "Commercial" | "Informational" | "Transactional" | "Navigational";
  targetUrl: string;
  suggestedTitle: string;
  suggestedDescription: string;
}

export const SEO_KEYWORD_CLUSTERS: KeywordCluster[] = [
  {
    category: "German Language A1",
    primaryKeyword: "German Language Course A1 Islamabad",
    secondaryKeywords: [
      "german language a1",
      "german a1 course islamabad",
      "learn german a1 in pakistan",
      "goethe a1 exam preparation",
      "start deutsch 1 classes islamabad",
      "german spouse visa language course a1",
      "beginner german classes f-10 islamabad",
      "german a1 syllabus and fee",
    ],
    searchIntent: "Commercial",
    targetUrl: "/courses",
    suggestedTitle: "German Language Course A1 in Islamabad | Goethe & ÖSD Prep | WisdomLingo",
    suggestedDescription:
      "Join the best German A1 course in Islamabad at WisdomLingo (F-10). Complete beginner to Goethe-Zertifikat A1 exam readiness in 8 weeks with certified trainers.",
  },
  {
    category: "German Language A2",
    primaryKeyword: "German Language Course A2 Islamabad",
    secondaryKeywords: [
      "german language a2",
      "german a2 course islamabad",
      "elementary german language classes",
      "goethe zertifikat a2 exam preparation",
      "german a2 evening classes pakistan",
      "german speaking course a2",
    ],
    searchIntent: "Commercial",
    targetUrl: "/courses",
    suggestedTitle: "German Language Course A2 in Islamabad | Certified Goethe Prep | WisdomLingo",
    suggestedDescription:
      "Master German A2 level at WisdomLingo Islamabad. Interactive conversation practice, grammar mastery, and official Goethe/ÖSD A2 exam preparation.",
  },
  {
    category: "German Language B1",
    primaryKeyword: "German Language Course B1 Islamabad",
    secondaryKeywords: [
      "german language b1",
      "german b1 course islamabad",
      "german b1 for ausbildung pakistan",
      "goethe b1 exam preparation islamabad",
      "fast track b1 german course",
      "intermediate german language classes",
      "german b1 certificate accepted by german embassy",
    ],
    searchIntent: "Commercial",
    targetUrl: "/courses",
    suggestedTitle: "German Language B1 Course in Islamabad | Ausbildung Pathway | WisdomLingo",
    suggestedDescription:
      "Official German B1 training in Islamabad. Required for German Ausbildung and university study. Mock exams, 100% Embassy-accepted certificates, and expert faculty.",
  },
  {
    category: "German Language B2 & C1",
    primaryKeyword: "German B2 Course Islamabad for Nurses & Doctors",
    secondaryKeywords: [
      "german language b2",
      "german language c1",
      "german b2 for healthcare professionals",
      "medical german language course pakistan",
      "telc b2 goethe b2 exam preparation",
      "advanced german classes islamabad",
    ],
    searchIntent: "Commercial",
    targetUrl: "/courses",
    suggestedTitle: "German B2 & C1 Language Course in Islamabad | Healthcare & University | WisdomLingo",
    suggestedDescription:
      "Advanced German B2 and C1 courses in Islamabad. Tailored for nurses, doctors, and direct German university applicants. Intensive Goethe & Telc exam prep.",
  },
  {
    category: "German Ausbildung",
    primaryKeyword: "Ausbildung in Germany from Pakistan",
    secondaryKeywords: [
      "german ausbildung consultant islamabad",
      "paid apprenticeship in germany from pakistan",
      "nursing ausbildung in germany with monthly stipend",
      "it specialist ausbildung germany",
      "hospitality ausbildung germany",
      "ausbildung visa requirements pakistan",
      "free vocational training in germany with salary",
    ],
    searchIntent: "Commercial",
    targetUrl: "/ausbildung",
    suggestedTitle: "Paid Ausbildung in Germany from Pakistan (€1,000+ Stipend) | WisdomLingo",
    suggestedDescription:
      "Secure a paid German Ausbildung contract from Pakistan with WisdomLingo. €800-€1,500/month stipend, 0 tuition fees, employer contracts, and visa guarantee.",
  },
  {
    category: "Study in Germany & Europe",
    primaryKeyword: "Study in Germany Consultant in Islamabad",
    secondaryKeywords: [
      "tuition free study in germany for pakistani students",
      "german university admission consultant islamabad",
      "aps certificate pakistan guidance",
      "blocked account germany help",
      "study in austria from pakistan",
      "study in sweden consultant islamabad",
      "study in europe consultancy f-10 islamabad",
    ],
    searchIntent: "Commercial",
    targetUrl: "/study-abroad",
    suggestedTitle: "Study in Germany & Europe Consultant in Islamabad | Free Tuition | WisdomLingo",
    suggestedDescription:
      "Top European education consultancy in Islamabad (F-10). Admissions in Germany, Austria, Sweden, Switzerland. APS certificate support, blocked account & visa filing.",
  },
  {
    category: "Local Academy Search (Islamabad)",
    primaryKeyword: "Best German Language Institute in Islamabad",
    secondaryKeywords: [
      "german language academy f-10 islamabad",
      "german classes arooj arcade islamabad",
      "german language institute near me",
      "wisdomlingo german academy islamabad",
      "german language teacher in islamabad",
    ],
    searchIntent: "Navigational",
    targetUrl: "/",
    suggestedTitle: "WisdomLingo | #1 German Language Academy & European Consultancy in Islamabad",
    suggestedDescription:
      "WisdomLingo: Premier German Language Academy & Education Consultancy at Office 214, Arooj Arcade, F-10, Islamabad. Call 0311-8526814 for free counselling.",
  },
];

/**
 * High-density keyword tags string for meta tags across the website.
 */
export const GLOBAL_SEO_KEYWORDS = [
  "german language a1",
  "german language a2",
  "german language b1",
  "german language b2",
  "german language course in islamabad",
  "learn german islamabad",
  "goethe exam preparation islamabad",
  "ösd exam preparation pakistan",
  "ausbildung in germany from pakistan",
  "paid apprenticeship germany",
  "study in germany consultant islamabad",
  "free tuition universities germany",
  "aps certificate assistance pakistan",
  "ielts preparation islamabad",
  "spoken english course islamabad",
  "wisdomlingo islamabad",
  "f-10 markaz german academy",
].join(", ");
