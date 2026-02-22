// assembly.schema.ts
import { z } from "zod";

// Schema for starting a step (now uses id_order_item instead of id_order)
// unit_number is required to track individual units within an order item
export const startStepSchema = z.object({
  id_order_item: z.string({ message: "Order Item ID is required" }),
  id_step: z.number({ message: "Step ID is required" }).min(1).max(6),
  unit_number: z.number({ message: "Unit number is required" }).min(1).default(1),
  scanned_by: z.string().nullable().optional(),
  barcode: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

// Schema for completing a step
export const completeStepSchema = z.object({
  id_progress: z.string({ message: "Progress ID is required" }),
});

// Schema for bulk operations (all items in an order)
export const startStepForAllItemsSchema = z.object({
  id_order: z.string({ message: "Order ID is required" }),
  id_step: z.number({ message: "Step ID is required" }).min(1).max(6),
});

export const completeStepForAllItemsSchema = z.object({
  id_order: z.string({ message: "Order ID is required" }),
  id_step: z.number({ message: "Step ID is required" }).min(1).max(6),
});

// Type exports
export type StartStepSchemaType = z.infer<typeof startStepSchema>;
export type CompleteStepSchemaType = z.infer<typeof completeStepSchema>;
export type StartStepForAllItemsSchemaType = z.infer<typeof startStepForAllItemsSchema>;
export type CompleteStepForAllItemsSchemaType = z.infer<typeof completeStepForAllItemsSchema>;
