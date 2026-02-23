// get_all_orders.remote.datasource.ts
import { db_client } from "@/core/database/db.config";
import {
  BadRequestError,
  InternalServerError,
} from "@/core/errors/custom.error";
import type { OrderEntity } from "../../../domain/entities/order.entity";

// Pagination response type
export interface PaginatedOrdersResponse {
  data: OrderEntity[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const GET_ORDERS_COUNT_QUERY = `
SELECT COUNT(DISTINCT o.id_order)::int AS total
FROM orders o
`;

const GET_PAGINATED_ORDERS_QUERY = `
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
LIMIT $1 OFFSET $2
`;

export const GetAllOrdersRemoteDataSource = async (
  page: number = 1,
  limit: number = 10,
): Promise<PaginatedOrdersResponse> => {
  try {
    // Calculate offset
    const offset = (page - 1) * limit;

    // Get total count
    const countResult = await db_client.query(GET_ORDERS_COUNT_QUERY);
    const total = countResult.rows[0].total;
    const totalPages = Math.ceil(total / limit);

    // Get paginated data
    const result = await db_client.query(GET_PAGINATED_ORDERS_QUERY, [
      limit,
      offset,
    ]);

    return {
      data: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  } catch (error) {
    console.log(error);
    if (error instanceof BadRequestError) {
      throw new BadRequestError(error.message);
    }
    throw new InternalServerError("An error occurred");
  }
};
