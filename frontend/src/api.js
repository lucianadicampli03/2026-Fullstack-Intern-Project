/** Dev: empty → requests go to /api/... (Vite proxy → localhost:3001). Prod: full Render URL. */
export function apiUrl(path) {
  const raw = import.meta.env.VITE_API_URL?.trim() ?? "";
  const base = raw.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  if (base) return `${base}${p}`;
  return `/api${p}`;
}
