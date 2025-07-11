'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCallback } from 'react';
import Image from 'next/image';
import { Card } from './ui/card';
import { FaqItem } from './blocks/faq';
import { useImageUpload } from '@/contexts/ImageUploadContext';
import { FormItem } from './ui/form';
import { toast } from '@/hooks/use-toast';

const MAX_IMAGES = 10;

export function UploadForm() {
  const { previews, addPreviews, removePreviews, addFiles, clearPreviews, previewsFiles } = useImageUpload();

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files;
    if (!newFiles) return;

    const currentImageCount = previewsFiles.length;
    const remainingSlots = MAX_IMAGES - currentImageCount;

    if (remainingSlots <= 0) {
      toast({
        title: "Đã đạt giới hạn ảnh",
        description: `Bạn chỉ có thể tải lên tối đa ${MAX_IMAGES} ảnh.`,
        variant: "destructive",
      });
      e.target.value = "";
      return;
    }

    let filesToProcess = Array.from(newFiles);

    if (filesToProcess.length > remainingSlots) {
      toast({
        title: "Vượt quá số lượng cho phép",
        description: `Bạn đã chọn ${filesToProcess.length} ảnh, nhưng chỉ có thể thêm ${remainingSlots} ảnh nữa. Chỉ ${remainingSlots} ảnh đầu tiên được thêm vào.`,
        variant: "default",
      });
      filesToProcess = filesToProcess.slice(0, remainingSlots);
    }

    if (filesToProcess.length === 0) {
        e.target.value = "";
        return;
    }

    const urls = filesToProcess.map(file => URL.createObjectURL(file));
    addPreviews(urls);
    addFiles(filesToProcess);
    e.target.value = "";
  }, [addPreviews, addFiles, previewsFiles]);

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
              <Button onClick={() => removePreviews(index)} className="absolute top-0 rounded-full bg-black text-gray-300 w-8 h-8 right-[-10px]">X</Button>
            </div>
          ))}
        </div>
        {previews.length > 0 && <Button className='mt-4' onClick={clearPreviews}>Xóa tất cả</Button>}
      </Card>
    </FaqItem>
  );
}