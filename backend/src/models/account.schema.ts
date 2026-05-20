import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const account = pgTable("accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  password: text("password").notNull(),
});

export type Account = InferSelectModel<typeof account>;
export type NewAccount = InferInsertModel<typeof account>;
