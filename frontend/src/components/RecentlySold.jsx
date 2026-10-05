import React, { useEffect, useState } from "react";
import { recentlySold, giveaway } from "../data/mock";
import { money } from "../data/store";

const Flip = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <div className="bg-primary text-white font-display font-bold text-xl md:text-2xl rounded-md w-11 h-11 md:w-12 md:h-12 flex items-center justify-center tabular-nums">
      {String(value).padStart(2, "0")}
    </div>
    <span className="text-[10px] text-gray-400 mt-1">{label}</span>
  </div>
);

const useCountdown = (target) => {
  const [t, setT] = useState(target - Date.now());
  useEffect(() => {
    const i = setInterval(() => setT(target - Date.now()), 1000);
    return () => clearInterval(i);
  }, [target]);
  const s = Math.max(0, Math.floor(t / 1000));
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
};

const RecentlySold = () => {
  const { days, hours, minutes, seconds } = useCountdown(giveaway.endsAt);
  return (
    <section className="pt-8">
      <h2 className="font-display font-extrabold text-2xl md:text-3xl tracking-wide text-white mb-5">RECENTLY SOLD</h2>
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto] gap-5 items-stretch">
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
          {recentlySold.map((it, idx) => (
            <div key={idx} className="card-redglow shrink-0 w-[150px] rounded-xl bg-[#101014] border border-border overflow-hidden">
              <div className="px-3 pt-2 text-sm font-semibold text-white">{money(it.price)}</div>
              <div className="aspect-square flex items-center justify-center p-3">
                <img src={it.image} alt={it.name} className="max-h-full object-contain" onError={(e) => { e.target.style.opacity = 0.25; }} />
              </div>
              <div className="px-3 pb-3 text-xs text-gray-400 truncate">{it.name}</div>
            </div>
          ))}
        </div>

        {/* Giveaway panel */}
        <div className="flex items-center gap-5 rounded-xl bg-[#101014] border border-border p-4 xl:w-[520px]">
          <div className="flex flex-col items-center shrink-0">
            <img src={giveaway.image} alt={giveaway.name} className="w-20 h-20 object-contain" onError={(e) => { e.target.style.opacity = 0.25; }} />
            <div className="text-xs font-semibold text-white mt-1 text-center max-w-[90px] leading-tight">{giveaway.name}</div>
            <div className="text-[10px] text-gray-500">{giveaway.entries.toLocaleString()} Entries</div>
          </div>
          <div className="flex-1 flex flex-col items-center gap-3">
            <div className="flex gap-2">
              <Flip value={days} label="Days" />
              <Flip value={hours} label="Hours" />
              <Flip value={minutes} label="Minutes" />
              <Flip value={seconds} label="Seconds" />
            </div>
            <button className="w-full bg-primary hover:bg-primary/90 transition-colors text-white font-semibold text-sm rounded-lg h-11">
              ENTER GIVEAWAY
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecentlySold;
