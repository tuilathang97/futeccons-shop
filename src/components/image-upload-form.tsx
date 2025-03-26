'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useActionState, useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { uploadImages } from '@/actions/upload';
import { Card } from './ui/card';
import { useToast } from '@/hooks/use-toast';


export function UploadForm() {
  const { toast } = useToast()
  const [previews, setPreviews] = useState<string[]>([]);
  const [state, action,isPending] = useActionState(uploadImages, { success: false, paths: '', error: '' });
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files){
      toast({title:"Nhập ảnh thất bại"});
      return
    };
    const urls = Array.from(files).map(file => URL.createObjectURL(file));
    console.log(urls)
    setPreviews(urls);
  }, [toast]);
  useEffect(() => {
    if(state.success){
      toast({title:"Thông báo",description:"Tải ảnh lên máy chủ thành công"})
    }
  },[state.success,toast])
  console.log(state.images)
  return (
    <form action={action} className="space-y-4">
      <Card className="p-6 border-2 border-dashed">
        <Input
          type="file"
          name="images"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="cursor-pointer"
        />

        <div className="grid grid-cols-5 gap-4 mt-4">
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

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Uploading...' : 'Upload Images'}
      </Button>
      <Button type="submit" disabled={previews.length > 0 ? false : true}>
        Đặt lại
      </Button>

      {state?.error && (
        <p className="text-red-500">{state.error}</p>
      )}

      {state?.paths && (
        <div className="grid grid-cols-5 gap-4">
          {state.paths.map((path, index) => (
            <div key={index} className="relative aspect-square">
              <Image
                src={path}
                alt={`Uploaded ${index}`}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      )}

      {state?.images && (
        <div className="space-y-8">
          <div>
            <h3 className="mb-4 text-lg font-bold">Square Versions</h3>
            <div className="grid grid-cols-5 gap-4">
              {state.images.map((img, index) => (
                <div key={index} className="relative aspect-square">
                  <Image
                    src={img.square}
                    alt={`Square ${index}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold">Carousel Versions</h3>
            <div className="grid grid-cols-3 gap-4">
              {state.images.map((img, index) => (
                <div key={index} className="relative aspect-video">
                  <Image
                    src={img.carousel}
                    alt={`Carousel ${index}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
