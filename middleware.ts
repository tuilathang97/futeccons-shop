import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://www.fuland.vn', 'https://fuland.vn']
  : ['http://localhost:3000']

export async function middleware(request: NextRequest) {
  const origin = request.headers.get('origin') ?? ''

  // Handle CORS preflight requests
  if (request.method === 'OPTIONS' && request.nextUrl.pathname.startsWith('/api/')) {
    if (allowedOrigins.includes(origin)) {
      const response = new NextResponse(null, { status: 204 })
      response.headers.set('Access-Control-Allow-Origin', origin)
      response.headers.set('Access-Control-Allow-Credentials', 'true')
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      return response
    }
    return new NextResponse(null, { status: 204 })
  }

  // Handle API routes with CORS first
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const response = NextResponse.next()
    
    if (allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin)
      response.headers.set('Access-Control-Allow-Credentials', 'true')
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    }
    
    return response
  }

  // Handle authentication for protected routes
  const { pathname } = request.nextUrl
  if (['/account', '/dang-tin', '/admin'].some((path) => pathname.startsWith(path))) {
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session?.user) {
      return NextResponse.redirect(new URL('/dang-nhap?callbackUrl=' + pathname, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*', '/account/:path*', '/dang-tin/:path*', '/admin/:path*'],
} 