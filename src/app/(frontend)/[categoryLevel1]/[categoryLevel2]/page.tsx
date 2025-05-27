import ProductCard from "@/components/products/ProductCard";
import { getPostByCategoryPath } from "@/lib/queries";
import { getCategories, validateCategoryPath } from "@/lib/queries/categoryQueries";
import { notFound } from "next/navigation";
import { getPublishedArticleByParams } from "@/actions/articleActions";
import ArticleContent from "@/components/articles/ArticleContent";
import { getPostImages } from "@/lib/queries/postImagesQueries";
import PageWrapper from "@/components/PageWrapper";
import FilterBar from "@/components/filterComponent/FilterBar";
import CategoryPicker from "@/components/homepage/CategoryPicker";

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
        <PageWrapper className="flex flex-col gap-8 ">
            <FilterBar 
                level1Slug={categoryLevel1}
                level2Slug={categoryLevel2}
            />
            <div>
                <CategoryPicker filterCategories={selectedCategories} className="mt-4" />
            </div>
            <div className="flex flex-col grid-cols-6 gap-4 sm:grid">
                <div className="flex flex-col col-span-4 gap-4 py-4 min-h-fit">
                    {data && data.length > 0 ? data.map((postData, index) => {
                        const postImage = postImages.find((e) => e.postId === postData.id);
                        return (
                            <ProductCard thumbnailImg={postImage} variant="horizontal" post={postData} key={index} />
                        );
                    }) : <div>no post found</div>
                    }
                </div>
                <div className="col-span-2"></div>
            </div>

            {article && (
                <div className="mt-8">
                    <ArticleContent article={article} />
                </div>
            )}
        </PageWrapper>
    );
}
