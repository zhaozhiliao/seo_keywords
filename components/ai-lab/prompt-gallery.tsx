"use client";

import { useMemo, useState } from "react";
import { PromptCard } from "./prompt-card";
import { PromptLightbox } from "./prompt-lightbox";
import type { PromptEntry } from "@/lib/prompts";
import { cn } from "@/lib/utils";

const ALL = "全部";

/** Two filter rows (model + style) + masonry grid + lightbox. The lightbox
    navigates within the currently filtered list. */
export function PromptGallery({
  prompts,
  models,
  styles,
}: {
  prompts: PromptEntry[];
  models: string[];
  styles: string[];
}) {
  const [model, setModel] = useState<string>(ALL);
  const [style, setStyle] = useState<string>(ALL);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const filtered = useMemo(
    () =>
      prompts.filter(
        (p) =>
          (model === ALL || p.models.includes(model)) &&
          (style === ALL || (p.styles ?? []).includes(style))
      ),
    [prompts, model, style]
  );

  const openAt = (i: number) => {
    setIndex(i);
    setOpen(true);
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-3">
        <FilterRow label="模型" options={models} active={model} onChange={setModel} />
        {styles.length > 0 && (
          <FilterRow label="风格" options={styles} active={style} onChange={setStyle} />
        )}
      </div>

      {filtered.length ? (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
          {filtered.map((entry, i) => (
            <PromptCard key={entry.id} entry={entry} onOpen={() => openAt(i)} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-fg-muted">没有匹配的 prompt，换个筛选条件试试。</p>
      )}

      <PromptLightbox
        entries={filtered}
        index={index}
        open={open}
        onOpenChange={setOpen}
        onIndexChange={setIndex}
      />
    </>
  );
}

function FilterRow({
  label,
  options,
  active,
  onChange,
}: {
  label: string;
  options: string[];
  active: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-8 shrink-0 text-xs font-medium text-fg-subtle">{label}</span>
      {[ALL, ...options].map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            "cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-all duration-150 active:scale-[0.98]",
            active === opt
              ? "border-brand bg-brand text-white hover:bg-brand/85 hover:border-brand/85"
              : "border-border bg-bg text-fg-muted hover:border-border-strong hover:bg-bg-subtle hover:text-fg"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
