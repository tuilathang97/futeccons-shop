import CategoryPicker from "@/components/homepage/CategoryPicker";
import ProductsContainer from "@/components/products/ProductsContainer";
import { getCurrentSession } from "@/lib/auth";
import { getCategories, getPosts } from "@/lib/queries/categoryQueries";
import { redirect } from "next/navigation";

export default async function Home() {
  const { user } = await getCurrentSession();
  const categories = await getCategories()
  const posts = await getPosts()
  console.log(posts)
	if (user === null) {
    console.log("not login - redirect to auth")
		return redirect("/signup");
	}
  return (
    <div className="flex flex-col justify-center gap-4">
      <CategoryPicker categories={categories}/>
      <ProductsContainer title="Tin đăng" posts={posts}  />
    </div>
  );
}
