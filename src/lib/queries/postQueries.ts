import { ActionResult } from "@/actions/postActions";
import { db } from "@/db/drizzle";
import { Image, postImagesTable, postsTable, user, User, Post } from "@/db/schema";
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

  let dataQueryBase = db
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

export async function getInactivePosts(
  params: PaginationParams
): Promise<PaginatedResult<InactivePostWithUser>> {
  const page = params.page ? Number(params.page) : 1;
  const pageSize = params.pageSize ? Number(params.pageSize) : 2;
  const sortBy = params.sortBy || 'createdAt';
  const sortOrder = params.sortOrder || 'desc';
  const offset = (page - 1) * pageSize;

  const whereClause = eq(postsTable.active, false);

  let dataQueryBase = db
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
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
    .from(postsTable)
    .leftJoin(user, eq(postsTable.userId, user.id))
    .where(whereClause);

  const sortTable = postsTable as any; 
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
    data: resultData as InactivePostWithUser[],
    metadata: {
      currentPage: page,
      pageSize,
      totalPages,
      totalItems,
    },
  };
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