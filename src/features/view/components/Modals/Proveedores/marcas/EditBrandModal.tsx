"use client";

import { useState } from "react";
import { AddProductCloseIcon } from "../../../Icons/AddCloseIcon";
import { EditBrandModalProps } from "@/lib/types/components/General/modals";
import { createBrandFormStateFromBrand } from "@/lib/mapping/mapping_marcas";
import { BrandFormstate } from "@/lib/types/supabase/brand.types";
import { useProveedores } from "@/features/view/hooks/services/useRealtimeProveedores";
import { useSupplierSelectionHandlers } from "@/features/view/hooks/modals/proveedores/useSupplierSelectionHandlers";
import {
    applySelectedSuppliersToBrand,
    selectedSuppliersFromBrand,
} from "@/lib/utils/helpers/modals/supplierOptions";
import { General_info_Brand } from "@/features/view/sub_components/M1/refactor_proveedores/General_info_Brand";
import { Selectors_Brand } from "@/features/view/sub_components/M1/refactor_proveedores/Selectors_Brand";
import { Tables_Brand } from "@/features/view/sub_components/M1/refactor_proveedores/Tables_Brand";

export default function EditBrandModal({ existingBrand, onUpdateBrand, onClose }: EditBrandModalProps) {
    const { supplier } = useProveedores();
    const [form_brand, setForm_brand] = useState<BrandFormstate>(createBrandFormStateFromBrand(existingBrand));
    const {
        selectedSupplierByRow,
        selectedSupplierTable,
        setSelectedSupplierTable,
        supplierOptions,
        handleSupplierChange,
        handleAddSupplier,
    } = useSupplierSelectionHandlers({
        supplier,
        brandCategoria: form_brand.categoria,
        initialSelected: selectedSuppliersFromBrand(existingBrand, supplier),
    });

    function updateField<K extends keyof BrandFormstate>(field: K, value: BrandFormstate[K]) {
        setForm_brand((current) => ({ ...current, [field]: value }));
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        onUpdateBrand(applySelectedSuppliersToBrand(form_brand, selectedSupplierTable));
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
            <div className="max-h-[95vh] w-full max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                    <h2 className="text-2xl font-bold text-slate-900">Editar marca</h2>
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
                    <General_info_Brand form={form_brand} updateField={updateField} />
                    <Selectors_Brand
                        selectedSupplierByRow={selectedSupplierByRow}
                        supplierOptions={supplierOptions}
                        handleSupplierChange={handleSupplierChange}
                        handleAddSupplier={handleAddSupplier}
                    />
                    <Tables_Brand
                        selectedSupplierTable={selectedSupplierTable}
                        setSelectedSupplierTable={setSelectedSupplierTable}
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
                            Actualizar marca
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
