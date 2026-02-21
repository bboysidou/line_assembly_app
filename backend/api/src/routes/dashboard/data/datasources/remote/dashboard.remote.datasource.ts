// dashboard.remote.datasource.ts
import { db_client } from "@/core/database/db.config";
import {
  InternalServerError,
} from "@/core/errors/custom.error";

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

// Get dashboard metrics
export const GetDashboardMetricsRemoteDataSource =
  async (): Promise<DashboardMetrics> => {
    try {
      // Get total clients
      const clientsResult = await db_client.query(
        "SELECT COUNT(*) as count FROM clients",
      );
      const totalClients = parseInt(clientsResult.rows[0]?.count || "0");

      // Get total orders
      const ordersResult = await db_client.query(
        "SELECT COUNT(*) as count FROM orders",
      );
      const totalOrders = parseInt(ordersResult.rows[0]?.count || "0");

      // Get orders by status
      const statusResult = await db_client.query(
        "SELECT status, COUNT(*) as count FROM orders GROUP BY status",
      );

      let pendingOrders = 0;
      let inProgressOrders = 0;
      let completedOrders = 0;
      let cancelledOrders = 0;

      statusResult.rows.forEach((row: { status: string; count: string }) => {
        switch (row.status) {
          case "pending":
            pendingOrders = parseInt(row.count);
            break;
          case "in_progress":
            inProgressOrders = parseInt(row.count);
            break;
          case "completed":
            completedOrders = parseInt(row.count);
            break;
          case "cancelled":
            cancelledOrders = parseInt(row.count);
            break;
        }
      });

      // Calculate growth (mock for now - would need historical data)
      const clientsGrowth = 12;
      const ordersGrowth = 8;
      const inProgressChange = -5;
      const completedGrowth = 15;

      return {
        totalClients,
        totalOrders,
        pendingOrders,
        inProgressOrders,
        completedOrders,
        cancelledOrders,
        clientsGrowth,
        ordersGrowth,
        inProgressChange,
        completedGrowth,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerError("An error occurred");
    }
  };

// Get orders trend
export const GetOrdersTrendRemoteDataSource = async (
  period: string,
): Promise<OrderTrend[]> => {
  try {
    let dateFormat: string;
    let interval: string;

    switch (period) {
      case "day":
        dateFormat = "YYYY-MM-DD HH24:00";
        interval = "24 HOUR";
        break;
      case "week":
        dateFormat = "YYYY-MM-DD";
        interval = "7 DAY";
        break;
      case "month":
        dateFormat = "YYYY-MM-DD";
        interval = "30 DAY";
        break;
      default:
        dateFormat = "YYYY-MM-DD";
        interval = "7 DAY";
    }

    const query = `
      SELECT 
        TO_CHAR(created_at, '${dateFormat}') as date,
        COUNT(*) as orders,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
      FROM orders
      WHERE created_at >= NOW() - INTERVAL '${interval}'
      GROUP BY TO_CHAR(created_at, '${dateFormat}')
      ORDER BY date ASC
    `;

    const result = await db_client.query(query);
    return result.rows;
  } catch (error) {
    console.log(error);
    throw new InternalServerError("An error occurred");
  }
};

// Get step performance
export const GetStepPerformanceRemoteDataSource =
  async (): Promise<StepPerformance[]> => {
    try {
      const stepNames = [
        "Cutting",
        "Welding",
        "Painting",
        "Assembly",
        "Quality Check",
        "Packaging",
      ];

      // Get average time per step from step_time_logs if available
      const query = `
        SELECT 
          step_name,
          step_order,
          AVG(EXTRACT(EPOCH FROM (completed_at - started_at)) / 60) as avg_time,
          MIN(EXTRACT(EPOCH FROM (completed_at - started_at)) / 60) as min_time,
          MAX(EXTRACT(EPOCH FROM (completed_at - started_at)) / 60) as max_time
        FROM assembly_steps
        LEFT JOIN order_progress ON assembly_steps.id_step = order_progress.id_step
        WHERE completed_at IS NOT NULL
        GROUP BY step_name, step_order
        ORDER BY step_order ASC
      `;

      const result = await db_client.query(query);

      // If no data, return defaults
      if (result.rows.length === 0) {
        return stepNames.map((name, i) => ({
          step: name,
          stepOrder: i + 1,
          avgTime: [45, 120, 90, 180, 30, 25][i],
          minTime: [30, 90, 60, 120, 20, 15][i],
          maxTime: [60, 150, 120, 240, 45, 35][i],
        }));
      }

      return result.rows.map((row) => ({
        step: row.step_name,
        stepOrder: row.step_order,
        avgTime: Math.round(row.avg_time || 0),
        minTime: Math.round(row.min_time || 0),
        maxTime: Math.round(row.max_time || 0),
      }));
    } catch (error) {
      console.log(error);
      throw new InternalServerError("An error occurred");
    }
  };

// Get step analytics
export const GetStepAnalyticsRemoteDataSource = async (
  idStep: number,
  startDate?: string,
  endDate?: string,
): Promise<StepAnalytics[]> => {
  try {
    let dateFormat = "YYYY-MM-DD";
    let interval = "7 DAY";

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diff = end.getTime() - start.getTime();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

      if (days <= 1) {
        dateFormat = "YYYY-MM-DD HH24:00";
        interval = "24 HOUR";
      } else if (days <= 7) {
        dateFormat = "YYYY-MM-DD";
        interval = "7 DAY";
      } else {
        dateFormat = "YYYY-MM-DD";
        interval = "30 DAY";
      }
    }

    const query = `
      SELECT 
        TO_CHAR(started_at, '${dateFormat}') as date,
        COUNT(*) as orders,
        SUM(CASE WHEN completed_at IS NOT NULL THEN 1 ELSE 0 END) as completed
      FROM order_progress
      WHERE id_step = $1
        AND started_at >= NOW() - INTERVAL '${interval}'
      GROUP BY TO_CHAR(started_at, '${dateFormat}')
      ORDER BY date ASC
    `;

    const result = await db_client.query(query, [idStep]);
    return result.rows;
  } catch (error) {
    console.log(error);
    throw new InternalServerError("An error occurred");
  }
};
