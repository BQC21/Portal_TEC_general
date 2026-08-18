"use client";

import { AddTypeModalProps } from "@/lib/types/components/General/modals";
import { INITIAL_TYPE_FORM } from "@/lib/utils/initialValues";
import { useState } from "react";
import { AddProductCloseIcon } from "../../../Icons/AddCloseIcon";
import { TypeFormstate } from "@/lib/types/supabase/type-types";
import { useBrands } from "@/features/view/hooks/services/useRealtimeMarcas";
import { useBrandSelectionHandlers } from "@/features/view/hooks/modals/proveedores/useBrandSelectionHandlers";
import { applySelectedBrandsToType } from "@/lib/utils/helpers/modals/brandOptions";
import { General_info_Type } from "@/features/view/sub_components/M1/refactor_proveedores/General_info_Type";
import { Selectors_Type } from "@/features/view/sub_components/M1/refactor_proveedores/Selectors_Type";
import { Tables_Type } from "@/features/view/sub_components/M1/refactor_proveedores/Tables_Type";

export default function AddTypeModal({ onAddType, onClose }: AddTypeModalProps) {
    const { brand } = useBrands();
    const [form_type, setForm_type] = useState<TypeFormstate>(INITIAL_TYPE_FORM);
    const {
        selectedBrandByRow,
        selectedBrandTable,
        setSelectedBrandTable,
        brandOptions,
        handleBrandChange,
        handleAddBrand,
    } = useBrandSelectionHandlers({
        brand,
        typeCategoria: form_type.categoria,
    });

    function updateField<K extends keyof TypeFormstate>(field: K, value: TypeFormstate[K]) {
        setForm_type((current) => ({ ...current, [field]: value }));
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        onAddType(applySelectedBrandsToType(form_type, selectedBrandTable));
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
            <div className="max-h-[95vh] w-full max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                    <h2 className="text-2xl font-bold text-slate-900">Añadir Nuevo tipo de producto</h2>
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
                    <General_info_Type form={form_type} updateField={updateField} />
                    <Selectors_Type
                        selectedBrandByRow={selectedBrandByRow}
                        brandOptions={brandOptions}
                        handleBrandChange={handleBrandChange}
                        handleAddBrand={handleAddBrand}
                    />
                    <Tables_Type
                        selectedBrandTable={selectedBrandTable}
                        setSelectedBrandTable={setSelectedBrandTable}
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
                            Añadir Tipo de producto
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
