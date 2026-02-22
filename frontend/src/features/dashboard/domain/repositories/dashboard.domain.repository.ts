// dashboard.domain.repository.ts
import type {
  DashboardMetricsEntity,
  OrderTrendEntity,
  StepPerformanceEntity,
  StepAnalyticsEntity,
} from "../entities/dashboard.entity";

export interface DashboardDomainRepository {
  getDashboardMetrics(): Promise<DashboardMetricsEntity>;
  getOrdersTrend(period: string): Promise<OrderTrendEntity[]>;
  getStepPerformance(): Promise<StepPerformanceEntity[]>;
  getStepAnalytics(idStep: number, startDate?: string, endDate?: string): Promise<StepAnalyticsEntity[]>;
}
