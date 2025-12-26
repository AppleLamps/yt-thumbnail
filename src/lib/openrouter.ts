// OpenRouter API message content types
export type MessageContent = string | Array<TextContent | ImageContent>;

export interface TextContent {
  type: "text";
  text: string;
}

export interface ImageContent {
  type: "image_url";
  image_url: {
    url: string;
  };
}

// Request payload for OpenRouter
export interface OpenRouterRequest {
  model: string;
  messages: Array<{
    role: "user" | "assistant" | "system";
    content: MessageContent;
  }>;
  modalities: string[];
  image_config?: {
    aspect_ratio: string;
    image_size?: string;
  };
}

// Response structure from OpenRouter
export interface OpenRouterResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
      images?: Array<{
        type: "image_url";
        image_url: {
          url: string;
        };
      }>;
    };
  }>;
  error?: {
    message: string;
    code?: string;
  };
}
