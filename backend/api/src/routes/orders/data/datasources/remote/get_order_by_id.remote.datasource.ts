// get_order_by_id.remote.datasource.ts
import { db_client } from "@/core/database/db.config";
import {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} from "@/core/errors/custom.error";
import type { OrderEntity } from "../../../domain/entities/order.entity";

const GET_ORDER_BY_ID_QUERY = `
SELECT * FROM orders
WHERE id_order = $1
`;

export const GetOrderByIdRemoteDataSource = async (
  id_order: string,
): Promise<OrderEntity> => {
  try {
    const result = await db_client.query(GET_ORDER_BY_ID_QUERY, [id_order]);

    if (result.rows.length === 0) {
      throw new NotFoundError("Order not found");
    }

    return result.rows[0];
  } catch (error) {
    console.log(error);
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      throw error;
    }
    throw new InternalServerError("An error occurred");
  }
};
