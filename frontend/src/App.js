import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CurrencyProvider } from "./context/CurrencyContext";
import Home from "./pages/Home";
import ItemDetail from "./pages/ItemDetail";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin";
import Orders from "./pages/Orders";

function App() {
  return (
    <div className="App">
      <CurrencyProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/item/:id" element={<ItemDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </BrowserRouter>
      </CurrencyProvider>
    </div>
  );
}

export default App;
