// get_item_progress.remote.datasource.ts
import { db_client } from "@/core/database/db.config";
import {
  BadRequestError,
  InternalServerError,
} from "@/core/errors/custom.error";
import type { ItemProgressEntity } from "../../../domain/entities/order_progress.entity";

const GET_ITEM_PROGRESS_QUERY = `
SELECT ip.*, s.step_name, s.step_order
FROM item_progress ip
JOIN assembly_steps s ON ip.id_step = s.id_step
WHERE ip.id_order_item = $1
ORDER BY s.step_order ASC
`;

export const GetItemProgressRemoteDataSource = async (
  id_order_item: string,
): Promise<(ItemProgressEntity & { step_name: string; step_order: number })[]> => {
  try {
    const result = await db_client.query(GET_ITEM_PROGRESS_QUERY, [id_order_item]);
    return result.rows;
  } catch (error) {
    console.log(error);
    if (error instanceof BadRequestError) {
      throw new BadRequestError(error.message);
    }
    throw new InternalServerError("An error occurred");
  }
};

// Legacy function for backward compatibility
export const GetOrderProgressRemoteDataSource = GetItemProgressRemoteDataSource;
