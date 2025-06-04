import { getServerSession } from "@/lib/auth-utils";
import { redirect } from 'next/navigation';
import { getPostBelongToUser } from "@/lib/queries/postQueries";
import { getPostImages } from "@/lib/queries/postImagesQueries";
import AccountPageClient from "./AccountPageClient";
import type { User } from "@/db/schema";
import { getCategories } from "@/lib/queries/categoryQueries";

interface AccountPageProps {
  searchParams?: {
    reason?: string;
    callbackUrl?: string;
  };
}

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const userSession = await getServerSession();
  const categories = await getCategories();
  const conditionsParams = await searchParams;
  if (!userSession?.user) {
    redirect("/auth/sign-in?callbackUrl=/account");
  }

  const user = userSession.user as User;

  if (!user) {
    return <div>User not found after session check.</div>; 
  }

  const [userPosts, postImages] = await Promise.all([
    getPostBelongToUser(user.id),
    getPostImages(),
  ]);
  const showPhoneNumberBanner = conditionsParams?.reason === 'phone_required';
  const callbackUrl = conditionsParams?.callbackUrl;

  return (
    <AccountPageClient
      user={user} 
      userPosts={userPosts}
      postImages={postImages}
      categories={categories}
      showPhoneNumberBanner={showPhoneNumberBanner}
      callbackUrl={callbackUrl}
    />
  );
} 