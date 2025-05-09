"use client"
import { Button } from '@/components/ui/button';
import { useRef, useEffect, useState } from 'react';

export default function UploadWidget() {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!window.cloudinary) {
      const script = document.createElement('script');
      script.src = 'https://upload-widget.cloudinary.com/global/all.js';
      script.async = true;
      script.onload = () => initCloudinaryWidget();
      document.body.appendChild(script);
    } else {
      initCloudinaryWidget();
    }

    function initCloudinaryWidget() {
      cloudinaryRef.current = window.cloudinary;
      widgetRef.current = cloudinaryRef.current.createUploadWidget({
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: 'stupidCloudy',
        multiple: true,
        sources: ['local', 'url', 'camera'],
        showAdvancedOptions: false,
        cropping: false,
        transformation: [
          {
            fetch_format: 'webp', 
            format: 'webp',
            quality: 'auto:good'
          }
        ],    
        resourceType: 'image',
        maxFileSize: 5000000,
        maxImageFileSize: 5000000,
        maxVideoFileSize: 5000000,
        maxImageWidth: 2000,
        maxImageHeight: 2000,
      }, (error, result) => {
        setIsLoading(false);
        if (error) {
          console.error('Upload Error:', error);
          return;
        }
        if (result && result.event === 'success') {
          console.log('Upload Success:', result.info);
        }
      });
    }

    return () => {
      if (widgetRef.current) {
        widgetRef.current.destroy();
      }
    };
  }, []);

  return (
    <div>
      <Button 
        onClick={() => {
          setIsLoading(true);
          widgetRef.current?.open();
        }}
        disabled={isLoading}
      >
        {isLoading ? 'Uploading...' : 'Upload Images'}
      </Button>
    </div>
  );
}