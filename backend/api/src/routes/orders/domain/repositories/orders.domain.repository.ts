// orders.domain.repository.ts
import type {
  CreateOrderEntity,
  UpdateOrderEntity,
  OrderEntity,
} from "../entities/order.entity";
import type { OrderItemWithProgressType } from "@/routes/order_items/domain/entities/order_item_with_progress.entity";

// Pagination response type
export interface PaginatedOrdersResponse {
  data: OrderEntity[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface OrdersDomainRepository {
  // Query Operations (Read)
  getAllOrders(page?: number, limit?: number): Promise<PaginatedOrdersResponse>;
  getOrderById(id_order: string): Promise<OrderEntity>;
  getOrdersByClient(id_client: string): Promise<OrderEntity[]>;
  getOrdersByStatus(status: string): Promise<OrderEntity[]>;
  getOrderItemsWithProgress(id_order: string): Promise<OrderItemWithProgressType[]>;

  // Command Operations (Write)
  createOrder(order: CreateOrderEntity): Promise<OrderEntity>;
  updateOrder(order: UpdateOrderEntity): Promise<OrderEntity>;
  deleteOrder(id_order: string): Promise<void>;
}
