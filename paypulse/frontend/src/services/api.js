const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const getToken = () => localStorage.getItem("payplus_auth_token");

const request = async (path, options = {}) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(BASE_URL + path, { ...options, headers });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Request failed (${response.status})`);
  }
  return response.json();
};

export const api = {
  // Auth
  register: (data) => request("/api/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data) => request("/api/auth/login", { method: "POST", body: JSON.stringify(data) }),
  getProfile: () => request("/api/auth/me"),
  saveOnboarding: (data) => request("/api/auth/onboarding", { method: "POST", body: JSON.stringify(data) }),

  // Dashboard
  getDashboardSummary: () => request("/api/dashboard/summary"),

  // Invoices
  getInvoices: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/api/invoices${query ? `?${query}` : ""}`);
  },
  getInvoiceDetail: (id) => request(`/api/invoices/${id}`),
  createInvoice: (data) => request("/api/invoices", { method: "POST", body: JSON.stringify(data) }),
  updateInvoice: (id, data) => request(`/api/invoices/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteInvoice: (id) => request(`/api/invoices/${id}`, { method: "DELETE" }),
  uploadInvoiceOCR: (file) => {
    const token = getToken();
    const formData = new FormData();
    formData.append("file", file);
    return fetch(BASE_URL + "/api/invoices/upload", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    }).then((res) => {
      if (!res.ok) throw new Error("OCR extraction failed");
      return res.json();
    });
  },

  // Customers
  getCustomers: (search = "") => request(`/api/customers${search ? `?search=${encodeURIComponent(search)}` : ""}`),
  createCustomer: (data) => request("/api/customers", { method: "POST", body: JSON.stringify(data) }),
  getCustomerProfile: (id) => request(`/api/customers/${id}`),

  // Payments
  getPayments: () => request("/api/payments"),
  recordPayment: (data) => request("/api/payments", { method: "POST", body: JSON.stringify(data) }),
  getOverduePayments: () => request("/api/payments/overdue"),

  // Reminders
  getReminders: () => request("/api/reminders"),
  generateReminder: (data) => request("/api/reminders/generate", { method: "POST", body: JSON.stringify(data) }),
  sendReminder: (data) => request("/api/reminders/send", { method: "POST", body: JSON.stringify(data) }),

  // AI
  aiChat: (message, language = "en") => request("/api/ai/chat", { method: "POST", body: JSON.stringify({ message, language }) }),

  // Cash Flow
  getCashFlowForecast: (days = 30) => request(`/api/cashflow/forecast?days=${days}`),

  // Instant Cash / Financing
  getFinancingOffers: () => request("/api/financing/offers"),
  applyFinancing: (data) => request("/api/financing/apply", { method: "POST", body: JSON.stringify(data) }),

  // Loan Readiness
  getLoanReadinessScore: () => request("/api/loan-readiness/score"),
  getLenderReport: () => request("/api/loan-readiness/report"),

  // Reports
  getReportsSummary: () => request("/api/reports/summary"),

  // Notifications
  getNotifications: () => request("/api/notifications"),
  markNotificationRead: (id) => request(`/api/notifications/${id}/read`, { method: "PUT" }),
  markAllNotificationsRead: () => request("/api/notifications/read-all", { method: "POST" }),

  // Settings
  getSettings: () => request("/api/settings"),
  updateSettings: (data) => request("/api/settings", { method: "PUT", body: JSON.stringify(data) }),
};
