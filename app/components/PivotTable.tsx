"use client";

import { COUNTRY_MAP } from "@/app/lib/countries";
import { LANG_MAP } from "@/app/lib/languages";
import type { LangVolumes } from "@/app/lib/ahrefs";

export interface BatchRow {
  keywords: Record<string, string>;
  lang_volumes: LangVolumes;
  error: string | null;
}

interface Props {
  rows: BatchRow[];
  countries: string[];
  langs: string[];
  matchMode?: "smart" | "full";
  langOverrides?: Record<string, string>;          // country → lang override
  onEditMapping?: (country: string) => void;       // open mapping panel for this country
}

// Use overrides first, then COUNTRY_MAP default
function effectiveLang(countryCode: string, langOverrides?: Record<string, string>): string {
  return langOverrides?.[countryCode] ?? COUNTRY_MAP[countryCode]?.lang ?? "en";
}

function getVolSmart(
  langVolumes: LangVolumes,
  countryCode: string,
  langOverrides?: Record<string, string>
): number | null {
  const lang = effectiveLang(countryCode, langOverrides);
  const lv = langVolumes[lang];
  if (!lv) return null;
  return lv[countryCode] ?? null;
}

function getVolFull(langVolumes: LangVolumes, countryCode: string, lang: string): number | null {
  const lv = langVolumes[lang];
  if (!lv) return null;
  const v = lv[countryCode];
  return v !== undefined ? v : null;
}

function fmtVol(v: number | null): string {
  if (v === null) return "—";
  if (v === 0) return "0";
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 10_000) return `${Math.round(v / 1_000)}K`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return v.toLocaleString();
}

function volCell(v: number | null): string {
  if (v === null) return "text-gray-300";
  if (v >= 10000) return "bg-emerald-100 text-emerald-800 font-semibold";
  if (v >= 1000) return "bg-emerald-50 text-emerald-700";
  if (v >= 100) return "bg-amber-50 text-amber-700";
  if (v > 0) return "bg-orange-50 text-orange-600";
  return "text-gray-300";
}

function getBadge(lang: string): string {
  return LANG_MAP[lang]?.badge ?? "bg-gray-50 text-gray-600 border-gray-100";
}

function getColor(lang: string): string {
  return LANG_MAP[lang]?.color ?? "text-gray-400";
}

function isRtl(lang: string): boolean {
  return LANG_MAP[lang]?.rtl === true;
}

export default function PivotTable({
  rows,
  countries,
  langs,
  matchMode = "smart",
  langOverrides = {},
  onEditMapping,
}: Props) {
  if (!rows.length || !langs.length) return null;

  /* ─── FULL MATCH mode ─── */
  if (matchMode === "full") {
    return (
      <div className="overflow-auto rounded-xl border border-gray-100 max-h-[65vh]">
        <table className="text-xs border-collapse w-full">
          <thead className="sticky top-0 z-10">
            <tr className="bg-gray-50 border-b border-gray-100">
              {langs.map((lang) => (
                <th
                  key={lang}
                  rowSpan={2}
                  className="border-r border-gray-100 px-3 py-2.5 text-left font-semibold text-gray-600 min-w-28 align-middle"
                >
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[10px] font-bold uppercase ${getBadge(lang)}`}>
                    {lang}
                  </span>
                </th>
              ))}
              {countries.map((c) => {
                const cfg = COUNTRY_MAP[c];
                return (
                  <th
                    key={c}
                    colSpan={langs.length}
                    className="border-r border-gray-100 px-2 py-2 text-center font-semibold text-gray-700 text-[11px] border-b border-gray-200"
                  >
                    {cfg?.name ?? c}{" "}
                    <span className="text-gray-400 font-normal text-[10px]">({c})</span>
                  </th>
                );
              })}
            </tr>
            <tr className="bg-gray-50 border-b border-gray-200">
              {countries.map((c) =>
                langs.map((lang) => {
                  const isPrimary = COUNTRY_MAP[c]?.lang === lang;
                  return (
                    <th
                      key={`${c}-${lang}`}
                      className={`border-r border-gray-100 px-1 py-1.5 text-center min-w-[3rem] ${isPrimary ? "bg-indigo-50/60" : ""}`}
                      title={`${COUNTRY_MAP[c]?.name ?? c} — ${lang.toUpperCase()}${isPrimary ? " (主要语言)" : ""}`}
                    >
                      <span className={`inline-flex items-center px-1 py-0.5 rounded text-[9px] font-bold uppercase border ${getBadge(lang)}`}>
                        {lang}
                      </span>
                      {isPrimary && <div className="text-[8px] text-indigo-400 mt-0.5">主</div>}
                    </th>
                  );
                })
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className={`border-b border-gray-50 hover:bg-indigo-50/30 transition-colors ${i % 2 === 1 ? "bg-gray-50/40" : "bg-white"}`}
              >
                {langs.map((lang) => (
                  <td key={lang} className="border-r border-gray-100 px-3 py-1.5 text-gray-700 whitespace-nowrap font-medium" dir={isRtl(lang) ? "rtl" : undefined}>
                    {row.keywords[lang] || "—"}
                  </td>
                ))}
                {countries.map((c) =>
                  langs.map((lang) => {
                    const v = getVolFull(row.lang_volumes, c, lang);
                    const isPrimary = COUNTRY_MAP[c]?.lang === lang;
                    return (
                      <td
                        key={`${c}-${lang}`}
                        className={`border-r border-gray-100 px-1.5 py-1.5 text-right font-mono text-[11px] ${volCell(v)} ${isPrimary ? "ring-inset ring-1 ring-indigo-200" : ""}`}
                        title={isPrimary ? `${COUNTRY_MAP[c]?.name} 主要语言` : ""}
                      >
                        {fmtVol(v)}
                      </td>
                    );
                  })
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  /* ─── SMART MATCH mode ─── */
  return (
    <div className="overflow-auto rounded-xl border border-gray-100 max-h-[65vh]">
      <table className="text-xs border-collapse w-full">
        <thead className="sticky top-0 z-10">
          <tr className="bg-gray-50 border-b border-gray-100">
            {/* Keyword columns */}
            {langs.map((lang) => (
              <th key={lang} className="border-r border-gray-100 px-3 py-2.5 text-left font-semibold text-gray-600 min-w-28">
                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[10px] font-bold uppercase ${getBadge(lang)}`}>
                  {lang}
                </span>
              </th>
            ))}
            {/* Country columns — language badge is clickable */}
            {countries.map((c) => {
              const cfg = COUNTRY_MAP[c];
              const eLang = effectiveLang(c, langOverrides);
              const isOverridden = !!langOverrides[c] && langOverrides[c] !== cfg?.lang;
              const defaultLang = cfg?.lang ?? "en";
              const isQueried = langs.includes(eLang);
              const isDefaultQueried = langs.includes(defaultLang);

              return (
                <th
                  key={c}
                  className="border-r border-gray-100 px-2 py-2 text-center font-medium text-gray-600 min-w-[4.5rem]"
                >
                  <div className="text-[11px] font-semibold text-gray-700 leading-tight">{cfg?.name ?? c}</div>
                  <div className="text-[10px] text-gray-400 font-mono mb-1">{c}</div>

                  {/* Clickable language badge */}
                  <button
                    type="button"
                    onClick={() => onEditMapping?.(c)}
                    title={`当前使用 ${eLang.toUpperCase()} 关键词${isOverridden ? "（已自定义）" : "（默认）"}。点击配置语言映射`}
                    className={`group relative inline-flex flex-col items-center gap-0.5 px-1.5 py-1 rounded-lg border transition-all duration-150 ${
                      isOverridden
                        ? `${getBadge(eLang)} ring-1 ring-indigo-300`
                        : isQueried
                        ? `${getBadge(eLang)} hover:ring-1 hover:ring-indigo-200`
                        : "bg-gray-50 border-gray-200 text-gray-300"
                    } ${onEditMapping ? "cursor-pointer hover:shadow-sm" : "cursor-default"}`}
                  >
                    {/* Override indicator dot */}
                    {isOverridden && (
                      <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-indigo-500 border border-white" />
                    )}

                    {/* Lang code */}
                    <span className={`text-[9px] font-bold uppercase leading-none ${isQueried ? "" : "opacity-40"}`}>
                      {eLang}
                    </span>

                    {/* Edit hint on hover */}
                    {onEditMapping && (
                      <span className="text-[8px] opacity-0 group-hover:opacity-60 transition-opacity leading-none">
                        点击
                      </span>
                    )}

                    {/* Not queried warning */}
                    {!isQueried && (
                      <span title="该语言未在本次查询中" className="text-[9px] text-amber-400">⚠</span>
                    )}
                    {!isOverridden && !isDefaultQueried && isQueried && (
                      <span title={`默认语言 ${defaultLang} 未查询，自动使用 ${eLang}`} className="text-[8px] text-amber-400">*</span>
                    )}
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={`border-b border-gray-50 hover:bg-indigo-50/30 transition-colors ${i % 2 === 1 ? "bg-gray-50/40" : "bg-white"}`}
            >
              {langs.map((lang) => (
                <td key={lang} className="border-r border-gray-100 px-3 py-1.5 text-gray-700 whitespace-nowrap font-medium" dir={isRtl(lang) ? "rtl" : undefined}>
                  {row.keywords[lang] || "—"}
                </td>
              ))}
              {countries.map((c) => {
                const v = getVolSmart(row.lang_volumes, c, langOverrides);
                return (
                  <td key={c} className={`border-r border-gray-100 px-2 py-1.5 text-right font-mono text-[11px] ${volCell(v)}`}>
                    {fmtVol(v)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
