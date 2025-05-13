import { relations } from 'drizzle-orm';
import { pgTable, integer, serial, varchar, uuid, text, timestamp, decimal, boolean, index, uniqueIndex } from 'drizzle-orm/pg-core';

export const categoriesTable = pgTable("categories", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  parentId: integer("parent_id"),
  level: integer("level").notNull().$type < 1 | 2 | 3 > (),
  note: varchar("note", { length: 255 }).default(""),
  path: varchar("path", { length: 255 }).unique(),
  slug: varchar("slug", { length: 255 }),
}, (table) => [  
  uniqueIndex('categories_path_idx').on(table.path),
  index('categories_slug_idx').on(table.slug),
]);

export type Category = typeof categoriesTable.$inferSelect;

export const postsTable = pgTable('posts', {
  id: serial('id').primaryKey(),
  userId:varchar('userId',{ length: 255 }).notNull().references(() => user.id, { onDelete: 'cascade' }),
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
 updatedAt: timestamp('updated_at').notNull(),
 role: text('role'),
 banned: boolean('banned'),
 banReason: text('ban_reason'),
 banExpires: timestamp('ban_expires')
				});


export type User = typeof user.$inferSelect;

export const userRelations = relations(user, ({ many }) => ({
  posts: many(postsTable)
}));

export const postsRelations = relations(postsTable, ({ one }) => ({
  user: one(user, {
    fields: [postsTable.userId],
    references: [user.id]
  })
}));

export const session = pgTable("session", {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
token: text('token').notNull().unique(),
createdAt: timestamp('created_at').notNull(),
updatedAt: timestamp('updated_at').notNull(),
ipAddress: text('ip_address'),
userAgent: text('user_agent'),
 userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' }),
 impersonatedBy: text('impersonated_by')
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

export const articlesTable = pgTable('articles', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  content: text('content').notNull(),
  level1CategoryId: integer('level1_category_id').references(() => categoriesTable.id, { onDelete: 'set null' }),
  level2CategoryId: integer('level2_category_id').references(() => categoriesTable.id, { onDelete: 'set null' }),
  level3CategoryId: integer('level3_category_id').references(() => categoriesTable.id, { onDelete: 'set null' }),
  targetState: varchar('target_state', { length: 100 }),
  targetCity: varchar('target_city', { length: 100 }),
  metaDescription: varchar('meta_description', { length: 300 }),
  metaKeywords: text('meta_keywords'),
  authorId: text('author_id').references(() => user.id, { onDelete: 'set null' }),
  status: varchar('status', { length: 50 }).default('draft').notNull(),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    slugIdx: index('articles_slug_idx').on(table.slug),
    categoryStatusIdx: index('articles_category_status_idx').on(table.level1CategoryId, table.level2CategoryId, table.level3CategoryId, table.status),
    locationStatusIdx: index('articles_location_status_idx').on(table.targetState, table.targetCity, table.status),
    authorIdx: index('articles_author_idx').on(table.authorId),
  };
});

export const articlesRelations = relations(articlesTable, ({ one }) => ({
  author: one(user, {
    fields: [articlesTable.authorId],
    references: [user.id],
  }),
  level1Category: one(categoriesTable, {
    fields: [articlesTable.level1CategoryId],
    references: [categoriesTable.id],
    relationName: 'article_level1_category',
  }),
  level2Category: one(categoriesTable, {
    fields: [articlesTable.level2CategoryId],
    references: [categoriesTable.id],
    relationName: 'article_level2_category',
  }),
  level3Category: one(categoriesTable, {
    fields: [articlesTable.level3CategoryId],
    references: [categoriesTable.id],
    relationName: 'article_level3_category',
  }),
}));

export type Article = typeof articlesTable.$inferSelect;
export type NewArticle = typeof articlesTable.$inferInsert;

export const postImagesTable = pgTable('postImages',{
  id: serial('id').primaryKey(),
  assetId: varchar('asset_id', { length: 255 }).notNull(),
  publicId: varchar('public_id', { length: 255 }).notNull().unique(),
  version: integer('version').notNull(),
  versionId: varchar('version_id', { length: 255 }).notNull(),
  signature: varchar('signature', { length: 255 }).notNull(),
  width: integer('width').notNull(),
  height: integer('height').notNull(),
  format: varchar('format', { length: 50 }).notNull(),
  resourceType: varchar('resource_type', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').notNull(),
  tags: text('tags').array(),
  bytes: integer('bytes').notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  etag: varchar('etag', { length: 255 }).notNull(),
  placeholder: boolean('placeholder').notNull().default(false),
  url: text('url').notNull(),
  secureUrl: text('secure_url').notNull(),
  assetFolder: varchar('asset_folder', { length: 255 }),
  displayName: varchar('display_name', { length: 255 }),
  originalFilename: text('original_filename'),
  postId: integer('post_id').references(() => postsTable.id, { onDelete: 'cascade' }),
});

export type Image = typeof postImagesTable.$inferSelect;
export type NewImage = typeof postImagesTable.$inferInsert;
