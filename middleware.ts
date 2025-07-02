import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (['/account', '/dang-tin', '/admin'].some((path) => pathname.startsWith(path))) {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      return NextResponse.redirect(new URL('/dang-nhap?callbackUrl=' + pathname, request.url));
    }
  }

  return NextResponse.next();

}

export const config = {
  matcher: ['/account/:path*', '/dang-tin/:path*', '/admin/:path*']
} 