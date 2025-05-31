'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProductsTab from "./ProductsTab";
import { CategoriesProvider } from "@/contexts/CategoriesContext";
import PageWrapper from "@/components/PageWrapper";
import UserProfileForm from "./UserProfileForm";
import MissingPhoneNumberBanner from "@/components/auth/MissingPhoneNumberBanner"; // Import the banner
import type { User, Post, Image as DbImage, Category } from "@/db/schema"; // Use DbImage to avoid conflict with Next/Image

interface AccountPageClientProps {
  user: User; // Ensure this User type matches what UserProfileForm expects
  userPosts: Post[];
  postImages: DbImage[];
  categories: Category[];
  showPhoneNumberBanner: boolean;
  callbackUrl?: string | null;
}

export default function AccountPageClient({
  user,
  userPosts,
  postImages,
  categories,
  showPhoneNumberBanner,
  callbackUrl,
}: AccountPageClientProps) {
  const userImage = typeof user.image === 'string' ? user.image : undefined;

  return (
    <CategoriesProvider initialCategories={categories}>
      <PageWrapper className="space-y-6 ">
        {showPhoneNumberBanner && <MissingPhoneNumberBanner callbackUrl={callbackUrl} />}
        <h1 className="text-2xl font-semibold ">Thông tin tài khoản</h1>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage className="object-cover" src={userImage} alt={user.name || "User avatar"} />
                <AvatarFallback>{user.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              {user.name}
            </CardTitle>
            <CardDescription>
              Xem và quản lý thông tin tài khoản của bạn.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p>{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email đã xác thực</p>
                <p>{user.emailVerified ? "Đã xác thực" : "Chưa xác thực"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Số điện thoại</p>
                <p>{user.number || "Chưa có"}</p>
              </div>
            </div>
          </CardContent>
          <div className="flex px-4 py-4">
            <UserProfileForm user={user} />
          </div>
        </Card>
        <ProductsTab userPosts={userPosts} postImages={postImages} />
      </PageWrapper>
    </CategoriesProvider>
  );
} 