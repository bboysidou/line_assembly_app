// get_item_progress.usecase.ts
import type { ItemProgressEntity } from "../entities/order_progress.entity";
import type { AssemblyDomainRepository } from "../repositories/assembly.domain.repository";

export class GetItemProgressUsecase {
  private readonly _repository: AssemblyDomainRepository;

  constructor(repository: AssemblyDomainRepository) {
    this._repository = repository;
  }

  async execute(id_order_item: string): Promise<(ItemProgressEntity & { step_name: string; step_order: number })[]> {
    return this._repository.getItemProgress(id_order_item);
  }
}

// Legacy alias for backward compatibility
export { GetItemProgressUsecase as GetOrderProgressUsecase };
