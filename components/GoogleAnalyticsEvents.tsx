"use client";

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function GoogleAnalyticsEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  useEffect(() => {
    if (pathname && gaMeasurementId) {
      const url = pathname + (searchParams ? searchParams.toString() : '');
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'page_view', {
          page_path: url,
          page_location: window.location.href, // Optional: send full URL
          send_to: gaMeasurementId,
        });
      }
    }
  }, [pathname, searchParams, gaMeasurementId]);

  return null;
}

// Extend the Window interface to include gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}
