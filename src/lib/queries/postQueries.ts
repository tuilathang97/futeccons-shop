import { ActionResult } from "@/actions/postActions";
import { db } from "@/db/drizzle";
import { Image, postImagesTable, postsTable, User, Post } from "@/db/schema";
import { eq, desc, asc, sql } from "drizzle-orm";
import { PaginationParams, PaginatedResult } from "./paginateQuery";

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

export async function getPosts(
  params?: PaginationParams
): Promise<PaginatedResult<Post>> {
  const page = params?.page ? Number(params.page) : 1;
  const pageSize = params?.pageSize ? Number(params.pageSize) : 10;
  const sortBy = params?.sortBy || 'createdAt';
  const sortOrder = params?.sortOrder || 'desc';
  const offset = (page - 1) * pageSize;

  const whereClause = eq(postsTable.active, true);

  const dataQueryBase = db
    .select()
    .from(postsTable)
    .where(whereClause);

  const sortTable = postsTable as typeof postsTable & { [key: string]: any }; 
  const sortColumn = sortTable[sortBy];
  
  let orderedQuery;
  if (sortColumn) {
    orderedQuery = dataQueryBase.orderBy(sortOrder === 'desc' ? desc(sortColumn) : asc(sortColumn));
  } else {
    orderedQuery = dataQueryBase.orderBy(desc(postsTable.createdAt));
  }

  const countResult = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(postsTable)
    .where(whereClause);
  
  const totalItems = countResult[0].count;
  const totalPages = Math.ceil(totalItems / pageSize);

  const resultData = await orderedQuery.limit(pageSize).offset(offset);

  return {
    data: resultData as Post[],
    metadata: {
      currentPage: page,
      pageSize,
      totalPages,
      totalItems,
    },
  };
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

export async function getPostById(id: number) {
  const result = await db.select().from(postsTable).where(eq(postsTable.id, id));
  return result[0];
}

export async function getPostBelongToUser(userId: string) {
  const result = await db.select().from(postsTable).where(eq(postsTable.userId, userId));
  return result;
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

export type InactivePostWithUser = Post & {
  user: Pick<User, 'id' | 'name' | 'email'> | null;
};

export type InactivePostWithUserAndImages = Post & {
  user: Pick<User, 'id' | 'name' | 'email'> | null;
  images: Image[];
};

export type PostWithUserAndImages = Post & {
  user: Pick<User, 'id' | 'name' | 'email'> | null;
  images: Image[];
};

export async function getInactivePosts(
  params: PaginationParams
): Promise<PaginatedResult<InactivePostWithUserAndImages>> {
  const page = params.page ? Number(params.page) : 1;
  const pageSize = params.pageSize ? Number(params.pageSize) : 10;
  const sortBy = params.sortBy || 'createdAt';
  const sortOrder = params.sortOrder || 'desc';
  const offset = (page - 1) * pageSize;

  const whereClause = eq(postsTable.active, false);

  const countResult = await db
    .select({ count: sql<number>`count(*)::int` })
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
      user: {
        columns: {
          id: true,
          name: true,
          email: true,
        }
      },
      images: true
    },
    orderBy: (posts, { asc, desc }) => {
      const sortKey = sortBy as keyof typeof posts;
      if (posts[sortKey]) {
        return sortOrder === 'desc' ? [desc(posts[sortKey])] : [asc(posts[sortKey])];
      }
      return [desc(posts.createdAt)];
    },
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
}

export async function getPostDetailsById(postId: number): Promise<PostWithUserAndImages | null> {
  if (isNaN(postId)) {
    return null;
  }

  const postData = await db.query.postsTable.findFirst({
    where: eq(postsTable.id, postId),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          email: true,
        },
      },
      images: true,
    },
  });

  if (!postData) {
    return null;
  }

  return postData as PostWithUserAndImages;
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