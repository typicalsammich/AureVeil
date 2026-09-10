'use client';

import { Moon, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle(){
  const [mode,setMode]=useState<'angel'|'demon'>('demon');

  useEffect(()=>{
    const isDark=document.documentElement.dataset.theme==='dark';
    setMode(isDark?'demon':'angel');
  },[]);

  function toggle(){
    const next=mode==='demon'?'angel':'demon';
    setMode(next);
    document.documentElement.dataset.theme=next==='demon'?'dark':'light';
    localStorage.setItem('musefold-theme',next==='demon'?'dark':'light');
  }

  const isDemon=mode==='demon';
  return (
    <button
      onClick={toggle}
      className={`theme-toggle theme-toggle--${mode}`}
      aria-label={isDemon?'Switch to Angel mode':'Switch to Demon mode'}
      title={isDemon?'Switch to Angel':'Switch to Demon'}
      type="button"
    >
      <span className="theme-toggle__label">
        {isDemon ? <Moon size={15}/> : <Sparkles size={15}/>}
        <strong>{isDemon?'Demon':'Angel'}</strong>
      </span>
    </button>
  );
}
