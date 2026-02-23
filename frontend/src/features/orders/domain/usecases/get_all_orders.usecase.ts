import type { PaginatedOrdersResponse } from "../repositories/orders.domain.repository";
import type { OrdersDomainRepository } from "../repositories/orders.domain.repository";

export class GetAllOrdersUsecase {
  private readonly _repository: OrdersDomainRepository;

  constructor(repository: OrdersDomainRepository) {
    this._repository = repository;
  }

  async execute(page: number = 1, limit: number = 10): Promise<PaginatedOrdersResponse> {
    return this._repository.getAllOrders(page, limit);
  }
}
