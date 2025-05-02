'use client'

import { useState } from 'react'
import Image from 'next/image'
import { photos } from '@/data/photos'
import { IoCloseOutline } from 'react-icons/io5'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

export default function GaleriaPage() {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)

  const openPhotoModal = (id: number) => {
    setSelectedPhoto(id)
    // Prevenir o scroll da página quando o modal está aberto
    document.body.style.overflow = 'hidden'
  }

  const closePhotoModal = () => {
    setSelectedPhoto(null)
    // Reativar o scroll da página quando o modal é fechado
    document.body.style.overflow = 'auto'
  }

  const navigatePhoto = (direction: 'prev' | 'next') => {
    if (selectedPhoto === null) return

    const currentIndex = photos.findIndex(photo => photo.id === selectedPhoto)
    let newIndex

    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : photos.length - 1
    } else {
      newIndex = currentIndex < photos.length - 1 ? currentIndex + 1 : 0
    }

    setSelectedPhoto(photos[newIndex].id)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (selectedPhoto === null) return

    if (e.key === 'Escape') {
      closePhotoModal()
    } else if (e.key === 'ArrowLeft') {
      navigatePhoto('prev')
    } else if (e.key === 'ArrowRight') {
      navigatePhoto('next')
    }
  }

  return (
    <div className="py-16 px-4 wedding-container" onKeyDown={handleKeyDown} tabIndex={0}>
      <h1 className="text-3xl md:text-4xl text-center mb-4 font-light">Nossa Galeria</h1>
      <p className="text-center text-wedding-accent mb-12 max-w-2xl mx-auto">
        Momentos especiais que compartilhamos juntos ao longo da nossa jornada de amor.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map(photo => (
          <div
            key={photo.id}
            className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
            onClick={() => openPhotoModal(photo.id)}>
            <Image
              src={photo.url}
              alt={photo.description}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
              <p className="text-white p-4 text-sm">{photo.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Photo Modal */}
      {selectedPhoto !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            className="absolute top-4 right-4 text-white hover:text-wedding-primary transition-colors z-10"
            onClick={closePhotoModal}>
            <IoCloseOutline size={32} />
          </button>

          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-wedding-primary transition-colors z-10"
            onClick={() => navigatePhoto('prev')}>
            <FaChevronLeft size={28} />
          </button>

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-wedding-primary transition-colors z-10"
            onClick={() => navigatePhoto('next')}>
            <FaChevronRight size={28} />
          </button>

          <div className="relative w-full max-w-4xl max-h-[80vh] flex items-center justify-center">
            {photos
              .filter(photo => photo.id === selectedPhoto)
              .map(photo => (
                <div key={photo.id} className="w-full h-full">
                  <div className="relative w-full h-full max-h-[70vh]">
                    <Image src={photo.url} alt={photo.description} fill sizes="100vw" className="object-contain" />
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-white text-lg">{photo.description}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
