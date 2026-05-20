import { type FastifyRequest, type FastifyReply } from "fastify";
import { eq } from "drizzle-orm";
import { db } from "../services/db.service";

type Params = { username: string };

type Response = {
  id: number;
  username: string;
  name: string;
};

export async function getUser(
  req: FastifyRequest<{ Params: Params }>,
  res: FastifyReply,
) {
  const { username } = req.params;

  const user = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.username, username),
  });

  if (!user) {
    return res
      .status(404)
      .send({ code: 404, status: "error", message: "User not found" });
  }

  return user;
}

export async function getOwnUser(
  req: FastifyRequest<{ Params: Params }>,
  res: FastifyReply,
) {
  const { username } = req.params;

  const user = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.username, username),
  });

  if (!user) {
    return res
      .status(404)
      .send({ code: 404, status: "error", message: "User not found" });
  }

  return user;
}

export async function getUsers(
  req: FastifyRequest,
  res: FastifyReply<{ Reply: Response[] }>,
) {
  const users: Response[] = await db.query.user.findMany({});

  if (users.length === 0) {
    return res
      .status(404)
      .send({ code: 404, status: "error", message: "User not found" });
  }

  return users;
}
