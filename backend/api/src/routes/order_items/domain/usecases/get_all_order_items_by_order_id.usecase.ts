// get_all_order_items_by_order_id.usecase.ts
import type { OrderItemEntity } from "../entities/order_item.entity";
import type { OrderItemsDomainRepository } from "../repositories/order_items.domain.repository";

export class GetAllOrderItemsByOrderIdUsecase {
  private readonly _repository: OrderItemsDomainRepository;

  constructor(repository: OrderItemsDomainRepository) {
    this._repository = repository;
  }

  async execute(id_order: string): Promise<OrderItemEntity[]> {
    return this._repository.getAllOrderItemsByOrderId(id_order);
  }
}
