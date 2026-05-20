import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const session = pgTable("sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  token: text("token").notNull(),
});

export type Session = InferSelectModel<typeof session>;
export type NewSession = InferInsertModel<typeof session>;
