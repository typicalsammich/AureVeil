'use client';

import { useEffect } from 'react';

type Mode = 'dark' | 'light';

export function ModeAffinityTracker() {
  useEffect(() => {
    let currentMode: Mode = (document.documentElement.dataset.theme as Mode) || 'dark';
    let lastTick = Date.now();

    const saveElapsed = () => {
      const now = Date.now();
      const seconds = Math.max(0, Math.min(120, Math.round((now - lastTick) / 1000)));
      const key = currentMode === 'dark' ? 'musefold-demon-seconds' : 'musefold-angel-seconds';
      const total = Number(localStorage.getItem(key) || '0') + seconds;
      localStorage.setItem(key, String(total));
      lastTick = now;
    };

    const observer = new MutationObserver(() => {
      const next = (document.documentElement.dataset.theme as Mode) || 'dark';
      if (next !== currentMode) {
        saveElapsed();
        currentMode = next;
      }
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    const interval = window.setInterval(saveElapsed, 15000);
    const onHidden = () => { if (document.hidden) saveElapsed(); };
    document.addEventListener('visibilitychange', onHidden);
    window.addEventListener('beforeunload', saveElapsed);

    return () => {
      saveElapsed();
      observer.disconnect();
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onHidden);
      window.removeEventListener('beforeunload', saveElapsed);
    };
  }, []);

  return null;
}

export function getLocalAffinity() {
  if (typeof window === 'undefined') return 'balanced';
  const demon = Number(localStorage.getItem('musefold-demon-seconds') || '0');
  const angel = Number(localStorage.getItem('musefold-angel-seconds') || '0');
  if (Math.abs(demon - angel) < 60) return 'balanced';
  return demon > angel ? 'demon' : 'angel';
}
