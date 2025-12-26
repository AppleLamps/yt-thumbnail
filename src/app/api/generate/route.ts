import { NextRequest, NextResponse } from "next/server";
import type {
  OpenRouterRequest,
  TextContent,
  ImageContent,
} from "@/lib/openrouter";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "google/gemini-2.5-flash-image";

const SYSTEM_PROMPT = `# 1. Operational Directive

You are a specialized visual intelligence engine tasked exclusively with generating high-performance YouTube thumbnails.

* Your Output: You generate images only. Do not respond with conversational text, explanations, or descriptions of the image.
* Your Goal: Maximize Click-Through Rate (CTR). Every image must be designed to stop a user from scrolling by creating immediate intrigue, clarity, or emotional connection.
* Interaction Protocol: Upon receiving a user request, immediately begin image generation. Do not engage in chat.

# 2. Core Design Principles (Internalize These)

Apply these rules automatically to every generation task unless specifically overridden by the user:

* Aspect Ratio: Always generate in 16:9.
* Visual Hierarchy: Establish one dominant focal point (a face, an object, or a massive action). The viewer must understand the image's subject in under 1 second.
* Contrast & Color: Prioritize high-contrast lighting (e.g., rim lighting, dramatic shadows). Use saturated accent colors (yellows, cyans, oranges, bright reds) that pop against YouTube's dark/light mode UI.
* Depth Separation: Use a shallow depth of field. The background should be blurred or simplified to ensure the main subject stands out sharply.
* Mobile Readability: Design for small screens. Avoid clutter. If text is rendered, it must be large, bold, and highly legible.

# 3. Handling User Inputs

## Scenario A: Text-Only Request

When the user provides only a topic or title:

* Conceptualize the Hook: Invent a visual metaphor that represents the most dramatic, surprising, or valuable aspect of the topic.
* Dramatic Composition: Frame the shot dynamically—low angles for power, close-ups for emotion.
* Text Embedding (If requested): If the user specifies text to appear on the image, render it using bold, sans-serif typography. Keep it under 4 words. Use high-contrast colors (e.g., white text with a black stroke/shadow) so it is readable against any background.

## Scenario B: Image + Instruction Request

When the user provides a reference photo(s) and instructions on how to use it:

* Subject Isolation: Identify the primary subject in the provided photo (person or object). Cleanly isolate them from their original background.
* Environmental Retargeting: Place the isolated subject into a new, heightened environment described by the user or implied by the topic.
* Subject Enhancement: Apply professional color grading to the subject to match the new environment. Add rim lighting or a subtle outer glow to make them "pop." Enhance facial expressions to be slightly more intense (joy, shock, focus) if appropriate to the topic.

# 4. Technical & Stylistic Rules

* Style: Default to a "Hyper-realistic, Cinematic Photograph" aesthetic with 8K detail. Avoid cartoonish or painterly styles unless explicitly requested.
* Lighting: Use "studio lighting" or "dramatic golden hour" lighting by default to create depth and professionalism.
* Framing: Ensure the most crucial elements are not placed in the bottom right corner, where the YouTube video timestamp overlays.`;

export async function POST(request: NextRequest) {
  try {
    // Validate API key exists
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { prompt, referenceImages } = body as {
      prompt: string;
      referenceImages: string[];
    };

    // Validate prompt
    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Validate reference images (max 5)
    if (referenceImages && referenceImages.length > 5) {
      return NextResponse.json(
        { error: "Maximum 5 reference images allowed" },
        { status: 400 }
      );
    }

    // Build message content array
    const contentArray: Array<TextContent | ImageContent> = [];

    // Add user prompt
    contentArray.push({
      type: "text",
      text: prompt,
    });

    // Add reference images if provided
    if (referenceImages && referenceImages.length > 0) {
      for (const imageBase64 of referenceImages) {
        contentArray.push({
          type: "image_url",
          image_url: {
            url: imageBase64,
          },
        });
      }
    }

    // Build OpenRouter request
    const openRouterPayload: OpenRouterRequest = {
      model: MODEL,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: contentArray,
        },
      ],
      modalities: ["image", "text"],
      image_config: {
        aspect_ratio: "16:9", // YouTube thumbnail aspect ratio (1344x768)
      },
    };

    // Call OpenRouter API
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.SITE_URL || "http://localhost:3000",
        "X-Title": "YouTube Thumbnail Generator",
      },
      body: JSON.stringify(openRouterPayload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenRouter API error:", errorData);
      return NextResponse.json(
        { error: errorData.error?.message || "Failed to generate image" },
        { status: response.status }
      );
    }

    const result = await response.json();

    // Extract generated image from response
    const message = result.choices?.[0]?.message;
    if (!message?.images || message.images.length === 0) {
      return NextResponse.json(
        { error: "No image was generated. Please try a different prompt." },
        { status: 500 }
      );
    }

    // Return the generated image
    const generatedImageUrl = message.images[0].image_url.url;

    return NextResponse.json({
      success: true,
      image: generatedImageUrl,
      textContent: message.content || null,
    });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
