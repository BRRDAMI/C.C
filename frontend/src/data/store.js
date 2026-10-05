// Lightweight client store for the mock phase (localStorage-backed).
// This will be swapped for backend API calls during backend integration.
import { trending, listings, defaultPaymentMethods } from "./mock";

const ITEMS_KEY = "adurite_admin_items";
const ORDERS_KEY = "adurite_orders";
const PAY_KEY = "adurite_payment_methods";

const read = (k, fallback) => {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));

// Admin-added items
export const getAdminItems = () => read(ITEMS_KEY, []);
export const saveAdminItem = (item) => {
  const items = getAdminItems();
  if (item.id && items.find((i) => i.id === item.id)) {
    const next = items.map((i) => (i.id === item.id ? { ...i, ...item } : i));
    write(ITEMS_KEY, next);
    return item;
  }
  const newItem = { ...item, id: item.id || `adm_${Date.now()}`, admin: true };
  write(ITEMS_KEY, [newItem, ...items]);
  return newItem;
};
export const deleteAdminItem = (id) => {
  write(ITEMS_KEY, getAdminItems().filter((i) => i.id !== id));
};

// Combined lists for the storefront
export const getTrending = () => {
  const adminTrending = getAdminItems().filter((i) => i.trending);
  return [...adminTrending, ...trending];
};
export const getListings = () => {
  return [...getAdminItems(), ...listings];
};
export const getAllItems = () => {
  const admin = getAdminItems();
  const base = [...trending, ...listings];
  const seen = new Set(admin.map((i) => i.id));
  return [...admin, ...base.filter((i) => !seen.has(i.id))];
};
export const findItem = (id) => getAllItems().find((i) => String(i.id) === String(id));

// Orders
export const getOrders = () => read(ORDERS_KEY, []);
export const createOrder = (order) => {
  const orders = getOrders();
  const newOrder = {
    ...order,
    id: `ord_${Date.now()}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  write(ORDERS_KEY, [newOrder, ...orders]);
  return newOrder;
};

// Payment methods
export const getPaymentMethods = () => read(PAY_KEY, defaultPaymentMethods);
export const savePaymentMethods = (methods) => write(PAY_KEY, methods);

// Admin auth (mock only; backend replaces this)
export const isAdminAuthed = () => read("adurite_admin_auth", false);
export const setAdminAuthed = (v) => write("adurite_admin_auth", v);

export const money = (n) =>
  "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
