// get_order_by_id.remote.datasource.ts
import { db_client } from "@/core/database/db.config";
import {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} from "@/core/errors/custom.error";
import type { OrderEntity } from "../../../domain/entities/order.entity";

const GET_ORDER_BY_ID_QUERY = `
SELECT 
  o.*,
  c.client_name,
  COUNT(DISTINCT oi.id_order_item) as items_count,
  COALESCE(SUM(oi.quantity), 0) as total_quantity,
  -- Count units in progress: units that have started but not completed all 6 steps
  (
    SELECT COUNT(DISTINCT CONCAT(ip.id_order_item, '-', ip.unit_number))
    FROM item_progress ip
    JOIN order_items oi2 ON ip.id_order_item = oi2.id_order_item
    WHERE oi2.id_order = o.id_order 
      AND ip.started_at IS NOT NULL
      AND NOT EXISTS (
        -- Check if this unit has completed all 6 steps
        SELECT 1 FROM item_progress ip2
        WHERE ip2.id_order_item = ip.id_order_item 
          AND ip2.unit_number = ip.unit_number
          AND ip2.id_step = 6 
          AND ip2.completed_at IS NOT NULL
      )
  ) as units_in_progress,
  -- Count units completed: units that have completed step 6
  (
    SELECT COUNT(DISTINCT CONCAT(ip.id_order_item, '-', ip.unit_number))
    FROM item_progress ip
    WHERE ip.id_order_item IN (SELECT id_order_item FROM order_items WHERE id_order = o.id_order)
      AND ip.id_step = 6 
      AND ip.completed_at IS NOT NULL
  ) as units_completed
FROM orders o
LEFT JOIN clients c ON o.id_client = c.id_client
LEFT JOIN order_items oi ON o.id_order = oi.id_order
WHERE o.id_order = $1
GROUP BY o.id_order, c.client_name
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
