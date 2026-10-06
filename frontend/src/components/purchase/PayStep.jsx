import React, { useEffect, useState } from "react";
import { QrCode } from "lucide-react";
import { useCurrency } from "../../context/CurrencyContext";
import { fmtAmount } from "./MethodStep";
import StatusTracker from "./StatusTracker";
import { getOrder, statusLabel } from "../../data/store";

const splitPrice = (s) => {
  const m = s.match(/^(.*?)(\.\d+)?$/);
  return [m?.[1] ?? s, m?.[2] ?? ""];
};

const PayStep = ({ item, price, username, method, order, rates, onBack }) => {
  const { format } = useCurrency();
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState(order?.status || "awaiting_payment");
  const isCrypto = method.type === "crypto";
  const amount = isCrypto ? fmtAmount(price, method.coin, rates) : null;
  const [whole, cents] = splitPrice(format(price));

  useEffect(() => {
    if (!order?.id) return;
    setStatus(order.status || "awaiting_payment");
    const tick = async () => {
      const fresh = await getOrder(order.id);
      if (fresh?.status) setStatus(fresh.status);
    };
    const t = setInterval(tick, 8000);
    return () => clearInterval(t);
  }, [order?.id, order?.status]);

  const copy = () => {
    navigator.clipboard?.writeText(method.detail);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div data-testid="pay-step" className="w-full flex flex-col items-center">
      <div className="flex items-center gap-6">
        <img src={item.image} alt={item.name} className="w-[110px] h-[110px] object-contain" onError={(e) => { e.target.style.opacity = 0.25; }} />
        <div>
          <div className="font-display font-medium text-[22px] text-white leading-tight">{item.name}</div>
          <div className="text-gray-400 text-[15px] mt-1">RAP: {item.rap || "—"}</div>
          <div data-testid="pay-buyer" className="text-gray-400 text-[15px]">Buyer: {username}</div>
        </div>
      </div>

      <div data-testid="pay-price" className="mt-5 text-white font-semibold leading-none">
        <span className="text-[44px]">{whole}</span>
        <span className="text-[28px] text-gray-300">{cents}</span>
      </div>

      <div data-testid="pay-amount" className="mt-5 text-[22px] text-white">
        {isCrypto ? (
          amount ? <>Amount: {amount} {method.coin}</> : <span className="text-gray-400">Fetching live {method.coin} rate…</span>
        ) : (
          <>Send as Friends &amp; Family</>
        )}
      </div>
      <p className="mt-3 text-gray-400 text-[15px] text-center">
        {isCrypto
          ? "Underpayments due to large market fluctuations may be refunded."
          : `Include your order ID (${order?.id || "—"}) in the payment note.`}
      </p>

      {isCrypto && (
        <div data-testid="pay-qr" className="mt-6 w-[280px] h-[280px] rounded-sm bg-white flex items-center justify-center overflow-hidden">
          {method.qr_image ? (
            <img src={method.qr_image} alt={`${method.coin} QR code`} className="w-full h-full object-contain" />
          ) : (
            <div className="text-center text-gray-500 px-6">
              <QrCode size={64} className="mx-auto mb-2 text-gray-400" />
              <div className="text-xs">QR code not available. Use the address below.</div>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 w-full max-w-[700px] flex items-stretch gap-2.5">
        <div
          data-testid="pay-address"
          className="flex-1 min-w-0 rounded-lg border border-border bg-[#141418] px-4 h-[62px] flex items-center text-white text-base font-mono truncate"
        >
          {method.detail || <span className="text-gray-500">Address not configured yet</span>}
        </div>
        <button
          data-testid="pay-copy-button"
          onClick={copy}
          disabled={!method.detail}
          className="shrink-0 w-[120px] h-[62px] rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-semibold text-lg transition-colors"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <p className="mt-6 max-w-[840px] text-center text-white/90 text-[17px] leading-snug">
        {isCrypto
          ? `You should only send ${method.coin} to this address. If you attempt to send any other cryptocurrency, your funds will be lost. Payments may take up to 2 network confirmations to confirm. If you have any issues, please contact support.`
          : "You should only send PayPal payments as Friends & Family to this email. Payments sent as Goods & Services may be refunded and your order cancelled. If you have any issues, please contact support."}
      </p>

      {order && (
        <div className="mt-8 w-full flex flex-col items-center gap-3">
          <StatusTracker status={status} />
          <div data-testid="pay-order-id" className="text-xs text-gray-500">
            Order <span className="font-mono text-gray-400">{order.id}</span> ·{" "}
            <span data-testid="pay-order-status" className="text-gray-300">{statusLabel(status)}</span>
          </div>
        </div>
      )}

      <button
        data-testid="pay-back-button"
        onClick={onBack}
        className="mt-6 w-[280px] h-[62px] rounded-lg bg-primary hover:bg-primary/90 text-white font-semibold text-lg transition-colors"
      >
        Back
      </button>
    </div>
  );
};

export default PayStep;
