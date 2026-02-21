// get_order_by_id.usecase.ts
import type { OrderEntity } from "../entities/order.entity";
import type { OrdersDomainRepository } from "../repositories/orders.domain.repository";

export class GetOrderByIdUsecase {
  private readonly _repository: OrdersDomainRepository;

  constructor(repository: OrdersDomainRepository) {
    this._repository = repository;
  }

  async execute(id_order: string): Promise<OrderEntity> {
    return this._repository.getOrderById(id_order);
  }
}
