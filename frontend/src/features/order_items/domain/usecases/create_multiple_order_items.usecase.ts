// create_multiple_order_items.usecase.ts
import type { CreateOrderItemEntity, OrderItemEntity } from "../entities/order_item.entity";
import type { OrderItemsDomainRepository } from "../repositories/order_items.domain.repository";

export class CreateMultipleOrderItemsUsecase {
  private readonly _repository: OrderItemsDomainRepository;

  constructor(repository: OrderItemsDomainRepository) {
    this._repository = repository;
  }

  async execute(orderItems: CreateOrderItemEntity[]): Promise<OrderItemEntity[]> {
    return this._repository.createMultipleOrderItems(orderItems);
  }
}
