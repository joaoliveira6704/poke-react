import { type FastifyInstance, type RouteShorthandOptions } from "fastify";

const opts: RouteShorthandOptions = {
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          version: { type: "string" },
          status: { type: "string" },
        },
      },
    },
  },
};

export default async function statusRoutes(server: FastifyInstance) {
  server.get("/", opts, async () => {
    return { version: "v1", status: "alive" };
  });
}
