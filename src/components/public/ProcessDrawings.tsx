import React from "react";

export const ConsultationDrawing: React.FC<{ className?: string }> = ({ className = "w-full h-32" }) => (
  <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Step 1: Free Consultation and Profile Audit illustration">
    {/* Soft background glow */}
    <circle cx="80" cy="60" r="50" fill="#FEF3C7" fillOpacity="0.6" />

    {/* Roadmap / Checklist Clipboard */}
    <rect x="44" y="18" width="58" height="78" rx="8" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.5" />
    {/* Clipboard clip */}
    <path d="M60 14H86C88 14 90 16 90 18V22H56V18C56 16 58 14 60 14Z" fill="#CBD5E1" stroke="#1E293B" strokeWidth="2.5" />
    <circle cx="73" cy="18" r="2.5" fill="#1E293B" />

    {/* Document lines with checkmarks */}
    <circle cx="56" cy="36" r="4.5" fill="#D1FAE5" stroke="#059669" strokeWidth="1.8" />
    <path d="M54 36L55.5 37.5L58.5 34.5" stroke="#059669" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="65" y1="36" x2="88" y2="36" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />

    <circle cx="56" cy="49" r="4.5" fill="#D1FAE5" stroke="#059669" strokeWidth="1.8" />
    <path d="M54 49L55.5 50.5L58.5 47.5" stroke="#059669" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="65" y1="49" x2="84" y2="49" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />

    <circle cx="56" cy="62" r="4.5" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.8" />
    <circle cx="56" cy="62" r="1.5" fill="#D97706" />
    <line x1="65" y1="62" x2="80" y2="62" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />

    {/* Magnifying Glass */}
    <g transform="translate(14, 5)">
      <circle cx="84" cy="66" r="17" fill="#E0F2FE" fillOpacity="0.85" stroke="#1E293B" strokeWidth="2.5" />
      <path d="M96 78L110 92" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
      {/* Lens reflection */}
      <path d="M76 58C80 54 86 54 90 57" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
    </g>

    {/* Consultation Speech Bubble */}
    <g transform="translate(-4, -4)">
      <path d="M98 22C98 15.4 104.3 10 112 10C119.7 10 126 15.4 126 22C126 27.5 121.6 32.2 115.5 33.6L114 38L110.2 33.8C103.3 33.2 98 28.1 98 22Z" fill="#FDE047" stroke="#1E293B" strokeWidth="2.2" strokeLinejoin="round" />
      {/* Lightbulb sparkles in speech bubble */}
      <path d="M112 16V26M108 19L116 23M116 19L108 23" stroke="#854D0E" strokeWidth="1.8" strokeLinecap="round" />
    </g>

    {/* Sparkle doodles */}
    <path d="M28 40L30.5 33L33 40L40 42.5L33 45L30.5 52L28 45L21 42.5L28 40Z" fill="#F59E0B" />
    <path d="M134 56L135.5 52L137 56L141 57.5L137 59L135.5 63L134 59L130 57.5L134 56Z" fill="#38BDF8" />
  </svg>
);

export const LanguageApplicationDrawing: React.FC<{ className?: string }> = ({ className = "w-full h-32" }) => (
  <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Step 2: Language Mastery and Application illustration">
    {/* Soft background glow */}
    <circle cx="80" cy="60" r="50" fill="#E0E7FF" fillOpacity="0.6" />

    {/* Book Stack Base */}
    <rect x="38" y="80" width="74" height="14" rx="3" fill="#3B82F6" stroke="#1E293B" strokeWidth="2.5" />
    <rect x="44" y="68" width="68" height="13" rx="3" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.5" />
    <line x1="50" y1="74" x2="100" y2="74" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />

    {/* Open Textbook in Center */}
    <g transform="translate(4, -10)">
      <path d="M42 74C56 70 70 73 76 78C82 73 96 70 110 74V48C96 44 82 47 76 52C70 47 56 44 42 48V74Z" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" />
      <line x1="76" y1="52" x2="76" y2="78" stroke="#1E293B" strokeWidth="2" />
      {/* Left text lines */}
      <line x1="50" y1="56" x2="68" y2="56" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
      <line x1="50" y1="62" x2="66" y2="62" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="50" y1="68" x2="62" y2="68" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" />
      {/* Right text: B2 badge */}
      <rect x="83" y="54" width="22" height="12" rx="3" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
      <text x="86" y="63" fontSize="8" fontWeight="bold" fill="#B45309" fontFamily="system-ui">B2</text>
    </g>

    {/* Graduation Mortarboard Cap */}
    <g transform="translate(6, -6)">
      <path d="M84 20L122 32L84 44L46 32L84 20Z" fill="#1E293B" stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M64 38V47C64 52 73 56 84 56C95 56 104 52 104 47V38" fill="#334155" stroke="#1E293B" strokeWidth="2.5" />
      <circle cx="84" cy="32" r="2.5" fill="#F59E0B" />
      <path d="M84 32C94 35 106 42 108 50" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
      <rect x="106" y="50" width="4" height="7" rx="1" fill="#F59E0B" />
    </g>

    {/* Pencil Drawing */}
    <g transform="translate(108, 56) rotate(25)">
      <rect x="0" y="0" width="8" height="32" rx="2" fill="#F59E0B" stroke="#1E293B" strokeWidth="2" />
      <path d="M0 32L4 40L8 32H0Z" fill="#FED7AA" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
      <polygon points="3,38 4,40 5,38" fill="#1E293B" />
    </g>

    {/* Sparkle doodles */}
    <path d="M26 56L28 50L30 56L36 58L30 60L28 66L26 60L20 58L26 56Z" fill="#6366F1" />
  </svg>
);

export const VisaApprovalDrawing: React.FC<{ className?: string }> = ({ className = "w-full h-32" }) => (
  <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Step 3: Visa Processing and Embassy Approval illustration">
    {/* Soft background glow */}
    <circle cx="80" cy="60" r="50" fill="#D1FAE5" fillOpacity="0.6" />

    {/* Passport Book */}
    <g transform="translate(34, 18)">
      <rect x="0" y="0" width="62" height="80" rx="7" fill="#0F172A" stroke="#1E293B" strokeWidth="2.5" />
      <line x1="8" y1="0" x2="8" y2="80" stroke="#334155" strokeWidth="2" />
      {/* Gold European Emblem Ring */}
      <circle cx="35" cy="36" r="13" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3 3" />
      <circle cx="35" cy="36" r="6.5" fill="#F59E0B" fillOpacity="0.3" stroke="#F59E0B" strokeWidth="1.5" />
      <rect x="22" y="14" width="26" height="4" rx="2" fill="#F59E0B" />
      <rect x="25" y="58" width="20" height="3" rx="1.5" fill="#94A3B8" />
    </g>

    {/* Green Stamped Shield - VISA APPROVED */}
    <g transform="translate(68, 38) rotate(-7)">
      <rect x="0" y="0" width="60" height="40" rx="8" fill="#ECFDF5" stroke="#059669" strokeWidth="2.8" strokeDasharray="4 2" />
      <rect x="4" y="4" width="52" height="32" rx="5" fill="#FFFFFF" stroke="#059669" strokeWidth="1.5" />
      <text x="30" y="16" textAnchor="middle" fontSize="8" fontWeight="900" fill="#047857" letterSpacing="0.8" fontFamily="system-ui">VISA</text>
      <text x="30" y="26" textAnchor="middle" fontSize="7" fontWeight="800" fill="#059669" letterSpacing="0.5" fontFamily="system-ui">APPROVED</text>
      <path d="M25 30L28 33L35 28" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </g>

    {/* Boarding pass stub */}
    <g transform="translate(94, 14) rotate(14)">
      <rect x="0" y="0" width="32" height="22" rx="3" fill="#FEF3C7" stroke="#1E293B" strokeWidth="2" />
      <path d="M6 11H26" stroke="#D97706" strokeWidth="1.5" strokeDasharray="2 2" />
      <circle cx="0" cy="11" r="2.5" fill="#D1FAE5" />
      <circle cx="32" cy="11" r="2.5" fill="#D1FAE5" />
    </g>

    {/* Sparkles */}
    <path d="M22 34L24 28L26 34L32 36L26 38L24 44L22 38L16 36L22 34Z" fill="#10B981" />
    <path d="M136 30L137.5 26L139 30L143 31.5L139 33L137.5 37L136 33L132 31.5L136 30Z" fill="#F59E0B" />
  </svg>
);

export const DepartureArrivalDrawing: React.FC<{ className?: string }> = ({ className = "w-full h-32" }) => (
  <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Step 4: Flight Departure and Safe Arrival illustration">
    {/* Soft background glow */}
    <circle cx="80" cy="60" r="50" fill="#F0FDF4" fillOpacity="0.6" />

    {/* Flight Contrail */}
    <path d="M22 88C36 84 52 78 74 62C94 48 114 36 136 30" stroke="#0284C7" strokeWidth="2.5" strokeDasharray="5 4" strokeLinecap="round" />

    {/* Soaring Airplane */}
    <g transform="translate(74, 14) rotate(-16)">
      <path d="M12 28C22 25 44 20 54 18C59 17 64 21 62 25C58 31 38 42 28 46C20 49 14 48 10 44L12 28Z" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M30 24L26 4L36 4L46 20" fill="#38BDF8" stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M24 38L14 54L22 54L34 35" fill="#0284C7" stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M12 28L4 16L12 16L18 26" fill="#F59E0B" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="34" cy="27" r="1.5" fill="#1E293B" />
      <circle cx="40" cy="25" r="1.5" fill="#1E293B" />
      <circle cx="46" cy="23" r="1.5" fill="#1E293B" />
    </g>

    {/* Travel Suitcase */}
    <g transform="translate(36, 56)">
      <rect x="0" y="10" width="34" height="26" rx="5" fill="#F97316" stroke="#1E293B" strokeWidth="2.2" />
      <path d="M11 10V4C11 2.9 11.9 2 13 2H21C22.1 2 23 2.9 23 4V10" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="9" y1="10" x2="9" y2="36" stroke="#C2410C" strokeWidth="2" />
      <line x1="25" y1="10" x2="25" y2="36" stroke="#C2410C" strokeWidth="2" />
      <circle cx="17" cy="23" r="4.5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.5" />
      <text x="14" y="26" fontSize="6" fontWeight="bold" fill="#0284C7" fontFamily="system-ui">EU</text>
      <circle cx="6" cy="37" r="2" fill="#1E293B" />
      <circle cx="28" cy="37" r="2" fill="#1E293B" />
    </g>

    {/* Fluffy Cloud */}
    <g transform="translate(94, 68)">
      <path d="M10 20C6 20 2 17 2 13C2 9.5 5 7 8.5 7C9.5 4 12.5 2 16 2C20.5 2 24 5 24.5 9C27 9.5 29 11.5 29 14C29 17.5 26 20 22 20H10Z" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="2" />
    </g>

    {/* Sparkles */}
    <path d="M136 16L138 10L140 16L146 18L140 20L138 26L136 20L130 18L136 16Z" fill="#38BDF8" />
  </svg>
);
