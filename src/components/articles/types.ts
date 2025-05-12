export interface CategoryWithArticleStatus {
  id: number;
  name: string;
  parentId: number | null;
  level: 1 | 2 | 3;
  note: string | null;
  path: string | null;
  slug: string | null;
  hasArticle: boolean;
  articleStatus: string | null;
  lastUpdated: Date | null;
  articleId: number | null;
} 