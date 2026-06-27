"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Copy-to-clipboard button with a transient "已复制" state. Stops click
    propagation so it can live inside clickable cards. */
export function CopyButton({
  value,
  label = "复制 Prompt",
  copiedLabel = "已复制",
  iconOnly = false,
  size = "sm",
  variant = "outline",
  className,
}: {
  value: string;
  label?: string;
  copiedLabel?: string;
  iconOnly?: boolean;
  size?: "sm" | "default";
  variant?: "outline" | "default" | "ghost" | "secondary";
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function onCopy(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — no-op */
    }
  }

  const Icon = copied ? Check : Copy;

  return (
    <Button
      type="button"
      variant={variant}
      size={iconOnly ? "icon-sm" : size}
      onClick={onCopy}
      aria-label={iconOnly ? (copied ? copiedLabel : label) : undefined}
      className={cn(
        !iconOnly && "gap-1.5",
        copied && "text-success hover:text-success",
        "transition-all duration-150",
        className
      )}
    >
      <Icon size={14} aria-hidden="true" />
      {!iconOnly && <span>{copied ? copiedLabel : label}</span>}
    </Button>
  );
}
