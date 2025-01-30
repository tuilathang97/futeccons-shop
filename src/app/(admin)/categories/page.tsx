import { getCategories } from '@/lib/queries/categoryQueries';
import CategoryForm from '@/components/categories/CategoryForm';
import CategoryList from '@/components/categories/CategoryList';

export default async function AdminCategories() {
  const categories = await getCategories() || [];
  console.log({ categories });
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Category Management</h1>
      <CategoryForm />
      <CategoryList categories={categories} />
    </main>
  );
}