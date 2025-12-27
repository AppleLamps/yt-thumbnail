"use client";

import { ImageIcon } from "lucide-react";

interface ThumbnailPreviewProps {
  imageUrl: string | null;
  isLoading?: boolean;
}

export function ThumbnailPreview({ imageUrl, isLoading }: ThumbnailPreviewProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground">Preview</h3>
      <div className="aspect-video rounded-2xl overflow-hidden relative">
        {isLoading ? (
          <div className="w-full h-full bg-muted animate-shimmer" />
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt="Generated thumbnail"
            className="w-full h-full object-contain bg-muted/50 animate-fade-in"
          />
        ) : (
          <div className="w-full h-full border-2 border-dashed border-border/60 rounded-2xl flex items-center justify-center bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/80 flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <p className="text-muted-foreground font-medium">Your masterpiece awaits</p>
              <p className="text-sm text-muted-foreground/60 mt-1">
                Describe your vision and hit generate
              </p>
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
