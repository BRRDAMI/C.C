import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, Menu, X, Star, Check } from "lucide-react";
import { navLinks } from "../data/mock";
import { useCurrency } from "../context/CurrencyContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Logo = () => (
  <Link to="/" className="flex items-center select-none">
    <img src="/adurite-logo.png" alt="adurite" className="h-7 w-auto" />
  </Link>
);

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { current, currencies, setCode, code } = useCurrency();
  return (
    <header className="sticky top-0 z-40 bg-[#0b0b0e]/95 backdrop-blur border-b border-border">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-[72px] gap-4">
          <div className="flex items-center gap-10">
            <Logo />
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((l) => (
                <button
                  key={l}
                  onClick={() => navigate(l === "Orders" ? "/orders" : "/")}
                  className="text-[15px] font-medium text-gray-100 hover:text-primary transition-colors"
                >
                  {l}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-white bg-primary hover:bg-primary/90 transition-colors rounded-lg px-4 h-11 outline-none">
                  {current.label} <ChevronDown size={15} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#101014] border-border text-white min-w-[160px]">
                {currencies.map((c) => (
                  <DropdownMenuItem
                    key={c.code}
                    onClick={() => setCode(c.code)}
                    className="flex items-center justify-between cursor-pointer focus:bg-primary/15 focus:text-white"
                  >
                    {c.label}
                    {code === c.code && <Check size={15} className="text-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <a
              href="https://discord.com/invite/adu"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 text-sm font-semibold text-white border border-primary/70 hover:bg-primary/10 transition-colors rounded-lg px-4 h-11"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4.4A17 17 0 0 0 15.7 3l-.3.5a12 12 0 0 1 3.7 1.9 11 11 0 0 0-9.8 0A12 12 0 0 1 13 3.5L12.7 3A17 17 0 0 0 8.4 4.4C5.6 8.5 4.8 12.5 5.2 16.4a17 17 0 0 0 5.2 2.6l.6-1a11 11 0 0 1-1.8-.9l.4-.3a8 8 0 0 0 6.8 0l.4.3c-.6.4-1.2.7-1.8.9l.6 1a17 17 0 0 0 5.2-2.6c.5-4.6-.8-8.5-2.6-12zM9.7 14c-.8 0-1.5-.8-1.5-1.7s.7-1.7 1.5-1.7 1.5.8 1.5 1.7-.7 1.7-1.5 1.7zm4.6 0c-.8 0-1.5-.8-1.5-1.7s.7-1.7 1.5-1.7 1.5.8 1.5 1.7-.7 1.7-1.5 1.7z"/></svg>
              Discord
            </a>
            <Link
              to="/admin"
              className="flex items-center text-sm font-semibold text-white bg-primary hover:bg-primary/90 transition-colors rounded-lg px-5 h-11"
            >
              Log in
            </Link>
            <button className="lg:hidden text-white" onClick={() => setOpen(!open)}>
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Trustpilot bar */}
        <a
          href="https://www.trustpilot.com/review/adurite.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center justify-center gap-3 pb-3 text-[15px] text-gray-300 hover:opacity-90 transition-opacity"
        >
          <span>Our customers say</span>
          <span className="flex gap-[3px]">
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className="bg-[#7a3236] w-6 h-6 flex items-center justify-center rounded-[2px]">
                <Star size={16} className="fill-white text-white" strokeWidth={0} />
              </span>
            ))}
          </span>
          <span className="text-white">4.2 out of 5 based on 1204 reviews</span>
          <span className="flex items-center gap-1.5 text-white">
            <svg width="16" height="16" viewBox="0 0 24 24" className="text-[#00b67a]" fill="currentColor">
              <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7L12 17.8 5.7 21.5l1.7-7L2 9.8l7.1-.6z" />
            </svg>
            <span className="font-semibold">Trustpilot</span>
          </span>
        </a>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-border bg-[#0b0b0e] px-6 py-4 flex flex-col gap-3">
          {navLinks.map((l) => (
            <button key={l} onClick={() => { setOpen(false); navigate(l === "Orders" ? "/orders" : "/"); }} className="text-left text-gray-200 hover:text-primary">{l}</button>
          ))}
        </nav>
      )}

      {/* Announcement bar */}
      <div className="bg-primary text-white text-center text-[13px] font-semibold tracking-wide py-2.5 px-4">
        NEW: CHECK OUT THE NEW TOY CODES SECTION OF THE MARKET, INSTANT DELIVERY ON EXCLUSIVE &amp; RARE ITEMS
      </div>
    </header>
  );
};

export default Navbar;
