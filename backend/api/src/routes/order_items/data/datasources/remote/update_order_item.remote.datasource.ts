// update_order_item.remote.datasource.ts
import { db_client } from "@/core/database/db.config";
import {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} from "@/core/errors/custom.error";
import type { UpdateOrderItemEntity, OrderItemEntity } from "../../../domain/entities/order_item.entity";

const UPDATE_ORDER_ITEM = `
UPDATE order_items
SET id_order = $1, product_name = $2, quantity = $3, notes = $4, updated_at = NOW()
WHERE id_order_item = $5
RETURNING *
`;

export const UpdateOrderItemRemoteDataSource = async (
  orderItem: UpdateOrderItemEntity,
): Promise<OrderItemEntity> => {
  try {
    const result = await db_client.query(UPDATE_ORDER_ITEM, [
      orderItem.id_order,
      orderItem.product_name,
      orderItem.quantity,
      orderItem.notes || null,
      orderItem.id_order_item,
    ]);

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
