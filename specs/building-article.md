# Roadmap: Real Estate Article System (Next.js, Drizzle, ShadCN)

This document outlines the step-by-step plan to build the article writing and display feature for the real estate application.

## Phase 1: Core Planning & Data Structure (Next.js, Drizzle ORM)

1.  **Define Drizzle Schema for `articles` Table**
    *   The `categoriesTable` and `user` table already exist in `src/db/schema.ts`.
    *   The new `articlesTable` will store article content, its associated categories, location targeting, and metadata.
    *   **Schema for `articlesTable` (to be added to `src/db/schema.ts` or a new relevant schema file):**
        ```typescript
        import { pgTable, serial, varchar, text, timestamp, integer, index } from 'drizzle-orm/pg-core';
        import { relations } from 'drizzle-orm';
        // Ensure these imports point to your actual schema definitions
        // For example, if they are all in the same `schema.ts` file, direct imports might not be needed,
        // or adjust paths if they are in separate files like `src/db/schemas/categories.ts`.
        import { categoriesTable } from './schema'; // Or specific path if categoriesTable is elsewhere
        import { user } from './schema'; // Or specific path if user table is elsewhere

        export const articlesTable = pgTable('articles', {
          id: serial('id').primaryKey(),
          title: varchar('title', { length: 255 }).notNull(),
          slug: varchar('slug', { length: 255 }).unique().notNull(), // SEO-friendly URL part
          content: text('content').notNull(), // Stores HTML or JSON from the rich text editor
          level1CategoryId: integer('level1_category_id').references(() => categoriesTable.id, { onDelete: 'set null' }), // Or 'cascade' / 'restrict'
          level2CategoryId: integer('level2_category_id').references(() => categoriesTable.id, { onDelete: 'set null' }),
          level3CategoryId: integer('level3_category_id').references(() => categoriesTable.id, { onDelete: 'set null' }),
          targetState: varchar('target_state', { length: 100 }), // For location-specific articles, nullable
          targetCity: varchar('target_city', { length: 100 }), // For location-specific articles, nullable
          metaDescription: varchar('meta_description', { length: 300 }), // For SEO
          metaKeywords: text('meta_keywords'), // For SEO, comma-separated or JSON
          authorId: text('author_id').references(() => user.id, { onDelete: 'set null' }), // Link to the user who wrote the article
          status: varchar('status', { length: 50 }).default('draft').notNull(), // 'draft', 'published', 'archived'
          publishedAt: timestamp('published_at'), // Timestamp when the article was/is to be published
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

        // Define relations for easier querying
        export const articlesRelations = relations(articlesTable, ({ one }) => ({
          author: one(user, {
            fields: [articlesTable.authorId],
            references: [user.id],
          }),
          level1Category: one(categoriesTable, {
            fields: [articlesTable.level1CategoryId],
            references: [categoriesTable.id],
            relationName: 'article_level1_category', // Explicit relation name to avoid conflicts if categoriesTable has multiple relations
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

        export type Article = typeof articlesTable.$inferSelect; // For selecting data
        export type NewArticle = typeof articlesTable.$inferInsert; // For inserting data
        ```
    *   **Notes on Indexing:**
        *   `slug`: For fast lookups by slug.
        *   `(level1CategoryId, level2CategoryId, level3CategoryId, status)`: For querying articles by category path and status.
        *   `(targetState, targetCity, status)`: For querying location-specific articles.
        *   `authorId`: If you frequently query articles by author.

2.  **Set up Drizzle Migrations**
    *   After adding the `articlesTable` schema to your Drizzle schema file(s):
    *   Generate the migration: `pnpm drizzle-kit generate:pg` (or your configured command).
    *   Review the generated SQL migration file.
    *   Apply the migration to your Neon database: `pnpm drizzle-kit push:pg` (or `migrate` if using migration files).

3.  **Define URL Structure in Next.js (App Router)**
    *   **Public-facing Article Display:** Articles will be displayed *within* the existing category pages, not on separate dedicated article URLs.
        *   `src/app/(frontend)/[categoryLevel1]/page.tsx`
        *   `src/app/(frontend)/[categoryLevel1]/[categoryLevel2]/page.tsx`
        *   `src/app/(frontend)/[categoryLevel1]/[categoryLevel2]/[categoryLevel3]/page.tsx`
        *   These pages will fetch and display an article if one matches the category path and any `?state=xxxx&city=xxxx` query parameters.
    *   **Admin-facing article management pages:**
        *   `src/app/admin/articles/page.tsx` (List articles)
        *   `src/app/admin/articles/create/page.tsx` (Create new article form)
        *   `src/app/admin/articles/[articleId]/edit/page.tsx` (Edit existing article form)
    *   **Admin-facing category management:** Your `categoriesTable` already exists. Ensure you have UI for managing these if needed, as article creation will depend on them.

## Phase 2: Backend Development (API & Logic - Next.js Server Actions / API Routes)

1.  **Admin Panel/CMS for Article Management - Backend Logic**
    *   **Category Data Access:**
        *   Ensure you have Server Actions or utility functions to fetch categories for populating dropdowns in the article form (e.g., `getCategoriesByLevel(level, parentId?)`).
    *   **Article CRUD Operations (using Server Actions):**
        *   Location: `src/actions/articleActions.ts` (or similar)
        *   `createArticle(data: NewArticle): Promise<Article>`
        *   `getArticleById(id: number): Promise<Article | null>`
        *   `updateArticle(id: number, data: Partial<NewArticle>): Promise<Article>`
        *   `deleteArticle(id: number): Promise<void>`
        *   `listArticles(options: { page?: number, limit?: number, filters?: any }): Promise<{ articles: Article[], count: number }>`
        *   These actions will use Drizzle ORM to interact with the `articlesTable`.
    *   **Image Upload to Cloudinary (for Rich Text Editor):**
        *   Create a Next.js Server Action or API Route (e.g., `src/actions/uploadActions.ts` or `src/app/api/upload-image/route.ts`).
        *   **Server Action Example (`src/actions/uploadActions.ts`):**
            ```typescript
            'use server';
            import { v2 as cloudinary } from 'cloudinary';

            cloudinary.config({
              cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
              api_key: process.env.CLOUDINARY_API_KEY,
              api_secret: process.env.CLOUDINARY_API_SECRET,
              secure: true,
            });

            export async function uploadImageToCloudinary(formData: FormData) {
              const file = formData.get('image') as File;
              if (!file) {
                throw new Error('No image file provided.');
              }

              const fileBuffer = await file.arrayBuffer();
              const mimeType = file.type;
              const encoding = 'base64';
              const base64Data = Buffer.from(fileBuffer).toString('base64');
              const fileUri = 'data:' + mimeType + ';' + encoding + ',' + base64Data;

              try {
                const result = await cloudinary.uploader.upload(fileUri, {
                  invalidate: true,
                  folder: 'real_estate_articles', // Optional: organize in Cloudinary
                });
                return { success: true, url: result.secure_url };
              } catch (error) {
                console.error('Cloudinary upload error:', error);
                return { success: false, error: 'Upload failed' };
              }
            }
            ```
        *   Store Cloudinary credentials (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`) in `.env.local`.

2.  **Logic for Public Article Retrieval (Server Component / Server Action)**
    *   This logic will be invoked from within the existing category page components (`src/app/(frontend)/[categoryLevel1]/page.tsx`, `.../[categoryLevel2]/page.tsx`, `.../[categoryLevel3]/page.tsx`) or called by them from a dedicated Server Action.
    *   **Function Signature (example if in a Server Action `src/actions/articleActions.ts`):**
        `getPublishedArticleByParams(params: { level1Slug?: string, level2Slug?: string, level3Slug?: string, state?: string, city?: string }): Promise<Article | null>`
        (The function should be flexible to handle different levels of category depth)
    *   **Implementation Details:**
        1.  Fetch category IDs for `level1Slug`, `level2Slug`, `level3Slug` from `categoriesTable`.
        2.  If `state` and `city` are provided:
            Query `articlesTable` for: `level1/2/3CategoryId` AND `targetState` AND `targetCity` AND `status = 'published'`.
        3.  If article found, return it.
        4.  If only `state` is provided (or city-specific not found, and state-level fallback is desired):
            Query `articlesTable` for: `level1/2/3CategoryId` AND `targetState` AND `targetCity IS NULL` AND `status = 'published'`.
        5.  If article found, return it.
        6.  Fallback to path-param article (no location query OR location-specific article not found):
            Query `articlesTable` for: `level1/2/3CategoryId` AND `targetState IS NULL` AND `targetCity IS NULL` AND `status = 'published'`.
        7.  If article found, return it.
        8.  If no article found: Return `null` (frontend will handle 404).
    *   Use Drizzle ORM with `eq`, `and`, `isNull` conditions.

## Phase 3: Frontend Development (Next.js, ShadCN, Rich Text Editor)

1.  **Admin Panel - Article Management UI**
    *   **List Articles Page (`src/app/admin/articles/page.tsx`):**
        *   Use ShadCN `Table` to display articles (title, categories, status, published\_at).
        *   Columns for actions: Edit, Delete.
        *   Button (e.g., ShadCN `Button`) to navigate to "Create New Article" page.
        *   Client component fetching data via `listArticles` Server Action.
    *   **Create/Edit Article Form (`src/app/admin/articles/create/page.tsx`, `src/app/admin/articles/[articleId]/edit/page.tsx`):**
        *   Use ShadCN `Form` (with `react-hook-form`).
        *   ShadCN `Input` for `title`, `slug` (consider auto-generating slug from title, with manual override).
        *   **Rich Text Editor Component (Details below)** for `content`.
        *   ShadCN `Select` components for L1, L2, L3 categories. These should be dynamic: selecting L1 populates L2 options, selecting L2 populates L3 options. Fetch category data using Server Actions.
        *   ShadCN `Input` for `targetState`, `targetCity`.
        *   ShadCN `Textarea` for `metaDescription`, `metaKeywords`.
        *   ShadCN `Select` for `status` ('draft', 'published', 'archived').
        *   ShadCN `DatePicker` (from `ui/date-picker` if you have one, or build one) for `publishedAt`.
        *   Submit button calling `createArticle` or `updateArticle` Server Action.

2.  **Rich Text Editor Component with Cloudinary Image Upload**
    *   **Recommended Library: Tiptap** (Headless, extensible, good for Next.js).
        *   Install: `pnpm add @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link lucide-react`
    *   **Create Component (`src/components/tiptap-editor.tsx`):**
        ```tsx
        'use client';
        import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react';
        import StarterKit from '@tiptap/starter-kit';
        import Image from '@tiptap/extension-image';
        import Link from '@tiptap/extension-link';
        import { useCallback, useRef } from 'react';
        import { Bold, Italic, Strikethrough, Code, List, ListOrdered, ImageIcon, LinkIcon } from 'lucide-react';
        // Import your server action
        // import { uploadImageToCloudinary } from '@/actions/uploadActions'; // Adjust path

        // Placeholder for the actual server action call
        const uploadImageToCloudinary = async (formData: FormData) => {
          // This is a placeholder. In a real scenario, this would be a server action call.
          // For client-side demonstration if you don't want to set up server action immediately:
          const file = formData.get('image') as File;
          if (file) {
            return new Promise<{ success: boolean, url?: string, error?: string }>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                console.log("Simulating upload, returning placeholder URL for:", file.name);
                resolve({ success: true, url: reader.result as string }); // Use blob URL for local preview
              };
              reader.onerror = ()_ => resolve({ success: false, error: "File read error" });
              reader.readAsDataURL(file);
            });
          }
          return { success: false, error: "No file" };
        };


        interface TiptapEditorProps {
          content: string;
          onChange: (richText: string) => void;
          onBlur?: () => void;
        }

        export function TiptapEditor({ content, onChange, onBlur }: TiptapEditorProps) {
          const editor = useEditor({
            extensions: [
              StarterKit.configure({
                // configure options
              }),
              Image.configure({
                inline: false, // or true, depending on desired behavior
                allowBase64: true, // Useful for temporary display before upload or if not uploading
              }),
              Link.configure({
                openOnClick: false, // Recommended to handle navigation manually or confirm
                autolink: true,
              }),
            ],
            content: content,
            onUpdate: ({ editor }) => {
              onChange(editor.getHTML());
            },
            onBlur: () => {
              if (onBlur) onBlur();
            },
            editorProps: {
              attributes: {
                class: 'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none border p-4 rounded-md min-h-[300px]',
              },
            },
          });

          const imageInputRef = useRef<HTMLInputElement>(null);

          const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file && editor) {
              const formData = new FormData();
              formData.append('image', file);
              
              // Replace with actual server action call
              const result = await uploadImageToCloudinary(formData); // Ensure this is your actual server action

              if (result.success && result.url) {
                editor.chain().focus().setImage({ src: result.url }).run();
              } else {
                // Handle upload error (e.g., show a toast)
                console.error("Image upload failed:", result.error);
                alert(`Image upload failed: ${result.error}`);
              }
            }
            // Reset file input
            if(imageInputRef.current) imageInputRef.current.value = "";
          }, [editor]);
          
          const addLink = useCallback(() => {
            if (!editor) return;
            const previousUrl = editor.getAttributes('link').href;
            const url = window.prompt('URL', previousUrl);

            if (url === null) return; // Cancelled
            if (url === '') { // Unset link
              editor.chain().focus().extendMarkRange('link').unsetLink().run();
              return;
            }
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
          }, [editor]);


          if (!editor) {
            return null;
          }

          return (
            <div>
              <div className="toolbar flex flex-wrap gap-2 border p-2 rounded-t-md">
                {/* Basic Formatting */}
                <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}><Bold size={18}/></button>
                <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}><Italic size={18}/></button>
                <button onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'is-active' : ''}><Strikethrough size={18}/></button>
                <button onClick={() => editor.chain().focus().toggleCode().run()} className={editor.isActive('code') ? 'is-active' : ''}><Code size={18}/></button>
                <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'is-active' : ''}><List size={18}/></button>
                <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'is-active' : ''}><ListOrdered size={18}/></button>
                
                {/* Image Upload */}
                <input type="file" accept="image/*" ref={imageInputRef} onChange={handleImageUpload} style={{ display: 'none' }} />
                <button onClick={() => imageInputRef.current?.click()}><ImageIcon size={18}/></button>

                {/* Link */}
                <button onClick={addLink} className={editor.isActive('link') ? 'is-active' : ''}><LinkIcon size={18}/></button>
              </div>
              <EditorContent editor={editor} />
              {/* Example BubbleMenu */}
              <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className="bg-black text-white p-2 rounded shadow-lg flex gap-2">
                <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'font-bold' : ''}>Bold</button>
                <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'italic' : ''}>Italic</button>
              </BubbleMenu>
              {/* Example FloatingMenu */}
              <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }} className="bg-white border shadow-lg p-2 rounded flex gap-2">
                <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
                <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
                <button onClick={() => editor.chain().focus().toggleBulletList().run()}>List</button>
              </FloatingMenu>
            </div>
 