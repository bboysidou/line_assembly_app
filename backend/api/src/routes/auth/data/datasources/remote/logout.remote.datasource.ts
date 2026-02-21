import { db_client } from "@/core/database/db.config";
import { redisClient } from "@/core/database/redis.config";
import {
  BadRequestError,
  InternalServerError,
} from "@/core/errors/custom.error";

const LOGOUT_QUERY =
  "DELETE FROM sessions WHERE sid = $1 RETURNING sid, (sess->'user'->>'id_user')::UUID AS id_user";

export const LogoutRemoteDataSource = async (sid: string): Promise<string> => {
  try {
    const key = `sess:${sid}`;
    const redis = await redisClient.del(key);

    if (redis === 0) {
      throw new BadRequestError("Session not found");
    }

    const result = await db_client.query(LOGOUT_QUERY, [sid]);
    if (result.rows.length === 0) {
      throw new BadRequestError("Invalid credentials");
    }

    return result.rows[0].sid;
  } catch (error) {
    console.log(error);
    if (error instanceof BadRequestError) {
      throw new BadRequestError(error.message);
    }
    throw new InternalServerError("An error ocurred");
  }
};
