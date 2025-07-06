import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

const allowedOrigins = [
  'https://fuland.vn',
  'https://www.fuland.vn',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const origin = request.headers.get('origin') ?? ''

  if (pathname.startsWith('/api/auth/')) {
    if (request.method === 'OPTIONS') {
      const response = new NextResponse(null, { status: 204 })
      if (allowedOrigins.includes(origin)) {
        response.headers.set('Access-Control-Allow-Origin', origin)
        response.headers.set('Access-Control-Allow-Credentials', 'true')
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
      }
      return response
    }

    const response = NextResponse.next()
    if (allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin)
      response.headers.set('Access-Control-Allow-Credentials', 'true')
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
    }
    return response
  }

  if (['/account', '/dang-tin', '/admin'].some((path) => pathname.startsWith(path))) {
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session?.user) {
      return NextResponse.redirect(new URL('/dang-nhap?callbackUrl=' + pathname, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/auth/:path*', '/account/:path*', '/dang-tin/:path*', '/admin/:path*'],
} 