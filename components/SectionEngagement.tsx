import React, { useEffect, useRef } from 'react';

interface SectionEngagementProps {
  /** Stabiler Bezeichner der Sektion, z.B. "customers", "faq" — landet 1:1 als section_id im dataLayer-Event. */
  sectionId: string;
  children: React.ReactNode;
}

const VISIBILITY_THRESHOLD = 0.5;
// Kurze Flackerer (schnelles Durchscrollen) sollen keine Events erzeugen.
const MIN_REPORTABLE_MS = 250;

function pushEngagement(sectionId: string, elapsedMs: number) {
  if (elapsedMs < MIN_REPORTABLE_MS) return;
  if (typeof window === 'undefined') return;
  const dataLayer = (window as any).dataLayer;
  if (dataLayer && Array.isArray(dataLayer)) {
    dataLayer.push({ event: 'section_engagement', section_id: sectionId, engagement_time_msec: Math.round(elapsedMs) });
  }
}

/**
 * Misst, wie lange eine Sektion zu mindestens 50% im Viewport sichtbar war,
 * und meldet das als eigenes dataLayer-Event (nicht Teil des bestehenden
 * Lead-Formular-Trackings in BookingForm.tsx). Pausiert, solange der Tab im
 * Hintergrund ist, damit "Zeit" nicht einfach "Tab offen gelassen" misst.
 * Wird bei jedem Verlassen der Sektion gesendet (nicht nur einmal am Ende),
 * da beforeunload/unload auf Mobile unzuverlässig feuern.
 */
const SectionEngagement: React.FC<SectionEngagementProps> = ({ sectionId, children }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let visibleSince: number | null = null;
    let isIntersecting = false;

    const flush = () => {
      if (visibleSince !== null) {
        pushEngagement(sectionId, performance.now() - visibleSince);
        visibleSince = null;
      }
    };

    const startIfVisible = () => {
      if (isIntersecting && document.visibilityState === 'visible' && visibleSince === null) {
        visibleSince = performance.now();
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        if (isIntersecting) {
          startIfVisible();
        } else {
          flush();
        }
      },
      { threshold: VISIBILITY_THRESHOLD },
    );
    observer.observe(node);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flush();
      } else {
        startIfVisible();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const handlePageHide = () => flush();
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      flush();
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, [sectionId]);

  return <div ref={ref}>{children}</div>;
};

export default SectionEngagement;
