import CategoryPicker from "@/components/homepage/CategoryPicker";
import ProductsContainer from "@/components/products/ProductsContainer";
import { getCategories } from "@/lib/queries/categoryQueries";
import { getPosts } from "@/lib/queries/postQueries";
import { Metadata } from "next";
import { PaginationParams } from '@/lib/queries/paginateQuery';
import { getPostImages } from "@/lib/queries/postImagesQueries";
import { CategoriesProvider } from "@/contexts/CategoriesContext";
import PageWrapper from "@/components/PageWrapper";

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

  const banNhaCategory = categories.find(cat => cat.name === "Bán nhà" && cat.level === 1);
  const choThueCategory = categories.find(cat => cat.name === "Cho thuê" && cat.level === 1);
  const duAnCategory = categories.find(cat => cat.name === "Dự án" && cat.level === 1);

  const postsBanNha = banNhaCategory ? await getPosts(paginationParams, banNhaCategory.id) : { data: [], metadata: paginatedPosts.metadata };
  const postsChoThue = choThueCategory ? await getPosts(paginationParams, choThueCategory.id) : { data: [], metadata: paginatedPosts.metadata };
  const postsDuAn = duAnCategory ? await getPosts(paginationParams, duAnCategory.id) : { data: [], metadata: paginatedPosts.metadata };

  const postImages = await getPostImages();
  return (
    <CategoriesProvider initialCategories={categories}>
      <PageWrapper className="flex flex-col justify-center min-w-full items-center gap-4">
        <CategoryPicker />
        <ProductsContainer title="Tin nổi bật" posts={paginatedPosts.data} postImages={postImages} />
        <ProductsContainer title="Tin bán nhà" posts={postsBanNha.data} postImages={postImages} />
        <ProductsContainer title="Tin cho thuê" posts={postsChoThue.data} postImages={postImages} />
        <ProductsContainer title="Tin dự án" posts={postsDuAn.data} postImages={postImages} />

      </PageWrapper>
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