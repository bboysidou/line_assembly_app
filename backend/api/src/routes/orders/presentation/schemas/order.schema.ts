// order.schema.ts
import { z } from "zod";

// Base schema with all fields
export const orderSchema = z.object({
  id_order: z.string({ message: "ID is required" }),
  id_client: z.string({ message: "Client is required" }),
  order_number: z.string({ message: "Order number is required" }),
  product_name: z.string({ message: "Product name is required" }),
  quantity: z.number({ message: "Quantity is required" }).min(1, "Quantity must be at least 1"),
  status: z.enum(["pending", "in_progress", "completed", "cancelled"]).default("pending"),
  notes: z.string().nullable().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

// Schema for creating new orders (order_number and status are auto-set)
export const createOrderSchema = z.object({
  id_client: z.string({ message: "Client is required" }).min(1, "Client is required"),
  notes: z.string().nullable().optional(),
});

// Schema for updating orders (includes id, excludes timestamps)
// Make order_number nullable to handle legacy data
export const updateOrderSchema = orderSchema.extend({
  order_number: z.string().nullable().optional(),
}).omit({
  created_at: true,
  updated_at: true,
});

// Schema for delete operations (only id)
export const deleteOrderSchema = orderSchema.pick({
  id_order: true,
});

// Type exports for TypeScript
export type OrderSchemaType = z.infer<typeof orderSchema>;
export type CreateOrderSchemaType = z.infer<typeof createOrderSchema>;
export type UpdateOrderSchemaType = z.infer<typeof updateOrderSchema>;
export type DeleteOrderSchemaType = z.infer<typeof deleteOrderSchema>;
