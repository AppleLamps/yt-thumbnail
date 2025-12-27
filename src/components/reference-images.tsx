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
  maxImages = 3,
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
    <div className="space-y-2">
      <label className="text-xs font-medium text-muted-foreground">
        Reference images <span className="text-muted-foreground/50">(optional)</span>
      </label>

      <div className="flex gap-2">
        {/* Image previews */}
        {images.map((image) => (
          <div
            key={image.id}
            className="relative group w-12 h-12 shrink-0 animate-fade-in"
          >
            <img
              src={image.preview}
              alt="Reference"
              className="w-full h-full object-cover rounded-lg"
            />
            <Button
              variant="secondary"
              size="icon"
              className="absolute -top-1 -right-1 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white hover:bg-white shadow-sm rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(image.id);
              }}
              disabled={disabled}
            >
              <X className="h-2.5 w-2.5 text-foreground" />
            </Button>
          </div>
        ))}

        {/* Upload area */}
        {canAddMore && (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !disabled && inputRef.current?.click()}
            className={`
              w-12 h-12 shrink-0 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer
              transition-all duration-200
              ${isDragging
                ? "border-primary bg-primary/5"
                : "border-border/60 hover:border-primary/50 hover:bg-muted/30"
              }
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            <ImagePlus className={`h-5 w-5 ${isDragging ? "text-primary" : "text-muted-foreground/40"}`} />
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
      </div>
    </div>
  );
}
