"use client";

import { useState, useCallback } from "react";
import type { ReferenceImage, GeneratorState } from "@/types";
import {
  fileToBase64,
  generateId,
  isValidImageFile,
} from "@/lib/image-utils";

const MAX_REFERENCE_IMAGES = 5;

export function useThumbnailGenerator() {
  const [state, setState] = useState<GeneratorState>({
    prompt: "",
    referenceImages: [],
    generatedImage: null,
    isGenerating: false,
    error: null,
  });

  // Update prompt
  const setPrompt = useCallback((prompt: string) => {
    setState((prev) => ({ ...prev, prompt, error: null }));
  }, []);

  // Add reference images
  const addReferenceImages = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);

    // Check if adding would exceed limit
    setState((prev) => {
      if (prev.referenceImages.length + fileArray.length > MAX_REFERENCE_IMAGES) {
        return {
          ...prev,
          error: `Maximum ${MAX_REFERENCE_IMAGES} reference images allowed`,
        };
      }
      return prev;
    });

    const newImages: ReferenceImage[] = [];

    for (const file of fileArray) {
      if (!isValidImageFile(file)) {
        setState((prev) => ({
          ...prev,
          error: "Invalid file type. Use PNG, JPEG, WebP, or GIF.",
        }));
        continue;
      }

      try {
        const base64 = await fileToBase64(file);
        const preview = URL.createObjectURL(file);

        newImages.push({
          id: generateId(),
          file,
          preview,
          base64,
        });
      } catch {
        console.error("Failed to process image:", file.name);
      }
    }

    setState((prev) => ({
      ...prev,
      referenceImages: [...prev.referenceImages, ...newImages].slice(
        0,
        MAX_REFERENCE_IMAGES
      ),
      error: null,
    }));
  }, []);

  // Remove reference image
  const removeReferenceImage = useCallback((id: string) => {
    setState((prev) => {
      const image = prev.referenceImages.find((img) => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.preview);
      }
      return {
        ...prev,
        referenceImages: prev.referenceImages.filter((img) => img.id !== id),
        error: null,
      };
    });
  }, []);

  // Generate thumbnail
  const generateThumbnail = useCallback(async () => {
    if (!state.prompt.trim()) {
      setState((prev) => ({ ...prev, error: "Please enter a prompt" }));
      return;
    }

    setState((prev) => ({ ...prev, isGenerating: true, error: null }));

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: state.prompt,
          referenceImages: state.referenceImages.map((img) => img.base64),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate thumbnail");
      }

      setState((prev) => ({
        ...prev,
        generatedImage: data.image,
        isGenerating: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isGenerating: false,
        error: error instanceof Error ? error.message : "An error occurred",
      }));
    }
  }, [state.prompt, state.referenceImages]);

  // Clear all
  const reset = useCallback(() => {
    state.referenceImages.forEach((img) => URL.revokeObjectURL(img.preview));
    setState({
      prompt: "",
      referenceImages: [],
      generatedImage: null,
      isGenerating: false,
      error: null,
    });
  }, [state.referenceImages]);

  // Clear error
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    setPrompt,
    addReferenceImages,
    removeReferenceImage,
    generateThumbnail,
    reset,
    clearError,
  };
}
