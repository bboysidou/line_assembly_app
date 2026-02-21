import { Store, type SessionData } from "express-session";
import { Pool } from "pg";
import { createClient } from "redis";
import { SESSION_EXPIRATION } from "../constants";

export class SessionStore extends Store {
  private pgPool: Pool;
  private redisClient: ReturnType<typeof createClient>;

  constructor(pgPool: Pool, redisClient: ReturnType<typeof createClient>) {
    super();
    this.pgPool = pgPool;
    this.redisClient = redisClient;
  }

  async get(
    sid: string,
    callback: (err: Error | null, session?: SessionData | null) => void,
  ) {
    try {
      // redis
      const redisData = await this.redisClient.get(`sess:${sid}`);
      if (redisData) {
        return callback(null, JSON.parse(redisData));
      }

      // fallback to Postgres
      const { rows } = await this.pgPool.query(
        "SELECT sess FROM sessions WHERE sid = $1 AND expire > NOW()",
        [sid],
      );
      if (rows.length > 0) {
        return callback(null, rows[0].sess);
      }

      callback(null, null);
    } catch (err) {
      callback(err as Error);
    }
  }

  async set(sid: string, sess: SessionData, callback?: (err?: Error) => void) {
    try {
      const expiresAt = new Date(Date.now() + SESSION_EXPIRATION);

      await this.redisClient.setEx(
        `sess:${sid}`,
        SESSION_EXPIRATION / 1000,
        JSON.stringify(sess),
      );

      await this.pgPool.query(
        "INSERT INTO sessions (sid, sess, expire) VALUES ($1, $2, $3) ON CONFLICT (sid) DO UPDATE SET sess = $2, expire = $3",
        [sid, sess, expiresAt],
      );

      await this.pgPool.query("DELETE FROM sessions WHERE expire < NOW()");

      callback?.();
    } catch (err) {
      callback?.(err as Error);
    }
  }

  async touch(sid: string, _: SessionData, callback?: (err?: Error) => void) {
    try {
      const expiresAt = new Date(Date.now() + SESSION_EXPIRATION);

      await this.redisClient.expire(`sess:${sid}`, SESSION_EXPIRATION / 1000);

      await this.pgPool.query(
        "UPDATE sessions SET expire = $1 WHERE sid = $2",
        [expiresAt, sid],
      );

      callback?.();
    } catch (err) {
      callback?.(err as Error);
    }
  }

  async destroy(sid: string, callback?: (err?: Error) => void) {
    try {
      await this.redisClient.del(`sess:${sid}`);
      await this.pgPool.query("DELETE FROM sessions WHERE sid = $1", [sid]);
      callback?.();
    } catch (err) {
      callback?.(err as Error);
    }
  }
}
export { SESSION_EXPIRATION };
