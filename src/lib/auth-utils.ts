'use server'

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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
 * Get the current user session from the server
 * For use in Server Components and Server Actions
 */
export async function getServerSession(): Promise<UserSession | null> {
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