// dashboard.remote.datasource.ts
import { httpPublic } from "@/core/http/http";

const BASE_URL = "/dashboard";

export interface DashboardMetrics {
  totalClients: number;
  totalOrders: number;
  pendingOrders: number;
  inProgressOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  clientsGrowth: number;
  ordersGrowth: number;
  inProgressChange: number;
  completedGrowth: number;
}

export interface OrderTrend {
  date: string;
  orders: number;
  completed: number;
}

export interface StepPerformance {
  step: string;
  stepOrder: number;
  avgTime: number;
  minTime: number;
  maxTime: number;
}

export interface StepAnalytics {
  date: string;
  orders: number;
  completed: number;
}

export class DashboardRemoteDataSource {
  async onGetDashboardMetrics(): Promise<DashboardMetrics> {
    try {
      return await httpPublic.get<DashboardMetrics>(`${BASE_URL}/metrics`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  async onGetOrdersTrend(period: string): Promise<OrderTrend[]> {
    try {
      return await httpPublic.get<OrderTrend[]>(`${BASE_URL}/orders/trend?period=${period}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  async onGetStepPerformance(): Promise<StepPerformance[]> {
    try {
      return await httpPublic.get<StepPerformance[]>(`${BASE_URL}/assembly/step-performance`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  async onGetStepAnalytics(idStep: number, startDate?: string, endDate?: string): Promise<StepAnalytics[]> {
    try {
      const params = new URLSearchParams();
      params.append("id_step", idStep.toString());
      if (startDate) params.append("start_date", startDate);
      if (endDate) params.append("end_date", endDate);
      return await httpPublic.get<StepAnalytics[]>(`${BASE_URL}/assembly/step-analytics?${params.toString()}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }
}
