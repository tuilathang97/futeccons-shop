
import { pgTable, integer, varchar } from 'drizzle-orm/pg-core';

export const categoriesTable = pgTable("categories", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  parentId: integer("parent_id").references(() => categoriesTable.id).default(null),
  level: integer("level").notNull().$type < 1 | 2 | 3 > (),
  note: varchar("note", { length: 255 }),
});

