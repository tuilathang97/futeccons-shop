
import { relations } from 'drizzle-orm';
import { pgTable, integer,serial,varchar, uuid, text, timestamp, decimal, boolean } from 'drizzle-orm/pg-core';

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
  level1Category: integer('level1_category').notNull(),
  level2Category: integer('level2_category').notNull(),
  level3Category: integer('level3_category').notNull(),
  path: varchar('path', { length: 255 }),
  thanhPho: varchar('thanh_pho', { length: 255 }).notNull(),
  thanhPhoCodeName: varchar('thanh_pho_code_name', { length: 255 }).notNull(),
  quan: varchar('quan', { length: 255 }).notNull(),
  tieuDeBaiViet:varchar('tieu-de').notNull(),
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


export const user = pgTable("user", {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
email: text('email').notNull().unique(),
emailVerified: boolean('email_verified').notNull(),
image: text('image'),
createdAt: timestamp('created_at').notNull(),
updatedAt: timestamp('updated_at').notNull()
});


export type User = typeof user.$inferSelect;

export const session = pgTable("session", {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
token: text('token').notNull().unique(),
createdAt: timestamp('created_at').notNull(),
updatedAt: timestamp('updated_at').notNull(),
ipAddress: text('ip_address'),
userAgent: text('user_agent'),
userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' })
});


export type Session = typeof session.$inferSelect;

export const account = pgTable("account", {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
providerId: text('provider_id').notNull(),
userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' }),
accessToken: text('access_token'),
refreshToken: text('refresh_token'),
idToken: text('id_token'),
accessTokenExpiresAt: timestamp('access_token_expires_at'),
refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
scope: text('scope'),
password: text('password'),
createdAt: timestamp('created_at').notNull(),
updatedAt: timestamp('updated_at').notNull()
});

export type Account = typeof account.$inferSelect;


export const verification = pgTable("verification", {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
value: text('value').notNull(),
expiresAt: timestamp('expires_at').notNull(),
createdAt: timestamp('created_at'),
updatedAt: timestamp('updated_at')
});
