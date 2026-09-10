'use client';
import { Search, Sparkles, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';

export function SmartSearch({ compact = false }: { compact?: boolean }) {
  const [value, setValue] = useState('');
  return <form action="/explore" className={compact ? 'smart-search smart-search--compact' : 'smart-search smart-search--hero'}>
    <span className="search-icon">{compact ? <Search size={16}/> : <Sparkles size={17}/>}</span>
    <input name="q" value={value} onChange={e=>setValue(e.target.value)}
      placeholder={compact ? 'Search or describe a piece…' : 'Try “ink drawing of a lonely lighthouse in a storm”'}
      maxLength={300}/>
    {!compact && <button className="discover-button"><span>Discover</span><ArrowUpRight size={16}/></button>}
  </form>;
}
