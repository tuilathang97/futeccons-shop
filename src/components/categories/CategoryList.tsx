import { getCategories } from "@/lib/queries/categoryQueries";
import Link from "next/link";

export default async function CategoryList({ }) {
  const categories = await getCategories();
  await sleep(2000);
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Categories</h2>
      <ul className="flex flex-col sm:grid sm:grid-cols-3 gap-4">
        {categories
          .map((category) => (
            <li key={category.id} className="mb-2">
              <div>
                {category.name} (Parent ID: {category.parentId || 'None'})
              </div>
              <Link href={category.slug || ""} className="w-full h-12 bg-slate-400 p-1 rounded-sm">Click to redirect</Link>
              <div>slug : {category.slug}</div>
            </li>
        ))}
      </ul>
    </div>
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}