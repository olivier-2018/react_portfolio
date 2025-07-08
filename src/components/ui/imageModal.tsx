import React, { useEffect, useRef } from "react";

export interface ImageModalProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, imageSrc, onClose }) => {
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (imageRef.current && !imageRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div ref={imageRef} className="relative">
        {/* Close button inside image corner */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-2xl font-bold bg-black/50 rounded-full px-2"
          aria-label="Close"
        >
          &times;
        </button>
        <img
          src={imageSrc}
          alt="Magnified"
          className="max-w-[90vw] max-h-[90vh] object-contain"
        />
      </div>
    </div>
  );
};

export  { ImageModal };
