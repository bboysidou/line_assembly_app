// create_client.remote.datasource.ts
import { db_client } from "@/core/database/db.config";
import {
  BadRequestError,
  InternalServerError,
} from "@/core/errors/custom.error";
import type { CreateClientEntity, ClientEntity } from "../../../domain/entities/client.entity";

const CHECK_EMAIL_QUERY = "SELECT client_email FROM clients WHERE client_email = $1";

const CREATE_CLIENT_QUERY = `
INSERT INTO clients (client_name, client_email, client_phone, client_address)
VALUES ($1, $2, $3, $4)
RETURNING *
`;

export const CreateClientRemoteDataSource = async (
  client: CreateClientEntity,
): Promise<ClientEntity> => {
  try {
    const existing = await db_client.query(CHECK_EMAIL_QUERY, [client.client_email]);
    if (existing.rows.length !== 0) {
      throw new BadRequestError("Client with this email already exists");
    }

    const result = await db_client.query(CREATE_CLIENT_QUERY, [
      client.client_name,
      client.client_email,
      client.client_phone || null,
      client.client_address || null,
    ]);

    if (result.rows.length === 0) {
      throw new BadRequestError("Error creating client");
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
