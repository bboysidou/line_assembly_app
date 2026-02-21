// get_all_orders.remote.datasource.ts
import { db_client } from "@/core/database/db.config";
import {
  BadRequestError,
  InternalServerError,
} from "@/core/errors/custom.error";
import type { OrderEntity } from "../../../domain/entities/order.entity";

const GET_ALL_ORDERS_QUERY = `
SELECT * FROM orders
ORDER BY created_at DESC
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
