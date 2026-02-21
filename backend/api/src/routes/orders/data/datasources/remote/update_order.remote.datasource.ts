// update_order.remote.datasource.ts
import { db_client } from "@/core/database/db.config";
import {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} from "@/core/errors/custom.error";
import type { UpdateOrderEntity, OrderEntity } from "../../../domain/entities/order.entity";

const UPDATE_ORDER_QUERY = `
UPDATE orders
SET id_client = $1, order_number = $2, product_name = $3, quantity = $4, status = $5, notes = $6, updated_at = NOW()
WHERE id_order = $7
RETURNING *
`;

export const UpdateOrderRemoteDataSource = async (
  order: UpdateOrderEntity,
): Promise<OrderEntity> => {
  try {
    const result = await db_client.query(UPDATE_ORDER_QUERY, [
      order.id_client || null,
      order.order_number,
      order.product_name,
      order.quantity,
      order.status,
      order.notes || null,
      order.id_order,
    ]);

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
