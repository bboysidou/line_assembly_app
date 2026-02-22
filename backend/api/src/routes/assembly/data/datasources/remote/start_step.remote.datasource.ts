// start_step.remote.datasource.ts
import { db_client } from "@/core/database/db.config";
import {
  BadRequestError,
  InternalServerError,
} from "@/core/errors/custom.error";
import type { CreateItemProgressEntity, ItemProgressEntity } from "../../../domain/entities/order_progress.entity";

const START_STEP_QUERY = `
INSERT INTO item_progress (id_order_item, id_step, unit_number, started_at, scanned_by, barcode, notes)
VALUES ($1, $2, $3, NOW(), $4, $5, $6)
RETURNING *
`;

export const StartStepRemoteDataSource = async (
  progress: CreateItemProgressEntity,
): Promise<ItemProgressEntity> => {
  try {
    const result = await db_client.query(START_STEP_QUERY, [
      progress.id_order_item,
      progress.id_step,
      progress.unit_number || 1,
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
