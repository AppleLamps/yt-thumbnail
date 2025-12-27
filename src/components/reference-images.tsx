"use client";

import { useRef, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, ImagePlus } from "lucide-react";
import type { ReferenceImage } from "@/types";

interface ReferenceImagesProps {
  images: ReferenceImage[];
  onAdd: (files: FileList | File[]) => void;
  onRemove: (id: string) => void;
  disabled?: boolean;
  maxImages?: number;
}

export function ReferenceImages({
  images,
  onAdd,
  onRemove,
  disabled,
  maxImages = 5,
}: ReferenceImagesProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        onAdd(files);
      }
    },
    [disabled, onAdd]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAdd(e.target.files);
      e.target.value = "";
    }
  };

  const canAddMore = images.length < maxImages;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          Style References
          <span className="text-muted-foreground/50 font-normal ml-1">(optional)</span>
        </h3>
        {images.length > 0 && (
          <span className="text-xs text-muted-foreground/60">
            {images.length}/{maxImages}
          </span>
        )}
      </div>

      <div className="space-y-4">
        {/* Upload area */}
        {canAddMore && (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !disabled && inputRef.current?.click()}
            className={`
              border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer
              transition-all duration-200
              ${isDragging
                ? "border-primary bg-primary/5 scale-[1.02]"
                : "border-border/60 hover:border-primary/50 hover:bg-muted/30"
              }
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            <div className={`
              w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center
              transition-colors duration-200
              ${isDragging ? "bg-primary/10" : "bg-muted/60"}
            `}>
              <ImagePlus className={`h-6 w-6 transition-colors ${isDragging ? "text-primary" : "text-muted-foreground/60"}`} />
            </div>
            <p className="text-sm text-muted-foreground">
              Drop images here or click to browse
            </p>
            <p className="text-xs text-muted-foreground/50 mt-1">
              PNG, JPEG, WebP, or GIF
            </p>
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              multiple
              onChange={handleFileSelect}
              disabled={disabled}
              className="hidden"
            />
          </div>
        )}

        {/* Image previews */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {images.map((image) => (
              <div
                key={image.id}
                className="relative group aspect-square animate-fade-in"
              >
                <img
                  src={image.preview}
                  alt="Reference"
                  className="w-full h-full object-cover rounded-xl shadow-sm"
                />
                <div className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/20 transition-colors" />
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-1.5 right-1.5 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white shadow-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(image.id);
                  }}
                  disabled={disabled}
                >
                  <X className="h-3 w-3 text-foreground" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
