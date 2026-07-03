"use client";

import { AddProductCloseIcon } from "@/features/view/components/Icons/AddCloseIcon";
import { AddProductReadonlyField } from "@/features/view/components/Form_fields/AddReadonlyField";
import { DeleteBrandModalProps } from "@/lib/types/components/modals";

export function DeleteBrandModal({ brand, onDeleteBrand, onClose }: DeleteBrandModalProps) {

    // Aceptar actualizacion
    async function handleDeleteZone(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        await onDeleteBrand(String(brand.id));
        onClose();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
            <div className="max-h-[95vh] w-full max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                <h2 className="text-2xl font-bold text-slate-900">Eliminar Marca</h2>
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                    aria-label="Cerrar modal"
                >
                    <AddProductCloseIcon />
                </button>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                <p className="text-lg text-slate-500">
                    ¿Está seguro que desea eliminar la siguiente marca?
                </p>
            </div>
            <form onSubmit={handleDeleteZone} className="max-h-[calc(95vh-88px)] overflow-y-auto px-6 py-6">
                <AddProductReadonlyField
                    label="Nombre del proveedor"
                    value={String(brand.nombre)} 
                />
                <AddProductReadonlyField
                    label="Categoría del proveedor"
                    value={String(brand.categoria)} 
                />
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
                        Eliminar Marca
                    </button>
                </div>
            </form>
            </div>
        </div>
    );
}