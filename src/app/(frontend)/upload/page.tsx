import { UploadForm } from "@/components/image-upload-form";

// Force dynamic rendering for upload page
export const dynamic = 'force-dynamic';

export default function Upload() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-8">Upload Images</h1>
      <UploadForm />
    </main>
  );
}