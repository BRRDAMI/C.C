import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Loader2 } from "lucide-react";
import Stepper from "./Stepper";
import ListingStep from "./ListingStep";
import AccountStep from "./AccountStep";
import MethodStep from "./MethodStep";
import ReviewStep from "./ReviewStep";
import PayStep from "./PayStep";
import { findItem, getPaymentMethods, getRates, createOrder, priceFor } from "../../data/store";
import { fmtAmount } from "./MethodStep";

const PurchaseModal = ({ itemId, onClose }) => {
  const [item, setItem] = useState(undefined);
  const [methods, setMethods] = useState([]);
  const [rates, setRates] = useState(null);
  const [step, setStep] = useState(1);
  const [group, setGroup] = useState("");
  const [username, setUsername] = useState("");
  const [selected, setSelected] = useState("");
  const [order, setOrder] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setItem(undefined); setStep(1); setGroup(""); setSelected(""); setOrder(null);
    Promise.all([findItem(itemId), getPaymentMethods(), getRates()]).then(([it, m, r]) => {
      if (!active) return;
      setItem(it || null);
      setMethods(m);
      setRates(r);
      if (m.some((x) => x.type === "crypto")) setGroup("crypto");
      else if (m.some((x) => x.type === "paypal")) setGroup("paypal");
    });
    return () => { active = false; };
  }, [itemId]);

  useEffect(() => {
    if (step === 5) getRates().then((r) => r && setRates(r));
  }, [step]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [onClose]);

  const method = methods.find((m) => m.id === selected);
  const price = item ? priceFor(item, group) : 0;

  const goMethod = () => {
    const opts = methods.filter((m) => (group === "paypal" ? m.type === "paypal" : m.type === "crypto"));
    if (opts.length === 1) setSelected(opts[0].id);
    else if (!opts.some((o) => o.id === selected)) setSelected("");
    setStep(3);
  };

  const confirm = async () => {
    setSubmitting(true); setError("");
    try {
      const o = await createOrder({
        item_id: String(item.id),
        item_name: item.name,
        item_image: item.image,
        total: price,
        roblox_username: username.trim(),
        payment_method: method.type === "crypto" ? `${method.label} (${method.coin})` : method.label,
        payment_detail: method.detail,
        crypto_coin: method.coin || "",
        crypto_amount: method.type === "crypto" ? Number(fmtAmount(price, method.coin, rates)) || null : null,
      });
      setOrder(o);
      setStep(5);
    } catch {
      setError("Something went wrong creating your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div
      data-testid="purchase-modal-overlay"
      className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-[2px] overflow-y-auto"
      onClick={onClose}
    >
      <div className="min-h-full flex items-start justify-center px-3 py-6 sm:py-10">
        <div
          data-testid="purchase-modal"
          className="relative w-full max-w-[1120px] rounded-2xl bg-[#0e0e11] border border-border/60 shadow-2xl px-5 sm:px-10 pt-7 pb-10"
          onClick={(e) => e.stopPropagation()}
        >
          <button data-testid="purchase-modal-close" onClick={onClose} className="absolute right-5 top-5 text-gray-400 hover:text-white transition-colors">
            <X size={26} />
          </button>

          <div className="pr-10 sm:pr-0 mb-10">
            <Stepper step={step} />
          </div>

          {item === undefined && (
            <div className="py-24 flex justify-center text-gray-400"><Loader2 className="animate-spin" /></div>
          )}
          {item === null && (
            <div className="py-24 text-center text-gray-400">Item not found.</div>
          )}

          {item && step === 1 && (
            <ListingStep item={item} methods={methods} group={group} setGroup={setGroup} onNext={() => setStep(2)} />
          )}
          {item && step === 2 && (
            <AccountStep username={username} setUsername={setUsername} onBack={() => setStep(1)} onNext={goMethod} />
          )}
          {item && step === 3 && (
            <MethodStep item={item} price={price} methods={methods} group={group} selected={selected} setSelected={setSelected} rates={rates} onBack={() => setStep(2)} onNext={() => setStep(4)} />
          )}
          {item && step === 4 && method && (
            <ReviewStep item={item} price={price} username={username.trim()} method={method} onBack={() => setStep(3)} onConfirm={confirm} submitting={submitting} error={error} />
          )}
          {item && step === 5 && method && (
            <PayStep item={item} price={price} username={username.trim()} method={method} order={order} rates={rates} onBack={onClose} />
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PurchaseModal;
