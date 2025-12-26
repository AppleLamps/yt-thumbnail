// Convert File to base64 data URL
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Download base64 image
export function downloadImage(
  base64Url: string,
  filename: string = "thumbnail.png"
) {
  const link = document.createElement("a");
  link.href = base64Url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Validate image file
export function isValidImageFile(file: File): boolean {
  const validTypes = ["image/png", "image/jpeg", "image/webp", "image/gif"];
  return validTypes.includes(file.type);
}
