import React, { useState } from "react";
import { GraduationCap } from "lucide-react";

export const MediaImage: React.FC<{
  src: string | null;
  alt: string;
  className?: string;
  fallbackIcon?: React.ReactNode;
}> = ({ src, alt, className = "h-44 w-full", fallbackIcon }) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary to-primary-600 text-white/80`}
        aria-hidden="true"
      >
        {fallbackIcon || <GraduationCap className="h-10 w-10" />}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`${className} object-cover`}
    />
  );
};

/* =========================================================================
   7. LAYOUT - Navbar, Footer
   ========================================================================= */
