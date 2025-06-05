import ProductCard from "@/components/products/ProductCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Post, Image } from "@/db/schema"

export default function ProductsTab({ userPosts, postImages }: { userPosts: Post[], postImages: Image[] }) {
  const approvedPosts = userPosts.filter((post) => post.active === true);
  const pendingPosts = userPosts.filter((post) => post.active === false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Bài viết của bạn
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="approved" className="min-w-full">
          <TabsList className="mb-4">
            <TabsTrigger className="h-12 text-base font-semibold" value="approved">
              Đã kiểm duyệt
            </TabsTrigger>
            <TabsTrigger className="h-12 text-base font-semibold" value="pending">Chờ kiểm duyệt</TabsTrigger>
          </TabsList>
          <TabsContent value="approved">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {approvedPosts.map((post, index) => {
                const postImage = postImages.find((e) => e.postId === post.id)
                return (
                  <ProductCard  post={post} key={index} thumbnailImg={postImage} />
                )
              })}
            </div>
          </TabsContent>
          <TabsContent value="pending">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {pendingPosts.map((post, index) => {
                const postImage = postImages.find((e) => e.postId === post.id)
                return (
                  <ProductCard post={post} key={index} thumbnailImg={postImage} />
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}