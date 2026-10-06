import React from "react";
import { Zap } from "lucide-react";
import { useCurrency } from "../../context/CurrencyContext";

export const GROUPS = [
  { id: "card", label: "Card / Apple Pay", available: false },
  { id: "crypto", label: "Crypto / Balance", available: true },
  { id: "paypal", label: "PayPal", available: true },
];

const ListingStep = ({ item, methods, group, setGroup, onNext }) => {
  const { format, code } = useCurrency();
  const hasCrypto = methods.some((m) => m.type === "crypto");
  const hasPaypal = methods.some((m) => m.type === "paypal");
  const isAvailable = (g) => g.available && (g.id === "crypto" ? hasCrypto : g.id === "paypal" ? hasPaypal : false);
  const listingCount = methods.length;

  return (
    <div data-testid="listing-step" className="flex flex-col items-center">
      <img
        src={item.image}
        alt={item.name}
        className="w-[210px] h-[210px] object-contain"
        onError={(e) => { e.target.style.opacity = 0.25; }}
      />
      <h2 data-testid="listing-item-name" className="font-display font-semibold text-[26px] text-white mt-2 text-center leading-tight">{item.name}</h2>
      <div className="text-gray-400 text-[15px] mt-1">RAP: {item.rap || "—"}</div>
      <div className="text-gray-400 text-[15px]">Listings: {listingCount}</div>
      <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold tracking-[0.12em] text-[#00b67a] uppercase">
        <Zap size={13} className="fill-current" /> Instant Delivery
      </div>

      <div className="w-full max-w-[560px] mt-8">
        <div className="text-white font-semibold text-lg mb-3">Listings</div>
        <div className="space-y-2.5">
          {GROUPS.map((g) => {
            const ok = isAvailable(g);
            const active = group === g.id;
            return (
              <button
                key={g.id}
                data-testid={`listing-group-${g.id}`}
                disabled={!ok}
                onClick={() => setGroup(g.id)}
                className={`w-full flex items-center justify-between rounded-xl border px-5 h-[68px] text-left transition-colors ${
                  active ? "border-primary bg-primary/10" : "border-border bg-[#141418]"
                } ${ok ? "hover:border-primary/60 cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
              >
                <span className="text-white font-medium text-[15px]">{g.label}</span>
                {ok ? (
                  <span className="text-right">
                    <span className="text-gray-400 text-xs mr-1.5">From</span>
                    <span className="text-white font-semibold text-[15px]">{format(item.price)}</span>
                    <span className="text-gray-500 text-[11px] ml-1">{code}</span>
                  </span>
                ) : (
                  <span className="text-gray-500 text-sm">Unavailable</span>
                )}
              </button>
            );
          })}
        </div>

        <button
          data-testid="confirm-listing-button"
          disabled={!group}
          onClick={onNext}
          className="mt-6 w-full h-[54px] rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary text-white font-semibold text-base transition-colors"
        >
          Confirm listing
        </button>

        <p className="mt-6 text-center text-[12px] leading-relaxed text-gray-500">
          Adurite.com's services are not the same, similar or equivalent to Roblox Corporation's products and services and we are
          not sponsored by, affiliated with, approved by and/or authorized by ROBLOX Corporation whatsoever. This limited item
          purchase is facilitated via a player to player trade to you, and is not directly from the platform or officially from the
          site/corporation.
        </p>
      </div>
    </div>
  );
};

export default ListingStep;
