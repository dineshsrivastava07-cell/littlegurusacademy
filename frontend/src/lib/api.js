import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API,
  headers: { "Content-Type": "application/json" },
});

export const submitEnquiry = (data) => api.post("/enquiries", data).then((r) => r.data);
export const submitContact = (data) => api.post("/contact", data).then((r) => r.data);
export const subscribeNewsletter = (email) => api.post("/newsletter", { email }).then((r) => r.data);
