import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface UseInfiniteCarouselOptions<T> {
  items: T[];
  itemsPerView?: number;
  intervalMs?: number;
  autoPlay?: boolean;
  pauseOnHover?: boolean;
}

export function useInfiniteCarousel<T>({
  items,
  itemsPerView = 1,
  intervalMs = 2000,
  autoPlay = true,
  pauseOnHover = false, // Never stop on hover as requested
}: UseInfiniteCarouselOptions<T>) {
  const count = items.length;

  // Calculate copies: ensure plenty of runway (at least 24 items) so looping is 100% seamless
  const copies = useMemo(() => {
    if (count <= 1) return 1;
    return Math.max(4, Math.ceil(24 / count));
  }, [count]);

  const middleBlock = useMemo(() => {
    if (count <= 1) return 0;
    return count <= 3 ? 3 : 1;
  }, [count]);

  const maxBlock = useMemo(() => {
    if (count <= 1) return 1;
    return count <= 3 ? 5 : 3;
  }, [count]);

  // Extended items array duplicated smoothly across multiple blocks
  const extendedItems = useMemo(() => {
    if (count === 0) return [];
    if (count === 1) return items;
    const result: T[] = [];
    for (let i = 0; i < copies; i++) {
      result.push(...items);
    }
    return result;
  }, [items, count, copies]);

  // Initial position in the safe middle block
  const [currentIndex, setCurrentIndex] = useState(() =>
    count > 1 ? count * middleBlock : 0
  );
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const resettingRef = useRef(false);

  // When items change or count changes, reset to middle block
  useEffect(() => {
    if (count > 1) {
      setIsTransitioning(false);
      setCurrentIndex(count * middleBlock);
      const timer = setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setCurrentIndex(0);
    }
  }, [count, middleBlock]);

  // Pause when browser tab is inactive to prevent timer drift, resume when active
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        setIsPaused(true);
      } else {
        setIsPaused(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // Next slide (advances forward)
  const next = useCallback(() => {
    if (count <= 1 || resettingRef.current) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => {
      // Safety guard: if somehow drifted too far, normalize smoothly
      if (prev >= count * (maxBlock + 1)) {
        return count * middleBlock + (prev % count) + 1;
      }
      return prev + 1;
    });
  }, [count, maxBlock, middleBlock]);

  // Previous slide (moves backward)
  const prev = useCallback(() => {
    if (count <= 1 || resettingRef.current) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => {
      if (prev <= count * (middleBlock - 1)) {
        return count * (middleBlock + 1) + ((prev % count) + count) % count - 1;
      }
      return prev - 1;
    });
  }, [count, middleBlock]);

  // Jump to specific real index
  const goTo = useCallback(
    (realIndex: number) => {
      if (count <= 1) return;
      const normalizedReal = ((realIndex % count) + count) % count;
      const target = count * middleBlock + normalizedReal;
      setIsTransitioning(true);
      setCurrentIndex(target);
    },
    [count, middleBlock]
  );

  // Handle transition end for seamless invisible loop reset
  const handleTransitionEnd = useCallback(() => {
    if (count <= 1) return;

    // If we reached or passed the upper threshold block
    if (currentIndex >= count * maxBlock) {
      resettingRef.current = true;
      setIsTransitioning(false);
      const normalizedReal = ((currentIndex % count) + count) % count;
      const targetIndex = count * middleBlock + normalizedReal;
      setCurrentIndex(targetIndex);

      // Re-enable transition on the next animation frames
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
          resettingRef.current = false;
        });
      });
    }
    // If we moved before the middle threshold block
    else if (currentIndex < count * (middleBlock - 1)) {
      resettingRef.current = true;
      setIsTransitioning(false);
      const normalizedReal = ((currentIndex % count) + count) % count;
      const targetIndex = count * middleBlock + normalizedReal;
      setCurrentIndex(targetIndex);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
          resettingRef.current = false;
        });
      });
    }
  }, [count, currentIndex, maxBlock, middleBlock]);

  // Auto-play interval (continuously moving every 2000ms)
  useEffect(() => {
    if (!autoPlay || count <= 1) return;
    if (pauseOnHover && isPaused) return;
    if (isPaused) return;

    const interval = setInterval(() => {
      next();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [autoPlay, isPaused, count, intervalMs, next, pauseOnHover]);

  // Active 0-based real index (for dots, numbers, indicator highlights)
  const activeRealIndex = count > 0 ? ((currentIndex % count) + count) % count : 0;

  // Track style for seamless 60fps GPU acceleration
  const trackStyle: React.CSSProperties = {
    display: "flex",
    width: "100%",
    minWidth: "100%",
    flexWrap: "nowrap",
    transform: `translate3d(-${currentIndex * (100 / itemsPerView)}%, 0, 0)`,
    transition: isTransitioning
      ? "transform 700ms cubic-bezier(0.25, 1, 0.5, 1)"
      : "none",
    willChange: "transform",
  };

  const itemStyle: React.CSSProperties = {
    width: `${100 / itemsPerView}%`,
    minWidth: `${100 / itemsPerView}%`,
    maxWidth: `${100 / itemsPerView}%`,
    flexShrink: 0,
    boxSizing: "border-box",
  };

  return {
    extendedItems,
    currentIndex,
    activeRealIndex,
    isTransitioning,
    isPaused,
    setIsPaused,
    next,
    prev,
    goTo,
    handleTransitionEnd,
    trackStyle,
    itemStyle,
    containerProps: pauseOnHover
      ? {
          onMouseEnter: () => setIsPaused(true),
          onMouseLeave: () => setIsPaused(false),
          onTouchStart: () => setIsPaused(true),
          onTouchEnd: () => setIsPaused(false),
        }
      : {},
  };
}
