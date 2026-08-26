/** Primary navigation - the full set, used by the mobile menu. */
export const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/courses", label: "Courses" },
  { to: "/study-abroad", label: "Study Abroad" },
  { to: "/apprenticeships", label: "Apprenticeships" },
  { to: "/about", label: "About" },
];

/** The links shown inline in the centre of the desktop navbar. Home is the logo. */
export const PRIMARY_NAV = NAV_LINKS.filter((link) =>
  ["/courses", "/study-abroad", "/apprenticeships", "/about"].includes(link.to)
);

/** Footer link columns. */
export const FOOTER_GROUPS: { title: string; links: { to: string; label: string }[] }[] = [
  {
    title: "Programs",
    links: [
      { to: "/courses", label: "German Courses" },
      { to: "/study-abroad", label: "Study Abroad" },
      { to: "/apprenticeships", label: "Apprenticeships" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About Us" },
      { to: "/study-abroad", label: "Partner Schools" },
      { to: "/about", label: "Success Stories" },
    ],
  },
  {
    title: "Support",
    links: [
      { to: "/study-abroad", label: "Visa Support" },
      { to: "/about", label: "Contact" },
      { to: "/about", label: "Privacy Policy" },
    ],
  },
];
