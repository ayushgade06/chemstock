import prisma from "../services/prisma.js";
import { createProductSchema } from "../validators/product.schema.js";

export const getProducts = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      include: { inventory: true },
    });
    res.json(products);
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { productName, casNumber, unit } = req.body;

    const existing = await prisma.product.findUnique({
      where: { casNumber },
    });

    if (existing) {
      return res.status(400).json({
        message: `CAS Number ${casNumber} already exists`,
      });
    }

    const product = await prisma.product.create({
      data: {
        productName,
        casNumber,
        unit,
        inventory: {
          create: { currentStock: 0 },
        },
      },
    });

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({ where: { id } });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const data = createProductSchema.parse(req.body);

    const updated = await prisma.product.update({
      where: { id },
      data: {
        productName: data.productName,
        casNumber: data.casNumber,
        unit: data.unit,
      },
    });

    res.json(updated);
  } catch (err) {
    next(err); 
  }
};