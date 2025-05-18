import CategoryPicker from "@/components/homepage/CategoryPicker";
import ProductsContainer from "@/components/products/ProductsContainer";
import { getCategories } from "@/lib/queries/categoryQueries";
import { getPosts } from "@/lib/queries/postQueries";
import { Metadata } from "next";
import { PaginationParams } from '@/lib/queries/paginateQuery';
import { getPostImages } from "@/lib/queries/postImagesQueries";
import { CategoriesProvider } from "@/contexts/CategoriesContext";

interface HomePageProps {
  searchParams: {
    page?: string;
    pageSize?: string;
  };
}

const DEFAULT_PAGE_SIZE = 10; 

export default async function Home({ searchParams }: HomePageProps) {
  const categories = await getCategories();
  const searchParamsValue = await searchParams;
  const page = searchParamsValue.page ? parseInt( searchParamsValue.page, 10) : 1;
  const pageSize = searchParamsValue.pageSize ? parseInt(searchParamsValue.pageSize, 10) : DEFAULT_PAGE_SIZE;

  const paginationParams: PaginationParams = {
    page: isNaN(page) ? 1 : page,
    pageSize: isNaN(pageSize) ? DEFAULT_PAGE_SIZE : pageSize,
  };

  const paginatedPosts = await getPosts(paginationParams);
  const postImages = await getPostImages();
  return (
    <CategoriesProvider initialCategories={categories}>
      <div className="flex flex-col container px-0 justify-center min-w-full items-center gap-4">
        <CategoryPicker categories={categories}/>
        <ProductsContainer title="Tin đăng" posts={paginatedPosts.data} postImages={postImages} />
      </div>
    </CategoriesProvider>
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