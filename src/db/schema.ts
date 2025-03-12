
import { InferSelectModel, relations } from 'drizzle-orm';
import { pgTable, integer,serial,varchar, uuid, text, timestamp, index, uniqueIndex, primaryKey, decimal, boolean } from 'drizzle-orm/pg-core';

export const categoriesTable = pgTable("categories", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  parentId: integer("parent_id"),
  level: integer("level").notNull().$type < 1 | 2 | 3 > (),
  note: varchar("note", { length: 255 }).default(""),
  path: varchar("path", { length: 255 }),
  slug: varchar("slug", { length: 255 }),
});

export type Category = typeof categoriesTable.$inferSelect;

export const postsTable = pgTable('posts', {
  id: serial('id').primaryKey(),
  userId:varchar('userId',{ length: 255 }).notNull(),
  active: boolean('active').notNull().default(false),
  level1Category: varchar('level1_category', { length: 255 }).notNull(),
  level2Category: varchar('level2_category', { length: 255 }).notNull(),
  level3Category: varchar('level3_category', { length: 255 }).notNull(),
  path: varchar('path', { length: 255 }),
  thanhPho: varchar('thanh_pho', { length: 255 }).notNull(),
  thanhPhoCodeName: varchar('thanh_pho_code_name', { length: 255 }).notNull(),
  quan: varchar('quan', { length: 255 }).notNull(),
  quanCodeName: varchar('quan_code_name', { length: 255 }).notNull(),
  phuong: varchar('phuong', { length: 255 }).notNull(),
  phuongCodeName: varchar('phuong_code_name', { length: 255 }).notNull(),
  duong: varchar('duong', { length: 255 }).notNull(),
  giaTien: decimal('gia_tien', { precision: 15, scale: 2 }).notNull(),
  dienTichDat: decimal('dien_tich_dat', { precision: 10, scale: 2 }).notNull(),
  soTang: integer('so_tang').notNull(),
  soPhongNgu: integer('so_phong_ngu').notNull(),
  soPhongVeSinh: integer('so_phong_ve_sinh').notNull(),
  giayToPhapLy: varchar('giay_to_phap_ly', { length: 255 }).notNull(),
  loaiHinhNhaO: varchar('loai_hinh_nha_o', { length: 255 }).notNull(),
  noiDung: text('noi_dung').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});


export type Post = typeof postsTable.$inferSelect;

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