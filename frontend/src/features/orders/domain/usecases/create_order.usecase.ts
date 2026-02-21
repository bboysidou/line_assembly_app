import type { CreateOrderEntity, OrderEntity } from "../entities/order.entity";
import type { OrdersDomainRepository } from "../repositories/orders.domain.repository";

export class CreateOrderUsecase {
  private readonly _repository: OrdersDomainRepository;

  constructor(repository: OrdersDomainRepository) {
    this._repository = repository;
  }

  async execute(order: CreateOrderEntity): Promise<OrderEntity> {
    return this._repository.createOrder(order);
  }
}
