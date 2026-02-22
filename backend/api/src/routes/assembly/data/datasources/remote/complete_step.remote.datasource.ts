// complete_step.remote.datasource.ts
import { db_client } from "@/core/database/db.config";
import {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} from "@/core/errors/custom.error";
import type { ItemProgressEntity } from "../../../domain/entities/order_progress.entity";

const COMPLETE_STEP_QUERY = `
UPDATE item_progress
SET completed_at = NOW()
WHERE id_progress = $1 AND completed_at IS NULL
RETURNING *
`;

const INSERT_TIME_LOG_QUERY = `
INSERT INTO step_time_logs (id_order_item, id_step, unit_number, duration_seconds)
SELECT id_order_item, id_step, unit_number,
  EXTRACT(EPOCH FROM (NOW() - started_at))::INT
FROM item_progress
WHERE id_progress = $1
RETURNING *
`;

export const CompleteStepRemoteDataSource = async (
  id_progress: string,
): Promise<ItemProgressEntity> => {
  try {
    // First complete the step
    const result = await db_client.query(COMPLETE_STEP_QUERY, [id_progress]);

    if (result.rows.length === 0) {
      throw new NotFoundError("Step not found or already completed");
    }

    // Then log the time
    await db_client.query(INSERT_TIME_LOG_QUERY, [id_progress]);

    return result.rows[0];
  } catch (error) {
    console.log(error);
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      throw error;
    }
    throw new InternalServerError("An error occurred");
  }
};
