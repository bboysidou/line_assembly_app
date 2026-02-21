import type {
  CreateOrderEntity,
  UpdateOrderEntity,
  OrderEntity,
} from "../../domain/entities/order.entity";
import type { OrdersDomainRepository } from "../../domain/repositories/orders.domain.repository";
import type { OrdersRemoteDataSource } from "../datasources/orders.remote.datasource";

export class OrdersDataRepository implements OrdersDomainRepository {
  private readonly _remoteDataSource: OrdersRemoteDataSource;

  constructor(remoteDataSource: OrdersRemoteDataSource) {
    this._remoteDataSource = remoteDataSource;
  }

  async getAllOrders(): Promise<OrderEntity[]> {
    try {
      return await this._remoteDataSource.onGetAllOrders();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  async getOrderById(id_order: string): Promise<OrderEntity> {
    try {
      return await this._remoteDataSource.onGetOrderById(id_order);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  async createOrder(order: CreateOrderEntity): Promise<OrderEntity> {
    try {
      return await this._remoteDataSource.onCreateOrder(order);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  async updateOrder(order: UpdateOrderEntity): Promise<OrderEntity> {
    try {
      return await this._remoteDataSource.onUpdateOrder(order);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  async deleteOrder(id_order: string): Promise<OrderEntity> {
    try {
      return await this._remoteDataSource.onDeleteOrder(id_order);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }
}
