import { useEffect, useState } from "react";
import { Play, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getPublicVideos } from "@/lib/api";
import { FadeIn, SectionLabel, Blob } from "@/components/Bits";

function youtubeEmbed(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v"); if (v) return `https://www.youtube.com/embed/${v}`;
    }
  } catch {}
  return url;
}

export default function Learn() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(null);
  useEffect(() => { getPublicVideos().then(setRows).catch(() => setRows([])); }, []);
  const filtered = rows.filter((v) => [v.title, v.subject, v.description].some((x)=>String(x||"").toLowerCase().includes(q.toLowerCase())));
  return (
    <div data-testid="learn-page">
      <section className="relative overflow-hidden">
        <Blob className="bg-orange-200/40 h-72 w-72 -top-10 -right-10" />
        <Blob className="bg-sky-200/40 h-72 w-72 top-32 -left-20" />
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-16 pb-8 sm:pt-24 sm:pb-10">
          <SectionLabel>Free for everyone</SectionLabel>
          <h1 className="mt-3 font-display text-5xl sm:text-6xl font-semibold text-slate-800 leading-[1.05]">
            Tiny lessons.<span className="block text-orange-500">Big curiosity.</span>
          </h1>
          <p className="mt-5 text-lg text-slate-600 max-w-2xl">Bite-sized videos from our gurus — totally free, totally for your little learner. Watch as many as you like.</p>
          <div className="mt-6 max-w-md relative">
            <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search videos…" className="h-12 rounded-full border-2 border-slate-200 pl-10" data-testid="learn-search" />
          </div>
        </div>
      </section>

      <section className="pb-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {filtered.length === 0 && (
            <div className="rounded-[2rem] bg-white border-2 border-slate-100 p-10 text-center">
              <p className="text-slate-500">No free lessons published yet — please check back soon!</p>
            </div>
          )}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((v)=>(
              <FadeIn key={v.id}>
                <button onClick={()=>setActive(v)} className="text-left rounded-[2rem] bg-white border-2 border-slate-100 p-5 hover:shadow-xl hover:-translate-y-1 transition-all w-full" data-testid={`video-card-${v.id}`}>
                  <div className="aspect-video rounded-2xl overflow-hidden bg-slate-100">
                    {v.thumbnail_url ? <img src={v.thumbnail_url} alt={v.title} className="h-full w-full object-cover" loading="lazy" /> : <div className="h-full w-full flex items-center justify-center text-slate-400"><Play className="h-10 w-10" /></div>}
                  </div>
                  <p className="mt-3 font-display text-lg font-semibold text-slate-800 line-clamp-2">{v.title}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 font-bold">{v.subject}</span>
                    <span className="text-slate-500">Age {v.age_group}</span>
                    {v.duration && <span className="text-slate-500">· {v.duration}</span>}
                  </div>
                </button>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {active && (
        <div className="fixed inset-0 z-[60] bg-slate-900/85 backdrop-blur-sm flex items-center justify-center p-4" onClick={()=>setActive(null)}>
          <div className="max-w-4xl w-full" onClick={(e)=>e.stopPropagation()}>
            <div className="aspect-video rounded-2xl overflow-hidden bg-black">
              <iframe className="w-full h-full" src={youtubeEmbed(active.video_url)} title={active.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
            </div>
            <p className="mt-3 text-white font-display text-xl font-semibold">{active.title}</p>
            <p className="text-slate-300 text-sm mt-1">{active.description}</p>
            <button onClick={()=>setActive(null)} className="mt-4 inline-flex items-center px-5 h-11 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
