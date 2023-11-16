import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const recipes = pgTable("recipes", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  href: text("href"),
  image: text("image"),
  title: text("title"),
  description: text("description"),
  folder: text("folder"),
  ingredients: text("ingredients").array(),
  directions: text("directions").array(),
});
