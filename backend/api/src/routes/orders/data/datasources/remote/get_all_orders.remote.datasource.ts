// get_all_orders.remote.datasource.ts
import { db_client } from "@/core/database/db.config";
import {
  BadRequestError,
  InternalServerError,
} from "@/core/errors/custom.error";
import type { OrderEntity } from "../../../domain/entities/order.entity";

const GET_ALL_ORDERS_QUERY = `
SELECT 
  o.*,
  c.client_name,
  COALESCE(COUNT(oi.id_order_item), 0)::int AS items_count,
  COALESCE(SUM(oi.quantity), 0)::int AS total_quantity
FROM orders o
LEFT JOIN order_items oi ON o.id_order = oi.id_order
LEFT JOIN clients c ON o.id_client = c.id_client
GROUP BY o.id_order, c.client_name
ORDER BY o.created_at DESC
`;

export const GetAllOrdersRemoteDataSource = async (): Promise<OrderEntity[]> => {
  try {
    const result = await db_client.query(GET_ALL_ORDERS_QUERY);
    return result.rows;
  } catch (error) {
    console.log(error);
    if (error instanceof BadRequestError) {
      throw new BadRequestError(error.message);
    }
    throw new InternalServerError("An error occurred");
  }
};
