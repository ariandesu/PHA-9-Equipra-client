import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

let cachedToken = null;
let cachedExpiresAt = null;

async function getToken() {
  const now = Date.now();

  // Refresh when missing or under 60 seconds to expiry.
  if (cachedToken && cachedExpiresAt && now < cachedExpiresAt - 60 * 1000) {
    return cachedToken;
  }

  const res = await fetch(`${api.defaults.baseURL}/api/auth/token`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch token');
  }

  const { token, expiresAt } = await res.json();
  cachedToken = token;
  cachedExpiresAt = new Date(expiresAt).getTime();

  return token;
}

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Force a fresh token on 401, then retry once.
        cachedToken = null;
        cachedExpiresAt = null;
        const token = await getToken();
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export function clearTokenCache() {
  cachedToken = null;
  cachedExpiresAt = null;
}

export default api;
