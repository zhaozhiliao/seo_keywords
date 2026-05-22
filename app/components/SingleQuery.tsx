"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Search, Check, Loader2 } from "lucide-react";
import { COUNTRY_MAP, ALL_COUNTRY_CODES, CONTINENTS, COUNTRIES_BY_CONTINENT } from "@/app/lib/countries";
import { LANG_MAP } from "@/app/lib/languages";
import { useApiKey } from "@/app/context/ApiKeyContext";

type Tab = "volume-by-country" | "overview" | "multi-country";

interface VolumeItem { country: string; volume: number; }
interface OverviewData {
  keyword?: string; volume?: number; cpc?: number; difficulty?: number;
  clicks?: number; global_volume?: number; traffic_potential?: number; cps?: number;
  [key: string]: unknown;
}

const tabs: { key: Tab; label: string; icon: string }[] = [
  { key: "volume-by-country", label: "查询各国搜索量", icon: "🌍" },
  { key: "overview",          label: "查询目标国多维数据",   icon: "📊" },
  { key: "multi-country",     label: "多国数据对比",   icon: "🔀" },
];

const QUICK_PRESETS: { label: string; countries: string[] }[] = [
  { label: "Guazi 热门国家", countries: ["RU","US","GH","BY","NL","DZ","NG","GB","DE","GE","FR","PL","CA","KG","KZ","AM","UZ","ZA","SA","AZ","ES","TJ","CI","RO"] },
  { label: "欧洲",       countries: ["GB","DE","FR","IT","ES","NL","SE","PL","RU","TR"] },
  { label: "亚洲",       countries: ["JP","KR","IN","SG","TH","ID","MY","PH","VN","AE"] },
  { label: "阿拉伯",     countries: ["SA","AE","EG","MA","IQ","QA","KW","JO","DZ","TN"] },
  { label: "拉美",       countries: ["BR","MX","AR","CO","CL","PE","VE","EC"] },
];

function formatVol(v: number | null | undefined): string {
  if (v == null) return "—";
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 10_000) return `${Math.round(v / 1_000)}K`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return v.toLocaleString();
}

function volBarClass(v: number): string {
  if (v >= 10000) return "bg-emerald-500";
  if (v >= 1000) return "bg-emerald-400";
  if (v >= 100) return "bg-amber-400";
  if (v > 0) return "bg-orange-400";
  return "bg-gray-200";
}

/* ── Single-country searchable select ── */
function CountrySearchSelect({
  value, onChange,
}: {
  value: string;
  onChange: (code: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false); setSearch("");
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 30);
  }, [open]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return ALL_COUNTRY_CODES;
    return ALL_COUNTRY_CODES.filter((c) => {
      const cfg = COUNTRY_MAP[c];
      return c.toLowerCase().includes(q) || (cfg?.name ?? "").includes(q);
    });
  }, [search]);

  const cfg = COUNTRY_MAP[value];

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => { setOpen((v) => !v); }}
        className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all min-w-[160px]"
      >
        <span className="flex-1 text-left text-gray-800">
          <span className="font-medium">{cfg?.name ?? value}</span>
          <span className="text-gray-400 text-xs ml-1.5">{value}</span>
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 top-full mt-1 z-30 bg-white border border-gray-200 rounded-xl shadow-xl w-64 overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Escape") { setOpen(false); setSearch(""); } }}
                placeholder="搜索国家名或代码…"
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:bg-white focus:border-transparent"
              />
            </div>
          </div>
          {/* Country list */}
          <div className="max-h-60 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <div className="text-center text-gray-400 text-xs py-4">未找到</div>
            ) : filtered.map((c) => {
              const ccfg = COUNTRY_MAP[c];
              const isSelected = c === value;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => { onChange(c); setOpen(false); setSearch(""); }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors ${
                    isSelected ? "bg-indigo-50 text-indigo-700 font-medium" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="font-mono text-[10px] text-gray-400 w-6 shrink-0">{c}</span>
                  <span className="flex-1">{ccfg?.name ?? c}</span>
                  {isSelected && (
                    <Check size={12} className="text-indigo-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
          <div className="px-3 py-1.5 border-t border-gray-100 bg-gray-50 text-[11px] text-gray-400">
            共 {ALL_COUNTRY_CODES.length} 个国家{search ? `，筛选出 ${filtered.length} 个` : ""}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Multi-country picker ── */
function MultiCountryPicker({
  selected, onChange,
}: {
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeContinent, setActiveContinent] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 30);
  }, [open]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const base = activeContinent
      ? (COUNTRIES_BY_CONTINENT[activeContinent] ?? ALL_COUNTRY_CODES)
      : ALL_COUNTRY_CODES;
    if (!q) return base;
    return base.filter((c) => {
      const cfg = COUNTRY_MAP[c];
      return (
        c.toLowerCase().includes(q) ||
        (cfg?.name ?? "").includes(q) ||
        (LANG_MAP[cfg?.lang ?? ""]?.name ?? "").includes(q)
      );
    });
  }, [search, activeContinent]);

  const selectedSet = new Set(selected);

  function toggle(code: string) {
    if (selectedSet.has(code)) {
      onChange(selected.filter((c) => c !== code));
    } else {
      onChange([...selected, code]);
    }
  }

  function applyPreset(countries: string[]) {
    onChange(countries);
    setOpen(false);
  }

  function clear() { onChange([]); }

  return (
    <div ref={ref} className="relative w-full">
      {/* Chips display area */}
      <div
        className="flex flex-wrap gap-1.5 p-2 bg-gray-50 border border-gray-200 rounded-xl min-h-[44px] items-center cursor-text transition-all focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-transparent focus-within:bg-white"
        onClick={() => { setOpen(true); }}
      >
        {selected.length === 0 && !open && (
          <span className="text-sm text-gray-400 px-1">点击选择国家…</span>
        )}

        {selected.map((c) => {
          const cfg = COUNTRY_MAP[c];
          const lang = cfg?.lang ?? "en";
          const badge = LANG_MAP[lang]?.badge ?? "bg-gray-50 text-gray-500 border-gray-200";
          return (
            <span
              key={c}
              className={`inline-flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-lg border text-xs font-medium shadow-sm ${badge}`}
            >
              <span className="font-mono text-[9px] opacity-60">{c}</span>
              <span>{cfg?.name ?? c}</span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); toggle(c); }}
                className="ml-0.5 w-3.5 h-3.5 rounded flex items-center justify-center hover:bg-black/10 transition-colors text-[11px] leading-none"
              >
                ×
              </button>
            </span>
          );
        })}

        {/* Inline search input */}
        {open && (
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Escape") { setOpen(false); setSearch(""); } }}
            placeholder="搜索国家名或代码…"
            className="flex-1 min-w-24 bg-transparent text-sm outline-none placeholder:text-gray-300"
            onClick={(e) => e.stopPropagation()}
          />
        )}

        {selected.length > 0 && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); clear(); }}
            className="ml-auto text-[10px] text-gray-400 hover:text-red-400 transition-colors px-1 shrink-0"
          >
            全清
          </button>
        )}
      </div>

      {/* Count badge */}
      {selected.length > 0 && (
        <div className="absolute -top-1.5 -right-1.5 bg-indigo-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none shadow-sm">
          {selected.length}
        </div>
      )}

      {/* Dropdown panel */}
      {open && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl shadow-2xl border border-gray-100 z-30 overflow-hidden">
          {/* Quick presets */}
          <div className="px-3 pt-3 pb-2 border-b border-gray-100">
            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">快速预设</div>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => applyPreset(p.countries)}
                  className="px-2.5 py-1 text-xs font-medium bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 border border-gray-200 hover:border-indigo-200 rounded-lg transition-colors"
                >
                  {p.label}
                </button>
              ))}
              {selected.length > 0 && (
                <button
                  type="button"
                  onClick={clear}
                  className="px-2.5 py-1 text-xs font-medium bg-red-50 text-red-500 hover:bg-red-100 border border-red-100 rounded-lg transition-colors"
                >
                  清空
                </button>
              )}
            </div>
          </div>

          {/* Continent filter tabs */}
          <div className="px-3 py-2 border-b border-gray-100 flex gap-1 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveContinent(null)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                !activeContinent ? "bg-indigo-600 text-white" : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              全部
            </button>
            {CONTINENTS.map((cont) => (
              <button
                key={cont}
                type="button"
                onClick={() => setActiveContinent(activeContinent === cont ? null : cont)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  activeContinent === cont ? "bg-indigo-600 text-white" : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {cont}
                <span className="ml-1 opacity-60 text-[10px]">
                  {COUNTRIES_BY_CONTINENT[cont]?.length ?? 0}
                </span>
              </button>
            ))}
          </div>

          {/* Country list */}
          <div className="max-h-80 overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <div className="text-center text-gray-400 text-sm py-6">未找到匹配国家</div>
            ) : (
              <div className="grid grid-cols-2 gap-0.5">
                {filtered.map((c) => {
                  const cfg = COUNTRY_MAP[c];
                  const lang = cfg?.lang ?? "en";
                  const isSelected = selectedSet.has(c);
                  const color = LANG_MAP[lang]?.color ?? "text-gray-400";
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggle(c)}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-left transition-colors text-xs ${
                        isSelected
                          ? "bg-indigo-50 text-indigo-700 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {/* Checkbox */}
                      <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 text-[10px] ${
                        isSelected ? "bg-indigo-600 border-indigo-600 text-white" : "border-gray-300"
                      }`}>
                        {isSelected && "✓"}
                      </span>
                      <span className="font-mono text-[9px] text-gray-400 w-6 shrink-0">{c}</span>
                      <span className="flex-1 truncate">{cfg?.name ?? c}</span>
                      <span className={`text-[9px] font-bold uppercase shrink-0 ${color}`}>{lang}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              已选 <strong className="text-gray-800">{selected.length}</strong> 个国家
              {search && ` · 搜索到 ${filtered.length} 个`}
            </span>
            <button
              type="button"
              onClick={() => { setOpen(false); setSearch(""); }}
              className="px-3 py-1 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              确认
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main component ── */
export default function SingleQuery() {
  const { apiKey, hasKey } = useApiKey();
  const [tab, setTab] = useState<Tab>("volume-by-country");
  const [keyword, setKeyword] = useState("");
  const [country, setCountry] = useState("US");
  const [selectedCountries, setSelectedCountries] = useState<string[]>(["GH", "DZ", "GE", "US"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [volumeRows, setVolumeRows] = useState<VolumeItem[]>([]);
  const [overviewData, setOverviewData] = useState<OverviewData | null>(null);
  const [multiResults, setMultiResults] = useState<Record<string, OverviewData> | null>(null);

  const reqHeaders: Record<string, string> = {
    "x-ahrefs-key": apiKey,
    "Content-Type": "application/json",
  };

  async function queryVolumeByCountry() {
    setLoading(true); setError(null); setVolumeRows([]);
    try {
      const r = await fetch(`/api/volume-by-country?keyword=${encodeURIComponent(keyword)}`, { headers: reqHeaders });
      const d = await r.json();
      if (d.error) throw new Error(d.error);
      const rows: VolumeItem[] = (d.countries ?? []).sort((a: VolumeItem, b: VolumeItem) => (b.volume ?? 0) - (a.volume ?? 0));
      setVolumeRows(rows);
    } catch (e) { setError(String(e)); } finally { setLoading(false); }
  }

  async function queryOverview() {
    setLoading(true); setError(null); setOverviewData(null);
    try {
      const r = await fetch(`/api/overview?keyword=${encodeURIComponent(keyword)}&country=${country}`, { headers: reqHeaders });
      const d = await r.json();
      if (d.error) throw new Error(d.error);
      setOverviewData(d.keywords?.[0] ?? d);
    } catch (e) { setError(String(e)); } finally { setLoading(false); }
  }

  async function queryMultiCountry() {
    if (!selectedCountries.length) return;
    setLoading(true); setError(null); setMultiResults(null);
    try {
      const r = await fetch("/api/multi-country-overview", {
        method: "POST", headers: reqHeaders,
        body: JSON.stringify({ keyword, countries: selectedCountries }),
      });
      const d = await r.json();
      if (d.error) throw new Error(d.error);
      setMultiResults(d.results);
    } catch (e) { setError(String(e)); } finally { setLoading(false); }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!keyword.trim()) return;
    if (tab === "volume-by-country") queryVolumeByCountry();
    else if (tab === "overview") queryOverview();
    else queryMultiCountry();
  }

  const maxVol = volumeRows[0]?.volume ?? 1;

  const overviewMetrics = [
    { key: "volume",           label: "搜索量",     icon: "🔍", fmt: (v: unknown) => formatVol(Number(v)) },
    { key: "global_volume",    label: "全球搜索量", icon: "🌐", fmt: (v: unknown) => formatVol(Number(v)) },
    { key: "difficulty",       label: "关键词难度", icon: "💪", fmt: (v: unknown) => String(v) },
    { key: "cpc",              label: "CPC",        icon: "💰", fmt: (v: unknown) => `$${Number(v).toFixed(2)}` },
    { key: "traffic_potential",label: "流量潜力",   icon: "📈", fmt: (v: unknown) => formatVol(Number(v)) },
    { key: "clicks",           label: "点击量",     icon: "👆", fmt: (v: unknown) => formatVol(Number(v)) },
  ];

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-100 rounded-t-2xl overflow-hidden">
        <h2 className="text-sm font-semibold text-gray-900">单个关键词查询</h2>
      </div>

      <div className="p-6 space-y-5">
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-150 ${
                tab === t.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="mr-1.5">{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        {/* Keyword input + single-country select (always shown) */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Keyword input */}
            <div className="flex-1 min-w-52 relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="输入关键词，例如：ahrefs"
                className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
              />
            </div>

            {/* Single-country searchable select (overview tab only) */}
            {tab === "overview" && (
              <CountrySearchSelect value={country} onChange={setCountry} />
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !hasKey || (tab === "multi-country" && selectedCountries.length === 0)}
              className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" />
                  查询中
                </>
              ) : "查询"}
            </button>
          </div>

          {/* Multi-country picker — shown below the input row */}
          {tab === "multi-country" && (
            <div className="relative">
              <MultiCountryPicker
                selected={selectedCountries}
                onChange={setSelectedCountries}
              />
            </div>
          )}
        </form>

        {/* Warnings */}
        {!hasKey && (
          <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
            <span>⚠️</span><span>请先在右上角设置 API Key 后再查询</span>
          </div>
        )}
        {tab === "multi-country" && selectedCountries.length === 0 && (
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
            <span>💡</span><span>请至少选择一个国家后再查询</span>
          </div>
        )}
        {error && (
          <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            <span className="shrink-0 mt-0.5">⚠️</span>
            <span className="break-all">{error}</span>
          </div>
        )}

        {/* Results: volume-by-country */}
        {tab === "volume-by-country" && volumeRows.length > 0 && (
          <div className="overflow-auto max-h-96 rounded-xl border border-gray-100">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left px-4 py-2.5 border-b border-gray-100 font-medium text-gray-500 text-xs uppercase tracking-wide">国家</th>
                  <th className="text-right px-4 py-2.5 border-b border-gray-100 font-medium text-gray-500 text-xs uppercase tracking-wide w-20">搜索量</th>
                  <th className="px-4 py-2.5 border-b border-gray-100 w-36 hidden sm:table-cell" />
                </tr>
              </thead>
              <tbody>
                {volumeRows.map((row, i) => (
                  <tr key={row.country} className={`border-b border-gray-50 hover:bg-indigo-50/40 transition-colors ${i % 2 === 1 ? "bg-gray-50/40" : ""}`}>
                    <td className="px-4 py-2 text-gray-800">
                      <span className="font-medium">{COUNTRY_MAP[row.country.toUpperCase()]?.name ?? row.country.toUpperCase()}</span>
                      <span className="text-gray-400 text-xs ml-1.5">{row.country.toUpperCase()}</span>
                    </td>
                    <td className="px-4 py-2 text-right font-mono font-semibold text-gray-800">{formatVol(row.volume)}</td>
                    <td className="px-4 py-2 hidden sm:table-cell">
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${volBarClass(row.volume)}`} style={{ width: `${Math.max(2, (row.volume / maxVol) * 100)}%` }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Results: overview */}
        {tab === "overview" && overviewData && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {overviewMetrics.map(({ key, label, icon, fmt }) =>
              overviewData[key] != null ? (
                <div key={key} className="bg-gray-50 rounded-xl border border-gray-100 p-4 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all">
                  <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-2">
                    <span>{icon}</span><span>{label}</span>
                  </div>
                  <div className="font-bold text-xl font-mono text-gray-900">{fmt(overviewData[key])}</div>
                </div>
              ) : null
            )}
          </div>
        )}

        {/* Results: multi-country */}
        {tab === "multi-country" && multiResults && (
          <div className="overflow-auto max-h-96 rounded-xl border border-gray-100">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  {[["国家", "left"], ["搜索量", "right"], ["CPC", "right"], ["难度", "right"], ["流量潜力", "right"]].map(([h, align]) => (
                    <th key={h} className={`px-4 py-2.5 border-b border-gray-100 font-medium text-gray-500 text-xs uppercase tracking-wide text-${align}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(multiResults).map(([c, d], i) => {
                  const kw = ((d as { keywords?: OverviewData[] })?.keywords?.[0] ?? d) as OverviewData;
                  return (
                    <tr key={c} className={`border-b border-gray-50 hover:bg-indigo-50/40 transition-colors ${i % 2 === 1 ? "bg-gray-50/40" : ""}`}>
                      <td className="px-4 py-2">
                        <span className="font-medium text-gray-800">{COUNTRY_MAP[c]?.name ?? c}</span>
                        <span className="text-gray-400 text-xs ml-1.5">{c}</span>
                      </td>
                      <td className="px-4 py-2 text-right font-mono font-semibold text-gray-800">{kw?.volume != null ? formatVol(Number(kw.volume)) : "—"}</td>
                      <td className="px-4 py-2 text-right font-mono text-gray-600">{kw?.cpc != null ? `$${Number(kw.cpc).toFixed(2)}` : "—"}</td>
                      <td className="px-4 py-2 text-right font-mono text-gray-600">{kw?.difficulty != null ? String(kw.difficulty) : "—"}</td>
                      <td className="px-4 py-2 text-right font-mono text-gray-600">{kw?.traffic_potential != null ? formatVol(Number(kw.traffic_potential)) : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
