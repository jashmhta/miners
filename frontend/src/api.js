import axios from "axios";

const BASE_URL = process.env.REACT_APP_BACKEND_URL;
if (!BASE_URL) {
  // eslint-disable-next-line no-console
  console.warn("REACT_APP_BACKEND_URL not set. API calls will fail.");
}

export const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getMe() {
  const { data } = await api.get("/auth/me");
  return data;
}

export async function register(username, password) {
  const { data } = await api.post("/auth/register", { username, password });
  return data;
}

export async function login(username, password) {
  const { data } = await api.post("/auth/login", { username, password });
  return data;
}

export async function logout() {
  await api.post("/auth/logout");
}

export async function fetchUsers() {
  const { data } = await api.get("/admin/users");
  return data;
}

export async function fetchLogs(params = {}) {
  const { data } = await api.get("/admin/logs", { params });
  return data;
}

export async function fetchStats() {
  const { data } = await api.get("/admin/stats");
  return data;
}

export async function createLog(payload) {
  const { data } = await api.post("/logs", payload);
  return data;
}