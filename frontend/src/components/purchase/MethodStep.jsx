import React from "react";
import CoinIcon from "./CoinIcon";
import { useCurrency } from "../../context/CurrencyContext";

const fmtAmount = (usd, coin, rates) => {
  const rate = rates?.[coin];
  if (!rate) return null;
  const dec = coin === "BTC" ? 6 : coin === "ETH" ? 5 : 4;
  return (usd / rate).toFixed(dec);
};

const MethodStep = ({ item, methods, group, selected, setSelected, rates, onBack, onNext }) => {
  const { format } = useCurrency();
  const options = methods.filter((m) => (group === "paypal" ? m.type === "paypal" : m.type === "crypto"));

  return (
    <div data-testid="method-step" className="w-full max-w-[560px] mx-auto flex flex-col items-center">
      <h2 className="font-display font-semibold text-[26px] text-white text-center">Payment Method</h2>
      <p className="text-gray-400 text-[15px] mt-2 text-center">
        {group === "paypal" ? "You'll pay with PayPal (Friends & Family)." : "Select the cryptocurrency you want to pay with."}
      </p>

      <div className="w-full mt-8 space-y-2.5">
        {options.map((m) => {
          const active = selected === m.id;
          const amt = m.type === "crypto" ? fmtAmount(item.price, m.coin, rates) : null;
          return (
            <button
              key={m.id}
              data-testid={`method-option-${m.id}`}
              onClick={() => setSelected(m.id)}
              className={`w-full flex items-center gap-4 rounded-xl border px-5 h-[76px] text-left transition-colors ${
                active ? "border-primary bg-primary/10" : "border-border bg-[#141418] hover:border-primary/60"
              }`}
            >
              <CoinIcon coin={m.type === "paypal" ? "PAYPAL" : m.coin} />
              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold text-[15px]">{m.label}{m.coin ? ` (${m.coin})` : ""}</div>
                <div className="text-gray-500 text-xs">{m.type === "paypal" ? "Friends & Family" : "Network confirmations required"}</div>
              </div>
              <div className="text-right">
                <div className="text-white font-semibold">{format(item.price)}</div>
                {m.type === "crypto" && (
                  <div className="text-gray-400 text-xs">{amt ? `≈ ${amt} ${m.coin}` : "Live rate at checkout"}</div>
                )}
              </div>
            </button>
          );
        })}
        {options.length === 0 && (
          <div className="text-gray-500 text-sm text-center py-6">No payment options are available right now.</div>
        )}
      </div>

      <div className="w-full grid grid-cols-2 gap-3 mt-6">
        <button data-testid="method-back-button" onClick={onBack} className="h-[54px] rounded-xl border border-border bg-[#141418] hover:border-primary/50 text-white font-semibold transition-colors">Back</button>
        <button
          data-testid="method-continue-button"
          disabled={!selected}
          onClick={onNext}
          className="h-[54px] rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary text-white font-semibold transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export { fmtAmount };
export default MethodStep;
