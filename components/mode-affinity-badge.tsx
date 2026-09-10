'use client';

import { useEffect, useState } from 'react';

export function ModeAffinityBadge() {
  const [mode, setMode] = useState<'angel' | 'demon' | 'balanced'>('balanced');

  useEffect(() => {
    const demon = Number(localStorage.getItem('musefold-demon-seconds') || '0');
    const angel = Number(localStorage.getItem('musefold-angel-seconds') || '0');
    if (Math.abs(demon - angel) < 60) setMode('balanced');
    else setMode(demon > angel ? 'demon' : 'angel');
  }, []);

  const label = mode === 'demon' ? 'Demon side' : mode === 'angel' ? 'Angel side' : 'Balanced';
  const icon = mode === 'demon' ? '☾' : mode === 'angel' ? '✧' : '◐';

  return <span className={`affinity-badge ${mode}`} title="Based on which AureVeil mode you spend more time browsing">
    <span aria-hidden="true">{icon}</span>{label}
  </span>;
}
