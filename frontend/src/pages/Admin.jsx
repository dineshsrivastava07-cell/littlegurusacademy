import { useEffect, useState, useMemo } from "react";
import { Routes, Route, NavLink, Navigate, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Mail, Calendar, FileText, MessageSquare, Star, Video, Users,
  Settings, Sparkles, GraduationCap, Ticket, LogOut, Save, Plus, Trash2, Pencil, Search, Send, Menu, X, Shield,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  adminLogin, adminToken, setAdminToken, adminStats,
  adminListEnquiries, adminPatchEnquiry,
  adminListTours, adminPatchTour,
  adminListApps, adminPatchApp,
  adminListTestimonials, adminCreateTestimonial, adminPatchTestimonial, adminDeleteTestimonial,
  adminListVideos, adminCreateVideo, adminPatchVideo, adminDeleteVideo,
  adminListTeachers, adminCreateTeacher, adminPatchTeacher, adminDeleteTeacher,
  adminListStudents, adminCreateStudent, adminPatchStudent,
  adminListTickets, adminPatchTicket,
  adminGetSettings, adminPatchSettings, adminChangePassword,
  adminThreads, adminGetMessages, adminSendMessage,
  formatApiError,
} from "@/lib/api";

const NAV = [
  { to: "", icon: LayoutDashboard, label: "Dashboard" },
  { to: "enquiries", icon: Mail, label: "Enquiries" },
  { to: "tours", icon: Calendar, label: "Tour Bookings" },
  { to: "applications", icon: FileText, label: "Applications" },
  { to: "testimonials", icon: Star, label: "Testimonials" },
  { to: "videos", icon: Video, label: "Videos" },
  { to: "teachers", icon: GraduationCap, label: "Teachers" },
  { to: "students", icon: Users, label: "Students" },
  { to: "messages", icon: MessageSquare, label: "Messages" },
  { to: "tickets", icon: Ticket, label: "Tickets" },
  { to: "content", icon: Sparkles, label: "Page Content" },
  { to: "settings", icon: Settings, label: "Settings" },
];

function Protected({ children }) {
  return adminToken() ? children : <Navigate to="/admin/login" replace />;
}

export default function AdminPortal() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route path="*" element={<Protected><AdminShell /></Protected>} />
    </Routes>
  );
}

function AdminLogin() {
  const nav = useNavigate();
  const [u, setU] = useState("admin");
  const [p, setP] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await adminLogin({ username: u, password: p });
      setAdminToken(r.token);
      toast.success("Welcome back, admin.");
      nav("/admin");
    } catch (err) {
      toast.error(formatApiError(err));
    } finally { setLoading(false); }
  };
  useEffect(() => { if (adminToken()) nav("/admin"); }, [nav]);
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6" data-testid="admin-login">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl">
        <div className="flex items-center gap-3">
          <span className="h-11 w-11 rounded-2xl bg-orange-500 text-white flex items-center justify-center"><Shield className="h-5 w-5" /></span>
          <div>
            <p className="text-xs uppercase tracking-widest text-orange-400 font-bold">Little Gurus</p>
            <h1 className="font-display text-2xl font-semibold">Admin Portal</h1>
          </div>
        </div>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <div><Label className="text-slate-300">Username</Label>
            <Input data-testid="admin-username" value={u} onChange={(e)=>setU(e.target.value)} autoComplete="username"
              className="mt-1 h-12 rounded-xl bg-slate-800 border-slate-700 text-white" />
          </div>
          <div><Label className="text-slate-300">Password</Label>
            <Input type="password" data-testid="admin-password" value={p} onChange={(e)=>setP(e.target.value)} autoComplete="current-password"
              className="mt-1 h-12 rounded-xl bg-slate-800 border-slate-700 text-white" />
          </div>
          <Button data-testid="admin-login-btn" type="submit" disabled={loading}
            className="w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 font-bold">
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <p className="mt-6 text-xs text-slate-500 text-center">Authorized personnel only · DPDP Act 2023</p>
      </div>
    </div>
  );
}

function AdminShell() {
  const nav = useNavigate();
  const loc = useLocation();
  const [open, setOpen] = useState(false);
  const logout = () => { setAdminToken(null); nav("/admin/login"); };
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100" data-testid="admin-shell">
      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between px-5 h-16 border-b border-slate-800 bg-slate-900 sticky top-0 z-30">
        <div className="flex items-center gap-2 font-display font-semibold"><Shield className="h-5 w-5 text-orange-400" /> Admin</div>
        <button onClick={()=>setOpen((v)=>!v)} className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center">{open ? <X className="h-5 w-5"/> : <Menu className="h-5 w-5"/>}</button>
      </div>
      <div className="flex">
        {/* Sidebar */}
        <aside className={`${open ? "block" : "hidden"} lg:block fixed lg:sticky top-16 lg:top-0 inset-x-0 lg:inset-auto lg:h-screen w-full lg:w-72 bg-slate-900 border-r border-slate-800 p-5 z-20`}>
          <div className="hidden lg:flex items-center gap-3 mb-8">
            <span className="h-10 w-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center"><Shield className="h-5 w-5"/></span>
            <div>
              <p className="text-xs uppercase tracking-widest text-orange-400 font-bold">Little Gurus</p>
              <p className="font-display text-lg font-semibold">Admin Portal</p>
            </div>
          </div>
          <nav className="space-y-1">
            {NAV.map((n) => (
              <NavLink key={n.label} end={n.to===""} to={`/admin/${n.to}`} onClick={()=>setOpen(false)} data-testid={`admin-nav-${n.label.toLowerCase().replace(/\s+/g,"-")}`}
                className={({isActive})=>`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold ${isActive ? "bg-orange-500 text-white" : "text-slate-300 hover:bg-slate-800"}`}>
                <n.icon className="h-4 w-4" /> {n.label}
              </NavLink>
            ))}
          </nav>
          <button onClick={logout} data-testid="admin-logout"
            className="mt-6 flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-300 hover:bg-rose-950">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </aside>
        {/* Main */}
        <main className="flex-1 min-w-0 p-5 sm:p-8 bg-slate-950">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="enquiries" element={<EnquiriesView />} />
            <Route path="tours" element={<ToursView />} />
            <Route path="applications" element={<ApplicationsView />} />
            <Route path="testimonials" element={<TestimonialsView />} />
            <Route path="videos" element={<VideosView />} />
            <Route path="teachers" element={<TeachersView />} />
            <Route path="students" element={<StudentsView />} />
            <Route path="messages" element={<MessagesView />} />
            <Route path="tickets" element={<TicketsView />} />
            <Route path="content" element={<ContentView />} />
            <Route path="settings" element={<SettingsView />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// --------------- Reusable UI ---------------
const card = "rounded-2xl bg-slate-900 border border-slate-800 p-5";
const inp = "h-11 rounded-xl bg-slate-800 border-slate-700 text-white placeholder:text-slate-500";
const lab = "text-slate-300 text-xs font-bold uppercase tracking-wider";

function StatCard({ label, value, sub }) {
  return (
    <div className={card} data-testid={`stat-${label.toLowerCase().replace(/\s+/g,"-")}`}>
      <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold">{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}

function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">{title}</h1>
        {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function Table({ headers, children }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-900 text-xs uppercase tracking-wider text-slate-400">
          <tr>{headers.map((h)=><th key={h} className="px-4 py-3">{h}</th>)}</tr>
        </thead>
        <tbody className="bg-slate-950">{children}</tbody>
      </table>
    </div>
  );
}

function Pill({ children, tone = "slate" }) {
  const tones = {
    slate: "bg-slate-800 text-slate-200",
    orange: "bg-orange-500/20 text-orange-300",
    emerald: "bg-emerald-500/20 text-emerald-300",
    rose: "bg-rose-500/20 text-rose-300",
    sky: "bg-sky-500/20 text-sky-300",
  };
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]||tones.slate}`}>{children}</span>;
}

function exportCSV(filename, rows, headers) {
  const esc = (v)=>`"${String(v??"").replaceAll('"','""')}"`;
  const csv = [headers.join(",")].concat(rows.map(r=>headers.map(h=>esc(r[h])).join(","))).join("\n");
  const blob = new Blob([csv], {type:"text/csv"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

// --------------- Dashboard ---------------
function Dashboard() {
  const [s, setS] = useState(null);
  useEffect(() => { adminStats().then(setS).catch((e)=>toast.error(formatApiError(e))); }, []);
  if (!s) return <p className="text-slate-400">Loading…</p>;
  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Live snapshot of your academy" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Enquiries today" value={s.enquiries_today} sub={`${s.enquiries_week} this week`} />
        <StatCard label="Enquiries this month" value={s.enquiries_month} />
        <StatCard label="Tours pending" value={s.tours_pending} />
        <StatCard label="Applications pending" value={s.applications_pending} />
        <StatCard label="Students enrolled" value={s.students_total} />
        <StatCard label="Open tickets" value={s.tickets_open} />
        <StatCard label="Testimonials unpublished" value={s.testimonials_pending} />
        <StatCard label="Contact messages today" value={s.contact_today} />
      </div>
    </div>
  );
}

// --------------- Generic editable status table ---------------
function StatusSelect({ value, options, onChange, testid }) {
  return (
    <Select value={value || options[0]} onValueChange={onChange}>
      <SelectTrigger className="h-9 w-36 rounded-lg bg-slate-800 border-slate-700 text-xs" data-testid={testid}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>{options.map((o)=><SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
    </Select>
  );
}

// --------------- Enquiries ---------------
function EnquiriesView() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const refresh = () => adminListEnquiries().then(setRows).catch((e)=>toast.error(formatApiError(e)));
  useEffect(() => { refresh(); }, []);
  const filtered = rows.filter((r)=>[r.name,r.email,r.phone,r.message,r.program].some((x)=>String(x||"").toLowerCase().includes(q.toLowerCase())));
  const update = async (id, patch) => { await adminPatchEnquiry(id, patch); toast.success("Updated"); refresh(); };
  return (
    <div>
      <PageHeader title="Enquiries & Leads" subtitle={`${rows.length} total`} action={
        <div className="flex gap-2">
          <div className="relative"><Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <Input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search…" className={`${inp} pl-10 w-56`} data-testid="enquiries-search" />
          </div>
          <Button onClick={()=>exportCSV("enquiries.csv", filtered, ["name","email","phone","program","child_age","message","status","created_at"])}
            className="bg-slate-800 hover:bg-slate-700" data-testid="enquiries-export">Export CSV</Button>
        </div>
      } />
      <Table headers={["Name","Email","Phone","Program","Message","Date","Status","Notes"]}>
        {filtered.map((r)=>(
          <tr key={r.id} className="border-t border-slate-800 align-top">
            <td className="px-4 py-3 font-semibold">{r.name}</td>
            <td className="px-4 py-3 text-slate-300"><a href={`mailto:${r.email}`} className="hover:text-orange-300">{r.email}</a></td>
            <td className="px-4 py-3 text-slate-300">{r.phone}</td>
            <td className="px-4 py-3"><Pill tone="orange">{r.program}</Pill></td>
            <td className="px-4 py-3 text-slate-400 max-w-xs"><div className="line-clamp-3">{r.message||"—"}</div></td>
            <td className="px-4 py-3 text-slate-500 text-xs">{r.created_at?.slice(0,10)}</td>
            <td className="px-4 py-3"><StatusSelect value={r.status||"New"} options={["New","Contacted","Closed"]} onChange={(v)=>update(r.id,{status:v})} /></td>
            <td className="px-4 py-3">
              <Input defaultValue={r.notes||""} onBlur={(e)=>{ if (e.target.value!==(r.notes||"")) update(r.id,{notes:e.target.value}); }} className={`${inp} h-9 w-44`} placeholder="Add a note…" />
            </td>
          </tr>
        ))}
        {!filtered.length && <tr><td colSpan={8} className="px-4 py-10 text-center text-slate-500">No enquiries yet.</td></tr>}
      </Table>
    </div>
  );
}

// --------------- Tour Bookings ---------------
function ToursView() {
  const [rows, setRows] = useState([]);
  const refresh = () => adminListTours().then(setRows).catch((e)=>toast.error(formatApiError(e)));
  useEffect(()=>{refresh();},[]);
  const update = async (id, patch)=>{ await adminPatchTour(id, patch); toast.success("Updated"); refresh(); };
  return (
    <div>
      <PageHeader title="Tour Bookings" subtitle={`${rows.length} total`} action={
        <Button onClick={()=>exportCSV("tours.csv", rows, ["parent_name","child_name","child_age","program","preferred_date","preferred_slot","phone","email","status","created_at"])}
          className="bg-slate-800 hover:bg-slate-700">Export CSV</Button>
      } />
      <Table headers={["Parent","Child","Age","Program","Date","Slot","Phone","Email","Status","Notes"]}>
        {rows.map((r)=>(
          <tr key={r.id} className="border-t border-slate-800 align-top">
            <td className="px-4 py-3 font-semibold">{r.parent_name}</td>
            <td className="px-4 py-3">{r.child_name}</td>
            <td className="px-4 py-3">{r.child_age}</td>
            <td className="px-4 py-3"><Pill tone="orange">{r.program}</Pill></td>
            <td className="px-4 py-3">{r.preferred_date}</td>
            <td className="px-4 py-3">{r.preferred_slot}</td>
            <td className="px-4 py-3 text-slate-300">{r.phone}</td>
            <td className="px-4 py-3 text-slate-300"><a className="hover:text-orange-300" href={`mailto:${r.email}`}>{r.email}</a></td>
            <td className="px-4 py-3"><StatusSelect value={r.status||"Pending"} options={["Pending","Confirmed","Completed","Cancelled"]} onChange={(v)=>update(r.id,{status:v})} /></td>
            <td className="px-4 py-3"><Input defaultValue={r.notes||""} onBlur={(e)=>{ if(e.target.value!==(r.notes||"")) update(r.id,{notes:e.target.value}); }} className={`${inp} h-9 w-44`} placeholder="Add a note…" /></td>
          </tr>
        ))}
        {!rows.length && <tr><td colSpan={10} className="px-4 py-10 text-center text-slate-500">No tour bookings yet.</td></tr>}
      </Table>
    </div>
  );
}

// --------------- Applications ---------------
function ApplicationsView() {
  const [rows, setRows] = useState([]);
  const refresh = () => adminListApps().then(setRows).catch((e)=>toast.error(formatApiError(e)));
  useEffect(()=>{refresh();},[]);
  const update = async (id, patch)=>{ await adminPatchApp(id, patch); toast.success("Updated"); refresh(); };
  return (
    <div>
      <PageHeader title="Applications" subtitle={`${rows.length} total`} action={
        <Button onClick={()=>exportCSV("applications.csv", rows, ["reference","child_name","child_age","program","parent_name","email","phone","status","created_at"])}
          className="bg-slate-800 hover:bg-slate-700">Export CSV</Button>
      } />
      <Table headers={["Ref","Child","Age","Program","Parent","Email","Phone","Date","Status","Notes"]}>
        {rows.map((r)=>(
          <tr key={r.id} className="border-t border-slate-800 align-top">
            <td className="px-4 py-3 font-mono text-orange-300">{r.reference}</td>
            <td className="px-4 py-3 font-semibold">{r.child_name}</td>
            <td className="px-4 py-3">{r.child_age}</td>
            <td className="px-4 py-3"><Pill tone="orange">{r.program}</Pill></td>
            <td className="px-4 py-3">{r.parent_name}</td>
            <td className="px-4 py-3 text-slate-300">{r.email}</td>
            <td className="px-4 py-3 text-slate-300">{r.phone}</td>
            <td className="px-4 py-3 text-slate-500 text-xs">{r.created_at?.slice(0,10)}</td>
            <td className="px-4 py-3"><StatusSelect value={r.status||"Pending"} options={["Pending","Under Review","Confirmed","Waitlisted","Rejected"]} onChange={(v)=>update(r.id,{status:v})} /></td>
            <td className="px-4 py-3"><Input defaultValue={r.admin_notes||""} onBlur={(e)=>{ if(e.target.value!==(r.admin_notes||"")) update(r.id,{notes:e.target.value}); }} className={`${inp} h-9 w-44`} placeholder="Admin notes…" /></td>
          </tr>
        ))}
        {!rows.length && <tr><td colSpan={10} className="px-4 py-10 text-center text-slate-500">No applications yet.</td></tr>}
      </Table>
    </div>
  );
}

// --------------- Testimonials ---------------
function TestimonialsView() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ parent_name:"", child_info:"", text:"", rating:5, photo_url:"", published:true });
  const refresh = () => adminListTestimonials().then(setRows).catch((e)=>toast.error(formatApiError(e)));
  useEffect(()=>{refresh();},[]);
  const add = async () => {
    if (!form.parent_name || !form.text) return toast.error("Name and text are required");
    try { await adminCreateTestimonial(form); toast.success("Testimonial added"); setForm({ parent_name:"", child_info:"", text:"", rating:5, photo_url:"", published:true }); refresh(); }
    catch (e) { toast.error(formatApiError(e)); }
  };
  const toggle = async (r) => { await adminPatchTestimonial(r.id, { published: !r.published }); refresh(); };
  const remove = async (r) => { if (!window.confirm("Delete this testimonial?")) return; await adminDeleteTestimonial(r.id); refresh(); };
  return (
    <div>
      <PageHeader title="Testimonials" subtitle="These appear on the public homepage when published" />
      <div className={`${card} mb-6`}>
        <p className="text-xs uppercase tracking-widest text-orange-400 font-bold mb-3">Add new testimonial</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <Input className={inp} placeholder="Parent name" value={form.parent_name} onChange={(e)=>setForm({...form, parent_name:e.target.value})} />
          <Input className={inp} placeholder="Child info (e.g. Aarav, age 5, Tiny Tots)" value={form.child_info} onChange={(e)=>setForm({...form, child_info:e.target.value})} />
          <Input className={inp} placeholder="Photo URL (optional)" value={form.photo_url} onChange={(e)=>setForm({...form, photo_url:e.target.value})} />
          <Select value={String(form.rating)} onValueChange={(v)=>setForm({...form, rating:Number(v)})}>
            <SelectTrigger className={inp}><SelectValue placeholder="Rating" /></SelectTrigger>
            <SelectContent>{[1,2,3,4,5].map(n=><SelectItem key={n} value={String(n)}>{n} star{n>1?"s":""}</SelectItem>)}</SelectContent>
          </Select>
          <Textarea className={`${inp} sm:col-span-2 h-24`} placeholder="What did the parent say?" value={form.text} onChange={(e)=>setForm({...form, text:e.target.value})} />
        </div>
        <div className="mt-3 flex items-center gap-3">
          <Checkbox checked={form.published} onCheckedChange={(v)=>setForm({...form, published:v===true})} className="border-slate-600" />
          <span className="text-sm">Publish immediately</span>
          <Button onClick={add} className="ml-auto bg-orange-500 hover:bg-orange-600"><Plus className="h-4 w-4 mr-1" /> Add</Button>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rows.map((r)=>(
          <div key={r.id} className={card}>
            <div className="flex items-start gap-3">
              {r.photo_url ? <img src={r.photo_url} alt={r.parent_name} className="h-12 w-12 rounded-full object-cover" /> : <span className="h-12 w-12 rounded-full bg-orange-500/20 text-orange-300 flex items-center justify-center font-bold">{(r.parent_name||"?").slice(0,1)}</span>}
              <div className="min-w-0">
                <p className="font-semibold truncate">{r.parent_name}</p>
                <p className="text-xs text-slate-400 truncate">{r.child_info}</p>
                <p className="text-xs text-amber-400 mt-0.5">{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-300 line-clamp-5">"{r.text}"</p>
            <div className="mt-4 flex items-center gap-2">
              <Pill tone={r.published ? "emerald" : "slate"}>{r.published ? "Published" : "Hidden"}</Pill>
              <Button onClick={()=>toggle(r)} className="ml-auto bg-slate-800 hover:bg-slate-700 h-8 px-3 text-xs">{r.published ? "Unpublish" : "Publish"}</Button>
              <Button onClick={()=>remove(r)} className="bg-rose-600/30 hover:bg-rose-600 h-8 px-3 text-xs"><Trash2 className="h-3 w-3" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --------------- Videos ---------------
function VideosView() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ title:"", description:"", subject:"General", age_group:"All", video_url:"", thumbnail_url:"", duration:"", is_free:true });
  const refresh = () => adminListVideos().then(setRows).catch((e)=>toast.error(formatApiError(e)));
  useEffect(()=>{refresh();},[]);
  const add = async () => {
    if (!form.title || !form.video_url) return toast.error("Title and video URL are required");
    try { await adminCreateVideo(form); toast.success("Video added"); setForm({ title:"", description:"", subject:"General", age_group:"All", video_url:"", thumbnail_url:"", duration:"", is_free:true }); refresh(); }
    catch (e) { toast.error(formatApiError(e)); }
  };
  const toggle = async (r) => { await adminPatchVideo(r.id, { is_free: !r.is_free }); refresh(); };
  const remove = async (r) => { if (!window.confirm("Delete this video?")) return; await adminDeleteVideo(r.id); refresh(); };
  return (
    <div>
      <PageHeader title="Videos / Content Library" subtitle="Free videos appear on /learn; all videos appear in student LMS" />
      <div className={`${card} mb-6`}>
        <p className="text-xs uppercase tracking-widest text-orange-400 font-bold mb-3">Add new video</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <Input className={inp} placeholder="Title" value={form.title} onChange={(e)=>setForm({...form, title:e.target.value})} />
          <Input className={inp} placeholder="Video URL (YouTube/direct)" value={form.video_url} onChange={(e)=>setForm({...form, video_url:e.target.value})} />
          <Input className={inp} placeholder="Thumbnail URL (optional)" value={form.thumbnail_url} onChange={(e)=>setForm({...form, thumbnail_url:e.target.value})} />
          <Input className={inp} placeholder="Duration (e.g. 12:30)" value={form.duration} onChange={(e)=>setForm({...form, duration:e.target.value})} />
          <Select value={form.subject} onValueChange={(v)=>setForm({...form, subject:v})}>
            <SelectTrigger className={inp}><SelectValue /></SelectTrigger>
            <SelectContent>{["Math","English","Science","Art","General"].map(s=><SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={form.age_group} onValueChange={(v)=>setForm({...form, age_group:v})}>
            <SelectTrigger className={inp}><SelectValue /></SelectTrigger>
            <SelectContent>{["All","2-4","4-6","6-8","8-10"].map(s=><SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
          <Textarea className={`${inp} sm:col-span-2 h-20`} placeholder="Description" value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} />
        </div>
        <div className="mt-3 flex items-center gap-3">
          <Checkbox checked={form.is_free} onCheckedChange={(v)=>setForm({...form, is_free:v===true})} className="border-slate-600" />
          <span className="text-sm">Public (visible on /learn)</span>
          <Button onClick={add} className="ml-auto bg-orange-500 hover:bg-orange-600"><Plus className="h-4 w-4 mr-1" /> Add</Button>
        </div>
      </div>
      <Table headers={["Title","Subject","Age","Duration","URL","Visibility",""]}>
        {rows.map((r)=>(
          <tr key={r.id} className="border-t border-slate-800">
            <td className="px-4 py-3 font-semibold">{r.title}</td>
            <td className="px-4 py-3"><Pill tone="sky">{r.subject}</Pill></td>
            <td className="px-4 py-3">{r.age_group}</td>
            <td className="px-4 py-3">{r.duration || "—"}</td>
            <td className="px-4 py-3 max-w-xs"><a className="text-orange-300 hover:text-orange-200 truncate inline-block max-w-full" target="_blank" rel="noreferrer" href={r.video_url}>{r.video_url}</a></td>
            <td className="px-4 py-3"><Pill tone={r.is_free ? "emerald" : "slate"}>{r.is_free ? "Public" : "Students only"}</Pill></td>
            <td className="px-4 py-3 text-right">
              <Button onClick={()=>toggle(r)} className="bg-slate-800 hover:bg-slate-700 h-8 px-3 text-xs mr-2">{r.is_free?"Make private":"Make public"}</Button>
              <Button onClick={()=>remove(r)} className="bg-rose-600/30 hover:bg-rose-600 h-8 px-3 text-xs"><Trash2 className="h-3 w-3" /></Button>
            </td>
          </tr>
        ))}
        {!rows.length && <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-500">No videos yet.</td></tr>}
      </Table>
    </div>
  );
}

// --------------- Teachers ---------------
function TeachersView() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ name:"", role:"", bio:"", qualifications:"", photo_url:"", joining_date:"", active:true, order:100 });
  const refresh = () => adminListTeachers().then(setRows).catch((e)=>toast.error(formatApiError(e)));
  useEffect(()=>{refresh();},[]);
  const add = async () => {
    if (!form.name || !form.role || !form.bio) return toast.error("Name, role and bio are required");
    try { await adminCreateTeacher(form); toast.success("Teacher added"); setForm({ name:"", role:"", bio:"", qualifications:"", photo_url:"", joining_date:"", active:true, order:100 }); refresh(); }
    catch(e){ toast.error(formatApiError(e)); }
  };
  const toggle = async (r) => { await adminPatchTeacher(r.id, { active: !r.active }); refresh(); };
  const remove = async (r) => { if(!window.confirm("Delete?")) return; await adminDeleteTeacher(r.id); refresh(); };
  return (
    <div>
      <PageHeader title="Teachers / Gurus" subtitle="Active teachers appear on the public About page" />
      <div className={`${card} mb-6`}>
        <p className="text-xs uppercase tracking-widest text-orange-400 font-bold mb-3">Add new teacher</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <Input className={inp} placeholder="Name" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} />
          <Input className={inp} placeholder="Role / Specialization" value={form.role} onChange={(e)=>setForm({...form, role:e.target.value})} />
          <Input className={inp} placeholder="Photo URL" value={form.photo_url} onChange={(e)=>setForm({...form, photo_url:e.target.value})} />
          <Input className={inp} placeholder="Qualifications" value={form.qualifications} onChange={(e)=>setForm({...form, qualifications:e.target.value})} />
          <Input className={inp} placeholder="Joining date" value={form.joining_date} onChange={(e)=>setForm({...form, joining_date:e.target.value})} />
          <Input className={inp} type="number" placeholder="Display order" value={form.order} onChange={(e)=>setForm({...form, order:Number(e.target.value)||100})} />
          <Textarea className={`${inp} sm:col-span-2 h-24`} placeholder="Bio" value={form.bio} onChange={(e)=>setForm({...form, bio:e.target.value})} />
        </div>
        <div className="mt-3 flex items-center gap-3">
          <Checkbox checked={form.active} onCheckedChange={(v)=>setForm({...form, active:v===true})} className="border-slate-600" />
          <span className="text-sm">Active (visible publicly)</span>
          <Button onClick={add} className="ml-auto bg-orange-500 hover:bg-orange-600"><Plus className="h-4 w-4 mr-1" /> Add</Button>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rows.map((r)=>(
          <div key={r.id} className={card}>
            <div className="flex items-start gap-3">
              {r.photo_url ? <img src={r.photo_url} className="h-16 w-16 rounded-2xl object-cover" alt={r.name} /> : <span className="h-16 w-16 rounded-2xl bg-orange-500/20 text-orange-300 flex items-center justify-center font-bold text-lg">{(r.name||"?").slice(0,1)}</span>}
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{r.name}</p>
                <p className="text-xs text-orange-300 font-bold uppercase tracking-widest mt-0.5">{r.role}</p>
                {r.qualifications && <p className="text-xs text-slate-400 mt-1">{r.qualifications}</p>}
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-300 line-clamp-4">{r.bio}</p>
            <div className="mt-4 flex items-center gap-2">
              <Pill tone={r.active ? "emerald" : "slate"}>{r.active ? "Active" : "Hidden"}</Pill>
              <Button onClick={()=>toggle(r)} className="ml-auto bg-slate-800 hover:bg-slate-700 h-8 px-3 text-xs">{r.active ? "Deactivate" : "Activate"}</Button>
              <Button onClick={()=>remove(r)} className="bg-rose-600/30 hover:bg-rose-600 h-8 px-3 text-xs"><Trash2 className="h-3 w-3" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --------------- Students ---------------
function StudentsView() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ name:"", parent_name:"", parent_phone:"", email:"", password:"", program:"Tiny Tots (2–4)", age_group:"2-4", status:"Active", next_billing_date:"" });
  const refresh = () => adminListStudents().then(setRows).catch((e)=>toast.error(formatApiError(e)));
  useEffect(()=>{refresh();},[]);
  const add = async () => {
    if (!form.name || !form.email || !form.password) return toast.error("Name, email and password required");
    try { await adminCreateStudent(form); toast.success("Student created"); setForm({...form, name:"", parent_name:"", parent_phone:"", email:"", password:""}); refresh(); }
    catch(e){ toast.error(formatApiError(e)); }
  };
  const update = async (id, patch) => { await adminPatchStudent(id, patch); toast.success("Updated"); refresh(); };
  const reset = async (r) => {
    const pw = window.prompt(`Set a new password for ${r.name}:`);
    if (pw && pw.length >= 6) { await adminPatchStudent(r.id, { new_password: pw }); toast.success("Password reset"); }
    else if (pw) toast.error("Password must be ≥ 6 chars");
  };
  return (
    <div>
      <PageHeader title="Students" subtitle={`${rows.length} students`} />
      <div className={`${card} mb-6`}>
        <p className="text-xs uppercase tracking-widest text-orange-400 font-bold mb-3">Enrol new student</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Input className={inp} placeholder="Student name" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} />
          <Input className={inp} placeholder="Email (login)" type="email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} />
          <Input className={inp} placeholder="Initial password (≥6)" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})} />
          <Input className={inp} placeholder="Parent name" value={form.parent_name} onChange={(e)=>setForm({...form, parent_name:e.target.value})} />
          <Input className={inp} placeholder="Parent phone" value={form.parent_phone} onChange={(e)=>setForm({...form, parent_phone:e.target.value})} />
          <Select value={form.program} onValueChange={(v)=>setForm({...form, program:v})}>
            <SelectTrigger className={inp}><SelectValue /></SelectTrigger>
            <SelectContent>{["Tiny Tots (2–4)","Early Learners (4–6)","Primary Prep (6–8)","After-School (8–10)"].map(p=><SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={form.age_group} onValueChange={(v)=>setForm({...form, age_group:v})}>
            <SelectTrigger className={inp}><SelectValue /></SelectTrigger>
            <SelectContent>{["2-4","4-6","6-8","8-10"].map(p=><SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
          </Select>
          <Input className={inp} type="date" placeholder="Next billing" value={form.next_billing_date} onChange={(e)=>setForm({...form, next_billing_date:e.target.value})} />
        </div>
        <Button onClick={add} className="mt-3 bg-orange-500 hover:bg-orange-600"><Plus className="h-4 w-4 mr-1" /> Enrol</Button>
      </div>
      <Table headers={["Name","Email","Parent","Program","Age","Billing","Status",""]}>
        {rows.map((r)=>(
          <tr key={r.id} className="border-t border-slate-800">
            <td className="px-4 py-3 font-semibold">{r.name}</td>
            <td className="px-4 py-3 text-slate-300">{r.email}</td>
            <td className="px-4 py-3 text-slate-300">{r.parent_name||"—"}<div className="text-xs text-slate-500">{r.parent_phone||""}</div></td>
            <td className="px-4 py-3"><Pill tone="orange">{r.program}</Pill></td>
            <td className="px-4 py-3">{r.age_group}</td>
            <td className="px-4 py-3 text-slate-300">{r.next_billing_date||"—"}</td>
            <td className="px-4 py-3"><StatusSelect value={r.status||"Active"} options={["Active","Paused","Inactive"]} onChange={(v)=>update(r.id,{status:v})} /></td>
            <td className="px-4 py-3 text-right"><Button onClick={()=>reset(r)} className="bg-slate-800 hover:bg-slate-700 h-8 px-3 text-xs">Reset password</Button></td>
          </tr>
        ))}
        {!rows.length && <tr><td colSpan={8} className="px-4 py-10 text-center text-slate-500">No students yet — enrol your first above.</td></tr>}
      </Table>
    </div>
  );
}

// --------------- Messages ---------------
function MessagesView() {
  const [threads, setThreads] = useState([]);
  const [active, setActive] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const refreshThreads = () => adminThreads().then(setThreads).catch((e)=>toast.error(formatApiError(e)));
  useEffect(()=>{refreshThreads();},[]);
  const open = async (t) => { setActive(t); const m = await adminGetMessages(t.id); setMsgs(m); };
  const send = async () => {
    if (!text.trim() || !active) return;
    await adminSendMessage({ student_id: active.id, text });
    setText("");
    const m = await adminGetMessages(active.id); setMsgs(m);
    refreshThreads();
  };
  return (
    <div>
      <PageHeader title="Messages" subtitle="Chat with enrolled students/parents" />
      <div className="grid lg:grid-cols-3 gap-4 h-[calc(100vh-220px)]">
        <div className="lg:col-span-1 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900">
          {threads.map((t)=>(
            <button key={t.id} onClick={()=>open(t)} className={`w-full text-left px-4 py-3 border-b border-slate-800 hover:bg-slate-800 ${active?.id===t.id?"bg-slate-800":""}`}>
              <div className="flex items-center gap-2">
                <p className="font-semibold truncate flex-1">{t.name}</p>
                {t.unread > 0 && <Pill tone="orange">{t.unread}</Pill>}
              </div>
              <p className="text-xs text-slate-500 truncate">{t.last_message?.text || "No messages yet"}</p>
            </button>
          ))}
          {!threads.length && <p className="px-4 py-6 text-slate-500 text-sm">No students yet.</p>}
        </div>
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900 flex flex-col">
          {active ? (
            <>
              <div className="p-4 border-b border-slate-800"><p className="font-semibold">{active.name}</p><p className="text-xs text-slate-500">{active.email}</p></div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {msgs.map((m)=>(
                  <div key={m.id} className={`max-w-[80%] rounded-2xl px-4 py-2 ${m.from_role==="admin" ? "ml-auto bg-orange-500 text-white" : "bg-slate-800 text-slate-100"}`}>
                    <p className="text-sm">{m.text}</p>
                    <p className="text-[10px] opacity-70 mt-1">{m.created_at?.slice(11,16)} · {m.from_role}</p>
                  </div>
                ))}
                {!msgs.length && <p className="text-center text-slate-500 text-sm py-6">No messages in this thread yet.</p>}
              </div>
              <div className="p-3 border-t border-slate-800 flex gap-2">
                <Input className={inp + " flex-1"} placeholder="Write a reply…" value={text} onChange={(e)=>setText(e.target.value)} onKeyDown={(e)=>e.key==="Enter"&&send()} />
                <Button onClick={send} className="bg-orange-500 hover:bg-orange-600"><Send className="h-4 w-4" /></Button>
              </div>
            </>
          ) : <p className="m-auto text-slate-500">Select a student to chat</p>}
        </div>
      </div>
    </div>
  );
}

// --------------- Tickets ---------------
function TicketsView() {
  const [rows, setRows] = useState([]);
  const refresh = () => adminListTickets().then(setRows).catch((e)=>toast.error(formatApiError(e)));
  useEffect(()=>{refresh();},[]);
  const update = async (id, patch) => { await adminPatchTicket(id, patch); toast.success("Updated"); refresh(); };
  return (
    <div>
      <PageHeader title="Support Tickets" subtitle={`${rows.length} total`} />
      <Table headers={["Student","Type","Description","Status","Response","Date"]}>
        {rows.map((r)=>(
          <tr key={r.id} className="border-t border-slate-800 align-top">
            <td className="px-4 py-3 font-semibold">{r.student_name}<div className="text-xs text-slate-500">{r.student_email}</div></td>
            <td className="px-4 py-3"><Pill tone="sky">{r.type}</Pill></td>
            <td className="px-4 py-3 text-slate-300 max-w-xs"><div className="line-clamp-3">{r.description}</div></td>
            <td className="px-4 py-3"><StatusSelect value={r.status||"Open"} options={["Open","In Progress","Resolved"]} onChange={(v)=>update(r.id,{status:v})} /></td>
            <td className="px-4 py-3"><Textarea defaultValue={r.response||""} onBlur={(e)=>{ if(e.target.value!==(r.response||"")) update(r.id,{response:e.target.value}); }} className={`${inp} h-20 w-56`} placeholder="Response visible to student…" /></td>
            <td className="px-4 py-3 text-slate-500 text-xs">{r.created_at?.slice(0,10)}</td>
          </tr>
        ))}
        {!rows.length && <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">No tickets yet.</td></tr>}
      </Table>
    </div>
  );
}

// --------------- Content / CMS ---------------
function ContentView() {
  const [s, setS] = useState(null);
  useEffect(() => { adminGetSettings().then(setS); }, []);
  if (!s) return <p className="text-slate-400">Loading…</p>;
  const set = (k, v) => setS({...s, [k]: v});
  const save = async () => { await adminPatchSettings(s); toast.success("Site content updated"); };
  const setPrice = (i, k, v) => { const next = [...(s.pricing||[])]; next[i] = {...next[i], [k]: v}; setS({...s, pricing: next}); };
  return (
    <div>
      <PageHeader title="Page Content & Pricing" subtitle="These values render across the public site" action={
        <Button onClick={save} className="bg-orange-500 hover:bg-orange-600"><Save className="h-4 w-4 mr-1" /> Save changes</Button>
      } />
      <div className="grid lg:grid-cols-2 gap-4">
        {[
          ["hero_headline","Hero headline"],
          ["hero_subhead","Hero subheading"],
          ["tagline","Tagline"],
          ["about_story","About story"],
        ].map(([k,label])=>(
          <div key={k} className={card}><Label className={lab}>{label}</Label><Textarea className={`${inp} mt-1 h-24`} value={s[k]||""} onChange={(e)=>set(k,e.target.value)} /></div>
        ))}
        {[
          ["contact_email","Contact email"],
          ["contact_phone","Contact phone"],
          ["whatsapp_number","WhatsApp number"],
          ["business_hours","Business hours"],
          ["address","Address"],
          ["instagram_url","Instagram URL"],
          ["youtube_url","YouTube URL"],
          ["notification_email","Internal notification email"],
        ].map(([k,label])=>(
          <div key={k} className={card}><Label className={lab}>{label}</Label><Input className={`${inp} mt-1`} value={s[k]||""} onChange={(e)=>set(k,e.target.value)} /></div>
        ))}
      </div>

      <h3 className="font-display text-xl font-semibold mt-8 mb-3">Pricing table</h3>
      <Table headers={["Program","Sessions","Weekly","Monthly","Quarterly"]}>
        {(s.pricing||[]).map((p, i)=>(
          <tr key={i} className="border-t border-slate-800">
            <td className="px-3 py-2"><Input className={`${inp} h-9`} value={p.program||""} onChange={(e)=>setPrice(i,"program",e.target.value)} /></td>
            <td className="px-3 py-2"><Input className={`${inp} h-9`} value={p.sessions||""} onChange={(e)=>setPrice(i,"sessions",e.target.value)} /></td>
            <td className="px-3 py-2"><Input className={`${inp} h-9 w-24`} value={p.weekly||""} onChange={(e)=>setPrice(i,"weekly",e.target.value)} /></td>
            <td className="px-3 py-2"><Input className={`${inp} h-9 w-24`} value={p.monthly||""} onChange={(e)=>setPrice(i,"monthly",e.target.value)} /></td>
            <td className="px-3 py-2"><Input className={`${inp} h-9 w-28`} value={p.quarterly||""} onChange={(e)=>setPrice(i,"quarterly",e.target.value)} /></td>
          </tr>
        ))}
      </Table>
    </div>
  );
}

// --------------- Settings ---------------
function SettingsView() {
  const [form, setForm] = useState({ current_password:"", new_password:"" });
  const change = async () => {
    if (form.new_password.length < 8) return toast.error("Min 8 characters");
    try { await adminChangePassword(form); toast.success("Password changed"); setForm({current_password:"", new_password:""}); }
    catch(e){ toast.error(formatApiError(e)); }
  };
  return (
    <div>
      <PageHeader title="Settings" subtitle="Account & security" />
      <div className={card + " max-w-md"}>
        <p className="font-display text-lg font-semibold mb-3">Change admin password</p>
        <Label className={lab}>Current password</Label>
        <Input className={`${inp} mt-1 mb-3`} type="password" value={form.current_password} onChange={(e)=>setForm({...form, current_password:e.target.value})} />
        <Label className={lab}>New password (≥8 chars)</Label>
        <Input className={`${inp} mt-1`} type="password" value={form.new_password} onChange={(e)=>setForm({...form, new_password:e.target.value})} />
        <Button onClick={change} className="mt-4 bg-orange-500 hover:bg-orange-600">Update password</Button>
      </div>
    </div>
  );
}
