import api from "./axios";

export const getProducts = async () => {
  const res = await api.get("/products");
  return res.data;
};

export const createProduct = async (data) => {
  const res = await api.post("/products", {
    productName: data.product_name,
    casNumber: data.cas_number,
    unit: data.unit,
  });
  return res.data;
};

export const updateProduct = async (id, data) => {
  const res = await api.put(`/products/${id}`, {
    productName: data.product_name,
    casNumber: data.cas_number,
    unit: data.unit,
  });
  return res.data;
};

export const deleteProduct = async (id) => {
  await api.delete(`/products/${id}`);
};
