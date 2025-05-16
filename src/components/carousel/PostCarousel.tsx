"use client"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, type CarouselApi } from "@/components/ui/carousel";
import { Image as ImageType } from "@/db/schema";
import Image from "next/image";
import useCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";

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
                <CarouselContent className="max-h-[62.5rem]">
                    {images.map((image, index) => (
                        <CarouselItem className="flex items-center justify-center max-h-[62.5rem]" key={index}>
                          <Image src={image.secureUrl} alt={image.type || `Image ${index + 1}`} className='min-w-full rounded-md h-auto' width={500} height={1000} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10" />
                <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10" />
            </Carousel>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {Array.from({ length: count }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => scrollTo(index)}
                        className={`w-4 h-4 rounded-full ${index === current ? "bg-gradient-to-r from-yellow-400 to-yellow-300 shadow-md" : "bg-yellow-100 text-black font-bold shadow-md" // Adjusted size and current index comparison
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}