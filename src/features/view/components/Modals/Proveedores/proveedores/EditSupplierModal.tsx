"use client";

import { useState } from "react";
import { AddProductCloseIcon } from "../../../Icons/AddCloseIcon";
import { AddProductTextField } from "../../../Form_fields/AddTextField";
import { TABLE_HEADERS_SUPPLIER } from "@/lib/utils/headers";
import { SupplierFormstate } from "@/lib/types/supabase/supplier-types";
import { EditSupplierModalProps } from "@/lib/types/components/modals";
import { createSupplierFormStateFromSupplier } from "@/lib/mapping/mapping_proveedores";

export default function EditSupplierModal({ existingSupplier, onUpdateSupplier, onClose }: EditSupplierModalProps) {
    const [form_supplier, setForm_supplier] = useState<SupplierFormstate>(createSupplierFormStateFromSupplier(existingSupplier));

    function updateField<K extends keyof SupplierFormstate>(field: K, value: SupplierFormstate[K]) {
        setForm_supplier((current) => {
            const updated = { ...current, [field]: value };
            return updated;
        });
    }

    // Aceptar insercion
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        onUpdateSupplier({
            ...form_supplier,
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
            <div className="max-h-[95vh] w-full max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                    <h2 className="text-2xl font-bold text-slate-900">Editar proveedor</h2>
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
                                label={TABLE_HEADERS_SUPPLIER[0]}
                                required
                                placeholder=" "
                                value={form_supplier.nombre || ""}
                                onChange={(value) => updateField("nombre", value)}
                            />
                            <AddProductTextField
                                label={TABLE_HEADERS_SUPPLIER[1]}
                                required
                                placeholder=" "
                                value={form_supplier.codigo || ""}
                                onChange={(value) => updateField("codigo", value)}
                            />                                               
                        </section>
                        <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <AddProductTextField
                                label={TABLE_HEADERS_SUPPLIER[2]}
                                required
                                placeholder=" "
                                value={form_supplier.ruc || ""}
                                onChange={(value) => updateField("ruc", value)}
                            />
                            <AddProductTextField
                                label={TABLE_HEADERS_SUPPLIER[3]}
                                required
                                placeholder=" "
                                value={form_supplier.contacto || ""}
                                onChange={(value) => updateField("contacto", value)}
                            />                                               
                        </section>
                        <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <AddProductTextField
                                label={TABLE_HEADERS_SUPPLIER[4]}
                                required
                                placeholder=" "
                                value={form_supplier.telefono || ""}
                                onChange={(value) => updateField("telefono", value)}
                            />
                            <AddProductTextField
                                label={TABLE_HEADERS_SUPPLIER[5]}
                                required
                                placeholder=" "
                                value={form_supplier.categoria || ""}
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
                            Actualizar Proveedor
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}