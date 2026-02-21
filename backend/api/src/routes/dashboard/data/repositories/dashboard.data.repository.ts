// dashboard.data.repository.ts
import {
  InternalServerError,
} from "@/core/errors/custom.error";
import type { DashboardDomainRepository } from "../../domain/repositories/dashboard.domain.repository";
import { DashboardMetricsEntity } from "../../domain/entities/dashboard_metrics.entity";
import { OrderTrendEntity } from "../../domain/entities/order_trend.entity";
import { StepPerformanceEntity } from "../../domain/entities/step_performance.entity";
import { StepAnalyticsEntity } from "../../domain/entities/step_analytics.entity";
import { GetDashboardMetricsRemoteDataSource } from "../datasources/get_dashboard_metrics.remote.datasource";
import { GetOrdersTrendRemoteDataSource } from "../datasources/get_orders_trend.remote.datasource";
import { GetStepPerformanceRemoteDataSource } from "../datasources/get_step_performance.remote.datasource";
import { GetStepAnalyticsRemoteDataSource } from "../datasources/get_step_analytics.remote.datasource";

export class DashboardDataRepository implements DashboardDomainRepository {
  async getDashboardMetrics(): Promise<DashboardMetricsEntity> {
    try {
      return await GetDashboardMetricsRemoteDataSource();
    } catch (error) {
      console.log(error);
      throw new InternalServerError("An error occurred");
    }
  }

  async getOrdersTrend(period: string): Promise<OrderTrendEntity[]> {
    try {
      return await GetOrdersTrendRemoteDataSource(period);
    } catch (error) {
      console.log(error);
      throw new InternalServerError("An error occurred");
    }
  }

  async getStepPerformance(): Promise<StepPerformanceEntity[]> {
    try {
      return await GetStepPerformanceRemoteDataSource();
    } catch (error) {
      console.log(error);
      throw new InternalServerError("An error occurred");
    }
  }

  async getStepAnalytics(
    idStep: number,
    startDate?: string,
    endDate?: string,
  ): Promise<StepAnalyticsEntity[]> {
    try {
      return await GetStepAnalyticsRemoteDataSource(idStep, startDate, endDate);
    } catch (error) {
      console.log(error);
      throw new InternalServerError("An error occurred");
    }
  }
}
