import { z } from "zod";

// Base schema with all fields
export const orderItemSchema = z.object({
  id_order_item: z.string({ message: "ID is required" }),
  id_order: z.string({ message: "Order ID is required" }),
  product_name: z.string({ message: "Product name is required" }),
  quantity: z.number({ message: "Quantity is required" }).min(1, "Quantity must be at least 1"),
  notes: z.string().nullable().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

// Schema for creating new order items (used in form)
export const createOrderItemFormSchema = z.object({
  product_name: z.string({ message: "Product name is required" }).min(1, "Product name is required"),
  quantity: z.number({ message: "Quantity is required" }).min(1, "Quantity must be at least 1"),
  notes: z.string().nullable().optional(),
});

// Schema for creating multiple order items
export const createMultipleOrderItemsSchema = z.object({
  id_order: z.string({ message: "Order ID is required" }),
  items: z.array(createOrderItemFormSchema).min(1, "At least one item is required"),
});

// Schema for updating order items
export const updateOrderItemSchema = orderItemSchema.omit({
  created_at: true,
  updated_at: true,
});

// Type exports for TypeScript
export type OrderItemSchemaType = z.infer<typeof orderItemSchema>;
export type CreateOrderItemFormSchemaType = z.infer<typeof createOrderItemFormSchema>;
export type CreateMultipleOrderItemsSchemaType = z.infer<typeof createMultipleOrderItemsSchema>;
export type UpdateOrderItemSchemaType = z.infer<typeof updateOrderItemSchema>;
