// dashboard.di.ts
import { DashboardRemoteDataSource } from "@/features/dashboard/data/datasources/dashboard.remote.datasource";
import { DashboardDataRepository } from "@/features/dashboard/data/repositories/dashboard.data.repository";
import { GetDashboardMetricsUsecase } from "@/features/dashboard/domain/usecases/get_dashboard_metrics.usecase";
import { GetOrdersTrendUsecase } from "@/features/dashboard/domain/usecases/get_orders_trend.usecase";
import { GetStepPerformanceUsecase } from "@/features/dashboard/domain/usecases/get_step_performance.usecase";
import { GetStepAnalyticsUsecase } from "@/features/dashboard/domain/usecases/get_step_analytics.usecase";

const remoteDataSource = new DashboardRemoteDataSource();
const dataRepository = new DashboardDataRepository(remoteDataSource);

const getDashboardMetricsUsecase = new GetDashboardMetricsUsecase(dataRepository);
const getOrdersTrendUsecase = new GetOrdersTrendUsecase(dataRepository);
const getStepPerformanceUsecase = new GetStepPerformanceUsecase(dataRepository);
const getStepAnalyticsUsecase = new GetStepAnalyticsUsecase(dataRepository);

export {
  getDashboardMetricsUsecase,
  getOrdersTrendUsecase,
  getStepPerformanceUsecase,
  getStepAnalyticsUsecase,
};
