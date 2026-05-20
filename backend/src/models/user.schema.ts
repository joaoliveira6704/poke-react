import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const user = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  name: text("name").notNull(),
});

export type User = InferSelectModel<typeof user>;
export type NewUser = InferInsertModel<typeof user>;
