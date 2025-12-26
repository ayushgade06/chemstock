import api from "./axios";

export const getInventory = async () => {
  const res = await api.get("/inventory");
  return res.data;
};

export const updateStock = async ({ product_id, quantity, type }) => {
  const res = await api.post("/inventory/update", {
    productId: product_id,
    quantity,
    type,
  });
  return res.data;
};
