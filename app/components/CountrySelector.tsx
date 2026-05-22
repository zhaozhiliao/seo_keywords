"use client";

import { CONTINENTS, COUNTRIES_BY_CONTINENT, COUNTRY_MAP, ALL_COUNTRY_CODES, DEFAULT_COUNTRIES } from "@/app/lib/countries";

interface Props {
  selected: string[];
  onChange: (countries: string[]) => void;
}

export default function CountrySelector({ selected, onChange }: Props) {
  const selectedSet = new Set(selected);

  function toggleCountry(code: string) {
    const next = new Set(selectedSet);
    if (next.has(code)) next.delete(code); else next.add(code);
    onChange(Array.from(next));
  }

  function selectContinent(continent: string) {
    const codes = COUNTRIES_BY_CONTINENT[continent] ?? [];
    const allSelected = codes.every((c) => selectedSet.has(c));
    const next = new Set(selectedSet);
    if (allSelected) codes.forEach((c) => next.delete(c));
    else codes.forEach((c) => next.add(c));
    onChange(Array.from(next));
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs font-medium text-gray-600">
          已选 <span className="text-indigo-600 font-bold">{selected.length}</span> / {ALL_COUNTRY_CODES.length} 个国家
        </span>
        <div className="flex gap-1 ml-auto">
          <button type="button" onClick={() => onChange([...ALL_COUNTRY_CODES])}
            className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
            全选
          </button>
          <button type="button" onClick={() => onChange([])}
            className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
            清空
          </button>
          <button type="button" onClick={() => onChange([...DEFAULT_COUNTRIES])}
            className="px-2.5 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors">
            Guazi热门国家 ({DEFAULT_COUNTRIES.length})
          </button>
        </div>
      </div>

      {/* Continent groups */}
      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {CONTINENTS.map((continent) => {
          const codes = COUNTRIES_BY_CONTINENT[continent] ?? [];
          const allSelected = codes.every((c) => selectedSet.has(c));
          const someSelected = codes.some((c) => selectedSet.has(c));
          const count = codes.filter((c) => selectedSet.has(c)).length;

          return (
            <div key={continent} className="border border-gray-100 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2.5 px-3 py-2 bg-gray-50 border-b border-gray-100">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => { if (el) el.indeterminate = !allSelected && someSelected; }}
                  onChange={() => selectContinent(continent)}
                  className="w-3.5 h-3.5 accent-indigo-600 cursor-pointer"
                />
                <span className="text-xs font-semibold text-gray-700">{continent}</span>
                <span className="ml-auto text-[10px] text-gray-400 bg-white border border-gray-200 px-1.5 py-0.5 rounded-full">
                  {count}/{codes.length}
                </span>
              </div>

              <div className="flex flex-wrap gap-1 p-2">
                {codes.map((code) => {
                  const isOn = selectedSet.has(code);
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => toggleCountry(code)}
                      className={`px-2 py-0.5 text-[11px] rounded-full border transition-all duration-100 ${
                        isOn
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                          : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
                      }`}
                    >
                      {COUNTRY_MAP[code]?.name ?? code}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
