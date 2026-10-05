import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Zap, BadgeCheck } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { findItem } from "../data/store";
import { useCurrency } from "../context/CurrencyContext";

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = findItem(id);
  const { format } = useCurrency();

  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-24 text-center">
          <p className="text-gray-400">Item not found.</p>
          <Link to="/" className="text-primary hover:underline">Back to marketplace</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-[1100px] mx-auto px-4 lg:px-8 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6">
          <ArrowLeft size={16} /> Back
        </button>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="rounded-2xl bg-gradient-to-b from-[#16161b] to-[#0d0d11] border border-border flex items-center justify-center p-10 aspect-square">
            <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain" onError={(e) => { e.target.style.opacity = 0.25; }} />
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs text-[#00b67a] font-semibold mb-2">
              <BadgeCheck size={16} /> Verified Seller
            </div>
            <h1 className="font-display font-bold text-3xl text-white leading-tight">{item.name}</h1>
            <div className="mt-2 text-sm text-gray-400 capitalize">Category: {item.category || "limited"}</div>

            <div className="mt-6 flex items-end gap-4">
              <div>
                <div className="text-xs text-gray-500">Price</div>
                <div className="text-4xl font-bold text-primary">{format(item.price)}</div>
              </div>
              <div className="pb-1">
                <div className="text-xs text-gray-500">RAP</div>
                <div className="text-lg font-semibold text-white">{item.rap || "—"}</div>
              </div>
            </div>

            <button
              onClick={() => navigate("/checkout", { state: { item } })}
              className="mt-6 w-full bg-primary hover:bg-primary/90 transition-colors text-white font-semibold text-base rounded-xl h-14"
            >
              Buy Now
            </button>

            <div className="mt-6 grid grid-cols-1 gap-3">
              {[
                { icon: Zap, t: "Instant Delivery", d: "Receive your item quickly after payment confirmation." },
                { icon: ShieldCheck, t: "Secure Checkout", d: "Pay directly to verified receiving accounts." },
                { icon: BadgeCheck, t: "Trusted Marketplace", d: "4.2/5 from 1204 Trustpilot reviews." },
              ].map((f) => (
                <div key={f.t} className="flex items-start gap-3 rounded-xl border border-border bg-[#101014] p-4">
                  <f.icon size={20} className="text-primary mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-white">{f.t}</div>
                    <div className="text-xs text-gray-400">{f.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ItemDetail;
