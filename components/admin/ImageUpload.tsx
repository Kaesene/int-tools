'use client';

import { useState } from 'react';
import Image from 'next/image';
import { uploadImage, deleteImage } from '@/lib/supabase';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export function ImageUpload({ images, onChange, maxImages = 5 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Verifica se não vai exceder o máximo de imagens
    if (images.length + files.length > maxImages) {
      alert(`Você pode adicionar no máximo ${maxImages} imagens`);
      return;
    }

    setUploading(true);
    const newImages: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(`Enviando imagem ${i + 1} de ${files.length}...`);

        // Upload da imagem
        const imageUrl = await uploadImage(file, 'products');
        newImages.push(imageUrl);
      }

      // Adiciona as novas imagens ao array existente
      onChange([...images, ...newImages]);
      setUploadProgress('');
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao fazer upload das imagens. Tente novamente.');
    } finally {
      setUploading(false);
      e.target.value = ''; // Reseta o input
    }
  };

  const handleRemoveImage = async (imageUrl: string) => {
    if (!confirm('Tem certeza que deseja remover esta imagem?')) return;

    try {
      // Remove do Supabase Storage
      await deleteImage(imageUrl);

      // Remove do array de imagens
      onChange(images.filter(img => img !== imageUrl));
    } catch (error) {
      console.error('Erro ao remover imagem:', error);
      alert('Erro ao remover imagem. Tente novamente.');
    }
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= images.length) return;

    // Troca as posições
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Imagens do Produto (máximo {maxImages})
        </label>
        <div className="flex items-center gap-4">
          <label className="cursor-pointer bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed inline-block">
            {uploading ? 'Enviando...' : `Adicionar Imagens (${images.length}/${maxImages})`}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              disabled={uploading || images.length >= maxImages}
              className="hidden"
            />
          </label>
          {uploadProgress && (
            <span className="text-sm text-gray-600">{uploadProgress}</span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          A primeira imagem será a imagem principal do produto
        </p>
      </div>

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {images.map((imageUrl, index) => (
            <div
              key={imageUrl}
              className="relative group border-2 border-gray-200 rounded-lg overflow-hidden aspect-square"
            >
              {/* Image */}
              <Image
                src={imageUrl}
                alt={`Produto ${index + 1}`}
                fill
                className="object-cover"
              />

              {/* Badge "Principal" */}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-black text-white text-xs font-bold px-2 py-1 rounded">
                  Principal
                </div>
              )}

              {/* Controls Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                {/* Move Up */}
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, 'up')}
                    className="bg-white text-black p-2 rounded-full hover:bg-gray-100 transition-colors"
                    title="Mover para esquerda"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(imageUrl)}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  title="Remover imagem"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Move Down */}
                {index < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, 'down')}
                    className="bg-white text-black p-2 rounded-full hover:bg-gray-100 transition-colors"
                    title="Mover para direita"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
