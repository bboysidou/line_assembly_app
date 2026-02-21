// get_step_analytics.usecase.ts
import type { AssemblyDomainRepository } from "../repositories/assembly.domain.repository";

export interface StepAnalytics {
  id_step: number;
  step_name: string;
  avg_duration: number;
}

export class GetStepAnalyticsUsecase {
  private readonly _repository: AssemblyDomainRepository;

  constructor(repository: AssemblyDomainRepository) {
    this._repository = repository;
  }

  async execute(): Promise<StepAnalytics[]> {
    const analytics = await this._repository.getStepAnalytics();
    return analytics;
  }
}
