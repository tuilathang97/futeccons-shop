import { getCategories } from '@/lib/queries/categoryQueries';
import CategoryForm from '@/components/categories/CategoryForm';
import CategoryList from '@/components/categories/CategoryList';
import { Suspense } from 'react';
// import { Category } from '@/components/categories/categorySchema';

export default async function AdminCategories() {
  const categories = await getCategories();
  return (
    <main className="p-4 flex items-center flex-col gap-4" >
      <h1 className="text-2xl font-bold mb-4">Quản lý danh mục</h1>
      <CategoryForm categories={categories}/>
      <Suspense fallback={<div>Loading...</div>}>
        <CategoryList />
      </Suspense>
    </main>
  );
}