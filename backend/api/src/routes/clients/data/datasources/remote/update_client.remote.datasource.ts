// update_client.remote.datasource.ts
import { db_client } from "@/core/database/db.config";
import {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} from "@/core/errors/custom.error";
import type { UpdateClientEntity, ClientEntity } from "../../../domain/entities/client.entity";

const UPDATE_CLIENT_QUERY = `
UPDATE clients
SET client_name = $1, client_email = $2, client_phone = $3, client_address = $4, updated_at = NOW()
WHERE id_client = $5
RETURNING *
`;

export const UpdateClientRemoteDataSource = async (
  client: UpdateClientEntity,
): Promise<ClientEntity> => {
  try {
    const result = await db_client.query(UPDATE_CLIENT_QUERY, [
      client.client_name,
      client.client_email,
      client.client_phone || null,
      client.client_address || null,
      client.id_client,
    ]);

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
