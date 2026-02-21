// dashboard.di.ts
import { DashboardDataRepository } from "@/routes/dashboard/data/repositories/dashboard.data.repository";
import { GetDashboardMetricsUsecase as GetMetricsUseCase } from "@/routes/dashboard/domain/usecases/get_dashboard_metrics.usecase";
import { GetOrdersTrendUsecase as GetTrendUseCase } from "@/routes/dashboard/domain/usecases/get_orders_trend.usecase";
import { GetStepPerformanceUsecase as GetPerformanceUseCase } from "@/routes/dashboard/domain/usecases/get_step_performance.usecase";
import { GetStepAnalyticsUsecase as GetAnalyticsUseCase } from "@/routes/dashboard/domain/usecases/get_step_analytics.usecase";

// Create repository instance (singleton)
const dataRepository = new DashboardDataRepository();

// Create use case instances with repository dependency
export const GetDashboardMetricsUsecase = new GetMetricsUseCase(dataRepository);
export const GetOrdersTrendUsecase = new GetTrendUseCase(dataRepository);
export const GetStepPerformanceUsecase = new GetPerformanceUseCase(dataRepository);
export const GetStepAnalyticsUsecase = new GetAnalyticsUseCase(dataRepository);
