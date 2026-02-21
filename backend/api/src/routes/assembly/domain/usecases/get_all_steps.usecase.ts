// get_all_steps.usecase.ts
import type { AssemblyStepEntity } from "../entities/assembly_step.entity";
import type { AssemblyDomainRepository } from "../repositories/assembly.domain.repository";

export class GetAllStepsUsecase {
  private readonly _repository: AssemblyDomainRepository;

  constructor(repository: AssemblyDomainRepository) {
    this._repository = repository;
  }

  async execute(): Promise<AssemblyStepEntity[]> {
    return this._repository.getAllSteps();
  }
}
