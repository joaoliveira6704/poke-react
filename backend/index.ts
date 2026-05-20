import Fastify from "fastify";
import cors from "@fastify/cors";
import "dotenv/config";
import v1Routes from "./src/routes/v1/index";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "./src/services/db.service";

const server = Fastify({ logger: true });

server.register(cors, {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
});
server.addContentTypeParser(
  "application/json",
  { parseAs: "string" },
  (req, body, done) => {
    try {
      done(null, JSON.parse(body as string));
    } catch (err) {
      done(err as Error, undefined);
    }
  },
);
server.register(v1Routes, { prefix: "/api/v1" });

const start = async () => {
  try {
    // Runs all pending migrations from the migrations folder
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("Migrations applied");

    await server.listen({ port: 3000 });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
start();
