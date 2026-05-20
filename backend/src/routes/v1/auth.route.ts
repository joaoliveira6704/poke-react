import { type FastifyInstance, type RouteShorthandOptions } from "fastify";
import { login, validateToken } from "../../controllers/auth.controller";

const opts: RouteShorthandOptions = {
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          id: { type: "number" },
          token: { type: "string" },
          username: { type: "string" },
          password: { type: "string" },
        },
      },
      404: {
        type: "object",
        properties: {
          code: { type: "number" },
          status: { type: "string" },
          message: { type: "string" },
        },
      },
    },
  },
};

export default async function authRoutes(server: FastifyInstance) {
  server.post("/login", opts, login);
  server.get("/validate-token", validateToken);
}
