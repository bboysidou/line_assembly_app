import { createClient } from "redis";
const { REDIS_HOST, REDIS_PORT } = process.env;

if (!REDIS_HOST || !REDIS_PORT) {
  console.error("Redis configuration is missing");
  process.exit(1);
}

const redisClient = createClient({
  url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
});

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

redisClient.on("connect", () => {
  console.log("Redis client connected (connecting...)");
});

redisClient.on("ready", () => {
  console.log("Redis is ready to use");
});

redisClient.connect().catch(console.error);

export { redisClient };
