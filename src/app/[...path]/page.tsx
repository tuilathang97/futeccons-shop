import ProductsListWithFilter from "@/components/filterComponent/ProductsListWithFilter";
import { getCategoryBySlug } from "@/lib/queries/categoryQueries";
import Link from "next/link";


interface paramsI {
  path: Array<string>
}

export default async function Page({ params }: { params: Promise<paramsI> }) {
  const { path } = await params;
  const querySlug = path.map((slug: string) => `/${slug}`).join('')
  const queryCategories = await getCategoryBySlug(querySlug)

  return queryCategories ?
    <div className="flex">
        <ProductsListWithFilter />
    </div> : <div>
      <span>Slug is not available <Link href={"/"} className="text-red-600">Click me to return to the homepage</Link></span>
    </div>
}