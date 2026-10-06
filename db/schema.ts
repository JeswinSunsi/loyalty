import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const customers = sqliteTable("customers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  phoneHash: text("phone_hash").notNull().unique(),
  birthHash: text("birth_hash").notNull(),
  phoneLast4: text("phone_last4").notNull(),
  cardToken: text("card_token").notNull().unique(),
  punches: integer("punches").notNull().default(0),
  lastPunchAt: text("last_punch_at"),
  createdAt: text("created_at").notNull(),
});
