import { MetadataRoute } from 'next'
import { getCategories } from '@/lib/queries/categoryQueries'
import { db } from '@/db/drizzle'
import { postsTable, articlesTable } from '@/db/schema'
import { eq } from 'drizzle-orm'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://fuland.com'
  
  // Static pages với priority cao
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/gioi-thieu`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/lien-he`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }
  ]

  // Dynamic category pages
  const categories = await getCategories()
  const categoryPages = categories
    .filter(cat => cat.path && cat.path !== '/tim-kiem-theo-tu-khoa')
    .map(category => ({
      url: `${baseUrl}${category.path}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: category.level === 1 ? 0.9 : category.level === 2 ? 0.8 : 0.7,
    }))

  // Active posts với high priority
  const activePosts = await db
    .select({ id: postsTable.id, updatedAt: postsTable.updatedAt })
    .from(postsTable)
    .where(eq(postsTable.active, true))
    .limit(10000) // Limit để tránh sitemap quá lớn

  const postPages = activePosts.map(post => ({
    url: `${baseUrl}/post/${post.id}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Published articles
  const publishedArticles = await db
    .select({ slug: articlesTable.slug, updatedAt: articlesTable.updatedAt })
    .from(articlesTable)
    .where(eq(articlesTable.status, 'published'))

  const articlePages = publishedArticles.map(article => ({
    url: `${baseUrl}${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...categoryPages, ...postPages, ...articlePages]
} 