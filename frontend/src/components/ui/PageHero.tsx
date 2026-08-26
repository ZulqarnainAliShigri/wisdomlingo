import React from "react";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  /** Background photo URL. The blue base shows through if it fails to load. */
  image?: string;
  children?: React.ReactNode;
}

/** Section header used at the top of every inner page. */
export const PageHero: React.FC<PageHeroProps> = ({
  eyebrow,
  title,
  subtitle,
  image,
  children,
}) => (
  <section className="relative isolate overflow-hidden bg-primary-900">
    {image && (
      <img
        src={image}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
    )}
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-10 bg-gradient-to-r from-primary-900/90 via-primary-900/70 to-primary-900/35"
    />
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-10 bg-[radial-gradient(50rem_25rem_at_85%_-20%,rgba(37,99,235,0.25),transparent)]"
    />

    <div className="container-page py-8 sm:py-11">
      <span className="badge bg-white/15 text-white backdrop-blur">{eyebrow}</span>
      <h1 className="mt-3 max-w-3xl text-2xl font-extrabold leading-tight tracking-tight text-white drop-shadow-md sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-blue-50 drop-shadow sm:text-base">
        {subtitle}
      </p>
      {children && <div className="mt-6">{children}</div>}
    </div>
  </section>
);
