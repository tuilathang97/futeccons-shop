'use server'

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { cache } from "react";

// Define the session type to match Better Auth's structure
export type UserSession = {
  session: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string | null;
    userAgent?: string | null;
    impersonatedBy?: string | null;
  };
  user: {
    id: string;
    name: string;
    email: string;
    role?: string | null;
    emailVerified: boolean;
    number?: string | null;
    image?: string | null;
    banned?: boolean | null;
    banReason?: string | null;
    banExpires?: Date | null;
  };
};

/**
 * Internal function for getting server session (without cache)
 */
async function _getServerSession(): Promise<UserSession | null> {
  try {
    const headersList = await headers();
    const headersObj = new Headers();
    headersList.forEach((value, key) => {
      headersObj.append(key, value);
    });
    const session = await auth.api.getSession({ 
      headers: headersObj
    });
    
    return session;
  } catch (error) {
    console.error("Failed to get server session:", error);
    return null;
  }
}

/**
 * Get the current user session from the server (cached)
 * For use in Server Components and Server Actions
 */
export const getServerSession = cache(_getServerSession);

/**
 * Check if the current user is an admin
 * For use in Server Components and Server Actions
 */
export async function isAdminUser(): Promise<boolean> {
  try {
    const session = await getServerSession();
    return !!session?.user && session.user.role === 'admin';
  } catch {
    return false;
  }
}

/**
 * Throw an error if the current user is not an admin
 * For use in Server Actions that require admin access
 */
export async function requireAdmin(): Promise<void> {
  const isAdmin = await isAdminUser();
  
  if (!isAdmin) {
    throw new Error('Unauthorized: Admin access required');
  }
}

/**
 * Get the current user ID
 * For use in Server Components and Server Actions
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getServerSession();
  return session?.user?.id || null;
}

/**
 * Check if the current user is an admin (alias for isAdminUser)
 * For use in Server Components and Server Actions
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  return isAdminUser();
}

/**
 * Get the current user's information
 * For use in Server Components and Server Actions
 */
export async function getCurrentUser(): Promise<UserSession['user'] | null> {
  const session = await getServerSession();
  return session?.user || null;
}

/**
 * Check if the current user is authenticated
 * For use in Server Components and Server Actions
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getServerSession();
  return !!session?.user;
}

/**
 * Require authentication - throws error if not authenticated
 * For use in Server Actions that require authentication
 */
export async function requireAuth(): Promise<UserSession['user']> {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Unauthorized: Authentication required');
  }
  
  return user;
} 