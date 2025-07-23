import { NextRequest, NextResponse } from 'next/server'

const allowedOrigins = [
  'https://fuland.vn',
  'https://www.fuland.vn',
]

export function setCORSHeaders(response: Response, origin: string | null) {
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
  }
  return response
}

export function createCORSOptions(request: NextRequest) {
  const origin = request.headers.get('origin')
  const response = new NextResponse(null, { status: 204 })
  return setCORSHeaders(response, origin)
}

// For better-auth handlers (Request/Response)
export function withCORSAuth(
  handler: (request: Request) => Promise<Response> | Response
) {
  return async (request: NextRequest) => {
    const origin = request.headers.get('origin')
    const response = await handler(request)
    return setCORSHeaders(response, origin)
  }
}

// For Next.js handlers (NextRequest/NextResponse)
export function withCORS(
  handler: (request: NextRequest) => Promise<NextResponse> | NextResponse
) {
  return async (request: NextRequest) => {
    const origin = request.headers.get('origin')
    const response = await handler(request)
    return setCORSHeaders(response, origin)
  }
}