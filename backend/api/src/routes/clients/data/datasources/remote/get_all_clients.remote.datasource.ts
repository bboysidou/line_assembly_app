// get_all_clients.remote.datasource.ts
import { db_client } from "@/core/database/db.config";
import {
  BadRequestError,
  InternalServerError,
} from "@/core/errors/custom.error";
import type { ClientEntity } from "../../../domain/entities/client.entity";

const GET_ALL_CLIENTS_QUERY = `
SELECT * FROM clients
ORDER BY created_at DESC
`;

export const GetAllClientsRemoteDataSource = async (): Promise<ClientEntity[]> => {
  try {
    const result = await db_client.query(GET_ALL_CLIENTS_QUERY);
    return result.rows;
  } catch (error) {
    console.log(error);
    if (error instanceof BadRequestError) {
      throw new BadRequestError(error.message);
    }
    throw new InternalServerError("An error occurred");
  }
};
