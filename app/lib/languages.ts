export interface LangConfig {
  name: string;       // 中文名
  nativeName: string; // 原生语言名
  rtl?: boolean;
  badge: string;
  color: string;
}

export const LANG_MAP: Record<string, LangConfig> = {
  en: { name: "英语",         nativeName: "English",            badge: "bg-blue-50 text-blue-600 border-blue-100",       color: "text-blue-500" },
  fr: { name: "法语",         nativeName: "Français",           badge: "bg-purple-50 text-purple-600 border-purple-100", color: "text-purple-500" },
  ar: { name: "阿拉伯语",     nativeName: "العربية", rtl: true, badge: "bg-orange-50 text-orange-600 border-orange-100", color: "text-orange-500" },
  ru: { name: "俄语",         nativeName: "Русский",            badge: "bg-red-50 text-red-600 border-red-100",          color: "text-red-500" },
  es: { name: "西班牙语",     nativeName: "Español",            badge: "bg-emerald-50 text-emerald-600 border-emerald-100", color: "text-emerald-600" },
  de: { name: "德语",         nativeName: "Deutsch",            badge: "bg-yellow-50 text-yellow-700 border-yellow-100", color: "text-yellow-600" },
  pt: { name: "葡萄牙语",     nativeName: "Português",          badge: "bg-lime-50 text-lime-700 border-lime-100",       color: "text-lime-600" },
  it: { name: "意大利语",     nativeName: "Italiano",           badge: "bg-green-50 text-green-700 border-green-100",    color: "text-green-600" },
  ja: { name: "日语",         nativeName: "日本語",              badge: "bg-pink-50 text-pink-600 border-pink-100",       color: "text-pink-500" },
  ko: { name: "韩语",         nativeName: "한국어",              badge: "bg-rose-50 text-rose-600 border-rose-100",       color: "text-rose-500" },
  tr: { name: "土耳其语",     nativeName: "Türkçe",             badge: "bg-cyan-50 text-cyan-600 border-cyan-100",       color: "text-cyan-600" },
  nl: { name: "荷兰语",       nativeName: "Nederlands",         badge: "bg-teal-50 text-teal-600 border-teal-100",       color: "text-teal-600" },
  pl: { name: "波兰语",       nativeName: "Polski",             badge: "bg-indigo-50 text-indigo-600 border-indigo-100", color: "text-indigo-600" },
  hi: { name: "印地语",       nativeName: "हिन्दी",               badge: "bg-amber-50 text-amber-700 border-amber-100",    color: "text-amber-600" },
  id: { name: "印度尼西亚语", nativeName: "Bahasa Indonesia",   badge: "bg-sky-50 text-sky-600 border-sky-100",          color: "text-sky-600" },
  vi: { name: "越南语",       nativeName: "Tiếng Việt",         badge: "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100", color: "text-fuchsia-500" },
  th: { name: "泰语",         nativeName: "ภาษาไทย",            badge: "bg-violet-50 text-violet-600 border-violet-100", color: "text-violet-500" },
  sv: { name: "瑞典语",       nativeName: "Svenska",            badge: "bg-blue-50 text-blue-700 border-blue-200",       color: "text-blue-700" },
  uk: { name: "乌克兰语",     nativeName: "Українська",         badge: "bg-yellow-50 text-yellow-600 border-yellow-200", color: "text-yellow-500" },
  cs: { name: "捷克语",       nativeName: "Čeština",            badge: "bg-slate-50 text-slate-600 border-slate-200",    color: "text-slate-500" },
  he: { name: "希伯来语",     nativeName: "עברית", rtl: true,   badge: "bg-blue-50 text-blue-800 border-blue-200",       color: "text-blue-800" },
  fa: { name: "波斯语",       nativeName: "فارسی", rtl: true,   badge: "bg-purple-50 text-purple-800 border-purple-200", color: "text-purple-800" },
  ro: { name: "罗马尼亚语",   nativeName: "Română",             badge: "bg-orange-50 text-orange-700 border-orange-200", color: "text-orange-700" },
  hu: { name: "匈牙利语",     nativeName: "Magyar",             badge: "bg-red-50 text-red-700 border-red-200",          color: "text-red-700" },
  el: { name: "希腊语",       nativeName: "Ελληνικά",           badge: "bg-cyan-50 text-cyan-800 border-cyan-200",       color: "text-cyan-800" },
};

export const DEFAULT_LANGS = ["en", "fr", "ar", "ru", "es"];

export const ALL_LANGS = Object.keys(LANG_MAP);
