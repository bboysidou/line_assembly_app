// get_orders_trend.usecase.ts
import type { OrderTrendEntity } from "../entities/dashboard.entity";
import type { DashboardDomainRepository } from "../repositories/dashboard.domain.repository";

export class GetOrdersTrendUsecase {
  private readonly _repository: DashboardDomainRepository;

  constructor(repository: DashboardDomainRepository) {
    this._repository = repository;
  }

  async execute(period: string): Promise<OrderTrendEntity[]> {
    return this._repository.getOrdersTrend(period);
  }
}
