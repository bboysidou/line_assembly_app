// get_order_items_with_progress.usecase.ts
import type { OrderItemWithProgressType } from "@/routes/order_items/domain/entities/order_item_with_progress.entity";
import { GetOrderItemsWithProgressRemoteDataSource } from "../../data/datasources/remote/get_order_items_with_progress.remote.datasource";

export class GetOrderItemsWithProgressUsecase {
  async execute(id_order: string): Promise<OrderItemWithProgressType[]> {
    return GetOrderItemsWithProgressRemoteDataSource(id_order);
  }
}
