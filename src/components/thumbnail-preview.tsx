"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageIcon } from "lucide-react";

interface ThumbnailPreviewProps {
  imageUrl: string | null;
  isLoading?: boolean;
}

export function ThumbnailPreview({ imageUrl, isLoading }: ThumbnailPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Generated Thumbnail</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
          {isLoading ? (
            <Skeleton className="w-full h-full" />
          ) : imageUrl ? (
            <img
              src={imageUrl}
              alt="Generated thumbnail"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-center text-muted-foreground p-8">
              <ImageIcon className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>Your generated thumbnail will appear here</p>
              <p className="text-sm mt-2">1344 x 768 pixels (16:9)</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
