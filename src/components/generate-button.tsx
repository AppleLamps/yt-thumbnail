"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";

interface GenerateButtonProps {
  onClick: () => void;
  isGenerating: boolean;
  disabled?: boolean;
}

export function GenerateButton({
  onClick,
  isGenerating,
  disabled,
}: GenerateButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || isGenerating}
      size="lg"
      className="w-full"
    >
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Generating Thumbnail...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-5 w-5" />
          Generate Thumbnail
        </>
      )}
    </Button>
  );
}
