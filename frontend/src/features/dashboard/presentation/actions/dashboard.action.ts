// dashboard.action.ts
import {
  getDashboardMetricsUsecase,
  getOrdersTrendUsecase,
  getStepPerformanceUsecase,
  getStepAnalyticsUsecase,
} from "@/core/dependency_injections/dashboard.di";
import type {
  DashboardMetricsEntity,
  OrderTrendEntity,
  StepPerformanceEntity,
  StepAnalyticsEntity,
} from "../../domain/entities/dashboard.entity";
import { QUERY_KEYS } from "@/core/http/type";

// Query Keys - Export for use in components
export const dashboardKeys = QUERY_KEYS.DASHBOARD;

// Query Actions
export const onGetDashboardMetricsAction = async (): Promise<DashboardMetricsEntity> => {
  try {
    return await getDashboardMetricsUsecase.execute();
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    throw new Error(message);
  }
};

export const onGetOrdersTrendAction = async (period: string): Promise<OrderTrendEntity[]> => {
  try {
    return await getOrdersTrendUsecase.execute(period);
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    throw new Error(message);
  }
};

export const onGetStepPerformanceAction = async (): Promise<StepPerformanceEntity[]> => {
  try {
    return await getStepPerformanceUsecase.execute();
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    throw new Error(message);
  }
};

export const onGetStepAnalyticsAction = async (idStep: number, startDate?: string, endDate?: string): Promise<StepAnalyticsEntity[]> => {
  try {
    return await getStepAnalyticsUsecase.execute(idStep, startDate, endDate);
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    throw new Error(message);
  }
};
