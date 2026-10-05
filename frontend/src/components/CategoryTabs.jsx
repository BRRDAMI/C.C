import React, { useRef } from "react";
import { categories } from "../data/mock";
import {
  LayoutGrid, HardHat, Settings, Smile, Glasses, Shield, Gem, Scissors, Users,
  ChevronLeft, ChevronRight,
} from "lucide-react";

const iconMap = { LayoutGrid, HardHat, Settings, Smile, Glasses, Shield, Gem, Scissors, Users };

const CategoryTabs = ({ active, setActive }) => {
  const ref = useRef(null);
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
  return (
    <div className="flex items-center gap-2">
      <button onClick={() => scroll(-1)} className="shrink-0 w-9 h-9 rounded-lg border border-border flex items-center justify-center text-gray-400 hover:text-white hover:border-primary/50">
        <ChevronLeft size={18} />
      </button>
      <div ref={ref} className="flex gap-2.5 overflow-x-auto no-scrollbar py-1">
        {categories.map((c) => {
          const Icon = iconMap[c.icon] || LayoutGrid;
          const isActive = active === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={`shrink-0 flex items-center gap-2 rounded-lg px-4 h-12 text-sm font-medium border transition-colors ${
                isActive
                  ? "bg-primary border-primary text-white"
                  : "bg-[#101014] border-border text-gray-300 hover:border-primary/50"
              }`}
            >
              <Icon size={17} /> {c.label}
            </button>
          );
        })}
      </div>
      <button onClick={() => scroll(1)} className="shrink-0 w-9 h-9 rounded-lg border border-border flex items-center justify-center text-gray-400 hover:text-white hover:border-primary/50">
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default CategoryTabs;
