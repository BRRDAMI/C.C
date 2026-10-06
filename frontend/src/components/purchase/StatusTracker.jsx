import React from "react";
import { Check, Loader2, XCircle } from "lucide-react";

const STEPS = [
  { id: "awaiting_payment", label: "Awaiting payment" },
  { id: "confirmed", label: "Confirmed" },
  { id: "delivered", label: "Delivered" },
];

const StatusTracker = ({ status }) => {
  if (status === "cancelled") {
    return (
      <div data-testid="order-status-tracker" data-status="cancelled" className="w-full max-w-[700px] rounded-xl border border-primary/50 bg-primary/10 px-5 py-4 flex items-center gap-3">
        <XCircle size={20} className="text-primary shrink-0" />
        <div className="text-sm text-white">This order was cancelled. Please contact support if you already sent payment.</div>
      </div>
    );
  }

  const idx = Math.max(0, STEPS.findIndex((s) => s.id === status));

  return (
    <div data-testid="order-status-tracker" data-status={status} className="w-full max-w-[700px]">
      <div className="flex items-center">
        {STEPS.map((s, i) => {
          const done = i < idx;
          const active = i === idx;
          return (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div
                  data-testid={`status-dot-${s.id}`}
                  className={`w-9 h-9 rounded-full flex items-center justify-center border transition-colors ${
                    done
                      ? "bg-[#00b67a] border-[#00b67a] text-white"
                      : active
                      ? "bg-primary border-primary text-white"
                      : "bg-[#141418] border-border text-gray-500"
                  }`}
                >
                  {done ? <Check size={17} /> : active ? <Loader2 size={16} className="animate-spin" /> : <span className="text-xs font-bold">{i + 1}</span>}
                </div>
                <span className={`text-[12px] whitespace-nowrap ${done || active ? "text-white" : "text-gray-500"}`}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-[2px] mx-2 mb-6 rounded-full ${i < idx ? "bg-[#00b67a]" : "bg-border"}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StatusTracker;
