import { relations } from "drizzle-orm";
import { user } from "./user.schema";
import { account } from "./account.schema";
import { session } from "./session.schema";

export const userRelations = relations(user, ({ one }) => ({
  account: one(account, {
    fields: [user.id],
    references: [account.userId],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));
