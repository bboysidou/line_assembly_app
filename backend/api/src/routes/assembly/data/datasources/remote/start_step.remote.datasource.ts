// start_step.remote.datasource.ts
import { db_client } from "@/core/database/db.config";
import {
  BadRequestError,
  InternalServerError,
} from "@/core/errors/custom.error";
import type { CreateOrderProgressEntity, OrderProgressEntity } from "../../../domain/entities/order_progress.entity";

const START_STEP_QUERY = `
INSERT INTO order_progress (id_order, id_step, started_at, scanned_by, barcode, notes)
VALUES ($1, $2, NOW(), $3, $4, $5)
RETURNING *
`;

export const StartStepRemoteDataSource = async (
  progress: CreateOrderProgressEntity,
): Promise<OrderProgressEntity> => {
  try {
    const result = await db_client.query(START_STEP_QUERY, [
      progress.id_order,
      progress.id_step,
      progress.scanned_by || null,
      progress.barcode || null,
      progress.notes || null,
    ]);

    if (result.rows.length === 0) {
      throw new BadRequestError("Error starting step");
    }

    return result.rows[0];
  } catch (error) {
    console.log(error);
    if (error instanceof BadRequestError) {
      throw new BadRequestError(error.message);
    }
    throw new InternalServerError("An error occurred");
  }
};
