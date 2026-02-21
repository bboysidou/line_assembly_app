// get_dashboard_metrics.remote.datasource.ts
import { db_client } from "@/core/database/db.config";
import {
  InternalServerError,
} from "@/core/errors/custom.error";
import { DashboardMetricsEntity } from "../../domain/entities/dashboard_metrics.entity";

export const GetDashboardMetricsRemoteDataSource =
  async (): Promise<DashboardMetricsEntity> => {
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

      return new DashboardMetricsEntity({
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
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerError("An error occurred");
    }
  };
