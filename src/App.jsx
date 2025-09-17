import React from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import PaymentForm from "./components/PaymentForm";
import Transactions from "./components/Transactions";
import './App.css';
import Home from "./components/Home";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        {/* Navbar */}
        <nav className="bg-white shadow-md p-4 flex gap-6">

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-semibold"
                : "text-gray-600 hover:text-blue-600"
            }
          >
            Create Payment
          </NavLink>

          <NavLink
            to="/paymentform"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-semibold"
                : "text-gray-600 hover:text-blue-600"
            }
          >
            Create Payment
          </NavLink>
          <NavLink
            to="/transactions"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-semibold"
                : "text-gray-600 hover:text-blue-600"
            }
          >
            Transactions
          </NavLink>
        </nav>

        {/* Main content */}
        <div className="p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/paymentform" element={<PaymentForm />} />
            <Route path="/transactions" element={<Transactions />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
