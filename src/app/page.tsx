import { ThumbnailGenerator } from "@/components/thumbnail-generator";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">
            YouTube Thumbnail Generator
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Create eye-catching thumbnails for your YouTube videos using AI.
            Describe your vision and optionally upload reference images for
            style guidance.
          </p>
        </header>

        <ThumbnailGenerator />

        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>Powered by Google Gemini 2.5 Flash via OpenRouter</p>
          <p className="mt-1">
            Thumbnail size: 1344 x 768 pixels (16:9 aspect ratio)
          </p>
        </footer>
      </div>
    </main>
  );
}
