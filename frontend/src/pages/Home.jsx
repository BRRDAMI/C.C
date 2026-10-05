import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RecentlySold from "../components/RecentlySold";
import Sidebar, { PRICE_MAX } from "../components/Sidebar";
import CategoryTabs from "../components/CategoryTabs";
import ItemCard from "../components/ItemCard";
import { getTrending, getListings } from "../data/store";
import { getItemPayments, getItemDemand, getItemRarity, parseRap } from "../data/mock";

const defaultFilters = { min: 0, max: PRICE_MAX, sort: "rap-high", payment: "all", demand: "All", rarity: "All" };

const Home = () => {
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [market, setMarket] = useState("limiteds");
  const [filters, setFilters] = useState(defaultFilters);

  const trendingItems = useMemo(() => getTrending(), []);
  const listingItems = useMemo(() => getListings(), []);

  const filterFn = (it) => {
    if (category !== "all" && it.category !== category) return false;
    if (query && !it.name.toLowerCase().includes(query.toLowerCase())) return false;
    if (it.price < filters.min) return false;
    if (filters.max < PRICE_MAX && it.price > filters.max) return false;
    if (filters.payment !== "all" && !getItemPayments(it).includes(filters.payment)) return false;
    if (filters.demand !== "All" && getItemDemand(it) !== filters.demand) return false;
    if (filters.rarity !== "All" && getItemRarity(it) !== filters.rarity) return false;
    return true;
  };

  const rate = (it) => it.price / (parseRap(it.rap) || 1);
  const sortFns = {
    "rap-high": (a, b) => parseRap(b.rap) - parseRap(a.rap),
    "rap-low": (a, b) => parseRap(a.rap) - parseRap(b.rap),
    "price-high": (a, b) => b.price - a.price,
    "price-low": (a, b) => a.price - b.price,
    "rate-low": (a, b) => rate(a) - rate(b),
  };
  const sortFn = sortFns[filters.sort] || sortFns["rap-high"];

  const filteredTrending = trendingItems.filter(filterFn).sort(sortFn);
  const filteredListings = listingItems.filter(filterFn).sort(sortFn);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <RecentlySold />

        <div className="mt-10 flex flex-col lg:flex-row gap-8">
          <Sidebar
            market={market}
            setMarket={setMarket}
            filters={filters}
            setFilters={setFilters}
            resetFilters={() => setFilters(defaultFilters)}
          />

          <div className="flex-1 min-w-0">
            <div className="relative mb-5">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for items..."
                className="w-full bg-[#101014] border border-border rounded-xl pl-11 pr-4 h-14 text-sm text-white placeholder:text-gray-500 focus:border-primary outline-none"
              />
            </div>

            <div className="mb-8">
              <CategoryTabs active={category} setActive={setCategory} />
            </div>

            {filteredTrending.length > 0 && (
              <section className="mb-10">
                <h2 className="font-display font-bold text-2xl text-white mb-5">Trending Right Now</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredTrending.slice(0, 8).map((it) => (
                    <ItemCard key={`t-${it.id}`} item={it} showPay />
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="font-display font-bold text-2xl text-white mb-5">
                All Listings <span className="text-gray-500 text-base font-medium">{filteredListings.length} items</span>
              </h2>
              {filteredListings.length === 0 ? (
                <div className="text-gray-500 py-16 text-center">No items match your filters.</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredListings.map((it) => (
                    <ItemCard key={`l-${it.id}`} item={it} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
