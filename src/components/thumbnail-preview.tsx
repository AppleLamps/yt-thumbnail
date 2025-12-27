"use client";

import { ImageIcon } from "lucide-react";

interface ThumbnailPreviewProps {
  imageUrl: string | null;
  isLoading?: boolean;
}

export function ThumbnailPreview({ imageUrl, isLoading }: ThumbnailPreviewProps) {
  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="flex-1 min-h-0 rounded-2xl overflow-hidden relative flex items-center justify-center bg-muted/20">
        {isLoading ? (
          <div className="w-full h-full bg-muted animate-shimmer" />
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt="Generated thumbnail"
            className="max-w-full max-h-full object-contain animate-fade-in"
          />
        ) : (
          <div className="w-full h-full border-2 border-dashed border-border/40 rounded-2xl flex items-center justify-center bg-muted/10">
            <div className="text-center p-4">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-muted/50 flex items-center justify-center">
                <ImageIcon className="h-6 w-6 text-muted-foreground/40" />
              </div>
              <p className="text-muted-foreground/60 text-sm">Your thumbnail will appear here</p>
            </div>
          </div>
        )}
        {imageUrl && !isLoading && (
          <div className="absolute inset-0 rounded-2xl ring-1 ring-black/5 pointer-events-none" />
        )}
      </div>
    </div>
  );
}
