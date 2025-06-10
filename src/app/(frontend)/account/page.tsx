import { getServerSession } from "@/lib/auth-utils";
import { redirect } from 'next/navigation';
import { getPostBelongToUser } from "@/lib/queries/postQueries";
// import { getPostImages } from "@/lib/queries/postImagesQueries"; // No longer needed here
import AccountPageClient from "./AccountPageClient";
import type { User, Post as PostType } from "@/db/schema"; // Renamed Post to PostType to avoid conflict
import { getCategories } from "@/lib/queries/categoryQueries";
import ProductCard from "@/components/products/ProductCard"; // Import ProductCard
import React from "react"; // Import React for JSX

interface AccountPageProps {
  searchParams?: Promise<{
    reason?: string;
    callbackUrl?: string;
  }>;
}

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const userSession = await getServerSession();
  const categories = await getCategories();
  const conditionsParams = await searchParams;
  if (!userSession?.user || !userSession.user.id) {
    redirect("/auth/sign-in?callbackUrl=/account");
  }

  const user = userSession.user as User;
  // Fetch all user posts
  const allUserPosts: PostType[] = await getPostBelongToUser(user.id);
  // Filter posts
  const approvedPosts = allUserPosts.filter(post => post.active === true);
  const pendingPosts = allUserPosts.filter(post => post.active === false);
  const approvedPostsElements = await Promise.all(
    approvedPosts.map(async (post) => <ProductCard post={post} key={post.id} />)
  );
  const pendingPostsElements = await Promise.all(
    pendingPosts.map(async (post) => <ProductCard post={post} key={post.id} />)
  );

  const showPhoneNumberBanner = conditionsParams?.reason === 'phone_required';
  const callbackUrl = conditionsParams?.callbackUrl;

  return (
    <AccountPageClient
      user={user} 
      categories={categories}
      showPhoneNumberBanner={showPhoneNumberBanner}
      callbackUrl={callbackUrl}
      approvedPostsElements={<>{approvedPostsElements}</>}
      pendingPostsElements={<>{pendingPostsElements}</>}
      approvedCount={approvedPosts.length}
      pendingCount={pendingPosts.length}
    />
  );
} 