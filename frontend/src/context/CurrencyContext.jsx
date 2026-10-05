import React, { createContext, useContext, useEffect, useState } from "react";

// Base prices in the app are stored in USD. These static rates convert to display currency.
export const currencies = [
  { code: "USD", symbol: "$", rate: 1, label: "USD ($)" },
  { code: "EUR", symbol: "\u20ac", rate: 0.92, label: "EUR (\u20ac)" },
  { code: "GBP", symbol: "\u00a3", rate: 0.79, label: "GBP (\u00a3)" },
  { code: "CAD", symbol: "C$", rate: 1.37, label: "CAD (C$)" },
  { code: "AUD", symbol: "A$", rate: 1.52, label: "AUD (A$)" },
  { code: "INR", symbol: "\u20b9", rate: 83.3, label: "INR (\u20b9)" },
  { code: "BRL", symbol: "R$", rate: 5.1, label: "BRL (R$)" },
];

const CurrencyContext = createContext(null);

export const CurrencyProvider = ({ children }) => {
  const [code, setCode] = useState(() => localStorage.getItem("adurite_currency") || "USD");

  useEffect(() => {
    localStorage.setItem("adurite_currency", code);
  }, [code]);

  const current = currencies.find((c) => c.code === code) || currencies[0];

  const format = (usdAmount) => {
    const n = Number(usdAmount) * current.rate;
    const decimals = n % 1 ? 2 : (n < 1000 ? 2 : 0);
    const formatted = n.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: 2,
    });
    return `${current.symbol}${formatted}`;
  };

  return (
    <CurrencyContext.Provider value={{ code, setCode, current, currencies, format }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    // Fallback so components still render if used outside provider
    return {
      code: "USD",
      current: currencies[0],
      currencies,
      setCode: () => {},
      format: (n) => `$${Number(n).toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`,
    };
  }
  return ctx;
};
