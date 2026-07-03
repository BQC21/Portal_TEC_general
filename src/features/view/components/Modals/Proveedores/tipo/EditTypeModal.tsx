"use client";

import { useState } from "react";
import { AddProductCloseIcon } from "../../../Icons/AddCloseIcon";
import { AddProductTextField } from "../../../Form_fields/AddTextField";
import { TABLE_HEADERS_TYPE } from "@/lib/utils/headers";
import { EditTypeModalProps } from "@/lib/types/components/modals";
import { createTypeFormStateFromType } from "@/lib/mapping/mapping_type";
import { TypeFormstate } from "@/lib/types/supabase/type-types";

export default function EditTypeModal({ existingType, onUpdateType, onClose }: EditTypeModalProps) {
    const [form_type, setForm_type] = useState<TypeFormstate>(createTypeFormStateFromType(existingType));

    function updateField<K extends keyof TypeFormstate>(field: K, value: TypeFormstate[K]) {
        setForm_type((current) => {
            const updated = { ...current, [field]: value };
            return updated;
        });
    }

    // Aceptar insercion
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        onUpdateType({
            ...form_type,
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
            <div className="max-h-[95vh] w-full max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                    <h2 className="text-2xl font-bold text-slate-900">Editar tipo de producto</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                        aria-label="Cerrar modal"
                    >
                        <AddProductCloseIcon />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="max-h-[calc(95vh-88px)] overflow-y-auto px-6 py-6">
                    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-3 py-5 sm:px-6 lg:px-8">
                        <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <AddProductTextField
                                label={TABLE_HEADERS_TYPE[0]}
                                required
                                placeholder=" "
                                value={form_type.nombre || ""}
                                onChange={(value) => updateField("nombre", value)}
                            />
                            <AddProductTextField
                                label={TABLE_HEADERS_TYPE[1]}
                                required
                                placeholder=" "
                                value={form_type.categoria || ""}
                                onChange={(value) => updateField("categoria", value)}
                            />                                               
                        </section>
                    </div>
                    <div className="mt-8 flex justify-end gap-4 border-t border-slate-200 pt-6">
                        <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-slate-300 px-6 py-3 text-lg font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            Cancelar
                        </button>
                        <button
                        type="submit"
                        className="rounded-xl bg-brand-500 px-6 py-3 text-lg font-semibold text-white transition hover:bg-brand-600"
                        >
                            Actualizar tipo de producto
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}