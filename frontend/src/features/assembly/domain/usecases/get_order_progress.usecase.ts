import type { OrderProgressEntity } from "../entities/order_progress.entity";
import type { AssemblyDomainRepository } from "../repositories/assembly.domain.repository";

export class GetOrderProgressUsecase {
  private readonly _repository: AssemblyDomainRepository;

  constructor(repository: AssemblyDomainRepository) {
    this._repository = repository;
  }

  async execute(id_order: string): Promise<OrderProgressEntity[]> {
    return this._repository.getOrderProgress(id_order);
  }
}
