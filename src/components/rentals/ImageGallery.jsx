import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

export default function ImageGallery({ images, apartmentTitle }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const openGallery = (index) => {
    setSelectedIndex(index);
    setIsOpen(true);
  };

  const closeGallery = () => {
    setIsOpen(false);
    setSelectedIndex(null);
  };

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setZoom(1);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.5, 1));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (!images || images.length === 0) return null;

  return (
    <>
      {/* Thumbnail Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((img, idx) => (
          <div
            key={idx}
            onClick={() => openGallery(idx)}
            className="relative group cursor-pointer overflow-hidden rounded-xl aspect-video"
          >
            <img
              src={img}
              alt={`${apartmentTitle} ${idx + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
              <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {idx === 0 && images.length > 1 && (
              <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                1/{images.length}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-7xl max-h-[95vh] p-0 bg-black/95">
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute top-4 right-4 z-50 flex gap-2">
              <Button
                onClick={handleZoomOut}
                disabled={zoom <= 1}
                className="bg-white/10 hover:bg-white/20 text-white"
                size="icon"
              >
                <ZoomOut className="w-5 h-5" />
              </Button>
              <Button
                onClick={handleZoomIn}
                disabled={zoom >= 3}
                className="bg-white/10 hover:bg-white/20 text-white"
                size="icon"
              >
                <ZoomIn className="w-5 h-5" />
              </Button>
              <Button
                onClick={toggleFullscreen}
                className="bg-white/10 hover:bg-white/20 text-white"
                size="icon"
              >
                <Maximize2 className="w-5 h-5" />
              </Button>
              <Button
                onClick={closeGallery}
                className="bg-white/10 hover:bg-white/20 text-white"
                size="icon"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            {images.length > 1 && (
              <>
                <Button
                  onClick={goToPrevious}
                  className="absolute left-4 z-50 bg-white/10 hover:bg-white/20 text-white"
                  size="icon"
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  onClick={goToNext}
                  className="absolute right-4 z-50 bg-white/10 hover:bg-white/20 text-white"
                  size="icon"
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </>
            )}

            <div className="w-full h-full p-12 flex items-center justify-center overflow-auto">
              <img
                src={images[selectedIndex]}
                alt={`${apartmentTitle} ${selectedIndex + 1}`}
                className="max-w-full max-h-full object-contain transition-transform duration-300"
                style={{ transform: `scale(${zoom})` }}
              />
            </div>

            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
                {selectedIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}