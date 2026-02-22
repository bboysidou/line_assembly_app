// order_items.data.repository.ts
import type {
  CreateOrderItemEntity,
  UpdateOrderItemEntity,
  OrderItemEntity,
} from "../../domain/entities/order_item.entity";
import type { OrderItemsDomainRepository } from "../../domain/repositories/order_items.domain.repository";
import type { OrderItemsRemoteDataSource } from "../datasources/order_items.remote.datasource";

export class OrderItemsDataRepository implements OrderItemsDomainRepository {
  private readonly _remoteDataSource: OrderItemsRemoteDataSource;

  constructor(remoteDataSource: OrderItemsRemoteDataSource) {
    this._remoteDataSource = remoteDataSource;
  }

  async getAllOrderItemsByOrderId(id_order: string): Promise<OrderItemEntity[]> {
    try {
      return await this._remoteDataSource.onGetAllOrderItemsByOrderId(id_order);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  async createMultipleOrderItems(orderItems: CreateOrderItemEntity[]): Promise<OrderItemEntity[]> {
    try {
      if (orderItems.length === 0) return [];
      const id_order = orderItems[0].id_order;
      const items = orderItems.map(item => ({
        product_name: item.product_name,
        quantity: item.quantity,
        notes: item.notes,
      }));
      return await this._remoteDataSource.onCreateMultipleOrderItems(id_order, items);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  async createOrderItem(orderItem: CreateOrderItemEntity): Promise<OrderItemEntity> {
    try {
      const items = await this._remoteDataSource.onCreateMultipleOrderItems(
        orderItem.id_order,
        [{
          product_name: orderItem.product_name,
          quantity: orderItem.quantity,
          notes: orderItem.notes,
        }],
      );
      return items[0];
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  async updateOrderItem(orderItem: UpdateOrderItemEntity): Promise<OrderItemEntity> {
    try {
      return await this._remoteDataSource.onUpdateOrderItem(orderItem);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  async deleteOrderItem(id_order_item: string): Promise<void> {
    try {
      await this._remoteDataSource.onDeleteOrderItem(id_order_item);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }
}
