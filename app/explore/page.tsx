import { ArtGrid } from '@/components/art-grid';
import { SmartSearch } from '@/components/smart-search';
import { rememberSearch } from '@/lib/recommendations';
import { Upload, Sparkles } from 'lucide-react';

export default async function Explore({searchParams}:{searchParams:Promise<{q?:string;similar?:string}>}){
  const p=await searchParams;
  if(p.q) await rememberSearch(p.q);
  return <div className="shell py-9">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8"><div><p className="text-xs uppercase tracking-[.18em] muted">Discovery</p><h1 className="serif text-5xl mt-2">{p.similar?'Find Similar':p.q?`Discovering “${p.q}”`:'Explore'}</h1><p className="muted mt-3 max-w-2xl">{p.similar?'Similarity uses the configured visual-search provider, with metadata fallback when no embedding provider is connected.':p.q?'AureVeil uses what you describe plus your account taste profile to order the work you see.':'A living mix shaped by what you search, like, save, follow, view, and collect.'}</p></div><form action="/api/visual-search" method="post"><button className="border hairline bg-white px-4 py-3 text-sm flex gap-2 items-center"><Upload size={16}/>Search with an image</button></form></div>

    {!p.similar && <div className="mb-9 max-w-4xl"><div className="flex items-center gap-2 mb-3 text-sm"><Sparkles size={16}/><span>Describe the exact art you want</span></div><SmartSearch/><div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-xs muted"><span>Try:</span><a href="/explore?q=dark+surreal+castle+under+a+red+moon" className="border-b hairline">dark surreal castle under a red moon</a><a href="/explore?q=fine+line+Japanese+tattoo+with+waves" className="border-b hairline">fine-line Japanese tattoo with waves</a><a href="/explore?q=warm+minimalist+abstract+painting+for+a+living+room" className="border-b hairline">warm minimalist abstract painting</a></div></div>}

    <div className="flex gap-2 overflow-x-auto pb-6 mb-3 text-sm"><span className="bg-[#171717] text-white px-4 py-2">For You</span>{['Trending','New','Photography','Illustration','Tattoo','Painting','Digital','3D','Design','Abstract','Portrait'].map(x=><span key={x} className="border hairline bg-white px-4 py-2 whitespace-nowrap">{x}</span>)}</div><ArtGrid/></div>
}
