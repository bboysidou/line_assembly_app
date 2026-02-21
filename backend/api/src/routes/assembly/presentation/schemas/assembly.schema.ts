// assembly.schema.ts
import { z } from "zod";

// Schema for starting a step
export const startStepSchema = z.object({
  id_order: z.string({ message: "Order ID is required" }),
  id_step: z.number({ message: "Step ID is required" }).min(1).max(6),
  scanned_by: z.string().optional(),
  barcode: z.string().optional(),
  notes: z.string().optional(),
});

// Schema for completing a step
export const completeStepSchema = z.object({
  id_progress: z.string({ message: "Progress ID is required" }),
});

// Type exports
export type StartStepSchemaType = z.infer<typeof startStepSchema>;
export type CompleteStepSchemaType = z.infer<typeof completeStepSchema>;
