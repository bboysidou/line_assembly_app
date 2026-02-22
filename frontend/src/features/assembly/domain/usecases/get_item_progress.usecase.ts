import type { ItemProgressEntity } from "../entities/item_progress.entity";
import type { AssemblyDomainRepository } from "../repositories/assembly.domain.repository";

export class GetItemProgressUsecase {
  private readonly _repository: AssemblyDomainRepository;

  constructor(repository: AssemblyDomainRepository) {
    this._repository = repository;
  }

  async execute(id_order_item: string): Promise<ItemProgressEntity[]> {
    return this._repository.getItemProgress(id_order_item);
  }
}
