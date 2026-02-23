// get_all_clients.remote.datasource.ts
import { db_client } from "@/core/database/db.config";
import {
  BadRequestError,
  InternalServerError,
} from "@/core/errors/custom.error";
import type { ClientEntity } from "../../../domain/entities/client.entity";

// Pagination response type
export interface PaginatedClientsResponse {
  data: ClientEntity[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const GET_CLIENTS_COUNT_QUERY = `
SELECT COUNT(*)::int AS total
FROM clients
`;

const GET_PAGINATED_CLIENTS_QUERY = `
SELECT * FROM clients
ORDER BY created_at DESC
LIMIT $1 OFFSET $2
`;

export const GetAllClientsRemoteDataSource = async (
  page: number = 1,
  limit: number = 10,
): Promise<PaginatedClientsResponse> => {
  try {
    // Calculate offset
    const offset = (page - 1) * limit;

    // Get total count
    const countResult = await db_client.query(GET_CLIENTS_COUNT_QUERY);
    const total = countResult.rows[0].total;
    const totalPages = Math.ceil(total / limit);

    // Get paginated data
    const result = await db_client.query(GET_PAGINATED_CLIENTS_QUERY, [
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
