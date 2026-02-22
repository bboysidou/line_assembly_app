import { z } from "zod";

export const OrderStatusEnum = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export type OrderStatusEnumType =
  (typeof OrderStatusEnum)[keyof typeof OrderStatusEnum];
export const OrderStatusEnumList = Object.values(OrderStatusEnum);

// Base schema with all fields
export const orderSchema = z.object({
  id_order: z.string({ message: "ID is required" }),
  id_client: z.string().nullable().optional(),
  order_number: z.string().min(1, "Order number is required"),
  product_name: z.string().min(1, "Product name is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  status: z.enum(OrderStatusEnumList),
  notes: z.string().nullable().optional(),
  client_name: z.string().nullable().optional(),
  items_count: z.number().optional(),
  total_quantity: z.number().optional(),
  units_in_progress: z.number().optional(),
  units_completed: z.number().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

// Schema for creating new orders (order_number and status are auto-set by backend)
// product_name and quantity are now in order_items, so they're optional here
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
