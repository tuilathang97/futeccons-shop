'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCallback } from 'react';
import Image from 'next/image';
import { Card } from './ui/card';
import { FaqItem } from './blocks/faq';
import { useImageUpload } from '@/contexts/ImageUploadContext';
import { useFormContext } from 'react-hook-form';
import { Post } from '@/db/schema';
import { FormItem } from './ui/form';
import { FormControl, FormField, FormMessage } from './ui/form';

export function UploadForm() {
  const { previews, addPreviews, previewsFiles, addFiles } = useImageUpload();
  const form = useFormContext<Post>();
  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const urls = Array.from(files).map(file => URL.createObjectURL(file));
    addPreviews(urls);

    addFiles(Array.from(files));
  }, [addPreviews, addFiles]);

  return (
    <FaqItem index={0} question='Đăng tải hình ảnh' isFinish={previews.length > 0} className="space-y-4">
      <Card className="p-6 border-2 border-dashed">

        <FormItem>
          <Input
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="cursor-pointer"
          />

        </FormItem>


        <div className="mt-4 grid grid-cols-5 gap-4">
          {previews.map((url, index) => (
            <div key={index} className="relative aspect-square">
              <Image
                src={url}
                alt={`Preview ${index}`}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </Card>
      <Button onClick={() => console.log("toi dang up hinh + format hinh ")}>
        Upload Images
      </Button>

    </FaqItem>
  );
}