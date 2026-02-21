// get_client_by_id.remote.datasource.ts
import { db_client } from "@/core/database/db.config";
import {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} from "@/core/errors/custom.error";
import type { ClientEntity } from "../../../domain/entities/client.entity";

const GET_CLIENT_BY_ID_QUERY = `
SELECT * FROM clients
WHERE id_client = $1
`;

export const GetClientByIdRemoteDataSource = async (
  id_client: string,
): Promise<ClientEntity> => {
  try {
    const result = await db_client.query(GET_CLIENT_BY_ID_QUERY, [id_client]);

    if (result.rows.length === 0) {
      throw new NotFoundError("Client not found");
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
