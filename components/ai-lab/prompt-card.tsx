"use client";

import Image from "next/image";
import { Maximize2, Images as ImagesIcon } from "lucide-react";
import { CopyButton } from "./copy-button";
import type { PromptEntry } from "@/lib/prompts";

/** Masonry gallery card: cover image (click to zoom) + model/style tags +
    quick copy. A stacked badge marks entries with multiple images. */
export function PromptCard({ entry, onOpen }: { entry: PromptEntry; onOpen: () => void }) {
  const cover = entry.images[0];
  const extra = entry.images.length - 1;
  const label = `Prompt ${entry.id}`;

  return (
    <div className="group mb-4 break-inside-avoid overflow-hidden rounded-xl border border-border bg-bg-card shadow-sm">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`查看大图：${label}`}
        className="relative block w-full cursor-pointer overflow-hidden transition-colors after:pointer-events-none after:absolute after:inset-0 after:bg-black/0 after:transition-colors hover:after:bg-black/[0.02] focus-visible:ring-2 focus-visible:ring-ring/25 focus-visible:outline-none"
        style={{ aspectRatio: "1 / 1" }}
      >
        <Image
          src={cover}
          alt={label}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
        />
        {extra > 0 && (
          <span className="pointer-events-none absolute top-2 left-2 flex items-center gap-1 rounded-md bg-black/45 px-1.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
            <ImagesIcon size={12} aria-hidden="true" />
            {entry.images.length}
          </span>
        )}
        <span className="pointer-events-none absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-md bg-black/35 text-white opacity-0 backdrop-blur-sm transition-all duration-150 group-hover:scale-105 group-hover:bg-black/45 group-hover:opacity-100">
          <Maximize2 size={14} aria-hidden="true" />
        </span>
      </button>

      <div className="px-3 py-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 flex-wrap items-center gap-1">
            {entry.styles?.map((s) => (
              <span
                key={`s-${s}`}
                className="rounded-full border border-brand/30 bg-brand-soft px-2 py-0.5 text-[11px] font-medium text-brand"
              >
                {s}
              </span>
            ))}
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-1">
            {entry.models.map((m) => (
              <span
                key={`m-${m}`}
                className="rounded-full bg-bg-subtle px-2 py-0.5 text-[11px] font-medium text-fg-muted"
              >
                {m}
              </span>
            ))}
            <CopyButton
              value={entry.prompt}
              iconOnly
              variant="ghost"
              label="复制 Prompt"
              className="-mr-1 shrink-0 hover:bg-bg-subtle hover:text-brand"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
