import { type FastifyRequest, type FastifyReply } from "fastify";
import { db } from "../services/db.service";
import { account } from "../models/account.schema";
import { user } from "../models/user.schema";
import { randomUUIDv7 } from "bun";
import { session } from "../models/session.schema";
import { password as bpass } from "bun";
import { verifyPassword } from "../utils/password";

type Body = { username: string; password: string };

type ValidateRes = { valid: boolean; user?: { id: number; username: string } };

export async function login(
  req: FastifyRequest<{ Body: Body }>,
  res: FastifyReply,
) {
  try {
    if (!req.body) {
      return res
        .status(400)
        .send({ code: 400, status: "error", message: "Missing request body" });
    }

    const { username, password } = req.body;

    const result = await db.query.user.findFirst({
      where: (u, { eq }) => eq(u.username, username),
      with: { account: true },
    });
    console.log(result);
    const isValidPassword = await verifyPassword(
      password,
      result?.account.password,
    );

    if (!result || !isValidPassword) {
      return res
        .status(400)
        .send({ code: 400, status: "error", message: "Invalid credentials" });
    }

    let existingSession = await db.query.session.findFirst({
      where: (s, { eq }) => eq(s.userId, result.id),
    });

    if (!existingSession) {
      const [created] = await db
        .insert(session)
        .values({ userId: result.id, token: randomUUIDv7() })
        .returning();
      existingSession = created;
    }

    return res.status(200).send({
      id: result.id,
      username: result.username,
      token: existingSession.token,
    });
  } catch (err) {
    req.log.error(err, "login error");
    return res
      .status(500)
      .send({ code: 500, status: "error", message: "Internal server error" });
  }
}
export async function validateToken(req: FastifyRequest, res: FastifyReply) {
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

export async function registerUser(
  req: FastifyRequest<{ Params: Params }>,
  res: FastifyReply,
) {
  const { name, username, password } = req.body;

  const existing = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.username, username),
  });

  if (existing) {
    return res
      .status(400)
      .send({ code: 400, status: "error", message: "Username already taken" });
  }

  // Insert user
  const [newUser] = await db
    .insert(user)
    .values({ name, username })
    .returning();

  const hashedPassword = await bpass.hash(password, {
    algorithm: "bcrypt",
    cost: 12,
  });

  // Insert account (password)
  await db
    .insert(account)
    .values({ userId: newUser.id, password: hashedPassword })
    .returning();

  return res.status(200).send({
    id: newUser.id,
    username: newUser.username,
    name: newUser.name,
  });
}
