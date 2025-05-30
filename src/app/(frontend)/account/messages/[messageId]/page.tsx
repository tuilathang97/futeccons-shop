import { getServerSession } from '@/lib/auth-utils';
import { getMessageById } from '@/actions/messageActions';
import { notFound, redirect } from 'next/navigation';
import MessageThreadClientUI from '@/components/messages/MessageThreadClientUI'; // Assuming this component will be created

interface MessagePageProps {
  params: {
    messageId?: string;
  };
}

export default async function MessagePage({ params }: MessagePageProps) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect('/auth/sign-in?callbackUrl=/account/messages');
  }

  const { messageId: messageIdStr } = await params;

  if (!messageIdStr) {
    notFound();
  }

  const messageId = parseInt(messageIdStr, 10);

  if (isNaN(messageId)) {
    notFound();
  }

  const messageDetails = await getMessageById(messageId, session.user.id);

  if (!messageDetails) {
    notFound(); 
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <MessageThreadClientUI messageDetails={messageDetails} currentUser={session.user} />
    </div>
  );
} 