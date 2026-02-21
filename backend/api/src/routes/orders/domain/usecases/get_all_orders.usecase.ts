// get_all_orders.usecase.ts
import type { OrderEntity } from "../entities/order.entity";
import type { OrdersDomainRepository } from "../repositories/orders.domain.repository";

export class GetAllOrdersUsecase {
  private readonly _repository: OrdersDomainRepository;

  constructor(repository: OrdersDomainRepository) {
    this._repository = repository;
  }

  async execute(): Promise<OrderEntity[]> {
    return this._repository.getAllOrders();
  }
}
