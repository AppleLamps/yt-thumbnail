"use client";

import { useThumbnailGenerator } from "@/hooks/use-thumbnail-generator";
import { PromptInput } from "@/components/prompt-input";
import { ReferenceImages } from "@/components/reference-images";
import { GenerateButton } from "@/components/generate-button";
import { ThumbnailPreview } from "@/components/thumbnail-preview";
import { DownloadButton } from "@/components/download-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw } from "lucide-react";

export function ThumbnailGenerator() {
  const {
    prompt,
    referenceImages,
    generatedImage,
    isGenerating,
    error,
    setPrompt,
    addReferenceImages,
    removeReferenceImage,
    generateThumbnail,
    reset,
    clearError,
  } = useThumbnailGenerator();

  return (
    <div className="flex-1 flex flex-col gap-4 min-h-0 py-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="rounded-xl shrink-0">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="ghost" size="sm" onClick={clearError} className="hover:bg-destructive/20">
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Input Row - Compact */}
      <div className="shrink-0 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <PromptInput
            value={prompt}
            onChange={setPrompt}
            disabled={isGenerating}
          />
        </div>
        <div className="sm:w-48 shrink-0">
          <ReferenceImages
            images={referenceImages}
            onAdd={addReferenceImages}
            onRemove={removeReferenceImage}
            disabled={isGenerating}
            maxImages={3}
          />
        </div>
      </div>

      {/* Generate Button Row */}
      <div className="shrink-0 flex gap-3 items-stretch">
        <GenerateButton
          onClick={generateThumbnail}
          isGenerating={isGenerating}
          disabled={!prompt.trim()}
        />
        <Button
          variant="outline"
          onClick={reset}
          disabled={isGenerating}
          className="px-5 rounded-2xl border-border/60 hover:bg-muted/50 hover:border-primary/30"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Thumbnail Preview - Takes remaining space */}
      <div className="flex-1 min-h-0 flex flex-col gap-3">
        <ThumbnailPreview
          imageUrl={generatedImage}
          isLoading={isGenerating}
        />
        <div className="shrink-0">
          <DownloadButton imageUrl={generatedImage} />
        </div>
      </div>
    </div>
  );
}
