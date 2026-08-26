import React, { useEffect } from "react";

/**
 * Injects one JSON-LD block and removes it when the route changes, so a page
 * never inherits the previous page's schema.
 *
 * `id` must be unique per block on a page - it is how the tag is found again.
 */
export const StructuredData: React.FC<{ id: string; data: unknown | null }> = ({ id, data }) => {
  useEffect(() => {
    if (!data) return undefined;

    const elementId = `ld-${id}`;
    let script = document.getElementById(elementId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = elementId;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);

    return () => {
      document.getElementById(elementId)?.remove();
    };
  }, [id, data]);

  return null;
};
