import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";
import { createCORSOptions, withCORSAuth } from '@/lib/cors'

const handlers = toNextJsHandler(auth);

export async function OPTIONS(request: NextRequest) {
  return createCORSOptions(request)
}

export const GET = withCORSAuth(handlers.GET)
export const POST = withCORSAuth(handlers.POST) 