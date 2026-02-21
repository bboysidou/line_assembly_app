// dashboard.domain.repository.ts
import type {
  DashboardMetricsEntity,
} from "../entities/dashboard_metrics.entity";
import type {
  OrderTrendEntity,
} from "../entities/order_trend.entity";
import type {
  StepPerformanceEntity,
} from "../entities/step_performance.entity";
import type {
  StepAnalyticsEntity,
} from "../entities/step_analytics.entity";

export interface DashboardDomainRepository {
  // Query Operations (Read)
  getDashboardMetrics(): Promise<DashboardMetricsEntity>;
  getOrdersTrend(period: string): Promise<OrderTrendEntity[]>;
  getStepPerformance(): Promise<StepPerformanceEntity[]>;
  getStepAnalytics(
    idStep: number,
    startDate?: string,
    endDate?: string,
  ): Promise<StepAnalyticsEntity[]>;
}
