import React, { useState } from "react";
import { markets } from "../data/mock";
import { ChevronRight, ChevronDown, Skull, Gamepad2, Crosshair, Hammer, Tag } from "lucide-react";

const marketIcon = {
  limiteds: Skull,
  toycodes: Gamepad2,
  cs2: Crosshair,
  rust: Hammer,
};

const Sidebar = ({ priceRange, setPriceRange }) => {
  const [openPrice, setOpenPrice] = useState(true);
  return (
    <aside className="w-full lg:w-[240px] shrink-0">
      <h3 className="font-display font-bold text-xl text-white mb-4">Markets</h3>
      <div className="space-y-2">
        {markets.map((m) => {
          const Icon = marketIcon[m.id] || Tag;
          return (
            <button
              key={m.id}
              className={`w-full flex items-center justify-between rounded-xl px-3.5 h-12 border transition-colors ${
                m.active
                  ? "border-primary/70 bg-primary/10 text-white"
                  : "border-transparent hover:bg-[#121216] text-gray-300"
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon size={18} className={m.active ? "text-primary" : "text-gray-400"} />
                <span className="font-medium text-sm">{m.label}</span>
              </span>
              <span className="flex items-center gap-2">
                {m.badge && <span className="text-[10px] font-bold text-primary bg-primary/15 rounded px-1.5 py-0.5">{m.badge}</span>}
                <ChevronRight size={16} className="text-gray-500" />
              </span>
            </button>
          );
        })}
      </div>

      <h3 className="font-display font-bold text-xl text-white mt-8 mb-4">Filters</h3>
      <div className="rounded-xl border border-border bg-[#101014] overflow-hidden">
        <button onClick={() => setOpenPrice(!openPrice)} className="w-full flex items-center justify-between px-4 h-12">
          <span className="flex items-center gap-2 text-sm font-medium text-white"><Tag size={15} className="text-gray-400" /> Price (USD)</span>
          <ChevronDown size={16} className={`text-gray-400 transition-transform ${openPrice ? "" : "-rotate-90"}`} />
        </button>
        {openPrice && (
          <div className="px-4 pb-4 space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                className="w-full bg-[#0b0b0e] border border-border rounded-lg px-3 h-10 text-sm text-white focus:border-primary outline-none"
              />
              <span className="text-gray-500">–</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                className="w-full bg-[#0b0b0e] border border-border rounded-lg px-3 h-10 text-sm text-white focus:border-primary outline-none"
              />
            </div>
            {(priceRange.min || priceRange.max) && (
              <button onClick={() => setPriceRange({ min: "", max: "" })} className="text-xs text-primary hover:underline">Clear price filter</button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
