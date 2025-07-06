import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export const { POST, GET } = toNextJsHandler(auth);

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin') || '';
  
  const allowedOrigins = [
    'https://fuland.vn',
    'https://www.fuland.vn',
  ];
  
  const response = new NextResponse(null, { status: 204 });
  
  if (allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }
  
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Max-Age', '86400');
  
  return response;
} 