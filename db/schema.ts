import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const recipes = pgTable("recipes", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  folderId: uuid("folder_id"),
  createdAt: timestamp("created_at").defaultNow(),
  href: text("href"),
  image: text("image"),
  title: text("title"),
  description: text("description"),
  ingredients: text("ingredients").array(),
  directions: text("directions").array(),
});

export const recipesRelations = relations(recipes, ({ one }) => ({
  folder: one(folders, {
    fields: [recipes.folderId],
    references: [folders.id],
  }),
}));

export const folders = pgTable("folders", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  name: text("name").notNull(),
});

export const foldersRelations = relations(folders, ({ many }) => ({
  recipes: many(recipes),
}));
