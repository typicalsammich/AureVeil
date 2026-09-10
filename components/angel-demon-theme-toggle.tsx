'use client';

import { useEffect, useState } from 'react';

export function AngelDemonThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const saved = (localStorage.getItem('musefold-theme') as 'dark' | 'light' | null) || 'dark';
    setTheme(saved);
    document.documentElement.dataset.theme = saved;
  }, []);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('musefold-theme', next);
    document.documentElement.dataset.theme = next;
  }

  return (
    <button
      type="button"
      className="theme angel-demon-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'angel' : 'demon'} mode`}
      title={theme === 'dark' ? 'Switch to Angel mode' : 'Switch to Demon mode'}
    >
      <span aria-hidden="true">{theme === 'dark' ? '☾' : '☀︎'}</span>
      <span>{theme === 'dark' ? 'Demon' : 'Angel'}</span>
    </button>
  );
}
