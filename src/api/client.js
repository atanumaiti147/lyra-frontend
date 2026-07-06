const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

let cachedCsrfToken = null;

async function request(path, { method = 'GET', body, needsCsrf = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (needsCsrf && cachedCsrfToken) headers['x-csrf-token'] = cachedCsrfToken;

  const res = await fetch(`${BACKEND_URL}${path}`, {
    method,
    headers,
    credentials: 'include', // required so the session cookie is sent cross-domain
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    // no JSON body
  }

  if (data && data.csrfToken) cachedCsrfToken = data.csrfToken;

  if (!res.ok) {
    const error = new Error((data && data.error) || `Request failed (${res.status})`);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

export const api = {
  backendUrl: BACKEND_URL,
  me: () => request('/api/me'),
  commands: () => request('/api/commands'),
  siteConfig: () => request('/api/config'),
  content: (key) => request(`/api/content/${key}`),

  myTickets: () => request('/api/tickets/mine'),
  createTicket: (payload) => request('/api/tickets', { method: 'POST', body: payload, needsCsrf: true }),
  getTicket: (id) => request(`/api/tickets/${id}`),
  closeTicket: (id) => request(`/api/tickets/${id}/close`, { method: 'POST', needsCsrf: true }),
  dashboardTickets: () => request('/api/dashboard/tickets'),

  adminStatus: () => request('/api/admin/status'),
  adminVerifyTotp: (code) => request('/api/admin/totp/verify', { method: 'POST', body: { code }, needsCsrf: true }),
  adminUsers: () => request('/api/admin/users'),
  adminContent: () => request('/api/admin/content'),
  adminSetRole: (id, role) => request(`/api/admin/users/${id}/role`, { method: 'POST', body: { role }, needsCsrf: true }),
  adminSetPermissions: (id, permissions) =>
    request(`/api/admin/users/${id}/permissions`, { method: 'POST', body: { permissions }, needsCsrf: true }),
  adminResetTotp: (id) => request(`/api/admin/users/${id}/reset-totp`, { method: 'POST', needsCsrf: true }),
  adminSaveContent: (key, payload) => request(`/api/admin/content/${key}`, { method: 'POST', body: payload, needsCsrf: true }),
  adminSettings: () => request('/api/admin/settings'),
  adminSaveSettings: (payload) => request('/api/admin/settings', { method: 'POST', body: payload, needsCsrf: true }),

  loginUrl: (returnTo = '/') => `${BACKEND_URL}/auth/discord?returnTo=${encodeURIComponent(returnTo)}`,
  logoutUrl: () => `${BACKEND_URL}/auth/logout`,
};
