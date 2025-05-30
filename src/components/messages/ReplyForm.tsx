'use client';

import React, { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { sendMessage, MessageWithDetails, ActionResult } from '@/actions/messageActions';
import { UserSession } from '@/lib/auth-utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { SendHorizontal, Loader2, MessageSquare } from 'lucide-react';

const replySchema = z.object({
  content: z.string()
    .min(5, 'Nội dung trả lời phải có ít nhất 5 ký tự')
    .max(1000, 'Nội dung trả lời không được vượt quá 1000 ký tự'),
});

type ReplyFormData = z.infer<typeof replySchema>;

interface ReplyFormProps {
  parentMessage: MessageWithDetails;
  currentUser: UserSession['user'];
}

export default function ReplyForm({ parentMessage, currentUser }: ReplyFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<ReplyFormData>({
    resolver: zodResolver(replySchema),
    defaultValues: {
      content: '',
    },
  });

  const onSubmit = async (data: ReplyFormData) => {
    if (!parentMessage.sender?.id) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể xác định người nhận cho tin nhắn trả lời.',
      });
      return;
    }

    startTransition(async () => {
      const result: ActionResult = await sendMessage({
        recipientId: parentMessage.sender!.id,
        postId: parentMessage.postId!,
        subject: `Re: ${parentMessage.subject || 'Tin nhắn'}`.substring(0, 255),
        content: data.content,
        parentMessageId: parentMessage.id,
        senderContactInfo: currentUser?.number || undefined,
      });

      if (result.success) {
        toast({
          title: 'Thành công',
          description: 'Tin nhắn trả lời đã được gửi.',
        });
        form.reset();
        router.refresh();
      } else {
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: result.message || 'Không thể gửi tin nhắn trả lời. Vui lòng thử lại.',
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-6 border-t mt-6">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center text-base font-semibold mb-2">
                <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                Nội dung trả lời của bạn
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Nhập nội dung trả lời..."
                  rows={5}
                  {...field}
                  className="text-base"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isPending} className="min-w-[150px] transition-all duration-150 ease-in-out">
            {isPending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang gửi...</>
            ) : (
              <><SendHorizontal className="mr-2 h-4 w-4" /> Gửi trả lời</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
} 