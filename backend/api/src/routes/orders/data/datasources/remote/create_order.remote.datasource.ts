// create_order.remote.datasource.ts
import { db_client } from "@/core/database/db.config";
import {
  BadRequestError,
  InternalServerError,
} from "@/core/errors/custom.error";
import type { CreateOrderEntity, OrderEntity } from "../../../domain/entities/order.entity";

const CHECK_ORDER_NUMBER_QUERY = "SELECT order_number FROM orders WHERE order_number = $1";

const CREATE_ORDER_QUERY = `
INSERT INTO orders (id_client, order_number, product_name, quantity, status, notes)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *
`;

export const CreateOrderRemoteDataSource = async (
  order: CreateOrderEntity,
): Promise<OrderEntity> => {
  try {
    const existing = await db_client.query(CHECK_ORDER_NUMBER_QUERY, [order.order_number]);
    if (existing.rows.length !== 0) {
      throw new BadRequestError("Order with this order number already exists");
    }

    const result = await db_client.query(CREATE_ORDER_QUERY, [
      order.id_client || null,
      order.order_number,
      order.product_name,
      order.quantity,
      order.status || "pending",
      order.notes || null,
    ]);

    if (result.rows.length === 0) {
      throw new BadRequestError("Error creating order");
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
