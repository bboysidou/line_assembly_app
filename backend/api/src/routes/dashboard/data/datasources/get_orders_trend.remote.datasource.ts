// get_orders_trend.remote.datasource.ts
import { db_client } from "@/core/database/db.config";
import {
  InternalServerError,
} from "@/core/errors/custom.error";
import { OrderTrendEntity } from "../../domain/entities/order_trend.entity";

export const GetOrdersTrendRemoteDataSource = async (
  period: string,
): Promise<OrderTrendEntity[]> => {
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
    return result.rows.map((row) => new OrderTrendEntity({
      date: row.date,
      orders: parseInt(row.orders || "0"),
      completed: parseInt(row.completed || "0"),
    }));
  } catch (error) {
    console.log(error);
    throw new InternalServerError("An error occurred");
  }
};
