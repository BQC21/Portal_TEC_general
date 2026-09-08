"use client";

import { DuplicateIcon } from "@/features/view/components/Icons/DuplicateIcon";
import { DuplicateRowButtonProps } from "@/lib/types/components/General/buttons";
import { useState } from "react";

export function Button2Duplicate({ title, onDuplicate }: DuplicateRowButtonProps) {
    const [loading, setLoading] = useState(false);

    return (
        <button
            type="button"
            disabled={loading}
            onClick={async () => {
                setLoading(true);
                try {
                    await onDuplicate();
                } catch (error) {
                    window.alert(
                        error instanceof Error ? error.message : "No se pudo duplicar la fila.",
                    );
                } finally {
                    setLoading(false);
                }
            }}
            className="table-icon-button text-slate-500 disabled:opacity-50"
            title={title}
            aria-label={title}
        >
            <DuplicateIcon />
        </button>
    );
}
