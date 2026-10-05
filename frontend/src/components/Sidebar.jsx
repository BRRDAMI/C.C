import React, { useState } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import {
  ChevronRight, ChevronUp, Tag, ArrowUpDown, Gem, RotateCcw,
  Skull, Gamepad2, Crosshair, Hammer,
} from "lucide-react";
import { markets, paymentOptions, tagOptions } from "../data/mock";

const marketIcon = { limiteds: Skull, toycodes: Gamepad2, cs2: Crosshair, rust: Hammer };
export const PRICE_MAX = 10000;

const Section = ({ icon: Icon, title, open, setOpen, children }) => (
  <div className="py-5 border-t border-border">
    <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between">
      <span className="flex items-center gap-2.5 text-white">
        <Icon size={18} />
        <span className="font-display font-semibold text-lg">{title}</span>
      </span>
      <ChevronUp size={18} className={`text-gray-400 transition-transform ${open ? "" : "rotate-180"}`} />
    </button>
    {open && <div className="mt-4">{children}</div>}
  </div>
);

const RadioRow = ({ checked, label, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 rounded-full px-3.5 h-11 border transition-colors ${
      checked ? "border-primary/70 bg-primary/10" : "border-transparent hover:bg-[#121216]"
    }`}
  >
    <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${checked ? "bg-primary" : "border border-gray-500"}`}>
      {checked && <span className="w-2 h-2 rounded-full bg-white" />}
    </span>
    <span className={`text-sm ${checked ? "text-white" : "text-gray-300"}`}>{label}</span>
  </button>
);

const PriceBox = ({ label, value, isMax, onChange }) => (
  <div className="flex-1 rounded-lg border border-border bg-[#0b0b0e] px-3 py-2">
    <div className="text-xs text-gray-500">{label}</div>
    <div className="flex items-center gap-1 text-white text-sm">
      <span className="text-gray-400">$</span>
      <input
        value={isMax && value >= PRICE_MAX ? "10,000+" : String(value)}
        onChange={(e) => {
          const digits = e.target.value.replace(/[^0-9]/g, "");
          onChange(digits === "" ? 0 : Math.min(PRICE_MAX, parseInt(digits, 10)));
        }}
        className="w-full bg-transparent outline-none"
      />
    </div>
  </div>
);

const Sidebar = ({ market, setMarket, filters, setFilters, resetFilters }) => {
  const [open, setOpen] = useState({ price: true, sort: true, payment: true, tags: true });
  const toggle = (k) => setOpen((o) => ({ ...o, [k]: !o[k] }));
  const set = (patch) => setFilters((f) => ({ ...f, ...patch }));

  return (
    <aside className="w-full lg:w-[260px] shrink-0">
      <h3 className="font-display font-bold text-2xl text-white mb-4">Markets</h3>
      <div className="space-y-2">
        {markets.map((m) => {
          const Icon = marketIcon[m.id] || Skull;
          const active = market === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setMarket(m.id)}
              className={`w-full flex items-center justify-between rounded-xl pl-3.5 pr-3 h-[52px] border transition-colors ${
                active
                  ? "border-primary/70 border-l-[3px] bg-gradient-to-r from-primary/15 to-transparent text-white"
                  : "border-transparent hover:bg-[#121216] text-gray-200"
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon size={19} className={active ? "text-primary" : "text-gray-300"} />
                <span className="font-medium">{m.label}</span>
              </span>
              <span className="flex items-center gap-2">
                {m.badge && <span className="text-[10px] font-bold text-white bg-primary rounded px-1.5 py-0.5">{m.badge}</span>}
                <ChevronRight size={16} className="text-gray-500" />
              </span>
            </button>
          );
        })}
      </div>

      <h3 className="font-display font-bold text-2xl text-white mt-8 mb-1">Filters</h3>

      <Section icon={Tag} title="Price (USD)" open={open.price} setOpen={() => toggle("price")}>
        <div className="flex items-center gap-3 mb-5">
          <PriceBox label="Min" value={filters.min} onChange={(v) => set({ min: Math.min(v, filters.max) })} />
          <PriceBox label="Max" value={filters.max} isMax onChange={(v) => set({ max: Math.max(v, filters.min) })} />
        </div>
        <SliderPrimitive.Root
          min={0}
          max={PRICE_MAX}
          step={50}
          value={[filters.min, filters.max]}
          onValueChange={([mn, mx]) => set({ min: mn, max: mx })}
          className="relative flex w-full touch-none select-none items-center h-5"
        >
          <SliderPrimitive.Track className="relative h-1.5 w-full grow rounded-full bg-[#2a2a2e]">
            <SliderPrimitive.Range className="absolute h-full rounded-full bg-primary" />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full bg-white shadow-md focus:outline-none cursor-pointer" />
          <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full bg-white shadow-md focus:outline-none cursor-pointer" />
        </SliderPrimitive.Root>
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>$0</span>
          <span>$10,000+</span>
        </div>
      </Section>

      <Section icon={ArrowUpDown} title="Sort" open={open.sort} setOpen={() => toggle("sort")}>
        <div className="space-y-1">
          <RadioRow checked={filters.sort === "high"} label="Price (High to Low)" onClick={() => set({ sort: "high" })} />
          <RadioRow checked={filters.sort === "low"} label="Price (Low to High)" onClick={() => set({ sort: "low" })} />
        </div>
      </Section>

      <Section icon={Tag} title="Payment Method" open={open.payment} setOpen={() => toggle("payment")}>
        <div className="space-y-1">
          {paymentOptions.map((p) => (
            <RadioRow key={p.id} checked={filters.payment === p.id} label={p.label} onClick={() => set({ payment: p.id })} />
          ))}
        </div>
      </Section>

      <Section icon={Gem} title="Tags" open={open.tags} setOpen={() => toggle("tags")}>
        <div className="space-y-1">
          {tagOptions.map((t) => (
            <RadioRow key={t} checked={filters.tag === t} label={t} onClick={() => set({ tag: t })} />
          ))}
        </div>
      </Section>

      <div className="pt-5 border-t border-border">
        <button
          onClick={resetFilters}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-border hover:border-primary/50 hover:bg-[#121216] text-white font-medium h-12 transition-colors"
        >
          <RotateCcw size={16} /> Reset Filters
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
