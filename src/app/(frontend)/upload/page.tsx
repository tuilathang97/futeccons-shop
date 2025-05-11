import { UploadForm } from "@/components/image-upload-form";

export default function Upload() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-8">Upload Images</h1>
      <UploadForm />
    </main>
  );
}