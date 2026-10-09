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

  // We duplicate the array 3 times: [cloneBlock0, activeBlock1, cloneBlock2]
  const extendedItems = useMemo(() => {
    if (count === 0) return [];
    if (count === 1) return items;
    return [...items, ...items, ...items];
  }, [items, count]);

  // Initial position is at the start of block 1 (middle block)
  const [currentIndex, setCurrentIndex] = useState(() => (count > 1 ? count : 0));
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const resettingRef = useRef(false);

  // When items change or count changes, reset to middle block
  useEffect(() => {
    if (count > 1) {
      setIsTransitioning(false);
      setCurrentIndex(count);
      const timer = setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setCurrentIndex(0);
    }
  }, [count]);

  // Next slide (advances forward)
  const next = useCallback(() => {
    if (count <= 1 || resettingRef.current) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, [count]);

  // Previous slide (moves backward)
  const prev = useCallback(() => {
    if (count <= 1 || resettingRef.current) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  }, [count]);

  // Jump to specific real index
  const goTo = useCallback(
    (realIndex: number) => {
      if (count <= 1) return;
      const target = count + ((realIndex % count + count) % count);
      setIsTransitioning(true);
      setCurrentIndex(target);
    },
    [count]
  );

  // Handle transition end for seamless invisible loop reset
  const handleTransitionEnd = useCallback(() => {
    if (count <= 1) return;

    // If we passed beyond the middle block into block 2
    if (currentIndex >= count * 2) {
      resettingRef.current = true;
      setIsTransitioning(false);
      const targetIndex = currentIndex - count;
      setCurrentIndex(targetIndex);

      // Re-enable transition on next animation frame
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
          resettingRef.current = false;
        });
      });
    }
    // If we moved before the middle block into block 0
    else if (currentIndex < count) {
      resettingRef.current = true;
      setIsTransitioning(false);
      const targetIndex = currentIndex + count;
      setCurrentIndex(targetIndex);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
          resettingRef.current = false;
        });
      });
    }
  }, [count, currentIndex]);

  // Auto-play interval (every 2000ms continuously)
  useEffect(() => {
    if (!autoPlay || count <= 1) return;
    if (pauseOnHover && isPaused) return;

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
    transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
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
