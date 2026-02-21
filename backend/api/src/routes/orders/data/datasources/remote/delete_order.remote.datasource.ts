// delete_order.remote.datasource.ts
import { db_client } from "@/core/database/db.config";
import {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} from "@/core/errors/custom.error";

const DELETE_ORDER_QUERY = `
DELETE FROM orders
WHERE id_order = $1
RETURNING *
`;

export const DeleteOrderRemoteDataSource = async (
  id_order: string,
): Promise<void> => {
  try {
    const result = await db_client.query(DELETE_ORDER_QUERY, [id_order]);

    if (result.rows.length === 0) {
      throw new NotFoundError("Order not found");
    }
  } catch (error) {
    console.log(error);
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      throw error;
    }
    throw new InternalServerError("An error occurred");
  }
};
