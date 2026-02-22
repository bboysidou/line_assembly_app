// create_multiple_order_items.remote.datasource.ts
import { db_client } from "@/core/database/db.config";
import {
  BadRequestError,
  InternalServerError,
} from "@/core/errors/custom.error";
import type { CreateOrderItemEntity, OrderItemEntity } from "../../../domain/entities/order_item.entity";

const CREATE_ORDER_ITEMS = `
INSERT INTO order_items (id_order, product_name, quantity, notes)
VALUES ($1, $2, $3, $4)
RETURNING *
`;

export const CreateMultipleOrderItemsRemoteDataSource = async (
  orderItems: CreateOrderItemEntity[],
): Promise<OrderItemEntity[]> => {
  try {
    const client = await db_client.connect();
    try {
      await client.query("BEGIN");
      
      const createdItems: OrderItemEntity[] = [];
      
      for (const item of orderItems) {
        const result = await client.query(CREATE_ORDER_ITEMS, [
          item.id_order,
          item.product_name,
          item.quantity,
          item.notes || null,
        ]);
        
        if (result.rows.length > 0) {
          createdItems.push(result.rows[0]);
        }
      }
      
      await client.query("COMMIT");
      return createdItems;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.log(error);
    if (error instanceof BadRequestError) {
      throw new BadRequestError(error.message);
    }
    throw new InternalServerError("An error occurred");
  }
};
