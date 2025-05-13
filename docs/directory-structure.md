# Futeccons Shop Directory Structure Guidelines

## App Router Structure

The application follows Next.js App Router convention with special attention to route grouping for better organization.

### Route Structure

```
src/app/
├── (frontend)/             # Public-facing routes for end users
│   ├── page.tsx            # Homepage
│   ├── [categoryLevel1]/   # Dynamic category routes
│   │   ├── page.tsx
│   │   └── [categoryLevel2]/
│   │       ├── page.tsx
│   │       └── [categoryLevel3]/
│   │           └── page.tsx
├── (dashboard)/            # Admin dashboard routes
│   ├── admin/              # Admin functionality
│   │   ├── overview/       # Dashboard overview
│   │   ├── category/       # Category management
│   │   ├── articles/       # Article management
│   ├── layout.tsx          # Admin layout with authentication
├── api/                    # API routes
```

## Admin Pages Structure

All admin pages are now located under `src/app/(dashboard)/admin/` instead of `src/app/admin/`. This change is part of Next.js route grouping to apply common layouts and authentication.

### Features

- **Category Management**: `(dashboard)/admin/category/`
  - List, create, edit and delete categories
  - Manage category hierarchies

- **Article Management**: `(dashboard)/admin/articles/`
  - List articles by category
  - Create and edit articles with rich text editor
  - Manage article metadata and SEO

## Component Structure

Feature-specific components are organized by feature with a standard pattern:

```
components/
├── articles/
│   ├── ArticleCategoriesClientUI.tsx  # Main client component
│   ├── CategoryArticleTable.tsx       # Table display component
│   ├── CreateArticleModal.tsx         # Modal for creation/editing
│   ├── TiptapEditor.tsx               # Rich text editor
│   ├── articleSchema.ts               # Validation schema
│   └── types.ts                       # Shared types
├── categories/
│   ├── CategoryClientUI.tsx           # Main client component
│   └── ...
```

## Actions and API Structure

Server actions are organized by feature:

```
actions/
├── articleActions.ts               # Article-related server actions
├── categoryActions.ts              # Category-related server actions
```

## Database Schema

The database schema is defined in `src/db/schema.ts` with tables including:

- `categoriesTable`: For category hierarchy
- `articlesTable`: For content articles 
- `user`: For user authentication

## Development Guidelines

1. Always use the correct directory structure for new features
2. Keep related components together in feature-specific directories
3. Follow TypeScript best practices with proper types and interfaces 