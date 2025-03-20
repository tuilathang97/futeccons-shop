'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useActionState, useCallback, useState } from 'react';
import Image from 'next/image';
import { uploadImages } from '@/actions/upload';
import { Card } from './ui/card';
import { useFormStatus } from 'react-dom';

export function UploadForm() {
  const [previews, setPreviews] = useState<string[]>([]);
  const [state, action] = useActionState(uploadImages, { success: false, paths: '', error: ''});

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const urls = Array.from(files).map(file => URL.createObjectURL(file));
    setPreviews(urls);
  }, []);

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

      <SubmitButton />
      
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
            <h3 className="text-lg font-bold mb-4">Square Versions</h3>
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
            <h3 className="text-lg font-bold mb-4">Carousel Versions</h3>
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

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Uploading...' : 'Upload Images'}
    </Button>
  );
}