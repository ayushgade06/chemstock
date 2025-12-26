import React from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

import ProductScreen from "./components/ProductScreen";
import InventoryScreen from "./components/InventoryScreen";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <div className="bg-indigo-600 p-2 rounded-lg mr-2">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                ChemStock
              </span>
            </div>

            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`${
                  isActive("/")
                    ? "border-indigo-500 text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
              >
                Inventory
              </Link>

              <Link
                to="/products"
                className={`${
                  isActive("/products")
                    ? "border-indigo-500 text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
              >
                Products
              </Link>
            </div>
          </div>
        </div>
      </div>


      {/* Mobile Nav */}
      <div className="sm:hidden border-t border-slate-100 flex divide-x divide-slate-100">
        <Link
          to="/"
          className="flex-1 py-3 text-center text-xs font-semibold text-slate-600"
        >
          Inventory
        </Link>
        <Link
          to="/products"
          className="flex-1 py-3 text-center text-xs font-semibold text-slate-600"
        >
          Products
        </Link>
      </div>
    </nav>
  );
};

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-grow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<InventoryScreen />} />
              <Route path="/products" element={<ProductScreen />} />
            </Routes>
          </div>
        </main>

        <footer className="bg-white border-t border-slate-200 py-4">
          <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-xs">
            &copy; {new Date().getFullYear()} ChemStock - Chemical Inventory
            Management
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
