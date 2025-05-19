import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex container flex-col items-center gap-4 justify-center h-screen">
      <h1 className="text-4xl font-bold text-red-500">404 - Page Not Found</h1>
      <p className="text-gray-500">The page you are looking for does not exist.</p>
      <Link href="/" className="text-blue-500 hover:text-blue-600">
        <Button>Go to Home</Button>
      </Link>
    </div>
  )
}