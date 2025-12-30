'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductGalleryProps {
    images: string[];
    title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);

    const nextImage = () => {
        setSelectedImage((prev) => (prev + 1) % images.length);
    };

    const previousImage = () => {
        setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
    };

    if (!images || images.length === 0) {
        return (
            <div className="w-full aspect-square bg-gray-100 rounded-2xl flex items-center justify-center">
                <p className="text-gray-400">No images available</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100 group">
                <Image
                    src={images[selectedImage]}
                    alt={`${title} - View ${selectedImage + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority
                />

                {/* Navigation Arrows (visible on hover or mobile) */}
                {images.length > 1 && (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => { e.stopPropagation(); previousImage(); }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={cn(
                                "relative flex-none w-20 h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer snap-start",
                                selectedImage === index
                                    ? "border-blue-600 ring-2 ring-blue-600/20"
                                    : "border-transparent opacity-70 hover:opacity-100"
                            )}
                        >
                            <Image
                                src={image}
                                alt={`${title} - Thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
