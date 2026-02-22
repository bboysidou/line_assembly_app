// order_item.schema.ts
import { z } from "zod";

// Base schema with all fields
export const orderItemSchema = z.object({
  id_order_item: z.string({ message: "ID is required" }),
  id_order: z.string({ message: "Order ID is required" }),
  product_name: z.string({ message: "Product name is required" }),
  quantity: z.number({ message: "Quantity is required" }).min(1, "Quantity must be at least 1"),
  notes: z.string().nullable().default(null),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

// Schema for creating new order items
export const createOrderItemSchema = orderItemSchema.omit({
  id_order_item: true,
  created_at: true,
  updated_at: true,
});

// Schema for creating multiple order items
export const createMultipleOrderItemsSchema = z.object({
  id_order: z.string({ message: "Order ID is required" }),
  items: z.array(
    z.object({
      product_name: z.string({ message: "Product name is required" }),
      quantity: z.number({ message: "Quantity is required" }).min(1, "Quantity must be at least 1"),
      notes: z.string().nullable().default(null),
    })
  ).min(1, "At least one item is required"),
});

// Schema for updating order items
export const updateOrderItemSchema = orderItemSchema.omit({
  created_at: true,
  updated_at: true,
});

// Schema for delete operations
export const deleteOrderItemSchema = orderItemSchema.pick({
  id_order_item: true,
});

// Type exports for TypeScript
export type OrderItemSchemaType = z.infer<typeof orderItemSchema>;
export type CreateOrderItemSchemaType = z.infer<typeof createOrderItemSchema>;
export type CreateMultipleOrderItemsSchemaType = z.infer<typeof createMultipleOrderItemsSchema>;
export type UpdateOrderItemSchemaType = z.infer<typeof updateOrderItemSchema>;
export type DeleteOrderItemSchemaType = z.infer<typeof deleteOrderItemSchema>;
