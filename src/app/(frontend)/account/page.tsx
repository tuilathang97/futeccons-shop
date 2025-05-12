import { getServerSession } from "@/lib/auth-utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from 'next/navigation';

export default async function AccountPage() {
  const userSession = await getServerSession();

  if (!userSession || !userSession.user) {
    redirect("/auth/sign-in?callbackUrl=/account");
  }

  const { user } = userSession;
  const userImage = typeof user.image === 'string' ? user.image : undefined;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Thông tin tài khoản</h1>
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
    </div>
  );
} 