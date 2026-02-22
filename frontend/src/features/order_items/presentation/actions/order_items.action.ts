// order_items.action.ts
import {
  getAllOrderItemsByOrderIdUsecase,
  createMultipleOrderItemsUsecase,
} from "@/core/dependency_injections/order_items.di";
import { getOrderItemsWithProgressUsecase } from "@/core/dependency_injections/orders.di";
import type {
  OrderItemSchemaType,
  CreateOrderItemFormSchemaType,
} from "../schemas/order_item.schema";
import type { OrderItemWithProgressEntity } from "@/features/order_items/domain/entities/order_item_with_progress.entity";

// Query Keys - Export for use in components
export const orderItemKeys = {
  all: ["order-items"] as const,
  byOrder: (id_order: string) => [...["order-items"], "order", id_order] as const,
  withProgress: (id_order: string) => [...["order-items"], "progress", id_order] as const,
};

// Query Actions
export const onGetAllOrderItemsByOrderIdAction = async (
  id_order: string,
): Promise<OrderItemSchemaType[]> => {
  try {
    return await getAllOrderItemsByOrderIdUsecase.execute(id_order) as unknown as OrderItemSchemaType[];
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    throw new Error(message);
  }
};

export const onGetOrderItemsWithProgressAction = async (
  id_order: string,
): Promise<OrderItemWithProgressEntity[]> => {
  try {
    return await getOrderItemsWithProgressUsecase.execute(id_order);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    throw new Error(message);
  }
};

// Mutation Actions
export const onCreateMultipleOrderItemsAction = async (
  id_order: string,
  items: CreateOrderItemFormSchemaType[],
): Promise<OrderItemSchemaType[]> => {
  try {
    const orderItems = items.map(item => ({
      id_order,
      product_name: item.product_name,
      quantity: item.quantity,
      notes: item.notes ?? null,
    }));
    return await createMultipleOrderItemsUsecase.execute(orderItems) as unknown as OrderItemSchemaType[];
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    throw new Error(message);
  }
};
