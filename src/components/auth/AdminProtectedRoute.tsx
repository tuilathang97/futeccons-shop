import { redirect } from 'next/navigation';
import { isAdminUser } from '@/lib/auth-utils';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export default async function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const isAdmin = await isAdminUser();
  if (!isAdmin) {
    redirect('/')
  }

  return <>{children}</>;
} 