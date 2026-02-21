// orders.domain.repository.ts
import type {
  CreateOrderEntity,
  UpdateOrderEntity,
  OrderEntity,
} from "../entities/order.entity";

export interface OrdersDomainRepository {
  // Query Operations (Read)
  getAllOrders(): Promise<OrderEntity[]>;
  getOrderById(id_order: string): Promise<OrderEntity>;
  getOrdersByClient(id_client: string): Promise<OrderEntity[]>;
  getOrdersByStatus(status: string): Promise<OrderEntity[]>;

  // Command Operations (Write)
  createOrder(order: CreateOrderEntity): Promise<OrderEntity>;
  updateOrder(order: UpdateOrderEntity): Promise<OrderEntity>;
  deleteOrder(id_order: string): Promise<void>;
}
