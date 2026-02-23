// get_order_items_with_progress.usecase.ts
import type { OrderItemWithProgressType } from "@/routes/order_items/domain/entities/order_item_with_progress.entity";
import type { OrdersDomainRepository } from "../repositories/orders.domain.repository";

export class GetOrderItemsWithProgressUsecase {
  private readonly _repository: OrdersDomainRepository;

  constructor(repository: OrdersDomainRepository) {
    this._repository = repository;
  }

  async execute(id_order: string): Promise<OrderItemWithProgressType[]> {
    return this._repository.getOrderItemsWithProgress(id_order);
  }
}
