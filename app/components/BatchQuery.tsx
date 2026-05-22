"use client";

import { useRef, useState, useEffect } from "react";
import { Upload, Download, Zap, LayoutGrid, Settings2, Languages, Globe, Info, UploadCloud } from "lucide-react";
import CountrySelector from "./CountrySelector";
import LanguageSelector from "./LanguageSelector";
import LangMappingPanel from "./LangMappingPanel";
import PivotTable, { type BatchRow } from "./PivotTable";
import { DEFAULT_COUNTRIES, COUNTRY_MAP } from "@/app/lib/countries";
import { DEFAULT_LANGS, LANG_MAP, ALL_LANGS } from "@/app/lib/languages";
import type { LangVolumes } from "@/app/lib/ahrefs";
import { useApiKey } from "@/app/context/ApiKeyContext";

type MatchMode = "smart" | "full";
type PanelType = "lang" | "country" | "mapping" | null;

const LS_OVERRIDES_KEY = "ahrefs_lang_overrides";

function detectLangsFromRow(row: Record<string, string>): string[] {
  return Object.keys(row)
    .filter((k) => k.startsWith("keyword_"))
    .map((k) => k.slice(8))
    .filter((lang) => ALL_LANGS.includes(lang));
}

async function downloadTemplateCsv(langs: string[]) {
  const headers = langs.map((l) => `keyword_${l}`);
  const sampleValues: Record<string, string> = {
    en: "seo tool", fr: "outil seo", ar: "أداة سيو", ru: "инструмент seo",
    es: "herramienta seo", de: "SEO-Tool", pt: "ferramenta seo",
    it: "strumento seo", ja: "SEOツール", ko: "SEO 도구",
  };
  const sampleRow = langs.map((l) => sampleValues[l] ?? `keyword_${l}_sample`);
  const csv = [headers, sampleRow].map((r) => r.map((c) => `"${c}"`).join(",")).join("\r\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "ahrefs_keyword_template.csv";
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

async function downloadTemplateXlsx(langs: string[]) {
  const XLSX = await import("xlsx");
  const headers = langs.map((l) => `keyword_${l}`);
  const sampleValues: Record<string, string> = {
    en: "seo tool", fr: "outil seo", ar: "أداة سيو", ru: "инструмент seo",
    es: "herramienta seo", de: "SEO-Tool", pt: "ferramenta seo",
    it: "strumento seo", ja: "SEOツール", ko: "SEO 도구",
  };
  const sample = [Object.fromEntries(langs.map((l) => [`keyword_${l}`, sampleValues[l] ?? ""]))];
  const ws = XLSX.utils.json_to_sheet(sample, { header: headers });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Template");
  XLSX.writeFile(wb, "ahrefs_keyword_template.xlsx");
}

async function parseFile(file: File): Promise<Record<string, string>[]> {
  const XLSX = await import("xlsx");
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json<Record<string, string>>(ws, { defval: "" });
}

async function exportToExcel(
  rows: BatchRow[], countries: string[], langs: string[],
  matchMode: MatchMode, overrides: Record<string, string>
) {
  const XLSX = await import("xlsx");
  const langHeaders = langs.map((l) => `keyword_${l}`);
  let headers: string[];
  let data: Record<string, string | number>[];

  if (matchMode === "full") {
    const cols = countries.flatMap((c) => langs.map((lang) => `${COUNTRY_MAP[c]?.name ?? c}(${c})·${lang}`));
    headers = [...langHeaders, ...cols];
    data = rows.map((row) => {
      const base: Record<string, string | number> = {};
      for (const l of langs) base[`keyword_${l}`] = row.keywords[l] ?? "";
      for (const c of countries)
        for (const lang of langs)
          base[`${COUNTRY_MAP[c]?.name ?? c}(${c})·${lang}`] = row.lang_volumes[lang]?.[c] ?? "";
      return base;
    });
  } else {
    headers = [...langHeaders, ...countries.map((c) => `${COUNTRY_MAP[c]?.name ?? c}(${c})`)];
    data = rows.map((row) => {
      const base: Record<string, string | number> = {};
      for (const l of langs) base[`keyword_${l}`] = row.keywords[l] ?? "";
      for (const c of countries) {
        const eLang = overrides[c] ?? COUNTRY_MAP[c]?.lang ?? "en";
        base[`${COUNTRY_MAP[c]?.name ?? c}(${c})`] = row.lang_volumes[eLang]?.[c] ?? "";
      }
      return base;
    });
  }
  const ws = XLSX.utils.json_to_sheet(data, { header: headers });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Results");
  XLSX.writeFile(wb, matchMode === "full" ? "ahrefs_batch_results_full.xlsx" : "ahrefs_batch_results.xlsx");
}

export default function BatchQuery() {
  const { apiKey, hasKey } = useApiKey();
  const [selectedCountries, setSelectedCountries] = useState<string[]>(DEFAULT_COUNTRIES);
  const [selectedLangs, setSelectedLangs] = useState<string[]>(DEFAULT_LANGS);
  const [openPanel, setOpenPanel] = useState<PanelType>(null);
  const [focusCountry, setFocusCountry] = useState<string | undefined>(undefined);
  const [rows, setRows] = useState<BatchRow[]>([]);
  const [queryLangs, setQueryLangs] = useState<string[]>(DEFAULT_LANGS);
  const [langOverrides, setLangOverrides] = useState<Record<string, string>>({});
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matchMode, setMatchMode] = useState<MatchMode>("smart");
  const [detectedNote, setDetectedNote] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_OVERRIDES_KEY);
      if (stored) setLangOverrides(JSON.parse(stored));
    } catch {}
  }, []);

  function saveOverrides(next: Record<string, string>) {
    setLangOverrides(next);
    try { localStorage.setItem(LS_OVERRIDES_KEY, JSON.stringify(next)); } catch {}
  }

  function handleOverride(country: string, lang: string) { saveOverrides({ ...langOverrides, [country]: lang }); }
  function handleReset(country: string) { const n = { ...langOverrides }; delete n[country]; saveOverrides(n); }
  function handleResetAll() { saveOverrides({}); }

  function handleEditMapping(country: string) {
    setFocusCountry(country);
    setOpenPanel("mapping");
    setTimeout(() => {
      document.getElementById(`mapping-${country}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 120);
  }

  function togglePanel(panel: PanelType) {
    setOpenPanel((prev) => { if (prev === panel) return null; setFocusCountry(undefined); return panel; });
  }

  async function handleFileAndRun(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null); setRows([]); setProgress(null); setDetectedNote(null);
    let parsed: Record<string, string>[];
    try { parsed = await parseFile(file); }
    catch (err) { setError("文件解析失败: " + String(err)); return; }
    if (!parsed.length) { setError("文件中没有数据行"); return; }
    const fileLangs = detectLangsFromRow(parsed[0]);
    const effectiveLangs = fileLangs.length > 0 ? fileLangs : selectedLangs;
    if (fileLangs.length > 0) {
      setDetectedNote(`自动检测到文件语言：${fileLangs.map((l) => LANG_MAP[l]?.name ?? l).join("、")}`);
    }
    setQueryLangs(effectiveLangs);
    runBatch(parsed, effectiveLangs);
  }

  async function runBatch(inputRows: Record<string, string>[], langs: string[]) {
    setRunning(true);
    setProgress({ done: 0, total: inputRows.length });
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const res = await fetch("/api/batch-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-ahrefs-key": apiKey },
        body: JSON.stringify({ rows: inputRows, langs }),
        signal: ctrl.signal,
      });
      if (!res.body) throw new Error("No response body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      const collected: BatchRow[] = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const parts = buf.split("\n\n");
        buf = parts.pop() ?? "";
        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith("data:")) continue;
          const payload = JSON.parse(line.slice(5).trim());
          if (payload.done) { setRows([...collected]); setProgress((p) => ({ done: p?.total ?? 0, total: p?.total ?? 0 })); break; }
          collected.push({ keywords: payload.keywords, lang_volumes: payload.lang_volumes as LangVolumes, error: payload.error });
          setRows([...collected]);
          setProgress({ done: payload.index + 1, total: payload.total });
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") setError("批量查询失败: " + String(err));
    } finally {
      setRunning(false); abortRef.current = null;
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const pct = progress && progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;
  const overrideCount = Object.keys(langOverrides).length;

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Card header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-gray-900">批量关键词查询</h2>
        <div className="flex items-center gap-2">
          {rows.length > 0 && (
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{rows.length} 条结果</span>
          )}
          {overrideCount > 0 && matchMode === "smart" && (
            <span className="text-xs text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
              {overrideCount} 个自定义映射
            </span>
          )}
        </div>
      </div>

      <div className="p-6 space-y-3">

        {/* ── Row 1: Action buttons ── */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Template group */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-400 mr-0.5">下载模板:</span>
            <button type="button" onClick={() => downloadTemplateCsv(selectedLangs)}
              className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600">
              CSV
            </button>
            <button type="button" onClick={() => downloadTemplateXlsx(selectedLangs)}
              className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600">
              Excel
            </button>
          </div>

          <div className="w-px h-5 bg-gray-200" />

          {/* Upload */}
          <label className={`px-4 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-all flex items-center gap-1.5 ${
            hasKey && !running ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}>
            <Upload size={13} />
            上传文件并开始
            <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden"
              onChange={handleFileAndRun} disabled={running || !hasKey} />
          </label>

          {running && (
            <button type="button" onClick={() => abortRef.current?.abort()}
              className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />停止
            </button>
          )}

          {rows.length > 0 && !running && (
            <button type="button" onClick={() => exportToExcel(rows, selectedCountries, queryLangs, matchMode, langOverrides)}
              className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1.5">
              <Download size={13} />
              导出 Excel
            </button>
          )}
        </div>

        {/* ── Row 2: View / filter controls ── */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-gray-50">
          {/* Match mode toggle */}
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden text-xs font-medium shrink-0">
            <button type="button" onClick={() => setMatchMode("smart")}
              className={`px-3 py-1.5 transition-colors flex items-center gap-1.5 ${matchMode === "smart" ? "bg-indigo-600 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
              title="每个国家使用主要语言，1列/国家">
              <Zap size={11} />
              显示智能匹配结果
            </button>
            <button type="button" onClick={() => setMatchMode("full")}
              className={`px-3 py-1.5 transition-colors flex items-center gap-1.5 border-l border-gray-200 ${matchMode === "full" ? "bg-indigo-600 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
              title="每个国家所有语言各一列">
              <LayoutGrid size={11} />
              显示全量结果
            </button>
          </div>

          {/* Mapping config — only in smart mode */}
          {matchMode === "smart" && (
            <button type="button" onClick={() => togglePanel("mapping")}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                openPanel === "mapping" ? "bg-indigo-50 border border-indigo-200 text-indigo-700" : "border border-gray-200 hover:bg-gray-50 text-gray-600"
              }`}>
              <Settings2 size={12} />
              语言映射
              {overrideCount > 0 && (
                <span className="bg-indigo-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                  {overrideCount}
                </span>
              )}
            </button>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Language selector */}
          <button type="button" onClick={() => togglePanel("lang")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              openPanel === "lang" ? "bg-indigo-50 border border-indigo-200 text-indigo-700" : "border border-gray-200 hover:bg-gray-50 text-gray-600"
            }`}>
            <Languages size={12} />
            设定模版文件语言
            <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{selectedLangs.length}</span>
          </button>

          {/* Country selector */}
          <button type="button" onClick={() => togglePanel("country")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              openPanel === "country" ? "bg-indigo-50 border border-indigo-200 text-indigo-700" : "border border-gray-200 hover:bg-gray-50 text-gray-600"
            }`}>
            <Globe size={12} />
            选择查询国家
            <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{selectedCountries.length}</span>
          </button>
        </div>

        {/* ── Expandable panels ── */}
        {openPanel === "mapping" && (
          <div className="border border-indigo-100 rounded-xl p-4 bg-indigo-50/20">
            <LangMappingPanel
              selectedCountries={selectedCountries}
              overrides={langOverrides}
              onOverride={handleOverride}
              onReset={handleReset}
              onResetAll={handleResetAll}
              focusCountry={focusCountry}
            />
          </div>
        )}
        {openPanel === "lang" && (
          <div className="border border-indigo-100 rounded-xl p-4 bg-indigo-50/30">
            <LanguageSelector selected={selectedLangs} onChange={setSelectedLangs} />
          </div>
        )}
        {openPanel === "country" && (
          <div className="border border-gray-100 rounded-xl p-4 bg-gray-50">
            <CountrySelector selected={selectedCountries} onChange={setSelectedCountries} />
          </div>
        )}

        {/* ── Notices ── */}
        {!hasKey && (
          <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
            <span>⚠️</span><span>请先在右上角设置 API Key 后再使用批量查询</span>
          </div>
        )}
        {detectedNote && !running && (
          <div className="flex items-center gap-2 text-xs text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2.5">
            <Info size={13} className="shrink-0 text-indigo-400" />
            {detectedNote}
          </div>
        )}
        {error && (
          <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            <span className="shrink-0 mt-0.5">⚠️</span>
            <span className="break-all">{error}</span>
          </div>
        )}

        {/* ── Progress ── */}
        {progress && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span className="flex items-center gap-2">
                {running && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />}
                {running ? "处理中…" : "已完成"} {progress.done} / {progress.total}
              </span>
              <span className="font-mono font-semibold text-gray-700">{pct}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-500 ${running ? "bg-indigo-500" : "bg-emerald-500"}`}
                style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}

        {/* ── Pivot table ── */}
        {rows.length > 0 && (
          <PivotTable
            rows={rows}
            countries={selectedCountries}
            langs={queryLangs}
            matchMode={matchMode}
            langOverrides={langOverrides}
            onEditMapping={matchMode === "smart" ? handleEditMapping : undefined}
          />
        )}

        {/* ── Empty state ── */}
        {!running && rows.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
              <UploadCloud className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">上传 Excel 或 CSV 文件开始批量查询</p>
            <p className="text-xs text-gray-400">先选择语言并下载模板，填写关键词后上传</p>
          </div>
        )}
      </div>
    </section>
  );
}
