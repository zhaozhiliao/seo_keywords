"use client";

import { useState } from "react";
import { ChevronDown, List } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

/** Mobile docs nav — trigger bar + bottom sheet with full sidebar tree. */
export function DocsNavDrawer({
  title,
  currentLabel,
  children,
}: {
  title: string;
  currentLabel?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            className="h-10 w-full justify-between gap-2 px-3 font-normal shadow-none"
          />
        }
      >
        <span className="flex min-w-0 items-center gap-2">
          <List size={16} className="shrink-0 text-fg-muted" aria-hidden="true" />
          <span className="truncate text-sm">{currentLabel ?? title}</span>
        </span>
        <span className="flex shrink-0 items-center gap-1 text-xs text-fg-muted">
          {title}
          <ChevronDown size={14} aria-hidden="true" />
        </span>
      </DialogTrigger>

      <DialogContent
        showCloseButton
        className="fixed inset-x-0 bottom-0 top-auto left-0 max-h-[min(85vh,28rem)] w-full max-w-none translate-x-0 translate-y-0 rounded-b-none rounded-t-2xl border-b-0 sm:max-w-none data-open:slide-in-from-bottom data-closed:slide-out-to-bottom"
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-fg-subtle">{title}</p>
        <div
          className="-mx-1 max-h-[min(70vh,24rem)] overflow-y-auto overscroll-contain px-1 pb-1"
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("a[href]")) setOpen(false);
          }}
        >
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
