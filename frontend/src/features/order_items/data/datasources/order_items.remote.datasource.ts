// order_items.remote.datasource.ts
import { httpPublic } from "@/core/http/http";
import type {
  CreateOrderItemEntity,
  UpdateOrderItemEntity,
  OrderItemEntity,
} from "../../domain/entities/order_item.entity";

const BASE_URL = "/order-items";

export class OrderItemsRemoteDataSource {
  // GET all order items by order ID
  async onGetAllOrderItemsByOrderId(id_order: string): Promise<OrderItemEntity[]> {
    try {
      return await httpPublic.get<OrderItemEntity[]>(`${BASE_URL}/order/${id_order}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  // POST create multiple order items
  async onCreateMultipleOrderItems(
    id_order: string,
    items: Omit<CreateOrderItemEntity, "id_order">[],
  ): Promise<OrderItemEntity[]> {
    try {
      return await httpPublic.post<{ id_order: string; items: Omit<CreateOrderItemEntity, "id_order">[] }, OrderItemEntity[]>(
        `${BASE_URL}/batch`,
        { id_order, items },
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  // PATCH update order item
  async onUpdateOrderItem(orderItem: UpdateOrderItemEntity): Promise<OrderItemEntity> {
    try {
      return await httpPublic.patch<UpdateOrderItemEntity, OrderItemEntity>(
        `${BASE_URL}/${orderItem.id_order_item}`,
        orderItem,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  // DELETE order item
  async onDeleteOrderItem(id_order_item: string): Promise<void> {
    try {
      await httpPublic.delete<null, void>(`${BASE_URL}/${id_order_item}`, null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }
}
