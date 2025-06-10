"use client"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, type CarouselApi } from "@/components/ui/carousel";
import { Image as ImageType } from "@/db/schema";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export default function PostCarousel({ images }: { images: ImageType[] }) {
    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (!api) {
            return
        }

        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap())

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap())
        })

        return () => {
            api.off("select", () => {
                setCurrent(api.selectedScrollSnap())
            })
        };
    }, [api])

    const scrollTo = useCallback(
        (index: number) => api && api.scrollTo(index),
        [api]
    );

    return (
        <div className="relative w-full">
            <Carousel className="w-full" setApi={setApi} opts={{ loop: true }}>
                <CarouselContent>
                    {images.map((image, index) => (
                        <CarouselItem key={index}>
                            <div className="relative w-full aspect-[16/9] overflow-hidden rounded-md">
                                <Image 
                                    src={image.secureUrl} 
                                    alt={image.type || `Image ${index + 1}`}
                                    fill
                                    priority={index === 0}
                                    loading={index === 0 ? "eager" : "lazy"}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                                    className="object-cover"
                                    quality={100}
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10" />
                <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10" />
            </Carousel>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                {Array.from({ length: count }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => scrollTo(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                            index === current 
                                ? "bg-white shadow-lg scale-110" 
                                : "bg-white/60 hover:bg-white/80"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}