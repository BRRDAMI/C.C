import React from "react";
import { Link } from "react-router-dom";
import { PackageSearch } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getOrders, money } from "../data/store";

const Orders = () => {
  const orders = getOrders();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-[960px] mx-auto px-4 lg:px-8 py-8">
        <h1 className="font-display font-bold text-3xl text-white mb-6">Your Orders</h1>
        {orders.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-16 text-center">
            <PackageSearch size={40} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">You have no orders yet.</p>
            <Link to="/" className="text-primary hover:underline text-sm">Browse the marketplace</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="flex items-center gap-4 rounded-xl border border-border bg-[#101014] p-4">
                <img src={o.itemImage} alt={o.itemName} className="w-14 h-14 object-contain rounded-lg bg-[#0b0b0e]" onError={(e) => { e.target.style.opacity = 0.25; }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{o.itemName}</div>
                  <div className="text-xs text-gray-500">{o.id} · {new Date(o.createdAt).toLocaleDateString()} · {o.paymentMethod}</div>
                </div>
                <div className="text-right">
                  <div className="text-primary font-bold">{money(o.total)}</div>
                  <span className="text-xs font-semibold text-yellow-400 capitalize">{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Orders;
