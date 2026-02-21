// get_step_analytics.remote.datasource.ts
import { db_client } from "@/core/database/db.config";
import {
  BadRequestError,
  InternalServerError,
} from "@/core/errors/custom.error";

const GET_STEP_ANALYTICS_QUERY = `
SELECT 
  s.id_step,
  s.step_name,
  COALESCE(AVG(tl.duration_seconds), 0) as avg_duration
FROM assembly_steps s
LEFT JOIN step_time_logs tl ON s.id_step = tl.id_step
WHERE s.is_active = true
GROUP BY s.id_step, s.step_name, s.step_order
ORDER BY s.step_order ASC
`;

export const GetStepAnalyticsRemoteDataSource = async (): Promise<
  { id_step: number; step_name: string; avg_duration: number }[]
> => {
  try {
    const result = await db_client.query(GET_STEP_ANALYTICS_QUERY);
    return result.rows;
  } catch (error) {
    console.log(error);
    if (error instanceof BadRequestError) {
      throw new BadRequestError(error.message);
    }
    throw new InternalServerError("An error occurred");
  }
};
