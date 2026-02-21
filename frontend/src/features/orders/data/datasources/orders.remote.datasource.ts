import { httpPublic } from "@/core/http/http";
import type {
  CreateOrderEntity,
  UpdateOrderEntity,
  OrderEntity,
} from "../../domain/entities/order.entity";

const BASE_URL = "/orders";

export class OrdersRemoteDataSource {
  // GET all orders
  async onGetAllOrders(): Promise<OrderEntity[]> {
    try {
      return await httpPublic.get<OrderEntity[]>(`${BASE_URL}/`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  // GET order by ID
  async onGetOrderById(id_order: string): Promise<OrderEntity> {
    try {
      return await httpPublic.get<OrderEntity>(`${BASE_URL}/${id_order}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  // POST create order
  async onCreateOrder(order: CreateOrderEntity): Promise<OrderEntity> {
    try {
      return await httpPublic.post<CreateOrderEntity, OrderEntity>(
        `${BASE_URL}/create-order`,
        order,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  // PATCH update order
  async onUpdateOrder(order: UpdateOrderEntity): Promise<OrderEntity> {
    try {
      return await httpPublic.patch<UpdateOrderEntity, OrderEntity>(
        `${BASE_URL}/${order.id_order}`,
        order,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  // DELETE order
  async onDeleteOrder(id_order: string): Promise<OrderEntity> {
    try {
      return await httpPublic.delete<{ id_order: string }, OrderEntity>(
        `${BASE_URL}/${id_order}`,
        { id_order },
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }
}
