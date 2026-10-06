import React, { useState } from "react";
import { useCurrency } from "../../context/CurrencyContext";

const ReviewStep = ({ item, price, username, method, onBack, onConfirm, submitting, error }) => {
  const { format } = useCurrency();
  const [agree, setAgree] = useState(false);

  return (
    <div data-testid="review-step" className="w-full max-w-[560px] mx-auto flex flex-col items-center">
      <h2 className="font-display font-semibold text-[26px] text-white text-center">Review Order</h2>
      <p className="text-gray-400 text-[15px] mt-2 text-center">Double-check everything before continuing to payment.</p>

      <div className="w-full mt-8 rounded-xl border border-border bg-[#141418] overflow-hidden">
        <div className="flex items-center gap-4 p-4 border-b border-border">
          <img src={item.image} alt={item.name} className="w-16 h-16 object-contain" onError={(e) => { e.target.style.opacity = 0.25; }} />
          <div className="flex-1 min-w-0">
            <div className="text-white font-semibold text-[15px] truncate">{item.name}</div>
            <div className="text-gray-400 text-sm">RAP: {item.rap || "—"}</div>
          </div>
          <div data-testid="review-total" className="text-white font-bold text-xl">{format(price)}</div>
        </div>
        <div className="divide-y divide-border text-sm">
          <Row k="Buyer" v={username} testid="review-buyer" />
          <Row k="Payment" v={`${method.label}${method.coin ? ` (${method.coin})` : ""}`} testid="review-method" />
          <Row k="Delivery" v="Instant · P2P trade" />
        </div>
      </div>

      <label className="w-full mt-5 flex items-start gap-3 cursor-pointer select-none">
        <input
          data-testid="review-terms-checkbox"
          type="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          className="mt-0.5 w-5 h-5 accent-[#e6333f]"
        />
        <span className="text-[13px] text-gray-400 leading-relaxed">
          I understand this is a player-to-player trade, that payment must be sent exactly as instructed on the next step, and that
          the Roblox username above is correct.
        </span>
      </label>

      {error && <div data-testid="review-error" className="w-full text-xs text-primary mt-3">{error}</div>}

      <div className="w-full grid grid-cols-2 gap-3 mt-6">
        <button data-testid="review-back-button" onClick={onBack} className="h-[54px] rounded-xl border border-border bg-[#141418] hover:border-primary/50 text-white font-semibold transition-colors">Back</button>
        <button
          data-testid="proceed-to-payment-button"
          disabled={!agree || submitting}
          onClick={onConfirm}
          className="h-[54px] rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary text-white font-semibold transition-colors"
        >
          {submitting ? "Please wait…" : "Proceed to payment"}
        </button>
      </div>
    </div>
  );
};

const Row = ({ k, v, testid }) => (
  <div className="flex items-center justify-between px-4 py-3">
    <span className="text-gray-400">{k}</span>
    <span data-testid={testid} className="text-white font-medium text-right">{v}</span>
  </div>
);

export default ReviewStep;
