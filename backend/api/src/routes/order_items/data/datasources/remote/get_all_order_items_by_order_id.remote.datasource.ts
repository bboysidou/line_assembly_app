// get_all_order_items_by_order_id.remote.datasource.ts
import { db_client } from "@/core/database/db.config";
import {
  BadRequestError,
  InternalServerError,
} from "@/core/errors/custom.error";
import type { OrderItemEntity } from "../../../domain/entities/order_item.entity";

const GET_ALL_ORDER_ITEMS_BY_ORDER_ID = `
SELECT * FROM order_items
WHERE id_order = $1
ORDER BY created_at ASC
`;

export const GetAllOrderItemsByOrderIdRemoteDataSource = async (
  id_order: string,
): Promise<OrderItemEntity[]> => {
  try {
    const result = await db_client.query(GET_ALL_ORDER_ITEMS_BY_ORDER_ID, [id_order]);
    return result.rows;
  } catch (error) {
    console.log(error);
    if (error instanceof BadRequestError) {
      throw new BadRequestError(error.message);
    }
    throw new InternalServerError("An error occurred");
  }
};
