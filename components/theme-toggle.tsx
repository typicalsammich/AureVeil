'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle(){
  const [dark,setDark]=useState(false);
  useEffect(()=>{
    const current=document.documentElement.dataset.theme==='dark';
    setDark(current);
  },[]);
  function toggle(){
    const next=!dark;
    setDark(next);
    document.documentElement.dataset.theme=next?'dark':'light';
    localStorage.setItem('musefold-theme',next?'dark':'light');
  }
  return <button onClick={toggle} className="theme-toggle" aria-label={dark?'Switch to day mode':'Switch to night mode'} title={dark?'Day mode':'Night mode'}>
    <span className="theme-toggle__track"><Sun size={14}/><Moon size={14}/><span className="theme-toggle__knob"/></span>
  </button>;
}
