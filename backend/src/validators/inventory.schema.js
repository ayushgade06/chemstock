import { z } from "zod";

export const stockUpdateSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().positive(),
  type: z.enum(["IN", "OUT"]),
});
