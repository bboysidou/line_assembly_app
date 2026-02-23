// dashboard.di.ts
import { DashboardDataRepository } from "@/routes/dashboard/data/repositories/dashboard.data.repository";
import { GetDashboardMetricsUsecase } from "@/routes/dashboard/domain/usecases/get_dashboard_metrics.usecase";
import { GetOrdersTrendUsecase } from "@/routes/dashboard/domain/usecases/get_orders_trend.usecase";
import { GetStepPerformanceUsecase } from "@/routes/dashboard/domain/usecases/get_step_performance.usecase";
import { GetStepAnalyticsUsecase } from "@/routes/dashboard/domain/usecases/get_step_analytics.usecase";

// Create repository instance (singleton)
const dataRepository = new DashboardDataRepository();

// Create use case instances with repository dependency
const getDashboardMetricsUsecase = new GetDashboardMetricsUsecase(dataRepository);
const getOrdersTrendUsecase = new GetOrdersTrendUsecase(dataRepository);
const getStepPerformanceUsecase = new GetStepPerformanceUsecase(dataRepository);
const getStepAnalyticsUsecase = new GetStepAnalyticsUsecase(dataRepository);

// Export use cases for controller injection
export {
  getDashboardMetricsUsecase,
  getOrdersTrendUsecase,
  getStepPerformanceUsecase,
  getStepAnalyticsUsecase,
};
