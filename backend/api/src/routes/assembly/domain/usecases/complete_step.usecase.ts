// complete_step.usecase.ts
import type { ItemProgressEntity } from "../entities/order_progress.entity";
import type { AssemblyDomainRepository } from "../repositories/assembly.domain.repository";

export class CompleteStepUsecase {
  private readonly _repository: AssemblyDomainRepository;

  constructor(repository: AssemblyDomainRepository) {
    this._repository = repository;
  }

  async execute(id_progress: string): Promise<ItemProgressEntity> {
    const progress = await this._repository.completeStep(id_progress);
    
    // If this was the last step (step 6), update order status to completed
    // This would typically be handled by the repository or a separate use case
    
    return progress;
  }
}
