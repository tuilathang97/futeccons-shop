import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex container flex-col items-center gap-4 justify-center h-screen">
      <h1 className="text-4xl font-bold text-red-500">Lỗi, Trang không tồn tại</h1>
      <p className="text-gray-500">Trang bạn đang tìm kiếm không tồn tại.</p>
      <Link href="/" className="text-blue-500 hover:text-blue-600">
        <Button>Quay về trang chủ</Button>
      </Link>
    </div>
  )
}