"use client";

import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function PromptInput({ value, onChange, disabled }: PromptInputProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Describe Your Thumbnail</CardTitle>
        <CardDescription>
          Be specific about colors, text, subjects, mood, and style
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Example: A vibrant gaming thumbnail with bold red and black colors, featuring an excited person with surprised expression, large yellow text saying 'EPIC WIN', dramatic lighting, high contrast..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          rows={5}
          className="resize-none"
        />
        <div className="mt-2 text-xs text-muted-foreground">
          <strong>Tips:</strong> Include specific colors, text overlays,
          expressions, background style, and overall mood for best results.
        </div>
      </CardContent>
    </Card>
  );
}
