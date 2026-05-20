import { type FastifyInstance } from "fastify";
import statusRoutes from "./status.route";
import userRoutes from "./user.route";
import authRoutes from "./auth.route";

export default async function v1Routes(server: FastifyInstance) {
  server.register(statusRoutes, { prefix: "/status" });
  server.register(userRoutes, { prefix: "/users" });
  server.register(authRoutes, { prefix: "/auth" });
}
