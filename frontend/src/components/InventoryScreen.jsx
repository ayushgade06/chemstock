import React, { useState, useEffect } from "react";
import { getInventory, updateStock } from "../api/inventory.api";

const InventoryScreen = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [stockForm, setStockForm] = useState({
    product_id: "",
    quantity: "",
    type: "IN",
  });

  // fetch inventory
  const fetchInventory = async () => {
    try {
      setLoading(true);
      const data = await getInventory();

      const normalized = data.map((item) => ({
        id: item.id,
        product_id: item.product_id,
        product_name: item.product_name,
        cas_number: item.cas_number,
        unit: item.unit,
        current_stock: item.current_stock,
      }));

      setInventory(normalized);
      setError(null);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // stock update
  const handleStockSubmit = async (e) => {
    e.preventDefault();

    if (!stockForm.product_id) {
      setError("Please select a product.");
      return;
    }

    const qty = parseFloat(stockForm.quantity);
    if (isNaN(qty) || qty <= 0) {
      setError("Please enter a valid positive quantity.");
      return;
    }

    try {
      await updateStock({
        product_id: stockForm.product_id,
        quantity: qty,
        type: stockForm.type,
      });

      setStockForm({ product_id: "", quantity: "", type: "IN" });
      fetchInventory();
      setError(null);
    } catch (err) {
      setError(err?.response?.data?.message || "Stock update failed");
    }
  };

  // ui
  return (
    <div className="space-y-8 transition-all duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white shadow-sm ring-1 ring-slate-900/5 rounded-xl p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
              Stock Update
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleStockSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Select Product
                </label>
                <select
                  value={stockForm.product_id}
                  onChange={(e) =>
                    setStockForm({
                      ...stockForm,
                      product_id: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value="">-- Choose Product --</option>
                  {inventory.map((item) => (
                    <option key={item.id} value={item.product_id}>
                      {item.product_name} ({item.cas_number})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Quantity
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={stockForm.quantity}
                  onChange={(e) =>
                    setStockForm({
                      ...stockForm,
                      quantity: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Action Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setStockForm({ ...stockForm, type: "IN" })
                    }
                    className={`py-2 px-4 rounded-lg text-sm font-semibold transition-all border ${
                      stockForm.type === "IN"
                        ? "bg-green-600 text-white border-green-600 shadow-md"
                        : "bg-white text-slate-600 border-slate-200 hover:border-green-200"
                    }`}
                  >
                    Stock IN (+)
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setStockForm({ ...stockForm, type: "OUT" })
                    }
                    className={`py-2 px-4 rounded-lg text-sm font-semibold transition-all border ${
                      stockForm.type === "OUT"
                        ? "bg-orange-600 text-white border-orange-600 shadow-md"
                        : "bg-white text-slate-600 border-slate-200 hover:border-orange-200"
                    }`}
                  >
                    Stock OUT (-)
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-lg text-white font-bold text-sm shadow-sm transition-all ${
                  stockForm.type === "IN"
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-slate-800 hover:bg-slate-900"
                }`}
              >
                Confirm {stockForm.type === "IN" ? "Addition" : "Deduction"}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white shadow-sm ring-1 ring-slate-900/5 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                      CAS No.
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">
                      Stock Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                      Unit
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 bg-white">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-10 text-center text-slate-400"
                      >
                        Loading inventory...
                      </td>
                    </tr>
                  ) : inventory.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-10 text-center text-slate-400 italic"
                      >
                        No inventory records found.
                      </td>
                    </tr>
                  ) : (
                    inventory.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4 font-bold text-slate-900">
                          {item.product_name}
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-sm">
                          {item.cas_number}
                        </td>
                        <td
                          className={`px-6 py-4 text-right font-mono font-semibold ${
                            item.current_stock < 10
                              ? "text-red-600"
                              : "text-slate-900"
                          }`}
                        >
                          {item.current_stock.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-slate-400">
                          {item.unit}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
              <p className="text-xs text-slate-400">
                <span className="inline-block w-2 h-2 rounded-full bg-red-600 mr-1"></span>
                Values in red indicate stock levels below 10 units.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryScreen;