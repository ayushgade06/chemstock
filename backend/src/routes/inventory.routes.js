import express from "express";
import { getInventory, updateStock } from "../controllers/inventory.controller.js";

const router = express.Router();

router.get("/", getInventory);
router.post("/update", updateStock);

export default router;
