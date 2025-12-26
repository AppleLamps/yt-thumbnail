// Reference image structure
export interface ReferenceImage {
  id: string;
  file: File;
  preview: string; // Object URL for preview
  base64: string; // Base64 data URL for API
}

// API request payload
export interface GenerateRequest {
  prompt: string;
  referenceImages: string[]; // Array of base64 data URLs
}

// API response structure
export interface GenerateResponse {
  success: boolean;
  image?: string; // Base64 data URL
  textContent?: string;
  error?: string;
}

// Application state
export interface GeneratorState {
  prompt: string;
  referenceImages: ReferenceImage[];
  generatedImage: string | null;
  isGenerating: boolean;
  error: string | null;
}
