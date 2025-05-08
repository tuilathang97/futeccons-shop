import CategoryPicker from "@/components/homepage/CategoryPicker";
import ProductsContainer from "@/components/products/ProductsContainer";
import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { getCategories, getPosts } from "@/lib/queries/categoryQueries";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const { data } = await authClient.getSession()

  const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
})

  const categories = await getCategories()
  console.log({data, session});
  const posts = await getPosts()
	if (!session?.user) {
    console.log("not login - redirect to auth")
		return redirect("/auth/sign-up");
	}
  return (
    <div className="flex flex-col justify-center gap-4">
      <CategoryPicker categories={categories}/>
      <ProductsContainer title="Tin đăng" posts={posts}  />
    </div>
  );
}
