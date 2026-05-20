import { type FastifyInstance, type RouteShorthandOptions } from "fastify";
import { getUser, getUsers } from "../../controllers/user.controller";

type Params = { username: string };

const opts: RouteShorthandOptions = {
  schema: {
    params: {
      type: "object",
      properties: {
        username: { type: "string" },
      },
    },
    response: {
      200: {
        type: "object",
        properties: {
          id: { type: "number" },
          username: { type: "string" },
          password: { type: "string" },
          name: { type: "string" },
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

export default async function userRoutes(server: FastifyInstance) {
  server.get<{ Params: Params }>("/:username", opts, getUser);
  server.get("/", getUsers);
}
