// create_order_item.usecase.ts
import type { CreateOrderItemEntity, OrderItemEntity } from "../entities/order_item.entity";
import type { OrderItemsDomainRepository } from "../repositories/order_items.domain.repository";

export class CreateOrderItemUsecase {
  private readonly _repository: OrderItemsDomainRepository;

  constructor(repository: OrderItemsDomainRepository) {
    this._repository = repository;
  }

  async execute(orderItem: CreateOrderItemEntity): Promise<OrderItemEntity> {
    return this._repository.createOrderItem(orderItem);
  }
}
