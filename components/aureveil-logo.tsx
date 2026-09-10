export function AureVeilMark({className=''}:{className?:string}) {
  return (
    <svg className={className} viewBox="0 0 120 84" role="img" aria-label="AureVeil angel and demon wing mark">
      <defs>
        <linearGradient id="angelWing" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff"/>
          <stop offset=".55" stopColor="#e9e7e4"/>
          <stop offset="1" stopColor="#bfc5cf"/>
        </linearGradient>
        <linearGradient id="demonWing" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#121218"/>
          <stop offset=".55" stopColor="#7b1019"/>
          <stop offset="1" stopColor="#ef313c"/>
        </linearGradient>
      </defs>
      <ellipse cx="32" cy="9" rx="13" ry="4.5" fill="none" stroke="#fff3df" strokeWidth="2.3" opacity=".95"/>
      <path d="M52 24C39 20 23 27 12 39c8-3 15-3 20-1-9 3-17 8-24 16 10-3 18-2 24 1-8 4-14 9-19 16 12-4 24-4 34 1 3-15 5-31 5-48Z"
            fill="url(#angelWing)" stroke="rgba(255,255,255,.42)" strokeWidth="1"/>
      <path d="M43 29C31 31 21 36 13 43M45 39C31 41 20 47 11 55M44 50C31 52 22 59 17 68"
            fill="none" stroke="rgba(255,255,255,.58)" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M68 24C82 20 98 27 109 39c-8-3-15-3-20-1 9 3 17 8 24 16-10-3-18-2-24 1 8 4 14 9 19 16-12-4-24-4-34 1-3-15-5-31-6-48Z"
            fill="url(#demonWing)" stroke="rgba(255,74,84,.42)" strokeWidth="1"/>
      <path d="M77 29C89 31 99 36 107 43M75 39C89 41 100 47 109 55M76 50C89 52 98 59 103 68"
            fill="none" stroke="rgba(255,69,79,.55)" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M60 15c2.2 10.3 5.5 13.6 15.8 15.8C65.5 33 62.2 36.3 60 46.6 57.8 36.3 54.5 33 44.2 30.8 54.5 28.6 57.8 25.3 60 15Z"
            fill="#fffaf1"/>
      <path d="M60 25v34" stroke="#fff" strokeWidth="1.1" opacity=".75"/>
    </svg>
  );
}
