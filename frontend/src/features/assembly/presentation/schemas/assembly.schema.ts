import { z } from "zod";

export const startStepSchema = z.object({
  id_order: z.string({ message: "Order ID is required" }),
  id_step: z
    .number({ message: "Step ID is required" })
    .min(1, "Step must be between 1 and 6")
    .max(6, "Step must be between 1 and 6"),
  scanned_by: z.string().optional(),
  barcode: z.string().optional(),
  notes: z.string().optional(),
});

export const completeStepSchema = z.object({
  id_progress: z.string({ message: "Progress ID is required" }),
});

export type StartStepSchemaType = z.infer<typeof startStepSchema>;
export type CompleteStepSchemaType = z.infer<typeof completeStepSchema>;
