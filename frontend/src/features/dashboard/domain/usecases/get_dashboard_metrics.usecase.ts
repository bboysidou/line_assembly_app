// get_dashboard_metrics.usecase.ts
import type { DashboardMetricsEntity } from "../entities/dashboard.entity";
import type { DashboardDomainRepository } from "../repositories/dashboard.domain.repository";

export class GetDashboardMetricsUsecase {
  private readonly _repository: DashboardDomainRepository;

  constructor(repository: DashboardDomainRepository) {
    this._repository = repository;
  }

  async execute(): Promise<DashboardMetricsEntity> {
    return this._repository.getDashboardMetrics();
  }
}
