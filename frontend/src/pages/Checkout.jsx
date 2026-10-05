import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Copy, Check, CheckCircle2, Wallet, Mail } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getPaymentMethods, createOrder } from "../data/store";
import { useCurrency } from "../context/CurrencyContext";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state?.item;
  const methods = getPaymentMethods();
  const { format } = useCurrency();

  const [robloxUsername, setRobloxUsername] = useState("");
  const [selected, setSelected] = useState(methods[0]?.id || "");
  const [copied, setCopied] = useState(false);
  const [done, setDone] = useState(null);
  const [error, setError] = useState("");

  if (!item && !done) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-[1400px] mx-auto px-4 py-24 text-center">
          <p className="text-gray-400 mb-3">No item selected for checkout.</p>
          <Link to="/" className="text-primary hover:underline">Browse the marketplace</Link>
        </div>
      </div>
    );
  }

  const method = methods.find((m) => m.id === selected);

  const copy = () => {
    navigator.clipboard?.writeText(method.detail);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const confirm = () => {
    if (!robloxUsername.trim()) { setError("Please enter your Roblox username."); return; }
    setError("");
    const order = createOrder({
      itemId: item.id,
      itemName: item.name,
      itemImage: item.image,
      total: item.price,
      robloxUsername: robloxUsername.trim(),
      paymentMethod: method.label,
      paymentDetail: method.detail,
    });
    setDone(order);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-[560px] mx-auto px-4 py-20 text-center">
          <CheckCircle2 size={64} className="text-[#00b67a] mx-auto mb-5" />
          <h1 className="font-display font-bold text-2xl text-white">Order Placed!</h1>
          <p className="text-gray-400 mt-2">Order <span className="text-white font-mono">{done.id}</span> is pending payment confirmation.</p>
          <div className="mt-6 text-left rounded-xl border border-border bg-[#101014] p-5 space-y-2 text-sm">
            <Row k="Item" v={done.itemName} />
            <Row k="Roblox Username" v={done.robloxUsername} />
            <Row k="Payment Method" v={done.paymentMethod} />
            <Row k="Send To" v={done.paymentDetail} mono />
            <Row k="Total" v={format(done.total)} />
          </div>
          <button onClick={() => navigate("/")} className="mt-6 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl h-12 px-8">
            Back to Marketplace
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-[960px] mx-auto px-4 lg:px-8 py-8">
        <h1 className="font-display font-bold text-3xl text-white mb-6">Checkout</h1>
        <div className="grid md:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-6">
            {/* Roblox account */}
            <div className="rounded-xl border border-border bg-[#101014] p-5">
              <div className="text-sm font-semibold text-white mb-1">1. Your Roblox Account</div>
              <p className="text-xs text-gray-400 mb-3">Enter the Roblox username that will receive this item.</p>
              <input
                value={robloxUsername}
                onChange={(e) => setRobloxUsername(e.target.value)}
                placeholder="e.g. builderman"
                className="w-full bg-[#0b0b0e] border border-border rounded-lg px-4 h-12 text-sm text-white focus:border-primary outline-none"
              />
            </div>

            {/* Payment method */}
            <div className="rounded-xl border border-border bg-[#101014] p-5">
              <div className="text-sm font-semibold text-white mb-3">2. Select Payment Method</div>
              <div className="grid grid-cols-2 gap-2.5">
                {methods.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelected(m.id)}
                    className={`flex items-center gap-2 rounded-lg px-3 h-12 border text-sm font-medium transition-colors ${
                      selected === m.id ? "border-primary bg-primary/10 text-white" : "border-border text-gray-300 hover:border-primary/40"
                    }`}
                  >
                    {m.type === "crypto" ? <Wallet size={16} /> : <Mail size={16} />} {m.label}
                  </button>
                ))}
              </div>

              {method && (
                <div className="mt-4 rounded-lg border border-border bg-[#0b0b0e] p-4">
                  <div className="text-xs text-gray-400 mb-1">Send your payment to:</div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-sm text-white break-all font-mono">{method.detail}</code>
                    <button onClick={copy} className="shrink-0 text-gray-400 hover:text-primary">
                      {copied ? <Check size={16} className="text-[#00b67a]" /> : <Copy size={16} />}
                    </button>
                  </div>
                  {method.instructions && <p className="text-xs text-gray-500 mt-2">{method.instructions}</p>}
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-xl border border-border bg-[#101014] p-5 h-fit">
            <div className="flex items-center gap-3 pb-4 border-b border-border">
              <img src={item.image} alt={item.name} className="w-14 h-14 object-contain" onError={(e) => { e.target.style.opacity = 0.25; }} />
              <div>
                <div className="text-sm font-semibold text-white leading-tight">{item.name}</div>
                <div className="text-xs text-gray-500">RAP {item.rap || "—"}</div>
              </div>
            </div>
            <div className="flex items-center justify-between py-4 text-sm">
              <span className="text-gray-400">Total</span>
              <span className="text-2xl font-bold text-primary">{format(item.price)}</span>
            </div>
            {error && <div className="text-xs text-primary mb-3">{error}</div>}
            <button onClick={confirm} className="w-full bg-primary hover:bg-primary/90 transition-colors text-white font-semibold rounded-xl h-13 py-3.5">
              Confirm Order
            </button>
            <p className="text-[11px] text-gray-500 mt-3 text-center">Payment is sent directly to the seller. Order confirms once payment is received.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const Row = ({ k, v, mono }) => (
  <div className="flex justify-between gap-4">
    <span className="text-gray-400">{k}</span>
    <span className={`text-white text-right ${mono ? "font-mono break-all" : ""}`}>{v}</span>
  </div>
);

export default Checkout;
