// get_step_analytics.usecase.ts
import type { StepAnalyticsEntity } from "../entities/dashboard.entity";
import type { DashboardDomainRepository } from "../repositories/dashboard.domain.repository";

export class GetStepAnalyticsUsecase {
  private readonly _repository: DashboardDomainRepository;

  constructor(repository: DashboardDomainRepository) {
    this._repository = repository;
  }

  async execute(idStep: number, startDate?: string, endDate?: string): Promise<StepAnalyticsEntity[]> {
    return this._repository.getStepAnalytics(idStep, startDate, endDate);
  }
}
