import Link from "next/link";
import { Category } from "@/db/schema";

export default function CategoryList({ categories }: { categories: Category[]}) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Categories</h2>
      <ul>
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