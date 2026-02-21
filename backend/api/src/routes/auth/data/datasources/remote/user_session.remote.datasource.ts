import { db_client } from "@/core/database/db.config";
import { redisClient } from "@/core/database/redis.config";
import {
  BadRequestError,
  InternalServerError,
} from "@/core/errors/custom.error";
import { SESSION_EXPIRATION } from "@/core/helpers/constants";
import { UserEntity } from "@/routes/auth/domain/entities/auth.entity";

const SESSION_QUERY =
  "SELECT u.id_user, u.username FROM sessions s INNER JOIN users u ON u.id_user = (s.sess->'user'->>'id_user')::INTEGER WHERE s.sid = $1 AND s.expire > NOW()";

const SESSION_UPDATE_EXPIRE =
  "UPDATE sessions SET sess = jsonb_set( sess::jsonb, '{cookie,expires}', to_jsonb($2::timestamp), true), expire = $2 WHERE sid = $1 RETURNING sid";

export const UserSessionRemoteDataSource = async (
  sid: string,
): Promise<UserEntity> => {
  try {
    // Try Redis first
    const redisKey = `sess:${sid}`;
    const redisData = await redisClient.get(redisKey);
    
    if (redisData) {
      const sessionData = JSON.parse(redisData);
      if (sessionData.user && sessionData.user.id_user) {
        // Update session expiration in Redis
        const expiresAt = Math.floor(SESSION_EXPIRATION / 1000);
        await redisClient.expire(redisKey, expiresAt);
        
        // Get user from database
        const { rows } = await db_client.query(
          "SELECT id_user, username FROM users WHERE id_user = $1",
          [sessionData.user.id_user]
        );
        
        if (rows.length === 0) {
          throw new BadRequestError("User not found");
        }
        
        return rows[0];
      }
    }

    // Fallback to PostgreSQL
    const session = await db_client.query(SESSION_QUERY, [sid]);
    if (session.rows.length === 0) {
      throw new BadRequestError("Session expired");
    }

    const expiresAt = new Date(Date.now() + SESSION_EXPIRATION);
    const update = await db_client.query(SESSION_UPDATE_EXPIRE, [
      sid,
      expiresAt,
    ]);

    if (update.rows.length === 0) {
      throw new BadRequestError("Error updating session expired");
    }

    return {
      ...session.rows[0],
    };
  } catch (error) {
    console.log(error);
    throw new InternalServerError("An error ocurred");
  }
};
