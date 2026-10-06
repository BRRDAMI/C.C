import React from "react";

const STYLES = {
  BTC: { bg: "#F7931A", glyph: "₿" },
  LTC: { bg: "#345D9D", glyph: "Ł" },
  ETH: { bg: "#627EEA", glyph: "Ξ" },
  PAYPAL: { bg: "#1F4E8C", glyph: "P" },
};

const CoinIcon = ({ coin, size = 40 }) => {
  const s = STYLES[coin] || STYLES.PAYPAL;
  return (
    <span
      className="inline-flex items-center justify-center rounded-full font-bold text-white shrink-0"
      style={{ width: size, height: size, background: s.bg, fontSize: size * 0.5, fontFamily: "Poppins, Inter, sans-serif" }}
    >
      {s.glyph}
    </span>
  );
};

export default CoinIcon;
