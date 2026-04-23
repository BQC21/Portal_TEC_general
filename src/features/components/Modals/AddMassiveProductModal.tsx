"use client";

import { AddProductCloseIcon } from "../Icons/AddProductCloseIcon";
import { ProductFormData } from "@/lib/types/product-types";


// --- Tipo de variables ---
type AddMassiveProductModalProps = {
    onMassiveAddProduct: (products: ProductFormData[]) => Promise<void>;
    isMassiveUploading?: boolean;
    onClose: () => void;
};

export function AddMassiveProductModal({
    onMassiveAddProduct,
    isMassiveUploading = false,
    onClose,
}: AddMassiveProductModalProps) {

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
        <div className="max-h-[95vh] w-full max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <h2 className="text-2xl font-bold text-slate-900">Subida masiva de productos</h2>
            <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Cerrar modal"
            >
                <AddProductCloseIcon />
            </button>
            </div>

            <div className="mt-8 flex justify-end gap-4 border-t border-slate-200 pt-6">
                <button
                type="button"
                onClick={onClose}
                disabled={isMassiveUploading}
                className="rounded-xl border border-slate-300 px-6 py-3 text-lg font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                Cancelar
                </button>
                <button
                type="button"
                onClick={async () => {
                    await onMassiveAddProduct([]);
                }}
                disabled={isMassiveUploading}
                className="rounded-xl bg-indigo-700 px-6 py-3 text-lg font-semibold text-white transition hover:bg-indigo-800"
                >
                {isMassiveUploading ? "Subiendo..." : "Aceptar subida masiva"}
                </button>
            </div>
            </div>
        </div>
    );
}