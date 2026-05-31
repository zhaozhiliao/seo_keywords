"use client";

import { useState } from "react";
import { Sparkles, Eye, EyeOff, Check } from "lucide-react";
import { useAiKeys } from "@/app/context/AiKeysContext";
import { AI_PROVIDERS } from "@/app/lib/ai/providers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AiKeyDialog() {
  const { keys, selectedProvider, setSelectedProvider, setKey, hasActiveKey } = useAiKeys();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(selectedProvider);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [showKey, setShowKey] = useState(false);

  const provider = AI_PROVIDERS.find((p) => p.id === tab) ?? AI_PROVIDERS[0];
  const draftValue = draft[tab] ?? keys[tab] ?? "";

  function handleOpenChange(v: boolean) {
    if (v) {
      setTab(selectedProvider);
      setDraft({ ...keys });
    } else {
      setShowKey(false);
    }
    setOpen(v);
  }

  function save() {
    AI_PROVIDERS.forEach((p) => {
      if (draft[p.id] !== undefined) setKey(p.id, draft[p.id]);
    });
    setSelectedProvider(tab);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={<Button variant={hasActiveKey ? "outline" : "default"} size="sm" className="gap-2" />}
      >
        <Sparkles size={14} />
        <span className="text-xs">AI 设置</span>
        <span
          className={`h-1.5 w-1.5 rounded-full ${hasActiveKey ? "bg-emerald-500" : "bg-amber-400 animate-pulse"}`}
        />
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader className="-mx-5 border-b border-border/60 px-5 pb-4">
          <DialogTitle>AI 模型设置</DialogTitle>
          <DialogDescription>
            API Key 仅缓存在本地浏览器中，不会上传服务器。用于 Slug 生成、UI 翻译等需要 AI 的工具。
          </DialogDescription>
        </DialogHeader>

        {/* Provider tabs (extensible — more providers in the future) */}
        <div className="flex flex-wrap gap-1.5">
          {AI_PROVIDERS.map((p) => {
            const active = p.id === tab;
            const configured = !!keys[p.id];
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setTab(p.id)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {p.name}
                {configured && (
                  <Check size={12} className={active ? "" : "text-emerald-500"} />
                )}
              </button>
            );
          })}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="ai-key">{provider.name} API Key</Label>
            <a
              href={provider.keysUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              获取 Key
            </a>
          </div>
          <div className="relative">
            <Input
              id="ai-key"
              type={showKey ? "text" : "password"}
              value={draftValue}
              onChange={(e) => setDraft((d) => ({ ...d, [tab]: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && save()}
              placeholder={provider.keyPlaceholder}
              className="pr-10 font-mono"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowKey((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            >
              {showKey ? <Eye size={15} /> : <EyeOff size={15} />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            可用模型：{provider.models.map((m) => m.id).join("、")}
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          {keys[tab] && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setKey(tab, "");
                setDraft((d) => ({ ...d, [tab]: "" }));
              }}
              className="mr-auto text-destructive hover:text-destructive"
            >
              清除 Key
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button size="sm" onClick={save} disabled={!draftValue.trim()}>
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
