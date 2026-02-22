// dashboard.data.repository.ts
import type { DashboardDomainRepository } from "../../domain/repositories/dashboard.domain.repository";
import type {
  DashboardMetricsEntity,
  OrderTrendEntity,
  StepPerformanceEntity,
  StepAnalyticsEntity,
} from "../../domain/entities/dashboard.entity";
import { DashboardRemoteDataSource } from "../datasources/dashboard.remote.datasource";

export class DashboardDataRepository implements DashboardDomainRepository {
  private readonly _remoteDataSource: DashboardRemoteDataSource;

  constructor(remoteDataSource: DashboardRemoteDataSource) {
    this._remoteDataSource = remoteDataSource;
  }

  async getDashboardMetrics(): Promise<DashboardMetricsEntity> {
    try {
      return await this._remoteDataSource.onGetDashboardMetrics();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  async getOrdersTrend(period: string): Promise<OrderTrendEntity[]> {
    try {
      return await this._remoteDataSource.onGetOrdersTrend(period);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  async getStepPerformance(): Promise<StepPerformanceEntity[]> {
    try {
      return await this._remoteDataSource.onGetStepPerformance();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  async getStepAnalytics(
    idStep: number,
    startDate?: string,
    endDate?: string,
  ): Promise<StepAnalyticsEntity[]> {
    try {
      return await this._remoteDataSource.onGetStepAnalytics(
        idStep,
        startDate,
        endDate,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }
}
