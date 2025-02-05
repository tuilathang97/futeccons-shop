
import { InferSelectModel, relations } from 'drizzle-orm';
import { pgTable, integer, varchar, uuid, text, timestamp, index, uniqueIndex, primaryKey } from 'drizzle-orm/pg-core';

export const categoriesTable = pgTable("categories", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  parentId: integer("parent_id"),
  level: integer("level").notNull().$type < 1 | 2 | 3 > (),
  note: varchar("note", { length: 255 }),
});

export const categoriesRelation = relations(categoriesTable, ({one}) => ({
  parent: one(categoriesTable, {
    fields: [categoriesTable.parentId],
    references: [categoriesTable.id]
  })
}));

export const usersTable = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  fullName: varchar('full_name', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [{
  emailIndex: uniqueIndex('email_idx').on(table.email),
}]);

export type User = typeof usersTable.$inferSelect;

export const sessionTable = pgTable("session", {
	id: text("id").primaryKey(),
	userId: uuid("user_id")
		.notNull()
		.references(() => usersTable.id),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date"
	}).notNull()
});

export type Session = InferSelectModel<typeof sessionTable>;

export const rolesTable = pgTable('roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }).unique().notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Role = typeof rolesTable.$inferSelect;

export const permissionsTable = pgTable('permissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }).unique().notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Permission = typeof permissionsTable.$inferSelect;

export const usersToRoles = pgTable('users_to_roles', {
  userId: uuid('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  roleId: uuid('role_id').notNull().references(() => rolesTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [{
  pk: primaryKey({
    columns: [
      table.userId,
      table.roleId
    ]
  }),
  // userIndex: index('user_idx').on(table.userId),
}]);

export const rolesToPermissions = pgTable('roles_to_permissions', {
  roleId: uuid('role_id').notNull().references(() => rolesTable.id, { onDelete: 'cascade' }),
  permissionId: uuid('permission_id').notNull().references(() => permissionsTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [{
  pk: primaryKey({
    columns: [table.roleId, table.permissionId]
  }),
  roleIndex: index('role_idx').on(table.roleId),
}]);

export const usersRelations = relations(usersTable, ({ many }) => ({
  userRoles: many(usersToRoles),
}));

export const rolesRelations = relations(rolesTable, ({ many }) => ({
  usersToRoles: many(usersToRoles),
  rolesToPermissions: many(rolesToPermissions),
}));

export const permissionsRelations = relations(permissionsTable, ({ many }) => ({
  permissionsToRoles: many(rolesToPermissions),
}));