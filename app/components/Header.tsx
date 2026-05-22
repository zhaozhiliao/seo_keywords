"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, Eye, EyeOff } from "lucide-react";
import { useApiKey } from "@/app/context/ApiKeyContext";

export default function Header() {
  const { apiKey, setApiKey, hasKey } = useApiKey();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const preview = apiKey
    ? apiKey.slice(0, 4) + "••••" + apiKey.slice(-4)
    : null;

  function openModal() {
    setInput(apiKey);
    setShowKey(false);
    setSaved(false);
    setOpen(true);
  }

  function save() {
    setApiKey(input);
    setSaved(true);
    setTimeout(() => {
      setOpen(false);
      setSaved(false);
    }, 800);
  }

  function clear() {
    setApiKey("");
    setInput("");
    setOpen(false);
  }

  // Focus input when modal opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-sm">
              <Search size={16} className="text-white" />
            </div>
            <span className="font-bold text-gray-900 text-base tracking-tight">
               SEO <span className="text-indigo-600">关键词检索</span>
            </span>
          </div>

          {/* API Key button */}
          <button
            onClick={openModal}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 border ${
              hasKey
                ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                : "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 animate-pulse"
            }`}
          >
            {hasKey ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="font-mono">{preview}</span>
                <span className="text-emerald-500 hidden sm:inline">✓ 已配置</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                <span>设置 API Key</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Modal backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
            {/* Modal header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  配置 Ahrefs API Key
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Key 存储在您的浏览器本地，查询时临时使用，不会被记录
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100 -mr-1"
              >
                <X size={16} />
              </button>
            </div>

            {/* Input */}
            <div className="relative">
              <input
                ref={inputRef}
                type={showKey ? "text" : "password"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") save(); }}
                placeholder="粘贴您的 Ahrefs API Key…"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm font-mono bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent focus:bg-white transition-all placeholder:font-sans placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                title={showKey ? "隐藏" : "显示"}
              >
                {showKey ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-2 justify-between items-center">
              {hasKey && (
                <button
                  type="button"
                  onClick={clear}
                  className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors font-medium"
                >
                  清除
                </button>
              )}
              <div className="flex gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors font-medium"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={save}
                  disabled={!input.trim()}
                  className={`px-5 py-2 text-sm font-semibold rounded-xl transition-all ${
                    saved
                      ? "bg-emerald-500 text-white"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 disabled:cursor-not-allowed"
                  }`}
                >
                  {saved ? "✓ 已保存" : "保存"}
                </button>
              </div>
            </div>

            {/* Help link */}
            <p className="text-xs text-gray-400 border-t border-gray-100 pt-3">
              前往{" "}
              <a
                href="https://app.ahrefs.com/account/api"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-500 hover:underline"
              >
                Ahrefs API 设置
              </a>{" "}
              获取您的 API Key
            </p>
          </div>
        </div>
      )}
    </>
  );
}
