import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as userSchema from "../models/user.schema";
import * as accountSchema from "../models/account.schema";
import * as relations from "../models/relations";
import * as sessionSchema from "../models/session.schema";

const client = postgres(process.env.DATABASE_URL as string);

export const db = drizzle(client, {
  schema: {
    ...userSchema,
    ...accountSchema,
    ...sessionSchema,
    ...relations,
  },
});
