"use client";

import { useState, type ReactNode } from "react";

type CollapsibleTableSectionProps = {
    title: string;
    defaultOpen?: boolean;
    children: ReactNode;
};

export function CollapsibleTableSection({
    title,
    defaultOpen = false,
    children,
}: CollapsibleTableSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-slate-200 last:border-b-0">
            <button
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-slate-50"
            >
                <span className="text-lg font-bold text-slate-900">{title}</span>
                <svg
                    className={`h-5 w-5 shrink-0 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
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
            {isOpen && <div className="[&_h2]:hidden">{children}</div>}
        </div>
    );
}
