"use client";

import { useEffect, useRef, useState } from "react";
import { AddProductSearchableSelectFieldProps, SelectOption } from "@/lib/types/components/General/form_fields";
import { AddProductFieldLabel } from "./AddFieldLabel";
import { SearchIcon } from "@/features/view/components/Icons/SearchIcon";

function normalizeOptions(options: AddProductSearchableSelectFieldProps["options"]): SelectOption[] {
    return options.map((option) =>
        typeof option === "string" ? { value: option, label: option } : option
    );
}

export function AddProductSearchableSelectField({
    label,
    required,
    options,
    value,
    disabled,
    onChange,
    customClass = "",
    searchPlaceholder = "Buscar...",
    emptyMessage = "Sin resultados",
}: AddProductSearchableSelectFieldProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    const normalizedOptions = normalizeOptions(options);
    const selectedOption = normalizedOptions.find((option) => option.value === value);
    const query = search.trim().toLowerCase();
    const filteredOptions = query
        ? normalizedOptions.filter((option) => option.label.toLowerCase().includes(query))
        : normalizedOptions;

    // El desplegable se cierra al hacer clic afuera o con Escape.
    useEffect(() => {
        if (!open) return;

        function handlePointerDown(event: MouseEvent) {
            if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
        }
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") setOpen(false);
        }

        document.addEventListener("mousedown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open]);

    useEffect(() => {
        if (!open) setSearch("");
    }, [open]);

    function handleSelect(option: SelectOption) {
        onChange(option.value);
        setOpen(false);
    }

    return (
        <div ref={containerRef} className="relative w-full">
            <AddProductFieldLabel label={label} required={required} />
            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen((current) => !current)}
                aria-haspopup="listbox"
                aria-expanded={open}
                className={`input-focus flex w-full items-center justify-between gap-2 rounded-xl border border-slate-300 px-4 py-3 text-left text-lg transition disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 ${customClass}`}
            >
                <span className="truncate">
                    {selectedOption?.label ?? normalizedOptions[0]?.label ?? "Seleccionar"}
                </span>
                <span aria-hidden className="shrink-0 text-slate-500">▾</span>
            </button>

            {open && (
                <div className="absolute left-0 right-0 z-30 mt-1 rounded-xl border border-slate-300 bg-white shadow-lg">
                    <div className="relative border-b border-slate-200 p-2">
                        <SearchIcon />
                        <input
                            type="text"
                            autoFocus
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder={searchPlaceholder}
                            className="w-full rounded-lg border border-slate-300 py-2 pl-12 pr-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <ul role="listbox" className="max-h-60 overflow-y-auto py-1">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <li key={option.value || option.label}>
                                    <button
                                        type="button"
                                        role="option"
                                        aria-selected={option.value === value}
                                        onClick={() => handleSelect(option)}
                                        className={`block w-full px-4 py-2 text-left text-base transition hover:bg-slate-100 ${
                                            option.value === value ? "bg-slate-100 font-semibold" : ""
                                        }`}
                                    >
                                        {option.label}
                                    </button>
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-3 text-sm text-slate-500">{emptyMessage}</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
