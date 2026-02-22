// delete_all_order_items_by_order_id.remote.datasource.ts
import { db_client } from "@/core/database/db.config";
import {
  BadRequestError,
  InternalServerError,
} from "@/core/errors/custom.error";

const DELETE_ALL_ORDER_ITEMS_BY_ORDER_ID = `
DELETE FROM order_items
WHERE id_order = $1
`;

export const DeleteAllOrderItemsByOrderIdRemoteDataSource = async (
  id_order: string,
): Promise<void> => {
  try {
    await db_client.query(DELETE_ALL_ORDER_ITEMS_BY_ORDER_ID, [id_order]);
  } catch (error) {
    console.log(error);
    if (error instanceof BadRequestError) {
      throw new BadRequestError(error.message);
    }
    throw new InternalServerError("An error occurred");
  }
};
