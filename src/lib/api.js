import { notifyStoreChange } from "./storage";

const API_BASE = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "");

class ApiError extends Error {
  constructor(status, code, payload) {
    super(code || `http_${status}`);
    this.status = status;
    this.code = code;
    this.payload = payload;
  }
}

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = { ...(options.headers || {}) };
  let body = options.body;
  if (body !== undefined && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(body);
  }
  const res = await fetch(url, {
    ...options,
    headers,
    body,
    credentials: "include",
  });
  let data = null;
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  }
  if (!res.ok) {
    throw new ApiError(res.status, data?.error, data);
  }
  return data;
}

function ensureArray(data) {
  return Array.isArray(data) ? data : [];
}

function ensureObject(data) {
  return data && typeof data === "object" && !Array.isArray(data) ? data : {};
}

export async function getAuthStatus() {
  return request("/api/auth/status");
}

export async function coupleLoginApi(password) {
  return request("/api/auth/login", { method: "POST", body: { password } });
}

export async function coupleLogoutApi() {
  return request("/api/auth/logout", { method: "POST" });
}

export async function getRsvps() {
  return ensureArray(await request("/api/rsvps"));
}

export function normalizePhone(telephone) {
  return String(telephone || "").replace(/\D/g, "");
}

export async function getRsvpPolicy() {
  return request("/api/rsvp/policy");
}

export async function findRsvpByPhone(telephone) {
  try {
    return await request(`/api/rsvp/by-phone/${encodeURIComponent(telephone)}`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

export async function createRsvp(payload, { update = false } = {}) {
  const entry = await request("/api/rsvp", { method: "POST", body: { ...payload, update } });
  notifyStoreChange("rsvps");
  return entry;
}

export async function getGuestbook() {
  return ensureArray(await request("/api/guestbook"));
}

export async function createGuestbook(entry) {
  const row = await request("/api/guestbook", { method: "POST", body: entry });
  notifyStoreChange("guestbook");
  return row;
}

export async function getPhotos() {
  return ensureObject(await request("/api/photos"));
}

export async function uploadPhoto(slot, file) {
  const path = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const result = await request(`/api/photos/${encodeURIComponent(slot)}`, {
    method: "PUT",
    body: { path },
  });
  notifyStoreChange("photos");
  return result;
}

export async function getSettings() {
  return ensureObject(await request("/api/settings"));
}

export async function saveSettings(payload) {
  const saved = await request("/api/settings", { method: "PUT", body: payload });
  notifyStoreChange("settings");
  return saved;
}

export { ApiError };
