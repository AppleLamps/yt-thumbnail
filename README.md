# YouTube Thumbnail Generator

An AI-powered web application that generates professional, high-CTR YouTube thumbnails using Google Gemini 2.5 Flash via OpenRouter.

## Features

- **AI-Powered Generation** - Uses Gemini 2.5 Flash image model optimized for YouTube thumbnails
- **Reference Images** - Upload up to 5 reference images to guide the AI's visual style
- **CTR-Optimized** - Built-in system prompt designed for maximum click-through rate
- **16:9 Output** - Generates thumbnails at 1344x768 pixels, perfect for YouTube
- **Instant Download** - Download generated thumbnails as PNG files
- **Drag & Drop** - Easy image upload with drag-and-drop support

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the example environment file and add your OpenRouter API key:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
OPENROUTER_API_KEY=your_api_key_here
```

Get your API key from [OpenRouter](https://openrouter.ai/keys).

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Enter a prompt** - Describe your thumbnail (topic, style, colors, text overlays)
2. **Add reference images** (optional) - Upload images to guide the AI's style
3. **Generate** - Click the generate button and wait for your thumbnail
4. **Download** - Save your thumbnail as a PNG file

### Prompt Tips

- Be specific about colors, lighting, and mood
- Mention any text you want displayed on the thumbnail
- Describe the subject and their expression/pose
- Reference popular thumbnail styles if desired

**Example prompts:**

- "Gaming video about Minecraft speedrun, shocked face, bold yellow text saying 'WORLD RECORD', dramatic blue lighting"
- "Cooking tutorial for pasta, close-up of steaming dish, warm golden lighting, text 'SECRET RECIPE'"
- "Tech review of new iPhone, product floating with reflections, clean white background, minimalist style"

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **AI Model**: Google Gemini 2.5 Flash Image (via OpenRouter)
- **Language**: TypeScript

## Project Structure

```text
src/
├── app/
│   ├── api/generate/route.ts   # OpenRouter API proxy
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Main page
│   └── globals.css             # Styles
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── thumbnail-generator.tsx # Main container
│   ├── prompt-input.tsx        # Text input
│   ├── reference-images.tsx    # Image upload
│   ├── generate-button.tsx     # Generate action
│   ├── thumbnail-preview.tsx   # Result display
│   └── download-button.tsx     # Download action
├── hooks/
│   └── use-thumbnail-generator.ts
├── lib/
│   ├── utils.ts
│   ├── openrouter.ts
│   └── image-utils.ts
└── types/
    └── index.ts
```

## Environment Variables

| Variable             | Required | Description                              |
|----------------------|----------|------------------------------------------|
| `OPENROUTER_API_KEY` | Yes      | Your OpenRouter API key                  |
| `SITE_URL`           | No       | Your site URL (for OpenRouter analytics) |

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## License

MIT
