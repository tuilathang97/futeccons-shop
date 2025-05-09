'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCallback, useState } from 'react';
import Image from 'next/image';
import { Card } from './ui/card';
import { FaqItem } from './blocks/faq';

export function UploadForm() {
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const urls = Array.from(files).map(file => URL.createObjectURL(file));
    setPreviews(urls);
  }, []);

  return (
    <FaqItem index={0} question='Đăng tải hình ảnh' isFinish={false} className="space-y-4">
      <Card className="p-6 border-2 border-dashed">
        <Input
          type="file"
          name="images"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="cursor-pointer"
        />

        <div className="mt-4 grid grid-cols-5 gap-4">
          {previews.map((url, index) => (
            <div key={index} className="relative aspect-square">
              <Image
                src={url}
                alt={`Preview ${index}`}
                fill
                className="object-cover rounded-lg"
                onLoad={() => URL.revokeObjectURL(url)}
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