import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

const ADMIN_KEY = "lga_admin_token";
const STUDENT_KEY = "lga_student_token";

function authHeaders(key) {
  const t = (() => {
    try { return localStorage.getItem(key); } catch { return null; }
  })();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export const api = axios.create({ baseURL: API, headers: { "Content-Type": "application/json" } });

// ---- Public ----
export const submitEnquiry = (data) => api.post("/enquiries", data).then((r) => r.data);
export const submitContact = (data) => api.post("/contact", data).then((r) => r.data);
export const subscribeNewsletter = (email) => api.post("/newsletter", { email }).then((r) => r.data);
export const submitTourBooking = (data) => api.post("/tour-bookings", data).then((r) => r.data);
export const submitApplication = (data) => api.post("/applications", data).then((r) => r.data);
export const checkApplicationStatus = (params) => api.get("/application-status", { params }).then((r) => r.data);
export const getSiteSettings = () => api.get("/site-settings").then((r) => r.data);
export const getPublicTestimonials = () => api.get("/testimonials", { params: { published: true } }).then((r) => r.data);
export const getPublicTeachers = () => api.get("/teachers", { params: { active: true } }).then((r) => r.data);
export const getPublicVideos = () => api.get("/videos", { params: { free: true } }).then((r) => r.data);

// ---- Admin ----
export const adminLogin = (data) => api.post("/admin/login", data).then((r) => r.data);
export const adminToken = () => { try { return localStorage.getItem(ADMIN_KEY); } catch { return null; } };
export const setAdminToken = (t) => { try { t ? localStorage.setItem(ADMIN_KEY, t) : localStorage.removeItem(ADMIN_KEY); } catch {} };
const A = () => ({ headers: authHeaders(ADMIN_KEY) });

export const adminStats = () => api.get("/admin/stats", A()).then((r) => r.data);
export const adminListEnquiries = () => api.get("/enquiries", A()).then((r) => r.data);
export const adminPatchEnquiry = (id, data) => api.patch(`/enquiries/${id}`, data, A()).then((r) => r.data);
export const adminListTours = () => api.get("/tour-bookings", A()).then((r) => r.data);
export const adminPatchTour = (id, data) => api.patch(`/tour-bookings/${id}`, data, A()).then((r) => r.data);
export const adminListApps = () => api.get("/applications", A()).then((r) => r.data);
export const adminPatchApp = (id, data) => api.patch(`/applications/${id}`, data, A()).then((r) => r.data);

export const adminListTestimonials = () => api.get("/testimonials", A()).then((r) => r.data);
export const adminCreateTestimonial = (data) => api.post("/testimonials", data, A()).then((r) => r.data);
export const adminPatchTestimonial = (id, data) => api.patch(`/testimonials/${id}`, data, A()).then((r) => r.data);
export const adminDeleteTestimonial = (id) => api.delete(`/testimonials/${id}`, A()).then((r) => r.data);

export const adminListVideos = () => api.get("/videos", A()).then((r) => r.data);
export const adminCreateVideo = (data) => api.post("/videos", data, A()).then((r) => r.data);
export const adminPatchVideo = (id, data) => api.patch(`/videos/${id}`, data, A()).then((r) => r.data);
export const adminDeleteVideo = (id) => api.delete(`/videos/${id}`, A()).then((r) => r.data);

export const adminListTeachers = () => api.get("/teachers", A()).then((r) => r.data);
export const adminCreateTeacher = (data) => api.post("/teachers", data, A()).then((r) => r.data);
export const adminPatchTeacher = (id, data) => api.patch(`/teachers/${id}`, data, A()).then((r) => r.data);
export const adminDeleteTeacher = (id) => api.delete(`/teachers/${id}`, A()).then((r) => r.data);

export const adminListStudents = () => api.get("/students", A()).then((r) => r.data);
export const adminCreateStudent = (data) => api.post("/students", data, A()).then((r) => r.data);
export const adminPatchStudent = (id, data) => api.patch(`/students/${id}`, data, A()).then((r) => r.data);

export const adminListTickets = () => api.get("/tickets", A()).then((r) => r.data);
export const adminPatchTicket = (id, data) => api.patch(`/tickets/${id}`, data, A()).then((r) => r.data);

export const adminGetSettings = () => api.get("/site-settings").then((r) => r.data);
export const adminPatchSettings = (data) => api.patch("/site-settings", data, A()).then((r) => r.data);
export const adminChangePassword = (data) => api.post("/admin/change-password", data, A()).then((r) => r.data);

export const adminThreads = () => api.get("/messages/admin/threads", A()).then((r) => r.data);
export const adminGetMessages = (student_id) => api.get("/messages/admin", { ...A(), params: { student_id } }).then((r) => r.data);
export const adminSendMessage = (data) => api.post("/messages/admin", data, A()).then((r) => r.data);

// ---- Student ----
export const studentLogin = (data) => api.post("/student/login", data).then((r) => r.data);
export const studentToken = () => { try { return localStorage.getItem(STUDENT_KEY); } catch { return null; } };
export const setStudentToken = (t) => { try { t ? localStorage.setItem(STUDENT_KEY, t) : localStorage.removeItem(STUDENT_KEY); } catch {} };
const S = () => ({ headers: authHeaders(STUDENT_KEY) });

export const studentMe = () => api.get("/student/me", S()).then((r) => r.data);
export const studentVideos = (age_group) => api.get("/videos", { params: age_group ? { age_group } : {} }).then((r) => r.data);
export const studentGetMessages = () => api.get("/messages/student", S()).then((r) => r.data);
export const studentSendMessage = (text) => api.post("/messages/student", { text }, S()).then((r) => r.data);
export const studentCreateTicket = (data) => api.post("/tickets", data, S()).then((r) => r.data);
export const studentMyTickets = () => api.get("/tickets/my", S()).then((r) => r.data);

export function formatApiError(err) {
  const d = err?.response?.data?.detail;
  if (!d) return err?.message || "Something went wrong";
  if (typeof d === "string") return d;
  if (Array.isArray(d)) return d.map((x) => x?.msg || JSON.stringify(x)).join(" · ");
  return JSON.stringify(d);
}
