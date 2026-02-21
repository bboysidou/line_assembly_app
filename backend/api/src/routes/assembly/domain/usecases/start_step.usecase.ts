// start_step.usecase.ts
import type { CreateOrderProgressEntity, OrderProgressEntity } from "../entities/order_progress.entity";
import type { AssemblyDomainRepository } from "../repositories/assembly.domain.repository";
import { BadRequestError } from "@/core/errors/custom.error";

export class StartStepUsecase {
  private readonly _repository: AssemblyDomainRepository;

  constructor(repository: AssemblyDomainRepository) {
    this._repository = repository;
  }

  async execute(progress: CreateOrderProgressEntity): Promise<OrderProgressEntity> {
    // Check if this step is already in progress (not completed)
    const currentStep = await this._repository.getCurrentStep(progress.id_order);
    
    if (currentStep && !currentStep.completed_at) {
      throw new BadRequestError("A step is already in progress. Complete it first.");
    }

    // Check if previous step is completed
    if (progress.id_step > 1) {
      const allProgress = await this._repository.getOrderProgress(progress.id_order);
      const previousStep = allProgress.find(p => p.id_step === progress.id_step - 1);
      
      if (!previousStep || !previousStep.completed_at) {
        throw new BadRequestError("Previous step must be completed first");
      }
    }

    return this._repository.startStep(progress);
  }
}
