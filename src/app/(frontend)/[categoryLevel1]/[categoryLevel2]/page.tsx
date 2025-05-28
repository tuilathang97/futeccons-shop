import ProductsContainer from "@/components/post/ProductsContainer";
import { getPostByCategoryPath } from "@/lib/queries";
import { getCategories, validateCategoryPath } from "@/lib/queries/categoryQueries";
import { notFound } from "next/navigation";
import { getPublishedArticleByParams } from "@/actions/articleActions";
import ArticleContent from "@/components/articles/ArticleContent";
import { getPostImages } from "@/lib/queries/postImagesQueries";
import PageWrapper from "@/components/PageWrapper";
import FilterBar from "@/components/filterComponent/FilterBar";
import CategoryPicker from "@/components/homepage/CategoryPicker";
import Sidebar from "@/components/location/Sidebar";

export default async function ProductListing2LevelDeep({ params }: {
    params: Promise<{ categoryLevel1: string, categoryLevel2: string }>;
}) {
    const { categoryLevel1, categoryLevel2 } = await params;
    const categories = await getCategories();
    const isValidPath = await validateCategoryPath(`/${categoryLevel1}/${categoryLevel2}`);
    if (!isValidPath || !categories ) {
        notFound();
    }
    const currentCategory = categories.find(category => category.path === `/${categoryLevel1}/${categoryLevel2}`);
    const selectedCategories = categories.filter(cate => cate.parentId === currentCategory?.id);
    const article = await getPublishedArticleByParams({
        level1Slug: categoryLevel1,
        level2Slug: categoryLevel2
    });

    const data = await getPostByCategoryPath(categoryLevel1, categoryLevel2);
    const postImages = await getPostImages();
    return (
        <PageWrapper className="flex flex-col 2xl:px-0 w-full gap-4">
            <div className="grid items-center grid-cols-1 gap-4 sm:flex sm:flex-wrap sm:justify-center md:justify-normal">
                <FilterBar 
                    level1Slug={categoryLevel1}
                    level2Slug={categoryLevel2}
                />
            </div>
            <div>
                <CategoryPicker filterCategories={selectedCategories} className="mt-4" />
            </div>
            <div className="flex flex-col gap-4 my-4 md:grid md:grid-cols-[70%_30%]">
                <div className="min-w-full">
                    <ProductsContainer
                        data={data || []}
                        postImages={postImages}
                        searchParam={{}}
                        cardVariant="horizontal"
                    />
                </div>
                <div className="mt-4 md:mt-0">
                    <Sidebar />
                </div>
            </div>

            {article && (
                <div className="mt-8">
                    <ArticleContent article={article} />
                </div>
            )}
        </PageWrapper>
    );
}
