import session from "express-session";
import {
  SESSION_EXPIRATION,
  SessionStore,
} from "../helpers/sessions/session.store";
import { db_client } from "../database/db.config";
import dotenv from "dotenv";
import { redisClient } from "../database/redis.config";
dotenv.config();

const { AUTH_SECRET, ENV } = process.env;

export const sessionMiddleware = session({
  store: new SessionStore(db_client, redisClient),
  secret: AUTH_SECRET as string,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: SESSION_EXPIRATION,
    httpOnly: true,
    secure: ENV !== "dev",
  },
});
