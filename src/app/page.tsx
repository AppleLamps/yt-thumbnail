import { ThumbnailGenerator } from "@/components/thumbnail-generator";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <div className="container mx-auto max-w-6xl py-12 px-6">
        <header className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            YouTube Thumbnail Generator
          </h1>
          <p className="text-muted-foreground mt-4 text-lg max-w-xl mx-auto leading-relaxed">
            Create stunning thumbnails with AI. Describe your vision and watch it come to life.
          </p>
        </header>

        <ThumbnailGenerator />

        <footer className="mt-20 text-center">
          <p className="text-xs text-muted-foreground/60">
            Powered by Google Gemini 2.5 Flash · 1344 × 768 pixels
          </p>
        </footer>
      </div>
    </main>
  );
}
