import { useEffect, useState, useMemo } from "react";
import { Routes, Route, NavLink, Navigate, useNavigate } from "react-router-dom";
import { LayoutDashboard, Video, MessageSquare, Ticket, User, LogOut, Send, Menu, X, Play } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  studentLogin, studentToken, setStudentToken, studentMe, studentVideos,
  studentGetMessages, studentSendMessage, studentCreateTicket, studentMyTickets, formatApiError,
} from "@/lib/api";

const NAV = [
  { to: "", icon: LayoutDashboard, label: "Dashboard" },
  { to: "videos", icon: Video, label: "Videos" },
  { to: "chat", icon: MessageSquare, label: "Chat" },
  { to: "tickets", icon: Ticket, label: "Support" },
  { to: "profile", icon: User, label: "My Profile" },
];

function Protected({ children }) {
  return studentToken() ? children : <Navigate to="/lms/login" replace />;
}

export default function StudentLMS() {
  return (
    <Routes>
      <Route path="login" element={<LMSLogin />} />
      <Route path="*" element={<Protected><LMSShell /></Protected>} />
    </Routes>
  );
}

function LMSLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => { if (studentToken()) nav("/lms"); }, [nav]);
  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try { const r = await studentLogin({ email, password }); setStudentToken(r.token); toast.success(`Welcome, ${r.user.name || "Guru"}!`); nav("/lms"); }
    catch (err) { toast.error(formatApiError(err)); }
    finally { setLoading(false); }
  };
  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-6" data-testid="lms-login">
      <div className="w-full max-w-md rounded-3xl bg-white border-2 border-slate-100 p-8 shadow-xl">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Little Gurus" className="h-12 w-auto" />
          <div>
            <p className="text-xs uppercase tracking-widest text-orange-500 font-bold">Student Portal</p>
            <h1 className="font-display text-2xl font-semibold text-slate-800">Welcome, little guru!</h1>
          </div>
        </div>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <div><Label className="text-slate-700">Email</Label>
            <Input data-testid="student-email" value={email} onChange={(e)=>setEmail(e.target.value)} type="email" className="mt-1 h-12 rounded-xl border-2 border-slate-200" />
          </div>
          <div><Label className="text-slate-700">Password</Label>
            <Input data-testid="student-password" value={password} onChange={(e)=>setPassword(e.target.value)} type="password" className="mt-1 h-12 rounded-xl border-2 border-slate-200" />
          </div>
          <Button data-testid="student-login-btn" type="submit" disabled={loading} className="w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 font-bold">
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <p className="mt-6 text-xs text-slate-500 text-center">Don't have an account? Speak to your guru — they'll set it up for you.</p>
      </div>
    </div>
  );
}

function LMSShell() {
  const nav = useNavigate();
  const [me, setMe] = useState(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    studentMe().then(setMe).catch((e) => { toast.error(formatApiError(e)); setStudentToken(null); nav("/lms/login"); });
  }, [nav]);
  const logout = () => { setStudentToken(null); nav("/lms/login"); };
  return (
    <div className="min-h-screen bg-amber-50" data-testid="lms-shell">
      <header className="sticky top-0 z-30 bg-white border-b border-slate-100 px-5 h-16 flex items-center gap-3">
        <button onClick={()=>setOpen((v)=>!v)} className="lg:hidden h-10 w-10 rounded-xl bg-slate-100">{open ? <X className="h-5 w-5 mx-auto"/> : <Menu className="h-5 w-5 mx-auto"/>}</button>
        <img src="/logo.png" alt="Little Gurus" className="h-9 w-auto" />
        <span className="font-display text-lg font-semibold text-slate-800 hidden sm:inline">Little <span className="text-orange-500">Gurus</span></span>
        <span className="ml-auto text-sm text-slate-600 hidden sm:inline">Hi, <span className="font-bold">{me?.name || "Guru"}</span></span>
        <button onClick={logout} className="ml-2 inline-flex items-center gap-1.5 px-3 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-sm font-semibold"><LogOut className="h-4 w-4" /> Sign out</button>
      </header>
      <div className="flex">
        <aside className={`${open ? "block" : "hidden"} lg:block fixed lg:sticky top-16 lg:top-16 inset-x-0 lg:inset-auto lg:h-[calc(100vh-4rem)] w-full lg:w-64 bg-white border-r border-slate-100 p-5 z-20`}>
          <nav className="space-y-1">
            {NAV.map((n)=>(
              <NavLink key={n.label} end={n.to===""} to={`/lms/${n.to}`} onClick={()=>setOpen(false)}
                className={({isActive})=>`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold ${isActive ? "bg-orange-100 text-orange-700" : "text-slate-700 hover:bg-slate-50"}`}>
                <n.icon className="h-4 w-4" /> {n.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="flex-1 min-w-0 p-5 sm:p-8">
          <Routes>
            <Route index element={<MyDashboard me={me} />} />
            <Route path="videos" element={<VideoLibrary me={me} />} />
            <Route path="chat" element={<ChatView />} />
            <Route path="tickets" element={<TicketView />} />
            <Route path="profile" element={<ProfileView me={me} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

const card = "rounded-2xl bg-white border-2 border-slate-100 p-6 shadow-sm";
function PH({title, subtitle, action}) { return (
  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
    <div><h1 className="font-display text-3xl font-semibold text-slate-800">{title}</h1>{subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}</div>
    {action}
  </div>
);}

// --------------- Dashboard ---------------
function MyDashboard({ me }) {
  return (
    <div>
      <PH title={`Welcome back, ${me?.name?.split(" ")[0] || "Guru"}!`} subtitle="Your learning home — videos, gurus, and a friendly chat away." />
      <div className="grid lg:grid-cols-3 gap-4">
        <div className={card}>
          <p className="text-xs uppercase tracking-widest text-orange-500 font-bold">Your program</p>
          <p className="mt-2 font-display text-2xl font-semibold text-slate-800">{me?.program || "—"}</p>
          <p className="mt-1 text-sm text-slate-500">{me?.age_group ? `Age group ${me.age_group}` : ""}</p>
        </div>
        <div className={card}>
          <p className="text-xs uppercase tracking-widest text-orange-500 font-bold">Next class</p>
          <p className="mt-2 font-display text-2xl font-semibold text-slate-800">Mon–Fri</p>
          <p className="mt-1 text-sm text-slate-500">7:00 PM – 9:00 PM IST</p>
        </div>
        <div className={card}>
          <p className="text-xs uppercase tracking-widest text-orange-500 font-bold">Next billing</p>
          <p className="mt-2 font-display text-2xl font-semibold text-slate-800">{me?.next_billing_date || "—"}</p>
          <p className="mt-1 text-sm text-slate-500">Ask your guru for renewal options</p>
        </div>
      </div>
      <div className={`${card} mt-6`}>
        <p className="text-xs uppercase tracking-widest text-orange-500 font-bold">Quick links</p>
        <div className="mt-3 flex flex-wrap gap-3">
          <NavLink to="/lms/videos" className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold"><Video className="h-4 w-4"/> Video library</NavLink>
          <NavLink to="/lms/chat" className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold"><MessageSquare className="h-4 w-4"/> Chat with guru</NavLink>
          <NavLink to="/lms/tickets" className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold"><Ticket className="h-4 w-4"/> Raise request</NavLink>
        </div>
      </div>
    </div>
  );
}

// --------------- Videos ---------------
function youtubeEmbed(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
  } catch {}
  return url;
}

function VideoLibrary({ me }) {
  const [rows, setRows] = useState([]);
  const [active, setActive] = useState(null);
  useEffect(() => { studentVideos(me?.age_group).then(setRows).catch((e)=>toast.error(formatApiError(e))); }, [me?.age_group]);
  return (
    <div>
      <PH title="Video library" subtitle={`Filtered for age group ${me?.age_group || "all"}`} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {rows.map((v)=>(
          <button key={v.id} onClick={()=>setActive(v)} className={`text-left ${card} hover:shadow-xl hover:-translate-y-1 transition-all`}>
            <div className="aspect-video rounded-xl overflow-hidden bg-slate-100">
              {v.thumbnail_url ? <img src={v.thumbnail_url} alt={v.title} className="h-full w-full object-cover"/> : <div className="h-full w-full flex items-center justify-center text-slate-400"><Play className="h-10 w-10"/></div>}
            </div>
            <p className="mt-3 font-display text-lg font-semibold text-slate-800 line-clamp-2">{v.title}</p>
            <div className="mt-1 flex items-center gap-2 text-xs">
              <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 font-bold">{v.subject}</span>
              <span className="text-slate-500">{v.duration || ""}</span>
            </div>
          </button>
        ))}
        {!rows.length && <p className="text-slate-500 col-span-full">No videos yet. Your gurus will publish new lessons soon.</p>}
      </div>
      {active && (
        <div className="fixed inset-0 z-[60] bg-slate-900/85 backdrop-blur-sm flex items-center justify-center p-4" onClick={()=>setActive(null)}>
          <div className="max-w-4xl w-full" onClick={(e)=>e.stopPropagation()}>
            <div className="aspect-video rounded-2xl overflow-hidden bg-black">
              <iframe className="w-full h-full" src={youtubeEmbed(active.video_url)} title={active.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
            </div>
            <div className="mt-3 text-white">
              <p className="font-display text-xl font-semibold">{active.title}</p>
              <p className="text-slate-300 text-sm mt-1">{active.description}</p>
              <Button onClick={()=>setActive(null)} className="mt-4 rounded-full bg-orange-500 hover:bg-orange-600">Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --------------- Chat ---------------
function ChatView() {
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const refresh = () => studentGetMessages().then(setMsgs).catch((e)=>toast.error(formatApiError(e)));
  useEffect(()=>{refresh(); const t = setInterval(refresh, 6000); return ()=>clearInterval(t);},[]);
  const send = async () => {
    if (!text.trim()) return;
    await studentSendMessage(text); setText(""); refresh();
  };
  return (
    <div>
      <PH title="Chat" subtitle="Drop a message — your gurus reply during class hours" />
      <div className="rounded-2xl border-2 border-slate-100 bg-white flex flex-col h-[calc(100vh-260px)]">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {msgs.map((m)=>(
            <div key={m.id} className={`max-w-[80%] rounded-2xl px-4 py-2 ${m.from_role==="student" ? "ml-auto bg-orange-500 text-white" : "bg-slate-100 text-slate-800"}`}>
              <p className="text-sm">{m.text}</p>
              <p className="text-[10px] opacity-70 mt-1">{m.created_at?.slice(11,16)} · {m.from_role==="student" ? "You" : "Guru"}</p>
            </div>
          ))}
          {!msgs.length && <p className="text-center text-slate-400 text-sm py-10">Say hello to your gurus! 👋</p>}
        </div>
        <div className="p-3 border-t border-slate-100 flex gap-2">
          <Input className="flex-1 h-11 rounded-full border-2 border-slate-200 px-4" placeholder="Type a message…" value={text} onChange={(e)=>setText(e.target.value)} onKeyDown={(e)=>e.key==="Enter"&&send()} />
          <Button onClick={send} className="rounded-full bg-orange-500 hover:bg-orange-600 px-5"><Send className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
}

// --------------- Tickets ---------------
function TicketView() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ type: "Technical Issue", description: "" });
  const refresh = () => studentMyTickets().then(setRows).catch((e)=>toast.error(formatApiError(e)));
  useEffect(()=>{refresh();},[]);
  const submit = async () => {
    if (form.description.trim().length < 2) return toast.error("Please describe your issue");
    try { await studentCreateTicket(form); toast.success("Request submitted"); setForm({...form, description:""}); refresh(); }
    catch(e){ toast.error(formatApiError(e)); }
  };
  return (
    <div>
      <PH title="Raise a request" subtitle="Missed a class, need help, or want to switch schedule? Tell us." />
      <div className={`${card} mb-6 max-w-2xl`}>
        <Label>Request type</Label>
        <Select value={form.type} onValueChange={(v)=>setForm({...form, type:v})}>
          <SelectTrigger className="mt-1 h-12 rounded-xl border-2 border-slate-200"><SelectValue /></SelectTrigger>
          <SelectContent>{["Class Missed - Request Recording","Technical Issue","Fee Query","Schedule Change","Other"].map(t=><SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
        </Select>
        <Label className="mt-3 block">Describe your request</Label>
        <Textarea rows={5} value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} className="mt-1 rounded-2xl border-2 border-slate-200 px-4 py-3" placeholder="Tell us what happened…" />
        <Button onClick={submit} className="mt-4 rounded-full bg-orange-500 hover:bg-orange-600 px-6 h-11 font-bold">Submit request</Button>
      </div>
      <h3 className="font-display text-xl font-semibold text-slate-800 mb-3">Your past requests</h3>
      <div className="space-y-3">
        {rows.map((r)=>(
          <div key={r.id} className={card}>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="inline-flex items-center rounded-full bg-sky-100 text-sky-700 px-2.5 py-1 text-xs font-bold">{r.type}</span>
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${r.status==="Resolved"?"bg-emerald-100 text-emerald-700":r.status==="In Progress"?"bg-amber-100 text-amber-700":"bg-slate-100 text-slate-700"}`}>{r.status}</span>
              <span className="ml-auto text-xs text-slate-500">{r.created_at?.slice(0,10)}</span>
            </div>
            <p className="text-sm text-slate-700">{r.description}</p>
            {r.response && <p className="mt-2 text-sm rounded-xl bg-amber-50 border-2 border-amber-100 p-3"><b>Guru's reply:</b> {r.response}</p>}
          </div>
        ))}
        {!rows.length && <p className="text-slate-500">No requests yet — we hope you never need to raise one!</p>}
      </div>
    </div>
  );
}

// --------------- Profile ---------------
function ProfileView({ me }) {
  if (!me) return null;
  return (
    <div>
      <PH title="My profile" />
      <div className={`${card} max-w-xl`}>
        <Row label="Name" value={me.name} />
        <Row label="Email" value={me.email} />
        <Row label="Parent" value={`${me.parent_name||"—"} · ${me.parent_phone||""}`} />
        <Row label="Program" value={me.program} />
        <Row label="Age group" value={me.age_group||"—"} />
        <Row label="Status" value={me.status} />
        <Row label="Class schedule" value="Mon–Fri, 7:00 PM – 9:00 PM IST" />
        <Row label="Next billing date" value={me.next_billing_date||"—"} />
      </div>
    </div>
  );
}
function Row({label, value}) {
  return <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 py-2 border-b border-slate-100 last:border-0">
    <span className="text-xs uppercase tracking-widest text-slate-500 font-bold w-40">{label}</span>
    <span className="text-slate-800 font-semibold">{value}</span>
  </div>;
}
