import type { ItemProgressEntity } from "../entities/item_progress.entity";
import type { AssemblyDomainRepository } from "../repositories/assembly.domain.repository";

export class StartStepForAllItemsUsecase {
  private readonly _repository: AssemblyDomainRepository;

  constructor(repository: AssemblyDomainRepository) {
    this._repository = repository;
  }

  async execute(
    id_order: string,
    id_step: number,
    scanned_by?: string,
    barcode?: string,
    notes?: string,
  ): Promise<ItemProgressEntity[]> {
    return this._repository.startStepForAllItems(id_order, id_step, scanned_by, barcode, notes);
  }
}
