"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { downloadImage } from "@/lib/image-utils";

interface DownloadButtonProps {
  imageUrl: string | null;
}

export function DownloadButton({ imageUrl }: DownloadButtonProps) {
  const handleDownload = () => {
    if (imageUrl) {
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/[:]/g, "-");
      downloadImage(imageUrl, `youtube-thumbnail-${timestamp}.png`);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={!imageUrl}
      variant="outline"
      size="lg"
      className="w-full rounded-xl border-border/60 hover:bg-muted/50 hover:border-primary/30 disabled:opacity-40"
    >
      <Download className="mr-2 h-5 w-5" />
      Download Thumbnail
    </Button>
  );
}
