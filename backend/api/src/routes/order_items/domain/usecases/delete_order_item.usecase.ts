// delete_order_item.usecase.ts
import type { OrderItemsDomainRepository } from "../repositories/order_items.domain.repository";

export class DeleteOrderItemUsecase {
  private readonly _repository: OrderItemsDomainRepository;

  constructor(repository: OrderItemsDomainRepository) {
    this._repository = repository;
  }

  async execute(id_order_item: string): Promise<void> {
    return this._repository.deleteOrderItem(id_order_item);
  }
}
