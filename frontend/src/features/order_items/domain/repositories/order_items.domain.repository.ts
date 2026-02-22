// order_items.domain.repository.ts
import type {
  CreateOrderItemEntity,
  UpdateOrderItemEntity,
  OrderItemEntity,
} from "../entities/order_item.entity";

export interface OrderItemsDomainRepository {
  // Query Operations (Read)
  getAllOrderItemsByOrderId(id_order: string): Promise<OrderItemEntity[]>;

  // Command Operations (Write)
  createOrderItem(orderItem: CreateOrderItemEntity): Promise<OrderItemEntity>;
  createMultipleOrderItems(orderItems: CreateOrderItemEntity[]): Promise<OrderItemEntity[]>;
  updateOrderItem(orderItem: UpdateOrderItemEntity): Promise<OrderItemEntity>;
  deleteOrderItem(id_order_item: string): Promise<void>;
}
