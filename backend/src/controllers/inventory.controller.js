import prisma from "../services/prisma.js";

export const getInventory = async (req, res, next) => {
  try {
    const inventory = await prisma.inventory.findMany({
      include: {
        product: true,
      },
    });

    const formatted = inventory.map((item) => ({
      id: item.id,
      product_id: item.productId,
      product_name: item.product.productName,
      cas_number: item.product.casNumber,
      unit: item.product.unit,
      current_stock: item.currentStock,
    }));

    res.json(formatted);
  } catch (err) {
    next(err);
  }
};

export const updateStock = async (req, res, next) => {
  try {
    const { productId, quantity, type } = req.body;

    const inventory = await prisma.inventory.findUnique({
      where: { productId },
    });

    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    let newStock = inventory.currentStock;

    if (type === "IN") {
      newStock += quantity;
    } else {
      if (inventory.currentStock < quantity) {
        return res.status(400).json({
          message: `Insufficient stock. Available: ${inventory.currentStock}`,
        });
      }
      newStock -= quantity;
    }

    const updated = await prisma.inventory.update({
      where: { productId },
      data: { currentStock: newStock },
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
};
