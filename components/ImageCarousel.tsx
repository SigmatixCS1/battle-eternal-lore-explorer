'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ImageCarouselProps {
  images: string[];
  alt: string;
  className?: string;
  priority?: boolean;
}

export default function ImageCarousel({ images, alt, className = '', priority = false }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-full">
      {images.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={image}
            alt={`${alt} - Image ${index + 1}`}
            fill
            className={className}
            priority={priority && index === 0}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ))}
      
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-purple-500 w-6' 
                  : 'bg-gray-400 hover:bg-gray-300'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
