import React, { useState } from "react";

const Footer = () => {
  const [agreed, setAgreed] = useState(false);
  return (
    <footer className="mt-16 border-t border-border bg-[#0b0b0e]">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="font-display font-extrabold text-xl text-white lowercase mb-3">adurite</div>
            <p className="text-sm text-gray-400 leading-relaxed">The #1 gaming item marketplace. Buy &amp; sell limited in-game items from verified sellers.</p>
          </div>
          {[
            { h: "Marketplace", items: ["Limiteds", "Toy Codes", "CS2", "Rust"] },
            { h: "Company", items: ["About", "Affiliate", "Blog", "Careers"] },
            { h: "Support", items: ["Help Center", "Contact", "Terms", "Privacy"] },
          ].map((col) => (
            <div key={col.h}>
              <div className="text-sm font-semibold text-white mb-3">{col.h}</div>
              <ul className="space-y-2">
                {col.items.map((it) => (
                  <li key={it}>
                    <a href="#" className="text-sm text-gray-400 hover:text-primary transition-colors">{it}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-[#101014] p-5 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-primary">&#9888;</span>
              <span className="font-semibold text-white text-sm">Notice</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              This site is a community-led player-to-player marketplace demo and is not sponsored by, affiliated with, approved by, or authorized by ROBLOX Corporation. All trades are operated between users.
            </p>
          </div>
          <button
            onClick={() => setAgreed(true)}
            className={`shrink-0 rounded-lg px-6 h-11 text-sm font-semibold transition-colors ${agreed ? "bg-[#00b67a] text-white" : "bg-primary hover:bg-primary/90 text-white"}`}
          >
            {agreed ? "Agreed" : "I Agree"}
          </button>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Adurite Clone. Demo build for educational purposes. Not affiliated with Roblox Corporation.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
