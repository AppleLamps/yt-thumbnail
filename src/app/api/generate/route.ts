import { NextRequest, NextResponse } from "next/server";
import type {
  OpenRouterRequest,
  TextContent,
  ImageContent,
} from "@/lib/openrouter";

// Route segment config - increase body size limit for image uploads
export const maxDuration = 60; // 60 seconds timeout for image generation

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "google/gemini-2.5-flash-image";

/**
 * Enhances user prompts to improve AI understanding of intent.
 * - Detects if input is a video title/topic vs. specific thumbnail description
 * - Wraps short prompts in proper thumbnail generation context
 * - Adds reference image usage instructions when images are provided
 */
function enhancePrompt(userPrompt: string, hasReferenceImages: boolean): string {
  const trimmedPrompt = userPrompt.trim();
  const wordCount = trimmedPrompt.split(/\s+/).length;

  // Patterns that suggest a video title/topic rather than a thumbnail description
  const titlePatterns = [
    /^(how to|why|what|when|where|who|which)/i,
    /^(top \d+|best|worst|\d+ ways|\d+ tips|\d+ things)/i,
    /^(my|our|the) /i,
    /^(review|unboxing|tutorial|guide|explained|vs\.?|versus)/i,
    /^(day \d+|part \d+|episode \d+)/i,
  ];

  const looksLikeTitle = titlePatterns.some(pattern => pattern.test(trimmedPrompt));
  const isShortPrompt = wordCount <= 6;

  // Check if prompt already seems like a detailed description
  const hasDescriptiveWords = /\b(thumbnail|image|picture|visual|design|create|generate|show|featuring|with|background|color|style)\b/i.test(trimmedPrompt);

  let enhanced = trimmedPrompt;

  // If it looks like a video title or is very short, wrap it in context
  if ((looksLikeTitle || isShortPrompt) && !hasDescriptiveWords) {
    enhanced = `Create a compelling YouTube thumbnail for a video titled "${trimmedPrompt}".

The thumbnail should:
- Instantly communicate what the video is about
- Be visually striking and scroll-stopping
- Appeal to viewers interested in this topic
- Use dramatic composition and professional lighting

Design an ORIGINAL creative concept that captures the essence of this video topic.`;
  }

  // Add reference image context when images are provided
  if (hasReferenceImages) {
    enhanced += `

REFERENCE IMAGES PROVIDED - Analyze and determine intent:

1. If the prompt mentions a person, face, "me", "my", or specific subject from the images:
   → Extract that subject from the reference image
   → Place them in a NEW, dynamic YouTube thumbnail composition
   → Apply professional lighting, enhance expressions, and create visual impact
   → The subject should look like they belong in a high-quality thumbnail

2. If the prompt is a video topic/title without specific subject instructions:
   → Use the reference images as STYLE and MOOD inspiration
   → Create an original thumbnail concept for that topic
   → Match the aesthetic, color palette, or artistic style from the references

3. If the prompt asks to "turn this into" or "make this a thumbnail":
   → Transform the provided image into YouTube thumbnail style
   → Add dramatic lighting, enhanced colors, professional composition
   → Keep the core subject but make it scroll-stopping and clickable

Always create a thumbnail that would maximize click-through rate on YouTube.`;
  }

  return enhanced;
}

const SYSTEM_PROMPT = `# YouTube Thumbnail Generation Engine

You generate high-CTR YouTube thumbnails. Output images only—no text responses.

## The 3-Element Rule (MANDATORY)
Every thumbnail MUST contain exactly 3 visual elements in this hierarchy:
1. **FACE/SUBJECT** (40% of frame) - A person with EXAGGERATED emotion, or a compelling main object
2. **CONTEXT/BACKGROUND** - Simple, bold environment that supports the story
3. **TEXT OVERLAY** (if applicable) - Maximum 3-4 words, under 12 characters total

## Emotional Expression (Critical for CTR)
Faces increase CTR by 20-30%. When including people:
- EXAGGERATE expressions: shock (wide eyes, open mouth), excitement, curiosity, disbelief
- Eyes should be making direct contact with the viewer
- Use close-up framing (head and shoulders fill 40-50% of frame)
- Apply "YouTube face" aesthetic: slightly enhanced, dramatic lighting on face

## Color Psychology
Use high-contrast, attention-grabbing palettes:
- **Red + Yellow**: Urgency, excitement, energy (most clickable)
- **Blue + Orange**: Trust with excitement, professional yet dynamic
- **Green + White**: Money, growth, success stories
- **Black + Neon**: Tech, gaming, edgy content
- AVOID: Muted colors, pastels, low-contrast combinations

## Text Overlay Rules
When adding text to thumbnails:
- Maximum 3-4 BOLD words (preferably 1-2)
- Use thick, sans-serif fonts (Impact, Bebas Neue style)
- Add black outline/stroke for readability on any background
- Place text on LEFT or TOP (avoid bottom-right where timestamp appears)
- Text should create curiosity gap or show the benefit

## Composition Techniques
- **Rule of Thirds**: Place subject's eyes on upper third line
- **Asymmetric Balance**: Subject on one side, supporting element on other
- **Depth**: Blur background (f/1.8 - f/2.8 aesthetic), sharp subject
- **Negative Space**: Leave breathing room, don't overcrowd
- **Leading Lines**: Draw eye to the main subject

## Show Transformation/Benefit
Don't just show the topic—show the RESULT or CONTRAST:
- Before/After splits
- Problem → Solution visual
- Small → Big transformations
- Express the "what's in it for me" visually

## Technical Requirements
- Aspect Ratio: 16:9 (1280x720 or 1920x1080 proportions)
- Style: Hyper-realistic, cinematic photograph with professional color grading
- Lighting: Dramatic rim lighting, studio quality, enhanced contrast
- Avoid: Bottom-right corner for key elements (timestamp overlay zone)
- Quality: Sharp, high-resolution, no blur on main subject

## Reference Image Handling
When given reference photos:
1. **Person/Face provided**: Extract and enhance the subject, place in dynamic new environment with exaggerated expression
2. **Style reference**: Match the color grading, composition style, and mood
3. **Transform request**: Keep core subject but add YouTube-optimized enhancements (lighting, contrast, expression boost)`;

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

    // Enhance the prompt based on context
    const hasReferenceImages = referenceImages && referenceImages.length > 0;
    const enhancedPrompt = enhancePrompt(prompt, hasReferenceImages);

    // Add enhanced prompt
    contentArray.push({
      type: "text",
      text: enhancedPrompt,
    });

    // Add reference images if provided
    if (hasReferenceImages) {
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
        "HTTP-Referer":
          process.env.SITE_URL ||
          (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
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
