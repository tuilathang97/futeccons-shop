'use server';

import { z } from 'zod';
import { db } from '@/db/drizzle';
import { postsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from '@/lib/auth-utils'; // Assuming this utility exists for session
import { revalidatePath } from 'next/cache';
import { createMessage, getMessageWithReplies, getReceivedMessagesPaginated, getSentMessagesPaginated, markMessageAsRead, MessageWithDetails, PaginatedResult, PaginationParams, updateMessageStatus, validateMessageAccess } from '@/lib/queries/messageQueries';
import { revalidateMessageNotifications } from './notificationActions';

export interface ActionResult {
  success: boolean;
  message: string;
  data?: unknown;
}


const sendMessageSchema = z.object({
  recipientId: z.string().min(1, 'Người nhận là bắt buộc'),
  postId: z.number().positive('ID bài đăng là bắt buộc'),
  subject: z.string().min(1, 'Chủ đề là bắt buộc').max(255, 'Chủ đề quá dài'),
  content: z.string()
    .min(10, 'Nội dung tin nhắn phải có ít nhất 10 ký tự')
    .max(1000, 'Nội dung tin nhắn không được vượt quá 1000 ký tự'),
  senderContactInfo: z.string().optional(),
  parentMessageId: z.number().positive().optional(),
});

export type SendMessageData = z.infer<typeof sendMessageSchema>;

export async function sendMessage(data: SendMessageData): Promise<ActionResult> {
  const session = await getServerSession();

  if (!session?.user) {
    return { success: false, message: 'Vui lòng đăng nhập để gửi tin nhắn.' };
  }

  const validatedData = sendMessageSchema.safeParse(data);

  if (!validatedData.success) {
    return {
      success: false,
      message: validatedData.error.errors.map((e) => e.message).join(', '),
    };
  }

  const {
    recipientId,
    postId,
    subject,
    content,
    senderContactInfo,
    parentMessageId,
  } = validatedData.data;

  const senderId = session.user?.id;

  if (senderId === recipientId) {
    return { success: false, message: 'Bạn không thể gửi tin nhắn cho chính mình.' };
  }

  try {
    const postExists = await db.query.postsTable.findFirst({
      where: eq(postsTable.id, postId),
    });

    if (!postExists) {
      return { success: false, message: 'Bài đăng được tham chiếu không tồn tại.' };
    }

    if (!parentMessageId) {
      if (postExists.userId !== recipientId) {
        return { success: false, message: 'Người nhận được chỉ định không phải là chủ sở hữu của bài đăng này.' };
      }
    } 
    
    const newMessage = await createMessage({
      senderId,
      recipientId,
      postId,
      subject,
      content,
      senderContactInfo: senderContactInfo || session.user.number || '',
      parentMessageId,
    });

    if (!newMessage) {
      return { success: false, message: 'Không thể gửi tin nhắn. Vui lòng thử lại.' };
    }

    if (parentMessageId) {
      await updateMessageStatus(
        parentMessageId,
        senderId,
        'replied',
        { repliedAt: new Date() }
      );
    }

    revalidatePath('/account/messages');
    revalidatePath(`/bai-viet/${postId}`);
    if (parentMessageId) {
        revalidatePath(`/account/messages/received`);
        revalidatePath(`/account/messages/sent`);
    }

    await revalidateMessageNotifications();

    return { success: true, message: 'Tin nhắn đã được gửi thành công.', data: newMessage };
  } catch (error) {
    console.error("Error sending message:", error);
    return { success: false, message: 'Đã xảy ra lỗi khi gửi tin nhắn. Vui lòng thử lại sau.' };
  }
}

export async function getSentMessages(userId: string, pagination?: PaginationParams): Promise<PaginatedResult<MessageWithDetails>> {
  try {
    return await getSentMessagesPaginated(userId, pagination);
  } catch (error) {
    console.error("Error fetching sent messages:", error);
    return {
      data: [],
      metadata: { currentPage: 1, pageSize: 10, totalPages: 0, totalItems: 0 },
    };
  }
}

export async function getReceivedMessages(userId: string, pagination?: PaginationParams): Promise<PaginatedResult<MessageWithDetails>> {
  try {
    return await getReceivedMessagesPaginated(userId, pagination);
  } catch (error) {
    console.error("Error fetching received messages:", error);
    return {
      data: [],
      metadata: { currentPage: 1, pageSize: 10, totalPages: 0, totalItems: 0 },
    };
  }
}

export async function getMessageById(messageId: number, userId: string): Promise<MessageWithDetails | null> {
  try {
    const hasAccess = await validateMessageAccess(messageId, userId);
    if (!hasAccess) {
      console.warn(`User ${userId} does not have permission to view message ${messageId}`);
      return null;
    }

    const messageWithReplies = await getMessageWithReplies(messageId);
    if (!messageWithReplies) {
      return null;
    }

    const { message: messageRow, replies: repliesData } = messageWithReplies;

    if (messageRow.recipientId === userId && messageRow.status !== 'read') {
      markMessageAsRead(messageId).catch(error => 
        console.error('Error updating message read status:', error)
      );
    }

    const path = messageRow.postPath === null ? undefined : messageRow.postPath;
    const senderImage = messageRow.senderImage === null ? undefined : messageRow.senderImage;
    const recipientImage = messageRow.recipientImage === null ? undefined : messageRow.recipientImage;

    const result: MessageWithDetails = {
      id: messageRow.id,
      subject: messageRow.subject,
      content: messageRow.content,
      senderContactInfo: messageRow.senderContactInfo,
      senderId: messageRow.senderId,
      recipientId: messageRow.recipientId,
      postId: messageRow.postId,
      parentMessageId: messageRow.parentMessageId,
      status: messageRow.recipientId === userId && messageRow.status !== 'read' ? 'read' : messageRow.status,
      createdAt: messageRow.createdAt,
      updatedAt: messageRow.updatedAt,
      readAt: messageRow.recipientId === userId && messageRow.status !== 'read' ? new Date() : messageRow.readAt,
      repliedAt: messageRow.repliedAt,
      post: messageRow.postTitle ? {
        id: messageRow.postId,
        tieuDeBaiViet: messageRow.postTitle,
        path: path as string | null,
      } : undefined,
      sender: messageRow.senderName ? {
        id: messageRow.senderId,
        name: messageRow.senderName,
        image: senderImage as string | null,
      } : undefined,
      recipient: messageRow.recipientName ? {
        id: messageRow.recipientId,
        name: messageRow.recipientName,
        image: recipientImage as string | null,
      } : undefined,
      replies: repliesData.length > 0 ? repliesData : undefined,
    };

    return result;

  } catch (error) {
    console.error(`Error fetching message by ID ${messageId}:`, error);
    return null;
  }
}

export type { MessageWithDetails, PaginatedResult };

export type { PaginationParams };
