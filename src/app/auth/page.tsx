import { login, logout } from "@/actions/authActions";
import SignInViewPage from "@/features/components/signin-view";
import { validateSessionToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthPage() {
  const c = await cookies();
  const token = c.get('session');
  let session: any = 'null';
  if (token) {
    const result = await validateSessionToken(token.value);
    session = result.session;
    console.log('user already logged in');
    console.log({session: result.session, user: result.user});
  }
  return (
    <SignInViewPage />
  );
}
