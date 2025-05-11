import { getCategories } from '@/lib/queries/categoryQueries';
import CategoryClientUI from '@/components/categories/CategoryClientUI';

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <section className="flex flex-col items-center gap-4 w-full">
      <CategoryClientUI initialCategories={categories} />
    </section>
  );
}