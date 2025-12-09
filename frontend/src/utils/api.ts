const rawBase = import.meta.env.VITE_API_URL || "";
// normalize: strip trailing slash
const normalizedBase = rawBase.endsWith("/") ? rawBase.slice(0, -1) : rawBase;

// Default to localhost backend if not provided
export const API_BASE_URL = normalizedBase || "http://localhost:8000";

export const apiUrl = (path: string) =>
  path.startsWith("/") ? `${API_BASE_URL}${path}` : `${API_BASE_URL}/${path}`;
