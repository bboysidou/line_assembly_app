// orders.data.repository.ts
import {
  BadRequestError,
  InternalServerError,
} from "@/core/errors/custom.error";
import type {
  CreateOrderEntity,
  UpdateOrderEntity,
  OrderEntity,
} from "../../domain/entities/order.entity";
import type { OrdersDomainRepository, PaginatedOrdersResponse } from "../../domain/repositories/orders.domain.repository";
import type { OrderItemWithProgressType } from "@/routes/order_items/domain/entities/order_item_with_progress.entity";
import { CreateOrderRemoteDataSource } from "../datasources/remote/create_order.remote.datasource";
import { GetAllOrdersRemoteDataSource } from "../datasources/remote/get_all_orders.remote.datasource";
import { GetOrderByIdRemoteDataSource } from "../datasources/remote/get_order_by_id.remote.datasource";
import { UpdateOrderRemoteDataSource } from "../datasources/remote/update_order.remote.datasource";
import { DeleteOrderRemoteDataSource } from "../datasources/remote/delete_order.remote.datasource";
import { GetOrderItemsWithProgressRemoteDataSource } from "../datasources/remote/get_order_items_with_progress.remote.datasource";

export class OrdersDataRepository implements OrdersDomainRepository {
  async getAllOrders(page: number = 1, limit: number = 10): Promise<PaginatedOrdersResponse> {
    try {
      return await GetAllOrdersRemoteDataSource(page, limit);
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestError) {
        throw new BadRequestError(error.message);
      }
      throw new InternalServerError("An error occurred");
    }
  }

  async getOrderById(id_order: string): Promise<OrderEntity> {
    try {
      return await GetOrderByIdRemoteDataSource(id_order);
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestError) {
        throw new BadRequestError(error.message);
      }
      throw new InternalServerError("An error occurred");
    }
  }

  async getOrdersByClient(id_client: string): Promise<OrderEntity[]> {
    try {
      // Get all orders with a large limit to filter by client
      const result = await GetAllOrdersRemoteDataSource(1, 1000);
      return result.data.filter(order => order.id_client === id_client);
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestError) {
        throw new BadRequestError(error.message);
      }
      throw new InternalServerError("An error occurred");
    }
  }

  async getOrdersByStatus(status: string): Promise<OrderEntity[]> {
    try {
      // Get all orders with a large limit to filter by status
      const result = await GetAllOrdersRemoteDataSource(1, 1000);
      return result.data.filter(order => order.status === status);
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestError) {
        throw new BadRequestError(error.message);
      }
      throw new InternalServerError("An error occurred");
    }
  }

  async getOrderItemsWithProgress(id_order: string): Promise<OrderItemWithProgressType[]> {
    try {
      return await GetOrderItemsWithProgressRemoteDataSource(id_order);
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestError) {
        throw new BadRequestError(error.message);
      }
      throw new InternalServerError("An error occurred");
    }
  }

  async createOrder(order: CreateOrderEntity): Promise<OrderEntity> {
    try {
      return await CreateOrderRemoteDataSource(order);
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestError) {
        throw new BadRequestError(error.message);
      }
      throw new InternalServerError("An error occurred");
    }
  }

  async updateOrder(order: UpdateOrderEntity): Promise<OrderEntity> {
    try {
      return await UpdateOrderRemoteDataSource(order);
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestError) {
        throw new BadRequestError(error.message);
      }
      throw new InternalServerError("An error occurred");
    }
  }

  async deleteOrder(id_order: string): Promise<void> {
    try {
      await DeleteOrderRemoteDataSource(id_order);
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestError) {
        throw new BadRequestError(error.message);
      }
      throw new InternalServerError("An error occurred");
    }
  }
}
