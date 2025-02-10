import { getCategoryBySlug } from "@/lib/queries/categoryQueries";
import Link from "next/link";

interface paramsI {
  path: Array<string>
}

export default async function Page({ params }: { params: Promise<paramsI> }) {
  const { path } = await params;
  const querySlug = path.map((slug: string) => `/${slug}`).join('')
  const queryCategories = await getCategoryBySlug(querySlug)

  const slug = path.map((slug: string) => {
    return (
      <div key={slug}>/{slug}</div>
    )
  })
  return queryCategories !== undefined ?
    <div className="flex">
      <span className="flex gap-2">Slug hien tai:{slug}</span>
    </div> : <div>
      <span>Slug is not available <Link href={"/"} className="text-red-600">Click me to return to the homepage</Link></span>
      </div>
}