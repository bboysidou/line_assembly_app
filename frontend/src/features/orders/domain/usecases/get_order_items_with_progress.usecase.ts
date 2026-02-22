import type { OrderItemWithProgressEntity } from "@/features/order_items/domain/entities/order_item_with_progress.entity";
import type { OrdersDomainRepository } from "../repositories/orders.domain.repository";

export class GetOrderItemsWithProgressUsecase {
  private readonly _repository: OrdersDomainRepository;

  constructor(repository: OrdersDomainRepository) {
    this._repository = repository;
  }

  async execute(id_order: string): Promise<OrderItemWithProgressEntity[]> {
    return this._repository.getOrderItemsWithProgress(id_order);
  }
}
