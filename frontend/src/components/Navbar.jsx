import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, Menu, X, Star } from "lucide-react";
import { navLinks } from "../data/mock";

const Logo = () => (
  <Link to="/" className="flex items-center gap-1 select-none">
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="text-primary">
      <path d="M12 20c-1-5-4-7-8-8 3-1 5-3 5-7 1 3 2 4 3 5 1-1 2-2 3-5 0 4 2 6 5 7-4 1-7 3-8 8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
    <span className="font-display font-extrabold text-2xl tracking-tight text-white lowercase">adurite</span>
  </Link>
);

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
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
                  className="text-sm font-medium text-gray-200 hover:text-primary transition-colors"
                >
                  {l}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-white bg-primary hover:bg-primary/90 transition-colors rounded-lg px-4 h-11">
              USD ($) <ChevronDown size={15} />
            </button>
            <a
              href="#discord"
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
        <div className="hidden md:flex items-center justify-center gap-3 pb-3 text-sm text-gray-300">
          <span>Our customers say</span>
          <span className="flex gap-0.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className="bg-[#00b67a] w-5 h-5 flex items-center justify-center rounded-[3px]">
                <Star size={12} className="fill-white text-white" />
              </span>
            ))}
          </span>
          <span className="font-semibold text-white">4.2 out of 5</span>
          <span className="text-gray-400">based on 1204 reviews</span>
          <span className="flex items-center gap-1 font-semibold text-white">
            <Star size={14} className="fill-[#00b67a] text-[#00b67a]" /> Trustpilot
          </span>
        </div>
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
