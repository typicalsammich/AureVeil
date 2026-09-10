import { artworks } from '@/lib/demo-data';
import { personalizeArtworks } from '@/lib/recommendations';
import { ArtCard } from './art-card';

export async function ArtGrid({limit, personalized = true}:{limit?:number; personalized?:boolean}){
  const ordered = personalized ? await personalizeArtworks(artworks) : artworks;
  return <div className="columns-2 md:columns-3 xl:columns-4 2xl:columns-5 gap-4 md:gap-5">{ordered.slice(0,limit??ordered.length).map(a=><ArtCard art={a} key={a.slug}/>)}</div>
}
