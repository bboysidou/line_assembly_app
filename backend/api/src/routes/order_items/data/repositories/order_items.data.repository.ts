// order_items.data.repository.ts
import {
  BadRequestError,
  InternalServerError,
} from "@/core/errors/custom.error";
import type {
  CreateOrderItemEntity,
  UpdateOrderItemEntity,
  OrderItemEntity,
} from "../../domain/entities/order_item.entity";
import type { OrderItemsDomainRepository } from "../../domain/repositories/order_items.domain.repository";
import { CreateOrderItemRemoteDataSource } from "../datasources/remote/create_order_item.remote.datasource";
import { CreateMultipleOrderItemsRemoteDataSource } from "../datasources/remote/create_multiple_order_items.remote.datasource";
import { GetAllOrderItemsByOrderIdRemoteDataSource } from "../datasources/remote/get_all_order_items_by_order_id.remote.datasource";
import { UpdateOrderItemRemoteDataSource } from "../datasources/remote/update_order_item.remote.datasource";
import { DeleteOrderItemRemoteDataSource } from "../datasources/remote/delete_order_item.remote.datasource";
import { DeleteAllOrderItemsByOrderIdRemoteDataSource } from "../datasources/remote/delete_all_order_items_by_order_id.remote.datasource";

export class OrderItemsDataRepository implements OrderItemsDomainRepository {
  // Query Operations
  async getAllOrderItemsByOrderId(id_order: string): Promise<OrderItemEntity[]> {
    try {
      return await GetAllOrderItemsByOrderIdRemoteDataSource(id_order);
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestError) {
        throw new BadRequestError(error.message);
      }
      throw new InternalServerError("An error occurred");
    }
  }

  async getOrderItemById(id_order_item: string): Promise<OrderItemEntity> {
    // This would need a separate datasource, but for simplicity we can add it
    // For now, throw not implemented
    throw new Error("Method not implemented. Use getAllOrderItemsByOrderId instead.");
  }

  // Command Operations
  async createOrderItem(orderItem: CreateOrderItemEntity): Promise<OrderItemEntity> {
    try {
      return await CreateOrderItemRemoteDataSource(orderItem);
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestError) {
        throw new BadRequestError(error.message);
      }
      throw new InternalServerError("An error occurred");
    }
  }

  async createMultipleOrderItems(orderItems: CreateOrderItemEntity[]): Promise<OrderItemEntity[]> {
    try {
      return await CreateMultipleOrderItemsRemoteDataSource(orderItems);
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestError) {
        throw new BadRequestError(error.message);
      }
      throw new InternalServerError("An error occurred");
    }
  }

  async updateOrderItem(orderItem: UpdateOrderItemEntity): Promise<OrderItemEntity> {
    try {
      return await UpdateOrderItemRemoteDataSource(orderItem);
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestError) {
        throw new BadRequestError(error.message);
      }
      throw new InternalServerError("An error occurred");
    }
  }

  async deleteOrderItem(id_order_item: string): Promise<void> {
    try {
      await DeleteOrderItemRemoteDataSource(id_order_item);
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestError) {
        throw new BadRequestError(error.message);
      }
      throw new InternalServerError("An error occurred");
    }
  }

  async deleteAllOrderItemsByOrderId(id_order: string): Promise<void> {
    try {
      await DeleteAllOrderItemsByOrderIdRemoteDataSource(id_order);
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestError) {
        throw new BadRequestError(error.message);
      }
      throw new InternalServerError("An error occurred");
    }
  }
}
