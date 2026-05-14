'use client';

import { useEffect } from 'react';

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
const STORAGE_KEY = 'meo_utm';

export function UtmCapture() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const found: Record<string, string> = {};
    for (const key of UTM_KEYS) {
      const val = params.get(key);
      if (val) found[key] = val;
    }
    if (Object.keys(found).length > 0) {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(found));
      } catch {}
    }
  }, []);

  return null;
}

export function getStoredUtm(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
