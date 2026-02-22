// delete_all_order_items_by_order_id.usecase.ts
import type { OrderItemsDomainRepository } from "../repositories/order_items.domain.repository";

export class DeleteAllOrderItemsByOrderIdUsecase {
  private readonly _repository: OrderItemsDomainRepository;

  constructor(repository: OrderItemsDomainRepository) {
    this._repository = repository;
  }

  async execute(id_order: string): Promise<void> {
    return this._repository.deleteAllOrderItemsByOrderId(id_order);
  }
}
