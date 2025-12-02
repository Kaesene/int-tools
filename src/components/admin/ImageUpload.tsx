'use client'

import { useState, useRef } from 'react'
import { uploadImage } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { FiUpload, FiX, FiImage } from 'react-icons/fi'

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
}

export function ImageUpload({ images, onImagesChange, maxImages = 5 }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (images.length + files.length > maxImages) {
      setUploadError(`Máximo de ${maxImages} imagens permitidas`)
      return
    }

    setIsUploading(true)
    setUploadError('')

    try {
      const uploadPromises = Array.from(files).map(file => uploadImage(file, 'products'))
      const urls = await Promise.all(uploadPromises)
      onImagesChange([...images, ...urls])
    } catch (error) {
      console.error('Upload error:', error)
      setUploadError('Erro ao fazer upload das imagens')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || images.length >= maxImages}
            className="cursor-pointer"
          >
            <FiUpload size={18} className="mr-2" />
            {isUploading ? 'Enviando...' : 'Adicionar Imagens'}
          </Button>
        </label>
        <span className="text-sm text-gray-500">
          {images.length}/{maxImages} imagens
        </span>
      </div>

      {uploadError && (
        <p className="text-sm text-red-600">{uploadError}</p>
      )}

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg border-2 border-gray-200 overflow-hidden bg-gray-50">
                <img
                  src={url}
                  alt={`Imagem ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <FiX size={16} />
              </button>
              {index === 0 && (
                <div className="absolute bottom-2 left-2 bg-primary-500 text-white text-xs px-2 py-1 rounded">
                  Principal
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <FiImage className="mx-auto text-gray-400 mb-3" size={48} />
          <p className="text-gray-600 mb-2">Nenhuma imagem adicionada</p>
          <p className="text-sm text-gray-500">
            Clique em "Adicionar Imagens" para fazer upload
          </p>
        </div>
      )}
    </div>
  )
}
