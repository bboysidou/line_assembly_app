import type {
  CreateOrderEntity,
  UpdateOrderEntity,
  OrderEntity,
} from "../entities/order.entity";
import type { OrderItemWithProgressEntity } from "@/features/order_items/domain/entities/order_item_with_progress.entity";

export interface OrdersDomainRepository {
  // Query Operations (Read)
  getAllOrders(): Promise<OrderEntity[]>;
  getOrderById(id_order: string): Promise<OrderEntity>;
  getOrderItemsWithProgress(id_order: string): Promise<OrderItemWithProgressEntity[]>;

  // Command Operations (Write)
  createOrder(order: CreateOrderEntity): Promise<OrderEntity>;
  updateOrder(order: UpdateOrderEntity): Promise<OrderEntity>;
  deleteOrder(id_order: string): Promise<void>;
}
