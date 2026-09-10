'use client';

import Link from 'next/link';
import { Bell, MessageCircle, Menu, Search, UserRound, X } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { AureVeilMark } from '@/components/aureveil-logo';


export function SiteHeader(){
  const [open,setOpen]=useState(false);
  return <header className="exact-header">
    <div className="exact-header-inner">
      <Link href="/" className="exact-brand" aria-label="AureVeil home">
        <AureVeilMark className="exact-aureveil-mark"/>
        <span className="exact-wordmark">Aure<span>Veil</span></span>
        <small>TWO SIDES. ONE WORLD OF ART.</small>
      </Link>

      <nav className="exact-nav" aria-label="Primary navigation">
        <Link className="active" href="/">Home</Link>
        <Link href="/explore">Explore</Link>
        <Link href="/artists">Artists</Link>
        <Link href="/collections">Collections</Link>
        <Link href="/commissions">Commissions</Link>
        <Link href="/about">About</Link>
      </nav>

      <form className="exact-search" action="/explore">
        <Search size={19}/>
        <input name="q" aria-label="Search" placeholder="Search art, artists, or describe a vibe..."/>
      </form>

      <div className="exact-actions">
        <Link className="exact-circle" href="/messages" aria-label="Messages"><MessageCircle size={20}/></Link>
        <Link className="exact-circle" href="/notifications" aria-label="Notifications"><Bell size={20}/></Link>
        <Link className="exact-avatar" href="/settings" aria-label="Account"><UserRound size={18}/></Link>
        <div className="mf-theme-switch"><ThemeToggle/></div>
        <button className="exact-mobile" onClick={()=>setOpen(!open)} aria-label="Menu">{open?<X/>:<Menu/>}</button>
      </div>
    </div>
    {open && <nav className="exact-mobile-nav">
      <Link href="/" onClick={()=>setOpen(false)}>Home</Link><Link href="/explore" onClick={()=>setOpen(false)}>Explore</Link><Link href="/artists" onClick={()=>setOpen(false)}>Artists</Link><Link href="/collections" onClick={()=>setOpen(false)}>Collections</Link><Link href="/commissions" onClick={()=>setOpen(false)}>Commissions</Link><Link href="/about" onClick={()=>setOpen(false)}>About</Link>
    </nav>}
  </header>;
}
