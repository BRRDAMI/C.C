import React from "react";
import { useNavigate } from "react-router-dom";
import { money } from "../data/store";

const PayIcons = ({ methods }) => (
  <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1.5">
    {methods?.includes("paypal") && (
      <svg width="26" height="26" viewBox="0 0 24 24" className="drop-shadow"><path fill="#2790C3" d="M7 4h7c3 0 5 2 4 5-1 3-3 4-6 4H9l-1 5H5L7 4z"/><path fill="#1F4E8C" d="M9 8h6c2 0 3 2 2 4-1 2-3 3-5 3h-3l1-7z"/></svg>
    )}
    {methods?.includes("card") && (
      <svg width="26" height="18" viewBox="0 0 32 20"><rect width="32" height="20" rx="3" fill="#2563eb"/><rect y="4" width="32" height="4" fill="#1e3a8a"/></svg>
    )}
    {methods?.includes("apple") && (
      <span className="text-white text-xs font-semibold flex items-center gap-0.5 bg-black/40 rounded px-1">
        <svg width="11" height="13" viewBox="0 0 14 17" fill="white"><path d="M11 9c0-2 2-3 2-3s-1-2-3-2c-1 0-2 1-3 1S6 4 5 4C3 4 1 6 1 9c0 3 2 6 3 6 1 0 1-1 3-1s2 1 3 1c1 0 3-3 3-5-1 0-2-1-2-1zM9 3c1-1 1-2 1-3-1 0-2 1-2 2 0 0 0 1 1 1z"/></svg>Pay
      </span>
    )}
  </div>
);

const ItemCard = ({ item, showPay = false }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(`/item/${item.id}`)}
      className="group relative text-left rounded-xl bg-[#101014] border border-border hover:border-primary/60 transition-all duration-200 overflow-hidden hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(230,51,63,0.15)]"
    >
      {showPay && <PayIcons methods={item.payments || ["paypal", "card", "apple"]} />}
      <div className="aspect-square flex items-center justify-center p-5 bg-gradient-to-b from-[#16161b] to-[#0d0d11]">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
          onError={(e) => { e.target.style.opacity = 0.25; }}
        />
      </div>
      <div className="p-3 border-t border-border/60">
        <div className="text-sm font-semibold text-white truncate">{item.name}</div>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-[11px] text-gray-500">RAP <span className="text-gray-300">{item.rap || "—"}</span></span>
          <span className="text-sm font-bold text-primary">From {money(item.price)}</span>
        </div>
      </div>
    </button>
  );
};

export default ItemCard;
