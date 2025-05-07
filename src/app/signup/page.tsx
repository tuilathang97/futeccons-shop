import { LogoutForm } from "@/components/signup/LogoutForm";
import { SignInForm } from "@/components/signup/SignInForm";
import { SignUpForm } from "@/components/signup/SignUpForm";
import { getCurrentSession } from "@/lib/auth";

export default async function SignUpPage() {
  const { user } = await getCurrentSession();
  return (
    <div>
      <h1>Đăng ký</h1>
      {
        !user && 
        <>
          <SignUpForm />
          <SignInForm />
        </>
      }
      {
        user && 
        <LogoutForm />
      }
    </div>
  )
}