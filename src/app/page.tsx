import ProductsContainer from "@/components/products/ProductsContainer";
import { postsData } from "@/db/Data";
import { getCurrentSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const { user } = await getCurrentSession();
	if (user === null) {
    console.log("not login - redirect to auth")
		return redirect("/signup");
	}
  console.log("user logged in")
  return (
    <div className="flex justify-center">
      <ProductsContainer title="Tin đăng" posts={postsData} />
    </div>
  );
}
