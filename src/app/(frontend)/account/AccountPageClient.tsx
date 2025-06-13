'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProductsTab from "./ProductsTab";
import { CategoriesProvider } from "@/contexts/CategoriesContext";
import MissingPhoneNumberBanner from "@/components/auth/MissingPhoneNumberBanner";
import type { User, Category } from "@/db/schema";
import React from "react";
import UserProfileForm from "./UserProfileForm";

interface AccountPageClientProps {
  user: User;
  categories: Category[];
  showPhoneNumberBanner: boolean;
  callbackUrl?: string | null;
  approvedPostsElements: React.ReactNode;
  pendingPostsElements: React.ReactNode;
  approvedCount: number;
  pendingCount: number;
}

export default function AccountPageClient({
  user,
  categories,
  showPhoneNumberBanner,
  callbackUrl,
  approvedPostsElements,
  pendingPostsElements,
  approvedCount,
  pendingCount,
}: AccountPageClientProps) {
  const userImage = typeof user.image === 'string' ? user.image : undefined;
  return (
    <CategoriesProvider initialCategories={categories}>
      <div className="space-y-6 px-0 container">
        {showPhoneNumberBanner && <MissingPhoneNumberBanner callbackUrl={callbackUrl} />}
        <Card className="border-none shadow-none">
          <CardHeader className="flex flex-col gap-4 ">
            <h1 className="text-2xl font-semibold  ">Thông tin tài khoản</h1>
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
          <div className="flex px-4">
            <UserProfileForm user={user} />
          </div>
        </Card>
        <ProductsTab
          approvedPostsElements={approvedPostsElements}
          pendingPostsElements={pendingPostsElements}
          approvedCount={approvedCount}
          pendingCount={pendingCount}
        />
      </div>
    </CategoriesProvider>
  );
} 