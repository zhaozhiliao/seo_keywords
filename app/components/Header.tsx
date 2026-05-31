"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Eye, EyeOff } from "lucide-react";
import { useApiKey } from "@/app/context/ApiKeyContext";
import AiKeyDialog from "@/app/components/AiKeyDialog";
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

export default function Header({ showAhrefsKey = false }: { showAhrefsKey?: boolean }) {
  const { apiKey, setApiKey, hasKey } = useApiKey();

  const [input, setInput] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [open, setOpen] = useState(false);

  function handleOpenChange(v: boolean) {
    if (v) setInput(apiKey);
    else setShowKey(false);
    setOpen(v);
  }

  function save() {
    setApiKey(input);
    setOpen(false);
  }

  function clear() {
    setApiKey("");
    setInput("");
    setOpen(false);
  }

  const preview = apiKey ? apiKey.slice(0, 4) + "••••" + apiKey.slice(-4) : null;

  return (
    <header className="sticky top-0 z-30 h-14 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-6xl items-center gap-3 px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-foreground">
            <Search size={12} className="text-background" />
          </div>
          <span className="text-sm font-semibold tracking-tight">SEO Toolkit</span>
        </Link>

        {/* Settings */}
        <div className="ml-auto flex items-center gap-2">
          <AiKeyDialog />
          {showAhrefsKey && (
          <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger
              render={
                <Button
                  variant={hasKey ? "outline" : "default"}
                  size="sm"
                  className="gap-2"
                />
              }
            >
              <span className={`h-1.5 w-1.5 rounded-full ${hasKey ? "bg-emerald-500" : "bg-amber-400 animate-pulse"}`} />
              {hasKey ? (
                <span className="font-mono text-xs">{preview}</span>
              ) : "设置 API Key"}
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader className="-mx-5 border-b border-border/60 px-5 pb-4">
                <DialogTitle>配置 Ahrefs API Key</DialogTitle>
                <DialogDescription>
                  Key 仅存储在浏览器本地，不会上传。前往{" "}
                  <a
                    href="https://app.ahrefs.com/account/api"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 hover:text-foreground transition-colors"
                  >
                    Ahrefs API 设置
                  </a>{" "}
                  获取。
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-2 py-2">
                <Label htmlFor="apikey">API Key</Label>
                <div className="relative">
                  <Input
                    id="apikey"
                    type={showKey ? "text" : "password"}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && save()}
                    placeholder="粘贴您的 Ahrefs API Key…"
                    className="font-mono pr-10"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showKey ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                {hasKey && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clear}
                    className="mr-auto text-destructive hover:text-destructive"
                  >
                    清除 Key
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => setOpen(false)}>取消</Button>
                <Button size="sm" onClick={save} disabled={!input.trim()}>保存</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          )}
        </div>
      </div>
    </header>
  );
}
