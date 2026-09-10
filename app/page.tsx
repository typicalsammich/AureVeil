import Link from 'next/link';
import { ArrowRight, Box, Brush, Camera, Heart, PenTool, Sparkles, WandSparkles, Palette } from 'lucide-react';

const categories = [
  {label:'All',icon:Sparkles,href:'/explore'},
  {label:'Digital',icon:WandSparkles,href:'/explore?q=Digital'},
  {label:'Painting',icon:Brush,href:'/explore?q=Painting'},
  {label:'Photography',icon:Camera,href:'/explore?q=Photography'},
  {label:'Illustration',icon:PenTool,href:'/explore?q=Illustration'},
  {label:'Tattoo',icon:Palette,href:'/tattoo'},
  {label:'3D',icon:Box,href:'/explore?q=3D'},
  {label:'Traditional',icon:Brush,href:'/explore?q=Traditional'},
  {label:'Other',icon:Sparkles,href:'/explore?q=Other'},
];

const featured = [
  {img:'/demo/art-1.jpg',title:'Melting Reality',user:'studiokai',price:'$250',likes:'2.4K'},
  {img:'/demo/art-2.jpg',title:'Neon Path',user:'rylan.visuals',price:'$180',likes:'1.8K'},
  {img:'/demo/art-3.jpg',title:'Higher Ground',user:'ellamoss',price:'$320',likes:'1.2K'},
  {img:'/demo/art-4.jpg',title:'Serpent Bloom',user:'inkbyren',price:'$150',likes:'936'},
  {img:'/demo/art-5.jpg',title:'Colorblind',user:'jess.art',price:'$210',likes:'2.1K'},
  {img:'/demo/art-6.jpg',title:'Blood Moon',user:'kaelcreates',price:'$300',likes:'2.6K'},
  {img:'/demo/art-7.jpg',title:'Fading Thought',user:'mari.sol',price:'View',likes:'947'},
];

export default function Home(){
  return <div className="exact-home">
    <div className="angel-atmosphere" aria-hidden="true"><span className="angel-cloud angel-cloud-1"/><span className="angel-cloud angel-cloud-2"/><span className="angel-cloud angel-cloud-3"/><i className="angel-spark angel-spark-1">✦</i><i className="angel-spark angel-spark-2">♡</i><i className="angel-spark angel-spark-3">✧</i></div>
    <section className="exact-hero">
      <div className="exact-copy">
        <div className="exact-eyebrow">MORE THAN ART <i/></div>
        <h1>DISCOVER.<br/>COLLECT.<br/>SUPPORT.<br/><em>CREATE.</em></h1>
        <p>AureVeil is a home for artists and collectors to connect, share, and bring ideas to life.</p>
        <div className="exact-hero-buttons">
          <Link href="/explore" className="exact-primary">Explore Art <ArrowRight size={19}/></Link>
          <Link href="/signup" className="exact-secondary">Join AureVeil</Link>
        </div>
        <div className="exact-community">
          <div className="exact-avatars"><span>M</span><span>N</span><span>I</span><span>R</span><i/></div>
          <div><strong>50K+ artists & collectors</strong><small>already here</small></div>
        </div>
      </div>

      <div className="exact-collage">
        <span className="exact-note note-left">GOOD<br/>ART<br/>BETTER<br/>PEOPLE</span>
        <Link href="/art/quiet-current" className="exact-card card-left">
          <img className="mode-image mode-image-dark" src="/demo/hero-left.jpg" alt="Bold portrait artwork"/>
          <img className="mode-image mode-image-light" src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=85" alt="Soft floral artwork"/>
        </Link>
        <Link href="/art/soft-machines" className="exact-card card-center">
          <img className="mode-image mode-image-dark" src="/demo/hero-center.jpg" alt="Colorful portrait artwork"/>
          <img className="mode-image mode-image-light" src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85" alt="Dreamy peaceful landscape artwork"/>
        </Link>
        <Link href="/art/signal-bloom" className="exact-card card-right">
          <img className="mode-image mode-image-dark" src="/demo/hero-right.jpg" alt="Colorful sculpture artwork"/>
          <img className="mode-image mode-image-light" src="https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=900&q=85" alt="Soft sky and cloud artwork"/>
        </Link>
        <span className="exact-note note-right"><b>⌄</b> ART<br/>CHANGES<br/>EVERYTHING</span>
        <span className="exact-note note-far">SAME<br/>HUMAN<br/>DIFFERENT<br/>CANVAS</span>
      </div>
    </section>

    <section className="exact-categories">
      {categories.map((c,i)=>{const Icon=c.icon;return <Link key={c.label} href={c.href} className={i===0?'active':''}><Icon size={16}/><span>{c.label}</span></Link>})}
      <Link href="/explore" className="exact-view-all">View All <ArrowRight size={18}/></Link>
    </section>

    <section className="exact-featured">
      <div className="exact-featured-head"><h2>Featured Art</h2><div/><span>HANDPICKED · BY · OUR · TEAM</span></div>
      <div className="exact-rail">
        {featured.map((art,i)=><article className="exact-tile" key={art.title}>
          <Link href={`/explore?q=${encodeURIComponent(art.title)}`} className="exact-thumb">
            <img src={art.img} alt={art.title}/><span className="exact-likes"><Heart size={14}/>{art.likes}</span>{i===6&&<span className="exact-next">→</span>}
          </Link>
          <div className="exact-meta"><span className="exact-mini-avatar">{art.user[0].toUpperCase()}</span><div><strong>{art.title}</strong><small>@{art.user}</small></div><b>{art.price}</b></div>
        </article>)}
      </div>
    </section>

    <section className="exact-paths">
      <Link href="/studio" className="exact-path artist-path"><div><span>FOR ARTISTS</span><p>Share your work, grow your audience,<br/>and get commissioned.</p><b>Start Creating <ArrowRight size={16}/></b></div></Link>
      <Link href="/collections" className="exact-path collector-path"><div><span>FOR COLLECTORS</span><p>Find unique pieces and support independent artists<br/>from around the world.</p><b>Start Collecting <ArrowRight size={16}/></b></div></Link>
      <Link href="/commissions" className="exact-path commission-path"><div><span>COMMISSIONS</span><p>Bring your ideas to life with custom artwork<br/>made just for you.</p><b>Request a Commission <ArrowRight size={16}/></b></div></Link>
    </section>

    <section className="exact-ai">
      <div><span>DISCOVER WITH LANGUAGE</span><h2>Describe the art you can’t quite name.</h2><p>Search by mood, color, subject, medium, era, or a half-formed idea. AureVeil remembers what you search, like, save, follow, and collect to shape your recommendations.</p></div>
      <form action="/explore"><Sparkles size={20}/><input name="q" placeholder="Try “dreamlike portrait with cobalt blue and gold...”"/><button>Discover <ArrowRight size={17}/></button></form>
    </section>
  </div>;
}
