// API-backed store. The whole catalog, orders and payment methods live in the backend.
import api from "./api";

const TOKEN_KEY = "adurite_token";

export const money = (n) =>
  "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });

// ---------- Items (public) ----------
export const fetchItems = async () => {
  try {
    const { data } = await api.get("/items");
    return data || [];
  } catch {
    return [];
  }
};

// PayPal listings can carry their own price; crypto/balance uses the base price.
export const priceFor = (item, group) =>
  group === "paypal" && item?.price_paypal != null && item.price_paypal !== ""
    ? Number(item.price_paypal)
    : Number(item?.price || 0);

export const findItem = async (id) => {
  const all = await fetchItems();
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
export const ORDER_STATUSES = [
  { id: "awaiting_payment", label: "Awaiting payment" },
  { id: "confirmed", label: "Confirmed" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
];
export const statusLabel = (id) => ORDER_STATUSES.find((s) => s.id === id)?.label || id;

export const getOrder = async (id) => {
  try {
    const { data } = await api.get(`/orders/${id}`);
    return data;
  } catch {
    return null;
  }
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
