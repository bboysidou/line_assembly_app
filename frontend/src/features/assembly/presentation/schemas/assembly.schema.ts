import { z } from "zod";

// Schema for starting a step on a single order item unit
// unit_number tracks individual units within an order item (e.g., unit 1 of 5)
export const startStepSchema = z.object({
  id_order_item: z.string({ message: "Order Item ID is required" }),
  id_step: z
    .number({ message: "Step ID is required" })
    .min(1, "Step must be between 1 and 6")
    .max(6, "Step must be between 1 and 6"),
  unit_number: z
    .number({ message: "Unit number is required" })
    .min(1, "Unit number must be at least 1")
    .default(1),
  scanned_by: z.string().nullable().optional(),
  barcode: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

// Schema for completing a step
export const completeStepSchema = z.object({
  id_progress: z.string({ message: "Progress ID is required" }),
});

// Schema for starting a step for all items in an order
export const startStepForAllItemsSchema = z.object({
  id_order: z.string({ message: "Order ID is required" }),
  id_step: z
    .number({ message: "Step ID is required" })
    .min(1, "Step must be between 1 and 6")
    .max(6, "Step must be between 1 and 6"),
  scanned_by: z.string().nullable().optional(),
  barcode: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

// Schema for completing a step for all items in an order
export const completeStepForAllItemsSchema = z.object({
  id_order: z.string({ message: "Order ID is required" }),
  id_step: z
    .number({ message: "Step ID is required" })
    .min(1, "Step must be between 1 and 6")
    .max(6, "Step must be between 1 and 6"),
});

// Type exports
export type StartStepSchemaType = z.infer<typeof startStepSchema>;
export type CompleteStepSchemaType = z.infer<typeof completeStepSchema>;
export type StartStepForAllItemsSchemaType = z.infer<typeof startStepForAllItemsSchema>;
export type CompleteStepForAllItemsSchemaType = z.infer<typeof completeStepForAllItemsSchema>;
