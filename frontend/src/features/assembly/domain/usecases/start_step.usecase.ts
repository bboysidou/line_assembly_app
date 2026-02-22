import type { ItemProgressEntity } from "../entities/item_progress.entity";
import type { AssemblyDomainRepository } from "../repositories/assembly.domain.repository";

export class StartStepUsecase {
  private readonly _repository: AssemblyDomainRepository;

  constructor(repository: AssemblyDomainRepository) {
    this._repository = repository;
  }

  async execute(
    id_order_item: string,
    id_step: number,
    unit_number: number,
    scanned_by?: string,
    barcode?: string,
    notes?: string,
  ): Promise<ItemProgressEntity> {
    return this._repository.startStep(id_order_item, id_step, unit_number, scanned_by, barcode, notes);
  }
}
