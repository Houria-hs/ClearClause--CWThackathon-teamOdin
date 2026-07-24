const rawApiUrl = import.meta.env.VITE_API_URL;

if (!rawApiUrl) {
  throw new Error("VITE_API_URL must be configured.");
}

export const API_URL = rawApiUrl.replace(/\/+$/, "");
