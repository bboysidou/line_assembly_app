// create_order_item.remote.datasource.ts
import { db_client } from "@/core/database/db.config";
import {
  BadRequestError,
  InternalServerError,
} from "@/core/errors/custom.error";
import type { CreateOrderItemEntity, OrderItemEntity } from "../../../domain/entities/order_item.entity";

const CREATE_ORDER_ITEM = `
INSERT INTO order_items (id_order, product_name, quantity, notes)
VALUES ($1, $2, $3, $4)
RETURNING *
`;

export const CreateOrderItemRemoteDataSource = async (
  orderItem: CreateOrderItemEntity,
): Promise<OrderItemEntity> => {
  try {
    const result = await db_client.query(CREATE_ORDER_ITEM, [
      orderItem.id_order,
      orderItem.product_name,
      orderItem.quantity,
      orderItem.notes || null,
    ]);

    if (result.rows.length === 0) {
      throw new BadRequestError("Error creating order item");
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
