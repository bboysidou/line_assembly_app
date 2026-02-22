// create_order.remote.datasource.ts
import { db_client } from "@/core/database/db.config";
import {
  BadRequestError,
  InternalServerError,
} from "@/core/errors/custom.error";
import type { CreateOrderEntity, OrderEntity } from "../../../domain/entities/order.entity";

// Generate order number: ORD-YYYYMMDD-XXXX
const generateOrderNumber = async (): Promise<string> => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
  
  // Get count of orders created today
  const countResult = await db_client.query(
    "SELECT COUNT(*) FROM orders WHERE DATE(created_at) = CURRENT_DATE"
  );
  const count = parseInt(countResult.rows[0].count) + 1;
  const sequence = count.toString().padStart(4, "0");
  
  return `ORD-${dateStr}-${sequence}`;
};

const CREATE_ORDER_QUERY = `
INSERT INTO orders (id_client, order_number, product_name, quantity, status, notes)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *
`;

export const CreateOrderRemoteDataSource = async (
  order: CreateOrderEntity,
): Promise<OrderEntity> => {
  try {
    // Generate order number automatically
    const orderNumber = await generateOrderNumber();

    const result = await db_client.query(CREATE_ORDER_QUERY, [
      order.id_client,
      orderNumber,
      order.product_name || "N/A", // Default product_name since items are in order_items table
      order.quantity || 1, // Default quantity since items are in order_items table
      "pending", // Default status for new orders
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
