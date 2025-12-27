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
      className="flex-1 h-10 font-medium rounded-xl bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.01] active:scale-[0.99] disabled:hover:scale-100 disabled:shadow-none"
    >
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Generate
        </>
      )}
    </Button>
  );
}
