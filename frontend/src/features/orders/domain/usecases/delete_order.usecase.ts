import type { OrdersDomainRepository } from "../repositories/orders.domain.repository";

export class DeleteOrderUsecase {
  private readonly _repository: OrdersDomainRepository;

  constructor(repository: OrdersDomainRepository) {
    this._repository = repository;
  }

  async execute(id_order: string): Promise<void> {
    return this._repository.deleteOrder(id_order);
  }
}
