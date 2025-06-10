import CategoryPicker from "@/components/homepage/CategoryPicker";
import ProductsContainer from "@/components/products/ProductsContainer";
import { getCategories } from "@/lib/queries/categoryQueries";
import { getHomepageData } from "@/lib/queries/postQueries";
import { Metadata } from "next";
import { PaginationParams } from '@/lib/queries/paginateQuery';
import { CategoriesProvider } from "@/contexts/CategoriesContext";
import HomeImage from "@/components/homepage/HomeImage";

interface HomePageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
  }>;
}

const DEFAULT_PAGE_SIZE = 10; 

export default async function Home({ searchParams }: HomePageProps) {
  const categories = await getCategories();
  const searchParamsValue = await searchParams;
  const page = searchParamsValue.page ? parseInt(searchParamsValue.page, 10) : 1;
  const pageSize = searchParamsValue.pageSize ? parseInt(searchParamsValue.pageSize, 10) : DEFAULT_PAGE_SIZE;

  const paginationParams: PaginationParams = {
    page: isNaN(page) ? 1 : page,
    pageSize: isNaN(pageSize) ? DEFAULT_PAGE_SIZE : pageSize,
  };

  const banNhaCategory = categories.find(cat => cat.name === "Bán nhà" && cat.level === 1);
  const choThueCategory = categories.find(cat => cat.name === "Cho thuê" && cat.level === 1);
  const duAnCategory = categories.find(cat => cat.name === "Dự án" && cat.level === 1);

  const homepageData = await getHomepageData(paginationParams, {
    banNhaId: banNhaCategory?.id,
    choThueId: choThueCategory?.id,
    duAnId: duAnCategory?.id,
  });
  

  return (
    <CategoriesProvider initialCategories={categories}>
      <div className="flex flex-col justify-center items-center gap-4">
        <HomeImage href="/" imgUrl="/categoryImages/saigon.webp" />
        <CategoryPicker />
        <ProductsContainer title="Tin nổi bật" posts={homepageData.featuredPosts}  />
        <ProductsContainer title="Tin bán nhà" posts={homepageData.banNhaPosts}  />
        <ProductsContainer title="Tin cho thuê" posts={homepageData.choThuePosts}  />
        <ProductsContainer title="Tin dự án" posts={homepageData.duAnPosts}  />
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