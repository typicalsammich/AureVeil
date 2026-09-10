import { UploadCloud } from 'lucide-react';
export default function UploadPage(){return <div className="shell py-10"><div className="max-w-4xl mx-auto"><p className="text-xs uppercase tracking-[.18em] muted">Creator Mode</p><h1 className="serif text-5xl mt-2">Publish artwork</h1><p className="muted mt-3">Uploads are stored in Supabase Storage once your project credentials are configured.</p><form className="mt-8 grid md:grid-cols-2 gap-8"><div><label className="border-2 border-dashed hairline min-h-[360px] bg-white grid place-items-center text-center p-8"><div><UploadCloud size={34} className="mx-auto"/><p className="mt-4 font-medium">Drop images here</p><p className="text-sm muted mt-1">JPG, PNG or WEBP · up to 20 MB each</p><input type="file" accept="image/jpeg,image/png,image/webp" multiple className="mt-5 text-sm"/></div></label></div><div className="grid gap-4 content-start">{['Title','Description','Category','Medium','Style','Subject','Tags','Year created','Original dimensions'].map(x=><label className="text-sm" key={x}>{x}{x==='Description'?<textarea className="mt-2 w-full border hairline p-3 bg-white min-h-24"/>:<input className="mt-2 w-full border hairline p-3 bg-white"/>}</label>)}<label className="text-sm">Availability<select className="mt-2 w-full border hairline p-3 bg-white"><option>Showcase only</option><option>Available for sale</option><option>Available as print</option><option>Digital download</option><option>Commission example</option></select></label><button type="button" disabled className="bg-[#bdb9b2] text-white p-3 cursor-not-allowed">Connect Supabase to publish</button></div></form></div></div>}

      <section className="upload-section">
        <div className="section-kicker">Discovery mode</div>
        <h2>Choose where this artwork appears</h2>
        <p className="muted">Demon is the edgier, darker discovery side. Angel is the softer, calmer side. Both appears in either feed when relevant.</p>
        <div className="mode-destination-group">
          <button type="button" className="mode-destination" data-selected="false">
            <strong>☾ Demon</strong>
            <small>Dark, intense, surreal, experimental, gothic, cyber, horror, tattoo, street, and high-energy work.</small>
          </button>
          <button type="button" className="mode-destination" data-selected="false">
            <strong>✧ Angel</strong>
            <small>Soft, peaceful, dreamy, cute, cozy, pastel, nature, gentle photography, and chill illustration.</small>
          </button>
          <button type="button" className="mode-destination" data-selected="true">
            <strong>◐ Both</strong>
            <small>Eligible for both feeds. AureVeil can still rank it differently based on each viewer’s taste.</small>
          </button>
        </div>
      </section>
