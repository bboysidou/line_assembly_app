// get_step_performance.usecase.ts
import type { StepPerformanceEntity } from "../entities/dashboard.entity";
import type { DashboardDomainRepository } from "../repositories/dashboard.domain.repository";

export class GetStepPerformanceUsecase {
  private readonly _repository: DashboardDomainRepository;

  constructor(repository: DashboardDomainRepository) {
    this._repository = repository;
  }

  async execute(): Promise<StepPerformanceEntity[]> {
    return this._repository.getStepPerformance();
  }
}
