"use client";

import { CollapsibleTableSectionProps } from "@/lib/types/components/General/Shell";
import { useState } from "react";

export function CollapsibleTableSection({
    title,
    defaultOpen = false,
    children,
    showCheckbox = false,
    checked = true,
    onCheckedChange,
    checkboxAriaLabel,
}: CollapsibleTableSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-slate-200 last:border-b-0">
            <div className="flex w-full items-center gap-3 px-4 py-4 transition hover:bg-slate-50">
                <button
                    type="button"
                    onClick={() => setIsOpen((open) => !open)}
                    aria-expanded={isOpen}
                    className="flex min-w-0 flex-1 items-center text-left"
                >
                    <span className="text-lg font-bold text-slate-900">{title}</span>
                </button>
                {showCheckbox ? (
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={(event) => onCheckedChange?.(event.target.checked)}
                        onClick={(event) => event.stopPropagation()}
                        aria-label={checkboxAriaLabel ?? `Considerar ${title}`}
                        className="h-5 w-5 shrink-0 accent-orange-500"
                    />
                ) : null}
                <button
                    type="button"
                    onClick={() => setIsOpen((open) => !open)}
                    aria-expanded={isOpen}
                    aria-label={isOpen ? `Contraer ${title}` : `Expandir ${title}`}
                    className="shrink-0 text-slate-500"
                >
                    <svg
                        className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>
            {isOpen && <div className="[&_h2]:hidden">{children}</div>}
        </div>
    );
}
