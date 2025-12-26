import React, { useState, useEffect } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/products.api";

const ProductScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    product_name: "",
    cas_number: "",
    unit: "KG",
  });

  const [editingId, setEditingId] = useState(null);


  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();

      const normalized = data.map((p) => ({
        id: p.id,
        product_name: p.productName,
        cas_number: p.casNumber,
        unit: p.unit,
      }));

      setProducts(normalized);
      setError(null);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  //form handlers
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateProduct(editingId, formData);
        setEditingId(null);
      } else {
        await createProduct(formData);
      }

      setFormData({ product_name: "", cas_number: "", unit: "KG" });
      fetchProducts();
      setError(null);
    } catch (err) {
      setError(err?.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure? This will also remove inventory data for this product."
      )
    )
      return;

    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (err) {
      setError(err?.response?.data?.message || "Delete failed");
    }
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      product_name: product.product_name,
      cas_number: product.cas_number,
      unit: product.unit,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ product_name: "", cas_number: "", unit: "KG" });
  };

  // UI
  return (
    <div className="space-y-8 transition-all duration-500">
      <div className="bg-white shadow-sm ring-1 ring-slate-900/5 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          {editingId ? "Edit Chemical Product" : "Add New Chemical Product"}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
        >
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Product Name
            </label>
            <input
              type="text"
              name="product_name"
              required
              value={formData.product_name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
              placeholder="e.g. Sodium Chloride"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              CAS Number
            </label>
            <input
              type="text"
              name="cas_number"
              required
              value={formData.cas_number}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
              placeholder="e.g. 7647-14-5"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Unit
            </label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              {["KG", "MT", "LITRE"].map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-sm"
            >
              {editingId ? "Update" : "Add Product"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-semibold text-sm"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-slate-900/5 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-900">
            Registered Chemicals
          </h2>
          <span className="text-xs font-medium text-slate-400">
            {products.length} Products
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                  CAS Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                  Unit
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-slate-400 italic"
                  >
                    No products registered.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {product.product_name}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">
                        {product.cas_number}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {product.unit}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => startEdit(product)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4 font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-900 font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductScreen;
