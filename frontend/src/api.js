import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
});

// AUTH
export const register = (email, password) =>
  API.post("/api/auth/register", { email, password });
export const login = (email, password) =>
  API.post("/api/auth/login", { email, password });

// LINKS
export const createLink = (token, payload) =>
  API.post("/api/links", payload, { headers: { Authorization: `Bearer ${token}` } });

export const createLinkPublic = (payload) =>
  API.post("/api/links", payload);

export const getLinks = (token) =>
  API.get("/api/links", { headers: token ? { Authorization: `Bearer ${token}` } : {} });

export const getClicks = (token, id) =>
  API.get(`/api/links/${id}/clicks`, { headers: { Authorization: `Bearer ${token}` } });