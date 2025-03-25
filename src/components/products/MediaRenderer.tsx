// components/MediaCarousel/MediaRenderer.tsx
"use client"
import Image from 'next/image';
import YouTube, { YouTubeProps } from 'react-youtube';
import { useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';
import { MediaItem } from '@/constants/data';

interface MediaRendererProps {
    item: MediaItem;
}

export function MediaRenderer({ item }: MediaRendererProps) {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const handleError = () => {
        setError('Không thể tải media');
        setIsLoading(false);
    };

    const opts: YouTubeProps['opts'] = {
        width: '100%',
        height: '100%',
        playerVars: {
            autoplay: 0,
            modestbranding: 1,
            controls: 1,
            rel: 0,
            showinfo: 0,
            fs: 1, // fullscreen option
        },
    };

    if (error) {
        return (
            <div className="aspect-[16/9] flex items-center justify-center bg-gray-100">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="aspect-[16/9] relative w-full overflow-hidden bg-gray-100">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-gray-500">Đang tải...</span>
                </div>
            )}
            
            {item.type === 'image' && item.url && (
                <Image
                    src={item.url}
                    fill
                    priority
                    className="object-cover cursor-zoom-in"
                    alt={item.alt || 'Hình ảnh bất động sản'}
                    onLoad={() => setIsLoading(false)}
                    onError={handleError}
                />
            )}

            {item.type === 'youtube' && item.videoId && (
                <div className="absolute inset-0 w-full h-full">
                    <YouTube
                        videoId={item.videoId}
                        opts={opts}
                        className="absolute inset-0 w-full h-full"
                        onReady={() => setIsLoading(false)}
                        onError={handleError}
                    />
                </div>
            )}
        </div>
    );
}

interface MediaCarouselProps {
    mediaItems: MediaItem[];
}

export function MediaCarousel({ mediaItems }: MediaCarouselProps) {
    return (
        <div className="w-full">
            <Carousel className="w-full">
                <CarouselContent>
                    {mediaItems.map((item, index) => (
                        <CarouselItem key={index} className="w-full">
                            <MediaRenderer item={item} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10" />
                <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10" />
            </Carousel>
        </div>
    );
}
