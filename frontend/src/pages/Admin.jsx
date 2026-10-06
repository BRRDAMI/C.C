import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut, Plus, Trash2, Package, ShoppingBag, CreditCard, Pencil, X, Loader2,
} from "lucide-react";
import {
  login, logout, verifyAdmin, money,
  adminGetItems, adminCreateItem, adminUpdateItem, adminDeleteItem,
  adminGetOrders, adminUpdateOrderStatus,
  adminGetPaymentMethods, savePaymentMethods,
} from "../data/store";
import { categories } from "../data/mock";

const emptyItem = { name: "", category: "hat", rap: "", price: "", image: "", trending: true };

const Admin = () => {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState("items");

  useEffect(() => {
    verifyAdmin().then((ok) => { setAuthed(ok); setChecking(false); });
  }, []);

  const doLogin = async (e) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      await login(user, pass);
      setAuthed(true);
    } catch {
      setErr("Invalid username or password.");
    } finally {
      setBusy(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-gray-400">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <form onSubmit={doLogin} className="w-full max-w-sm rounded-2xl border border-border bg-[#101014] p-8">
          <div className="font-display font-extrabold text-2xl text-white lowercase mb-1">adurite <span className="text-primary">admin</span></div>
          <p className="text-sm text-gray-400 mb-6">Sign in to manage the marketplace.</p>
          <input value={user} onChange={(e) => setUser(e.target.value)} placeholder="Username" className="w-full bg-[#0b0b0e] border border-border rounded-lg px-4 h-12 text-sm text-white mb-3 focus:border-primary outline-none" />
          <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="Password" className="w-full bg-[#0b0b0e] border border-border rounded-lg px-4 h-12 text-sm text-white mb-4 focus:border-primary outline-none" />
          {err && <div className="text-xs text-primary mb-3">{err}</div>}
          <button disabled={busy} className="w-full bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-semibold rounded-lg h-12">{busy ? "Signing in…" : "Log In"}</button>
          <button type="button" onClick={() => navigate("/")} className="w-full text-xs text-gray-500 mt-4 hover:text-gray-300">← Back to site</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-[#0b0b0e]">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="font-display font-extrabold text-xl text-white lowercase">adurite <span className="text-primary">admin</span></div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className="text-sm text-gray-300 hover:text-white">View Site</button>
            <button onClick={() => { logout(); setAuthed(false); }} className="flex items-center gap-2 text-sm text-gray-300 hover:text-primary"><LogOut size={16} /> Logout</button>
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-8">
        <div className="flex gap-2 mb-8">
          {[
            { id: "items", label: "Items", icon: Package },
            { id: "orders", label: "Orders", icon: ShoppingBag },
            { id: "payments", label: "Payment Methods", icon: CreditCard },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 rounded-lg px-4 h-11 text-sm font-medium border transition-colors ${tab === t.id ? "bg-primary border-primary text-white" : "bg-[#101014] border-border text-gray-300 hover:border-primary/40"}`}>
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>

        {tab === "items" && <ItemsManager />}
        {tab === "orders" && <OrdersManager />}
        {tab === "payments" && <PaymentsManager />}
      </div>
    </div>
  );
};

const ItemsManager = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyItem);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);

  const refresh = () => adminGetItems().then(setItems).catch(() => {});
  useEffect(() => { refresh(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || form.price === "") return;
    setBusy(true);
    const payload = { ...form, price: parseFloat(form.price) };
    try {
      if (editing) await adminUpdateItem(editing, payload);
      else await adminCreateItem(payload);
      setForm(emptyItem); setEditing(null); await refresh();
    } finally { setBusy(false); }
  };
  const edit = (it) => { setForm({ ...it, price: String(it.price) }); setEditing(it.id); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const remove = async (id) => { await adminDeleteItem(id); refresh(); };

  return (
    <div className="grid lg:grid-cols-[360px_1fr] gap-8">
      <form onSubmit={submit} className="rounded-xl border border-border bg-[#101014] p-5 h-fit">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">{editing ? "Edit Item" : "Add New Item"}</h3>
          {editing && <button type="button" onClick={() => { setForm(emptyItem); setEditing(null); }} className="text-gray-400 hover:text-white"><X size={16} /></button>}
        </div>
        <Field label="Name"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="adm-input" placeholder="Item name" /></Field>
        <Field label="Category">
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="adm-input">
            {categories.filter((c) => c.id !== "all").map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Price (USD)"><input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="adm-input" placeholder="0.00" /></Field>
          <Field label="RAP"><input value={form.rap} onChange={(e) => setForm({ ...form, rap: e.target.value })} className="adm-input" placeholder="e.g. 120K" /></Field>
        </div>
        <Field label="Image URL"><input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="adm-input" placeholder="https://..." /></Field>
        <div className="mb-3">
          <label className="block text-xs text-gray-400 mb-1.5">Or upload image</label>
          <input type="file" accept="image/*" onChange={(e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            const reader = new FileReader();
            reader.onload = () => setForm((p) => ({ ...p, image: reader.result }));
            reader.readAsDataURL(f);
          }} className="block w-full text-xs text-gray-400 file:mr-3 file:rounded-md file:border-0 file:bg-primary file:text-white file:px-3 file:py-2 file:text-xs file:font-semibold" />
        </div>
        {form.image && <img src={form.image} alt="preview" className="w-20 h-20 object-contain mb-3 rounded-lg border border-border bg-[#0b0b0e]" onError={(e) => { e.target.style.opacity = 0.25; }} />}
        <label className="flex items-center gap-2 text-sm text-gray-300 mb-4">
          <input type="checkbox" checked={form.trending} onChange={(e) => setForm({ ...form, trending: e.target.checked })} className="accent-[#e6333f]" /> Show in Trending
        </label>
        <button disabled={busy} className="w-full bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-semibold rounded-lg h-11 flex items-center justify-center gap-2">
          <Plus size={16} /> {busy ? "Saving…" : editing ? "Save Changes" : "Add Item"}
        </button>
      </form>

      <div>
        <h3 className="font-semibold text-white mb-4">Your Items ({items.length})</h3>
        {items.length === 0 ? (
          <div className="text-gray-500 text-sm rounded-xl border border-dashed border-border p-10 text-center">No items yet. Add one on the left — it appears on the homepage instantly.</div>
        ) : (
          <div className="space-y-3">
            {items.map((it) => (
              <div key={it.id} className="flex items-center gap-4 rounded-xl border border-border bg-[#101014] p-3">
                <img src={it.image} alt={it.name} className="w-14 h-14 object-contain rounded-lg bg-[#0b0b0e]" onError={(e) => { e.target.style.opacity = 0.25; }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{it.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{it.category} · RAP {it.rap || "—"} {it.trending && <span className="text-primary">· Trending</span>}</div>
                </div>
                <div className="text-primary font-bold">{money(it.price)}</div>
                <button onClick={() => edit(it)} className="text-gray-400 hover:text-white p-2"><Pencil size={16} /></button>
                <button onClick={() => remove(it.id)} className="text-gray-400 hover:text-primary p-2"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const STATUSES = ["pending", "completed", "cancelled"];

const OrdersManager = () => {
  const [orders, setOrders] = useState([]);
  const refresh = () => adminGetOrders().then(setOrders).catch(() => {});
  useEffect(() => { refresh(); }, []);

  const setStatus = async (id, status) => {
    await adminUpdateOrderStatus(id, status);
    refresh();
  };

  return (
    <div>
      <h3 className="font-semibold text-white mb-4">Orders ({orders.length})</h3>
      {orders.length === 0 ? (
        <div className="text-gray-500 text-sm rounded-xl border border-dashed border-border p-10 text-center">No orders yet.</div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="rounded-xl border border-border bg-[#101014] p-4">
              <div className="flex items-center gap-4">
                <img src={o.item_image} alt={o.item_name} className="w-12 h-12 object-contain rounded-lg bg-[#0b0b0e]" onError={(e) => { e.target.style.opacity = 0.25; }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{o.item_name}</div>
                  <div className="text-xs text-gray-500">{o.id} · {new Date(o.created_at).toLocaleString()}</div>
                </div>
                <select value={o.status} onChange={(e) => setStatus(o.id, e.target.value)} className="adm-input !w-auto !h-9 capitalize">
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <Info k="Roblox" v={o.roblox_username} />
                <Info k="Payment" v={o.payment_method} />
                <Info k="Send To" v={o.payment_detail} />
                <Info k="Total" v={o.crypto_amount ? `${money(o.total)} · ${o.crypto_amount} ${o.crypto_coin}` : money(o.total)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const readFile = (f) => new Promise((res) => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(f); });

const PaymentsManager = () => {
  const [methods, setMethods] = useState([]);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => { adminGetPaymentMethods().then(setMethods).catch(() => {}); }, []);

  const update = (id, patch) => setMethods((ms) => ms.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  const save = async () => {
    setBusy(true);
    try { await savePaymentMethods(methods); setSaved(true); setTimeout(() => setSaved(false), 1500); }
    finally { setBusy(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white">Receiving Accounts</h3>
        <button data-testid="payments-save-button" onClick={save} disabled={busy} className="text-sm bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-semibold rounded-lg px-5 h-10">{saved ? "Saved ✓" : busy ? "Saving…" : "Save"}</button>
      </div>
      <p className="text-xs text-gray-400 mb-4">Buyers see these at step 5 of checkout. Paste each wallet address and upload the matching QR code image from your wallet app. Toggle a method off to hide it from buyers.</p>
      <div className="grid md:grid-cols-2 gap-4">
        {methods.map((m) => <PaymentCard key={m.id} m={m} update={update} />)}
      </div>
    </div>
  );
};

const PaymentCard = ({ m, update }) => {
  const isCrypto = m.type === "crypto";
  return (
    <div data-testid={`payment-card-${m.id}`} className={`rounded-xl border bg-[#101014] p-4 ${m.enabled ? "border-border" : "border-border/50 opacity-70"}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold text-white">{m.label}{m.coin ? ` (${m.coin})` : ""}</div>
        <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
          <input data-testid={`payment-enabled-${m.id}`} type="checkbox" checked={m.enabled} onChange={(e) => update(m.id, { enabled: e.target.checked })} className="accent-[#e6333f] w-4 h-4" /> Enabled
        </label>
      </div>
      <Field label={isCrypto ? `${m.coin} wallet address` : "PayPal email"}>
        <input data-testid={`payment-detail-${m.id}`} value={m.detail} onChange={(e) => update(m.id, { detail: e.target.value })} className="adm-input font-mono" placeholder={isCrypto ? "Paste your address" : "you@example.com"} />
      </Field>
      {isCrypto && (
        <div className="flex items-start gap-3">
          <div data-testid={`payment-qr-preview-${m.id}`} className="w-24 h-24 shrink-0 rounded-lg bg-white flex items-center justify-center overflow-hidden">
            {m.qr_image ? <img src={m.qr_image} alt="QR" className="w-full h-full object-contain" /> : <span className="text-[10px] text-gray-500 text-center px-2">No QR uploaded</span>}
          </div>
          <div className="flex-1 min-w-0">
            <label className="block text-xs text-gray-400 mb-1.5">QR code image</label>
            <input
              data-testid={`payment-qr-upload-${m.id}`}
              type="file"
              accept="image/*"
              onChange={async (e) => { const f = e.target.files?.[0]; if (f) update(m.id, { qr_image: await readFile(f) }); e.target.value = ""; }}
              className="block w-full text-xs text-gray-400 file:mr-3 file:rounded-md file:border-0 file:bg-primary file:text-white file:px-3 file:py-2 file:text-xs file:font-semibold"
            />
            {m.qr_image && (
              <button data-testid={`payment-qr-remove-${m.id}`} type="button" onClick={() => update(m.id, { qr_image: "" })} className="mt-2 text-xs text-gray-400 hover:text-primary">Remove QR</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Field = ({ label, children }) => (
  <div className="mb-3">
    <label className="block text-xs text-gray-400 mb-1.5">{label}</label>
    {children}
  </div>
);
const Info = ({ k, v }) => (
  <div className="rounded-lg bg-[#0b0b0e] border border-border p-2.5">
    <div className="text-gray-500">{k}</div>
    <div className="text-white break-all mt-0.5">{v}</div>
  </div>
);

export default Admin;
