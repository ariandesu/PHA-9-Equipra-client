import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

let cachedToken = null;
let cachedExpiresAt = null;
let tokenPromise = null;

// Fetch the JWT from the Next app's own /api/token route (same-origin),
// never from the Express baseURL. The token route carries the BetterAuth
// session cookie, so a cross-origin fetch to Express would never carry it.
async function getToken() {
  const now = Date.now();

  // Return cached token if still valid (with 60s buffer).
  if (cachedToken && cachedExpiresAt && now < cachedExpiresAt - 60 * 1000) {
    return cachedToken;
  }

  // De-duplicate concurrent refreshes: only one in-flight request at a time.
  if (tokenPromise) {
    return tokenPromise;
  }

  tokenPromise = (async () => {
    try {
      const res = await fetch('/api/token', {
        cache: 'no-store',
        credentials: 'same-origin',
      });

      // 401 means anonymous — not an error, just no token.
      if (res.status === 401) {
        cachedToken = null;
        cachedExpiresAt = null;
        return null;
      }

      if (!res.ok) {
        throw new Error(`Failed to fetch token: ${res.status}`);
      }

      const { token, expiresAt } = await res.json();
      cachedToken = token;
      cachedExpiresAt = new Date(expiresAt).getTime();

      return token;
    } finally {
      tokenPromise = null;
    }
  })();

  return tokenPromise;
}

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Retry once only if the original request carried a token.
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.headers.Authorization
    ) {
      originalRequest._retry = true;

      try {
        cachedToken = null;
        cachedExpiresAt = null;
        tokenPromise = null;
        const token = await getToken();
        if (token) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
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
  tokenPromise = null;
}

export default api;
