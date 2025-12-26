import { z } from "zod";

export const createProductSchema = z.object({
  productName: z.string().min(1),
  casNumber: z.string().min(1),
  unit: z.enum(["KG", "MT", "LITRE"]),
});
