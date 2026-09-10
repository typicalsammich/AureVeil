'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Bookmark, Heart, ScanSearch } from 'lucide-react';
import type { Artwork } from '@/lib/demo-data';
import { useState } from 'react';

function metadata(art: Artwork){return {slug:art.slug,title:art.title,artist:art.artist,category:art.category,style:art.style,medium:art.medium};}
async function track(eventType:string, art:Artwork){
  try { await fetch('/api/interactions',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({eventType,metadata:metadata(art)})}); } catch {}
}

export function ArtCard({art}:{art:Artwork}){
  const [liked,setLiked]=useState(false);const [saved,setSaved]=useState(false);
  return <article className="mb-6 break-inside-avoid group"><div className="art-card-photo"><Link href={`/art/${art.slug}`} onClick={()=>void track('artwork_view',art)}><Image src={art.image} alt={art.title} width={art.width} height={art.height} className="w-full h-auto transition duration-500 group-hover:scale-[1.015]"/></Link><div className="art-card-actions"><button onClick={()=>{const next=!liked;setLiked(next);void track(next?'like':'unlike',art)}} aria-label="Like" className="art-card-action"><Heart size={16} fill={liked?'currentColor':'none'}/></button><button onClick={()=>{const next=!saved;setSaved(next);void track(next?'save':'unsave',art)}} aria-label="Save" className="art-card-action"><Bookmark size={16} fill={saved?'currentColor':'none'}/></button><Link href={`/explore?similar=${art.slug}`} onClick={()=>void track('find_similar',art)} className="art-card-action" aria-label="Find similar"><ScanSearch size={16}/></Link></div></div><div className="art-card-meta"><div><Link href={`/art/${art.slug}`} onClick={()=>void track('search_result_click',art)} className="art-card-title">{art.title}</Link><p className="art-card-sub">{art.artist} · {art.medium}</p></div>{art.price&&<span className="art-card-price">${art.price}</span>}</div></article>
}
