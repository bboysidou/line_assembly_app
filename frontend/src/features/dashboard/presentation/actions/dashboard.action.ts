// dashboard.action.ts
import { DashboardRemoteDataSource } from "../../data/datasources/dashboard.remote.datasource";
import type { DashboardMetrics, OrderTrend, StepPerformance, StepAnalytics } from "../../data/datasources/dashboard.remote.datasource";
import { QUERY_KEYS } from "@/core/http/type";

const dashboardRemoteDataSource = new DashboardRemoteDataSource();

// Query Keys - Export for use in components
export const dashboardKeys = QUERY_KEYS.DASHBOARD;

// Query Actions
export const onGetDashboardMetricsAction = async (): Promise<DashboardMetrics> => {
  try {
    return await dashboardRemoteDataSource.onGetDashboardMetrics();
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    throw new Error(message);
  }
};

export const onGetOrdersTrendAction = async (period: string): Promise<OrderTrend[]> => {
  try {
    return await dashboardRemoteDataSource.onGetOrdersTrend(period);
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    throw new Error(message);
  }
};

export const onGetStepPerformanceAction = async (): Promise<StepPerformance[]> => {
  try {
    return await dashboardRemoteDataSource.onGetStepPerformance();
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    throw new Error(message);
  }
};

export const onGetStepAnalyticsAction = async (idStep: number, startDate?: string, endDate?: string): Promise<StepAnalytics[]> => {
  try {
    return await dashboardRemoteDataSource.onGetStepAnalytics(idStep, startDate, endDate);
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    throw new Error(message);
  }
};
