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
    <img src="/adurite-logo.png" alt="adurite" className="h-9 w-auto" />
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
            <nav className="hidden lg:flex items-center gap-8 lg:ml-20">
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/></svg>
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
