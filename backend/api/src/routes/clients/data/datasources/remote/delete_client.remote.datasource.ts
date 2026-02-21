// delete_client.remote.datasource.ts
import { db_client } from "@/core/database/db.config";
import {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} from "@/core/errors/custom.error";

const DELETE_CLIENT_QUERY = `
DELETE FROM clients
WHERE id_client = $1
RETURNING *
`;

export const DeleteClientRemoteDataSource = async (
  id_client: string,
): Promise<void> => {
  try {
    const result = await db_client.query(DELETE_CLIENT_QUERY, [id_client]);

    if (result.rows.length === 0) {
      throw new NotFoundError("Client not found");
    }
  } catch (error) {
    console.log(error);
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      throw error;
    }
    throw new InternalServerError("An error occurred");
  }
};
