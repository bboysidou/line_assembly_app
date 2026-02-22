// delete_order_item.remote.datasource.ts
import { db_client } from "@/core/database/db.config";
import {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} from "@/core/errors/custom.error";
import type { OrderItemEntity } from "../../../domain/entities/order_item.entity";

const DELETE_ORDER_ITEM = `
DELETE FROM order_items
WHERE id_order_item = $1
RETURNING *
`;

export const DeleteOrderItemRemoteDataSource = async (
  id_order_item: string,
): Promise<OrderItemEntity> => {
  try {
    const result = await db_client.query(DELETE_ORDER_ITEM, [id_order_item]);

    if (result.rows.length === 0) {
      throw new NotFoundError("Order item not found");
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
