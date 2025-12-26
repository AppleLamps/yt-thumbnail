"use client";

import { useRef, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
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
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAdd(e.target.files);
      e.target.value = ""; // Reset input
    }
  };

  const canAddMore = images.length < maxImages;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reference Images (Optional)</CardTitle>
        <CardDescription>
          Upload up to {maxImages} reference images to guide the AI style
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Upload area */}
          {canAddMore && (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => !disabled && inputRef.current?.click()}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                transition-colors
                ${
                  disabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:border-primary hover:bg-muted/50"
                }
              `}
            >
              <ImagePlus className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Click or drag images here
              </p>
              <p className="text-xs text-muted-foreground mt-1">
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {images.map((image) => (
                <div key={image.id} className="relative group aspect-video">
                  <img
                    src={image.preview}
                    alt="Reference"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onRemove(image.id)}
                    disabled={disabled}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            {images.length} / {maxImages} images
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
