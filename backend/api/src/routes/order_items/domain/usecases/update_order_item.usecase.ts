// update_order_item.usecase.ts
import type { UpdateOrderItemEntity, OrderItemEntity } from "../entities/order_item.entity";
import type { OrderItemsDomainRepository } from "../repositories/order_items.domain.repository";

export class UpdateOrderItemUsecase {
  private readonly _repository: OrderItemsDomainRepository;

  constructor(repository: OrderItemsDomainRepository) {
    this._repository = repository;
  }

  async execute(orderItem: UpdateOrderItemEntity): Promise<OrderItemEntity> {
    return this._repository.updateOrderItem(orderItem);
  }
}
