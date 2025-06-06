import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import React from "react";

interface ProductsTabProps {
  approvedPostsElements: React.ReactNode;
  pendingPostsElements: React.ReactNode;
  approvedCount: number;
  pendingCount: number;
}

export default function ProductsTab({
  approvedPostsElements,
  pendingPostsElements,
  approvedCount,
  pendingCount
}: ProductsTabProps) {
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
              Đã kiểm duyệt ({approvedCount})
            </TabsTrigger>
            <TabsTrigger className="h-12 text-base font-semibold" value="pending">
              Chờ kiểm duyệt ({pendingCount})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="approved">
            {approvedCount > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {approvedPostsElements}
              </div>
            ) : (
              <p className="text-center text-gray-500">Bạn không có bài viết nào đã được duyệt.</p>
            )}
          </TabsContent>
          <TabsContent value="pending">
            {pendingCount > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {pendingPostsElements}
              </div>
            ) : (
              <p className="text-center text-gray-500">Bạn không có bài viết nào đang chờ duyệt.</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}