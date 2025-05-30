import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import { customUnstableCache } from '@/lib/cache';
import { PaginationParams, PaginatedResult } from './paginateQuery';

export const getUserById = customUnstableCache(
  async (id: string) => {
    console.log(`Executing DB query for getUserById: ${id}`);
    const result = await db.select().from(user).where(eq(user.id, id));
    return result[0];
  },
  ['users', 'id'],
  {
    tags: ['users', 'user'],
    revalidate: 7200, // 2 hours
  }
);

export const getUserByEmail = customUnstableCache(
  async (email: string) => {
    console.log(`Executing DB query for getUserByEmail: ${email}`);
    const result = await db.select().from(user).where(eq(user.email, email));
    return result[0];
  },
  ['users', 'email'],
  {
    tags: ['users', 'user:email'],
    revalidate: 7200, // 2 hours
  }
);

export const getAllUsersAdmin = customUnstableCache(
  async (params: PaginationParams): Promise<PaginatedResult<typeof user.$inferSelect>> => {
    console.log(`Executing DB query for getAllUsersAdmin: ${JSON.stringify(params)}`);
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const offset = (page - 1) * pageSize;

    const totalItemsResult = await db.select({ count: count() }).from(user);
    const totalItems = totalItemsResult[0].count;
    const totalPages = Math.ceil(totalItems / pageSize);

    const users = await db
      .select()
      .from(user)
      .limit(pageSize)
      .offset(offset);

    return {
      data: users,
      metadata: {
        currentPage: page,
        pageSize,
        totalPages,
        totalItems,
      },
    };
  },
  ['users', 'admin', 'all'],
  {
    tags: ['users', 'users:admin:all'],
    revalidate: 1800, // 30 minutes
  }
);