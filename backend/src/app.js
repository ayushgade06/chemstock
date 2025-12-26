import express from "express";
import cors from "cors";

import productRoutes from "./routes/products.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";
import errorHandler from "./middleware/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Routes
app.use("/api/products", productRoutes);
app.use("/api/inventory", inventoryRoutes);


// Global error handler
app.use(errorHandler);

export default app;
