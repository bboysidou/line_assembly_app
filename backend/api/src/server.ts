import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { corsOptions } from "./core/helpers/cors/cors";
import errorMiddleware from "./core/middleware/error.middleware";
import { sessionMiddleware } from "./core/middleware/session.middleware";
import { UPLOAD_DIR } from "./core/helpers/constants";
import { authRouter } from "./routes/auth/presentation/auth.route";

dotenv.config();

const {
  PORT,
  BASE_URL,
  SALTS_ROUNDS,
  DB_NAME,
  DB_USER,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  AUTH_SECRET,
  REDIS_HOST,
  REDIS_PORT,
  ENV,
} = process.env;

if (
  !PORT ||
  !BASE_URL ||
  !SALTS_ROUNDS ||
  !DB_NAME ||
  !DB_USER ||
  !DB_HOST ||
  !DB_PASSWORD ||
  !DB_PORT ||
  !AUTH_SECRET ||
  !REDIS_HOST ||
  !REDIS_PORT ||
  !ENV
) {
  console.error("Missing required environment variables");
  process.exit(1);
}

const app = express();

// MIDDLEWARES
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);

app.use("/media", express.static(UPLOAD_DIR));

// ROUTES
app.use(`${BASE_URL}/auth`, authRouter);

// ERROR MIDDLEWARE
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
