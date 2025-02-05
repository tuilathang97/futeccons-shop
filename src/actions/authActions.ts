'use server'
import db from "@/db/drizzle";
import { usersTable } from "@/db/schema";
import { generateSessionToken, createSession, setSessionTokenCookie, invalidateSession, getCurrentSession, deleteSessionTokenCookie } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function login(formData) {
  const user = await db.select().from(usersTable)
    .where(eq(usersTable.id, '0aafb089-1035-4e16-8ed4-5eb6cd23d253'));
  console.log({user})
  const token = generateSessionToken();
  const session = await createSession(token, '0aafb089-1035-4e16-8ed4-5eb6cd23d253');
  setSessionTokenCookie(token, session.expiresAt);
}

export async function logout(formData) {
  const user = await db.select().from(usersTable)
    .where(eq(usersTable.id, '0aafb089-1035-4e16-8ed4-5eb6cd23d253'));
  console.log({user})
  const { session } = await getCurrentSession();
  if (session) {
    invalidateSession(session?.id);
    deleteSessionTokenCookie();
    redirect('/');
  }
}