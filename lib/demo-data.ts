export type Artwork = {
  slug: string; title: string; artist: string; username: string; category: string; medium: string; style: string;
  image: string; width: number; height: number; price?: number; likes: number; saves: number;
};

export const artworks: Artwork[] = [
  {slug:'quiet-current',title:'Quiet Current',artist:'Mara Vale',username:'maravale',category:'Painting',medium:'Oil on linen',style:'Figurative',image:'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1200&q=85',width:900,height:1200,price:680,likes:842,saves:310},
  {slug:'after-rain',title:'After Rain',artist:'Niko Hart',username:'nikohart',category:'Photography',medium:'Archival pigment print',style:'Urban',image:'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=85',width:1200,height:800,price:140,likes:419,saves:176},
  {slug:'soft-machines',title:'Soft Machines',artist:'Iris Kade',username:'iriskade',category:'Digital',medium:'Digital painting',style:'Surrealism',image:'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=85',width:900,height:1150,price:95,likes:1204,saves:590},
  {slug:'night-orchard',title:'Night Orchard',artist:'Leo North',username:'leonorth',category:'Illustration',medium:'Ink & graphite',style:'Dark Art',image:'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=85',width:900,height:1350,likes:682,saves:264},
  {slug:'signal-bloom',title:'Signal Bloom',artist:'Aya Sol',username:'ayasol',category:'3D',medium:'3D render',style:'Abstract',image:'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?auto=format&fit=crop&w=1200&q=85',width:1000,height:1000,price:220,likes:990,saves:421},
  {slug:'lineage-04',title:'Lineage 04',artist:'Ren Ito',username:'renito',category:'Tattoo',medium:'Ink design',style:'Fine Line',image:'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=1200&q=85',width:900,height:1180,likes:1540,saves:899},
  {slug:'coastal-memory',title:'Coastal Memory',artist:'June Mercer',username:'junemercer',category:'Painting',medium:'Acrylic',style:'Abstract',image:'https://images.unsplash.com/photo-1578301978018-3005759f48f7?auto=format&fit=crop&w=1200&q=85',width:1200,height:850,price:1200,likes:477,saves:200},
  {slug:'paper-city',title:'Paper City',artist:'Emi Rowe',username:'emirowe',category:'Design',medium:'Mixed media',style:'Collage',image:'https://images.unsplash.com/photo-1561839561-b13bcfe95249?auto=format&fit=crop&w=1200&q=85',width:900,height:1100,likes:361,saves:155}
];
