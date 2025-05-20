import { getServerSession } from "@/lib/auth-utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from 'next/navigation';
import ProductsTab from "./ProductsTab";
import { getPostBelongToUser, getPostById } from "@/lib/queries/postQueries";
import { getPostImages } from "@/lib/queries/postImagesQueries";
import { CategoriesProvider } from "@/contexts/CategoriesContext";
import { getCategories } from "@/lib/queries/categoryQueries";
export default async function AccountPage() {
  const userSession = await getServerSession();

  if (!userSession || !userSession.user) {
    redirect("/auth/sign-in?callbackUrl=/account");
  }

  const { user } = userSession;
  const userImage = typeof user.image === 'string' ? user.image : undefined;
  const userPosts = await getPostBelongToUser(user.id);
  const postImages = await getPostImages()
  const categories = await getCategories()
  return (
    <CategoriesProvider initialCategories={categories}>
      <div className="space-y-6 container px-0 ">
        <h1 className="text-2xl font-semibold ">Thông tin tài khoản</h1>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={userImage} alt={user.name || "User avatar"} />
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
                <p className="text-sm font-medium text-gray-500">Vai trò</p>
                <p>{user.role || "Người dùng"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email đã xác thực</p>
                <p>{user.emailVerified ? "Đã xác thực" : "Chưa xác thực"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <ProductsTab userPosts={userPosts} postImages={postImages} />
      </div>
    </CategoriesProvider>
  );
} 