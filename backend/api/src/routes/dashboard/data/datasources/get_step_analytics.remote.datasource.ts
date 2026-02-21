// get_step_analytics.remote.datasource.ts
import { db_client } from "@/core/database/db.config";
import {
  InternalServerError,
} from "@/core/errors/custom.error";
import { StepAnalyticsEntity } from "../../domain/entities/step_analytics.entity";

export const GetStepAnalyticsRemoteDataSource = async (
  idStep: number,
  startDate?: string,
  endDate?: string,
): Promise<StepAnalyticsEntity[]> => {
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
    return result.rows.map((row) => new StepAnalyticsEntity({
      date: row.date,
      orders: parseInt(row.orders || "0"),
      completed: parseInt(row.completed || "0"),
    }));
  } catch (error) {
    console.log(error);
    throw new InternalServerError("An error occurred");
  }
};
