import type { Metadata } from 'next';
import { ModeAffinityTracker } from '@/components/mode-affinity-tracker';
import './globals.css';
import { siteConfig } from '@/lib/config';
import { SiteHeader } from '@/components/site-header';
export const metadata: Metadata = { title:{default:siteConfig.name,template:`%s · ${siteConfig.name}`},description:siteConfig.description,metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000') };
const themeScript=`(()=>{try{const saved=localStorage.getItem('musefold-theme');const dark=saved? saved==='dark' : true;document.documentElement.dataset.theme=dark?'dark':'light'}catch{document.documentElement.dataset.theme='dark'}})()`;

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:themeScript}}/></head><body>
        <ModeAffinityTracker />
        <div className="angel-sky" aria-hidden="true">
          <span className="angel-cloud c1" />
          <span className="angel-cloud c2" />
          <span className="angel-star s1">✦</span>
          <span className="angel-star s2">♡</span>
          <span className="angel-star s3">✧</span>
        </div>
        <div className="mf-real-paint-photo" aria-hidden="true"/><SiteHeader/><main>{children}</main></body></html>}
