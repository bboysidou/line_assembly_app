// update_order.usecase.ts
import type { UpdateOrderEntity, OrderEntity } from "../entities/order.entity";
import type { OrdersDomainRepository } from "../repositories/orders.domain.repository";

export class UpdateOrderUsecase {
  private readonly _repository: OrdersDomainRepository;

  constructor(repository: OrdersDomainRepository) {
    this._repository = repository;
  }

  async execute(order: UpdateOrderEntity): Promise<OrderEntity> {
    return this._repository.updateOrder(order);
  }
}
