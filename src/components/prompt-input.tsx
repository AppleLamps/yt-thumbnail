"use client";

import { Textarea } from "@/components/ui/textarea";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function PromptInput({ value, onChange, disabled }: PromptInputProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-muted-foreground">
          Video title or description
        </label>
      </div>
      <Textarea
        placeholder="e.g., 'How to make $10k/month' or describe the exact thumbnail you want..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={2}
        className="resize-none rounded-xl border-border/60 bg-card/50 focus:bg-card focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all text-sm placeholder:text-muted-foreground/40"
      />
    </div>
  );
}
