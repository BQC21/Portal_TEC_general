"use client";

import { useState } from "react";

import { ExcelWorkbookProps } from "@/lib/types/components/General/Shell";

export function ExcelWorkbook({ sheets, defaultSheetId }: ExcelWorkbookProps) {
    const initialSheetId = defaultSheetId && sheets.some((sheet) => sheet.id === defaultSheetId)
        ? defaultSheetId
        : (sheets[0]?.id ?? "");
    const [activeSheetId, setActiveSheetId] = useState(initialSheetId);
    const activeSheet = sheets.find((sheet) => sheet.id === activeSheetId) ?? sheets[0];

    if (!activeSheet) return null;

    return (
        <div className="excel-workbook overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
            <div className="excel-compact p-4">
                {activeSheet.content}
            </div>
            <div
                role="tablist"
                aria-label="Hojas"
                className="flex flex-wrap items-end gap-px border-t border-slate-300 bg-slate-200 px-1 pt-1"
            >
                {sheets.map((sheet) => {
                    const isActive = sheet.id === activeSheet.id;

                    return (
                        <button
                            key={sheet.id}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            onClick={() => setActiveSheetId(sheet.id)}
                            className={[
                                "min-w-[9rem] rounded-t-md border border-b-0 px-4 py-1.5 text-sm font-semibold transition",
                                isActive
                                    ? "border-slate-300 bg-white text-emerald-800 shadow-[0_-1px_0_#fff]"
                                    : "border-transparent bg-slate-100 text-slate-600 hover:bg-slate-50 hover:text-slate-800",
                            ].join(" ")}
                        >
                            {sheet.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
