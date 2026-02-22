// start_step_for_all_items.usecase.ts
import type { ItemProgressEntity } from "../entities/order_progress.entity";
import type { AssemblyDomainRepository } from "../repositories/assembly.domain.repository";

export class StartStepForAllItemsUsecase {
  private readonly _repository: AssemblyDomainRepository;

  constructor(repository: AssemblyDomainRepository) {
    this._repository = repository;
  }

  async execute(id_order: string, id_step: number): Promise<ItemProgressEntity[]> {
    return this._repository.startStepForAllItems(id_order, id_step);
  }
}
