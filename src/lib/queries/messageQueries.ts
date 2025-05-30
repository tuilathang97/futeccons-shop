'use server';

import { db } from '@/db/drizzle';
import { messagesTable, postsTable, user } from '@/db/schema';
import { and, eq, desc, count } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { PaginationParams, PaginatedResult } from './paginateQuery';

export type { PaginationParams, PaginatedResult };

export type MessageWithDetails = typeof messagesTable.$inferSelect & {
  post?: Pick<typeof postsTable.$inferSelect, 'id' | 'tieuDeBaiViet' | 'path'>;
  sender?: Pick<typeof user.$inferSelect, 'id' | 'name' | 'image'>;
  recipient?: Pick<typeof user.$inferSelect, 'id' | 'name' | 'image'>;
  parentMessage?: typeof messagesTable.$inferSelect;
  replies?: (typeof messagesTable.$inferSelect)[];
};

export interface CreateMessageData {
  senderId: string;
  recipientId: string;
  postId: number;
  subject: string;
  content: string;
  senderContactInfo: string;
  parentMessageId?: number;
}

export async function createMessage(data: CreateMessageData): Promise<typeof messagesTable.$inferSelect> {
  const [newMessage] = await db
    .insert(messagesTable)
    .values({
      ...data,
      status: 'sent',
    })
    .returning();

  return newMessage;
}

export async function updateMessageStatus(
  messageId: number,
  senderId: string,
  status: 'replied',
  additionalData?: { repliedAt: Date }
): Promise<void> {
  await db
    .update(messagesTable)
    .set({ 
      status, 
      ...additionalData 
    })
    .where(and(eq(messagesTable.id, messageId), eq(messagesTable.recipientId, senderId)));
}

export async function markMessageAsRead(messageId: number): Promise<void> {
  await db
    .update(messagesTable)
    .set({ status: 'read', readAt: new Date() })
    .where(eq(messagesTable.id, messageId));
}

export async function getSentMessagesPaginated(
  userId: string, 
  pagination?: PaginationParams
): Promise<PaginatedResult<MessageWithDetails>> {
  const page = pagination?.page || 1;
  const pageSize = pagination?.pageSize || 10;
  const offset = (page - 1) * pageSize;

  const [messagesData, countData] = await Promise.all([
    db
      .select({
        id: messagesTable.id,
        subject: messagesTable.subject,
        content: messagesTable.content,
        senderContactInfo: messagesTable.senderContactInfo,
        senderId: messagesTable.senderId,
        recipientId: messagesTable.recipientId,
        postId: messagesTable.postId,
        parentMessageId: messagesTable.parentMessageId,
        status: messagesTable.status,
        createdAt: messagesTable.createdAt,
        updatedAt: messagesTable.updatedAt,
        readAt: messagesTable.readAt,
        repliedAt: messagesTable.repliedAt,
        // Post fields
        postTitle: postsTable.tieuDeBaiViet,
        postPath: postsTable.path,
        // Recipient fields
        recipientName: user.name,
        recipientImage: user.image,
      })
      .from(messagesTable)
      .where(eq(messagesTable.senderId, userId))
      .leftJoin(postsTable, eq(messagesTable.postId, postsTable.id))
      .leftJoin(user, eq(messagesTable.recipientId, user.id))
      .orderBy(desc(messagesTable.createdAt))
      .limit(pageSize)
      .offset(offset),

    db
      .select({ count: count() })
      .from(messagesTable)
      .where(eq(messagesTable.senderId, userId))
  ]);

  const totalItems = countData[0].count;
  const totalPages = Math.ceil(totalItems / pageSize);

  const formattedMessages: MessageWithDetails[] = messagesData.map(row => ({
    id: row.id,
    subject: row.subject,
    content: row.content,
    senderContactInfo: row.senderContactInfo,
    senderId: row.senderId,
    recipientId: row.recipientId,
    postId: row.postId,
    parentMessageId: row.parentMessageId,
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    readAt: row.readAt,
    repliedAt: row.repliedAt,
    post: row.postTitle ? {
      id: row.postId,
      tieuDeBaiViet: row.postTitle,
      path: row.postPath,
    } : undefined,
    recipient: row.recipientName ? {
      id: row.recipientId,
      name: row.recipientName,
      image: row.recipientImage,
    } : undefined,
  }));

  return {
    data: formattedMessages,
    metadata: {
      currentPage: page,
      pageSize,
      totalPages,
      totalItems,
    },
  };
}

export async function getReceivedMessagesPaginated(
  userId: string, 
  pagination?: PaginationParams
): Promise<PaginatedResult<MessageWithDetails>> {
  const page = pagination?.page || 1;
  const pageSize = pagination?.pageSize || 10;
  const offset = (page - 1) * pageSize;

  const [messagesData, countData] = await Promise.all([
    db
      .select({
        // Message fields
        id: messagesTable.id,
        subject: messagesTable.subject,
        content: messagesTable.content,
        senderContactInfo: messagesTable.senderContactInfo,
        senderId: messagesTable.senderId,
        recipientId: messagesTable.recipientId,
        postId: messagesTable.postId,
        parentMessageId: messagesTable.parentMessageId,
        status: messagesTable.status,
        createdAt: messagesTable.createdAt,
        updatedAt: messagesTable.updatedAt,
        readAt: messagesTable.readAt,
        repliedAt: messagesTable.repliedAt,
        // Post fields
        postTitle: postsTable.tieuDeBaiViet,
        postPath: postsTable.path,
        // Sender fields
        senderName: user.name,
        senderImage: user.image,
      })
      .from(messagesTable)
      .where(eq(messagesTable.recipientId, userId))
      .leftJoin(postsTable, eq(messagesTable.postId, postsTable.id))
      .leftJoin(user, eq(messagesTable.senderId, user.id))
      .orderBy(desc(messagesTable.createdAt))
      .limit(pageSize)
      .offset(offset),

    db
      .select({ count: count() })
      .from(messagesTable)
      .where(eq(messagesTable.recipientId, userId))
  ]);

  const totalItems = countData[0].count;
  const totalPages = Math.ceil(totalItems / pageSize);

  const formattedMessages: MessageWithDetails[] = messagesData.map(row => ({
    id: row.id,
    subject: row.subject,
    content: row.content,
    senderContactInfo: row.senderContactInfo,
    senderId: row.senderId,
    recipientId: row.recipientId,
    postId: row.postId,
    parentMessageId: row.parentMessageId,
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    readAt: row.readAt,
    repliedAt: row.repliedAt,
    post: row.postTitle ? {
      id: row.postId,
      tieuDeBaiViet: row.postTitle,
      path: row.postPath,
    } : undefined,
    sender: row.senderName ? {
      id: row.senderId,
      name: row.senderName,
      image: row.senderImage,
    } : undefined,
  }));

  return {
    data: formattedMessages,
    metadata: {
      currentPage: page,
      pageSize,
      totalPages,
      totalItems,
    },
  };
}

export interface MessageRowWithDetails extends MessageWithDetails {
  postTitle?: string | null;
  postPath?: string | null;
  senderName?: string | null;
  senderImage?: string | null;
  recipientName?: string | null;
  recipientImage?: string | null;
}

export async function getMessageWithReplies(messageId: number): Promise<{
  message: MessageRowWithDetails;
  replies: MessageWithDetails[];
} | null> {
  const [mainMessageResult, repliesResult] = await Promise.all([
    db
      .select({
        // Message fields
        id: messagesTable.id,
        subject: messagesTable.subject,
        content: messagesTable.content,
        senderContactInfo: messagesTable.senderContactInfo,
        senderId: messagesTable.senderId,
        recipientId: messagesTable.recipientId,
        postId: messagesTable.postId,
        parentMessageId: messagesTable.parentMessageId,
        status: messagesTable.status,
        createdAt: messagesTable.createdAt,
        updatedAt: messagesTable.updatedAt,
        readAt: messagesTable.readAt,
        repliedAt: messagesTable.repliedAt,
        // Post fields
        postTitle: postsTable.tieuDeBaiViet,
        postPath: postsTable.path,
        // Sender fields
        senderName: alias(user, 'senderUser').name,
        senderImage: alias(user, 'senderUser').image,
        // Recipient fields
        recipientName: alias(user, 'recipientUser').name,
        recipientImage: alias(user, 'recipientUser').image,
      })
      .from(messagesTable)
      .where(eq(messagesTable.id, messageId))
      .leftJoin(postsTable, eq(messagesTable.postId, postsTable.id))
      .leftJoin(alias(user, 'senderUser'), eq(messagesTable.senderId, alias(user, 'senderUser').id))
      .leftJoin(alias(user, 'recipientUser'), eq(messagesTable.recipientId, alias(user, 'recipientUser').id)),

    // Replies query - run in parallel
    db
      .select({
        id: messagesTable.id,
        subject: messagesTable.subject,
        content: messagesTable.content,
        senderContactInfo: messagesTable.senderContactInfo,
        senderId: messagesTable.senderId,
        recipientId: messagesTable.recipientId,
        postId: messagesTable.postId,
        parentMessageId: messagesTable.parentMessageId,
        status: messagesTable.status,
        createdAt: messagesTable.createdAt,
        updatedAt: messagesTable.updatedAt,
        readAt: messagesTable.readAt,
        repliedAt: messagesTable.repliedAt,
        // Reply sender fields
        senderName: alias(user, 'replySender').name,
        senderImage: alias(user, 'replySender').image,
      })
      .from(messagesTable)
      .where(eq(messagesTable.parentMessageId, messageId))
      .leftJoin(alias(user, 'replySender'), eq(messagesTable.senderId, alias(user, 'replySender').id))
      .orderBy(desc(messagesTable.createdAt))
  ]);

  if (!mainMessageResult || mainMessageResult.length === 0) {
    return null;
  }

  const messageRow = mainMessageResult[0];
  const repliesData = repliesResult.map(reply => ({
    id: reply.id,
    subject: reply.subject,
    content: reply.content,
    senderContactInfo: reply.senderContactInfo,
    senderId: reply.senderId,
    recipientId: reply.recipientId,
    postId: reply.postId,
    parentMessageId: reply.parentMessageId,
    status: reply.status,
    createdAt: reply.createdAt,
    updatedAt: reply.updatedAt,
    readAt: reply.readAt,
    repliedAt: reply.repliedAt,
    sender: reply.senderName ? {
      id: reply.senderId,
      name: reply.senderName,
      image: reply.senderImage,
    } : undefined,
  }));

  return {
    message: messageRow,
    replies: repliesData,
  };
}

export async function validateMessageAccess(messageId: number, userId: string): Promise<boolean> {
  const result = await db
    .select({
      senderId: messagesTable.senderId,
      recipientId: messagesTable.recipientId,
    })
    .from(messagesTable)
    .where(eq(messagesTable.id, messageId))
    .limit(1);

  if (!result || result.length === 0) {
    return false;
  }

  const message = result[0];
  return message.senderId === userId || message.recipientId === userId;
} 