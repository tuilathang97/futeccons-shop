import { login, logout } from "@/actions/authActions";
import SignInViewPage from "@/features/components/signin-view";
import { validateSessionToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthPage() {
  return (
    <SignInViewPage />
  );
}
