// get_order_progress.remote.datasource.ts
import { db_client } from "@/core/database/db.config";
import {
  BadRequestError,
  InternalServerError,
} from "@/core/errors/custom.error";
import type { OrderProgressEntity } from "../../../domain/entities/order_progress.entity";

const GET_ORDER_PROGRESS_QUERY = `
SELECT * FROM order_progress
WHERE id_order = $1
ORDER BY id_step ASC
`;

export const GetOrderProgressRemoteDataSource = async (
  id_order: string,
): Promise<OrderProgressEntity[]> => {
  try {
    const result = await db_client.query(GET_ORDER_PROGRESS_QUERY, [id_order]);
    return result.rows;
  } catch (error) {
    console.log(error);
    if (error instanceof BadRequestError) {
      throw new BadRequestError(error.message);
    }
    throw new InternalServerError("An error occurred");
  }
};
