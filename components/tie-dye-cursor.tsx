'use client';
import { useEffect, useRef } from 'react';

export function TieDyeCursor(){
  const ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    if(!matchMedia('(pointer:fine)').matches) return;
    const el=ref.current;
    if(!el) return;
    const move=(e:MouseEvent)=>{el.style.left=`${e.clientX}px`;el.style.top=`${e.clientY}px`};
    const over=(e:MouseEvent)=>{if((e.target as Element)?.closest?.('a,button,input,textarea,select,[role="button"]'))el.classList.add('tie-cursor--active')};
    const out=(e:MouseEvent)=>{if((e.target as Element)?.closest?.('a,button,input,textarea,select,[role="button"]'))el.classList.remove('tie-cursor--active')};
    document.addEventListener('mousemove',move);document.addEventListener('mouseover',over);document.addEventListener('mouseout',out);
    return()=>{document.removeEventListener('mousemove',move);document.removeEventListener('mouseover',over);document.removeEventListener('mouseout',out)};
  },[]);
  return <div ref={ref} className="tie-cursor" aria-hidden="true"/>;
}
