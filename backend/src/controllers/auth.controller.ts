import { type FastifyRequest, type FastifyReply } from "fastify";
import { db } from "../services/db.service";

type Body = { username: string; password: string };

type ValidateRes = { valid: boolean; user?: { id: number; username: string } };

export async function login(
  req: FastifyRequest<{ Body: Body }>,
  res: FastifyReply,
) {
  if (!req.body) {
    return res
      .status(400)
      .send({ code: 400, status: "error", message: "Missing request body" });
  }
  const { username, password } = req.body;

  const result = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.username, username),
    with: {
      account: true,
    },
  });

  if (!result || result.account.password !== password) {
    return res
      .status(400)
      .send({ code: 400, status: "error", message: "Invalid credentials" });
  }

  const session = await db.query.session.findFirst({
    where: (s, { eq }) => eq(s.userId, result.id),
  });

  if (!session) {
    return res
      .status(500)
      .send({ code: 500, status: "error", message: "No session found" });
  }

  return res.status(200).send({
    id: result.id,
    username: result.username,
    token: session.token,
  });
}

export async function validateToken(
  req: FastifyRequest,
  res: FastifyReply,
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).send({ valid: false });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).send({ valid: false });
    }

    const session = await db.query.session.findFirst({
      where: (s, { eq }) => eq(s.token, token),
      with: { user: true },
    });

    if (!session) {
      return res.status(401).send({ valid: false });
    }

    if (!session.user) {
      return res.status(401).send({ valid: false });
    }

    return res.status(200).send({
      valid: true,
      user: { id: session.user.id, username: session.user.username },
    } satisfies ValidateRes);
  } catch (err) {
    req.log.error(err, "validate-token error");
    return res.status(500).send({ valid: false });
  }
}
