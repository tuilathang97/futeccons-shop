import { z } from 'zod';

export const sendMessageSchema = z.object({
  recipientId: z.string().min(1, 'Người nhận là bắt buộc'),
  postId: z.number().positive('ID bài đăng là bắt buộc'),
  subject: z.string().min(1, 'Chủ đề là bắt buộc').max(255, 'Chủ đề quá dài'),
  content: z.string()
    .min(10, 'Nội dung tin nhắn phải có ít nhất 10 ký tự')
    .max(1000, 'Nội dung tin nhắn không được vượt quá 1000 ký tự'),
  senderContactInfo: z.string().optional(), // Can be empty, but if provided, should be a string
  parentMessageId: z.number().positive().optional(),
});

export type SendMessageData = z.infer<typeof sendMessageSchema>;

// Schema for replying, basically the same but parentMessageId becomes more critical (though still optional in base schema)
// For a strict reply, you might enforce parentMessageId at the action level or a derived schema.
export const replyMessageSchema = sendMessageSchema.extend({
  // No new fields, but indicates intent. 
  // parentMessageId is already in sendMessageSchema and will be used for replies.
});

export type ReplyMessageData = z.infer<typeof replyMessageSchema>; 