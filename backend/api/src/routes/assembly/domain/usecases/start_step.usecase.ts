// start_step.usecase.ts
import type { CreateItemProgressEntity, ItemProgressEntity } from "../entities/order_progress.entity";
import type { AssemblyDomainRepository } from "../repositories/assembly.domain.repository";
import { BadRequestError } from "@/core/errors/custom.error";

export class StartStepUsecase {
  private readonly _repository: AssemblyDomainRepository;

  constructor(repository: AssemblyDomainRepository) {
    this._repository = repository;
  }

  async execute(progress: CreateItemProgressEntity): Promise<ItemProgressEntity> {
    // Check if this step is already in progress for this specific unit (not completed)
    const currentStep = await this._repository.getCurrentStepForUnit(
      progress.id_order_item, 
      progress.unit_number
    );
    
    if (currentStep && !currentStep.completed_at) {
      throw new BadRequestError("A step is already in progress for this unit. Complete it first.");
    }

    // Check if previous step is completed for this specific unit
    if (progress.id_step > 1) {
      const allProgress = await this._repository.getItemProgress(progress.id_order_item);
      const previousStep = allProgress.find(
        p => p.id_step === progress.id_step - 1 && p.unit_number === progress.unit_number
      );
      
      if (!previousStep || !previousStep.completed_at) {
        throw new BadRequestError("Previous step must be completed first for this unit");
      }
    }

    return this._repository.startStep(progress);
  }
}
