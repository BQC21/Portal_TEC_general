"use client";

import { AddProductCloseIcon } from "@/features/view/components/Icons/AddCloseIcon";
import { AddProductReadonlyField } from "@/features/view/components/Form_fields/AddReadonlyField";
import { DeleteEquipoModalProps } from "@/lib/types/components/modals";

export function DeleteEquipoModal({ equipo, onDeleteEquipo, onClose }: DeleteEquipoModalProps) {

    // Aceptar actualizacion
    async function handleDeleteProduct(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        await onDeleteEquipo(String(equipo.id));
        onClose();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
            <div className="max-h-[95vh] w-full max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                <h2 className="text-2xl font-bold text-slate-900">Eliminar Equipo</h2>
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
                    ¿Está seguro que desea eliminar el siguiente equipo?
                </p>
            </div>
            <form onSubmit={handleDeleteProduct} className="max-h-[calc(95vh-88px)] overflow-y-auto px-6 py-6">
                <AddProductReadonlyField
                    label="Código del producto"
                    value={equipo.cod_producto}    
                />
                <AddProductReadonlyField
                    label="Descripción del producto"
                    value={equipo.descripcion} 
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
                        className="rounded-xl bg-indigo-700 px-6 py-3 text-lg font-semibold text-white transition hover:bg-indigo-800"
                    >
                        Eliminar Equipo
                    </button>
                </div>
            </form>
            </div>
        </div>
    );
}