import React from "react";

interface AvatarProps {
  /** Public URL of the uploaded photo, or null to fall back to the initial. */
  src?: string | null;
  /** Name or email the initial is taken from. */
  name: string;
  /** Tailwind sizing classes - the shape and centring are handled here. */
  className?: string;
}

/**
 * The admin's photo, with a lettered fallback.
 *
 * `onError` clears the image rather than leaving a broken icon, which matters
 * because the photo URL points at a storage bucket the file can be deleted from.
 */
export const Avatar: React.FC<AvatarProps> = ({ src, name, className = "h-9 w-9" }) => {
  const [failed, setFailed] = React.useState(false);
  const initial = (name.trim().charAt(0) || "A").toUpperCase();

  React.useEffect(() => {
    setFailed(false);
  }, [src]);

  if (src && !failed) {
    return (
      <img
        src={src}
        alt=""
        onError={() => setFailed(true)}
        className={`${className} shrink-0 rounded-full object-cover`}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`${className} flex shrink-0 items-center justify-center rounded-full bg-primary font-bold text-white`}
    >
      {initial}
    </span>
  );
};
