import Redis from "ioredis";
require("dotenv").config();

const isDev = process.env.NODE_ENV === "development";

const redisClient = new Redis({
  host: isDev ? "localhost" : process.env.REDIS_HOST,
  port: isDev ? 6379 : Number(process.env.REDIS_PORT),
  username: process.env.REDIS_USERNAME, // optional, only if using ACLs
  password: process.env.REDIS_PASSWORD, // optional, only if set
  // tls: !isDev ? {} : undefined, // uncomment if you need TLS in production
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

export default redisClient;
