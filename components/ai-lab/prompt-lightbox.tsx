"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { CopyButton } from "./copy-button";
import { cn } from "@/lib/utils";
import type { PromptEntry } from "@/lib/prompts";

/** Enlarged image (left) + prompt text & copy (right). Two nav axes:
    big arrows / ←→ move between prompts; thumbnails / ↑↓ switch images within
    the current prompt. Counters label each axis. */
export function PromptLightbox({
  entries,
  index,
  open,
  onOpenChange,
  onIndexChange,
}: {
  entries: PromptEntry[];
  index: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIndexChange: (index: number) => void;
}) {
  const count = entries.length;
  const multiple = count > 1;
  const entry = entries[index];

  // Which image of the current entry is shown; reset when the entry changes.
  const [imgIndex, setImgIndex] = useState(0);
  useEffect(() => setImgIndex(0), [index, open]);

  const prev = useCallback(
    () => onIndexChange((index - 1 + count) % count),
    [count, index, onIndexChange]
  );
  const next = useCallback(
    () => onIndexChange((index + 1) % count),
    [count, index, onIndexChange]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      const imgs = entries[index]?.images.length ?? 1;
      if (e.key === "ArrowLeft") {
        if (count > 1) prev();
      } else if (e.key === "ArrowRight") {
        if (count > 1) next();
      } else if (e.key === "ArrowUp") {
        if (imgs > 1) {
          e.preventDefault();
          setImgIndex((i) => (i - 1 + imgs) % imgs);
        }
      } else if (e.key === "ArrowDown") {
        if (imgs > 1) {
          e.preventDefault();
          setImgIndex((i) => (i + 1) % imgs);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, count, index, entries, prev, next]);

  if (!entry) return null;

  const images = entry.images;
  const active = images[imgIndex] ?? images[0];
  const label = `Prompt ${entry.id}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[min(96vw,1100px)] overflow-hidden border border-border bg-bg-card p-0 sm:max-w-[min(96vw,1100px)]"
        showCloseButton
      >
        <DialogTitle className="sr-only">{label}</DialogTitle>
        <DialogDescription className="sr-only">{entry.prompt}</DialogDescription>

        <div className="grid max-h-[85vh] md:grid-cols-[1fr_360px]">
          {/* Image pane — viewport height is fixed; image floats inside so nav
              buttons stay put when aspect ratio changes. */}
          <div className="relative flex min-h-[38vh] flex-col bg-bg-subtle md:min-h-[85vh]">
            <div className="relative min-h-0 flex-1">
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <Image
                  src={active}
                  alt={label}
                  width={1600}
                  height={1600}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Prompt counter (entry axis) */}
              {multiple && (
                <span className="absolute top-2 left-2 z-10 rounded-full bg-black/45 px-2 py-0.5 text-[11px] font-medium tabular-nums text-white backdrop-blur-sm">
                  {index + 1} / {count}
                </span>
              )}

              {multiple && (
                <>
                  <button
                    type="button"
                    onClick={prev}
                    aria-label="上一个 prompt"
                    className="absolute top-1/2 left-2 z-10 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-border bg-bg/90 text-fg-muted shadow-sm backdrop-blur-sm transition-all duration-150 hover:border-border-strong hover:bg-bg hover:text-fg active:scale-95 focus-visible:ring-2 focus-visible:ring-ring/25"
                  >
                    <ChevronLeft size={18} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    aria-label="下一个 prompt"
                    className="absolute top-1/2 right-2 z-10 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-border bg-bg/90 text-fg-muted shadow-sm backdrop-blur-sm transition-all duration-150 hover:border-border-strong hover:bg-bg hover:text-fg active:scale-95 focus-visible:ring-2 focus-visible:ring-ring/25"
                  >
                    <ChevronRight size={18} aria-hidden="true" />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex shrink-0 gap-2 overflow-x-auto border-t border-border bg-bg-card/60 p-2.5">
                {images.map((src, i) => (
                  <button
                    key={src + i}
                    type="button"
                    onClick={() => setImgIndex(i)}
                    aria-label={`第 ${i + 1} 张`}
                    className={cn(
                      "relative h-14 w-14 shrink-0 cursor-pointer overflow-hidden rounded-md border transition-all duration-150 active:scale-95",
                      i === imgIndex
                        ? "border-brand ring-2 ring-brand/30 hover:ring-brand/40"
                        : "border-border opacity-80 hover:border-brand/40 hover:opacity-100 hover:ring-2 hover:ring-brand/20"
                    )}
                  >
                    <Image src={src} alt="" fill sizes="56px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Prompt panel */}
          <div className="flex max-h-[43vh] flex-col gap-4 overflow-y-auto p-5 md:max-h-[85vh]">
            <div>
              <div className="flex flex-wrap gap-1.5 pr-8">
                {entry.styles?.map((s) => (
                  <span
                    key={`s-${s}`}
                    className="rounded-full border border-brand/30 bg-brand-soft px-2 py-0.5 text-[11px] font-medium text-brand"
                  >
                    {s}
                  </span>
                ))}
                {entry.models.map((m) => (
                  <span
                    key={`m-${m}`}
                    className="rounded-full bg-bg-inset px-2 py-0.5 text-[11px] font-medium text-fg-muted"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-1 flex-col">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-fg-subtle">Prompt</span>
                <CopyButton value={entry.prompt} iconOnly variant="ghost" label="复制 Prompt" />
              </div>
              <p className="rounded-lg bg-bg-inset p-3 font-mono text-[13px] leading-relaxed whitespace-pre-wrap text-fg">
                {entry.prompt}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
