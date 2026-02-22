import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { corsOptions } from "./core/helpers/cors/cors";
import errorMiddleware from "./core/middleware/error.middleware";
import { sessionMiddleware } from "./core/middleware/session.middleware";
import { UPLOAD_DIR } from "./core/helpers/constants";
import { authRouter } from "./routes/auth/presentation/auth.route";
import { clientsRouter } from "./routes/clients/presentation/clients.route";
import { ordersRouter } from "./routes/orders/presentation/orders.route";
import { orderItemsRouter } from "./routes/order_items/presentation/order_items.route";
import { assemblyRouter } from "./routes/assembly/presentation/assembly.route";
import { dashboardRouter } from "./routes/dashboard/presentation/dashboard.route";

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
app.use(`${BASE_URL}/clients`, clientsRouter);
app.use(`${BASE_URL}/orders`, ordersRouter);
app.use(`${BASE_URL}/order-items`, orderItemsRouter);
app.use(`${BASE_URL}/assembly`, assemblyRouter);
app.use(`${BASE_URL}/dashboard`, dashboardRouter);

// ERROR MIDDLEWARE
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
