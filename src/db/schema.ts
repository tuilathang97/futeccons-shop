
import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';

export const categoriesTable = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  parentId: integer('parent_id').references(() => categories.id),
  note: text('note'),
});

// TODO: export typeof Category