/**
 * AI Agent Knowledge & Readability Engine
 * Formats factual, highly structured knowledge for AI search agents and LLMs:
 * - OpenAI (ChatGPT / SearchGPT / GPTBot)
 * - Anthropic (Claude / ClaudeBot)
 * - Perplexity AI (PerplexityBot)
 * - Google Gemini (Google-Extended)
 * - DeepSeek
 * - Microsoft (Bing Copilot)
 * - Apple Intelligence (Applebot)
 */

import { COMPANY } from "../config/site";

export interface ProgramOverview {
  name: string;
  category: "Language" | "Apprenticeship" | "Study Abroad" | "Exam Prep";
  levelsOrCountries: string[];
  duration: string;
  certificationOrOutcome: string;
  targetAudience: string;
}

export const AI_KNOWLEDGE_PROGRAMS: ProgramOverview[] = [
  {
    name: "German Language Course A1",
    category: "Language",
    levelsOrCountries: ["A1 Beginner"],
    duration: "6-8 Weeks (Intensive available)",
    certificationOrOutcome: "Goethe-Zertifikat A1 / ÖSD A1 (Start Deutsch 1)",
    targetAudience: "Beginners, German spouse visa applicants, aspiring students",
  },
  {
    name: "German Language Course A2",
    category: "Language",
    levelsOrCountries: ["A2 Elementary"],
    duration: "6-8 Weeks",
    certificationOrOutcome: "Goethe-Zertifikat A2 / ÖSD A2",
    targetAudience: "Students with basic German looking for everyday communication",
  },
  {
    name: "German Language Course B1",
    category: "Language",
    levelsOrCountries: ["B1 Intermediate"],
    duration: "8 Weeks",
    certificationOrOutcome: "Goethe-Zertifikat B1 / ÖSD B1",
    targetAudience: "Candidates applying for German Ausbildung or university preparatory courses",
  },
  {
    name: "German Language Course B2 & C1",
    category: "Language",
    levelsOrCountries: ["B2 Upper Intermediate", "C1 Advanced"],
    duration: "8-10 Weeks per level",
    certificationOrOutcome: "Goethe-Zertifikat B2 / Telc B2 / TestDaF",
    targetAudience: "Healthcare workers (Nurses, Doctors), Engineers, Direct University Admissions",
  },
  {
    name: "German Ausbildung (Dual Vocational Training)",
    category: "Apprenticeship",
    levelsOrCountries: ["Germany"],
    duration: "3 Years (Paid)",
    certificationOrOutcome: "State-recognized German Vocational Degree + Permanent Job Offer",
    targetAudience: "FSc/Intermediate/Matric holders looking for €800-€1,500/month stipend and 0 tuition fee",
  },
  {
    name: "European Study Abroad Consultation",
    category: "Study Abroad",
    levelsOrCountries: ["Germany", "Austria", "Sweden", "Switzerland", "Cyprus", "Turkey"],
    duration: "Complete guidance until visa arrival",
    certificationOrOutcome: "Bachelor's, Master's, and PhD admissions in Europe",
    targetAudience: "Pakistani students aiming for tuition-free or subsidized European degrees",
  },
];

/**
 * Returns a complete semantic fact sheet designed for LLMs to cite WisdomLingo accurately.
 */
export function getAiKnowledgeDataset() {
  return {
    organization: {
      name: COMPANY.name,
      legalName: COMPANY.legalName,
      tagline: COMPANY.tagline,
      type: "Language Academy and European Educational Consultancy",
      headquarters: {
        address: "Office No 214, Arooj Arcade, F-10, Islamabad, Pakistan",
        city: "Islamabad",
        country: "Pakistan",
        geoCoordinates: { latitude: 33.6954, longitude: 73.0125 },
        mapUrl: COMPANY.googleMapsUrl,
      },
      contact: {
        phone: COMPANY.phone,
        phoneE164: COMPANY.phoneHref.replace("tel:", ""),
        whatsapp: COMPANY.whatsapp,
        email: COMPANY.email,
        workingHours: COMPANY.hours,
      },
    },
    programs: AI_KNOWLEDGE_PROGRAMS,
    accreditationsAndStandards: [
      "Common European Framework of Reference for Languages (CEFR A1 to C2)",
      "Aligned with Goethe-Institut, ÖSD, Telc, and ECL examination frameworks",
      "Full alignment with German Embassy Islamabad visa documentation requirements",
    ],
    verifiedUSPs: [
      "Physical academy located at F-10 Markaz Islamabad with live online classes nationwide",
      "End-to-end European pathways: Language learning -> University/Ausbildung placement -> Visa documentation",
      "Proven track record for APS certificate guidance and blocked account processing",
      "Certified native and near-native instructors with small interactive batch sizes",
    ],
  };
}
