"use client";

import { Textarea } from "@/components/ui/textarea";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function PromptInput({ value, onChange, disabled }: PromptInputProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          Describe Your Thumbnail
        </h3>
        {value.length > 0 && (
          <span className="text-xs text-muted-foreground/50">
            {value.length} characters
          </span>
        )}
      </div>
      <Textarea
        placeholder="A vibrant gaming thumbnail with bold colors, an excited person, large text saying 'EPIC WIN', dramatic lighting..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={4}
        className="resize-none rounded-xl border-border/60 bg-card/50 focus:bg-card focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all text-base placeholder:text-muted-foreground/40"
      />
      <p className="text-xs text-muted-foreground/60 italic">
        Include colors, text, expressions, and mood for best results
      </p>
    </div>
  );
}
