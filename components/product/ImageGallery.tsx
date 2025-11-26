'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
  images: string[];
  productName: string;
  discount?: number;
}

export function ImageGallery({ images, productName, discount = 0 }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Se não tiver imagens, mostra placeholder
  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
    );
  }

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div>
      {/* Imagem Principal */}
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 group">
        <Image
          src={images[selectedIndex]}
          alt={`${productName} - Imagem ${selectedIndex + 1}`}
          fill
          className="object-cover"
          priority
        />

        {/* Badge de desconto */}
        {discount > 0 && (
          <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 rounded-full text-sm font-bold">
            -{discount}%
          </div>
        )}

        {/* Setas de navegação */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              aria-label="Imagem anterior"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              aria-label="Próxima imagem"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Contador de imagens */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden transition-all ${
                selectedIndex === index
                  ? 'ring-2 ring-black ring-offset-2'
                  : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-1'
              }`}
            >
              <Image
                src={image}
                alt={`${productName} - Thumbnail ${index + 1}`}
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
