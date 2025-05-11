import { createAuthClient } from "better-auth/react";
import { adminClient, usernameClient } from "better-auth/client/plugins"
import { customSessionClient } from "better-auth/client/plugins";
import type { auth } from "@/lib/auth"; // Import the auth instance as a type

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [ 
    usernameClient(),
    customSessionClient<typeof auth>(),
    adminClient()
  ] 
})


export type AuthClient = typeof authClient;

export const {
  signIn,
  signOut,
  signUp,
  useSession
} = authClient;