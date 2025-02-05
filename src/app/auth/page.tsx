import { login, logout } from "@/actions/authActions";
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
    <section>
      <form
        action={async (formData) => {
          'use server'
          await login(formData);
          redirect('/')
        }}
      >
        <input type="email" placeholder="Email"/>
        <br></br>
        <button type="submit">Login</button>
      </form>
      <form
        action={async (formData) => {
          'use server'
          await logout(formData);
          redirect('/')
        }}
      >
        <button type="submit">Logout</button>
      </form>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </section>
  );
}
