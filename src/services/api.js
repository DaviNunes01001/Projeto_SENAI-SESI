const apiBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

export function apiUrl(path) {
  return `${apiBaseUrl}${path}`;
}

export function apiFetch(path, options) {
  return fetch(apiUrl(path), options);
}
