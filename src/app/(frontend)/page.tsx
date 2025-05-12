import CategoryPicker from "@/components/homepage/CategoryPicker";
import ProductsContainer from "@/components/products/ProductsContainer";
import { getCategories, getPosts } from "@/lib/queries/categoryQueries";
import { Metadata } from "next";

export default async function Home() {
  const categories = await getCategories()
  const posts = await getPosts()
  return (
    <div className="flex flex-col container justify-center min-w-full items-center gap-4">
      <CategoryPicker categories={categories}/>
      <ProductsContainer title="Tin đăng" posts={posts}  />
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Futeccons Shop',
  description: 'Futeccons Shop - Real Estate Platform',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  }
} 