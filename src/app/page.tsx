import { ThumbnailGenerator } from "@/components/thumbnail-generator";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <div className="flex flex-col px-6 py-4 max-w-5xl mx-auto">
        <header className="text-center animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight">
            YouTube Thumbnail Generator
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Describe your video and let AI create a click-worthy thumbnail
          </p>
        </header>

        <ThumbnailGenerator />

        <footer className="text-center py-2">
          <p className="text-xs text-muted-foreground/50">
            Powered by Gemini 2.5 Flash · 1344 × 768
          </p>
        </footer>
      </div>
    </main>
  );
}
