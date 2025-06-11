import { ActionResult } from "@/actions/postActions";
import { db } from "@/db/drizzle";
import { Image, postImagesTable, postsTable, User, Post } from "@/db/schema";
import { eq, desc, asc, and, count as drizzleCount, ilike, or, type SQL } from "drizzle-orm";
import { PaginationParams, PaginatedResult } from "./paginateQuery";
import { customUnstableCache } from '@/lib/cache';
import { user as usersTable } from '@/db/schema';

// Type for posts with user information
export type PostWithUser = Post & {
  author?: Pick<User, 'id' | 'name' | 'image' | 'email'>;
};

// Type for detailed post with user and images
export type PostWithUserAndImages = Post & {
  user: User | null;
  images: Image[];
  latitude?: number | null;
  longitude?: number | null;
};

// Type for inactive posts with user info
export type InactivePostWithUser = Post & {
  user: Pick<User, 'id' | 'name' | 'email'> | null;
};

// Type for inactive posts with user and images
export type InactivePostWithUserAndImages = Post & {
  user: User | null;
  images: Image[];
};

// Type for post preview - adjust to match actual Post schema fields
export type PostPreview = Pick<Post, 'id' | 'createdAt'> & { 
  tieuDeBaiViet: string;
  author: Pick<User, 'name'> | null 
};

// --- Helper function to handle posts ordering by different columns ---
// Type-safe column map for sorting
const postSortableColumns: Record<string, unknown> = {
  title: postsTable.tieuDeBaiViet,
  createdAt: postsTable.createdAt,
  updatedAt: postsTable.updatedAt,
  publishedAt: postsTable.createdAt, // Using createdAt as fallback for publishedAt
  viewCount: postsTable.id, // Fallback, as viewCount may not exist
};

// Type-safe orderBy helper for posts
function getPostOrderBy(sortBy?: string, sortOrder?: 'asc' | 'desc'): SQL<unknown> {
  const order = sortOrder === 'asc' ? asc : desc;
  
  if (sortBy && postSortableColumns[sortBy]) {
    // We know this is a valid column from our map
    return order(postSortableColumns[sortBy] as SQL<unknown>);
  }
  return desc(postsTable.createdAt); // Default sort
}

// --- MUTATION OPERATIONS (No caching, only revalidation in actions) ---

export async function createPostImages(image: Image) {
  try{
    await db.insert(postImagesTable).values(image);
    return {
      success: true,
      message: "Ảnh đã được tạo"
    };
  }catch{
    return {
      success: false,
      message: "Tạo ảnh thất bại"
    }
  }
}

export async function createPostToDb(postData: Omit<typeof postsTable.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const [result] = await db.insert(postsTable).values(postData).returning();
    return { 
      success: true,
      postId: result.id,
      message: "Bài viết đã được tạo"
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Lỗi cơ sở dữ liệu"
    };
  }
}

export async function savePostImageToDb(imageData: typeof postImagesTable.$inferInsert): Promise<ActionResult> {
  try {
    await db.insert(postImagesTable).values(imageData);
    return {
      success: true,
      message: "Ảnh đã được lưu vào cơ sở dữ liệu"
    };
  } catch (error) {
    console.error("Lưu ảnh thất bại:", error);
    return {
      success: false,
      message: "Lưu ảnh thất bại"
    };
  }
}

export async function approvePost(postId: number): Promise<ActionResult> {
  try {
    const result = await db.update(postsTable).set({ active: true, updatedAt: new Date() }).where(eq(postsTable.id, postId)).returning();
    if (result.length === 0) {
      return {
        success: false,
        message: "Bài viết không tồn tại hoặc đã được phê duyệt"
      };
    }
    return {
      success: true,
      message: "Bài viết đã được phê duyệt"
    };
  } catch (error) {
    console.error("Phê duyệt bài viết thất bại:", error);
    return {
      success: false,
      message: "Phê duyệt bài viết thất bại"
    };
  }
}

export async function deletePost(postId: number): Promise<ActionResult> {
  try {
    const result = await db.delete(postsTable).where(eq(postsTable.id, postId)).returning();
    if (result.length === 0) {
      return {
        success: false,
        message: "Bài viết không tồn tại"
      };
    }
    return {
      success: true,
      message: "Bài viết đã được xóa"
    };
  } catch (error) {
    console.error("Xóa bài viết thất bại:", error);
    return {
      success: false,
      message: "Xóa bài viết thất bại"
    };
  }
}

// --- READ OPERATIONS (With caching) ---

// Get all posts with pagination and user information
export const getAllPostsWithUser = customUnstableCache(
  async (params: PaginationParams): Promise<PaginatedResult<PostWithUser>> => {
    console.log(`Executing DB query for getAllPostsWithUser: ${JSON.stringify(params)}`);
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const offset = (page - 1) * pageSize;

    const data = await db.select({
      id: postsTable.id,
      tieuDeBaiViet: postsTable.tieuDeBaiViet,
      path: postsTable.path,
      active: postsTable.active,
      createdAt: postsTable.createdAt,
      updatedAt: postsTable.updatedAt,
      author: {
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
      },
    })
    .from(postsTable)
    .leftJoin(usersTable, eq(postsTable.userId, usersTable.id))
    .orderBy(getPostOrderBy(params.sortBy, params.sortOrder))
    .limit(pageSize)
    .offset(offset);

    const totalItemsResult = await db
      .select({ count: drizzleCount() })
      .from(postsTable);
      
    const totalItems = totalItemsResult[0]?.count || 0;
    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      data: data as PostWithUser[],
      metadata: {
        currentPage: page,
        pageSize,
        totalPages,
        totalItems,
      },
    };
  },
  ['posts', 'all', 'with-user'],
  {
    tags: ['posts', 'posts:all', 'posts:paginated'],
    revalidate: 900, // 15 minutes
  }
);

// Get a specific post by ID with user and images
export const getPostByIdWithUserAndImages = customUnstableCache(
  async (postId: number): Promise<PostWithUserAndImages | null> => {
    console.log(`Executing DB query for getPostByIdWithUserAndImages: ${postId}`);
    if (isNaN(postId)) {
      return null;
    }

    const postData = await db.query.postsTable.findFirst({
      where: eq(postsTable.id, postId),
      with: {
        user: true,
        images: true,
      },
    });

    if (!postData) {
      return null;
    }

    return {
      ...postData,
      latitude: postData.latitude ? parseFloat(postData.latitude.toString()) : null,
      longitude: postData.longitude ? parseFloat(postData.longitude.toString()) : null,
    } as PostWithUserAndImages;
  },
  ['posts', 'id'],
  {
    tags: ['posts', `post:dynamic`],
    revalidate: 3600, // 1 hour
  }
);

// Get posts by a specific user
export const getPostsByUserId = customUnstableCache(
  async (userId: string, params: PaginationParams): Promise<PaginatedResult<PostWithUser>> => {
    console.log(`Executing DB query for getPostsByUserId: ${userId}, ${JSON.stringify(params)}`);
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const offset = (page - 1) * pageSize;

    const data = await db.select({
      id: postsTable.id,
      tieuDeBaiViet: postsTable.tieuDeBaiViet,
      path: postsTable.path,
      giaTien: postsTable.giaTien,
      thanhPho: postsTable.thanhPho,
      level1Category: postsTable.level1Category,
      quan: postsTable.quan,
      phuong: postsTable.phuong,
      thanhPhoCodeName: postsTable.thanhPhoCodeName,
      quanCodeName: postsTable.quanCodeName,
      phuongCodeName: postsTable.phuongCodeName,
      active: postsTable.active,
      createdAt: postsTable.createdAt,
      updatedAt: postsTable.updatedAt,
      author: {
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
      },
    })
    .from(postsTable)
    .leftJoin(usersTable, eq(postsTable.userId, usersTable.id))
    .where(eq(postsTable.userId, userId))
    .orderBy(getPostOrderBy(params.sortBy, params.sortOrder))
    .limit(pageSize)
    .offset(offset);

    const totalItemsResult = await db
      .select({ count: drizzleCount() })
      .from(postsTable)
      .where(eq(postsTable.userId, userId));
      
    const totalItems = totalItemsResult[0]?.count || 0;
    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      data: data as PostWithUser[],
      metadata: {
        currentPage: page,
        pageSize,
        totalPages,
        totalItems,
      },
    };
  },
  ['posts', 'user'],
  {
    tags: ['posts', 'posts:user'],
    revalidate: 900, // 15 minutes
  }
);

// Get published posts
export const getPublishedPosts = customUnstableCache(
  async (params: PaginationParams): Promise<PaginatedResult<PostWithUser>> => {
    console.log(`Executing DB query for getPublishedPosts: ${JSON.stringify(params)}`);
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const offset = (page - 1) * pageSize;
    
    const activeCondition = eq(postsTable.active, true);
    
    const data = await db.select({
      id: postsTable.id,
      tieuDeBaiViet: postsTable.tieuDeBaiViet,
      path: postsTable.path,
      active: postsTable.active,
      createdAt: postsTable.createdAt,
      updatedAt: postsTable.updatedAt,
      giaTien: postsTable.giaTien,
      dienTichDat: postsTable.dienTichDat,
      soPhongNgu: postsTable.soPhongNgu,
      soPhongVeSinh: postsTable.soPhongVeSinh,
      thanhPho: postsTable.thanhPho,
      quan: postsTable.quan,
      phuong: postsTable.phuong,
      duong: postsTable.duong,
      author: {
        id: usersTable.id,
        name: usersTable.name,
      },
    })
    .from(postsTable)
    .leftJoin(usersTable, eq(postsTable.userId, usersTable.id))
    .where(activeCondition)
    .orderBy(getPostOrderBy(params.sortBy, params.sortOrder))
    .limit(pageSize)
    .offset(offset);

    const totalItemsResult = await db
      .select({ count: drizzleCount() })
      .from(postsTable)
      .where(activeCondition);
      
    const totalItems = totalItemsResult[0]?.count || 0;
    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      data: data as PostWithUser[],
      metadata: {
        currentPage: page,
        pageSize,
        totalPages,
        totalItems,
      },
    };
  },
  ['posts', 'published'],
  {
    tags: ['posts', 'posts:published'],
    revalidate: 600, // 10 minutes
  }
);

// Get latest posts
export const getLatestPosts = customUnstableCache(
  async (limit: number = 5): Promise<PostWithUser[]> => {
    console.log(`Executing DB query for getLatestPosts: limit=${limit}`);
    const data = await db.select({
      id: postsTable.id,
      tieuDeBaiViet: postsTable.tieuDeBaiViet,
      path: postsTable.path,
      active: postsTable.active,
      createdAt: postsTable.createdAt,
      updatedAt: postsTable.updatedAt,
      giaTien: postsTable.giaTien,
      dienTichDat: postsTable.dienTichDat,
      author: {
        id: usersTable.id,
        name: usersTable.name,
      },
    })
    .from(postsTable)
    .leftJoin(usersTable, eq(postsTable.userId, usersTable.id))
    .where(eq(postsTable.active, true))
    .orderBy(desc(postsTable.createdAt))
    .limit(limit);

    return data as PostWithUser[];
  },
  ['posts', 'latest'],
  {
    tags: ['posts', 'posts:latest'],
    revalidate: 300, // 5 minutes
  }
);

// Get posts for admin
export const getAdminPosts = customUnstableCache(
  async (params: PaginationParams): Promise<PaginatedResult<PostWithUser>> => {
    console.log(`Executing DB query for getAdminPosts: ${JSON.stringify(params)}`);
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const offset = (page - 1) * pageSize;

    const data = await db.select({
      id: postsTable.id,
      tieuDeBaiViet: postsTable.tieuDeBaiViet,
      path: postsTable.path,
      active: postsTable.active,
      createdAt: postsTable.createdAt,
      updatedAt: postsTable.updatedAt,
      author: {
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
      },
    })
    .from(postsTable)
    .leftJoin(usersTable, eq(postsTable.userId, usersTable.id))
    .orderBy(getPostOrderBy(params.sortBy, params.sortOrder))
    .limit(pageSize)
    .offset(offset);

    const totalItemsResult = await db
      .select({ count: drizzleCount() })
      .from(postsTable);
      
    const totalItems = totalItemsResult[0]?.count || 0;
    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      data: data as PostWithUser[],
      metadata: {
        currentPage: page,
        pageSize,
        totalPages,
        totalItems,
      },
    };
  },
  ['posts', 'admin'],
  {
    tags: ['posts', 'posts:admin'],
    revalidate: 300, // 5 minutes
  }
);

// Get inactive posts (awaiting approval)
export const getInactivePosts = customUnstableCache(
  async (params: PaginationParams): Promise<PaginatedResult<InactivePostWithUserAndImages>> => {
    console.log(`Executing DB query for getInactivePosts: ${JSON.stringify(params)}`);
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const offset = (page - 1) * pageSize;

    const whereClause = eq(postsTable.active, false);

    const countResult = await db
      .select({ count: drizzleCount() })
      .from(postsTable)
      .where(whereClause);
    
    const totalItems = countResult[0]?.count || 0;
    const totalPages = Math.ceil(totalItems / pageSize);

    if (totalItems === 0) {
      return {
        data: [],
        metadata: {
          currentPage: page,
          pageSize,
          totalPages: 0,
          totalItems: 0,
        },
      };
    }
    
    const resultData = await db.query.postsTable.findMany({
      where: whereClause,
      with: {
        user: true,
        images: true
      },
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
      limit: pageSize,
      offset: offset,
    });

    return {
      data: resultData as InactivePostWithUserAndImages[],
      metadata: {
        currentPage: page,
        pageSize,
        totalPages,
        totalItems,
      },
    };
  },
  ['posts', 'inactive'],
  {
    tags: ['posts', 'posts:inactive'],
    revalidate: 300, // 5 minutes
  }
);

// Count posts by a specific user
export const countUserPosts = customUnstableCache(
  async (userId: string): Promise<number> => {
    console.log(`Executing DB query for countUserPosts: ${userId}`);
    const result = await db
      .select({ count: drizzleCount() })
      .from(postsTable)
      .where(eq(postsTable.userId, userId));
    return result[0]?.count || 0;
  },
  ['posts', 'count', 'user'],
  {
    tags: ['posts', 'posts:count'],
    revalidate: 3600, // 1 hour
  }
);

export const getPendingApprovalCount = customUnstableCache(
  async (): Promise<number> => {
    console.log(`Executing DB query for getPendingApprovalCount`);
    const result = await db
      .select({ count: drizzleCount() })
      .from(postsTable)
      .where(eq(postsTable.active, false));
    return result[0]?.count || 0;
  },
  ['posts', 'count', 'pending'],
  {
    tags: ['posts', 'posts:count'],
    revalidate: 60, 
  }
);

export const getRecentPendingPosts = customUnstableCache(
  async (limit: number = 5): Promise<InactivePostWithUser[]> => {
    console.log(`Executing DB query for getRecentPendingPosts: limit=${limit}`);
    const data = await db
      .select({
        id: postsTable.id,
        userId: postsTable.userId,
        active: postsTable.active,
        level1Category: postsTable.level1Category,
        level2Category: postsTable.level2Category,
        level3Category: postsTable.level3Category,
        path: postsTable.path,
        thanhPho: postsTable.thanhPho,
        thanhPhoCodeName: postsTable.thanhPhoCodeName,
        quan: postsTable.quan,
        tieuDeBaiViet: postsTable.tieuDeBaiViet,
        quanCodeName: postsTable.quanCodeName,
        phuong: postsTable.phuong,
        phuongCodeName: postsTable.phuongCodeName,
        duong: postsTable.duong,
        latitude: postsTable.latitude,
        longitude: postsTable.longitude,
        giaTien: postsTable.giaTien,
        dienTichDat: postsTable.dienTichDat,
        soTang: postsTable.soTang,
        soPhongNgu: postsTable.soPhongNgu,
        soPhongVeSinh: postsTable.soPhongVeSinh,
        giayToPhapLy: postsTable.giayToPhapLy,
        loaiHinhNhaO: postsTable.loaiHinhNhaO,
        noiDung: postsTable.noiDung,
        createdAt: postsTable.createdAt,
        updatedAt: postsTable.updatedAt,
        user: {
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
        },
      })
      .from(postsTable)
      .where(eq(postsTable.active, false))
      .leftJoin(usersTable, eq(postsTable.userId, usersTable.id))
      .orderBy(desc(postsTable.createdAt))
      .limit(limit);

    return data as InactivePostWithUser[];
  },
  ['posts', 'recent', 'pending'],
  {
    tags: ['posts', 'posts:recent'],
    revalidate: 60, // 1 minute for real-time updates
  }
);

// Get posts for sitemap
export const getPostsForSitemap = customUnstableCache(
  async (): Promise<{ path: string; updatedAt: Date | null }[]> => {
    console.log(`Executing DB query for getPostsForSitemap`);
    const posts = await db
      .select({
        path: postsTable.path,
        updatedAt: postsTable.updatedAt,
      })
      .from(postsTable)
      .where(eq(postsTable.active, true))
      .orderBy(desc(postsTable.updatedAt));
    
    // Ensure non-null paths with type assertion
    return posts.map(p => ({
      path: p.path as string,
      updatedAt: p.updatedAt,
    }));
  },
  ['posts', 'sitemap'],
  {
    tags: ['posts', 'posts:sitemap'],
    revalidate: 86400, // 24 hours
  }
);

// Get post images by post ID
export const getImagesByPostId = customUnstableCache(
  async (postId: number): Promise<Image[]> => {
    console.log(`Executing DB query for getImagesByPostId: ${postId}`);
    const images = await db
      .select()
      .from(postImagesTable)
      .where(eq(postImagesTable.postId, postId))
      .orderBy(desc(postImagesTable.createdAt));
    
    return images;
  },
  ['postImages', 'post'],
  {
    tags: ['postImages', 'postImages:post'],
    revalidate: 3600, // 1 hour
  }
);

// Search posts
export const searchPosts = customUnstableCache(
  async (
    searchTerm: string,
    params: PaginationParams
  ): Promise<PaginatedResult<PostWithUser>> => {
    console.log(`Executing DB query for searchPosts: ${searchTerm}, ${JSON.stringify(params)}`);
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const offset = (page - 1) * pageSize;
    
    // Search in title and content
    const searchCondition = or(
      ilike(postsTable.tieuDeBaiViet, `%${searchTerm}%`),
      ilike(postsTable.noiDung, `%${searchTerm}%`)
    );
    
    // Only search active/published posts
    const fullCondition = and(
      eq(postsTable.active, true),
      searchCondition
    );
    
    const data = await db.select({
      id: postsTable.id,
      tieuDeBaiViet: postsTable.tieuDeBaiViet,
      path: postsTable.path,
      active: postsTable.active,
      createdAt: postsTable.createdAt,
      updatedAt: postsTable.updatedAt,
      author: {
        id: usersTable.id,
        name: usersTable.name,
      },
    })
    .from(postsTable)
    .leftJoin(usersTable, eq(postsTable.userId, usersTable.id))
    .where(fullCondition)
    .orderBy(desc(postsTable.createdAt))
    .limit(pageSize)
    .offset(offset);
    
    const totalItemsResult = await db
      .select({ count: drizzleCount() })
      .from(postsTable)
      .where(fullCondition);
      
    const totalItems = totalItemsResult[0]?.count || 0;
    const totalPages = Math.ceil(totalItems / pageSize);
    
    return {
      data: data as PostWithUser[],
      metadata: {
        currentPage: page,
        pageSize,
        totalPages,
        totalItems,
      },
    };
  },
  ['posts', 'search'],
  {
    tags: ['posts', 'posts:search'],
    revalidate: 600, // 10 minutes
  }
);

// Get posts by category
export const getPostsByCategory = customUnstableCache(
  async (
    categoryId: number,
    params: PaginationParams
  ): Promise<PaginatedResult<PostWithUser>> => {
    console.log(`Executing DB query for getPostsByCategory: ${categoryId}, ${JSON.stringify(params)}`);
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const offset = (page - 1) * pageSize;
    
    // Posts in the specified category that are active
    const categoryCondition = and(
      eq(postsTable.level1Category, categoryId),
      eq(postsTable.active, true)
    );
    
    const data = await db.select({
      id: postsTable.id,
      tieuDeBaiViet: postsTable.tieuDeBaiViet,
      path: postsTable.path,
      active: postsTable.active,
      createdAt: postsTable.createdAt,
      updatedAt: postsTable.updatedAt,
      giaTien: postsTable.giaTien,
      dienTichDat: postsTable.dienTichDat,
      author: {
        id: usersTable.id,
        name: usersTable.name,
      },
    })
    .from(postsTable)
    .leftJoin(usersTable, eq(postsTable.userId, usersTable.id))
    .where(categoryCondition)
    .orderBy(desc(postsTable.createdAt))
    .limit(pageSize)
    .offset(offset);
    
    const totalItemsResult = await db
      .select({ count: drizzleCount() })
      .from(postsTable)
      .where(categoryCondition);
      
    const totalItems = totalItemsResult[0]?.count || 0;
    const totalPages = Math.ceil(totalItems / pageSize);
    
    return {
      data: data as PostWithUser[],
      metadata: {
        currentPage: page,
        pageSize,
        totalPages,
        totalItems,
      },
    };
  },
  ['posts', 'category'],
  {
    tags: ['posts', 'posts:category'],
    revalidate: 900, // 15 minutes
  }
);

export async function incrementPostViewCount(postId: number): Promise<void> {
  await db
    .update(postsTable)
    .set({ 
      // Assuming viewCount exists or will be added to the schema
      // If not, this would need modification
      // viewCount: sql`${postsTable.viewCount} + 1` 
    })
    .where(eq(postsTable.id, postId));
}

// Backward compatibility for existing code
export async function getPosts(
  params?: PaginationParams,
  level1CategoryId?: number
): Promise<PaginatedResult<Post>> {
  if (level1CategoryId) {
    const result = await getPostsByCategory(level1CategoryId, params || {});
    return {
      data: result.data as Post[],
      metadata: result.metadata
    };
  } else {
    const result = await getPublishedPosts(params || {});
    return {
      data: result.data as Post[],
      metadata: result.metadata
    };
  }
}

export async function getPostById(id: number) {
  return getPostByIdWithUserAndImages(id);
}

export async function getPostDetailsById(postId: number): Promise<PostWithUserAndImages | null> {
  return getPostByIdWithUserAndImages(postId);
}

export async function getPostBelongToUser(userId: string) {
  const result = await getPostsByUserId(userId, { page: 1, pageSize: 1000 });
  return result.data;
}

export const getHomepageData = customUnstableCache(
  async (
    params: PaginationParams,
    categoryIds: { banNhaId?: number; choThueId?: number; duAnId?: number }
  ): Promise<{
    featuredPosts: PostWithUser[];
    banNhaPosts: PostWithUser[];
    choThuePosts: PostWithUser[];
    duAnPosts: PostWithUser[];
    metadata: {
      currentPage: number;
      pageSize: number;
      totalPages: number;
      totalItems: number;
    };
  }> => {
    console.log(`Executing DB query for getHomepageData: ${JSON.stringify(params)}, ${JSON.stringify(categoryIds)}`);
    const pageSize = params.pageSize || 10;
    const activeCondition = eq(postsTable.active, true);
    const baseSelectFields = {
      id: postsTable.id,
      tieuDeBaiViet: postsTable.tieuDeBaiViet,
      path: postsTable.path,
      active: postsTable.active,
      createdAt: postsTable.createdAt,
      thanhPhoCodeName: postsTable.thanhPhoCodeName,
      quanCodeName: postsTable.quanCodeName,
      phuongCodeName: postsTable.phuongCodeName,
      updatedAt: postsTable.updatedAt,
      giaTien: postsTable.giaTien,
      dienTichDat: postsTable.dienTichDat,
      noiDung: postsTable.noiDung,
      soPhongNgu: postsTable.soPhongNgu,
      soPhongVeSinh: postsTable.soPhongVeSinh,
      thanhPho: postsTable.thanhPho,
      quan: postsTable.quan,
      phuong: postsTable.phuong,
      duong: postsTable.duong,
      level1Category: postsTable.level1Category,
      author: {
        id: usersTable.id,
        name: usersTable.name,
      },
    };
    const [
      featuredPosts,
      banNhaPosts,
      choThuePosts,
      duAnPosts,
      totalItemsResult
    ] = await Promise.all([
      db.select(baseSelectFields)
        .from(postsTable)
        .leftJoin(usersTable, eq(postsTable.userId, usersTable.id))
        .orderBy(desc(postsTable.createdAt))
        .limit(8),

      categoryIds.banNhaId ? 
        db.select(baseSelectFields)
          .from(postsTable)
          .leftJoin(usersTable, eq(postsTable.userId, usersTable.id))
          .where(and(activeCondition,eq(postsTable.level1Category, categoryIds.banNhaId)))
          .orderBy(desc(postsTable.createdAt))
          .limit(pageSize)
        : Promise.resolve([]),

      categoryIds.choThueId ?
        db.select(baseSelectFields)
          .from(postsTable)
          .leftJoin(usersTable, eq(postsTable.userId, usersTable.id))
          .where(and(activeCondition, eq(postsTable.level1Category, categoryIds.choThueId)))
          .orderBy(desc(postsTable.createdAt))
          .limit(pageSize)
        : Promise.resolve([]),

      categoryIds.duAnId ?
        db.select(baseSelectFields)
          .from(postsTable)
          .leftJoin(usersTable, eq(postsTable.userId, usersTable.id))
          .where(and(activeCondition, eq(postsTable.level1Category, categoryIds.duAnId)))
          .orderBy(desc(postsTable.createdAt))
          .limit(pageSize)
        : Promise.resolve([]),

      db.select({ count: drizzleCount() })
        .from(postsTable)
        .where(activeCondition)
    ]);
    const totalItems = totalItemsResult[0]?.count || 0;
    const totalPages = Math.ceil(totalItems / pageSize);
    return {
      featuredPosts: featuredPosts as PostWithUser[],
      banNhaPosts: banNhaPosts as PostWithUser[],
      choThuePosts: choThuePosts as PostWithUser[],
      duAnPosts: duAnPosts as PostWithUser[],
      metadata: {
        currentPage: params.page || 1,
        pageSize,
        totalPages,
        totalItems,
      },
    };
  },
  ['posts', 'homepage'],
  {
    tags: ['posts', 'posts:homepage'],
    revalidate: 600, // 10 minutes
  }
);

export const getPostImagesByIds = customUnstableCache(
  async (postIds: number[]): Promise<Image[]> => {
    console.log(`Executing DB query for getPostImagesByIds: ${postIds.length} posts`);
    
    if (postIds.length === 0) return [];
    
    const images = await db
      .select()
      .from(postImagesTable)
      .where(
        or(...postIds.map(id => eq(postImagesTable.postId, id)))
      )
      .orderBy(desc(postImagesTable.createdAt));
    
    return images;
  },
  ['postImages', 'bulk'],
  {
    tags: ['postImages', 'postImages:bulk'],
    revalidate: 3600, // 1 hour
  }
);

export const getPostThumbnailByPostId = async (postId: number) => {
  try{
    const images = await db
      .select()
      .from(postImagesTable)
      .where(eq(postImagesTable.postId, postId))
      .limit(1)
    return {
      success: true,
      image: images[0]
    };
  }catch(error){
    console.error(error)
    return {
      success: false,
      image: null
    };
  }
}