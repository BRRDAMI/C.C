// API-backed store. Base catalog (recentlySold/trending/listings) stays in mock.js;
// admin-added items, orders and payment methods come from the backend.
import api from "./api";
import { trending as mockTrending, listings as mockListings } from "./mock";

const TOKEN_KEY = "adurite_token";

export const money = (n) =>
  "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });

// ---------- Items (public) ----------
export const fetchAdminItems = async () => {
  try {
    const { data } = await api.get("/items");
    return data || [];
  } catch {
    return [];
  }
};

export const mergeTrending = (adminItems = []) => [
  ...adminItems.filter((i) => i.trending),
  ...mockTrending,
];
export const mergeListings = (adminItems = []) => [...adminItems, ...mockListings];

export const findItem = async (id) => {
  const admin = await fetchAdminItems();
  const all = [...admin, ...mockTrending, ...mockListings];
  return all.find((i) => String(i.id) === String(id));
};

// ---------- Admin items CRUD (protected) ----------
export const adminGetItems = async () => {
  const { data } = await api.get("/admin/items");
  return data;
};
export const adminCreateItem = async (item) => {
  const { data } = await api.post("/admin/items", item);
  return data;
};
export const adminUpdateItem = async (id, item) => {
  const { data } = await api.put(`/admin/items/${id}`, item);
  return data;
};
export const adminDeleteItem = async (id) => {
  await api.delete(`/admin/items/${id}`);
};

// ---------- Orders ----------
export const createOrder = async (order) => {
  const { data } = await api.post("/orders", order);
  return data;
};
export const getOrders = async () => {
  try {
    const { data } = await api.get("/orders");
    return data || [];
  } catch {
    return [];
  }
};
export const adminGetOrders = async () => {
  const { data } = await api.get("/admin/orders");
  return data;
};
export const adminUpdateOrderStatus = async (id, status) => {
  const { data } = await api.patch(`/admin/orders/${id}`, { status });
  return data;
};

// ---------- Payment methods ----------
export const getPaymentMethods = async () => {
  try {
    const { data } = await api.get("/payment-methods");
    return data || [];
  } catch {
    return [];
  }
};
export const getRates = async () => {
  try {
    const { data } = await api.get("/rates");
    return data || null;
  } catch {
    return null;
  }
};
export const adminGetPaymentMethods = async () => {
  const { data } = await api.get("/admin/payment-methods");
  return data;
};
export const savePaymentMethods = async (methods) => {
  const { data } = await api.put("/admin/payment-methods", { methods });
  return data;
};

// ---------- Auth ----------
export const login = async (username, password) => {
  const { data } = await api.post("/admin/login", { username, password });
  localStorage.setItem(TOKEN_KEY, data.token);
  return data.token;
};
export const logout = () => localStorage.removeItem(TOKEN_KEY);
export const hasToken = () => !!localStorage.getItem(TOKEN_KEY);
export const verifyAdmin = async () => {
  if (!hasToken()) return false;
  try {
    await api.get("/admin/me");
    return true;
  } catch {
    logout();
    return false;
  }
};
