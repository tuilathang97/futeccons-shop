'use client';

import React, { useTransition, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { sendMessage, type SendMessageData } from '@/actions/messageActions';
import { sendMessageSchema } from '@/lib/schemas/messageSchema';
import type { User, Post } from '@/db/schema';
import { Loader2 } from 'lucide-react';

interface SendMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipient: User;
  post: Post;
  sender: User;
  parentMessageId?: number; // For replies, to be implemented later
}

const defaultFormValues: Partial<SendMessageData> = {
  subject: '',
  content: '',
  senderContactInfo: '',
};

export default function SendMessageModal({
  isOpen,
  onClose,
  recipient,
  post,
  sender,
  parentMessageId,
}: SendMessageModalProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<SendMessageData>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      ...defaultFormValues,
      recipientId: recipient.id,
      postId: post.id,
      subject: parentMessageId ? `Re: Liên hệ về bài đăng "${post.tieuDeBaiViet}"` : `Liên hệ về bài đăng: "${post.tieuDeBaiViet}"`,
      senderContactInfo: sender.number || '',
      parentMessageId: parentMessageId,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        ...defaultFormValues,
        recipientId: recipient.id,
        postId: post.id,
        subject: parentMessageId
          ? `Re: Liên hệ về bài đăng "${post.tieuDeBaiViet}"`
          : `Liên hệ về bài đăng: "${post.tieuDeBaiViet}"`,
        senderContactInfo: sender.number || '',
        parentMessageId: parentMessageId,
      });
    }
  }, [isOpen, recipient, post, sender, parentMessageId, form]);

  const onSubmit = async (formData: SendMessageData) => {
    startTransition(async () => {
      try {
        const result = await sendMessage(formData);
        if (result.success) {
          toast({
            title: 'Thành công',
            description: result.message,
          });
          onClose();
        } else {
          toast({
            variant: 'destructive',
            title: 'Lỗi',
            description: result.message || 'Không thể gửi tin nhắn. Vui lòng thử lại.',
          });
        }
      } catch (submitError) {
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.',
        });
        console.error("Submit error in SendMessageModal:", submitError);
      }
    });
  };

  const handleCloseDialog = () => {
    if (isPending) return; // Prevent closing while submitting
    form.reset(); // Reset form on close
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {parentMessageId ? 'Trả lời tin nhắn' : 'Gửi tin nhắn đến '} 
            {!parentMessageId && recipient.name}
          </DialogTitle>
          <DialogDescription>
            Về bài đăng: {post.tieuDeBaiViet}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chủ đề</FormLabel>
                  <FormControl>
                    <Input placeholder="Chủ đề tin nhắn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nội dung</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={`Nội dung tin nhắn của bạn gửi đến ${recipient.name}...`}
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="senderContactInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại của bạn (không bắt buộc)</FormLabel>
                  <FormControl>
                    <Input placeholder="Số điện thoại liên hệ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog} disabled={isPending}>
                Hủy
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {parentMessageId ? 'Gửi trả lời' : 'Gửi tin nhắn'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 