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
    <div className="space-y-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="rounded-xl">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="ghost" size="sm" onClick={clearError} className="hover:bg-destructive/20">
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Left Column - Inputs */}
        <div className="space-y-8">
          <PromptInput
            value={prompt}
            onChange={setPrompt}
            disabled={isGenerating}
          />

          <ReferenceImages
            images={referenceImages}
            onAdd={addReferenceImages}
            onRemove={removeReferenceImage}
            disabled={isGenerating}
          />

          <div className="flex gap-3">
            <GenerateButton
              onClick={generateThumbnail}
              isGenerating={isGenerating}
              disabled={!prompt.trim()}
            />
            <Button
              variant="outline"
              size="lg"
              onClick={reset}
              disabled={isGenerating}
              className="px-4 rounded-2xl border-border/60 hover:bg-muted/50 hover:border-primary/30"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Right Column - Preview */}
        <div className="space-y-4">
          <ThumbnailPreview
            imageUrl={generatedImage}
            isLoading={isGenerating}
          />

          <DownloadButton imageUrl={generatedImage} />
        </div>
      </div>
    </div>
  );
}
